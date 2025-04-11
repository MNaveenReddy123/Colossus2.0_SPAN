"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  DollarSign,
  Filter,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  BarChart2,
} from "lucide-react"
import { useStockStore } from "../lib/store"
import { motion } from "framer-motion"

interface DecisionLogProps {
  onSendToChatbot: (logs: any) => void
}

export default function DecisionLog({ onSendToChatbot }: DecisionLogProps) {
  const { tradingHistory, getDecisionLogs } = useStockStore()
  const { toast } = useToast()
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all")

  const filteredHistory = tradingHistory.filter((trade) => {
    if (filter === "all") return true
    return trade.type === filter
  })

  const handleSendToChatbot = () => {
    const logs = getDecisionLogs()
    onSendToChatbot(logs)
    toast({
      title: "Decision logs sent to chatbot",
      description: `${logs.length} trading decisions have been sent for analysis.`,
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Decision Log</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleSendToChatbot}>
            <MessageSquare className="h-4 w-4" />
            <span>Analyze with AI</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="timeline" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">{filteredHistory.length} decisions recorded</div>
              <div className="flex items-center gap-1">
                <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                  All
                </Button>
                <Button variant={filter === "buy" ? "default" : "outline"} size="sm" onClick={() => setFilter("buy")}>
                  Buy
                </Button>
                <Button variant={filter === "sell" ? "default" : "outline"} size="sm" onClick={() => setFilter("sell")}>
                  Sell
                </Button>
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No trading decisions recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {filteredHistory.map((trade, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative pl-6 pb-4 border-l"
                  >
                    <div className="absolute left-[-8px] top-0 rounded-full p-1.5 bg-card border">
                      {trade.type === "buy" ? (
                        <ArrowDownToLine className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowUpFromLine className="h-3 w-3 text-red-500" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={trade.type === "buy" ? "success" : "destructive"}>
                            {trade.type === "buy" ? "Buy" : "Sell"}
                          </Badge>
                          <span className="font-medium">{trade.symbol}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(trade.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 text-sm">
                        <div>
                          Shares: <span className="font-medium">{trade.shares}</span>
                        </div>
                        <div>
                          Price: <span className="font-medium">${trade.price.toFixed(2)}</span>
                        </div>
                        <div>
                          Total: <span className="font-medium">${(trade.shares * trade.price).toFixed(2)}</span>
                        </div>
                        {trade.type === "sell" && trade.profit !== undefined && (
                          <div>
                            Profit:
                            <span className={`font-medium ${trade.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {" "}
                              ${trade.profit.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      {trade.marketCondition && (
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {trade.marketCondition}
                          </Badge>
                          {trade.priceChange !== undefined && (
                            <span className={`text-xs ${trade.priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {trade.priceChange >= 0 ? (
                                <TrendingUp className="inline h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="inline h-3 w-3 mr-1" />
                              )}
                              {trade.priceChange >= 0 ? "+" : ""}
                              {trade.priceChange.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <DollarSign className="h-8 w-8 text-primary mb-2" />
                      <h3 className="text-lg font-medium">Total Transactions</h3>
                      <p className="text-3xl font-bold mt-2">{tradingHistory.length}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Badge variant="success" className="h-2 w-2 p-0 rounded-full" />
                          <span className="text-sm">{tradingHistory.filter((t) => t.type === "buy").length} Buys</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
                          <span className="text-sm">
                            {tradingHistory.filter((t) => t.type === "sell").length} Sells
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-8 w-8 text-primary mb-2" />
                      <h3 className="text-lg font-medium">Profit/Loss</h3>
                      <p className="text-3xl font-bold mt-2">
                        $
                        {tradingHistory
                          .filter((t) => t.type === "sell" && t.profit !== undefined)
                          .reduce((sum, t) => sum + (t.profit || 0), 0)
                          .toFixed(2)}
                      </p>
                      <div className="text-sm text-muted-foreground mt-2">
                        From {tradingHistory.filter((t) => t.type === "sell").length} sell transactions
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {tradingHistory.length > 0 && (
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium mb-3">Trading Activity</h3>
                  <div className="h-[150px] w-full">
                    <div className="flex h-full items-end gap-1">
                      {Array.from({ length: Math.min(10, tradingHistory.length) }).map((_, i) => {
                        const index = tradingHistory.length - 1 - i
                        const trade = tradingHistory[index]
                        const height = `${30 + Math.random() * 70}%`

                        return (
                          <div
                            key={i}
                            className="relative flex-1 group"
                            title={`${trade.type === "buy" ? "Bought" : "Sold"} ${trade.shares} shares of ${trade.symbol}`}
                          >
                            <div
                              className={`w-full ${trade.type === "buy" ? "bg-green-500/70" : "bg-red-500/70"} rounded-t-sm`}
                              style={{ height }}
                            ></div>
                            <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {trade.symbol}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-6">
                    Last 10 transactions (newest to oldest)
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
