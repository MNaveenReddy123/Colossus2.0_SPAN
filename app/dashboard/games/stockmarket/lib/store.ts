"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import axios from "axios"

const API_KEY = "cvsfo59r01qhup0qhg2gcvsfo59r01qhup0qhg30"
const FINNHUB_API = "https://finnhub.io/api/v1"

// Simple throttle helper to limit API calls
const throttle = (fn: (...args: any[]) => void, limit: number) => {
  let lastCall = 0
  return (...args: any[]) => {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      return fn(...args)
    }
  }
}

interface Stock {
  symbol: string
  name: string
  sector: string
  description?: string
}

interface Position {
  symbol: string
  shares: number
  avgPrice: number
}

interface News {
  headline: string
  content: string
  sector?: string
  impact: number
}

interface Trade {
  type: "buy" | "sell"
  symbol: string
  shares: number
  price: number
  timestamp: number
  profit?: number
  marketCondition?: string // Add market condition at time of trade
  reasoning?: string // Optional user reasoning
  priceChange?: number // Price change percentage at time of trade
}

interface StockStore {
  stocks: Stock[]
  portfolio: Position[]
  cash: number
  stockPrices: Record<string, number>
  priceHistory: Record<string, number[]>
  priceChanges: Record<string, number>
  marketNews: News[]
  tradingHistory: Trade[]
  initializeGame: () => void
  updateStockPrices: () => void
  generateMarketNews: () => void
  buyStock: (symbol: string, shares: number, reasoning?: string) => void
  sellStock: (symbol: string, shares: number, reasoning?: string) => void
  getPortfolioValue: () => number
  getTotalPortfolioValue: () => number
  getPerformance: () => number
  getDecisionLogs: () => any
}

export const useStockStore = create<StockStore>()(
  persist(
    (set, get) => ({
      stocks: [],
      portfolio: [],
      cash: 10000,
      stockPrices: {},
      priceHistory: {},
      priceChanges: {},
      marketNews: [],
      tradingHistory: [],

      initializeGame: async () => {
        const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "JPM", "V", "WMT", "JNJ", "PG"]
        const stocks: Stock[] = []
        const stockPrices: Record<string, number> = {}
        const priceHistory: Record<string, number[]> = {}
        const priceChanges: Record<string, number> = {}

        const profilePromises = symbols.map((symbol) =>
          axios.get(`${FINNHUB_API}/stock/profile2`, { params: { symbol, token: API_KEY } }).catch((error) => {
            console.error(`Error fetching profile for ${symbol}:`, error)
            return { data: null }
          }),
        )
        const quotePromises = symbols.map((symbol) =>
          axios.get(`${FINNHUB_API}/quote`, { params: { symbol, token: API_KEY } }).catch((error) => {
            console.error(`Error fetching quote for ${symbol}:`, error)
            return { data: null }
          }),
        )

        const [profileResponses, quoteResponses] = await Promise.all([
          Promise.all(profilePromises),
          Promise.all(quotePromises),
        ])

        symbols.forEach((symbol, index) => {
          const profile = profileResponses[index].data
          const quote = quoteResponses[index].data

          stocks.push({
            symbol,
            name: profile?.name || symbol,
            sector: profile?.finnhubIndustry || "Unknown",
            description: profile?.description || `A company in the ${profile?.finnhubIndustry || "Unknown"} sector.`,
          })

          const price = quote?.c || 100
          stockPrices[symbol] = price
          priceHistory[symbol] = [price]
          priceChanges[symbol] = quote?.dp || 0
        })

        set({
          stocks,
          portfolio: [],
          cash: 10000,
          stockPrices,
          priceHistory,
          priceChanges,
          marketNews: [],
          tradingHistory: [],
        })
      },

      updateStockPrices: throttle(async () => {
        const { stocks, stockPrices, priceHistory, priceChanges } = get()
        const symbols = stocks.map((s) => s.symbol)

        const quotePromises = symbols.map((symbol) =>
          axios.get(`${FINNHUB_API}/quote`, { params: { symbol, token: API_KEY } }).catch((error) => {
            console.error(`Error updating price for ${symbol}:`, error)
            return { data: null }
          }),
        )

        try {
          const quoteResponses = await Promise.all(quotePromises)
          const newStockPrices = { ...stockPrices }
          const newPriceHistory = { ...priceHistory }
          const newPriceChanges = { ...priceChanges }

          symbols.forEach((symbol, index) => {
            const quote = quoteResponses[index].data
            if (quote && quote.c) {
              newStockPrices[symbol] = quote.c
              newPriceHistory[symbol] = [...(priceHistory[symbol] || []), quote.c].slice(-50)
              newPriceChanges[symbol] = quote.dp || 0
            }
          })

          set({
            stockPrices: newStockPrices,
            priceHistory: newPriceHistory,
            priceChanges: newPriceChanges,
          })
        } catch (error) {
          console.error("Failed to update stock prices:", error)
        }
      }, 15000),

      generateMarketNews: async () => {
        try {
          const response = await axios.get(`${FINNHUB_API}/news`, {
            params: { category: "general", token: API_KEY },
          })
          const newsItems = response.data.slice(0, 5).map((item: any) => ({
            headline: item.headline,
            content: item.summary || "No summary available.",
            sector: item.category || "General",
            impact: Math.random() > 0.5 ? 1 : -1,
          }))
          set((state) => ({
            marketNews: [...newsItems, ...state.marketNews].slice(0, 20),
          }))
        } catch (error) {
          console.error("Error fetching market news:", error)
        }
      },

      buyStock: (symbol: string, shares: number, reasoning?: string) => {
        const { cash, portfolio, stockPrices, tradingHistory, priceChanges } = get()
        const price = stockPrices[symbol]
        const cost = price * shares

        if (!price || cost > cash) return

        const existingPosition = portfolio.find((p) => p.symbol === symbol)
        let newPortfolio

        if (existingPosition) {
          const newShares = existingPosition.shares + shares
          const newAvgPrice = (existingPosition.avgPrice * existingPosition.shares + price * shares) / newShares
          newPortfolio = portfolio.map((p) =>
            p.symbol === symbol ? { ...p, shares: newShares, avgPrice: newAvgPrice } : p,
          )
        } else {
          newPortfolio = [...portfolio, { symbol, shares, avgPrice: price }]
        }

        // Determine market condition based on price changes
        const priceChange = priceChanges[symbol] || 0
        let marketCondition = "Normal"
        if (priceChange > 2) marketCondition = "Bullish"
        else if (priceChange < -2) marketCondition = "Bearish"

        set((state) => ({
          portfolio: newPortfolio,
          cash: state.cash - cost,
          tradingHistory: [
            ...state.tradingHistory,
            {
              type: "buy",
              symbol,
              shares,
              price,
              timestamp: Date.now(),
              priceChange,
              marketCondition,
              reasoning: reasoning || "",
            },
          ],
        }))
      },

      sellStock: (symbol: string, shares: number, reasoning?: string) => {
        const { portfolio, stockPrices, tradingHistory, priceChanges } = get()
        const position = portfolio.find((p) => p.symbol === symbol)
        if (!position || position.shares < shares) return

        const price = stockPrices[symbol]
        const revenue = price * shares
        const profit = (price - position.avgPrice) * shares

        let newPortfolio
        if (position.shares === shares) {
          newPortfolio = portfolio.filter((p) => p.symbol !== symbol)
        } else {
          newPortfolio = portfolio.map((p) => (p.symbol === symbol ? { ...p, shares: p.shares - shares } : p))
        }

        // Determine market condition based on price changes
        const priceChange = priceChanges[symbol] || 0
        let marketCondition = "Normal"
        if (priceChange > 2) marketCondition = "Bullish"
        else if (priceChange < -2) marketCondition = "Bearish"

        set((state) => ({
          portfolio: newPortfolio,
          cash: state.cash + revenue,
          tradingHistory: [
            ...state.tradingHistory,
            {
              type: "sell",
              symbol,
              shares,
              price,
              timestamp: Date.now(),
              profit,
              priceChange,
              marketCondition,
              reasoning: reasoning || "",
            },
          ],
        }))
      },

      getPortfolioValue: () => {
        const { portfolio, stockPrices } = get()
        return portfolio.reduce((total, p) => total + p.shares * (stockPrices[p.symbol] || 0), 0)
      },

      getTotalPortfolioValue: () => {
        const { cash, getPortfolioValue } = get()
        return cash + getPortfolioValue()
      },

      getPerformance: () => {
        const { getTotalPortfolioValue } = get()
        const initialValue = 10000
        return ((getTotalPortfolioValue() - initialValue) / initialValue) * 100
      },

      getDecisionLogs: () => {
        const { tradingHistory, stocks, stockPrices } = get()

        return tradingHistory.map((trade) => {
          const stock = stocks.find((s) => s.symbol === trade.symbol)
          return {
            action: trade.type,
            symbol: trade.symbol,
            companyName: stock?.name || trade.symbol,
            sector: stock?.sector || "Unknown",
            shares: trade.shares,
            price: trade.price,
            totalValue: trade.price * trade.shares,
            timestamp: new Date(trade.timestamp).toLocaleString(),
            profit: trade.profit || 0,
            priceChange: trade.priceChange || 0,
            marketCondition: trade.marketCondition || "Normal",
            reasoning: trade.reasoning || "",
          }
        })
      },
    }),
    {
      name: "stock-market-game",
    },
  ),
)
