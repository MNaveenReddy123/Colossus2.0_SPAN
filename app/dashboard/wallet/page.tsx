"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, Wallet, TrendingUp, Clock, CreditCard, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserTransactions } from "@/actions/user-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function WalletPage() {
  const { userData } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isMounted = useRef(true)
  const hasLoadedData = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Fetch transactions
  const fetchTransactions = async (forceRefresh = false) => {
    if (!userData || (hasLoadedData.current && !forceRefresh)) return

    setLoading(true)
    setError(null)
    try {
      const result = await getUserTransactions(userData.id, 20)
      if (result.success && isMounted.current) {
        setTransactions(result.data)
        hasLoadedData.current = true
      } else if (isMounted.current) {
        setError("Failed to load transaction history")
      }
    } catch (err) {
      console.error("Error fetching transactions:", err)
      if (isMounted.current) {
        setError("An unexpected error occurred")
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  // Initial fetch or when userData.id changes
  useEffect(() => {
    fetchTransactions()
  }, [userData?.id]) // Depend on userData.id to avoid refetching on object reference changes

  // Handle manual refresh
  const handleRefresh = () => {
    hasLoadedData.current = false // Allow refetch
    fetchTransactions(true)
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading wallet data...</p>
        </div>
      </div>
    )
  }

  // Calculate total earned and spent
  const totalEarned = transactions.reduce((sum, tx) => (tx.coins_earned > 0 ? sum + tx.coins_earned : sum), 0)
  const totalSpent = userData.coins > 0 ? totalEarned - userData.coins : 0

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Virtual Wallet</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button>
              <Wallet className="mr-2 h-4 w-4" />
              <span>{userData.coins} Coins</span>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="spending">Spending Simulator</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.coins} Coins</div>
                  <p className="text-xs text-muted-foreground">
                    {transactions.length > 0 && transactions[0]?.coins_earned > 0
                      ? `+${transactions[0].coins_earned} earned recently`
                      : "Complete activities to earn coins"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEarned} Coins</div>
                  <p className="text-xs text-muted-foreground">Since you started</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSpent} Coins</div>
                  <p className="text-xs text-muted-foreground">On rewards and upgrades</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalEarned > 0 ? Math.round((userData.coins / totalEarned) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Of total earnings saved</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading transactions...</span>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No transactions yet. Start playing games, taking quizzes, or trying simulations!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.slice(0, 4).map((tx) => (
                      <div key={tx.id} className="flex items-center">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          {tx.coins_earned > 0 ? (
                            <ArrowUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {tx.activity_type === "quiz" && "Completed "}
                            {tx.activity_type === "game" && "Played "}
                            {tx.activity_type === "simulation" && "Completed "}"{tx.activity_name}"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.activity_type === "quiz"
                              ? "Earned for quiz completion"
                              : tx.activity_type === "game"
                                ? "Earned from gameplay"
                                : "Earned for simulation completion"}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-primary">+{tx.coins_earned} Coins</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.querySelector('[data-value="transactions"]')?.click()}
                >
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All your wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading transactions...</span>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No transactions yet. Start playing games, taking quizzes, or trying simulations!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          {tx.coins_earned > 0 ? (
                            <ArrowUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {tx.activity_type === "quiz" && "Completed "}
                            {tx.activity_type === "game" && "Played "}
                            {tx.activity_type === "simulation" && "Completed "}"{tx.activity_name}"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.created_at).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-primary">+{tx.coins_earned} Coins</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled={transactions.length < 20}>
                  Load More
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="spending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Simulator</CardTitle>
                <CardDescription>Practice making financial decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Premium Quiz Pack</h4>
                            <p className="text-xs text-muted-foreground">Unlock advanced quizzes</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">100 Coins</div>
                          <Button variant="outline" size="sm" disabled={userData.coins < 100}>
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Investment Simulator Pro</h4>
                            <p className="text-xs text-muted-foreground">Advanced investment tools</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">200 Coins</div>
                          <Button variant="outline" size="sm" disabled={userData.coins < 200}>
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Time Extension Pack</h4>
                            <p className="text-xs text-muted-foreground">Extra time for quizzes and games</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">75 Coins</div>
                          <Button variant="outline" size="sm" disabled={userData.coins < 75}>
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full text-center text-sm text-muted-foreground">
                  Spending in the simulator helps you practice budgeting without affecting your real balance
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}