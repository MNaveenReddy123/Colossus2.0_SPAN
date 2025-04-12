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
  ShoppingCart,
  Car,
  Utensils,
  Smartphone,
  Lightbulb,
  Briefcase,
  Award,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { saveActivityProgress } from "@/actions/user-actions"
import { toast } from "@/components/ui/use-toast"

export default function BudgetingSimulationPage() {
  const [step, setStep] = useState(1)
  const [income, setIncome] = useState(3000)
  const [expenses, setExpenses] = useState({
    rent: 1000,
    groceries: 400,
    transportation: 200,
    utilities: 150,
    entertainment: 200,
    savings: 300,
    other: 150,
  })
  const [completed, setCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + value, 0)
  const balance = income - totalExpenses

  const { userData, refreshUserData } = useAuth()

  const handleExpenseChange = (category, value) => {
    setExpenses({ ...expenses, [category]: value })
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const saveSimulationResults = async () => {
    if (!userData || isSubmitting) return;

    // Calculate score based on multiple factors
    const balanceScore = balance >= 0 ? 50 : 0;
    const savingsScore = expenses.savings >= 300 ? 30 : Math.floor(expenses.savings / 10);
    const emergencyFundScore = expenses.savings >= 500 ? 20 : 0;
    const totalScore = balanceScore + savingsScore + emergencyFundScore;

    // Calculate rewards based on score
    const xpEarned = Math.round((totalScore / 100) * 40); // Up to 40 XP
    const coinsEarned = Math.round((totalScore / 100) * 25); // Up to 25 coins

    try {
      setIsSubmitting(true);
      const result = await saveActivityProgress(
        userData.id,
        "simulation",
        "Budgeting Basics",
        totalScore,
        xpEarned,
        coinsEarned
      );

      if (result.success) {
        await refreshUserData();
        toast({
          title: "Simulation Complete!",
          description: `You earned ${xpEarned} XP and ${coinsEarned} Coins!`,
          className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white",
        });
        setCompleted(true);
      } else {
        throw new Error("Failed to save progress");
      }
    } catch (error) {
      console.error("Error saving simulation progress:", error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    saveSimulationResults();
  };

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
            <h2 className="text-3xl font-bold tracking-tight">Budgeting Basics Simulation</h2>
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
                    <CardTitle>Monthly Budget Simulation</CardTitle>
                    <CardDescription>Learn to create and manage a monthly budget</CardDescription>
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
                      <h3 className="text-lg font-medium">Welcome to Budgeting Basics</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        In this simulation, you'll learn how to create and manage a monthly budget. You'll be given a
                        scenario and will need to make decisions about how to allocate your income.
                      </p>
                      <div className="mt-4 rounded-md bg-muted p-3">
                        <h4 className="font-medium">Your Scenario:</h4>
                        <p className="text-sm text-muted-foreground">
                          You're a recent college graduate with a new job in the city. You need to create a budget to
                          manage your monthly expenses.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="income">Monthly Income (After Taxes)</Label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="income"
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(Number(e.target.value))}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          This is your take-home pay after taxes and deductions
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Essential Expenses</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Now, let's allocate your income to essential expenses. These are the expenses you must pay each
                        month.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="rent" className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-muted-foreground" />
                              Rent/Housing
                            </Label>
                            <span className="text-sm">${expenses.rent}</span>
                          </div>
                          <Slider
                            id="rent"
                            min={0}
                            max={2000}
                            step={50}
                            value={[expenses.rent]}
                            onValueChange={(value) => handleExpenseChange("rent", value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$2000</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="groceries" className="flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                              Groceries
                            </Label>
                            <span className="text-sm">${expenses.groceries}</span>
                          </div>
                          <Slider
                            id="groceries"
                            min={0}
                            max={800}
                            step={25}
                            value={[expenses.groceries]}
                            onValueChange={(value) => handleExpenseChange("groceries", value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$800</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="transportation" className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              Transportation
                            </Label>
                            <span className="text-sm">${expenses.transportation}</span>
                          </div>
                          <Slider
                            id="transportation"
                            min={0}
                            max={500}
                            step={25}
                            value={[expenses.transportation]}
                            onValueChange={(value) => handleExpenseChange("transportation", value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$500</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="utilities" className="flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-muted-foreground" />
                              Utilities
                            </Label>
                            <span className="text-sm">${expenses.utilities}</span>
                          </div>
                          <Slider
                            id="utilities"
                            min={0}
                            max={300}
                            step={10}
                            value={[expenses.utilities]}
                            onValueChange={(value) => handleExpenseChange("utilities", value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$300</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Discretionary Expenses</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Now, let's allocate your income to discretionary expenses. These are expenses that are not
                        essential but improve your quality of life.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="entertainment" className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-muted-foreground" />
                              Entertainment
                            </Label>
                            <span className="text-sm">${expenses.entertainment}</span>
                          </div>
                          <Slider
                            id="entertainment"
                            min={0}
                            max={500}
                            step={25}
                            value={[expenses.entertainment]}
                            onValueChange={(value) => handleExpenseChange("entertainment", value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$500</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="other" className="flex items-center gap-2">
                              <Utensils className="h-4 w-4 text-muted-foreground" />
                              Dining Out/Other
                            </Label>
                            <span className="text-sm">${expenses.other}</span>
                          </div>
                          <Slider
                            id="other"
                            min={0}
                            max={400}
                            step={25}
                            value={[expenses.other]}
                            onValueChange={(value) => handleExpenseChange("other", value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$400</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Savings</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Finally, let's allocate some of your income to savings. This is money you set aside for future
                        goals and emergencies.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="savings" className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              Savings
                            </Label>
                            <span className="text-sm">${expenses.savings}</span>
                          </div>
                          <Slider
                            id="savings"
                            min={0}
                            max={1000}
                            step={50}
                            value={[expenses.savings]}
                            onValueChange={(value) => handleExpenseChange("savings", value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$1000</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium">Budget Summary</h3>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span>Monthly Income:</span>
                            <span className="font-medium">${income}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Expenses:</span>
                            <span className="font-medium">${totalExpenses}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between">
                              <span>Remaining Balance:</span>
                              <span className={`font-medium ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                                ${balance}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          {balance >= 0 ? (
                            <div className="rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <p className="text-sm">
                                Great job! Your budget is balanced with ${balance} left over.
                                {balance > 200 && " Consider allocating more to savings or investments."}
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              <p className="text-sm">
                                Your expenses exceed your income by ${Math.abs(balance)}. Consider reducing some
                                expenses to balance your budget.
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

                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={step === 4 ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : ""}
                >
                  {step < 4 ? "Next" : isSubmitting ? "Saving..." : "Complete Simulation"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Completed!</CardTitle>
                <CardDescription>You've successfully completed the Budgeting Basics simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Award className="h-12 w-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Congratulations!</h3>
                    <p className="text-muted-foreground">
                      You've earned 30 XP and 20 Coins for completing this simulation
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Your Budget Summary</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly Income:</span>
                      <span className="font-medium">${income}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Expenses:</span>
                      <span className="font-medium">${totalExpenses}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span>Remaining Balance:</span>
                        <span className={`font-medium ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${balance}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {balance >= 0 ? (
                      <div className="rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <p className="text-sm">
                          Great job! Your budget is balanced with ${balance} left over.
                          {balance > 200 && " Consider allocating more to savings or investments."}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <p className="text-sm">
                          Your expenses exceed your income by ${Math.abs(balance)}. Consider reducing some expenses to
                          balance your budget.
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
                        <DollarSign className="h-3 w-3 text-primary" />
                      </div>
                      <span>Always start by tracking your income and essential expenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <DollarSign className="h-3 w-3 text-primary" />
                      </div>
                      <span>Aim to save at least 10-20% of your income</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <DollarSign className="h-3 w-3 text-primary" />
                      </div>
                      <span>Adjust discretionary spending to ensure your budget balances</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <DollarSign className="h-3 w-3 text-primary" />
                      </div>
                      <span>Review and adjust your budget regularly as your circumstances change</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/dashboard/simulations">
                  <Button variant="outline">Back to Simulations</Button>
                </Link>
                <Link href="/dashboard/quizzes/budgeting">
                  <Button>Take Budgeting Quiz</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
