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
  GraduationCap,
  Wallet,
  Clock,
  BarChart,
  CheckCircle,
  Award,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { saveActivityProgress } from "@/actions/user-actions"
import { toast } from "@/components/ui/use-toast"

export default function StudentLoanSimulationPage() {
  const [step, setStep] = useState(1)
  const [loanAmount, setLoanAmount] = useState(30000)
  const [interestRate, setInterestRate] = useState(5)
  const [loanTerm, setLoanTerm] = useState(10)
  const [monthlyIncome, setMonthlyIncome] = useState(2500)
  const [monthlyExpenses, setMonthlyExpenses] = useState(1500)
  const [extraPayment, setExtraPayment] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)

  const { userData, refreshUserData } = useAuth()

  // Calculate monthly payment using the loan amortization formula
  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    return Number(monthlyPayment.toFixed(2))
  }

  // Calculate total interest paid over the loan term
  const calculateTotalInterest = () => {
    const monthlyPayment = calculateMonthlyPayment()
    const totalPaid = monthlyPayment * loanTerm * 12
    return Number((totalPaid - loanAmount).toFixed(2))
  }

  // Calculate monthly payment with extra payments
  const calculateAdjustedLoanTerm = () => {
    let remainingBalance = loanAmount
    let months = 0
    const monthlyRate = interestRate / 100 / 12
    const monthlyPayment = calculateMonthlyPayment() + extraPayment

    while (remainingBalance > 0 && months < loanTerm * 12) {
      const interest = remainingBalance * monthlyRate
      const principal = monthlyPayment - interest
      remainingBalance -= principal
      months++
    }

    return Number((months / 12).toFixed(2))
  }

  const monthlyPayment = calculateMonthlyPayment()
  const totalInterest = calculateTotalInterest()
  const adjustedLoanTerm = calculateAdjustedLoanTerm()
  const disposableIncome = monthlyIncome - monthlyExpenses - monthlyPayment - extraPayment

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      setCompleted(true)
      saveSimulationResults()
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
    const affordabilityScore = disposableIncome >= 0 ? 50 : 0
    const repaymentScore = extraPayment > 0 ? 30 : 10
    const totalScore = affordabilityScore + repaymentScore

    // Calculate rewards - smaller and more incremental
    const earnedXp = 5
    const earnedCoins = 10

    try {
      const result = await saveActivityProgress(
        userData.id,
        "simulation",
        "Student Loan Management",
        totalScore,
        earnedXp,
        earnedCoins,
      )

      if (result.success) {
        setXpEarned(earnedXp)
        setCoinsEarned(earnedCoins)
        await refreshUserData()

        toast({
          title: "Simulation Completed!",
          description: `You earned ${earnedXp} XP and ${earnedCoins} Coins!`,
          className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white",
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
            <h2 className="text-3xl font-bold tracking-tight">Student Loan Management Simulation</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              Intermediate
            </Badge>
          </div>
        </div>

        {!completed ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Loan Management</CardTitle>
                    <CardDescription>Learn to manage and repay your student loans effectively</CardDescription>
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
                      <h3 className="text-lg font-medium">Welcome to Student Loan Management</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        In this simulation, you'll learn how to manage student loans by understanding loan terms,
                        calculating payments, and exploring repayment strategies.
                      </p>
                      <div className="mt-4 rounded-md bg-muted p-3">
                        <h4 className="font-medium">Your Scenario:</h4>
                        <p className="text-sm text-muted-foreground">
                          You're a recent graduate with a student loan to repay. You have a job and need to balance loan
                          payments with living expenses.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loanAmount">Total Loan Amount</Label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="loanAmount"
                            type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          This is the total amount you borrowed for your education
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="interestRate"
                            type="number"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          The annual interest rate on your loan
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="loanTerm"
                            type="number"
                            value={loanTerm}
                            onChange={(e) => setLoanTerm(Number(e.target.value))}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          The number of years to repay the loan
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Your Financial Situation</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Let's assess your income and expenses to understand how much you can allocate toward loan
                        payments.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="monthlyIncome" className="flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-muted-foreground" />
                              Monthly Income (After Taxes)
                            </Label>
                            <span className="text-sm">${monthlyIncome}</span>
                          </div>
                          <Slider
                            id="monthlyIncome"
                            min={1000}
                            max={5000}
                            step={100}
                            value={[monthlyIncome]}
                            onValueChange={(value) => setMonthlyIncome(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$1000</span>
                            <span>$5000</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="monthlyExpenses" className="flex items-center gap-2">
                              <BarChart className="h-4 w-4 text-muted-foreground" />
                              Monthly Expenses
                            </Label>
                            <span className="text-sm">${monthlyExpenses}</span>
                          </div>
                          <Slider
                            id="monthlyExpenses"
                            min={500}
                            max={4000}
                            step={50}
                            value={[monthlyExpenses]}
                            onValueChange={(value) => setMonthlyExpenses(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$500</span>
                            <span>$4000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Loan Repayment Strategy</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Explore how extra payments can reduce your loan term and interest costs.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="extraPayment" className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              Extra Monthly Payment
                            </Label>
                            <span className="text-sm">${extraPayment}</span>
                          </div>
                          <Slider
                            id="extraPayment"
                            min={0}
                            max={500}
                            step={25}
                            value={[extraPayment]}
                            onValueChange={(value) => setExtraPayment(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$500</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium">Repayment Preview</h3>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span>Standard Monthly Payment:</span>
                            <span className="font-medium">${monthlyPayment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Interest (Standard):</span>
                            <span className="font-medium">${totalInterest}</span>
                          </div>
                          {extraPayment > 0 && (
                            <>
                              <div className="flex justify-between">
                                <span>Adjusted Loan Term:</span>
                                <span className="font-medium">{adjustedLoanTerm} years</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Interest Saved:</span>
                                <span className="font-medium">
                                  $
                                  {(
                                    totalInterest -
                                    (monthlyPayment + extraPayment) * adjustedLoanTerm * 12 +
                                    loanAmount
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Financial Summary</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Review your loan repayment plan and financial balance.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium">Loan and Budget Summary</h3>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span>Loan Amount:</span>
                            <span className="font-medium">${loanAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Payment:</span>
                            <span className="font-medium">${monthlyPayment + extraPayment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Loan Term:</span>
                            <span className="font-medium">
                              {extraPayment > 0 ? adjustedLoanTerm : loanTerm} years
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Interest Paid:</span>
                            <span className="font-medium">
                              $
                              {extraPayment > 0
                                ? (
                                  (monthlyPayment + extraPayment) * adjustedLoanTerm * 12 -
                                  loanAmount
                                ).toFixed(2)
                                : totalInterest}
                            </span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between">
                              <span>Disposable Income:</span>
                              <span
                                className={`font-medium ${disposableIncome >= 0 ? "text-green-600" : "text-red-600"
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
                                Well done! You can afford your loan payments with ${disposableIncome.toFixed(
                                  2,
                                )} left each month.
                                {disposableIncome > 200 &&
                                  " Consider increasing extra payments to save on interest."}
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              <p className="text-sm">
                                Your payments exceed your disposable income by ${Math.abs(
                                  disposableIncome,
                                ).toFixed(2)}. Consider reducing expenses or extending the loan term.
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
                  You've successfully completed the Student Loan Management simulation
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
                      You've earned {xpEarned} XP and {coinsEarned} Coins for completing this simulation
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Your Loan Summary</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span className="font-medium">${loanAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-medium">${monthlyPayment + extraPayment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Term:</span>
                      <span className="font-medium">
                        {extraPayment > 0 ? adjustedLoanTerm : loanTerm} years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest Paid:</span>
                      <span className="font-medium">
                        $
                        {extraPayment > 0
                          ? ((monthlyPayment + extraPayment) * adjustedLoanTerm * 12 - loanAmount).toFixed(
                            2,
                          )
                          : totalInterest}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span>Disposable Income:</span>
                        <span
                          className={`font-medium ${disposableIncome >= 0 ? "text-green-600" : "text-red-600"
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
                          Great job! You can afford your loan payments with ${disposableIncome.toFixed(
                            2,
                          )} left each month.
                          {disposableIncome > 200 &&
                            " Consider increasing extra payments to save on interest."}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <p className="text-sm">
                          Your payments exceed your disposable income by ${Math.abs(
                            disposableIncome,
                          ).toFixed(2)}. Consider reducing expenses or exploring repayment options.
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
                      <span>Understand your loan terms, including interest rate and repayment period</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Extra payments can significantly reduce interest costs and loan term</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Balance loan payments with other expenses to maintain financial stability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Explore repayment plans like income-driven repayment if payments are unaffordable</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/dashboard/simulations">
                  <Button variant="outline">Back to Simulations</Button>
                </Link>
                <Link href="/dashboard/quizzes/student-loans">
                  <Button>Take Student Loan Quiz</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}