"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts"
import { useStockStore } from "../lib/store"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Info, ArrowRight } from "lucide-react"

interface EnhancedStockChartProps {
  symbol: string
  height?: number
}

export default function EnhancedStockChart({ symbol, height = 300 }: EnhancedStockChartProps) {
  const { priceHistory, stockPrices, priceChanges } = useStockStore()
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoverInfo, setHoverInfo] = useState<{ price: number; time: string } | null>(null)

  useEffect(() => {
    if (!priceHistory[symbol]) return

    const history = priceHistory[symbol].slice(-30)
    const formattedData = history.map((price, index) => ({
      time: `T-${history.length - index - 1}`,
      price,
    }))

    setChartData(formattedData)
    setIsLoading(false)
  }, [priceHistory, symbol])

  const getMinMaxPrice = () => {
    if (chartData.length === 0) return { min: 0, max: 100 }
    const prices = chartData.map((item) => item.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const padding = (max - min) * 0.1
    return {
      min: Math.max(0, min - padding),
      max: max + padding,
    }
  }

  const { min, max } = getMinMaxPrice()
  const currentPrice = stockPrices[symbol] || 0
  const priceChange = priceChanges[symbol] || 0

  // Calculate support and resistance levels (simplified)
  const calculateSupportResistance = () => {
    if (chartData.length < 5) return { support: null, resistance: null }

    const prices = chartData.map((item) => item.price)
    const sortedPrices = [...prices].sort((a, b) => a - b)

    // Simple approach: support is near the 25th percentile, resistance near the 75th
    const supportIndex = Math.floor(sortedPrices.length * 0.25)
    const resistanceIndex = Math.floor(sortedPrices.length * 0.75)

    return {
      support: sortedPrices[supportIndex],
      resistance: sortedPrices[resistanceIndex],
    }
  }

  const { support, resistance } = calculateSupportResistance()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{symbol}</CardTitle>
            <Badge variant={priceChange >= 0 ? "success" : "destructive"} className="flex items-center gap-1">
              {priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height }}>
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : chartData.length > 0 ? (
              <div className="relative">
                {hoverInfo && (
                  <div className="absolute top-2 right-2 bg-background/90 border rounded-md p-2 z-10 shadow-sm">
                    <div className="text-sm font-medium">${hoverInfo.price.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{hoverInfo.time}</div>
                  </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    onMouseMove={(data) => {
                      if (data.activePayload && data.activePayload.length > 0) {
                        setHoverInfo({
                          price: data.activePayload[0].payload.price,
                          time: data.activePayload[0].payload.time,
                        })
                      }
                    }}
                    onMouseLeave={() => setHoverInfo(null)}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={priceChange >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={priceChange >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[min, max]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "8px" }}
                      formatter={(value: number) => [`${value.toFixed(2)}`, "Price"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={priceChange >= 0 ? "#10b981" : "#ef4444"}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                      strokeWidth={2}
                    />

                    {support && (
                      <ReferenceLine
                        y={support}
                        stroke="#3b82f6"
                        strokeDasharray="3 3"
                        label={{ value: "Support", position: "insideBottomRight", fill: "#3b82f6" }}
                      />
                    )}

                    {resistance && (
                      <ReferenceLine
                        y={resistance}
                        stroke="#f97316"
                        strokeDasharray="3 3"
                        label={{ value: "Resistance", position: "insideTopRight", fill: "#f97316" }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">${currentPrice.toFixed(2)}</span>
              <Badge variant="outline" className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                Last 30 periods
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Volume: 12.5K</span>
              <ArrowRight className="h-3 w-3" />
              <span>Avg: 10.2K</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
