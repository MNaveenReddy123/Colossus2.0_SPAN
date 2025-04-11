"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Trophy, Medal, Search, Users, User, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getLeaderboardData } from "@/actions/user-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LeaderboardPage() {
  const { userData } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!userData) return

      setLoading(true)
      try {
        const result = await getLeaderboardData()
        if (result.success) {
          setLeaderboardData(result.data)
          setFilteredData(result.data)

          // Find user's rank
          const rank = result.data.findIndex((user) => user.id === userData.id) + 1
          setUserRank(rank > 0 ? rank : null)
        } else {
          setError("Failed to load leaderboard data")
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [userData])

  useEffect(() => {
    // Set up a refresh interval for the leaderboard
    const interval = setInterval(() => {
      if (userData) {
        const fetchLeaderboard = async () => {
          try {
            const result = await getLeaderboardData()
            if (result.success) {
              setLeaderboardData(result.data)
              setFilteredData(result.data)

              // Find user's rank
              const rank = result.data.findIndex((user) => user.id === userData.id) + 1
              setUserRank(rank > 0 ? rank : null)
            }
          } catch (err) {
            console.error("Error refreshing leaderboard:", err)
          }
        }

        fetchLeaderboard()
      }
    }, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [userData])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(leaderboardData)
    } else {
      const filtered = leaderboardData.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredData(filtered)
    }
  }, [searchQuery, leaderboardData])

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading leaderboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              <span>Find Friends</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="global" className="space-y-4">
          <TabsList>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Challenge</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Users with the highest XP and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading leaderboard...</span>
                  </div>
                ) : (
                  <>
                    {filteredData.length > 0 && (
                      <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
                        {filteredData.length > 2 && (
                          <div className="flex flex-col items-center">
                            <div className="relative">
                              <Avatar className="h-20 w-20 border-2 border-primary">
                                <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={filteredData[1].name} />
                                <AvatarFallback>{filteredData[1].name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-2 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                2
                              </div>
                            </div>
                            <div className="mt-4 text-center">
                              <div className="font-medium">{filteredData[1].name}</div>
                              <div className="text-xs text-muted-foreground">
                                Level {Math.floor(filteredData[1].xp / 100) + 1} • {filteredData[1].xp} XP
                              </div>
                              <div className="text-xs text-muted-foreground">{filteredData[1].coins} Coins</div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                              <Trophy className="h-8 w-8 text-yellow-500" />
                            </div>
                            <Avatar className="h-24 w-24 border-4 border-yellow-500">
                              <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={filteredData[0].name} />
                              <AvatarFallback>{filteredData[0].name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-primary-foreground">
                              1
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <div className="font-medium">{filteredData[0].name}</div>
                            <div className="text-xs text-muted-foreground">
                              Level {Math.floor(filteredData[0].xp / 100) + 1} • {filteredData[0].xp} XP
                            </div>
                            <div className="text-xs text-muted-foreground">{filteredData[0].coins} Coins</div>
                          </div>
                        </div>

                        {filteredData.length > 3 && (
                          <div className="flex flex-col items-center">
                            <div className="relative">
                              <Avatar className="h-20 w-20 border-2 border-orange-400">
                                <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={filteredData[2].name} />
                                <AvatarFallback>{filteredData[2].name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-2 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-primary-foreground">
                                3
                              </div>
                            </div>
                            <div className="mt-4 text-center">
                              <div className="font-medium">{filteredData[2].name}</div>
                              <div className="text-xs text-muted-foreground">
                                Level {Math.floor(filteredData[2].xp / 100) + 1} • {filteredData[2].xp} XP
                              </div>
                              <div className="text-xs text-muted-foreground">{filteredData[2].coins} Coins</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center rounded-md bg-muted/50 px-4 py-2 font-medium">
                        <div className="w-10 text-center">Rank</div>
                        <div className="ml-4 flex-1">User</div>
                        <div className="w-20 text-center">Level</div>
                        <div className="w-20 text-center">XP</div>
                        <div className="w-20 text-center">Coins</div>
                      </div>

                      {filteredData.slice(3, 10).map((user, index) => (
                        <div key={user.id} className="flex items-center rounded-md px-4 py-2 hover:bg-muted">
                          <div className="w-10 text-center font-medium">{index + 4}</div>
                          <div className="ml-4 flex flex-1 items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                          <div className="w-20 text-center">{Math.floor(user.xp / 100) + 1}</div>
                          <div className="w-20 text-center">{user.xp}</div>
                          <div className="w-20 text-center">{user.coins}</div>
                        </div>
                      ))}

                      {userRank && userRank > 10 && (
                        <div className="mt-4 flex items-center rounded-md bg-primary/5 px-4 py-2">
                          <div className="w-10 text-center font-medium">{userRank}</div>
                          <div className="ml-4 flex flex-1 items-center gap-2">
                            <Avatar className="h-8 w-8 border border-primary/20">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userData.name} />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{userData.name}</span>
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                              You
                            </Badge>
                          </div>
                          <div className="w-20 text-center">{Math.floor(userData.xp / 100) + 1}</div>
                          <div className="w-20 text-center">{userData.xp}</div>
                          <div className="w-20 text-center">{userData.coins}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled={filteredData.length <= 10}>
                  Load More
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="friends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Friends Leaderboard</CardTitle>
                <CardDescription>See how you compare to your friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No Friends Added Yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add friends to see how you compare on the leaderboard
                  </p>
                  <Button className="mt-4">
                    <Users className="mr-2 h-4 w-4" />
                    Find Friends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Challenge</CardTitle>
                <CardDescription>This week's challenge: Investment Knowledge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="rounded-lg border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Investment Knowledge Challenge</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete investment quizzes and simulations to earn points
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">3 days left</div>
                      <div className="text-xs text-muted-foreground">Challenge ends April 12, 2025</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center rounded-md bg-muted/50 px-4 py-2 font-medium">
                    <div className="w-10 text-center">Rank</div>
                    <div className="ml-4 flex-1">User</div>
                    <div className="w-20 text-center">Points</div>
                    <div className="w-20 text-center">Quizzes</div>
                    <div className="w-20 text-center">Simulations</div>
                  </div>

                  {[
                    { rank: 1, name: "Emma Wilson", points: 580, quizzes: 5, simulations: 2, medal: "gold" },
                    { rank: 2, name: "James Taylor", points: 490, quizzes: 4, simulations: 2, medal: "silver" },
                    { rank: 3, name: "Olivia Martinez", points: 450, quizzes: 4, simulations: 1, medal: "bronze" },
                    { rank: 4, name: "Noah Johnson", points: 400, quizzes: 3, simulations: 2 },
                    { rank: 5, name: "Sophia Lee", points: 350, quizzes: 3, simulations: 1 },
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center rounded-md px-4 py-2 hover:bg-muted">
                      <div className="w-10 text-center font-medium">
                        {user.medal ? (
                          <div className="flex justify-center">
                            <Medal
                              className={`h-4 w-4 ${
                                user.medal === "gold"
                                  ? "text-yellow-500"
                                  : user.medal === "silver"
                                    ? "text-gray-400"
                                    : "text-orange-400"
                              }`}
                            />
                          </div>
                        ) : (
                          user.rank
                        )}
                      </div>
                      <div className="ml-4 flex flex-1 items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                      <div className="w-20 text-center">{user.points}</div>
                      <div className="w-20 text-center">{user.quizzes}/5</div>
                      <div className="w-20 text-center">{user.simulations}/3</div>
                    </div>
                  ))}

                  <div className="mt-4 flex items-center rounded-md bg-primary/5 px-4 py-2">
                    <div className="w-10 text-center font-medium">12</div>
                    <div className="ml-4 flex flex-1 items-center gap-2">
                      <Avatar className="h-8 w-8 border border-primary/20">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userData.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{userData.name}</span>
                      <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                        You
                      </Badge>
                    </div>
                    <div className="w-20 text-center">150</div>
                    <div className="w-20 text-center">1/5</div>
                    <div className="w-20 text-center">0/3</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="text-center text-sm text-muted-foreground">
                  Complete more investment quizzes and simulations to climb the leaderboard!
                </div>
                <Button className="w-full">Join This Week's Challenge</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
