"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Award, Heart, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { saveActivityProgress } from "@/actions/user-actions"

// Define types
type Option = {
  id: string
  text: string
  impact: number
  feedback: string
}

type Scenario = {
  id: number
  title: string
  description: string
  options: Option[]
}

type GameState = "start" | "playing" | "result"

// Game scenarios
const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Credit Card Payment",
    description: "You have a credit card bill due tomorrow. What do you do?",
    options: [
      {
        id: "a",
        text: "Pay the minimum amount due",
        impact: -10,
        feedback: "Paying only the minimum increases your interest charges and can hurt your score over time.",
      },
      {
        id: "b",
        text: "Pay the full balance",
        impact: 20,
        feedback: "Excellent! Paying your full balance on time is one of the best ways to build credit.",
      },
      {
        id: "c",
        text: "Skip this month's payment",
        impact: -50,
        feedback: "Missing payments can severely damage your credit score and stay on your report for years.",
      },
      {
        id: "d",
        text: "Pay more than the minimum but less than the full amount",
        impact: 5,
        feedback: "Better than the minimum, but carrying a balance still means paying interest.",
      },
    ],
  },
  {
    id: 2,
    title: "New Credit Card Offer",
    description: "You received a pre-approved credit card offer in the mail with a high limit. What do you do?",
    options: [
      {
        id: "a",
        text: "Apply immediately to increase your available credit",
        impact: -15,
        feedback: "Applying for multiple cards in a short period can hurt your score through hard inquiries.",
      },
      {
        id: "b",
        text: "Research the card terms before deciding",
        impact: 15,
        feedback: "Smart move! Understanding the terms helps you make an informed decision.",
      },
      {
        id: "c",
        text: "Apply for this and several other cards to compare",
        impact: -30,
        feedback: "Multiple applications create many hard inquiries, which can significantly lower your score.",
      },
      {
        id: "d",
        text: "Ignore it since you already have enough credit",
        impact: 10,
        feedback: "Good restraint. Only apply for credit you need and can manage responsibly.",
      },
    ],
  },
  {
    id: 3,
    title: "Credit Utilization",
    description:
      "Your credit card has a $5,000 limit. What's the ideal balance to maintain for the best credit score impact?",
    options: [
      {
        id: "a",
        text: "Keep it maxed out at $5,000 to show you can handle credit",
        impact: -40,
        feedback: "High utilization (using most of your available credit) can significantly hurt your score.",
      },
      {
        id: "b",
        text: "Keep the balance around $1,500 (30%)",
        impact: 0,
        feedback: "30% utilization is the maximum recommended, but lower is better for your score.",
      },
      {
        id: "c",
        text: "Keep the balance under $500 (10%)",
        impact: 25,
        feedback: "Excellent! Keeping utilization under 10% is ideal for your credit score.",
      },
      {
        id: "d",
        text: "Never use the card at all",
        impact: -5,
        feedback: "Having no activity can prevent you from building a positive payment history.",
      },
    ],
  },
  {
    id: 4,
    title: "Credit Check",
    description: "You're shopping for a car loan. What's the best approach to comparing rates from different lenders?",
    options: [
      {
        id: "a",
        text: "Apply with one lender at a time over several months",
        impact: -20,
        feedback: "Spreading applications over months means each inquiry affects your score separately.",
      },
      {
        id: "b",
        text: "Apply with multiple lenders within a 14-day period",
        impact: 15,
        feedback: "Correct! Multiple inquiries for the same type of loan within a short period count as one inquiry.",
      },
      {
        id: "c",
        text: "Ask a friend with good credit to apply for you",
        impact: -30,
        feedback: "This could be considered fraud and doesn't help build your own credit history.",
      },
      {
        id: "d",
        text: "Accept the first offer without shopping around",
        impact: -5,
        feedback: "While this minimizes inquiries, you might miss out on better rates that could save you money.",
      },
    ],
  },
  {
    id: 5,
    title: "Old Credit Card",
    description: "You have an old credit card with no annual fee that you rarely use. What should you do with it?",
    options: [
      {
        id: "a",
        text: "Close the account since you don't use it",
        impact: -25,
        feedback: "Closing old accounts can hurt your credit age and utilization ratio, both important factors.",
      },
      {
        id: "b",
        text: "Keep it open and use it occasionally",
        impact: 20,
        feedback: "Great choice! This maintains your credit history length and keeps the account active.",
      },
      {
        id: "c",
        text: "Max it out since you don't care about this card",
        impact: -40,
        feedback: "This hurts your utilization ratio and could lead to missed payments if you forget about it.",
      },
      {
        id: "d",
        text: "Cut up the card but don't close the account",
        impact: 10,
        feedback: "This works if you're not tempted to use it, but make sure you check for fraud regularly.",
      },
    ],
  },
]

export default function CreditScoreGamePage() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(650) // Starting credit score
  const [lives, setLives] = useState(3)
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const { userData, refreshUserData } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStart = () => {
    setGameState("playing")
    setCurrentScenario(0)
    setScore(650)
    setLives(3)
    setSelectedOption(null)
    setFeedback(null)
    setGameCompleted(false)
  }

  const handleOptionSelect = (option: Option) => {
    if (selectedOption) return // Prevent multiple selections

    setSelectedOption(option)
    setFeedback(option.feedback)

    // Update score
    const newScore = Math.max(300, Math.min(850, score + option.impact))
    setScore(newScore)

    // Update lives if it was a bad choice
    if (option.impact < 0) {
      setLives(lives - 1)
    }

    // Check if game should end
    if (lives <= 1 && option.impact < 0) {
      setTimeout(() => {
        setGameState("result")
        handleGameEnd()
      }, 2000)
    } else {
      // Move to next scenario after delay
      setTimeout(() => {
        if (currentScenario < scenarios.length - 1) {
          setCurrentScenario(currentScenario + 1)
          setSelectedOption(null)
          setFeedback(null)
        } else {
          setGameCompleted(true)
          setGameState("result")
          handleGameEnd()
        }
      }, 2000)
    }
  }

  const getScoreColor = () => {
    if (score >= 750) return "text-green-600"
    if (score >= 650) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreCategory = () => {
    if (score >= 800) return "Excellent"
    if (score >= 740) return "Very Good"
    if (score >= 670) return "Good"
    if (score >= 580) return "Fair"
    return "Poor"
  }

  const getReward = () => {
    if (score >= 800) return { xp: 75, coins: 50 }
    if (score >= 740) return { xp: 50, coins: 35 }
    if (score >= 670) return { xp: 35, coins: 25 }
    if (score >= 580) return { xp: 25, coins: 15 }
    return { xp: 15, coins: 10 }
  }

  const handleGameEnd = async () => {
    if (!userData || isSubmitting) return

    // Calculate final score
    const finalScore = Math.round(score)

    // Calculate rewards based on performance
    const xpEarned = getReward().xp
    const coinsEarned = getReward().coins

    try {
      setIsSubmitting(true)
      const result = await saveActivityProgress(
        userData.id,
        "game",
        "Credit Score Adventure",
        finalScore,
        xpEarned,
        coinsEarned,
      )

      if (result.success) {
        await refreshUserData()
        toast({
          title: "Game Completed!",
          description: `You earned ${xpEarned} XP and ${coinsEarned} Coins!`,
          className: "bg-green-600 text-white",
        })
      } else {
        throw new Error("Failed to save progress")
      }
    } catch (error) {
      console.error("Error saving game progress:", error)
      toast({
        title: "Error",
        description: "Failed to save progress.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/games/app">
              <Button variant="outline" size="icon" className="h-8 w-8 border-black text-black hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-black">Credit Score Adventure</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm border-black text-black">
              Level 2
            </Badge>
          </div>
        </div>

        {gameState === "start" && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Welcome to Credit Score Adventure!</CardTitle>
              <CardDescription className="text-gray-600">
                Make smart financial decisions to improve your credit score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-black">How to Play</h3>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-black/10 p-1 mt-0.5">
                      <CreditCard className="h-3 w-3 text-black" />
                    </div>
                    <span>You'll be presented with real-life financial scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-black/10 p-1 mt-0.5">
                      <CreditCard className="h-3 w-3 text-black" />
                    </div>
                    <span>Choose the best option to improve your credit score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-black/10 p-1 mt-0.5">
                      <CreditCard className="h-3 w-3 text-black" />
                    </div>
                    <span>Bad decisions will cost you lives - you have 3 lives total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-black/10 p-1 mt-0.5">
                      <CreditCard className="h-3 w-3 text-black" />
                    </div>
                    <span>Try to reach the highest credit score possible!</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-black">Level 2: Credit Management</h3>
                <p className="mt-2 text-sm text-gray-600">
                  In this level, you'll learn about managing credit cards, loans, and how different actions affect your
                  credit score. Make smart choices to build excellent credit!
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStart} className="w-full bg-black text-white hover:bg-gray-800">
                Start Game
              </Button>
            </CardFooter>
          </Card>
        )}

        {gameState === "playing" && (
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-black">
                    Scenario {currentScenario + 1} of {scenarios.length}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{scenarios[currentScenario].title}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`h-5 w-5 ${i < lives ? "text-red-500 fill-red-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className={getScoreColor()}>{score}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-black">
                  <span>Progress</span>
                  <span>{Math.round((currentScenario / scenarios.length) * 100)}%</span>
                </div>
                <Progress value={(currentScenario / scenarios.length) * 100} className="h-2 bg-gray-200" />
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-black">{scenarios[currentScenario].description}</p>
              </div>

              <div className="space-y-3">
                {scenarios[currentScenario].options.map((option) => (
                  <button
                    key={option.id}
                    className={`w-full rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50 ${
                      selectedOption?.id === option.id
                        ? option.impact >= 0
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : ""
                    }`}
                    onClick={() => handleOptionSelect(option)}
                    disabled={selectedOption !== null}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-black">{option.text}</span>
                      {selectedOption?.id === option.id &&
                        (option.impact >= 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ))}
                    </div>
                  </button>
                ))}
              </div>

              {feedback && selectedOption && (
                <div
                  className={`rounded-md p-3 ${
                    selectedOption.impact >= 0 ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {selectedOption.impact >= 0 ? (
                      <CheckCircle className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {selectedOption.impact >= 0 ? "Good choice!" : "Not the best choice"}
                      </p>
                      <p className="text-sm">{feedback}</p>
                      <p className="mt-1 text-sm font-medium">
                        Credit Score Impact: {selectedOption.impact > 0 ? "+" : ""}
                        {selectedOption.impact} points
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {gameState === "result" && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">{gameCompleted ? "Level Complete!" : "Game Over"}</CardTitle>
              <CardDescription className="text-gray-600">
                {gameCompleted
                  ? "You've successfully completed Level 2 of Credit Score Adventure!"
                  : "You've run out of lives. Better luck next time!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="rounded-full bg-gray-100 p-4">
                  <Award className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-black">
                    Final Credit Score: <span className={getScoreColor()}>{score}</span>
                  </h3>
                  <p className="text-gray-600">Credit Rating: {getScoreCategory()}</p>
                  {gameCompleted && (
                    <p className="mt-2 text-gray-600">
                      You've earned {getReward().xp} XP and {getReward().coins} Coins!
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-black">Credit Score Breakdown</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-black">
                    <span>Starting Score:</span>
                    <span className="font-medium">650</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Final Score:</span>
                    <span className={`font-medium ${getScoreColor()}`}>{score}</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Change:</span>
                    <span className={`font-medium ${score - 650 >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {score - 650 >= 0 ? "+" : ""}
                      {score - 650}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-black">Key Takeaways</h3>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-black/10 p-1 mt-0.5">
                      <CreditCard className="h-3 w-3 text-black" />
                    </div>
                    <span>
                      Always pay your bills on time - payment history is the biggest factor in your credit score
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-black/10 p-1 mt-0.5">
                      <CreditCard className="h-3 w-3 text-black" />
                    </div>
                    <span>Keep your credit utilization low - aim for less than 30% of your available credit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-black/10 p-1 mt-0.5">
                      <CreditCard className="h-3 w-3 text-black" />
                    </div>
                    <span>Don't apply for too many credit accounts at once - this can lower your score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-black/10 p-1 mt-0.5">
                      <CreditCard className="h-3 w-3 text-black" />
                    </div>
                    <span>Keep old accounts open to maintain a longer credit history</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleStart} className="border-black text-black hover:bg-gray-100">
                Play Again
              </Button>
              {gameCompleted ? (
                <Link href="/dashboard/games/app">
                  <Button className="bg-black text-white hover:bg-gray-800">Back to Games</Button>
                </Link>
              ) : (
                <Button onClick={handleStart} className="bg-black text-white hover:bg-gray-800">
                  Try Again
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
