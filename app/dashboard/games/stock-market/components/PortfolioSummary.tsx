"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStockStore } from "../lib/store"

export default function PortfolioSummary() {
  const { cash, getTotalPortfolioValue, getPortfolioValue, getPerformance } = useStockStore()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Cash:</span>
            <span className="font-medium">${cash.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Investments:</span>
            <span className="font-medium">${getPortfolioValue().toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm">Total Value:</span>
            <span className="font-medium">${getTotalPortfolioValue().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Performance:</span>
            <span className={`font-medium ${getPerformance() >= 0 ? "text-green-600" : "text-red-600"}`}>
              {getPerformance() >= 0 ? "+" : ""}
              {getPerformance().toFixed(2)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
