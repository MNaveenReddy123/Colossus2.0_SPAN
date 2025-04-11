"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Gamepad2,
  Clock,
  Award,
  TrendingUp,
  CreditCard,
  Landmark,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserActivities } from "@/actions/user-actions"
import { useEffect, useState, useRef } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function GamesPage() {
  const { userData } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasLoadedRef = useRef(false)
  const userIdRef = useRef(null)

  useEffect(() => {
    const fetchActivities = async () => {
      // Only fetch if we have userData with id and either:
      // 1. We haven't loaded data yet, or
      // 2. The user ID has changed
      if (userData?.id && (!hasLoadedRef.current || userIdRef.current !== userData.id)) {
        userIdRef.current = userData.id
        setLoading(true)
        setError(null)
        
        try {
          const result = await getUserActivities(userData.id)
          if (result.success) {
            setActivities(result.data || [])
            hasLoadedRef.current = true
          } else {
            console.error("Error fetching activities:", result.error)
            setError("Could not load activity data. Using default values.")
          }
        } catch (error) {
          console.error("Error fetching activities:", error)
          setError("An unexpected error occurred. Using default values.")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchActivities()
  }, [userData])

  const getGameProgress = (gameName) => {
    if (loading) return 0
    const gameActivity = activities.find((a) => a.activity_name === gameName)
    return gameActivity ? 100 : 0
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading games...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mini-Games</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Award className="mr-2 h-4 w-4" />
              <span>My Achievements</span>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading games...</span>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Credit Score Adventure</CardTitle>
                  <Badge variant="outline">Level 2</Badge>
                </div>
                <CardDescription>Navigate the world of credit scores</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>5 min per level</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span>Beginner</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>Level 2/5</span>
                  </div>
                  <Progress value={40} />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/games/credit-score" className="w-full">
                  <Button variant="default" className="w-full">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Tax Rush</CardTitle>
                  <Badge variant="outline">New</Badge>
                </div>
                <CardDescription>Race against time to file taxes correctly</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>10 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Intermediate</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{getGameProgress("Tax Rush") > 0 ? "Played" : "Not started"}</span>
                  </div>
                  <Progress value={getGameProgress("Tax Rush")} />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/games/tax-rush" className="w-full">
                  <Button variant="default" className="w-full">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Flip-Card Memory Game</CardTitle>
                <Badge variant="outline">Beginner</Badge>
              </div>
              <CardDescription>Learn about different banking services</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>8 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Landmark className="h-4 w-4" />
                  <span>Beginner</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>Not started</span>
                </div>
                <Progress value={0} />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/games/flip-card" className="w-full">
                <Button variant="default" className="w-full">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Play
                </Button>
              </Link>
            </CardFooter>
          </Card>
       
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Bank Vault Dash</CardTitle>
          <Badge variant="outline">New</Badge>
        </div>
        <CardDescription>Race to collect cash and dodge fees</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>1 min</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>Beginner</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{getGameProgress("Bank Vault Dash") > 0 ? "Played" : "Not started"}</span>
          </div>
          <Progress value={getGameProgress("Bank Vault Dash")} />
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/games/bank-vault-dash" className="w-full">
          <Button variant="default" className="w-full">
            <Gamepad2 className="mr-2 h-4 w-4" />
            Play
          </Button>
        </Link>
      </CardFooter>
    </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Stock Market Simulator</CardTitle>
                  <Badge variant="outline">Popular</Badge>
                </div>
                <CardDescription>Learn to invest in a simulated stock market</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>15 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Intermediate</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{getGameProgress("Stock Market Simulator") > 0 ? "Played" : "Not started"}</span>
                  </div>
                  <Progress value={getGameProgress("Stock Market Simulator")} />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/games/stock-market" className="w-full">
                  <Button variant="default" className="w-full">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Banking Basics</CardTitle>
                  <Badge variant="outline">Beginner</Badge>
                </div>
                <CardDescription>Learn about different banking services</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>8 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Landmark className="h-4 w-4" />
                    <span>Beginner</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{getGameProgress("Banking Basics") > 0 ? "Played" : "Not started"}</span>
                  </div>
                  <Progress value={getGameProgress("Banking Basics")} />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/games/banking-basics" className="w-full">
                  <Button variant="default" className="w-full">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}