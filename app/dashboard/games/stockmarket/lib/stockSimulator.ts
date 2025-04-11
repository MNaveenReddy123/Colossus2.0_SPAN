import type { Stock, NewsItem } from "./types"

// Generate a set of fictional stocks
export function generateStocks(): Stock[] {
  return [
    {
      symbol: "TECH",
      name: "TechCorp Inc.",
      sector: "Technology",
      description: "A leading technology company specializing in software and hardware solutions.",
      volatility: 0.15,
      initialPrice: 150,
    },
    {
      symbol: "FNCE",
      name: "Finance Global",
      sector: "Financial",
      description: "A multinational financial services corporation offering banking and investment solutions.",
      volatility: 0.08,
      initialPrice: 85,
    },
    {
      symbol: "HLTH",
      name: "HealthPlus",
      sector: "Healthcare",
      description: "A healthcare company focused on medical devices and pharmaceuticals.",
      volatility: 0.1,
      initialPrice: 120,
    },
    {
      symbol: "ENRG",
      name: "EnergyX",
      sector: "Energy",
      description: "An energy company specializing in renewable energy solutions.",
      volatility: 0.12,
      initialPrice: 65,
    },
    {
      symbol: "CONS",
      name: "Consumer Goods Co.",
      sector: "Consumer",
      description: "A consumer goods company producing everyday products for households.",
      volatility: 0.06,
      initialPrice: 45,
    },
    {
      symbol: "RETL",
      name: "Retail Chain Inc.",
      sector: "Retail",
      description: "A major retail chain with stores across the country.",
      volatility: 0.09,
      initialPrice: 72,
    },
    {
      symbol: "MANU",
      name: "Manufacturing Group",
      sector: "Industrial",
      description: "A manufacturing company producing industrial equipment and machinery.",
      volatility: 0.07,
      initialPrice: 95,
    },
    {
      symbol: "TELE",
      name: "Telecom Services",
      sector: "Telecommunications",
      description: "A telecommunications provider offering mobile and internet services.",
      volatility: 0.08,
      initialPrice: 110,
    },
  ]
}

// List of possible news events
const newsEvents = [
  {
    headline: "Tech Breakthrough Announced",
    content: "A major technology breakthrough has been announced that could revolutionize the industry.",
    impact: 0.08,
    sector: "Technology",
    affectedStocks: ["TECH"],
  },
  {
    headline: "Interest Rates Cut",
    content: "The central bank has announced a cut in interest rates to stimulate economic growth.",
    impact: 0.05,
    sector: "Financial",
    affectedStocks: ["FNCE"],
  },
  {
    headline: "New Healthcare Regulation",
    content: "New healthcare regulations have been approved that will impact the industry.",
    impact: 0.06,
    sector: "Healthcare",
    affectedStocks: ["HLTH"],
  },
  {
    headline: "Oil Prices Surge",
    content: "Global oil prices have surged due to supply constraints.",
    impact: 0.09,
    sector: "Energy",
    affectedStocks: ["ENRG"],
  },
  {
    headline: "Consumer Spending Increases",
    content: "Consumer spending has increased significantly in the last quarter.",
    impact: 0.07,
    sector: "Consumer",
    affectedStocks: ["CONS", "RETL"],
  },
  {
    headline: "Market Downturn Fears",
    content: "Analysts are expressing concerns about a potential market downturn.",
    impact: -0.06,
    sector: null,
    affectedStocks: [],
  },
  {
    headline: "Tech Company Faces Lawsuit",
    content: "A major tech company is facing a lawsuit over privacy concerns.",
    impact: -0.09,
    sector: "Technology",
    affectedStocks: ["TECH"],
  },
  {
    headline: "Banking Crisis Looms",
    content: "Experts warn of a potential banking crisis due to economic instability.",
    impact: -0.08,
    sector: "Financial",
    affectedStocks: ["FNCE"],
  },
  {
    headline: "Healthcare Breakthrough",
    content: "A significant breakthrough in medical research has been announced.",
    impact: 0.1,
    sector: "Healthcare",
    affectedStocks: ["HLTH"],
  },
  {
    headline: "Energy Demand Drops",
    content: "Global energy demand has decreased due to economic slowdown.",
    impact: -0.07,
    sector: "Energy",
    affectedStocks: ["ENRG"],
  },
  {
    headline: "Retail Sales Disappoint",
    content: "Retail sales figures have come in below expectations.",
    impact: -0.05,
    sector: "Retail",
    affectedStocks: ["RETL", "CONS"],
  },
  {
    headline: "Manufacturing Output Increases",
    content: "Manufacturing output has increased beyond expectations.",
    impact: 0.06,
    sector: "Industrial",
    affectedStocks: ["MANU"],
  },
  {
    headline: "Telecommunications Merger",
    content: "A major merger in the telecommunications industry has been announced.",
    impact: 0.08,
    sector: "Telecommunications",
    affectedStocks: ["TELE"],
  },
  {
    headline: "Global Economic Growth",
    content: "Global economic growth forecasts have been revised upward.",
    impact: 0.04,
    sector: null,
    affectedStocks: [],
  },
  {
    headline: "Trade Tensions Escalate",
    content: "Trade tensions between major economies have escalated.",
    impact: -0.05,
    sector: null,
    affectedStocks: [],
  },
]

// Generate a random news event
export function generateNewsEvent(stocks: Stock[]): NewsItem {
  // Select a random news event
  const randomEvent = newsEvents[Math.floor(Math.random() * newsEvents.length)]

  // For events without specific affected stocks, randomly select some
  let affectedStocks = [...(randomEvent.affectedStocks || [])]

  if (affectedStocks.length === 0 && randomEvent.sector) {
    // Affect all stocks in the sector
    const sectorStocks = stocks.filter((stock) => stock.sector === randomEvent.sector).map((stock) => stock.symbol)
    affectedStocks = sectorStocks
  } else if (affectedStocks.length === 0 && !randomEvent.sector) {
    // Market-wide event, potentially affect random stocks
    const numStocksToAffect = Math.floor(Math.random() * 3) + 1 // 1-3 stocks
    const shuffledStocks = [...stocks].sort(() => 0.5 - Math.random())
    affectedStocks = shuffledStocks.slice(0, numStocksToAffect).map((s) => s.symbol)
  }

  return {
    headline: randomEvent.headline,
    content: randomEvent.content,
    impact: randomEvent.impact,
    sector: randomEvent.sector || undefined,
    affectedStocks,
  }
}
