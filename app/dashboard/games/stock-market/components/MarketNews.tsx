"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, TrendingUp, TrendingDown } from "lucide-react"
import { useStockStore } from "../lib/store"

export default function MarketNews() {
  const { marketNews } = useStockStore()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Market News</CardTitle>
      </CardHeader>
      <CardContent>
        {marketNews.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <Newspaper className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <h3 className="mt-2 text-sm font-medium">No recent news</h3>
            <p className="mt-1 text-xs text-muted-foreground">Market news will appear here as events unfold</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {marketNews.map((news, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {news.impact > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : news.impact < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Newspaper className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{news.headline}</h3>
                      {news.sector && (
                        <Badge variant="outline" className="text-xs">
                          {news.sector}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{news.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
