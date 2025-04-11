import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { checkSupabaseConfig } from "@/lib/supabase"
import { Toaster } from "@/components/ui/toaster"
import { Chatbot } from "@/components/ui/chatbot"

const inter = Inter({ subsets: ["latin"] })

// Debug environment variables
console.log("Environment variables check:", {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Not set",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Not set",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Not set",
  },
  supabase: checkSupabaseConfig(),
})

export const metadata: Metadata = {
  title: "FinPlay - Financial Literacy for Gen Z",
  description: "Learn financial literacy through interactive gameplay and simulations",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
            <Chatbot />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
