"use client"

import { create } from "zustand";
import type { Stock, Position, NewsItem } from "./types"
import { generateStocks, generateNewsEvent } from "./stockSimulator"

interface StockState {
  cash: number
  stocks: Stock[]
  portfolio: Position[]
  stockPrices: Record<string, number>
  priceHistory: Record<string, number[]>
  priceChanges: Record<string, number>
  marketNews: NewsItem[]

  // Actions
  initializeGame: () => void
  updateStockPrices: () => void
  generateMarketNews: () => void
  buyStock: (symbol: string, shares: number) => void
  sellStock: (symbol: string, shares: number) => void

  // Derived data
  getPortfolioValue: () => number
  getTotalPortfolioValue: () => number
  getPerformance: () => number
}

export const useStockStore = create<StockState>((set, get) => ({
  cash: 10000,
  stocks: [],
  portfolio: [],
  stockPrices: {},
  priceHistory: {},
  priceChanges: {},
  marketNews: [],

  initializeGame: () => {
    const stocks = generateStocks()
    const stockPrices: Record<string, number> = {}
    const priceHistory: Record<string, number[]> = {}
    const priceChanges: Record<string, number> = {}

    // Initialize prices and history
    stocks.forEach((stock) => {
      stockPrices[stock.symbol] = stock.initialPrice
      priceHistory[stock.symbol] = [stock.initialPrice]
      priceChanges[stock.symbol] = 0
    })

    set({
      cash: 10000,
      stocks,
      portfolio: [],
      stockPrices,
      priceHistory,
      priceChanges,
      marketNews: [],
    })
  },

  updateStockPrices: () => {
    const { stocks, stockPrices, priceHistory, marketNews } = get()
    const newPrices: Record<string, number> = { ...stockPrices }
    const newHistory: Record<string, number[]> = { ...priceHistory }
    const newChanges: Record<string, number> = {}

    // Get the most recent news for impact calculation
    const recentNews = marketNews.length > 0 ? marketNews[0] : null

    // Update each stock price
    stocks.forEach((stock) => {
      const currentPrice = stockPrices[stock.symbol]

      // Base random movement
      const randomFactor = (Math.random() - 0.5) * 2 * stock.volatility

      // News impact (if applicable)
      let newsImpact = 0
      if (recentNews) {
        if (recentNews.sector === stock.sector) {
          newsImpact = recentNews.impact * 0.5 // Sector-wide impact
        }
        if (recentNews.affectedStocks?.includes(stock.symbol)) {
          newsImpact += recentNews.impact // Direct stock impact
        }
      }

      // Calculate new price
      const changePercent = randomFactor + newsImpact
      const newPrice = Math.max(currentPrice * (1 + changePercent), 0.01) // Ensure price doesn't go below 0.01

      // Update state
      newPrices[stock.symbol] = newPrice
      newHistory[stock.symbol] = [...newHistory[stock.symbol], newPrice]

      // Calculate percent change from previous price
      const previousPrice = stockPrices[stock.symbol]
      newChanges[stock.symbol] = ((newPrice - previousPrice) / previousPrice) * 100
    })

    set({
      stockPrices: newPrices,
      priceHistory: newHistory,
      priceChanges: newChanges,
    })
  },

  generateMarketNews: () => {
    const { stocks, marketNews } = get()
    const newsEvent = generateNewsEvent(stocks)

    // Add to the beginning of the news array (most recent first)
    set({
      marketNews: [newsEvent, ...marketNews].slice(0, 10), // Keep only the 10 most recent news items
    })
  },

  buyStock: (symbol: string, shares: number) => {
    const { cash, stockPrices, portfolio } = get()
    const price = stockPrices[symbol]
    const cost = price * shares

    // Check if user has enough cash
    if (cost > cash) {
      console.error("Not enough cash to complete purchase")
      return
    }

    // Find existing position or create new one
    const existingPosition = portfolio.find((p) => p.symbol === symbol)
    let newPortfolio

    if (existingPosition) {
      // Update existing position
      const totalShares = existingPosition.shares + shares
      const totalCost = existingPosition.shares * existingPosition.avgPrice + shares * price
      const newAvgPrice = totalCost / totalShares

      newPortfolio = portfolio.map((p) =>
        p.symbol === symbol ? { ...p, shares: totalShares, avgPrice: newAvgPrice } : p,
      )
    } else {
      // Add new position
      newPortfolio = [...portfolio, { symbol, shares, avgPrice: price }]
    }

    // Update state
    set({
      cash: cash - cost,
      portfolio: newPortfolio,
    })
  },

  sellStock: (symbol: string, shares: number) => {
    const { cash, stockPrices, portfolio } = get()
    const position = portfolio.find((p) => p.symbol === symbol)

    if (!position || position.shares < shares) {
      console.error("Not enough shares to sell")
      return
    }

    const price = stockPrices[symbol]
    const proceeds = price * shares

    // Update portfolio
    let newPortfolio
    if (position.shares === shares) {
      // Remove position entirely
      newPortfolio = portfolio.filter((p) => p.symbol !== symbol)
    } else {
      // Reduce position (avg price stays the same)
      newPortfolio = portfolio.map((p) => (p.symbol === symbol ? { ...p, shares: p.shares - shares } : p))
    }

    // Update state
    set({
      cash: cash + proceeds,
      portfolio: newPortfolio,
    })
  },

  getPortfolioValue: () => {
    const { portfolio, stockPrices } = get()
    return portfolio.reduce((total, position) => {
      return total + position.shares * stockPrices[position.symbol]
    }, 0)
  },

  getTotalPortfolioValue: () => {
    const { cash } = get()
    return cash + get().getPortfolioValue()
  },

  getPerformance: () => {
    const initialCash = 10000 // Starting amount
    const currentValue = get().getTotalPortfolioValue()
    return ((currentValue - initialCash) / initialCash) * 100
  },
}))
