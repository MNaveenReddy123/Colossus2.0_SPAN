"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import StockMarketGame from "../components/StockMarketGame"

export default function StockMarketPage() {
  const [gameStarted, setGameStarted] = useState(false)

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/games">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Stock Market Simulator</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              Intermediate
            </Badge>
          </div>
        </div>

        {!gameStarted ? (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Stock Market Simulator!</CardTitle>
              <CardDescription>Learn to invest in a simulated stock market</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">How to Play</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <span className="h-3 w-3 text-primary">•</span>
                    </div>
                    <span>You start with $10,000 to invest in various stocks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <span className="h-3 w-3 text-primary">•</span>
                    </div>
                    <span>Buy and sell stocks to maximize your portfolio value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <span className="h-3 w-3 text-primary">•</span>
                    </div>
                    <span>Stock prices update in real-time based on market conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <span className="h-3 w-3 text-primary">•</span>
                    </div>
                    <span>Watch for market news that can impact stock prices</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Investment Tips</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <span className="h-3 w-3 text-primary">•</span>
                    </div>
                    <span>Diversify your investments across different sectors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <span className="h-3 w-3 text-primary">•</span>
                    </div>
                    <span>Monitor historical performance to identify trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <span className="h-3 w-3 text-primary">•</span>
                    </div>
                    <span>Buy low, sell high - timing is crucial for maximizing profits</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setGameStarted(true)} className="w-full">
                Start Simulation
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <StockMarketGame onExit={() => setGameStarted(false)} />
        )}
      </div>
    </div>
  )
}
