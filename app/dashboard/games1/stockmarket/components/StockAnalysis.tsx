"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStockStore } from "../lib/store"
import { motion } from "framer-motion"
import { FileText, TrendingUp, TrendingDown, DollarSign, BarChart2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StockAnalysisProps {
  onClose: () => void
}

export default function StockAnalysis({ onClose }: StockAnalysisProps) {
  const { portfolio, stockPrices, priceHistory, getPerformance, getTotalPortfolioValue } = useStockStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const generateAnalysis = async () => {
    setIsGenerating(true)

    // Simulate AI analysis with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const performance = getPerformance()
    const totalValue = getTotalPortfolioValue()
    const initialValue = 10000
    const profit = totalValue - initialValue

    // Analyze trading patterns
    const tradingPatterns = portfolio.map((position) => {
      const currentPrice = stockPrices[position.symbol] || 0
      const priceChange = ((currentPrice - position.avgPrice) / position.avgPrice) * 100
      const profit = (currentPrice - position.avgPrice) * position.shares

      return {
        symbol: position.symbol,
        shares: position.shares,
        avgPrice: position.avgPrice,
        currentPrice,
        priceChange,
        profit,
        holdingPeriod: priceHistory[position.symbol]?.length || 0,
      }
    })

    // Generate insights
    const insights = {
      overallPerformance: {
        return: performance,
        profit,
        totalValue,
      },
      tradingPatterns,
      recommendations: generateRecommendations(tradingPatterns, performance),
    }

    setAnalysis(insights)
    setIsGenerating(false)
  }

  const generateRecommendations = (patterns: any[], performance: number) => {
    const recommendations = []

    if (performance > 20) {
      recommendations.push({
        type: "success",
        message: "Excellent performance! You've shown strong investment skills.",
        icon: TrendingUp,
      })
    } else if (performance > 0) {
      recommendations.push({
        type: "info",
        message: "Good job! You've made a profit, but there's room for improvement.",
        icon: BarChart2,
      })
    } else {
      recommendations.push({
        type: "warning",
        message: "Consider diversifying your portfolio and holding positions longer.",
        icon: AlertCircle,
      })
    }

    // Analyze individual stock performance
    patterns.forEach((pattern) => {
      if (pattern.priceChange > 20) {
        recommendations.push({
          type: "success",
          message: `Great job with ${pattern.symbol}! Consider taking some profits.`,
          icon: TrendingUp,
        })
      } else if (pattern.priceChange < -10) {
        recommendations.push({
          type: "warning",
          message: `${pattern.symbol} is underperforming. Review your position.`,
          icon: AlertCircle,
        })
      }
    })

    return recommendations
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Trading Analysis Report</CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!analysis ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Generate a detailed analysis of your trading performance</p>
              <Button onClick={generateAnalysis} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Analysis"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 rounded-lg border bg-card"
                >
                  <h3 className="text-sm font-medium text-muted-foreground">Total Return</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={analysis.overallPerformance.return >= 0 ? "success" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {analysis.overallPerformance.return >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {analysis.overallPerformance.return >= 0 ? "+" : ""}
                      {analysis.overallPerformance.return.toFixed(2)}%
                    </Badge>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-4 rounded-lg border bg-card"
                >
                  <h3 className="text-sm font-medium text-muted-foreground">Total Profit</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={analysis.overallPerformance.profit >= 0 ? "success" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      <DollarSign className="h-3 w-3" />
                      {analysis.overallPerformance.profit >= 0 ? "+" : ""}$
                      {Math.abs(analysis.overallPerformance.profit).toFixed(2)}
                    </Badge>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-4 rounded-lg border bg-card"
                >
                  <h3 className="text-sm font-medium text-muted-foreground">Final Portfolio Value</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />${analysis.overallPerformance.totalValue.toFixed(2)}
                    </Badge>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Trading Recommendations</h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <rec.icon
                          className={`h-5 w-5 mt-1 ${
                            rec.type === "success"
                              ? "text-green-500"
                              : rec.type === "warning"
                                ? "text-yellow-500"
                                : "text-blue-500"
                          }`}
                        />
                        <p className="text-sm">{rec.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Stock Performance Analysis</h3>
                <div className="space-y-3">
                  {analysis.tradingPatterns.map((pattern: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{pattern.symbol}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pattern.shares} shares @ ${pattern.avgPrice.toFixed(2)}
                          </p>
                        </div>
                        <Badge
                          variant={pattern.priceChange >= 0 ? "success" : "destructive"}
                          className="flex items-center gap-1"
                        >
                          {pattern.priceChange >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {pattern.priceChange >= 0 ? "+" : ""}
                          {pattern.priceChange.toFixed(2)}%
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
