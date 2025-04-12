"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Send, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface ChatbotIntegrationProps {
  decisionLogs: any[]
  onClose: () => void
}

export default function ChatbotIntegration({ decisionLogs, onClose }: ChatbotIntegrationProps) {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const formatDecisionLogs = () => {
    return decisionLogs
      .map((log, index) => {
        return `Decision ${index + 1}: ${log.action.toUpperCase()} ${log.shares} shares of ${log.symbol} (${log.companyName}) at $${log.price.toFixed(2)} per share. Total value: $${log.totalValue.toFixed(2)}. Market condition: ${log.marketCondition}. Timestamp: ${log.timestamp}. ${log.reasoning ? `Reasoning: ${log.reasoning}` : ""}`
      })
      .join("\n\n")
  }

  const handleSendToChatbot = async () => {
    setIsLoading(true)

    try {
      // This is a placeholder for the actual API call to your Mistral chatbot
      // You would replace this with your actual implementation

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const formattedLogs = formatDecisionLogs()
      const userPrompt = prompt || "Analyze my trading decisions and provide insights."

      // Simulate chatbot response
      const simulatedResponse = `
# Trading Decision Analysis

Based on the ${decisionLogs.length} trading decisions you've made during this simulation, here are my observations and recommendations:

## Trading Patterns

- You made ${decisionLogs.filter((d) => d.action === "buy").length} buy decisions and ${decisionLogs.filter((d) => d.action === "sell").length} sell decisions
- Your average holding period appears to be relatively ${decisionLogs.length > 5 ? "short" : "long"} 
- You tend to ${decisionLogs.filter((d) => d.action === "buy" && d.marketCondition === "Bullish").length > decisionLogs.filter((d) => d.action === "buy" && d.marketCondition === "Bearish").length ? "buy during bullish markets" : "buy regardless of market conditions"}

## Strengths

- You've demonstrated good timing on ${Math.floor(Math.random() * 3) + 1} occasions, buying at relatively low prices
- Your sector diversification is ${decisionLogs.length > 3 ? "reasonable" : "limited"}

## Areas for Improvement

- Consider setting more defined entry and exit strategies
- Watch for emotional decision-making in volatile markets
- Analyze your profit/loss ratio on completed trades

Would you like more specific advice on any particular aspect of your trading strategy?
      `

      setResponse(simulatedResponse)

      toast({
        title: "Analysis complete",
        description: "The AI has analyzed your trading decisions.",
      })
    } catch (error) {
      console.error("Error sending to chatbot:", error)
      toast({
        title: "Error",
        description: "Failed to send data to chatbot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-primary/20">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>AI Trading Analysis</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {!response ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Trading Decision Analysis</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      The AI will analyze your {decisionLogs.length} trading decisions and provide insights on your
                      strategy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Ask a specific question about your trading decisions or leave blank for general analysis..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <Button className="w-full" onClick={handleSendToChatbot} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Analyze Trading Decisions
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, "<br>") }} />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setResponse(null)}>
                  Ask Another Question
                </Button>
                <Button onClick={onClose}>Done</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
