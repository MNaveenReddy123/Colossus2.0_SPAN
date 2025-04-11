"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserActivities } from "@/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Award,
  TrendingUp,
  BookOpen,
  Gamepad2,
  Calendar,
  Clock,
  Trophy,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProgressPage() {
  const { userData, refreshUserData } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (userData) {
        setLoading(true)
        try {
          // Fetch activities
          const result = await getUserActivities(userData.id)
          if (result.success) {
            setActivities(result.data || [])
          } else {
            setError("Failed to load activity data")
          }
        } catch (error) {
          console.error("Error fetching progress data:", error)
          setError("An unexpected error occurred")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [userData])

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    )
  }

  // Calculate level and progress
  const level = Math.floor(userData.xp / 100) + 1
  const xpForNextLevel = level * 100
  const currentLevelXp = userData.xp - (level - 1) * 100
  const xpProgress = (currentLevelXp / 100) * 100

  // Count completed activities by type
  const completedQuizzes = activities.filter((a) => a.activity_type === "quiz").length
  const completedSimulations = activities.filter((a) => a.activity_type === "simulation").length
  const playedGames = activities.filter((a) => a.activity_type === "game").length

  // Calculate average quiz score
  const quizzes = activities.filter((a) => a.activity_type === "quiz")
  const averageQuizScore =
    quizzes.length > 0 ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length) : 0

  // Calculate time spent (estimate based on activities)
  const estimatedTimeSpent = activities.length * 15 // 15 minutes per activity on average

  // Determine which badges the user has earned
  const hasBadges = {
    firstLogin: true, // Always true if they're on this page
    quizMaster: completedQuizzes >= 3,
    gamePro: playedGames >= 2,
    investor: completedSimulations >= 1,
    earlyBird: userData.xp >= 200,
    top10: false, // Would need leaderboard data
    analyst: userData.xp >= 300,
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Your Progress</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Weekly Report</span>
            </Button>
          </div>
        </div>

        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading your progress...</span>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Level Progress</CardTitle>
                  <CardDescription>Your journey to financial mastery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Current Level: {level}</div>
                          <div className="text-xs text-muted-foreground">{userData.level}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{currentLevelXp}/100 XP</div>
                    </div>
                    <Progress value={xpProgress} className="h-2" />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {Array.from({ length: Math.min(level + 2, 5) }).map((_, i) => {
                      const levelNum = i + 1
                      const isCompleted = level > levelNum
                      const isInProgress = level === levelNum

                      return (
                        <div key={levelNum} className="space-y-2">
                          <div className="text-sm font-medium">Level {levelNum}</div>
                          <div className="flex items-center gap-2">
                            <Progress value={isCompleted ? 100 : isInProgress ? xpProgress : 0} className="h-2" />
                            <span className="text-xs font-medium">
                              {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Locked"}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Quizzes</CardTitle>
                    <CardDescription>Your quiz performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Completed</div>
                      <div className="text-sm font-medium">{completedQuizzes}/12</div>
                    </div>
                    <Progress value={(completedQuizzes / 12) * 100} className="h-2" />
                    <div className="space-y-2">
                      {quizzes.slice(0, 3).map((quiz) => (
                        <div key={quiz.id} className="flex items-center justify-between text-sm">
                          <div>{quiz.activity_name}</div>
                          <div>{quiz.score}/100</div>
                        </div>
                      ))}
                      {quizzes.length === 0 && (
                        <div className="text-sm text-muted-foreground">No quizzes completed yet</div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">Average Score: {averageQuizScore}%</div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Simulations</CardTitle>
                    <CardDescription>Your simulation progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Completed</div>
                      <div className="text-sm font-medium">{completedSimulations}/5</div>
                    </div>
                    <Progress value={(completedSimulations / 5) * 100} className="h-2" />
                    <div className="space-y-2">
                      {activities
                        .filter((a) => a.activity_type === "simulation")
                        .slice(0, 3)
                        .map((sim) => (
                          <div key={sim.id} className="flex items-center justify-between text-sm">
                            <div>{sim.activity_name}</div>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                        ))}
                      {completedSimulations === 0 && (
                        <div className="text-sm text-muted-foreground">No simulations completed yet</div>
                      )}
                      {completedSimulations < 5 && (
                        <div className="flex items-center justify-between text-sm">
                          <div>Next simulation</div>
                          <Badge variant="outline">Not Started</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Time Spent: ~{completedSimulations * 15} minutes
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mini-Games</CardTitle>
                    <CardDescription>Your game progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Played</div>
                      <div className="text-sm font-medium">{playedGames}/4</div>
                    </div>
                    <Progress value={(playedGames / 4) * 100} className="h-2" />
                    <div className="space-y-2">
                      {activities
                        .filter((a) => a.activity_type === "game")
                        .slice(0, 3)
                        .map((game) => (
                          <div key={game.id} className="flex items-center justify-between text-sm">
                            <div>{game.activity_name}</div>
                            <Badge variant="outline">Score: {game.score}</Badge>
                          </div>
                        ))}
                      {playedGames === 0 && <div className="text-sm text-muted-foreground">No games played yet</div>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      {playedGames > 0
                        ? `High Score: ${Math.max(
                            ...activities.filter((a) => a.activity_type === "game").map((g) => g.score),
                          )}`
                        : "Play games to see your high score"}
                    </div>
                  </CardFooter>
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
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-xs font-medium">First Login</span>
                      <span className="text-xs text-muted-foreground">Earned</span>
                    </div>

                    <div className={`flex flex-col items-center gap-2 ${!hasBadges.quizMaster && "opacity-40"}`}>
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${hasBadges.quizMaster ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <BookOpen
                          className={`h-8 w-8 ${hasBadges.quizMaster ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <span className="text-xs font-medium">Quiz Master</span>
                      <span className="text-xs text-muted-foreground">
                        {hasBadges.quizMaster ? "Earned" : "Complete 3 quizzes"}
                      </span>
                    </div>

                    <div className={`flex flex-col items-center gap-2 ${!hasBadges.gamePro && "opacity-40"}`}>
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${hasBadges.gamePro ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <Gamepad2
                          className={`h-8 w-8 ${hasBadges.gamePro ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <span className="text-xs font-medium">Game Pro</span>
                      <span className="text-xs text-muted-foreground">
                        {hasBadges.gamePro ? "Earned" : "Play 2 games"}
                      </span>
                    </div>

                    <div className={`flex flex-col items-center gap-2 ${!hasBadges.investor && "opacity-40"}`}>
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${hasBadges.investor ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <TrendingUp
                          className={`h-8 w-8 ${hasBadges.investor ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <span className="text-xs font-medium">Investor</span>
                      <span className="text-xs text-muted-foreground">
                        {hasBadges.investor ? "Earned" : "Complete 1 simulation"}
                      </span>
                    </div>

                    <div className={`flex flex-col items-center gap-2 ${!hasBadges.earlyBird && "opacity-40"}`}>
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${hasBadges.earlyBird ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <Clock
                          className={`h-8 w-8 ${hasBadges.earlyBird ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <span className="text-xs font-medium">Early Bird</span>
                      <span className="text-xs text-muted-foreground">
                        {hasBadges.earlyBird ? "Earned" : "Reach 200 XP"}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Trophy className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <span className="text-xs font-medium">Top 10</span>
                      <span className="text-xs text-muted-foreground">Reach top 10 on leaderboard</span>
                    </div>

                    <div className={`flex flex-col items-center gap-2 ${!hasBadges.analyst && "opacity-40"}`}>
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${hasBadges.analyst ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <BarChart3
                          className={`h-8 w-8 ${hasBadges.analyst ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <span className="text-xs font-medium">Analyst</span>
                      <span className="text-xs text-muted-foreground">
                        {hasBadges.analyst ? "Earned" : "Reach 300 XP"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full text-center text-sm text-muted-foreground">
                    {Object.values(hasBadges).filter(Boolean).length} out of 7 badges earned (
                    {Math.round((Object.values(hasBadges).filter(Boolean).length / 7) * 100)}% complete)
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>Key achievements in your financial journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activities.length > 0 ? (
                    activities.slice(0, 4).map((activity, index) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          {activity.activity_type === "quiz" && <BookOpen className="h-5 w-5 text-primary" />}
                          {activity.activity_type === "game" && <Gamepad2 className="h-5 w-5 text-primary" />}
                          {activity.activity_type === "simulation" && <TrendingUp className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {activity.activity_type === "quiz" && "Completed Quiz: "}
                            {activity.activity_type === "game" && "Played Game: "}
                            {activity.activity_type === "simulation" && "Completed Simulation: "}
                            {activity.activity_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant="outline">+{activity.xp_earned} XP</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No milestones yet. Start playing games, taking quizzes, or trying simulations!
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                    <CardDescription>Your learning activity over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground/50" />
                        <div className="mt-2 text-sm text-muted-foreground">Activity chart visualization</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full text-center text-sm text-muted-foreground">
                      {activities.length > 0
                        ? `Most recent activity: ${activities[0].activity_name} (${new Date(activities[0].created_at).toLocaleDateString()})`
                        : "No activities recorded yet"}
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Stats</CardTitle>
                    <CardDescription>Your learning metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Total Time Spent (est.)</div>
                        <div className="text-sm font-medium">
                          {Math.floor(estimatedTimeSpent / 60)}h {estimatedTimeSpent % 60}m
                        </div>
                      </div>
                      <Progress value={(estimatedTimeSpent / 480) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground">Goal: 8 hours per week</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Quiz Accuracy</div>
                        <div className="text-sm font-medium">{averageQuizScore}%</div>
                      </div>
                      <Progress value={averageQuizScore} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Simulation Completion</div>
                        <div className="text-sm font-medium">{(completedSimulations / 5) * 100}%</div>
                      </div>
                      <Progress value={(completedSimulations / 5) * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Game Progress</div>
                        <div className="text-sm font-medium">{(playedGames / 4) * 100}%</div>
                      </div>
                      <Progress value={(playedGames / 4) * 100} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                      <div>
                        <div className="font-medium">{activities.length > 0 ? Math.min(5, activities.length) : 0}</div>
                        <div>Day Streak</div>
                      </div>
                      <div>
                        <div className="font-medium">{activities.length}</div>
                        <div>Activities</div>
                      </div>
                      <div>
                        <div className="font-medium">{userData.xp}</div>
                        <div>XP Earned</div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
