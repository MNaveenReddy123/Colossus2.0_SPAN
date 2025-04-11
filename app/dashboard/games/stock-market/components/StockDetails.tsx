"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Info } from "lucide-react"
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
                <Badge variant="outline">{stock.sector}</Badge>
                <span className="text-lg font-bold">${stockPrices[symbol]?.toFixed(2)}</span>
                <span className={`text-sm ${priceChanges[symbol] >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {priceChanges[symbol] >= 0 ? (
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="inline h-4 w-4 mr-1" />
                  )}
                  {priceChanges[symbol] >= 0 ? "+" : ""}
                  {priceChanges[symbol].toFixed(2)}%
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
                <Button onClick={handleBuy} disabled={buyAmount <= 0}>
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Price History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="rounded-lg border p-4">
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
                        <span className="font-medium">${(position.shares * stockPrices[symbol]).toFixed(2)}</span>
                      </div>
                      <div>
                        Profit/Loss:{" "}
                        <span
                          className={
                            position.shares * stockPrices[symbol] - position.shares * position.avgPrice >= 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          ${(position.shares * stockPrices[symbol] - position.shares * position.avgPrice).toFixed(2)}
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

              <StockChart symbol={symbol} title="Recent Price Movement" height={250} />
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <StockChart symbol={symbol} title="Complete Price History" showFullHistory height={400} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
