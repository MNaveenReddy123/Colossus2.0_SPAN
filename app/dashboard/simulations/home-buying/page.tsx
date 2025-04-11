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
  Home,
  Wallet,
  Percent,
  Calendar,
  CheckCircle,
  Award,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { saveActivityProgress } from "@/actions/user-actions"
import { toast } from "@/components/ui/use-toast"

export default function HomeBuyingSimulationPage() {
  const [step, setStep] = useState(1)
  const [monthlyIncome, setMonthlyIncome] = useState(4000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(2000)
  const [savings, setSavings] = useState(20000)
  const [homePrice, setHomePrice] = useState(250000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(4.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [monthlyOtherCosts, setMonthlyOtherCosts] = useState(500) // Property taxes, insurance, maintenance
  const [completed, setCompleted] = useState(false)

  const { userData, refreshUserData } = useAuth()

  // Calculate down payment amount
  const downPayment = (homePrice * downPaymentPercent) / 100
  const loanAmount = homePrice - downPayment

  // Calculate monthly mortgage payment using the amortization formula
  const calculateMonthlyMortgagePayment = () => {
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    return Number(monthlyPayment.toFixed(2))
  }

  // Calculate total interest paid over the loan term
  const calculateTotalInterest = () => {
    const monthlyPayment = calculateMonthlyMortgagePayment()
    const totalPaid = monthlyPayment * loanTerm * 12
    return Number((totalPaid - loanAmount).toFixed(2))
  }

  const monthlyMortgagePayment = calculateMonthlyMortgagePayment()
  const totalMonthlyHousingCost = monthlyMortgagePayment + monthlyOtherCosts
  const disposableIncome = monthlyIncome - monthlyExpenses - totalMonthlyHousingCost
  const debtToIncomeRatio = (totalMonthlyHousingCost / monthlyIncome) * 100

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
    const affordabilityScore = disposableIncome >= 0 && debtToIncomeRatio <= 36 ? 50 : 20
    const downPaymentScore = downPaymentPercent >= 20 ? 30 : downPaymentPercent
    const totalScore = affordabilityScore + downPaymentScore

    // Calculate rewards
    const xpEarned = 50
    const coinsEarned = 30

    try {
      const result = await saveActivityProgress(
        userData.id,
        "simulation",
        "Home Buying Basics",
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
            <h2 className="text-3xl font-bold tracking-tight">Home Buying Basics Simulation</h2>
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
                    <CardTitle>Home Buying Simulation</CardTitle>
                    <CardDescription>Learn the financial aspects of buying a home</CardDescription>
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
                      <h3 className="text-lg font-medium">Welcome to Home Buying Basics</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        In this simulation, you'll learn how to plan for buying a home by assessing your finances,
                        choosing a home price, and understanding mortgage terms.
                      </p>
                      <div className="mt-4 rounded-md bg-muted p-3">
                        <h4 className="font-medium">Your Scenario:</h4>
                        <p className="text-sm text-muted-foreground">
                          You're a young professional looking to buy your first home. You need to balance your savings,
                          income, and expenses to make an informed decision.
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
                        <Label htmlFor="savings">Savings for Down Payment</Label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="savings"
                            type="number"
                            value={savings}
                            onChange={(e) => setSavings(Number(e.target.value))}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total savings available for the down payment
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Choosing a Home</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Select a home price and decide how much to put down as a down payment.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="homePrice" className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-muted-foreground" />
                              Home Price
                            </Label>
                            <span className="text-sm">${homePrice}</span>
                          </div>
                          <Slider
                            id="homePrice"
                            min={100000}
                            max={500000}
                            step={10000}
                            value={[homePrice]}
                            onValueChange={(value) => setHomePrice(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$100,000</span>
                            <span>$500,000</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="downPaymentPercent" className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              Down Payment (%)
                            </Label>
                            <span className="text-sm">{downPaymentPercent}%</span>
                          </div>
                          <Slider
                            id="downPaymentPercent"
                            min={5}
                            max={50}
                            step={1}
                            value={[downPaymentPercent]}
                            onValueChange={(value) => setDownPaymentPercent(value[0])}
                            disabled={savings < (homePrice * 5) / 100} // Disable if savings are insufficient
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>5%</span>
                            <span>50%</span>
                          </div>
                          {savings < downPayment && (
                            <p className="text-sm text-red-600">
                              Your savings (${savings}) are less than the down payment (${downPayment.toFixed(2)}).
                              Increase savings or reduce the down payment percentage.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Mortgage Terms</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Define your mortgage terms and estimate additional homeownership costs.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="interestRate" className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-muted-foreground" />
                              Interest Rate (%)
                            </Label>
                            <span className="text-sm">{interestRate}%</span>
                          </div>
                          <Slider
                            id="interestRate"
                            min={2}
                            max={8}
                            step={0.1}
                            value={[interestRate]}
                            onValueChange={(value) => setInterestRate(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>2%</span>
                            <span>8%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="loanTerm" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              Loan Term (Years)
                            </Label>
                            <span className="text-sm">{loanTerm} years</span>
                          </div>
                          <Slider
                            id="loanTerm"
                            min={15}
                            max={30}
                            step={5}
                            value={[loanTerm]}
                            onValueChange={(value) => setLoanTerm(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>15</span>
                            <span>30</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="monthlyOtherCosts" className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              Other Monthly Costs
                            </Label>
                            <span className="text-sm">${monthlyOtherCosts}</span>
                          </div>
                          <Slider
                            id="monthlyOtherCosts"
                            min={200}
                            max={1000}
                            step={50}
                            value={[monthlyOtherCosts]}
                            onValueChange={(value) => setMonthlyOtherCosts(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$200</span>
                            <span>$1000</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Includes property taxes, insurance, and maintenance
                          </div>
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
                        Review your home buying plan and financial affordability.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium">Home Purchase Summary</h3>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span>Home Price:</span>
                            <span className="font-medium">${homePrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Down Payment ({downPaymentPercent}%):</span>
                            <span className="font-medium">${downPayment.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Loan Amount:</span>
                            <span className="font-medium">${loanAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Mortgage Payment:</span>
                            <span className="font-medium">${monthlyMortgagePayment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Other Monthly Costs:</span>
                            <span className="font-medium">${monthlyOtherCosts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Monthly Housing Cost:</span>
                            <span className="font-medium">${totalMonthlyHousingCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Interest Paid:</span>
                            <span className="font-medium">${calculateTotalInterest()}</span>
                          </div>
                          <div className="border-t pt-2">
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
                            <div className="flex justify-between">
                              <span>Debt-to-Income Ratio:</span>
                              <span
                                className={`font-medium ${
                                  debtToIncomeRatio <= 36 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {debtToIncomeRatio.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          {disposableIncome >= 0 && debtToIncomeRatio <= 36 ? (
                            <div className="rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <p className="text-sm">
                                Great job! Your home purchase is affordable with ${disposableIncome.toFixed(
                                  2,
                                )} left each month and a debt-to-income ratio of {debtToIncomeRatio.toFixed(
                                  1,
                                )}%.
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              <p className="text-sm">
                                {disposableIncome < 0 &&
                                  `Your housing costs exceed your income by $${Math.abs(
                                    disposableIncome,
                                  ).toFixed(2)}. `}
                                {debtToIncomeRatio > 36 &&
                                  `Your debt-to-income ratio of ${debtToIncomeRatio.toFixed(
                                    1,
                                  )}% is too high (ideal is ≤36%). `}
                                Consider a less expensive home, increasing your down payment, or reducing expenses.
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
                <Button onClick={handleNext} disabled={step === 2 && savings < downPayment}>
                  {step < 4 ? "Next" : "Complete Simulation"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Completed!</CardTitle>
                <CardDescription>
                  You've successfully completed the Home Buying Basics simulation
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
                      You've earned 50 XP and 30 Coins for completing this simulation
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Your Home Purchase Summary</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Home Price:</span>
                      <span className="font-medium">${homePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment ({downPaymentPercent}%):</span>
                      <span className="font-medium">${downPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span className="font-medium">${loanAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Mortgage Payment:</span>
                      <span className="font-medium">${monthlyMortgagePayment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Monthly Housing Cost:</span>
                      <span className="font-medium">${totalMonthlyHousingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest Paid:</span>
                      <span className="font-medium">${calculateTotalInterest()}</span>
                    </div>
                    <div className="border-t pt-2">
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
                      <div className="flex justify-between">
                        <span>Debt-to-Income Ratio:</span>
                        <span
                          className={`font-medium ${
                            debtToIncomeRatio <= 36 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {debtToIncomeRatio.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {disposableIncome >= 0 && debtToIncomeRatio <= 36 ? (
                      <div className="rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <p className="text-sm">
                          Well done! Your home purchase is financially sound with ${disposableIncome.toFixed(
                            2,
                          )} left monthly and a debt-to-income ratio of {debtToIncomeRatio.toFixed(1)}%.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <p className="text-sm">
                          {disposableIncome < 0 &&
                            `Your housing costs exceed your income by $${Math.abs(
                              disposableIncome,
                            ).toFixed(2)}. `}
                          {debtToIncomeRatio > 36 &&
                            `Your debt-to-income ratio of ${debtToIncomeRatio.toFixed(
                              1,
                            )}% is too high. `}
                          Consider adjusting your home price or expenses.
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
                      <span>A larger down payment reduces your loan amount and monthly payments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>
                        Keep your debt-to-income ratio below 36% to ensure affordability
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>
                        Factor in additional costs like property taxes, insurance, and maintenance
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>
                        Compare mortgage terms to find the best balance of monthly payments and total interest
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/dashboard/simulations">
                  <Button variant="outline">Back to Simulations</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}