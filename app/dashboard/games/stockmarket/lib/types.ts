export interface Stock {
  symbol: string
  name: string
  sector: string
  description: string
  volatility: number
  initialPrice: number
}

export interface Position {
  symbol: string
  shares: number
  avgPrice: number
}

export interface NewsItem {
  headline: string
  content: string
  impact: number
  sector?: string
  affectedStocks?: string[]
}
