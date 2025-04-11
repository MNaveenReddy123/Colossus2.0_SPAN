"use server"

import { getSupabaseServerClient } from "@/lib/supabase"

// Function to ensure the activities table exists
export async function ensureActivitiesTableExists() {
  const supabase = getSupabaseServerClient()

  try {
    // Check if the activities table exists by attempting a simple query
    const { error } = await supabase.from("activities").select("id").limit(1)

    // If we get a specific error about the table not existing
    if (error && (error.code === "42P01" || error.message.includes("does not exist"))) {
      console.log("Activities table does not exist, creating it now...")

      // Create the activities table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS activities (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          activity_type TEXT NOT NULL,
          activity_name TEXT NOT NULL,
          score INTEGER NOT NULL,
          xp_earned INTEGER NOT NULL,
          coins_earned INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create index for faster queries
        CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
      `

      // Execute the query using RPC (if available) or raw SQL
      try {
        // Try using RPC first
        const { error: createError } = await supabase.rpc("exec", { query: createTableQuery })

        if (createError) {
          console.error("Error creating activities table via RPC:", createError)
          // If RPC fails, we can't create the table from the client side
          return { success: false, error: createError }
        }

        return { success: true, message: "Activities table created successfully" }
      } catch (rpcError) {
        console.error("RPC execution error:", rpcError)
        return { success: false, error: rpcError }
      }
    }

    return { success: true, message: "Activities table already exists" }
  } catch (error) {
    console.error("Error checking/creating activities table:", error)
    return { success: false, error }
  }
}

// Modify updateUserXpAndCoins to return the updated values
export async function updateUserXpAndCoins(userId: string, xpEarned: number, coinsEarned: number) {
  const supabase = getSupabaseServerClient()

  try {
    // First get current user data
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("xp, coins")
      .eq("id", userId)
      .single()

    if (fetchError) {
      console.error("Error fetching user data:", fetchError)
      throw fetchError
    }

    const newXp = userData.xp + xpEarned
    const newCoins = userData.coins + coinsEarned

    console.log(`Updating user ${userId}: XP ${userData.xp} -> ${newXp}, Coins ${userData.coins} -> ${newCoins}`)

    // Update user with new XP and coins
    const { error: updateError } = await supabase
      .from("users")
      .update({
        xp: newXp,
        coins: newCoins,
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Error updating user XP and coins:", updateError)
      throw updateError
    }

    return {
      success: true,
      updatedXp: newXp,
      updatedCoins: newCoins,
    }
  } catch (error) {
    console.error("Error updating user XP and coins:", error)
    return { success: false, error }
  }
}

// Modify the saveActivityProgress function to return the updated user data
export async function saveActivityProgress(
  userId: string,
  activityType: "quiz" | "game" | "simulation",
  activityName: string,
  score: number,
  xpEarned: number,
  coinsEarned: number,
) {
  const supabase = getSupabaseServerClient()

  try {
    // Ensure activities table exists
    await ensureActivitiesTableExists()

    // Save activity progress
    const { error: activityError } = await supabase.from("activities").insert({
      user_id: userId,
      activity_type: activityType,
      activity_name: activityName,
      score,
      xp_earned: xpEarned,
      coins_earned: coinsEarned,
    })

    if (activityError) {
      console.error("Error saving activity:", activityError)
      throw activityError
    }

    // Update user XP and coins
    const result = await updateUserXpAndCoins(userId, xpEarned, coinsEarned)

    if (!result.success) {
      console.error("Failed to update user data")
      throw new Error("Failed to update user data")
    }

    // Return the updated user data
    return {
      success: true,
      updatedCoins: result.updatedCoins,
      updatedXp: result.updatedXp,
    }
  } catch (error) {
    console.error("Error saving activity progress:", error)
    return { success: false, error }
  }
}

export async function getUserActivities(userId: string) {
  const supabase = getSupabaseServerClient()

  try {
    // Check if activities table exists first
    const tableCheck = await ensureActivitiesTableExists()

    // If we couldn't create the table, return empty activities
    if (!tableCheck.success) {
      console.warn("Activities table doesn't exist and couldn't be created. Returning empty activities.")
      return { success: true, data: [] }
    }

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      // If the table doesn't exist, return empty activities
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.warn("Activities table doesn't exist. Returning empty activities.")
        return { success: true, data: [] }
      }
      console.error("Error fetching activities:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user activities:", error)
    return { success: false, error, data: [] }
  }
}

// Updated getLeaderboardData function with better error handling and retry logic
export async function getLeaderboardData() {
  const supabase = getSupabaseServerClient()
  const maxRetries = 3
  let retries = 0

  // Helper function to add delay between retries
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  while (retries < maxRetries) {
    try {
      const { data, error, status } = await supabase
        .from("users")
        .select("id, name, avatar, level, xp, coins")
        .order("xp", { ascending: false })
        .limit(50)

      // Check for rate limiting or other errors
      if (error) {
        if (status === 429) {
          // Too Many Requests
          console.warn(`Rate limited (429). Retry ${retries + 1}/${maxRetries} after delay...`)
          await delay(Math.pow(2, retries) * 1000) // Exponential backoff
          retries++
          continue
        }

        console.error("Error fetching leaderboard data:", error)
        return {
          success: false,
          error,
          data: [],
        }
      }

      // If we got here, the request was successful
      return {
        success: true,
        data: data || [],
      }
    } catch (error: any) {
      // Handle non-Supabase errors (like network issues)
      console.error("Exception fetching leaderboard data:", error)

      // If it's a rate limit error or network error, retry
      if (
        error.message?.includes("Too Many Requests") ||
        error.message?.includes("network") ||
        error.message?.includes("timeout")
      ) {
        if (retries < maxRetries - 1) {
          console.warn(`Error occurred. Retry ${retries + 1}/${maxRetries} after delay...`)
          await delay(Math.pow(2, retries) * 1000)
          retries++
          continue
        }
      }

      // Return error after all retries or for non-retryable errors
      return {
        success: false,
        error,
        data: [],
      }
    }
  }

  // If we've exhausted all retries
  return {
    success: false,
    error: new Error("Maximum retry attempts reached"),
    data: [],
  }
}

// Add a function to get recent transactions for a user
export async function getUserTransactions(userId: string, limit = 10) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching user transactions:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user transactions:", error)
    return { success: false, error, data: [] }
  }
}
