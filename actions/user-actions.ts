"use server";

import { getSupabaseServerClient } from "@/lib/supabase";

// Function to ensure the activities table exists
export async function ensureActivitiesTableExists() {
  const supabase = getSupabaseServerClient();

  try {
    const { error } = await supabase.from("activities").select("id").limit(1);

    if (error && (error.code === "42P01" || error.message.includes("does not exist"))) {
      console.log("Activities table does not exist, creating it now...");

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
        CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
      `;

      try {
        const { error: createError } = await supabase.rpc("exec", { query: createTableQuery });
        if (createError) {
          console.error("Error creating activities table via RPC:", createError);
          return { success: false, error: createError };
        }
        return { success: true, message: "Activities table created successfully" };
      } catch (rpcError) {
        console.error("RPC execution error:", rpcError);
        return { success: false, error: rpcError };
      }
    }
    return { success: true, message: "Activities table already exists" };
  } catch (error) {
    console.error("Error checking/creating activities table:", error);
    return { success: false, error };
  }
}

// Update user XP and coins
export async function updateUserXpAndCoins(userId: string, xpEarned: number, coinsEarned: number) {
  const supabase = getSupabaseServerClient();

  try {
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("xp, coins")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user data:", fetchError);
      throw fetchError;
    }

    const newXp = userData.xp + xpEarned;
    const newCoins = userData.coins + coinsEarned;

    console.log(`Updating user ${userId}: XP ${userData.xp} -> ${newXp}, Coins ${userData.coins} -> ${newCoins}`);

    const { error: updateError } = await supabase
      .from("users")
      .update({ xp: newXp, coins: newCoins })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user XP and coins:", updateError);
      throw updateError;
    }

    return { success: true, updatedXp: newXp, updatedCoins: newCoins };
  } catch (error) {
    console.error("Error updating user XP and coins:", error);
    return { success: false, error };
  }
}

// Save activity progress
export async function saveActivityProgress(
  userId: string,
  activityType: "quiz" | "game" | "simulation",
  activityName: string,
  score: number,
  xpEarned: number,
  coinsEarned: number
) {
  const supabase = getSupabaseServerClient();

  try {
    await ensureActivitiesTableExists();

    const { error: activityError } = await supabase.from("activities").insert({
      user_id: userId,
      activity_type: activityType,
      activity_name: activityName,
      score,
      xp_earned: xpEarned,
      coins_earned: coinsEarned,
    });

    if (activityError) {
      console.error("Error saving activity:", activityError);
      throw activityError;
    }

    const result = await updateUserXpAndCoins(userId, xpEarned, coinsEarned);
    if (!result.success) {
      throw new Error("Failed to update user data");
    }

    return { success: true, updatedCoins: result.updatedCoins, updatedXp: result.updatedXp };
  } catch (error) {
    console.error("Error saving activity progress:", error);
    return { success: false, error };
  }
}

// Get user activities (renamed from getUserActivities for consistency)
export async function getUserTransactions(userId: string, limit = 20) {
  const supabase = getSupabaseServerClient();

  try {
    const tableCheck = await ensureActivitiesTableExists();
    if (!tableCheck.success) {
      console.warn("Activities table doesn't exist and couldn't be created. Returning empty activities.");
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.warn("Activities table doesn't exist. Returning empty activities.");
        return { success: true, data: [] };
      }
      console.error("Error fetching activities:", error);
      throw error;
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return { success: false, error, data: [] };
  }
}
export async function getUserActivities(userId: string, limit = 20) {
  const supabase = getSupabaseServerClient();

  try {
    const tableCheck = await ensureActivitiesTableExists();
    if (!tableCheck.success) {
      console.warn("Activities table doesn't exist and couldn't be created. Returning empty activities.");
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.warn("Activities table doesn't exist. Returning empty activities.");
        return { success: true, data: [] };
      }
      console.error("Error fetching activities:", error);
      throw error;
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return { success: false, error, data: [] };
  }
}

// actions/user-actions.ts (partial update)
export async function getUserSuggestions(userId: string) {
  const supabase = getSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user activities for suggestions:", error);
      return { success: false, error, data: [] };
    }

    const activities = data || [];

    // Summarize user activity
    const activitySummary: Record<
      string,
      { count: number; totalScore: number; totalXP: number; totalCoins: number; maxScore: number; lastPlayed: string }
    > = activities.reduce((acc, curr) => {
      const key = `${curr.activity_type}-${curr.activity_name}`;
      if (!acc[key]) {
        acc[key] = { count: 0, totalScore: 0, totalXP: 0, totalCoins: 0, maxScore: 0, lastPlayed: curr.created_at };
      }
      acc[key].count += 1;
      acc[key].totalScore += curr.score;
      acc[key].totalXP += curr.xp_earned;
      acc[key].totalCoins += curr.coins_earned;
      acc[key].maxScore = Math.max(acc[key].maxScore, curr.score);
      acc[key].lastPlayed =
        new Date(curr.created_at) > new Date(acc[key].lastPlayed) ? curr.created_at : acc[key].lastPlayed;
      return acc;
    }, {});

    // Define available activities
    const availableActivities = [
      { type: "quiz", name: "Budgeting Basics", path: "/dashboard/quizzes/budgeting" },
      { type: "quiz", name: "Credit Score", path: "/dashboard/quizzes/credit-score" },
      { type: "quiz", name: "Investment", path: "/dashboard/quizzes/investment" },
      { type: "game", name: "Bank Vault Dash", path: "/dashboard/games/bank-vault-dash" },
      { type: "game", name: "Tax Rush", path: "/dashboard/games/tax-rush" },
      { type: "game", name: "Credit Score Adventure", path: "/dashboard/games/credit-score" },
      { type: "game", name: "Stock Market", path: "/dashboard/games/stock-market" },
      { type: "simulation", name: "Budgeting", path: "/dashboard/simulations/budgeting" },
    ];

    const playedActivities = Object.keys(activitySummary);
    const suggestions = [];

    // Default suggestions for new users (no activities)
    if (activities.length === 0) {
      const defaultSuggestions = [
        { type: "quiz", name: "Budgeting Basics", path: "/dashboard/quizzes/budgeting" },
        { type: "game", name: "Tax Rush", path: "/dashboard/games/tax-rush" },
        { type: "simulation", name: "Budgeting", path: "/dashboard/simulations/budgeting" },
      ];
      defaultSuggestions.forEach((s) => {
        suggestions.push({
          title: `Try ${s.name}`,
          description: `Kickstart your journey with this ${s.type}!`,
          type: s.type,
          name: s.name,
          path: s.path,
          action: "Start Now",
        });
      });
    } else {
      // Existing suggestion logic for users with activities
      for (const [key, stats] of Object.entries(activitySummary)) {
        const [type, name] = key.split("-");
        const avgScore = stats.totalScore / stats.count;
        if (avgScore < 20 && stats.count >= 2) {
          const path = availableActivities.find((a) => a.type === type && a.name === name)?.path || "";
          suggestions.push({
            title: `Boost Your ${name} Skills`,
            description: `Your average score (${Math.round(avgScore)}) in ${name} is low. Try it again to improve!`,
            type,
            name,
            path,
            action: "Play Again",
          });
        }
      }

      const unplayed = availableActivities.filter((act) => !playedActivities.includes(`${act.type}-${act.name}`));
      if (unplayed.length > 0) {
        const randomUnplayed = unplayed[Math.floor(Math.random() * unplayed.length)];
        suggestions.push({
          title: `Try ${randomUnplayed.name}`,
          description: `Explore a new ${randomUnplayed.type} to expand your financial skills!`,
          type: randomUnplayed.type,
          name: randomUnplayed.name,
          path: randomUnplayed.path,
          action: "Start Now",
        });
      }

      const highScoreActivity = Object.entries(activitySummary)
        .filter(([_, stats]) => stats.count > 1)
        .sort(([, a], [, b]) => b.maxScore - a.maxScore)[0];
      if (highScoreActivity) {
        const [key] = highScoreActivity;
        const stats = highScoreActivity[1];
        const [type, name] = key.split("-");
        const path = availableActivities.find((a) => a.type === type && a.name === name)?.path || "";
        suggestions.push({
          title: `Beat Your ${name} Record`,
          description: `Your high score is ${stats.maxScore}. Can you top it?`,
          type,
          name,
          path,
          action: "Challenge Yourself",
        });
      }
    }

    return { success: true, data: suggestions.slice(0, 3) };
  } catch (error) {
    console.error("Error generating user suggestions:", error);
    return { success: false, error, data: [] };
  }
}
// Get leaderboard data with retry logic
export async function getLeaderboardData() {
  const supabase = getSupabaseServerClient();
  const maxRetries = 3;
  let retries = 0;

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  while (retries < maxRetries) {
    try {
      const { data, error, status } = await supabase
        .from("users")
        .select("id, name, avatar, level, xp, coins")
        .order("xp", { ascending: false })
        .limit(50);

      if (error) {
        if (status === 429) {
          console.warn(`Rate limited (429). Retry ${retries + 1}/${maxRetries} after delay...`);
          await delay(Math.pow(2, retries) * 1000);
          retries++;
          continue;
        }
        console.error("Error fetching leaderboard data:", error);
        return { success: false, error, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error("Exception fetching leaderboard data:", error);
      if (
        error.message?.includes("Too Many Requests") ||
        error.message?.includes("network") ||
        error.message?.includes("timeout")
      ) {
        if (retries < maxRetries - 1) {
          console.warn(`Error occurred. Retry ${retries + 1}/${maxRetries} after delay...`);
          await delay(Math.pow(2, retries) * 1000);
          retries++;
          continue;
        }
      }
      return { success: false, error, data: [] };
    }
  }

  return { success: false, error: new Error("Maximum retry attempts reached"), data: [] };
}