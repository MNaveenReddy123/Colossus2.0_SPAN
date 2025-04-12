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
import { ArrowLeft, AlertCircle, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { checkSupabaseConfig } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const slideIn = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
  }

  const buttonHover = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  useEffect(() => {
    const config = checkSupabaseConfig()
    setConfigStatus(config)
    console.log("Supabase configuration:", config)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

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

  if (configStatus && (configStatus.url === "Not set" || configStatus.anonKey === "Not set")) {
    return (
      <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white">
        <div className="absolute inset-0 bg-[url('/fintech-bg.png')] bg-cover opacity-5 animate-pulse-slow" />
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="container relative z-10">
          <Card className="w-full max-w-md bg-white border-gray-200 shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-black bg-clip-text text-transparent bg-gradient-to-r from-black to-green-600">
                Configuration Error
              </CardTitle>
              <CardDescription className="text-gray-500">
                The application is not properly configured. Please check the environment variables.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="bg-red-50 border-red-500 text-red-800">
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
                <motion.div whileHover="hover" variants={buttonHover}>
                  <Button variant="outline" className="w-full border-black text-black hover:bg-black/5 rounded-full">
                    Return to Home
                  </Button>
                </motion.div>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/fintech-bg.png')] bg-cover opacity-5 animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      {/* Back Button */}
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 z-20">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
          <Button variant="ghost" className="text-black hover:bg-green-100 hover:text-green-600 rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>
      </Link>

      {/* Main Card */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="container relative z-10">
        <Card className="w-full max-w-md bg-white border-gray-200 shadow-xl rounded-xl overflow-hidden">
          <CardHeader>
            <motion.div
              className="flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-black bg-clip-text text-transparent bg-gradient-to-r from-black to-green-600">
                Join FinZ
              </CardTitle>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    className={`h-2 w-2 rounded-full ${s <= step ? "bg-green-600" : "bg-gray-300"}`}
                    animate={{ scale: s === step ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
            <CardDescription className="text-gray-500">
              {step === 1 && "Let's get started with your details"}
              {step === 2 && "Pick your unique avatar"}
              {step === 3 && "Choose your financial skill level"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-4 bg-red-50 border-red-500 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                      {isExistingUser && (
                        <div className="mt-2">
                          <Link href="/login">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 border-black text-black hover:bg-black/5"
                            >
                              <LogIn className="mr-2 h-4 w-4" />
                              Go to Login
                            </Button>
                          </Link>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={slideIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid gap-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-black">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white border-gray-300 text-black focus:ring-green-600 focus:border-green-600 rounded-lg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-black">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white border-gray-300 text-black focus:ring-green-600 focus:border-green-600 rounded-lg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-black">
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="bg-white border-gray-300 text-black focus:ring-green-600 focus:border-green-600 rounded-lg"
                      />
                      <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                    </div>
                    <motion.div whileHover="hover" variants={buttonHover}>
                      <Button
                        type="submit"
                        className="w-full bg-black text-white hover:bg-black/90 rounded-full animate-pulse-subtle"
                      >
                        Continue
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={slideIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid gap-4"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {avatars.map((avatar) => (
                        <motion.div
                          key={avatar}
                          className={`cursor-pointer rounded-lg p-2 transition-colors ${
                            formData.avatar === avatar ? "bg-green-100 ring-2 ring-green-600" : "hover:bg-gray-100"
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, avatar }))}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex h-20 w-full items-center justify-center rounded-md bg-gray-50">
                            {avatar === 1 && (
                              <svg className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" fill="currentColor" />
                                <path d="M12 12c-4 0-7 2-7 5v2h14v-2c0-3-3-5-7-5z" fill="currentColor" opacity="0.8" />
                              </svg>
                            )}
                            {avatar === 2 && (
                              <svg className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M12 4a4 4 0 100 8 4 4 0 000-8z"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                />
                                <path
                                  d="M18 20c0-3-3-5-6-5s-6 2-6 5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}
                            {avatar === 3 && (
                              <svg className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none">
                                <rect x="8" y="4" width="8" height="6" rx="2" fill="currentColor" />
                                <path d="M5 14c0-2 2-4 7-4s7 2 7 4v2H5v-2z" fill="currentColor" opacity="0.8" />
                              </svg>
                            )}
                            {avatar === 4 && (
                              <svg className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path d="M16 14a4 4 0 00-8 0v3h8v-3z" fill="currentColor" opacity="0.8" />
                                <path d="M10 6h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                              </svg>
                            )}
                            {avatar === 5 && (
                              <svg className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M12 5a3 3 0 100 6 3 3 0 000-6z"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                />
                                <path
                                  d="M6 14c0-2 2-4 6-4s6 2 6 4"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  opacity="0.8"
                                />
                                <circle cx="12" cy="5" r="1" fill="currentColor" />
                              </svg>
                            )}
                            {avatar === 6 && (
                              <svg className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none">
                                <path d="M9 6h6v4H9z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                                <path d="M5 14c0-2 3-4 7-4s7 2 7 4v2H5v-2z" fill="currentColor" opacity="0.8" />
                              </svg>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div whileHover="hover" variants={buttonHover}>
                      <Button
                        type="submit"
                        className="w-full bg-black text-white hover:bg-black/90 rounded-full animate-pulse-subtle"
                      >
                        Continue
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={slideIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid gap-4"
                  >
                    <Tabs
                      defaultValue="beginner"
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, level: value }))}
                    >
                      <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-full p-1">
                        {["beginner", "intermediate", "advanced"].map((level) => (
                          <TabsTrigger
                            key={level}
                            value={level}
                            className="rounded-full text-black data-[state=active]:bg-green-600 data-[state=active]:text-white"
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <TabsContent value="beginner" className="mt-4">
                        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                          <h3 className="font-medium text-black">Beginner Level</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            New to financial concepts. Learn the basics of budgeting, saving, and spending.
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="intermediate" className="mt-4">
                        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                          <h3 className="font-medium text-black">Intermediate Level</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Familiar with basics. Learn about investing, credit, and financial planning.
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="advanced" className="mt-4">
                        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                          <h3 className="font-medium text-black">Advanced Level</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Experienced with finances. Learn about complex investments, tax strategies, and wealth
                            building.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                    <motion.div whileHover="hover" variants={buttonHover}>
                      <Button
                        type="submit"
                        className="w-full bg-black text-white hover:bg-black/90 rounded-full animate-pulse-subtle"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                              />
                            </svg>
                            Creating Account...
                          </>
                        ) : (
                          "Complete Setup"
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
