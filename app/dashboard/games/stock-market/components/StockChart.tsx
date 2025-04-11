"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useStockStore } from "../lib/store"

interface StockChartProps {
  symbol: string
  title?: string
  showFullHistory?: boolean
  height?: number
  liveUpdate?: boolean
}

export default function StockChart({
  symbol,
  title,
  showFullHistory = false,
  height = 300,
  liveUpdate = false,
}: StockChartProps) {
  const { priceHistory, stockPrices } = useStockStore()
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (!priceHistory[symbol]) return

    // Format the data for the chart
    const history = showFullHistory ? priceHistory[symbol] : priceHistory[symbol].slice(-10) // Last 10 data points

    const formattedData = history.map((price, index) => {
      // For simplicity, we'll use the index as the time
      // In a real app, you'd use actual timestamps
      return {
        time: showFullHistory ? `Day ${index + 1}` : `T-${history.length - index - 1}`,
        price: price,
      }
    })

    setChartData(formattedData)
  }, [priceHistory, symbol, showFullHistory, liveUpdate ? stockPrices : null])

  const getMinMaxPrice = () => {
    if (chartData.length === 0) return { min: 0, max: 100 }

    const prices = chartData.map((item) => item.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)

    // Add some padding
    const padding = (max - min) * 0.1
    return {
      min: Math.max(0, min - padding),
      max: max + padding,
    }
  }

  const { min, max } = getMinMaxPrice()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title || `${symbol} Price History`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height }}>
          {chartData.length > 0 ? (
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
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No historical data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
