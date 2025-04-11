"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStockStore } from "../lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function MarketInsights() {
  const { marketNews, priceChanges } = useStockStore()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Market Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 rounded-lg border bg-card"
            >
              <h3 className="text-sm font-medium text-muted-foreground">Market Sentiment</h3>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {Object.values(priceChanges).filter((change) => change > 0).length >
                  Object.values(priceChanges).filter((change) => change < 0).length ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  {Object.values(priceChanges).filter((change) => change > 0).length >
                  Object.values(priceChanges).filter((change) => change < 0).length
                    ? "Bullish"
                    : "Bearish"}
                </Badge>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-4 rounded-lg border bg-card"
            >
              <h3 className="text-sm font-medium text-muted-foreground">Active Stocks</h3>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">{Object.keys(priceChanges).length} Stocks</Badge>
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Latest News</h3>
            <AnimatePresence>
              {marketNews.map((news, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{news.headline}</h4>
                      <p className="text-sm text-muted-foreground">{news.content}</p>
                    </div>
                    <Badge variant={news.impact > 0 ? "success" : "destructive"} className="flex items-center gap-1">
                      {news.impact > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {news.sector}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
