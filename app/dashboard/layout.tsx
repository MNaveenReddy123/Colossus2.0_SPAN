"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  BarChart3,
  Gamepad2,
  BookOpen,
  Trophy,
  Wallet,
  Settings,
  LogOut,
  User,
  Loader2,
  AlignHorizontalDistributeCenter,
  FileQuestion,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "@/app/dashboard/chatbot/page";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, userData, loading, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      setError("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const refreshUserData = useCallback(async () => {
    if (!user) return;

    try {
      const data = await fetchUserData(user.uid);
      if (data) {
        // User data is managed by useAuth context
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    refreshUserData();
  }, [user, refreshUserData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0A192F] to-[#0A6C74]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
          <p className="text-sm text-[#F5F7FA]">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0A192F] to-[#0A6C74] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-4"
        >
          <Alert variant="destructive" className="bg-red-500/20 border-red-500 text-[#F5F7FA]">
            <AlertTitle>Error loading user data</AlertTitle>
            <AlertDescription>
              We're having trouble loading your profile information. This could be due to a temporary issue or rate
              limiting.
            </AlertDescription>
          </Alert>
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/20"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
            <Button
              variant="destructive"
              className="bg-red-500/80 hover:bg-red-500 text-[#F5F7FA]"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const level = Math.floor(userData.xp / 100) + 1;
  const currentLevelXp = userData.xp - (level - 1) * 100;
  const xpProgress = (currentLevelXp / 100) * 100;

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen bg-gradient-to-br from-[#0A192F] to-[#0A6C74] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/fintech-bg.png')] bg-cover opacity-20 animate-pulse-slow" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 to-transparent" />
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Sidebar className="bg-[#0A192F]/70 backdrop-blur-md border-r border-[#0A6C74]/50 text-[#F5F7FA]">
            <SidebarHeader className="flex items-center px-4 py-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <motion.div
                  className="rounded-full bg-[#FFD700]/10 p-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Wallet className="h-6 w-6 text-[#FFD700]" />
                </motion.div>
                <span className="text-xl font-bold text-[#F5F7FA]">FinZ</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-[#6B7280] px-4">Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[
                      { href: "/dashboard", icon: <Home className="h-4 w-4" />, label: "Dashboard" },
                      { href: "/dashboard/learning", icon: <BookOpen className="h-4 w-4" />, label: "Learning" },
                      {
                        href: "/dashboard/simulations",
                        icon: <AlignHorizontalDistributeCenter className="h-4 w-4" />,
                        label: "Simulations",
                      },
                      { href: "/dashboard/games", icon: <Gamepad2 className="h-4 w-4" />, label: "Mini-Games" },
                      { href: "/dashboard/quizzes", icon: <FileQuestion className="h-4 w-4" />, label: "Quizzes" },
                      { href: "/dashboard/progress", icon: <BarChart3 className="h-4 w-4" />, label: "Progress" },
                      { href: "/dashboard/leaderboard", icon: <Trophy className="h-4 w-4" />, label: "Leaderboard" },
                    ].map((item, idx) => (
                      <SidebarMenuItem key={idx}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                asChild
                                className="text-[#F5F7FA] hover:bg-[#0A6C74]/50 hover:text-[#FFD700] rounded-lg transition-colors"
                              >
                                <Link href={item.href}>
                                  {item.icon}
                                  <span>{item.label}</span>
                                </Link>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{item.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="text-[#6B7280] px-4">Account</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[
                      { href: "/dashboard/wallet", icon: <Wallet className="h-4 w-4" />, label: "Wallet" },
                      { href: "/dashboard/settings", icon: <Settings className="h-4 w-4" />, label: "Settings" },
                    ].map((item, idx) => (
                      <SidebarMenuItem key={idx}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                asChild
                                className="text-[#F5F7FA] hover:bg-[#0A6C74]/50 hover:text-[#FFD700] rounded-lg transition-colors"
                              >
                                <Link href={item.href}>
                                  {item.icon}
                                  <span>{item.label}</span>
                                </Link>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{item.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-[#0A6C74]/50 p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Avatar className="ring-2 ring-[#FFD700]/50">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={userData.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4 text-[#FFD700]" />
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    className="absolute -top-1 -right-1 h-3 w-3 bg-[#FFD700] rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-[#F5F7FA]">{userData.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-[#6B7280]">
                      Level {level} • {userData.xp} XP
                    </span>
                    <span className="text-xs text-[#FFD700] font-medium">• {userData.coins} Coins</span>
                  </div>
                  <div className="mt-1 h-1 bg-[#6B7280]/50 rounded-full">
                    <motion.div
                      className="h-full bg-[#FFD700] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="text-[#F5F7FA] hover:bg-[#FFD700]/20 hover:text-[#FFD700]"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        <span className="sr-only">Log out</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sign out of your account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
              {error && (
                <Alert variant="destructive" className="mt-2 bg-red-500/20 border-red-500 text-[#F5F7FA]">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </SidebarFooter>
          </Sidebar>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 relative"
        >
          {children}
        </motion.div>

        {/* Chatbot Toggle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Link href="/dashboard/chatbot">
            <Button
              className="bg-[#FFD700] text-[#0A192F] hover:bg-[#FFD700]/80 rounded-full p-3 shadow-lg"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {/* <span className="sr-only">Open Chatbot</span> */}
            </Button>
          </Link>
        </motion.div>
      </div>
    </SidebarProvider>
  );
}

async function fetchUserData(uid: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    console.error("Supabase client not initialized");
    return null;
  }

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", uid).single();

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    return null;
  }
}