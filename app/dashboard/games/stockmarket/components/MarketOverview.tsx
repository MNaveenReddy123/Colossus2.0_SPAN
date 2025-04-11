"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LiveGraph from "./LiveGraph"

interface MarketOverviewProps {
  onEndGame: () => void
}

export default function MarketOverview({ onEndGame }: MarketOverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Market Overview</CardTitle>
          <Button variant="outline" size="sm" onClick={onEndGame}>
            End Simulation
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <LiveGraph height={200} />
      </CardContent>
    </Card>
  )
}
