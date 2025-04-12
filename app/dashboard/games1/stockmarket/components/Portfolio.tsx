"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart } from "lucide-react"
import { useStockStore } from "../lib/store"

interface PortfolioProps {
  onSelectStock: (symbol: string) => void
}

export default function Portfolio({ onSelectStock }: PortfolioProps) {
  const { portfolio, stocks, stockPrices, sellStock } = useStockStore()
  const [sellAmounts, setSellAmounts] = useState<Record<string, number>>({})

  const handleSellAmountChange = (symbol: string, value: string) => {
    const amount = Number.parseInt(value) || 0
    setSellAmounts({
      ...sellAmounts,
      [symbol]: amount,
    })
  }

  const handleSell = (symbol: string) => {
    const amount = sellAmounts[symbol] || 0
    if (amount > 0) {
      sellStock(symbol, amount)
      setSellAmounts({
        ...sellAmounts,
        [symbol]: 0,
      })
    }
  }

  const getStockById = (symbol: string) => {
    return stocks.find((s) => s.symbol === symbol)
  }

  const calculateProfit = (position: any) => {
    const currentValue = position.shares * (stockPrices[position.symbol] || 0)
    const investedValue = position.shares * position.avgPrice
    return currentValue - investedValue
  }

  const calculateProfitPercentage = (position: any) => {
    const currentValue = position.shares * (stockPrices[position.symbol] || 0)
    const investedValue = position.shares * position.avgPrice
    return investedValue === 0 ? 0 : ((currentValue - investedValue) / investedValue) * 100
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        {portfolio.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <BarChart className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-2 text-lg font-medium">No Stocks Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your portfolio is empty. Start buying stocks to build your investment portfolio.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolio.map((position) => {
              const stock = getStockById(position.symbol)
              const profit = calculateProfit(position)
              const profitPercentage = calculateProfitPercentage(position)

              return (
                <div key={position.symbol} className="rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="cursor-pointer" onClick={() => onSelectStock(position.symbol)}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{position.symbol}</span>
                        <span className="text-sm text-muted-foreground">{stock?.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm">
                        <div>
                          Shares: <span className="font-medium">{position.shares}</span>
                        </div>
                        <div>
                          Avg Price: <span className="font-medium">${position.avgPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          Current:{" "}
                          <span className="font-medium">${(stockPrices[position.symbol] || 0).toFixed(2)}</span>
                        </div>
                        <div>
                          Value:{" "}
                          <span className="font-medium">
                            ${(position.shares * (stockPrices[position.symbol] || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className={`text-xs ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {profit >= 0 ? (
                            <TrendingUp className="inline h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="inline h-3 w-3 mr-1" />
                          )}
                          {profit >= 0 ? "+" : ""}
                          {profit.toFixed(2)} ({profitPercentage >= 0 ? "+" : ""}
                          {profitPercentage.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          max={position.shares}
                          className="w-20"
                          value={sellAmounts[position.symbol] || ""}
                          onChange={(e) => handleSellAmountChange(position.symbol, e.target.value)}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSell(position.symbol)}
                          disabled={
                            (sellAmounts[position.symbol] || 0) <= 0 ||
                            (sellAmounts[position.symbol] || 0) > position.shares
                          }
                        >
                          Sell
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
