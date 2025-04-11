"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, AlertCircle, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { checkSupabaseConfig } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: 1,
    level: "beginner",
  })
  const [error, setError] = useState<string | null>(null)
  const [isExistingUser, setIsExistingUser] = useState(false)
  const [configStatus, setConfigStatus] = useState<any>(null)

  // Check Supabase configuration on component mount
  useEffect(() => {
    const config = checkSupabaseConfig()
    setConfigStatus(config)
    console.log("Supabase configuration:", config)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Reset error state when user changes input
    if (error) {
      setError(null)
      setIsExistingUser(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsExistingUser(false)

    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      setIsLoading(true)
      try {
        // Log environment variables status (without revealing values)
        console.log("Environment check before registration:", {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
          supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
          firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set",
        })

        await register(formData.email, formData.password, formData.name, formData.avatar, formData.level)
        router.push("/dashboard")
      } catch (error: any) {
        console.error("Registration error in component:", error)
        const errorMessage = error.message || "An error occurred during registration."
        setError(errorMessage)

        // Check if the error is about existing email
        if (errorMessage.includes("already registered") || errorMessage.includes("already in use")) {
          setIsExistingUser(true)
        }

        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const avatars = [1, 2, 3, 4, 5, 6]

  // Show configuration error if Supabase is not properly configured
  if (configStatus && (configStatus.url === "Not set" || configStatus.anonKey === "Not set")) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Configuration Error</CardTitle>
            <CardDescription>
              The application is not properly configured. Please check the environment variables.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Configuration</AlertTitle>
              <AlertDescription>
                <p>The following configuration is missing:</p>
                <ul className="mt-2 list-disc pl-5">
                  {configStatus.url === "Not set" && <li>Supabase URL</li>}
                  {configStatus.anonKey === "Not set" && <li>Supabase Anon Key</li>}
                </ul>
                <p className="mt-2">Please contact the administrator to resolve this issue.</p>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            {step === 1 && "Enter your information to create an account"}
            {step === 2 && "Choose your avatar"}
            {step === 3 && "Select your financial literacy level"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                {isExistingUser && (
                  <div className="mt-2">
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="mt-2">
                        <LogIn className="mr-2 h-4 w-4" />
                        Go to Login
                      </Button>
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  {avatars.map((avatar) => (
                    <div
                      key={avatar}
                      className={`cursor-pointer rounded-lg p-2 ${
                        formData.avatar === avatar ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, avatar }))}
                    >
                      <div className="flex h-20 w-full items-center justify-center rounded-md bg-muted">
                        <User className="h-10 w-10" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4">
                <Tabs
                  defaultValue="beginner"
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, level: value }))}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="beginner">Beginner</TabsTrigger>
                    <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  <TabsContent value="beginner" className="mt-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Beginner Level</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        New to financial concepts. Learn the basics of budgeting, saving, and spending.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="intermediate" className="mt-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Intermediate Level</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Familiar with basics. Learn about investing, credit, and financial planning.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="advanced" className="mt-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Advanced Level</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Experienced with finances. Learn about complex investments, tax strategies, and wealth building.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Complete Setup"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
