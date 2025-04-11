"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  DollarSign,
  Wallet,
  BarChart,
  TrendingUp,
  Clock,
  CheckCircle,
  Award,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { saveActivityProgress } from "@/actions/user-actions"
import { toast } from "@/components/ui/use-toast"

export default function InvestingSimulationPage() {
  const [step, setStep] = useState(1)
  const [monthlyIncome, setMonthlyIncome] = useState(3500)
  const [monthlyExpenses, setMonthlyExpenses] = useState(2000)
  const [initialInvestment, setInitialInvestment] = useState(5000)
  const [monthlyContribution, setMonthlyContribution] = useState(200)
  const [investmentHorizon, setInvestmentHorizon] = useState(10)
  const [riskTolerance, setRiskTolerance] = useState(50) // 0 (conservative) to 100 (aggressive)
  const [expectedReturn, setExpectedReturn] = useState(6) // Annual return percentage
  const [completed, setCompleted] = useState(false)

  const { userData, refreshUserData } = useAuth()

  // Calculate future value using compound interest formula
  const calculateFutureValue = () => {
    const annualRate = expectedReturn / 100
    const monthlyRate = annualRate / 12
    const totalMonths = investmentHorizon * 12

    // Future value of initial investment
    const fvInitial = initialInvestment * Math.pow(1 + monthlyRate, totalMonths)

    // Future value of monthly contributions (annuity)
    const fvContributions =
      monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)

    return Number((fvInitial + fvContributions).toFixed(2))
  }

  // Calculate total invested amount
  const calculateTotalInvested = () => {
    return initialInvestment + monthlyContribution * investmentHorizon * 12
  }

  const futureValue = calculateFutureValue()
  const totalInvested = calculateTotalInvested()
  const investmentGain = futureValue - totalInvested
  const disposableIncome = monthlyIncome - monthlyExpenses - monthlyContribution

  // Adjust expected return based on risk tolerance
  const handleRiskToleranceChange = (value: number) => {
    setRiskTolerance(value)
    // Map risk tolerance to expected return (simplified model)
    if (value <= 33) {
      setExpectedReturn(4) // Conservative
    } else if (value <= 66) {
      setExpectedReturn(6) // Moderate
    } else {
      setExpectedReturn(8) // Aggressive
    }
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      setCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const saveSimulationResults = async () => {
    if (!userData) return

    // Calculate score based on financial decisions
    const affordabilityScore = disposableIncome >= 0 ? 50 : 20
    const diversificationScore = monthlyContribution > 0 ? 30 : 10
    const totalScore = affordabilityScore + diversificationScore

    // Calculate rewards
    const xpEarned = 45
    const coinsEarned = 25

    try {
      const result = await saveActivityProgress(
        userData.id,
        "simulation",
        "Investing Basics",
        totalScore,
        xpEarned,
        coinsEarned,
      )

      if (result.success) {
        await refreshUserData()

        toast({
          title: "Simulation Completed!",
          description: `You earned ${xpEarned} XP and ${coinsEarned} Coins!`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error saving simulation progress:", error)
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleComplete = () => {
    setCompleted(true)
    saveSimulationResults()
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/simulations">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Investing Basics Simulation</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              Beginner
            </Badge>
          </div>
        </div>

        {!completed ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Investing Simulation</CardTitle>
                    <CardDescription>Learn the fundamentals of investing for long-term growth</CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">Step {step} of 4</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{step * 25}%</span>
                  </div>
                  <Progress value={step * 25} className="h-2" />
                </div>

                {step === 1 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Welcome to Investing Basics</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        In this simulation, you'll learn how to start investing by assessing your finances, choosing
                        investment amounts, and understanding risk and returns.
                      </p>
                      <div className="mt-4 rounded-md bg-muted p-3">
                        <h4 className="font-medium">Your Scenario:</h4>
                        <p className="text-sm text-muted-foreground">
                          You're a young professional looking to grow your wealth through investing. You need to balance
                          your income, expenses, and investment contributions.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="monthlyIncome">Monthly Income (After Taxes)</Label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="monthlyIncome"
                            type="number"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Your take-home pay after taxes and deductions
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="monthlyExpenses"
                            type="number"
                            value={monthlyExpenses}
                            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Your current monthly spending (e.g., rent, groceries, transportation)
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="initialInvestment">Initial Investment</Label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="initialInvestment"
                            type="number"
                            value={initialInvestment}
                            onChange={(e) => setInitialInvestment(Number(e.target.value))}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          The lump sum you can invest now
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Investment Contributions</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Decide how much you can contribute monthly to your investments and set your investment timeline.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="monthlyContribution" className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              Monthly Contribution
                            </Label>
                            <span className="text-sm">${monthlyContribution}</span>
                          </div>
                          <Slider
                            id="monthlyContribution"
                            min={0}
                            max={1000}
                            step={50}
                            value={[monthlyContribution]}
                            onValueChange={(value) => setMonthlyContribution(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$1000</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="investmentHorizon" className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              Investment Horizon (Years)
                            </Label>
                            <span className="text-sm">{investmentHorizon} years</span>
                          </div>
                          <Slider
                            id="investmentHorizon"
                            min={5}
                            max={30}
                            step={5}
                            value={[investmentHorizon]}
                            onValueChange={(value) => setInvestmentHorizon(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>5</span>
                            <span>30</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Risk and Return</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Choose your risk tolerance to estimate expected returns. Higher risk may lead to higher returns
                        but also greater volatility.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="riskTolerance" className="flex items-center gap-2">
                              <BarChart className="h-4 w-4 text-muted-foreground" />
                              Risk Tolerance
                            </Label>
                            <span className="text-sm">
                              {riskTolerance <= 33
                                ? "Conservative"
                                : riskTolerance <= 66
                                ? "Moderate"
                                : "Aggressive"}
                            </span>
                          </div>
                          <Slider
                            id="riskTolerance"
                            min={0}
                            max={100}
                            step={1}
                            value={[riskTolerance]}
                            onValueChange={(value) => handleRiskToleranceChange(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Conservative</span>
                            <span>Aggressive</span>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h3 className="text-lg font-medium">Investment Preview</h3>
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                              <span>Expected Annual Return:</span>
                              <span className="font-medium">{expectedReturn}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Initial Investment:</span>
                              <span className="font-medium">${initialInvestment}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monthly Contribution:</span>
                              <span className="font-medium">${monthlyContribution}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Investment Horizon:</span>
                              <span className="font-medium">{investmentHorizon} years</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Investment Summary</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Review your investment plan and financial outlook.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium">Investment Results</h3>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span>Initial Investment:</span>
                            <span className="font-medium">${initialInvestment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Contribution:</span>
                            <span className="font-medium">${monthlyContribution}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Invested:</span>
                            <span className="font-medium">${totalInvested.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expected Annual Return:</span>
                            <span className="font-medium">{expectedReturn}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Investment Horizon:</span>
                            <span className="font-medium">{investmentHorizon} years</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between">
                              <span>Future Value:</span>
                              <span className="font-medium">${futureValue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Investment Gain:</span>
                              <span
                                className={`font-medium ${
                                  investmentGain >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                ${investmentGain.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Disposable Income:</span>
                              <span
                                className={`font-medium ${
                                  disposableIncome >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                ${disposableIncome.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          {disposableIncome >= 0 ? (
                            <div className="rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <p className="text-sm">
                                Well done! Your investment plan is affordable with ${disposableIncome.toFixed(
                                  2,
                                )} left each month. Your investments could grow to ${futureValue.toFixed(
                                  2,
                                )} in {investmentHorizon} years.
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              <p className="text-sm">
                                Your monthly contributions exceed your disposable income by ${Math.abs(
                                  disposableIncome,
                                ).toFixed(2)}. Consider reducing contributions or expenses to balance your budget.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {step > 1 ? (
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                <Button onClick={handleNext}>{step < 4 ? "Next" : "Complete Simulation"}</Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Completed!</CardTitle>
                <CardDescription>
                  You've successfully completed the Investing Basics simulation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Award className="h-12 w-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Congratulations!</h3>
                    <p className="text-muted-foreground">
                      You've earned 45 XP and 25 Coins for completing this simulation
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Your Investment Summary</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Initial Investment:</span>
                      <span className="font-medium">${initialInvestment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Contribution:</span>
                      <span className="font-medium">${monthlyContribution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Invested:</span>
                      <span className="font-medium">${totalInvested.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Annual Return:</span>
                      <span className="font-medium">{expectedReturn}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Horizon:</span>
                      <span className="font-medium">{investmentHorizon} years</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span>Future Value:</span>
                        <span className="font-medium">${futureValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investment Gain:</span>
                        <span
                          className={`font-medium ${
                            investmentGain >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ${investmentGain.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Disposable Income:</span>
                        <span
                          className={`font-medium ${
                            disposableIncome >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ${disposableIncome.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {disposableIncome >= 0 ? (
                      <div className="rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <p className="text-sm">
                          Great job! Your investment plan leaves you with ${disposableIncome.toFixed(
                            2,
                          )} monthly and could grow to ${futureValue.toFixed(2)} in {investmentHorizon} years.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <p className="text-sm">
                          Your contributions exceed your income by ${Math.abs(disposableIncome).toFixed(
                            2,
                          )}. Adjust your contributions or expenses.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Key Takeaways</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Start investing early to benefit from compound interest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Align your risk tolerance with your investment goals and timeline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Regular contributions can significantly boost your portfolio over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Diversify your investments to manage risk effectively</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/dashboard/simulations">
                  <Button variant="outline">Back to Simulations</Button>
                </Link>
                <Link href="/dashboard/quizzes/investment">
                  <Button>Take Investing Quiz</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}