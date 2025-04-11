"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserActivities } from "@/actions/user-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const { userData, refreshUserData } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchActivities = async () => {
      if (userData) {
        setLoading(true)
        setError(null)
        try {
          const result = await getUserActivities(userData.id)
          if (result.success) {
            setActivities(result.data || [])
          } else {
            console.error("Error fetching activities:", result.error)
            setError("Could not load activity data. Using default values.")
          }
        } catch (error) {
          console.error("Error fetching activities:", error)
          setError("An unexpected error occurred. Using default values.")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchActivities()

    // Try to refresh user data if needed
    if (userData && retryCount < 3) {
      refreshUserData().catch((err) => {
        console.error("Error refreshing user data:", err)
        setRetryCount((prev) => prev + 1)
      })
    }
  }, [userData, refreshUserData, retryCount])

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const level = Math.floor(userData.xp / 100) + 1
  const xpForNextLevel = level * 100
  const currentLevelXp = userData.xp - (level - 1) * 100
  const xpProgress = (currentLevelXp / 100) * 100

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <Wallet className="mr-2 h-4 w-4" />
              <span>{userData.coins} Coins</span>
            </Button>
          </div>
        </div>

        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Level {level}</div>
                  <p className="text-xs text-muted-foreground">{userData.level}</p>
                  <Progress value={xpProgress} className="mt-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentLevelXp}/{100} XP to Level {level + 1}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.coins} Coins</div>
                  <p className="text-xs text-muted-foreground">
                    {activities.length > 0 && activities[0]?.coins_earned
                      ? `+${activities[0].coins_earned} earned recently`
                      : "Start activities to earn coins"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.xp}</div>
                  <p className="text-xs text-muted-foreground">
                    {activities.length > 0 && activities[0]?.xp_earned
                      ? `+${activities[0].xp_earned} earned recently`
                      : "Complete activities to earn XP"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Activities Completed</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activities.length}</div>
                  <p className="text-xs text-muted-foreground">Keep going to improve your rank!</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading activities...</span>
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No activities yet. Start playing games, taking quizzes, or trying simulations!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-center">
                          <div className="mr-4 rounded-full bg-primary/10 p-2">
                            {activity.activity_type === "quiz" && <BookOpen className="h-4 w-4 text-primary" />}
                            {activity.activity_type === "game" && <Gamepad2 className="h-4 w-4 text-primary" />}
                            {activity.activity_type === "simulation" && <BookOpen className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {activity.activity_type === "quiz" && "Completed "}
                              {activity.activity_type === "game" && "Played "}
                              {activity.activity_type === "simulation" && "Completed "}"{activity.activity_name}"
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Score: {activity.score} • +{activity.xp_earned} XP • +{activity.coins_earned} Coins
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recommended For You</CardTitle>
                  <CardDescription>Based on your level and interests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Investment Simulation</h4>
                        <p className="text-xs text-muted-foreground">Learn how to build a diversified portfolio</p>
                      </div>
                      <Link href="/dashboard/simulations/investment">
                        <Button variant="outline" size="sm">
                          Start
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Gamepad2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Tax Rush Game</h4>
                        <p className="text-xs text-muted-foreground">Learn tax basics in a fun way</p>
                      </div>
                      <Link href="/dashboard/games/tax-rush">
                        <Button variant="outline" size="sm">
                          Play
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Credit Score Quiz</h4>
                        <p className="text-xs text-muted-foreground">Test your knowledge about credit scores</p>
                      </div>
                      <Link href="/dashboard/quizzes/credit-score">
                        <Button variant="outline" size="sm">
                          Take Quiz
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="activities" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Simulations</CardTitle>
                  <CardDescription>Interactive financial scenarios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Budgeting Basics</h4>
                        <Badge variant="outline">Available</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Learn to create and manage a monthly budget</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> 15 min
                        </div>
                        <Link href="/dashboard/simulations/budgeting">
                          <Button variant="outline" size="sm">
                            Start
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard/simulations">
                    <Button variant="link" className="w-full">
                      View All Simulations
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mini-Games</CardTitle>
                  <CardDescription>Fun financial games</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Tax Rush</h4>
                        <Badge variant="outline">New</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Race against time to file taxes correctly</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Gamepad2 className="h-3 w-3" /> 10 min
                        </div>
                        <Link href="/dashboard/games/tax-rush">
                          <Button variant="outline" size="sm">
                            Play
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard/games">
                    <Button variant="link" className="w-full">
                      View All Games
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quizzes</CardTitle>
                  <CardDescription>Test your knowledge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Budgeting Basics</h4>
                        <Badge variant="outline">Available</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Test your budgeting knowledge</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" /> 5 min
                        </div>
                        <Link href="/dashboard/quizzes/budgeting">
                          <Button variant="outline" size="sm">
                            Take Quiz
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard/quizzes">
                    <Button variant="link" className="w-full">
                      View All Quizzes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Achievements you've earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-xs font-medium">First Login</span>
                  </div>
                  {userData.xp >= 100 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <TrendingUp className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-xs font-medium">Level Up</span>
                    </div>
                  )}
                  {activities.some((a) => a.activity_type === "quiz") && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-xs font-medium">Quiz Taker</span>
                    </div>
                  )}
                  {activities.some((a) => a.activity_type === "game") && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Gamepad2 className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-xs font-medium">Game Player</span>
                    </div>
                  )}
                  {userData.coins >= 100 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Wallet className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-xs font-medium">Saver</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/achievements">
                  <Button variant="outline" className="w-full">
                    View All Badges
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
