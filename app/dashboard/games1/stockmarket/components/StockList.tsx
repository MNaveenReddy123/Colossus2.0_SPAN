"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Search } from "lucide-react"
import { useStockStore } from "../lib/store"

interface StockListProps {
  onSelectStock: (symbol: string) => void
}

export default function StockList({ onSelectStock }: StockListProps) {
  const { stocks, stockPrices, priceChanges, buyStock } = useStockStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [buyAmounts, setBuyAmounts] = useState<Record<string, number>>({})

  const handleBuyAmountChange = (symbol: string, value: string) => {
    const amount = Number.parseInt(value) || 0
    setBuyAmounts({
      ...buyAmounts,
      [symbol]: amount,
    })
  }

  const handleBuy = (symbol: string) => {
    const amount = buyAmounts[symbol] || 0
    if (amount > 0) {
      buyStock(symbol, amount)
      setBuyAmounts({
        ...buyAmounts,
        [symbol]: 0,
      })
    }
  }

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Available Stocks</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search stocks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredStocks.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <h3 className="text-lg font-medium">No stocks found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
            </div>
          ) : (
            filteredStocks.map((stock) => (
              <div key={stock.symbol} className="rounded-lg border p-3 hover:bg-accent/5 transition-colors">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="cursor-pointer" onClick={() => onSelectStock(stock.symbol)}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="text-sm text-muted-foreground">{stock.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {stock.sector}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold">${(stockPrices[stock.symbol] || 0).toFixed(2)}</span>
                      <span
                        className={`text-xs ${priceChanges[stock.symbol] >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {priceChanges[stock.symbol] >= 0 ? (
                          <TrendingUp className="inline h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="inline h-3 w-3 mr-1" />
                        )}
                        {priceChanges[stock.symbol] >= 0 ? "+" : ""}
                        {(priceChanges[stock.symbol] || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        className="w-20"
                        value={buyAmounts[stock.symbol] || ""}
                        onChange={(e) => handleBuyAmountChange(stock.symbol, e.target.value)}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleBuy(stock.symbol)}
                        disabled={(buyAmounts[stock.symbol] || 0) <= 0}
                      >
                        Buy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
