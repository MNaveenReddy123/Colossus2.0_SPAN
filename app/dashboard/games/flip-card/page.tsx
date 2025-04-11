"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { IndianRupee } from "lucide-react";

const terms = [
  {
    term: "Compound Interest",
    definition: "Interest calculated on initial and accumulated interest.",
  },
  {
    term: "Inflation",
    definition:
      "General increase in prices and fall in purchasing value of money.",
  },
  {
    term: "Diversification",
    definition: "Spreading investments to reduce risk.",
  },
  {
    term: "Mutual Fund",
    definition: "Investment vehicle pooling money from investors.",
  },
  {
    term: "Credit Score",
    definition: "Numeric expression of a person's creditworthiness.",
  },
  { term: "Assets", definition: "Resources with economic value." },
  { term: "Liabilities", definition: "Company's legal debts or obligations." },
  { term: "Net Worth", definition: "Assets minus liabilities." },
  { term: "Capital Gains", definition: "Profit from the sale of an asset." },
  { term: "Liquidity", definition: "Ease of converting asset to cash." },
  {
    term: "Dividend",
    definition: "Payment made by a corporation to its shareholders.",
  },
  {
    term: "Equity",
    definition: "Ownership interest in a company or property.",
  },
  {
    term: "Bond",
    definition: "Debt security issued by a borrower to raise funds.",
  },
  { term: "Stock", definition: "Share of ownership in a company." },
  {
    term: "Portfolio",
    definition: "Collection of investments held by an individual or entity.",
  },
  {
    term: "Interest Rate",
    definition: "Percentage charged on borrowed money.",
  },
  {
    term: "Principal",
    definition: "Original sum of money borrowed or invested.",
  },
  {
    term: "Depreciation",
    definition: "Decrease in value of an asset over time.",
  },
  {
    term: "Appreciation",
    definition: "Increase in value of an asset over time.",
  },
  {
    term: "Leverage",
    definition: "Use of borrowed funds to increase investment potential.",
  },
  {
    term: "Risk Tolerance",
    definition:
      "Degree of variability in investment returns an investor can withstand.",
  },
  {
    term: "Bull Market",
    definition: "Market condition where prices are rising.",
  },
  {
    term: "Bear Market",
    definition: "Market condition where prices are falling.",
  },
  { term: "Index Fund", definition: "Fund tracking a specific market index." },
  {
    term: "ETF (Exchange-Traded Fund)",
    definition:
      "Marketable security tracking an index, commodity, or basket of assets.",
  },
  {
    term: "Hedge Fund",
    definition:
      "Investment fund using advanced strategies to maximize returns.",
  },
  {
    term: "Broker",
    definition: "Individual or firm facilitating investment transactions.",
  },
  { term: "Margin", definition: "Borrowed money used to purchase securities." },
  {
    term: "Amortization",
    definition: "Gradual repayment of a debt over time.",
  },
  {
    term: "Annuity",
    definition: "Financial product providing regular payments over time.",
  },
  {
    term: "Bankruptcy",
    definition: "Legal status of inability to repay debts.",
  },
  { term: "Collateral", definition: "Asset pledged as security for a loan." },
  {
    term: "Default",
    definition: "Failure to repay a loan according to terms.",
  },
  { term: "Yield", definition: "Income return on an investment." },
  {
    term: "Capital",
    definition: "Wealth available for investment or production.",
  },
  {
    term: "Cash Flow",
    definition: "Movement of money in and out of a business.",
  },
  { term: "Debt", definition: "Money owed to another party." },
  { term: "Revenue", definition: "Income generated from business activities." },
  {
    term: "Profit",
    definition: "Financial gain after expenses are subtracted.",
  },
  {
    term: "Loss",
    definition: "Financial deficit when expenses exceed revenue.",
  },
  { term: "Budget", definition: "Plan for managing income and expenses." },
  { term: "Savings", definition: "Money set aside for future use." },
  { term: "Expense", definition: "Cost incurred in earning revenue." },
  { term: "Income", definition: "Money received from work or investments." },
  { term: "Tax", definition: "Mandatory payment to the government." },
  { term: "Gross Income", definition: "Total income before deductions." },
  { term: "Net Income", definition: "Income after taxes and deductions." },
  { term: "Credit", definition: "Ability to borrow money or access goods." },
  { term: "Debit", definition: "Money withdrawn from an account." },
  {
    term: "Balance Sheet",
    definition: "Financial statement of assets, liabilities, and equity.",
  },
  {
    term: "Income Statement",
    definition: "Report of revenue, expenses, and profit over time.",
  },
  {
    term: "ROI (Return on Investment)",
    definition: "Measure of profitability from an investment.",
  },
  {
    term: "Volatility",
    definition: "Degree of variation in investment prices.",
  },
  {
    term: "Arbitrage",
    definition: "Profiting from price differences in markets.",
  },
  { term: "Blue Chip", definition: "Stock of a large, stable company." },
  { term: "Commodities", definition: "Raw materials traded in markets." },
  {
    term: "Derivative",
    definition: "Financial contract based on an underlying asset.",
  },
  {
    term: "Futures",
    definition: "Agreement to buy or sell an asset at a future date.",
  },
  {
    term: "Option",
    definition: "Right to buy or sell an asset at a set price.",
  },
  {
    term: "Short Selling",
    definition: "Selling borrowed stock expecting a price drop.",
  },
  {
    term: "IPO (Initial Public Offering)",
    definition: "First sale of stock by a private company.",
  },
  {
    term: "Market Cap",
    definition: "Total value of a company’s outstanding shares.",
  },
  {
    term: "P/E Ratio",
    definition: "Price-to-earnings ratio measuring stock valuation.",
  },
  {
    term: "Recession",
    definition: "Significant decline in economic activity.",
  },
  {
    term: "GDP (Gross Domestic Product)",
    definition: "Total value of goods and services produced in a country.",
  },
  {
    term: "Deflation",
    definition: "General decrease in prices of goods and services.",
  },
  {
    term: "Stagflation",
    definition: "High inflation combined with economic stagnation.",
  },
  {
    term: "Monetary Policy",
    definition: "Government actions to control money supply.",
  },
  {
    term: "Fiscal Policy",
    definition: "Government use of taxation and spending.",
  },
  {
    term: "Exchange Rate",
    definition: "Value of one currency in terms of another.",
  },
  {
    term: "Forex (Foreign Exchange)",
    definition: "Market for trading currencies.",
  },
  {
    term: "Cryptocurrency",
    definition: "Digital currency using encryption for security.",
  },
  {
    term: "Blockchain",
    definition: "Decentralized ledger for recording transactions.",
  },
  {
    term: "Insider Trading",
    definition: "Illegal trading based on non-public information.",
  },
  {
    term: "Securities",
    definition: "Tradable financial assets like stocks or bonds.",
  },
  {
    term: "Underwriting",
    definition: "Process of evaluating and assuming financial risk.",
  },
  {
    term: "Venture Capital",
    definition: "Funding provided to startups with growth potential.",
  },
  {
    term: "Private Equity",
    definition: "Investment in private companies not publicly traded.",
  },
  {
    term: "Real Estate",
    definition: "Property consisting of land and buildings.",
  },
  { term: "Mortgage", definition: "Loan used to purchase property." },
  {
    term: "Foreclosure",
    definition: "Lender seizing property due to unpaid debt.",
  },
  {
    term: "Refinancing",
    definition: "Replacing an existing loan with a new one.",
  },
  {
    term: "Escrow",
    definition: "Third-party holding of funds during a transaction.",
  },
  { term: "Trust", definition: "Arrangement where a trustee manages assets." },
  {
    term: "Estate",
    definition: "Total property and assets owned by an individual.",
  },
  { term: "Inheritance", definition: "Assets passed down after death." },
  { term: "Pension", definition: "Retirement fund provided by an employer." },
  { term: "401(k)", definition: "Employer-sponsored retirement savings plan." },
  {
    term: "IRA (Individual Retirement Account)",
    definition: "Personal retirement savings account.",
  },
  {
    term: "Annuity",
    definition: "Contract providing regular payments in retirement.",
  },
  { term: "Premium", definition: "Payment for insurance coverage." },
  {
    term: "Deductible",
    definition: "Amount paid out-of-pocket before insurance kicks in.",
  },
  { term: "Claim", definition: "Request for insurance payment after a loss." },
  { term: "Policy", definition: "Contract outlining insurance coverage." },
  {
    term: "Underwriter",
    definition: "Person or entity assessing insurance risk.",
  },
  {
    term: "Actuary",
    definition: "Professional analyzing financial risk using statistics.",
  },
  {
    term: "Reinsurance",
    definition: "Insurance purchased by insurers to mitigate risk.",
  },
  {
    term: "Credit Limit",
    definition: "Maximum amount allowed to borrow on credit.",
  },
  {
    term: "APR (Annual Percentage Rate)",
    definition: "Yearly cost of borrowing, including fees.",
  },
  { term: "Overdraft", definition: "Withdrawal exceeding account balance." },
];

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const MemoryGamePage = () => {
  const [cards, setCards] = useState<
    { id: number; content: string; matched: boolean }[]
  >([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[][]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    const selected = shuffleArray(terms).slice(0, 6);
    const pairs = shuffleArray(
      selected.flatMap((item) => [
        { content: item.term, id: Math.random(), matched: false },
        { content: item.definition, id: Math.random(), matched: false },
      ])
    );
    setCards(pairs);
    setStartTime(new Date());
    setGameOver(false);
    setMoves(0);
    setMatchedPairs([]);
    setFlippedIndices([]);
    setElapsedTime(0);
    setGameStarted(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameOver && startTime) {
      timer = setInterval(() => {
        setElapsedTime(
          Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
        );
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, gameOver, gameStarted]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.includes(index) || cards[index].matched) return;
    if (flippedIndices.length === 0) {
      setFlippedIndices([index]);
    } else if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      const secondIndex = index;
      setFlippedIndices([firstIndex, secondIndex]);
      setMoves((prev) => prev + 1);

      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      const match = terms.some(
        (term) =>
          (term.term === firstCard.content &&
            term.definition === secondCard.content) ||
          (term.definition === firstCard.content &&
            term.term === secondCard.content)
      );

      if (match) {
        const newCards = cards.map((card, i) => {
          if (i === firstIndex || i === secondIndex) {
            return { ...card, matched: true };
          }
          return card;
        });
        setCards(newCards);
        setMatchedPairs((prev) => [...prev, [firstIndex, secondIndex]]);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs.length === cards.length / 2 && cards.length > 0) {
      setGameOver(true);
    }
  }, [matchedPairs, cards]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-pink-200">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-5xl font-bold mb-6 text-purple-700">
            🧠 Finance Memory Game
          </h1>
          <p className="text-xl mb-6 text-gray-600">
            Match finance terms with their definitions!
          </p>
          <Button
            onClick={startGame}
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3 rounded-full shadow-lg"
          >
            ▶ Start Game
          </Button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const XP = Math.max(100 - ((moves - 12) * 5 + elapsedTime / 2), 10);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-200">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-5xl font-extrabold mb-6 text-purple-700">
            🎉 You Won!
          </h1>
          <p className="text-2xl mb-2 text-gray-700">
            🕒 Time: {elapsedTime} seconds
          </p>
          <p className="text-2xl mb-6 text-gray-700">🎯 Moves: {moves}</p>
          <p className="text-2xl mb-6 text-gray-700"> You earned {XP}XP.</p>
          <Button
            onClick={startGame}
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3 rounded-full shadow-lg"
          >
            🔁 New Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        💸 Finance Memory Match
      </h1>
      <div className="text-lg mb-4 text-gray-700">
        Moves: {moves} | Time: {elapsedTime}s
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-5xl">
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || card.matched;
          return (
            <motion.div
              key={card.id}
              className="w-36 h-36"
              onClick={() => handleCardClick(index)}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="w-full h-full cursor-pointer shadow-xl border-2 border-purple-300 rounded-2xl">
                <CardContent className="flex items-center justify-center h-full text-center text-xl font-semibold text-gray-800">
                  {isFlipped ? (
                    card.content
                  ) : (
                    <IndianRupee size={40} className="text-purple-600" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <Button
        onClick={startGame}
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full shadow-md"
      >
        🔁 New Game
      </Button>
    </div>
  );
};

export default MemoryGamePage;