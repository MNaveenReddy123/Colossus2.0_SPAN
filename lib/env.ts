// Utility function to safely access environment variables
export const env = {
  NEXT_PUBLIC_HF_TOKEN: process.env.NEXT_PUBLIC_HF_TOKEN || '',
}

export const getEnv = (key: string, defaultValue = ""): string => {
  const value = process.env[key]
  if (!value) {
    console.warn(`Environment variable ${key} is not set, using default value`)
    return defaultValue
  }
  return value
}

// Function to check if all required environment variables are set
export const checkRequiredEnvVars = (): boolean => {
  const requiredVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]

  const missingVars = requiredVars.filter((key) => !process.env[key])

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(", ")}`)
    return false
  }

  return true
}
