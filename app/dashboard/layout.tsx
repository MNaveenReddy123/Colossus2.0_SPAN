"use client"

import type { ReactNode } from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, BarChart3, Gamepad2, BookOpen, Trophy, Wallet, Settings, LogOut, User, Loader2,AlignHorizontalDistributeCenter, FileQuestion } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import Chatbot from "@/app/dashboard/chatbot/page"


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, userData, loading, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      router.push("/")
    } catch (error: any) {
      console.error("Logout error:", error)
      setError("Failed to log out. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const refreshUserData = useCallback(async () => {
    if (!user) return

    try {
      const data = await fetchUserData(user.uid)
      if (data) {
        // setUserData(data) // Removed setUserData since we're using the one from useAuth()
      }
    } catch (err) {
      console.error("Error refreshing user data:", err)
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    // Initial refresh only
    refreshUserData()

    // Only refresh if needed (e.g., after important actions)
    // Removed automatic refresh interval to prevent unnecessary requests
  }, [user, refreshUserData])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Handle the case where user is authenticated but userData is not available
  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Error loading user data</AlertTitle>
            <AlertDescription>
              We're having trouble loading your profile information. This could be due to a temporary issue or rate
              limiting.
            </AlertDescription>
          </Alert>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-1">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">FinPlay</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard">
                        <Home className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/learning">
                        <BookOpen className="h-4 w-4" />
                        <span>Learning</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/simulations">
                        <AlignHorizontalDistributeCenter className="h-4 w-4" />
                        <span>Simulations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/games">
                        <Gamepad2 className="h-4 w-4" />
                        <span>Mini-Games</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/quizzes">
                        <FileQuestion className="h-4 w-4" />
                        <span>Quizzes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/progress">
                        <BarChart3 className="h-4 w-4" />
                        <span>Progress</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/leaderboard">
                        <Trophy className="h-4 w-4" />
                        <span>Leaderboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/wallet">
                        <Wallet className="h-4 w-4" />
                        <span>Wallet</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={userData.name} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userData.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    Level {Math.floor(userData.xp / 100) + 1} • {userData.xp} XP
                  </span>
                  <span className="text-xs text-primary font-medium">• {userData.coins} Coins</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                <span className="sr-only">Log out</span>
              </Button>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SidebarProvider>
  )
}

async function fetchUserData(uid: string) {
  // Use the actual Supabase client to fetch user data
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return null
  }
  
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", uid).single()

    if (error) {
      console.error("Error fetching user data:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in fetchUserData:", error)
    return null
  }
}

