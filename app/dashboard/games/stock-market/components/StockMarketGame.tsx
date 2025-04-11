"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Award, RefreshCw } from "lucide-react"
import StockList from "./StockList"
import Portfolio from "./Portfolio"
import MarketNews from "./MarketNews"
import StockDetails from "./StockDetails"
import { useStockStore } from "../lib/store"
import PortfolioSummary from "./PortfolioSummary"
import MarketOverview from "./MarketOverview"

interface StockMarketGameProps {
  onExit: () => void
}

export default function StockMarketGame({ onExit }: StockMarketGameProps) {
  const { toast } = useToast()
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("market")
  const [gameEnded, setGameEnded] = useState(false)

  const {
    initializeGame,
    updateStockPrices,
    generateMarketNews,
    cash,
    portfolio,
    stockPrices,
    marketNews,
    getTotalPortfolioValue,
    getPerformance,
  } = useStockStore()

  useEffect(() => {
    // Initialize the game
    initializeGame()

    // Set up interval for price updates (every 5 seconds)
    const priceInterval = setInterval(() => {
      updateStockPrices()
    }, 5000)

    // Set up interval for news updates (every 15 seconds)
    const newsInterval = setInterval(() => {
      generateMarketNews()
    }, 15000)

    return () => {
      clearInterval(priceInterval)
      clearInterval(newsInterval)
    }
  }, [initializeGame, updateStockPrices, generateMarketNews])

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol)
    setActiveTab("details")
  }

  const handleEndGame = () => {
    setGameEnded(true)

    // Show performance toast
    const performance = getPerformance()
    const performanceText = performance >= 0 ? `+${performance.toFixed(2)}%` : `${performance.toFixed(2)}%`

    toast({
      title: "Simulation Ended",
      description: `Your final portfolio value: $${getTotalPortfolioValue().toFixed(2)} (${performanceText})`,
    })
  }

  const handleRestart = () => {
    initializeGame()
    setGameEnded(false)
    setSelectedStock(null)
    setActiveTab("market")
  }

  if (gameEnded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulation Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="rounded-full bg-primary/10 p-4">
              <Award className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">Final Portfolio Value: ${getTotalPortfolioValue().toFixed(2)}</h3>
              <p className={`text-lg ${getPerformance() >= 0 ? "text-green-600" : "text-red-600"}`}>
                {getPerformance() >= 0 ? "+" : ""}
                {getPerformance().toFixed(2)}% Return
              </p>
              <p className="mt-2 text-muted-foreground">
                {getPerformance() >= 20
                  ? "Outstanding performance! You have a natural talent for investing."
                  : getPerformance() >= 10
                    ? "Great job! You've shown solid investment skills."
                    : getPerformance() >= 0
                      ? "You've managed to make a profit. Keep learning and improving!"
                      : "Investing can be challenging. Keep practicing to improve your strategy."}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Portfolio Summary</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Starting Value:</span>
                <span className="font-medium">$10,000.00</span>
              </div>
              <div className="flex justify-between">
                <span>Final Cash:</span>
                <span className="font-medium">${cash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Final Portfolio Value:</span>
                <span className="font-medium">${(getTotalPortfolioValue() - cash).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Total Return:</span>
                <span className={`font-medium ${getPerformance() >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {getPerformance() >= 0 ? "+" : ""}${(getTotalPortfolioValue() - 10000).toFixed(2)} (
                  {getPerformance().toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onExit}>
              Exit
            </Button>
            <Button onClick={handleRestart}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <PortfolioSummary />
        <MarketOverview onEndGame={handleEndGame} />
        <MarketNews />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedStock}>
            Stock Details
          </TabsTrigger>
        </TabsList>
        <TabsContent value="market" className="mt-4">
          <StockList onSelectStock={handleStockSelect} />
        </TabsContent>
        <TabsContent value="portfolio" className="mt-4">
          <Portfolio onSelectStock={handleStockSelect} />
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          {selectedStock && <StockDetails symbol={selectedStock} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
