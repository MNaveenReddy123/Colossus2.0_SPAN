"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonHover = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Please check your credentials and try again.");
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-[#0A192F] to-[#0A6C74]">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/fintech-bg.png')] bg-cover opacity-20 animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 to-transparent" />
      </div>

      {/* Back Button */}
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 z-20">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
          <Button
            variant="ghost"
            className="text-[#F5F7FA] hover:bg-[#FFD700]/20 hover:text-[#FFD700] rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>
      </Link>

      {/* Main Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container relative z-10"
      >
        <Card className="w-full max-w-md bg-[#0A192F]/70 backdrop-blur-md border-[#0A6C74]/50 shadow-xl rounded-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-[#F5F7FA] bg-clip-text text-transparent bg-gradient-to-r from-[#F5F7FA] to-[#FFD700]">
              Welcome Back to FinZ
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Enter your credentials to dive into your financial journey
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
                  <Alert variant="destructive" className="mb-4 bg-red-500/20 border-red-500 text-[#F5F7FA]">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[#F5F7FA]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                    className="bg-[#0A192F]/50 border-[#0A6C74]/50 text-[#F5F7FA] focus:ring-[#FFD700] focus:border-[#FFD700] rounded-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-[#F5F7FA]">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                    className="bg-[#0A192F]/50 border-[#0A6C74]/50 text-[#F5F7FA] focus:ring-[#FFD700] focus:border-[#FFD700] rounded-lg"
                  />
                </div>
                <motion.div whileHover="hover" variants={buttonHover}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#0A6C74] text-[#0A192F] hover:opacity-90 rounded-full animate-pulse-subtle"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-[#0A192F]"
                          viewBox="0 0 24 24"
                        >
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
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-[#6B7280]">
              <Link
                href="/forgot-password"
                className="text-[#FFD700] hover:underline transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="text-center text-sm text-[#6B7280]">
              Don’t have an account?{" "}
              <Link href="/register" className="text-[#FFD700] hover:underline transition-colors">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}