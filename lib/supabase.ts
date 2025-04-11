import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the browser
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    // Return a minimal client that will fail gracefully
    return createClient("https://placeholder-url.supabase.co", "placeholder-key", {
      auth: {
        persistSession: false,
      },
    })
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance for client-side
let browserClient: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Create a server client (to be used in Server Components and Server Actions)
export const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase URL or Service Role Key is missing")
    // Return a minimal client that will fail gracefully
    return createClient("https://placeholder-url.supabase.co", "placeholder-key", {
      auth: {
        persistSession: false,
      },
    })
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Debug function to check Supabase configuration
export const checkSupabaseConfig = () => {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
    serviceKey:
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not set",
  }
}

// Add a function to check if the users table exists and create it if it doesn't
export const ensureUsersTableExists = async () => {
  const supabase = getSupabaseServerClient()

  try {
    // Check if the users table exists
    const { data, error } = await supabase.from("users").select("id").limit(1)

    if (error && error.code === "42P01") {
      // Table doesn't exist, create it
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          avatar INTEGER NOT NULL,
          level TEXT NOT NULL,
          xp INTEGER DEFAULT 0,
          coins INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `

      const { error: createError } = await supabase.rpc("exec", { query: createTableQuery })

      if (createError) {
        console.error("Error creating users table:", createError)
        return { success: false, error: createError }
      }

      return { success: true, message: "Users table created successfully" }
    }

    return { success: true, message: "Users table already exists" }
  } catch (error) {
    console.error("Error checking/creating users table:", error)
    return { success: false, error }
  }
}
