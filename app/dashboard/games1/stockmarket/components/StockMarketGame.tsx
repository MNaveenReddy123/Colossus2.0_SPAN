"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Award, RefreshCw, BarChart2, TrendingUp, Wallet, History, ChevronRight } from "lucide-react"
import StockList from "./StockList"
import Portfolio from "./Portfolio"
import StockDetails from "./StockDetails"
import { useStockStore } from "../lib/store"
import PortfolioSummary from "./PortfolioSummary"
import MarketOverview from "./MarketOverview"
import EnhancedStockChart from "./EnhancedStockChart"
import MarketInsights from "./MarketInsights"
import { motion } from "framer-motion"
import StockAnalysis from "./StockAnalysis"
import DecisionLog from "./DecisionLog"
import ChatbotIntegration from "./ChatbotIntegration"

interface StockMarketGameProps {
  onExit: () => void
}

export default function StockMarketGame({ onExit }: StockMarketGameProps) {
  const { toast } = useToast()
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("market")
  const [gameEnded, setGameEnded] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [decisionLogs, setDecisionLogs] = useState<any[]>([])

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
    getDecisionLogs,
  } = useStockStore()

  useEffect(() => {
    initializeGame()

    const priceInterval = setInterval(() => {
      updateStockPrices()
    }, 10000)

    const newsInterval = setInterval(() => {
      generateMarketNews()
    }, 30000)

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
    setShowAnalysis(true)
    const performance = getPerformance()
    const performanceText = performance >= 0 ? `+${performance.toFixed(2)}%` : `${performance.toFixed(2)}%`

    toast({
      title: "Simulation Ended",
      description: `Your final portfolio value: ${getTotalPortfolioValue().toFixed(2)} (${performanceText})`,
    })
  }

  const handleRestart = () => {
    initializeGame()
    setGameEnded(false)
    setSelectedStock(null)
    setActiveTab("market")
    setShowChatbot(false)
  }

  const handleSendToChatbot = (logs: any) => {
    // Make sure we're getting the latest decision logs
    const latestLogs = getDecisionLogs()
    setDecisionLogs(latestLogs)
    setShowChatbot(true)
  }

  if (showChatbot) {
    return <ChatbotIntegration decisionLogs={decisionLogs} onClose={() => setShowChatbot(false)} />
  }

  if (gameEnded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {showAnalysis ? (
          <StockAnalysis onClose={() => setShowAnalysis(false)} />
        ) : (
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
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={onExit}>
                  Exit
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setShowAnalysis(true)}>
                    View Analysis
                  </Button>
                  <Button variant="outline" onClick={() => handleSendToChatbot(getDecisionLogs())}>
                    AI Analysis
                  </Button>
                  <Button onClick={handleRestart}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MarketOverview onEndGame={handleEndGame} />
          <MarketInsights />
        </div>
        <div className="space-y-6">
          <PortfolioSummary />
          <Portfolio onSelectStock={handleStockSelect} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="market" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Market
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Decision Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-4">
          <StockList onSelectStock={handleStockSelect} />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Portfolio onSelectStock={handleStockSelect} />
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedStock ? (
            <>
              <EnhancedStockChart symbol={selectedStock} />
              <StockDetails symbol={selectedStock} />
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Select a stock to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <DecisionLog onSendToChatbot={handleSendToChatbot} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleSendToChatbot(getDecisionLogs())}
        >
          <span>AI Trading Analysis</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
