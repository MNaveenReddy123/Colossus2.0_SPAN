"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { saveActivityProgress } from "@/actions/user-actions"
import { toast } from "@/components/ui/use-toast"

type Obstacle = { id: number; type: "coin" | "atmFee" | "overdraft"; value: number; x: number }

export default function BankVaultDash() {
  const router = useRouter()
  const { userData, refreshUserData } = useAuth()
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start")
  const [balance, setBalance] = useState(0) // Cash in hand
  const [savings, setSavings] = useState(0)
  const [checking, setChecking] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [collected, setCollected] = useState(0) // Total coins collected for rewards
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Spawn Obstacles
  const spawnObstacle = () => {
    const types = [
      { type: "coin", value: 10, chance: 0.6 },
      { type: "atmFee", value: -5, chance: 0.3 },
      { type: "overdraft", value: -25, chance: 0.1 },
    ]
    const roll = Math.random()
    let cumulative = 0
    const selected = types.find((t) => {
      cumulative += t.chance
      return roll < cumulative
    })!
    return {
      id: Date.now(),
      type: selected.type as "coin" | "atmFee" | "overdraft",
      value: selected.value,
      x: Math.random() * 80,
    }
  }

  // Game Loop
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((t) => t - 1)
        setObstacles((o) => [...o, spawnObstacle()].slice(-5)) // Keep max 5 obstacles
        setSavings((s) => s * 1.02) // 2% interest per second
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      setGameState("end")
      handleGameEnd()
    }
  }, [timeLeft, gameState])

  // Collect or Hit Obstacle
  const handleCollect = (id: number) => {
    const obstacle = obstacles.find((o) => o.id === id)
    if (!obstacle) return
    setObstacles((o) => o.filter((o) => o.id !== id))
    if (obstacle.type === "coin") {
      setBalance((b) => b + obstacle.value)
      setCollected((c) => c + obstacle.value)
      toast({ title: "Cha-Ching!", description: "+$10!" })
    } else {
      setBalance((b) => Math.max(0, b + obstacle.value))
      toast({
        title: "Ouch!",
        description: `${obstacle.type === "atmFee" ? "-$5 ATM Fee" : "-$25 Overdraft"}!`,
        variant: "destructive",
      })
    }
  }

  // Deposit Actions
  const deposit = (type: "savings" | "checking") => {
    if (balance > 0 && gameState === "playing") {
      if (type === "savings") setSavings((s) => s + balance)
      else setChecking((c) => c + balance)
      setBalance(0)
      toast({ title: "Deposited!", description: `To ${type}!` })
    }
  }

  // Format Time
  const formatTime = (seconds: number) => `${seconds.toString().padStart(2, "0")}`

  // Calculate Rewards
  const calculateRewards = () => {
    const xpEarned = Math.min(100, Math.floor(collected / 5))
    const coinsEarned = Math.min(50, Math.floor(collected / 10))
    return { xpEarned, coinsEarned }
  }

  // Handle Game End
  const handleGameEnd = async () => {
    if (!userData || isSubmitting) return
    const { xpEarned, coinsEarned } = calculateRewards()
    try {
      setIsSubmitting(true)
      const totalWealth = balance + savings + checking
      const result = await saveActivityProgress(
        userData.id,
        "game",
        "Bank Vault Dash",
        Math.round(totalWealth),
        xpEarned,
        coinsEarned,
      )
      if (result.success) {
        await refreshUserData()
        toast({
          title: "Vault Dash Complete!",
          description: `You earned ${xpEarned} XP and ${coinsEarned} Coins!`,
          className: "bg-green-600 text-white",
        })
      }
    } catch (error) {
      console.error("Error saving game progress:", error)
      toast({ title: "Error", description: "Failed to save progress.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between w-full max-w-4xl mb-6"
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/games">
            <Button variant="outline" size="icon" className="bg-white text-black border-black hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-extrabold text-black">Bank Vault Dash</h1>
        </div>
        <Badge className="bg-black text-white text-sm font-semibold">Fast-Paced</Badge>
      </motion.div>

      {/* Game Card */}
      <Card className="w-full max-w-4xl bg-white border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-black text-center">Bank Vault Dash</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Run, collect, and save—don't get fee'd!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* HUD */}
          <motion.div
            className="flex justify-between text-black font-semibold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              animate={{ scale: timeLeft < 10 ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: timeLeft < 10 ? Number.POSITIVE_INFINITY : 0, duration: 0.5 }}
            >
              ⏳ {formatTime(timeLeft)}
            </motion.span>
            <span>💰 Cash: ${balance.toFixed(0)}</span>
            <span>🏦 Savings: ${savings.toFixed(0)}</span>
            <span>💳 Checking: ${checking.toFixed(0)}</span>
          </motion.div>

          {/* Start Screen */}
          {gameState === "start" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <h3 className="text-2xl font-bold text-black">Welcome to the Vault!</h3>
              <p className="text-gray-700">
                Dash through the vault, grab coins, and dodge fees. Deposit to Savings (2% interest) or Checking. Hit
                $500 to level up!
              </p>
              <Button
                onClick={() => setGameState("playing")}
                className="bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800"
              >
                Start the Dash
              </Button>
            </motion.div>
          )}

          {/* Playing Screen */}
          {gameState === "playing" && (
            <div className="space-y-6">
              {/* Vault Runner */}
              <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
                {obstacles.map((obstacle) => (
                  <motion.div
                    key={obstacle.id}
                    initial={{ y: -50 }}
                    animate={{ y: 220 }}
                    transition={{ duration: 2, ease: "linear" }}
                    onAnimationComplete={() => setObstacles((o) => o.filter((o) => o.id !== obstacle.id))}
                    className={`absolute top-0 cursor-pointer ${obstacle.type === "coin" ? "text-green-600" : "text-red-600"}`}
                    style={{ left: `${obstacle.x}%` }}
                    onClick={() => handleCollect(obstacle.id)}
                  >
                    {obstacle.type === "coin" ? "💰" : obstacle.type === "atmFee" ? "🏧" : "⚠️"}
                    <span className="text-sm">{obstacle.value > 0 ? `+${obstacle.value}` : obstacle.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Deposit Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => deposit("savings")}
                  className="bg-black hover:bg-gray-800 text-white rounded-full"
                  disabled={balance === 0}
                >
                  Deposit to Savings
                </Button>
                <Button
                  onClick={() => deposit("checking")}
                  className="bg-black hover:bg-gray-800 text-white rounded-full"
                  disabled={balance === 0}
                >
                  Deposit to Checking
                </Button>
              </div>

              {/* Goal Progress */}
              <div className="text-black text-center">
                <p>Goal: ${(balance + savings + checking).toFixed(0)} / $500</p>
                <motion.div
                  className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((balance + savings + checking) / 500, 1) * 100}%` }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-full bg-green-600" />
                </motion.div>
              </div>
            </div>
          )}

          {/* End Screen */}
          <AnimatePresence>
            {gameState === "end" && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 space-y-6"
              >
                <motion.div
                  className="rounded-full bg-gray-100 p-6 inline-block"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Award className="h-16 w-16 text-green-600" />
                </motion.div>
                <h3 className="text-3xl font-bold text-black">
                  {balance + savings + checking >= 500 ? "Vault Master!" : "Dash Done!"}
                </h3>
                <motion.p
                  className="text-2xl text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Total Wealth: ${(balance + savings + checking).toFixed(0)}
                </motion.p>
                {userData && (
                  <motion.div
                    className="text-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <p>
                      You earned {calculateRewards().xpEarned} XP & {calculateRewards().coinsEarned} Coins!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/games/app")}
            className="bg-white text-black border-black hover:bg-gray-100"
          >
            Back to Games
          </Button>
          {gameState === "end" && (
            <Button
              onClick={() => {
                setBalance(0)
                setSavings(0)
                setChecking(0)
                setTimeLeft(60)
                setObstacles([])
                setCollected(0)
                setGameState("start")
              }}
              disabled={isSubmitting}
              className="bg-black text-white rounded-full shadow-lg hover:bg-gray-800"
            >
              {isSubmitting ? "Saving..." : "Dash Again"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Footer Stats */}
      {userData && (
        <motion.div
          className="flex justify-between text-black mt-6 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>XP: {userData.xp + (gameState === "end" ? calculateRewards().xpEarned : 0)}</p>
          <p>Coins: {userData.coins + (gameState === "end" ? calculateRewards().coinsEarned : 0)}</p>
        </motion.div>
      )}
    </div>
  )
}
