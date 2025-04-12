"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CreditCard, PiggyBank, AlertTriangle, Wallet, Building2, Target } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { saveActivityProgress } from "@/actions/user-actions"
import { toast } from "@/components/ui/use-toast"

type Challenge = {
  id: string
  title: string
  description: string
  reward: { xp: number; coins: number }
  completed: boolean
  progress: number
  target: number
  type: "savings" | "investment" | "budget" | "emergency"
}

type Achievement = {
  id: string
  title: string
  description: string
  reward: { xp: number; coins: number }
  unlocked: boolean
  icon: any
}

export default function BankingBasicsGame() {
  const { userData, refreshUserData } = useAuth()
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start")
  const [balance, setBalance] = useState(1000)
  const [savings, setSavings] = useState(0)
  const [investments, setInvestments] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(3000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(2000)
  const [currentMonth, setCurrentMonth] = useState(1)
  const [score, setScore] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalXPEarned, setTotalXPEarned] = useState(0)
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0)

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "emergency-fund",
      title: "Build Emergency Fund",
      description: "Save $5,000 in your emergency fund",
      reward: { xp: 3, coins: 5 },
      completed: false,
      progress: 0,
      target: 5000,
      type: "emergency",
    },
    {
      id: "investment-starter",
      title: "Investment Starter",
      description: "Invest $1,000 in your investment account",
      reward: { xp: 2, coins: 4 },
      completed: false,
      progress: 0,
      target: 1000,
      type: "investment",
    },
    {
      id: "savings-master",
      title: "Savings Master",
      description: "Save 20% of your income for 3 months",
      reward: { xp: 4, coins: 5 },
      completed: false,
      progress: 0,
      target: 3,
      type: "savings",
    },
    {
      id: "budget-pro",
      title: "Budget Pro",
      description: "Keep expenses below 70% of income for 3 months",
      reward: { xp: 3, coins: 4 },
      completed: false,
      progress: 0,
      target: 3,
      type: "budget",
    },
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-save",
      title: "First Save",
      description: "Make your first savings deposit",
      reward: { xp: 2, coins: 3 },
      unlocked: false,
      icon: PiggyBank,
    },
    {
      id: "first-investment",
      title: "First Investment",
      description: "Make your first investment",
      reward: { xp: 2, coins: 3 },
      unlocked: false,
      icon: Building2,
    },
    {
      id: "emergency-ready",
      title: "Emergency Ready",
      description: "Build a 3-month emergency fund",
      reward: { xp: 3, coins: 4 },
      unlocked: false,
      icon: AlertTriangle,
    },
    {
      id: "budget-master",
      title: "Budget Master",
      description: "Successfully budget for 6 months",
      reward: { xp: 4, coins: 5 },
      unlocked: false,
      icon: CreditCard,
    },
  ])

  const handleSave = (amount: number) => {
    if (amount > balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough money in your balance",
        variant: "destructive",
      })
      return
    }

    setBalance((prev) => prev - amount)
    setSavings((prev) => prev + amount)
    setScore((prev) => prev + 10)

    // Check achievements
    if (!achievements.find((a) => a.id === "first-save")?.unlocked) {
      const newAchievements = achievements.map((a) => (a.id === "first-save" ? { ...a, unlocked: true } : a))
      setAchievements(newAchievements)
      awardAchievement("first-save")
    }

    // Update challenge progress
    const newChallenges = challenges.map((c) => {
      if (c.type === "emergency") {
        const newProgress = c.progress + amount
        if (newProgress >= c.target && !c.completed) {
          awardChallenge(c.id)
        }
        return { ...c, progress: newProgress }
      }
      return c
    })
    setChallenges(newChallenges)
  }

  const handleInvest = (amount: number) => {
    if (amount > balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough money in your balance",
        variant: "destructive",
      })
      return
    }

    setBalance((prev) => prev - amount)
    setInvestments((prev) => prev + amount)
    setScore((prev) => prev + 15)

    // Check achievements
    if (!achievements.find((a) => a.id === "first-investment")?.unlocked) {
      const newAchievements = achievements.map((a) => (a.id === "first-investment" ? { ...a, unlocked: true } : a))
      setAchievements(newAchievements)
      awardAchievement("first-investment")
    }

    // Update challenge progress
    const newChallenges = challenges.map((c) => {
      if (c.type === "investment") {
        const newProgress = c.progress + amount
        if (newProgress >= c.target && !c.completed) {
          awardChallenge(c.id)
        }
        return { ...c, progress: newProgress }
      }
      return c
    })
    setChallenges(newChallenges)
  }

  const awardAchievement = async (achievementId: string) => {
    const achievement = achievements.find((a) => a.id === achievementId)
    if (!achievement || !userData) return

    try {
      setIsSubmitting(true)
      const result = await saveActivityProgress(
        userData.id,
        "game",
        achievement.title,
        score,
        achievement.reward.xp,
        achievement.reward.coins,
      )

      if (result.success) {
        setTotalXPEarned((prev) => prev + achievement.reward.xp)
        setTotalCoinsEarned((prev) => prev + achievement.reward.coins)
        await refreshUserData()
        toast({
          title: "Achievement Unlocked!",
          description: `${achievement.title} - ${achievement.description}`,
          className: "bg-green-600 text-white",
        })
      }
    } catch (error) {
      console.error("Error saving achievement:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const awardChallenge = async (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge || !userData) return

    try {
      setIsSubmitting(true)
      const result = await saveActivityProgress(
        userData.id,
        "game",
        challenge.title,
        score,
        challenge.reward.xp,
        challenge.reward.coins,
      )

      if (result.success) {
        setTotalXPEarned((prev) => prev + challenge.reward.xp)
        setTotalCoinsEarned((prev) => prev + challenge.reward.coins)
        await refreshUserData()
        toast({
          title: "Challenge Complete!",
          description: `${challenge.title} - ${challenge.description}`,
          className: "bg-green-600 text-white",
        })
      }
    } catch (error) {
      console.error("Error saving challenge:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const advanceMonth = () => {
    setCurrentMonth((prev) => prev + 1)
    setBalance((prev) => prev + monthlyIncome - monthlyExpenses)
    setScore((prev) => prev + 20)

    // Check monthly challenges
    const newChallenges = challenges.map((c) => {
      if (c.type === "savings" && savings >= monthlyIncome * 0.2) {
        const newProgress = c.progress + 1
        if (newProgress >= c.target && !c.completed) {
          awardChallenge(c.id)
        }
        return { ...c, progress: newProgress }
      }
      if (c.type === "budget" && monthlyExpenses <= monthlyIncome * 0.7) {
        const newProgress = c.progress + 1
        if (newProgress >= c.target && !c.completed) {
          awardChallenge(c.id)
        }
        return { ...c, progress: newProgress }
      }
      return c
    })
    setChallenges(newChallenges)

    // Check achievements
    if (savings >= monthlyIncome * 3 && !achievements.find((a) => a.id === "emergency-ready")?.unlocked) {
      const newAchievements = achievements.map((a) => (a.id === "emergency-ready" ? { ...a, unlocked: true } : a))
      setAchievements(newAchievements)
      awardAchievement("emergency-ready")
    }

    if (currentMonth >= 6 && !achievements.find((a) => a.id === "budget-master")?.unlocked) {
      const newAchievements = achievements.map((a) => (a.id === "budget-master" ? { ...a, unlocked: true } : a))
      setAchievements(newAchievements)
      awardAchievement("budget-master")
    }
  }

  if (gameState === "start") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl border-gray-200">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-black">Banking Basics Challenge</CardTitle>
            <CardDescription className="text-center text-lg text-gray-600">
              Complete financial challenges and earn rewards!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Badge className="text-lg bg-black text-white">Earn XP & Coins</Badge>
              <Badge className="text-lg bg-black text-white">Complete Challenges</Badge>
              <Badge className="text-lg bg-black text-white">Unlock Achievements</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => setGameState("playing")}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg"
            >
              Start Challenge
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/dashboard/games/app">
            <Button variant="outline" size="icon" className="border-black text-black hover:bg-gray-100">
              <ArrowLeft />
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Badge className="bg-black text-white">Month {currentMonth}</Badge>
            <Badge className="bg-black text-white">Score: {score}</Badge>
            <Badge className="bg-black text-white">XP: {totalXPEarned}</Badge>
            <Badge className="bg-black text-white">Coins: {totalCoinsEarned}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-black">
                <span>Balance</span>
                <Wallet className="text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">${balance.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-black">
                <span>Savings</span>
                <PiggyBank className="text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">${savings.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-black">
                <span>Investments</span>
                <Building2 className="text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">${investments.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Challenges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Target className="text-green-600" />
                      <span className="text-black">{challenge.title}</span>
                    </div>
                    <Badge
                      variant={challenge.completed ? "default" : "secondary"}
                      className={challenge.completed ? "bg-green-600 text-white" : "bg-gray-200 text-black"}
                    >
                      {challenge.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <Progress value={(challenge.progress / challenge.target) * 100} className="bg-gray-200" />
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-green-100" : "bg-gray-100"}`}>
                    <achievement.icon
                      className={`h-6 w-6 ${achievement.unlocked ? "text-green-600" : "text-gray-400"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-black">{achievement.title}</div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="default" className="bg-green-600 text-white">
                      Unlocked
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={() => handleSave(100)} className="bg-black hover:bg-gray-800 text-white">
            Save $100
          </Button>
          <Button onClick={() => handleInvest(100)} className="bg-black hover:bg-gray-800 text-white">
            Invest $100
          </Button>
          <Button onClick={advanceMonth} className="bg-black hover:bg-gray-800 text-white">
            Advance Month
          </Button>
        </div>
      </div>
    </div>
  )
}
