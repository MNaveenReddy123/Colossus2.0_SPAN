"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthChange, loginWithEmail, registerWithEmail, logoutUser } from "@/lib/firebase"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

type UserData = {
  id: string
  email: string
  name: string
  avatar: number
  level: string
  xp: number
  coins: number
}

type AuthContextType = {
  user: User | null
  userData: UserData | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, avatar: number, level: string) => Promise<void>
  logout: () => Promise<void>
  refreshUserData: () => Promise<void>
  updateUserCoins: (coinsEarned: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to add delay (for retry logic)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  const fetchUserData = async (uid: string, retryCount = 0): Promise<UserData | null> => {
    try {
      // Maximum retry attempts
      const maxRetries = 3

      // If we've exceeded max retries, return null
      if (retryCount > maxRetries) {
        console.error(`Exceeded maximum retry attempts (${maxRetries}) for fetching user data`)
        return null
      }

      console.log(`Fetching user data for uid: ${uid}, attempt: ${retryCount + 1}`)

      const response = await supabase.from("users").select("*").eq("id", uid).single()

      // Check for rate limiting or other errors
      if (response.error) {
        console.error("Supabase error fetching user data:", response.error)

        // If rate limited (429 status), retry with exponential backoff
        if (response.error.code === "429" || response.error.message?.includes("Too Many")) {
          const backoffTime = Math.pow(2, retryCount) * 1000 // Exponential backoff
          console.log(`Rate limited. Retrying in ${backoffTime}ms...`)
          await delay(backoffTime)
          return fetchUserData(uid, retryCount + 1)
        }

        return null
      }

      return response.data as UserData
    } catch (error: any) {
      console.error("Error fetching user data:", error)

      // If the error is related to parsing JSON (like the "Too Many Requests" error)
      if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
        console.log("Received non-JSON response, likely rate limited. Retrying...")

        // Retry with exponential backoff
        const backoffTime = Math.pow(2, retryCount) * 1000
        await delay(backoffTime)
        return fetchUserData(uid, retryCount + 1)
      }

      return null
    }
  }

  const refreshUserData = async () => {
    if (user) {
      try {
        const data = await fetchUserData(user.uid)
        if (data) {
          setUserData(data)
          return data
        } else {
          console.warn("Could not refresh user data - data is null")
          return null
        }
      } catch (error) {
        console.error("Error refreshing user data:", error)
        return null
      }
    }
    return null
  }

  useEffect(() => {
    let unsubscribe = () => {}

    try {
      unsubscribe = onAuthChange(async (authUser) => {
        setUser(authUser)

        if (authUser) {
          try {
            const data = await fetchUserData(authUser.uid)
            setUserData(data)
          } catch (error) {
            console.error("Error fetching user data during auth change:", error)
          }
        } else {
          setUserData(null)
        }

        setLoading(false)
      })
    } catch (err: any) {
      console.error("Auth initialization error:", err)
      setError(err.message || "Failed to initialize authentication")
      setLoading(false)
    }

    return () => unsubscribe()
  }, [])

  // Set up periodic refresh of user data
  useEffect(() => {
    if (!user) return

    const refreshInterval = setInterval(() => {
      refreshUserData().catch((err) => {
        console.error("Error in periodic refresh:", err)
      })
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(refreshInterval)
  }, [user])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const { user } = await loginWithEmail(email, password)
      const data = await fetchUserData(user.uid)
      setUserData(data)
    } catch (error: any) {
      console.error("Login error:", error)

      // Provide user-friendly error messages
      let errorMessage = "Login failed. Please check your credentials and try again."

      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password. Please try again."
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later or reset your password."
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled. Please contact support."
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const register = async (email: string, password: string, name: string, avatar: number, level: string) => {
    try {
      setError(null)

      // First register with Firebase
      const { user } = await registerWithEmail(email, password)
      console.log("Firebase user created successfully:", user.uid)

      // Prepare user data for Supabase
      const userData = {
        id: user.uid,
        email,
        name,
        avatar,
        level,
        xp: 0,
        coins: 500,
        created_at: new Date().toISOString(),
      }

      console.log("Attempting to create user in Supabase:", { ...userData, id: user.uid })

      // Check if Supabase client is properly initialized
      if (!supabase) {
        console.error("Supabase client is not initialized")
        // Clean up Firebase user if Supabase client is not available
        await user.delete()
        throw new Error("Database connection error. Please try again later.")
      }

      // Create user in Supabase with better error handling
      const { error: supabaseError, data: supabaseData } = await supabase.from("users").insert(userData)

      // Log detailed information about the response
      console.log("Supabase insert response:", {
        error: supabaseError ? JSON.stringify(supabaseError) : "none",
        data: supabaseData,
      })

      if (supabaseError) {
        console.error("Detailed Supabase error:", JSON.stringify(supabaseError))

        // If there's an error with Supabase, we should clean up the Firebase user
        try {
          await user.delete()
          console.log("Firebase user deleted after Supabase error")
        } catch (deleteError) {
          console.error("Error deleting Firebase user after Supabase error:", deleteError)
        }

        // Check for specific Supabase error types
        if (supabaseError.code === "23505") {
          throw new Error("This user already exists in our database.")
        } else if (supabaseError.code === "42P01") {
          throw new Error("Database table not found. Please contact support.")
        } else if (supabaseError.code === "23503") {
          throw new Error("Database constraint error. Please contact support.")
        } else if (supabaseError.code === "429" || supabaseError.message?.includes("Too Many")) {
          throw new Error("Too many requests. Please try again later.")
        }

        throw new Error(supabaseError.message || "Failed to create user in database")
      }

      console.log("User successfully created in Supabase")

      // Fetch the newly created user data
      const newUserData = await fetchUserData(user.uid)
      setUserData(newUserData)

      return { user, userData: newUserData }
    } catch (error: any) {
      console.error("Registration error:", error)

      // Provide user-friendly error messages for common Firebase auth errors
      let errorMessage = "Registration failed. Please try again."

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please log in instead or use a different email."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please check and try again."
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await logoutUser()
      setUserData(null)
    } catch (error: any) {
      console.error("Logout error:", error)
      setError(error.message || "Logout failed")
      throw error
    }
  }

  // Add a new function to update user coins directly in the context
  const updateUserCoins = async (coinsEarned: number) => {
    if (!user || !userData) return

    try {
      // Update local state immediately for a responsive UI
      const newCoins = userData.coins + coinsEarned
      setUserData((prev) => (prev ? { ...prev, coins: newCoins } : null))

      // Show toast notification
      toast({
        title: `${coinsEarned > 0 ? "+" : ""}${coinsEarned} Coins`,
        description: coinsEarned > 0 ? "Coins added to your wallet!" : "Coins deducted from your wallet",
        variant: coinsEarned > 0 ? "default" : "destructive",
      })

      // Update in database
      const { error } = await supabase.from("users").update({ coins: newCoins }).eq("id", user.uid)

      if (error) {
        console.error("Error updating coins:", error)
        // Revert the local update if database update fails
        setUserData((prev) => (prev ? { ...prev, coins: prev.coins - coinsEarned } : null))
        throw error
      }
    } catch (error) {
      console.error("Failed to update coins:", error)
      throw error
    }
  }

  // Add this to the context value
  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        error,
        login,
        register,
        logout,
        refreshUserData,
        updateUserCoins,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
