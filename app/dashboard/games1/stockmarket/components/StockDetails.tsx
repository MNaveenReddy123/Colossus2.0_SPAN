"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Info, BarChart2, LineChart, Clock } from "lucide-react"
import { useStockStore } from "../lib/store"
import StockChart from "./StockChart"

interface StockDetailsProps {
  symbol: string
}

export default function StockDetails({ symbol }: StockDetailsProps) {
  const { stocks, stockPrices, priceChanges, buyStock, sellStock, portfolio } = useStockStore()
  const [buyAmount, setBuyAmount] = useState<number>(0)
  const [sellAmount, setSellAmount] = useState<number>(0)
  const [activeTab, setActiveTab] = useState("overview")

  const stock = stocks.find((s) => s.symbol === symbol)
  const position = portfolio.find((p) => p.symbol === symbol)

  if (!stock) return null

  const handleBuy = () => {
    if (buyAmount > 0) {
      buyStock(symbol, buyAmount)
      setBuyAmount(0)
    }
  }

  const handleSell = () => {
    if (sellAmount > 0 && position) {
      sellStock(symbol, sellAmount)
      setSellAmount(0)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {stock.name} ({stock.symbol})
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-primary/5">
                  {stock.sector}
                </Badge>
                <span className="text-lg font-bold">${(stockPrices[symbol] || 0).toFixed(2)}</span>
                <span className={`text-sm ${priceChanges[symbol] >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {priceChanges[symbol] >= 0 ? (
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="inline h-4 w-4 mr-1" />
                  )}
                  {priceChanges[symbol] >= 0 ? "+" : ""}
                  {(priceChanges[symbol] || 0).toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Qty"
                  className="w-20"
                  value={buyAmount || ""}
                  onChange={(e) => setBuyAmount(Number.parseInt(e.target.value) || 0)}
                />
                <Button onClick={handleBuy} disabled={buyAmount <= 0} className="bg-green-600 hover:bg-green-700">
                  Buy
                </Button>
              </div>
              {position && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={position.shares}
                    placeholder="Qty"
                    className="w-20"
                    value={sellAmount || ""}
                    onChange={(e) => setSellAmount(Number.parseInt(e.target.value) || 0)}
                  />
                  <Button
                    variant="outline"
                    onClick={handleSell}
                    disabled={sellAmount <= 0 || sellAmount > position.shares}
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Sell
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                Chart
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="rounded-lg border p-4 bg-card/50">
                <h3 className="text-lg font-medium">Company Information</h3>
                <p className="mt-2 text-sm text-muted-foreground">{stock.description}</p>

                {position && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium">Your Position</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                      <div>
                        Shares: <span className="font-medium">{position.shares}</span>
                      </div>
                      <div>
                        Avg Price: <span className="font-medium">${position.avgPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        Current Value:{" "}
                        <span className="font-medium">
                          ${(position.shares * (stockPrices[symbol] || 0)).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        Profit/Loss:{" "}
                        <span
                          className={
                            position.shares * (stockPrices[symbol] || 0) - position.shares * position.avgPrice >= 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {(position.shares * (stockPrices[symbol] || 0) - position.shares * position.avgPrice).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-md bg-blue-50 p-3 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Investment Tip</p>
                    <p className="text-sm">
                      {stock.sector === "Technology"
                        ? "Technology stocks often have higher volatility but can offer greater growth potential."
                        : stock.sector === "Financial"
                          ? "Financial stocks may be sensitive to interest rate changes and economic cycles."
                          : stock.sector === "Healthcare"
                            ? "Healthcare stocks can be more stable during economic downturns but may face regulatory risks."
                            : stock.sector === "Energy"
                              ? "Energy stocks often fluctuate with commodity prices and global demand."
                              : "Diversifying across different sectors can help manage risk in your portfolio."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <BarChart2 className="h-8 w-8 text-primary mb-2" />
                      <h3 className="text-lg font-medium">Volatility</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{
                            width: `${stock.sector === "Technology" ? "80%" : stock.sector === "Energy" ? "70%" : "50%"}`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {stock.sector === "Technology" ? "High" : stock.sector === "Energy" ? "Medium" : "Low"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-8 w-8 text-primary mb-2" />
                      <h3 className="text-lg font-medium">Market Trend</h3>
                      <Badge variant={priceChanges[symbol] >= 0 ? "success" : "destructive"} className="mt-2">
                        {priceChanges[symbol] >= 2
                          ? "Strongly Bullish"
                          : priceChanges[symbol] >= 0
                            ? "Bullish"
                            : priceChanges[symbol] >= -2
                              ? "Bearish"
                              : "Strongly Bearish"}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">Based on recent price movement</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="chart" className="mt-4">
              <StockChart symbol={symbol} title="Price Chart" showFullHistory height={400} />
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Price History</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Day {10 - index}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">
                            $
                            {(stockPrices[symbol] * (1 + ((Math.random() * 0.1 - 0.05) * (10 - index)) / 10)).toFixed(
                              2,
                            )}
                          </span>
                          <Badge variant={Math.random() > 0.5 ? "success" : "destructive"} className="text-xs">
                            {Math.random() > 0.5 ? "+" : "-"}
                            {(Math.random() * 2).toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
