"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Gamepad2,
  Trophy,
  Wallet,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getUserActivities } from "@/actions/user-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Suggestions from "@/components/ui/suggestions";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { userData, refreshUserData } = useAuth();
  interface Activity {
    id: string;
    activity_type: "quiz" | "game" | "simulation";
    activity_name: string;
    score: number;
    xp_earned: number;
    coins_earned: number;
    created_at: string;
  }

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardHover = {
    hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const fetchActivities = async () => {
      if (userData) {
        setLoading(true);
        setError(null);
        try {
          const result = await getUserActivities(userData.id);
          if (result.success) {
            setActivities(result.data || []);
          } else {
            console.error("Error fetching activities:", result.error);
            setError("Could not load activity data. Using default values.");
          }
        } catch (error) {
          console.error("Error fetching activities:", error);
          setError("An unexpected error occurred. Using default values.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchActivities();
  }, [userData]);

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const level = Math.floor(userData.xp / 100) + 1;
  const xpForNextLevel = level * 100;
  const currentLevelXp = userData.xp - (level - 1) * 100;
  const xpProgress = (currentLevelXp / 100) * 100;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="flex flex-col min-h-screen bg-background text-foreground"
    >
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-4">
        <div className="flex items-center justify-between space-y-2">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-extrabold tracking-tight"
          >
            Dashboard
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <Button variant="default" className="bg-primary hover:bg-primary/90 text-white">
              <Wallet className="mr-2 h-4 w-4" />
              <span>{userData.coins} Coins</span>
            </Button>
          </motion.div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/20 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:text-primary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-background data-[state=active]:text-primary">
              Activities
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-background data-[state=active]:text-primary">
              Achievements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <motion.div variants={staggerChildren} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <motion.div variants={fadeIn} whileHover="hover">
                <Card className="bg-card border-muted shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold">Current Level</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold text-primary">Level {level}</div>
                    <p className="text-xs text-muted-foreground">{userData.level}</p>
                    <Progress value={xpProgress} className="mt-2 h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground text-center">
                      {currentLevelXp}/{100} XP to Level {level + 1}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} whileHover="hover">
                <Card className="bg-card border-muted shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold">Wallet Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{userData.coins} Coins</div>
                    <p className="text-xs text-muted-foreground text-center">
                      {activities.length > 0 && activities[0]?.coins_earned
                        ? `+${activities[0].coins_earned} earned recently`
                        : "Start activities to earn coins"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} whileHover="hover">
                <Card className="bg-card border-muted shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold">Total XP</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{userData.xp}</div>
                    <p className="text-xs text-muted-foreground text-center">
                      {activities.length > 0 && activities[0]?.xp_earned
                        ? `+${activities[0].xp_earned} earned recently`
                        : "Complete activities to earn XP"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} whileHover="hover">
                <Card className="bg-card border-muted shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold">Activities Completed</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{activities.length}</div>
                    <p className="text-xs text-muted-foreground text-center">Keep going to improve your rank!</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            <motion.div variants={staggerChildren} className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <motion.div variants={fadeIn} whileHover="hover" className="col-span-4">
                <Card className="bg-card border-muted shadow-md">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading activities...</span>
                      </div>
                    ) : activities.length === 0 ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        No activities yet. Start playing games, taking quizzes, or trying simulations!
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activities.slice(0, 3).map((activity) => (
                          <motion.div
                            key={activity.id}
                            variants={fadeIn}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="rounded-full bg-primary/10 p-2">
                                {activity.activity_type === "quiz" && <BookOpen className="h-5 w-5 text-primary" />}
                                {activity.activity_type === "game" && <Gamepad2 className="h-5 w-5 text-primary" />}
                                {activity.activity_type === "simulation" && <BookOpen className="h-5 w-5 text-primary" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground line-clamp-1">
                                  {activity.activity_type === "quiz" && "Completed "}
                                  {activity.activity_type === "game" && "Played "}
                                  {activity.activity_type === "simulation" && "Completed "}
                                  "{activity.activity_name}"
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  Score: {activity.score} • +{activity.xp_earned} XP • +{activity.coins_earned} Coins
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground text-right min-w-[100px]">
                              {new Date(activity.created_at).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              <Suggestions />
            </motion.div>
          </TabsContent>
          <TabsContent value="activities" className="space-y-6">
            <motion.div variants={staggerChildren} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div variants={fadeIn} whileHover="hover">
                <Card className="bg-card border-muted shadow-md">
                  <CardHeader>
                    <CardTitle>Simulations</CardTitle>
                    <CardDescription>Interactive financial scenarios</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground">Budgeting Basics</h4>
                          <Badge variant="outline" className="text-xs">
                            Available
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Learn to create and manage a monthly budget
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> 15 min
                          </div>
                          <Link href="/dashboard/simulations/budgeting">
                            <Button variant="outline" size="sm" className="hover:bg-primary/10">
                              Start
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard/simulations">
                      <Button variant="link" className="w-full text-primary hover:underline">
                        View All Simulations
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} whileHover="hover">
                <Card className="bg-card border-muted shadow-md">
                  <CardHeader>
                    <CardTitle>Mini-Games</CardTitle>
                    <CardDescription>Fun financial games</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground">Tax Rush</h4>
                          <Badge variant="outline" className="text-xs">
                            New
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Race against time to file taxes correctly
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Gamepad2 className="h-3 w-3" /> 10 min
                          </div>
                          <Link href="/dashboard/games/tax-rush">
                            <Button variant="outline" size="sm" className="hover:bg-primary/10">
                              Play
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard/games">
                      <Button variant="link" className="w-full text-primary hover:underline">
                        View All Games
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} whileHover="hover">
                <Card className="bg-card border-muted shadow-md">
                  <CardHeader>
                    <CardTitle>Quizzes</CardTitle>
                    <CardDescription>Test your knowledge</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground">Budgeting Basics</h4>
                          <Badge variant="outline" className="text-xs">
                            Available
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Test your budgeting knowledge
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" /> 5 min
                          </div>
                          <Link href="/dashboard/quizzes/budgeting">
                            <Button variant="outline" size="sm" className="hover:bg-primary/10">
                              Take Quiz
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard/quizzes">
                      <Button variant="link" className="w-full text-primary hover:underline">
                        View All Quizzes
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          <TabsContent value="achievements" className="space-y-6">
            <motion.div variants={fadeIn} whileHover="hover">
              <Card className="bg-card border-muted shadow-md">
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                  <CardDescription>Achievements you've earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    <motion.div variants={fadeIn} className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-xs font-medium">First Login</span>
                    </motion.div>
                    {userData.xp >= 100 && (
                      <motion.div variants={fadeIn} className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Level Up</span>
                      </motion.div>
                    )}
                    {activities.some((a) => a.activity_type === "quiz") && (
                      <motion.div variants={fadeIn} className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Quiz Taker</span>
                      </motion.div>
                    )}
                    {activities.some((a) => a.activity_type === "game") && (
                      <motion.div variants={fadeIn} className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <Gamepad2 className="h-8 w-8 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Game Player</span>
                      </motion.div>
                    )}
                    {userData.coins >= 100 && (
                      <motion.div variants={fadeIn} className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <Wallet className="h-8 w-8 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Saver</span>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/achievements">
                    <Button variant="outline" className="w-full hover:bg-primary/10">
                      View All Badges
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}