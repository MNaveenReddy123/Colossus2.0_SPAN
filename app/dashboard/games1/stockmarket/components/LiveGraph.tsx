"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useStockStore } from "../lib/store"

interface LiveGraphProps {
  title?: string
  height?: number
}

export default function LiveGraph({ title = "Market Index", height = 300 }: LiveGraphProps) {
  const { stocks, stockPrices } = useStockStore()
  const [marketIndex, setMarketIndex] = useState<number[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (Object.keys(stockPrices).length === 0) return

    const totalValue = stocks.reduce((sum, stock) => {
      const price = stockPrices[stock.symbol] || 0
      return sum + price
    }, 0)

    const validStocks = stocks.filter((stock) => stockPrices[stock.symbol] !== undefined).length
    const index = validStocks > 0 ? totalValue / validStocks : 0

    setMarketIndex((prev) => {
      const newHistory = [...prev, index]
      if (newHistory.length > 30) {
        return newHistory.slice(-30)
      }
      return newHistory
    })
  }, [stockPrices, stocks])

  useEffect(() => {
    if (marketIndex.length > 0) {
      const formattedData = marketIndex.map((value, index) => ({
        time: index,
        value: value,
      }))

      setChartData(formattedData)
    }
  }, [marketIndex])

  const getMinMaxValue = () => {
    if (chartData.length === 0) return { min: 0, max: 100 }

    const values = chartData.map((item) => item.value).filter((v) => v !== 0)
    if (values.length === 0) return { min: 0, max: 100 }
    const min = Math.min(...values)
    const max = Math.max(...values)

    const padding = (max - min) * 0.1
    return {
      min: Math.max(0, min - padding),
      max: max + padding,
    }
  }

  const { min, max } = getMinMaxValue()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height }}>
          {chartData.length > 0 && chartData.some((d) => d.value !== 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[min, max]} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Index Value"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading market data...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
