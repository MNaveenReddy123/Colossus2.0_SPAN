"use client"

import { useEffect, useState } from "react"
import Suggestions from "@/components/ui/suggestions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  RefreshCw,
  Home,
  Settings,
  User,
  ChevronRight,
  Zap,
  Flame,
  Gift,
  Crown,
  Lightbulb,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCachedUserData } from "@/hooks/use-cached-user-data"

// Import the custom theme
// Change from:
// import "@/styles/dashboard-theme.css"
// To:
import "@/styles/dashboard-theme-light.css"

// Activity type definition
type ActivityType = {
  id: number
  user_id: string
  activity_type: "quiz" | "game" | "simulation"
  activity_name: string
  score: number
  xp_earned: number
  coins_earned: number
  created_at: string
}

// Animated progress bar component
const AnimatedProgressBar = ({ value = 0, className = "" }: { value: number; className?: string }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Delay to allow animation
    const timer = setTimeout(() => {
      setWidth(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className={`progress-bar ${className}`}>
      <div className="progress-bar-fill bg-green-600" style={{ width: `${width}%` }} />
    </div>
  )
}

// Activity performance chart
const ActivityPerformanceChart = ({ activities }: { activities: ActivityType[] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <LineChart className="h-16 w-16 text-muted-foreground/50" />
        <p className="text-muted-foreground mt-4">Complete activities to see your performance trends</p>
      </div>
    )
  }

  // Get the last 5 activities in chronological order
  const recentActivities = [...activities]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-5)

  return (
    <div className="h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm chart-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-black">Performance Trend</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-60">This chart shows your score performance across your most recent activities.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="h-48 flex items-end space-x-2">
        {recentActivities.map((activity, index) => {
          // Calculate height percentage (max 100%)
          const heightPercentage = Math.min(100, (activity.score / 100) * 100)

          return (
            <div key={activity.id} className="flex flex-col items-center flex-1">
              <div className="w-full flex justify-center mb-1">
                <span className="text-xs">{activity.score}%</span>
              </div>
              <div
                className="w-full rounded-t-sm glow-effect"
                style={{
                  height: `${heightPercentage}%`,
                  background: `linear-gradient(180deg, 
  #10b981 0%, 
  #059669 100%)`,
                }}
              ></div>
              <div className="w-full text-center mt-2">
                <span className="text-xs text-muted-foreground truncate block" style={{ maxWidth: "100%" }}>
                  {activity.activity_name.length > 10
                    ? activity.activity_name.substring(0, 10) + "..."
                    : activity.activity_name}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Donut chart for activity type distribution
const ActivityTypeDonut = ({ activities }: { activities: ActivityType[] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <PieChart className="h-16 w-16 text-muted-foreground/50" />
        <p className="text-muted-foreground mt-4">Complete activities to see your distribution</p>
      </div>
    )
  }

  // Count activities by type
  const counts = {
    quiz: activities.filter((a) => a.activity_type === "quiz").length,
    game: activities.filter((a) => a.activity_type === "game").length,
    simulation: activities.filter((a) => a.activity_type === "simulation").length,
  }

  // Calculate percentages and angles for the donut chart
  const total = activities.length
  const quizPercentage = Math.round((counts.quiz / total) * 100) || 0
  const gamePercentage = Math.round((counts.game / total) * 100) || 0
  const simulationPercentage = Math.round((counts.simulation / total) * 100) || 0

  // Calculate the stroke dasharray and dashoffset for each segment
  const circumference = 2 * Math.PI * 40 // radius is 40

  return (
    <div className="h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm chart-container">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-black">Activity Distribution</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-60">This chart shows the distribution of your activities by type.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center justify-center h-40">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#10b981" // Secondary color
              strokeWidth="15"
              strokeDasharray={circumference}
              strokeDashoffset={(1 - counts.quiz / total) * circumference}
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#059669" // Primary color
              strokeWidth="15"
              strokeDasharray={circumference}
              strokeDashoffset={(1 - counts.game / total) * circumference}
              transform={`rotate(${(counts.quiz / total) * 360 - 90} 50 50)`}
              style={{
                transformOrigin: "center",
                strokeDashoffset: (1 - counts.game / total) * circumference,
                transform: `rotate(${(counts.quiz / total) * 360 - 90}deg)`,
                transformBox: "fill-box",
              }}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#34d399" // Accent color
              strokeWidth="15"
              strokeDasharray={circumference}
              strokeDashoffset={(1 - counts.simulation / total) * circumference}
              transform={`rotate(${(counts.quiz / total + counts.game / total) * 360 - 90} 50 50)`}
              style={{
                transformOrigin: "center",
                strokeDashoffset: (1 - counts.simulation / total) * circumference,
                transform: `rotate(${(counts.quiz / total + counts.game / total) * 360 - 90}deg)`,
                transformBox: "fill-box",
              }}
            />
            <circle cx="50" cy="50" r="25" fill="hsl(var(--dashboard-card))" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{total}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-around mt-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-600 mr-1"></div>
          <span className="text-xs">Quiz ({quizPercentage}%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-700 mr-1"></div>
          <span className="text-xs">Game ({gamePercentage}%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
          <span className="text-xs">Sim ({simulationPercentage}%)</span>
        </div>
      </div>
    </div>
  )
}

// XP and Coins trend chart
const ResourcesTrendChart = ({ activities }: { activities: ActivityType[] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
        <p className="text-muted-foreground mt-4">Complete activities to see your resources trend</p>
      </div>
    )
  }

  // Get the last 5 activities in chronological order
  const recentActivities = [...activities]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-5)

  // Find max values to normalize the chart
  const maxXp = Math.max(...recentActivities.map((a) => a.xp_earned))
  const maxCoins = Math.max(...recentActivities.map((a) => a.coins_earned))
  const maxValue = Math.max(maxXp, maxCoins)

  return (
    <div className="h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm chart-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-black">XP & Coins Earned</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-60">This chart shows XP and Coins earned from your most recent activities.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="h-48 flex items-end space-x-2">
        {recentActivities.map((activity, index) => {
          // Calculate height percentages
          const xpHeightPercentage = maxValue ? (activity.xp_earned / maxValue) * 100 : 0
          const coinsHeightPercentage = maxValue ? (activity.coins_earned / maxValue) * 100 : 0

          return (
            <div key={activity.id} className="flex-1 flex space-x-1">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-center mb-1">
                  <span className="text-xs">{activity.xp_earned}</span>
                </div>
                <div
                  className="w-full rounded-t-sm glow-effect"
                  style={{
                    height: `${xpHeightPercentage}%`,
                    background: "#059669", // Primary color
                  }}
                ></div>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-center mb-1">
                  <span className="text-xs">{activity.coins_earned}</span>
                </div>
                <div
                  className="w-full rounded-t-sm glow-effect"
                  style={{
                    height: `${coinsHeightPercentage}%`,
                    background: "#10b981", // Warning color
                  }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-around mt-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-700 mr-1"></div>
          <span className="text-xs">XP</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span className="text-xs">Coins</span>
        </div>
      </div>
    </div>
  )
}

// Heatmap for activity frequency
const ActivityHeatmap = ({ activities }: { activities: ActivityType[] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <Calendar className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground mt-2 text-sm">Complete activities to see your activity calendar</p>
      </div>
    )
  }

  // Create a map of dates to activity counts
  const activityMap = new Map<string, number>()

  // Get the last 7 days
  const today = new Date()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    days.push({
      date: dateStr,
      display: date.toLocaleDateString(undefined, { weekday: "short" }),
    })
    activityMap.set(dateStr, 0)
  }

  // Count activities per day
  activities.forEach((activity) => {
    const dateStr = new Date(activity.created_at).toISOString().split("T")[0]
    if (activityMap.has(dateStr)) {
      activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1)
    }
  })

  // Find max for normalization
  const maxActivities = Math.max(...Array.from(activityMap.values()), 1)

  return (
    <div className="h-32 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-black">Activity Calendar</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-60">This shows your activity frequency over the past 7 days.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex justify-between h-16">
        {days.map((day) => {
          const count = activityMap.get(day.date) || 0
          const intensity = count / maxActivities

          return (
            <div key={day.date} className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center glow-effect"
                style={{
                  background:
                    count > 0
                      ? `linear-gradient(135deg, 
      rgba(16, 185, 129, ${0.4 + intensity * 0.6}), 
      rgba(5, 150, 105, ${0.4 + intensity * 0.6}))`
                      : "rgba(229, 231, 235, 0.3)",
                }}
              >
                <span className="text-xs font-medium">{count}</span>
              </div>
              <span className="text-xs mt-1 text-muted-foreground">{day.display}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Achievement progress component
const AchievementProgressCard = ({ userData, activities }: { userData: any; activities: ActivityType[] }) => {
  // Define achievements and their criteria
  const achievements = [
    {
      id: "first_login",
      name: "First Login",
      description: "Log in to the platform for the first time",
      icon: <Award className="h-4 w-4" />,
      progress: 100, // Always completed
      completed: true,
    },
    {
      id: "level_up",
      name: "Level Up",
      description: "Reach level 2 or higher",
      icon: <TrendingUp className="h-4 w-4" />,
      progress: Math.min(100, (userData.xp / 100) * 100),
      completed: userData.xp >= 100,
    },
    {
      id: "quiz_master",
      name: "Quiz Master",
      description: "Complete 5 quizzes",
      icon: <BookOpen className="h-4 w-4" />,
      progress: Math.min(100, (activities.filter((a) => a.activity_type === "quiz").length / 5) * 100),
      completed: activities.filter((a) => a.activity_type === "quiz").length >= 5,
    },
    {
      id: "game_player",
      name: "Game Player",
      description: "Play 3 different games",
      icon: <Gamepad2 className="h-4 w-4" />,
      // Count unique game names
      progress: Math.min(
        100,
        (new Set(activities.filter((a) => a.activity_type === "game").map((a) => a.activity_name)).size / 3) * 100,
      ),
      completed: new Set(activities.filter((a) => a.activity_type === "game").map((a) => a.activity_name)).size >= 3,
    },
    {
      id: "saver",
      name: "Saver",
      description: "Accumulate 100 coins",
      icon: <Wallet className="h-4 w-4" />,
      progress: Math.min(100, (userData.coins / 100) * 100),
      completed: userData.coins >= 100,
    },
    {
      id: "perfect_score",
      name: "Perfect Score",
      description: "Get a 100% score on any activity",
      icon: <Target className="h-4 w-4" />,
      progress: activities.some((a) => a.score === 100) ? 100 : 0,
      completed: activities.some((a) => a.score === 100),
    },
  ]

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-black">Achievement Progress</h3>
        <Badge className="bg-green-600 text-white">
          {achievements.filter((a) => a.completed).length}/{achievements.length}
        </Badge>
      </div>
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-full ${achievement.completed ? "bg-green-600" : "bg-muted"}`}>
                  {achievement.icon}
                </div>
                <span className="text-sm font-medium">{achievement.name}</span>
              </div>
              {achievement.completed && (
                <Badge variant="outline" className="bg-[hsla(var(--dashboard-secondary),0.2)] badge-glow">
                  <Star className="h-3 w-3 mr-1 text-[hsl(var(--dashboard-secondary))]" />
                  Completed
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <AnimatedProgressBar value={achievement.progress} />
              <span className="text-xs text-muted-foreground">{Math.round(achievement.progress)}%</span>
            </div>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// User stats card
const UserStatsCard = ({ userData, activities }: { userData: any; activities: ActivityType[] }) => {
  // Calculate stats
  const totalActivities = activities.length
  const totalXpEarned = activities.reduce((sum, a) => sum + a.xp_earned, 0)
  const totalCoinsEarned = activities.reduce((sum, a) => sum + a.coins_earned, 0)
  const avgScore =
    activities.length > 0 ? Math.round(activities.reduce((sum, a) => sum + a.score, 0) / activities.length) : 0

  // Calculate activity type counts
  const quizCount = activities.filter((a) => a.activity_type === "quiz").length
  const gameCount = activities.filter((a) => a.activity_type === "game").length
  const simulationCount = activities.filter((a) => a.activity_type === "simulation").length

  // Calculate trends (comparing last activity to average)
  let scoreTrend = 0
  let xpTrend = 0
  let coinsTrend = 0

  if (activities.length > 0) {
    const lastActivity = activities[0] // Most recent activity
    const avgScoreExcludingLast =
      activities.length > 1
        ? (activities.reduce((sum, a) => sum + a.score, 0) - lastActivity.score) / (activities.length - 1)
        : lastActivity.score
    const avgXpExcludingLast =
      activities.length > 1
        ? (activities.reduce((sum, a) => sum + a.xp_earned, 0) - lastActivity.xp_earned) / (activities.length - 1)
        : lastActivity.xp_earned
    const avgCoinsExcludingLast =
      activities.length > 1
        ? (activities.reduce((sum, a) => sum + a.coins_earned, 0) - lastActivity.coins_earned) / (activities.length - 1)
        : lastActivity.coins_earned

    scoreTrend = lastActivity.score - avgScoreExcludingLast
    xpTrend = lastActivity.xp_earned - avgXpExcludingLast
    coinsTrend = lastActivity.coins_earned - avgCoinsExcludingLast
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-black">User Statistics</h3>
        <Badge className="bg-green-600 text-white">Level {Math.floor(userData.xp / 100) + 1}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Activities</span>
            <span className="font-medium">{totalActivities}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Average Score</span>
            <div className="flex items-center">
              <span className="font-medium">{avgScore}%</span>
              {scoreTrend !== 0 && (
                <span
                  className={`ml-1 text-xs ${scoreTrend > 0 ? "text-[hsl(var(--dashboard-success))]" : "text-[hsl(var(--dashboard-danger))]"}`}
                >
                  {scoreTrend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total XP Earned</span>
            <div className="flex items-center">
              <span className="font-medium">{totalXpEarned}</span>
              {xpTrend !== 0 && (
                <span
                  className={`ml-1 text-xs ${xpTrend > 0 ? "text-[hsl(var(--dashboard-success))]" : "text-[hsl(var(--dashboard-danger))]"}`}
                >
                  {xpTrend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Coins Earned</span>
            <div className="flex items-center">
              <span className="font-medium">{totalCoinsEarned}</span>
              {coinsTrend !== 0 && (
                <span
                  className={`ml-1 text-xs ${coinsTrend > 0 ? "text-[hsl(var(--dashboard-success))]" : "text-[hsl(var(--dashboard-danger))]"}`}
                >
                  {coinsTrend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Quizzes Completed</span>
            <span className="font-medium">{quizCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Games Played</span>
            <span className="font-medium">{gameCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Simulations Run</span>
            <span className="font-medium">{simulationCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Recent activities component
const RecentActivitiesCard = ({ activities }: { activities: ActivityType[] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-black mb-4">Recent Activities</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground mt-4">No activities yet. Start your learning journey!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-black mb-4">Recent Activities</h3>
      <div className="space-y-3">
        {activities.slice(0, 5).map((activity) => (
          <div
            key={activity.id}
            className="flex items-center p-3 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg glow-effect"
          >
            <div
              className="mr-4 rounded-full p-2"
              style={{
                background:
                  activity.activity_type === "quiz"
                    ? "hsla(var(--dashboard-secondary), 0.2)"
                    : activity.activity_type === "game"
                      ? "hsla(var(--dashboard-primary), 0.2)"
                      : "hsla(var(--dashboard-accent), 0.2)",
              }}
            >
              {activity.activity_type === "quiz" && <BookOpen className="h-4 w-4 text-green-700" />}
              {activity.activity_type === "game" && <Gamepad2 className="h-4 w-4 text-green-600" />}
              {activity.activity_type === "simulation" && <Activity className="h-4 w-4 text-green-500" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium leading-none">{activity.activity_name}</p>
                <Badge
                  className={
                    activity.activity_type === "quiz"
                      ? "bg-green-100 text-green-800"
                      : activity.activity_type === "game"
                        ? "bg-green-100 text-green-800"
                        : "bg-green-100 text-green-800"
                  }
                >
                  {activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Score: {activity.score}% • +{activity.xp_earned} XP • +{activity.coins_earned} Coins
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.created_at).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link href="/dashboard/activities">
          <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 text-black">
            View All Activities
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Recommendations component
const RecommendationsCard = ({ userData, activities }: { userData: any; activities: ActivityType[] }) => {
  // Generate personalized recommendations based on user data
  const recommendations = []

  // Level-based recommendations
  const userLevel = Math.floor(userData.xp / 100) + 1

  if (userLevel < 2) {
    recommendations.push({
      title: "Budgeting Basics",
      type: "quiz",
      description: "Perfect for beginners to learn financial fundamentals",
      icon: <BookOpen className="h-4 w-4" />,
      link: "/dashboard/quizzes/budgeting",
      badge: "Beginner",
    })
  } else if (userLevel < 4) {
    recommendations.push({
      title: "Credit Score Adventure",
      type: "game",
      description: "Learn about credit scores in a fun interactive way",
      icon: <Gamepad2 className="h-4 w-4" />,
      link: "/dashboard/games/credit-score",
      badge: "Intermediate",
    })
  } else {
    recommendations.push({
      title: "Investment Simulation",
      type: "simulation",
      description: "Advanced portfolio management simulation",
      icon: <Activity className="h-4 w-4" />,
      link: "/dashboard/simulations/investment",
      badge: "Advanced",
    })
  }

  // Activity-based recommendations
  const hasPlayedGames = activities.some((a) => a.activity_type === "game")
  const hasTakenQuizzes = activities.some((a) => a.activity_type === "quiz")

  if (!hasPlayedGames) {
    recommendations.push({
      title: "Tax Rush",
      type: "game",
      description: "Race against time to file taxes correctly",
      icon: <Gamepad2 className="h-4 w-4" />,
      link: "/dashboard/games/tax-rush",
      badge: "New",
    })
  }

  if (!hasTakenQuizzes) {
    recommendations.push({
      title: "Financial Literacy Quiz",
      type: "quiz",
      description: "Test your knowledge of financial concepts",
      icon: <BookOpen className="h-4 w-4" />,
      link: "/dashboard/quizzes/financial-literacy",
      badge: "Popular",
    })
  }

  // Always recommend something
  if (recommendations.length < 3) {
    recommendations.push({
      title: "Stock Market Simulator",
      type: "simulation",
      description: "Learn to invest in a simulated stock market",
      icon: <Activity className="h-4 w-4" />,
      link: "/dashboard/games/stock-market",
      badge: "Featured",
    })
  }

  return <Suggestions />
}

// Main dashboard page component
export default function UserDashboardPage() {
  const router = useRouter()
  const { userData } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Use the cached data hook
  const { activities, loading, error, lastUpdated, refreshData } = useCachedUserData(userData?.id)

  if (!userData) {
    return (
      <div className="dashboard-theme flex min-h-screen items-center justify-center animated-bg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          <p className="text-lg font-medium">Loading your dashboard...</p>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="w-full border-gray-300 hover:bg-gray-100 text-black mt-4"
          >
            Return to Standard Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const level = Math.floor(userData.xp / 100) + 1
  const currentLevelXp = userData.xp - (level - 1) * 100
  const xpProgress = (currentLevelXp / 100) * 100

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col">
        <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-black">Financial Analytics</h1>
                <div className="hidden md:flex items-center space-x-1">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Level {level}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {userData.xp} XP
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={refreshData} className="border-gray-300">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh Data</p>
                      {lastUpdated && (
                        <p className="text-xs text-muted-foreground">
                          Last updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button className="bg-black text-white hover:bg-gray-800">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>{userData.coins} Coins</span>
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/dashboard")}
                        className="border-gray-300"
                      >
                        <Home className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Return to Standard Dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-6">
          {error && (
            <Alert className="mb-4 border-[hsl(var(--dashboard-danger))] bg-[hsla(var(--dashboard-danger),0.1)]">
              <AlertCircle className="h-4 w-4 text-[hsl(var(--dashboard-danger))]" />
              <AlertDescription className="text-[hsl(var(--dashboard-danger))]">{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Welcome back, {userData.name || userData.email.split("@")[0]}</h2>
                <p className="text-muted-foreground">Here's an overview of your financial learning journey</p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">Level Progress:</div>
                  <div className="w-48 h-2 bg-[hsla(var(--dashboard-muted),0.5)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${xpProgress}%`,
                        background: `linear-gradient(90deg, 
                          hsl(var(--dashboard-primary)) 0%, 
                          hsl(var(--dashboard-secondary)) 100%)`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm">{currentLevelXp}/100 XP</div>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
              >
                <Activity className="h-4 w-4 mr-2" />
                Activities
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  <span className="ml-2">Loading analytics...</span>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm stat-card">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Level</p>
                          <div className="text-2xl font-bold mt-1">Level {level}</div>
                        </div>
                        <div className="rounded-full p-3 bg-[hsla(var(--dashboard-primary),0.1)]">
                          <TrendingUp className="h-5 w-5 text-[hsl(var(--dashboard-primary))]" />
                        </div>
                      </div>
                      <AnimatedProgressBar value={xpProgress} className="mt-2" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {currentLevelXp}/100 XP to Level {level + 1}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm stat-card">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Wallet Balance</p>
                          <div className="text-2xl font-bold mt-1">{userData.coins} Coins</div>
                        </div>
                        <div className="rounded-full p-3 bg-[hsla(var(--dashboard-warning),0.1)]">
                          <Wallet className="h-5 w-5 text-[hsl(var(--dashboard-warning))]" />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground">
                        {activities.length > 0 && activities[0]?.coins_earned ? (
                          <span className="flex items-center text-[hsl(var(--dashboard-success))]">
                            <ArrowUpRight className="h-3 w-3 mr-1" />+{activities[0].coins_earned} earned recently
                          </span>
                        ) : (
                          "Start activities to earn coins"
                        )}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm stat-card">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Total XP</p>
                          <div className="text-2xl font-bold mt-1">{userData.xp}</div>
                        </div>
                        <div className="rounded-full p-3 bg-[hsla(var(--dashboard-secondary),0.1)]">
                          <Award className="h-5 w-5 text-[hsl(var(--dashboard-secondary))]" />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground">
                        {activities.length > 0 && activities[0]?.xp_earned ? (
                          <span className="flex items-center text-[hsl(var(--dashboard-success))]">
                            <ArrowUpRight className="h-3 w-3 mr-1" />+{activities[0].xp_earned} earned recently
                          </span>
                        ) : (
                          "Complete activities to earn XP"
                        )}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm stat-card">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Activities Completed</p>
                          <div className="text-2xl font-bold mt-1">{activities.length}</div>
                        </div>
                        <div className="rounded-full p-3 bg-[hsla(var(--dashboard-accent),0.1)]">
                          <Trophy className="h-5 w-5 text-[hsl(var(--dashboard-accent))]" />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground">Keep going to improve your rank!</p>
                    </div>
                  </div>

                  <ActivityHeatmap activities={activities} />

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ActivityPerformanceChart activities={activities} />
                    <ActivityTypeDonut activities={activities} />
                    <ResourcesTrendChart activities={activities} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <UserStatsCard userData={userData} activities={activities} />
                    <RecommendationsCard userData={userData} activities={activities} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <RecentActivitiesCard activities={activities} />
                    <AchievementProgressCard userData={userData} activities={activities} />
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-4">Activity History</h3>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                    <span className="ml-2">Loading activities...</span>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No activities yet. Start playing games, taking quizzes, or trying simulations!</p>
                    <Button
                      className="bg-black text-white hover:bg-gray-800 mt-4"
                      onClick={() => router.push("/dashboard/games")}
                    >
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      Explore Games
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center p-3 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg glow-effect"
                      >
                        <div
                          className="mr-4 rounded-full p-2"
                          style={{
                            background:
                              activity.activity_type === "quiz"
                                ? "hsla(var(--dashboard-secondary), 0.2)"
                                : activity.activity_type === "game"
                                  ? "hsla(var(--dashboard-primary), 0.2)"
                                  : "hsla(var(--dashboard-accent), 0.2)",
                          }}
                        >
                          {activity.activity_type === "quiz" && <BookOpen className="h-4 w-4 text-green-700" />}
                          {activity.activity_type === "game" && <Gamepad2 className="h-4 w-4 text-green-600" />}
                          {activity.activity_type === "simulation" && <Activity className="h-4 w-4 text-green-500" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium leading-none">{activity.activity_name}</p>
                            <Badge
                              className={
                                activity.activity_type === "quiz"
                                  ? "bg-green-100 text-green-800"
                                  : activity.activity_type === "game"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-green-100 text-green-800"
                              }
                            >
                              {activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-xs text-muted-foreground">
                              Score: {activity.score}% • +{activity.xp_earned} XP • +{activity.coins_earned} Coins
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.created_at).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Gamepad2 className="h-5 w-5 mr-2 text-green-600" />
                    <h3 className="text-lg font-bold">Games</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="border border-[hsla(var(--dashboard-border),0.5)] rounded-lg p-3 glow-effect">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Tax Rush</h4>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            New
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Race against time to file taxes correctly</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> 10 min
                          </div>
                          <Link href="/dashboard/games/tax-rush">
                            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                              Play
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard/games">
                      <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 text-black">
                        View All Games
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-5 w-5 mr-2 text-green-700" />
                    <h3 className="text-lg font-bold">Quizzes</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="border border-[hsla(var(--dashboard-border),0.5)] rounded-lg p-3 glow-effect">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Budgeting Basics</h4>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Popular
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Test your budgeting knowledge</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> 5 min
                          </div>
                          <Link href="/dashboard/quizzes/budgeting">
                            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                              Take Quiz
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard/quizzes">
                      <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 text-black">
                        View All Quizzes
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    <h3 className="text-lg font-bold">Simulations</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="border border-[hsla(var(--dashboard-border),0.5)] rounded-lg p-3 glow-effect">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Investment Simulation</h4>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Advanced
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Learn how to build a diversified portfolio</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> 15 min
                          </div>
                          <Link href="/dashboard/simulations/investment">
                            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                              Start
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard/simulations">
                      <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 text-black">
                        View All Simulations
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <AchievementProgressCard userData={userData} activities={activities} />

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-4">Badges</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  <div className="flex flex-col items-center gap-2 p-4 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg glow-effect">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Award className="h-8 w-8 text-[hsl(var(--dashboard-secondary))]" />
                    </div>
                    <span className="text-sm font-medium">First Login</span>
                    <Badge className="bg-green-600 text-white">Earned</Badge>
                  </div>

                  {userData.xp >= 100 && (
                    <div className="flex flex-col items-center gap-2 p-4 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg glow-effect">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <TrendingUp className="h-8 w-8 text-[hsl(var(--dashboard-primary))]" />
                      </div>
                      <span className="text-sm font-medium">Level Up</span>
                      <Badge className="bg-green-600 text-white">Earned</Badge>
                    </div>
                  )}

                  {activities.some((a) => a.activity_type === "quiz") && (
                    <div className="flex flex-col items-center gap-2 p-4 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg glow-effect">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <BookOpen className="h-8 w-8 text-[hsl(var(--dashboard-accent))]" />
                      </div>
                      <span className="text-sm font-medium">Quiz Taker</span>
                      <Badge className="bg-green-600 text-white">Earned</Badge>
                    </div>
                  )}

                  {activities.some((a) => a.activity_type === "game") && (
                    <div className="flex flex-col items-center gap-2 p-4 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg glow-effect">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Gamepad2 className="h-8 w-8 text-[hsl(var(--dashboard-info))]" />
                      </div>
                      <span className="text-sm font-medium">Game Player</span>
                      <Badge className="bg-green-600 text-white">Earned</Badge>
                    </div>
                  )}

                  {userData.coins >= 100 && (
                    <div className="flex flex-col items-center gap-2 p-4 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg glow-effect">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Wallet className="h-8 w-8 text-[hsl(var(--dashboard-warning))]" />
                      </div>
                      <span className="text-sm font-medium">Saver</span>
                      <Badge className="bg-green-600 text-white">Earned</Badge>
                    </div>
                  )}

                  {activities.some((a) => a.score === 100) && (
                    <div className="flex flex-col items-center gap-2 p-4 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg glow-effect">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Target className="h-8 w-8 text-[hsl(var(--dashboard-success))]" />
                      </div>
                      <span className="text-sm font-medium">Perfect Score</span>
                      <Badge className="bg-green-600 text-white">Earned</Badge>
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-2 p-4 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsla(var(--dashboard-muted),0.2)]">
                      <Flame className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Streak Master</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>

                  <div className="flex flex-col items-center gap-2 p-4 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsla(var(--dashboard-muted),0.2)]">
                      <Gift className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Collector</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>

                  <div className="flex flex-col items-center gap-2 p-4 border border-[hsla(var(--dashboard-border),0.5)] rounded-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsla(var(--dashboard-muted),0.2)]">
                      <Crown className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Financial Guru</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-black mb-4">User Profile</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-10 w-10 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{userData.name || userData.email.split("@")[0]}</h4>
                        <p className="text-muted-foreground">{userData.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-green-600 text-white">Level {level}</Badge>
                          <Badge className="bg-green-600 text-white">{userData.xp} XP</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Account Information</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border border-[hsla(var(--dashboard-border),0.5)] rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">Member Since</p>
                          <p className="font-medium">
                            {new Date().toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="border border-[hsla(var(--dashboard-border),0.5)] rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">Account Type</p>
                          <p className="font-medium">Standard</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 hover:bg-gray-100 text-black"
                        onClick={() => router.push("/settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-black mb-4">Learning Journey</h3>
                  <div className="space-y-4">
                    <div className="border border-[hsla(var(--dashboard-border),0.5)] rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Progress Overview</h4>
                        <Badge className="bg-green-600 text-white">{activities.length} Activities</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Quizzes</span>
                          <span>{activities.filter((a) => a.activity_type === "quiz").length} completed</span>
                        </div>
                        <AnimatedProgressBar
                          value={
                            activities.length > 0
                              ? (activities.filter((a) => a.activity_type === "quiz").length / activities.length) * 100
                              : 0
                          }
                        />

                        <div className="flex justify-between text-xs mt-3">
                          <span className="text-muted-foreground">Games</span>
                          <span>{activities.filter((a) => a.activity_type === "game").length} completed</span>
                        </div>
                        <AnimatedProgressBar
                          value={
                            activities.length > 0
                              ? (activities.filter((a) => a.activity_type === "game").length / activities.length) * 100
                              : 0
                          }
                        />

                        <div className="flex justify-between text-xs mt-3">
                          <span className="text-muted-foreground">Simulations</span>
                          <span>{activities.filter((a) => a.activity_type === "simulation").length} completed</span>
                        </div>
                        <AnimatedProgressBar
                          value={
                            activities.length > 0
                              ? (activities.filter((a) => a.activity_type === "simulation").length /
                                  activities.length) *
                                100
                              : 0
                          }
                        />
                      </div>
                    </div>

                    <div className="border border-[hsla(var(--dashboard-border),0.5)] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-[hsl(var(--dashboard-warning))]" />
                        <h4 className="text-sm font-medium">Learning Tip</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Diversify your learning by trying different activity types. Games can make complex financial
                        concepts more engaging, while quizzes help reinforce your knowledge.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button
                        className="bg-black text-white hover:bg-gray-800 w-full"
                        onClick={() => router.push("/dashboard/learning-path")}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        View Learning Path
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
