"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { saveActivityProgress } from "@/actions/user-actions";
import { toast } from "@/components/ui/use-toast";

// Quiz questions
const questions = [
  {
    id: 1,
    question:
      "What is the purpose of an emergency fund in relation to investing?",
    options: [
      { id: "a", text: "To invest all your money at once" },
      {
        id: "b",
        text: "To cover unexpected expenses without selling investments",
      },
      { id: "c", text: "To pay for luxury vacations" },
      { id: "d", text: "To replace regular income" },
    ],
    correctAnswer: "b",
    explanation:
      "An emergency fund provides a financial cushion for unexpected costs, preventing the need to liquidate investments prematurely.",
  },
  {
    id: 2,
    question: "Which of these investments is most affected by inflation?",
    options: [
      { id: "a", text: "Cash in a savings account" },
      { id: "b", text: "Stocks" },
      { id: "c", text: "Real estate" },
      { id: "d", text: "Commodities" },
    ],
    correctAnswer: "a",
    explanation:
      "Cash loses purchasing power over time due to inflation, while other assets may adjust or grow to offset it.",
  },
  {
    id: 3,
    question: "What is a 'blue-chip' stock?",
    options: [
      { id: "a", text: "A stock from a small startup" },
      {
        id: "b",
        text: "A stock from a well-established, financially stable company",
      },
      { id: "c", text: "A stock that only pays dividends" },
      { id: "d", text: "A stock with no risk" },
    ],
    correctAnswer: "b",
    explanation:
      "Blue-chip stocks are from large, reputable companies with a history of stability and reliable performance.",
  },
  {
    id: 4,
    question: "What does the term 'portfolio' refer to in investing?",
    options: [
      { id: "a", text: "A type of bond" },
      {
        id: "b",
        text: "A collection of different investments owned by an individual",
      },
      { id: "c", text: "A savings account" },
      { id: "d", text: "A single stock" },
    ],
    correctAnswer: "b",
    explanation:
      "A portfolio is the total mix of investments an individual holds, such as stocks, bonds, and funds.",
  },
  {
    id: 5,
    question:
      "What is the main advantage of a Roth IRA over a traditional IRA?",
    options: [
      { id: "a", text: "Tax-free withdrawals in retirement" },
      { id: "b", text: "Immediate tax deductions" },
      { id: "c", text: "Higher interest rates" },
      { id: "d", text: "Guaranteed returns" },
    ],
    correctAnswer: "a",
    explanation:
      "Roth IRA contributions are made with after-tax money, allowing tax-free growth and withdrawals in retirement.",
  },
  {
    id: 6,
    question: "What does 'bull market' mean?",
    options: [
      { id: "a", text: "A market with declining prices" },
      { id: "b", text: "A market with rising prices" },
      { id: "c", text: "A market with no change" },
      { id: "d", text: "A market focused on agriculture" },
    ],
    correctAnswer: "b",
    explanation:
      "A bull market describes a period when investment prices, especially stocks, are increasing.",
  },
  {
    id: 7,
    question: "Which factor most influences the value of a bond?",
    options: [
      { id: "a", text: "Stock market performance" },
      { id: "b", text: "Interest rates" },
      { id: "c", text: "Company profits" },
      { id: "d", text: "Weather conditions" },
    ],
    correctAnswer: "b",
    explanation:
      "Bond values typically move inversely to interest rates; when rates rise, bond prices fall, and vice versa.",
  },
  {
    id: 8,
    question: "What is an ETF?",
    options: [
      { id: "a", text: "A type of insurance" },
      {
        id: "b",
        text: "An exchange-traded fund that tracks a basket of assets",
      },
      { id: "c", text: "A government loan" },
      { id: "d", text: "A savings bond" },
    ],
    correctAnswer: "b",
    explanation:
      "ETFs are funds traded on stock exchanges, offering diversification by tracking indices or asset groups.",
  },
  {
    id: 9,
    question: "Why might someone choose to invest in real estate?",
    options: [
      { id: "a", text: "For guaranteed profits" },
      {
        id: "b",
        text: "For potential rental income and property appreciation",
      },
      { id: "c", text: "To avoid diversification" },
      { id: "d", text: "For instant liquidity" },
    ],
    correctAnswer: "b",
    explanation:
      "Real estate can provide income through rent and potential value increases over time, though it carries risks.",
  },
  {
    id: 10,
    question: "What is a dividend?",
    options: [
      { id: "a", text: "A loan repayment" },
      {
        id: "b",
        text: "A portion of a company's profits paid to shareholders",
      },
      { id: "c", text: "A type of tax" },
      { id: "d", text: "A government grant" },
    ],
    correctAnswer: "b",
    explanation:
      "Dividends are payments companies distribute to shareholders from their earnings, typically quarterly.",
  },
  {
    id: 11,
    question: "What does 'bear market' indicate?",
    options: [
      { id: "a", text: "A market with rising prices" },
      { id: "b", text: "A market with declining prices" },
      { id: "c", text: "A stable market" },
      { id: "d", text: "A market for commodities" },
    ],
    correctAnswer: "b",
    explanation:
      "A bear market is characterized by falling prices and pessimism among investors.",
  },
  {
    id: 12,
    question: "What is the main purpose of a 401(k) plan?",
    options: [
      { id: "a", text: "To buy a house" },
      { id: "b", text: "To save for retirement with tax advantages" },
      { id: "c", text: "To pay for education" },
      { id: "d", text: "To start a business" },
    ],
    correctAnswer: "b",
    explanation:
      "A 401(k) is an employer-sponsored retirement plan offering tax benefits to encourage long-term savings.",
  },
  {
    id: 13,
    question:
      "Which of these investments typically has the longest time horizon?",
    options: [
      { id: "a", text: "Day trading stocks" },
      { id: "b", text: "Retirement accounts" },
      { id: "c", text: "Short-term bonds" },
      { id: "d", text: "Certificates of deposit" },
    ],
    correctAnswer: "b",
    explanation:
      "Retirement accounts are designed for long-term growth, often spanning decades until retirement age.",
  },
  {
    id: 14,
    question: "What does 'asset allocation' mean?",
    options: [
      { id: "a", text: "Dividing investments among different asset classes" },
      { id: "b", text: "Selling all your investments" },
      { id: "c", text: "Investing only in one stock" },
      { id: "d", text: "Keeping money in cash" },
    ],
    correctAnswer: "a",
    explanation:
      "Asset allocation involves distributing investments across categories like stocks, bonds, and cash to manage risk.",
  },
  {
    id: 15,
    question: "What is a key benefit of reinvesting dividends?",
    options: [
      { id: "a", text: "Immediate cash flow" },
      { id: "b", text: "Compounding growth over time" },
      { id: "c", text: "Avoiding taxes" },
      { id: "d", text: "Reducing risk completely" },
    ],
    correctAnswer: "b",
    explanation:
      "Reinvesting dividends buys more shares, enhancing growth through the power of compounding.",
  },
  {
    id: 16,
    question:
      "Which type of investment is most likely to protect against currency devaluation?",
    options: [
      { id: "a", text: "Cash savings" },
      { id: "b", text: "Gold" },
      { id: "c", text: "Government bonds" },
      { id: "d", text: "Certificates of deposit" },
    ],
    correctAnswer: "b",
    explanation:
      "Gold is often seen as a hedge against currency devaluation because its value isn't tied to a single currency.",
  },
  {
    id: 17,
    question: "What is a 'market correction'?",
    options: [
      { id: "a", text: "A permanent market crash" },
      { id: "b", text: "A short-term drop of 10% or more in market prices" },
      { id: "c", text: "A government intervention" },
      { id: "d", text: "A rise in stock prices" },
    ],
    correctAnswer: "b",
    explanation:
      "A market correction is a temporary decline of at least 10%, often seen as a natural adjustment.",
  },
  {
    id: 18,
    question: "Why might someone invest in commodities like oil or wheat?",
    options: [
      { id: "a", text: "For guaranteed returns" },
      { id: "b", text: "To diversify and hedge against inflation" },
      { id: "c", text: "For immediate liquidity" },
      { id: "d", text: "To avoid taxes" },
    ],
    correctAnswer: "b",
    explanation:
      "Commodities can diversify a portfolio and often rise in value during inflationary periods.",
  },
  {
    id: 19,
    question: "What is a 'yield' in the context of investing?",
    options: [
      { id: "a", text: "The total amount invested" },
      {
        id: "b",
        text: "The income return on an investment, such as interest or dividends",
      },
      { id: "c", text: "A type of stock" },
      { id: "d", text: "A tax deduction" },
    ],
    correctAnswer: "b",
    explanation:
      "Yield measures the income generated by an investment, expressed as a percentage of its cost or value.",
  },
  {
    id: 20,
    question: "What does it mean to 'buy low and sell high'?",
    options: [
      { id: "a", text: "A strategy to lose money" },
      { id: "b", text: "A basic principle of earning a profit in investing" },
      { id: "c", text: "A guaranteed outcome" },
      { id: "d", text: "A tax strategy" },
    ],
    correctAnswer: "b",
    explanation:
      "This phrase describes the goal of purchasing assets at a low price and selling them at a higher price for profit.",
  },
  {
    id: 21,
    question: "What is the primary risk of investing in a single stock?",
    options: [
      { id: "a", text: "Lack of diversification" },
      { id: "b", text: "Guaranteed losses" },
      { id: "c", text: "Too much liquidity" },
      { id: "d", text: "No risk at all" },
    ],
    correctAnswer: "a",
    explanation:
      "Investing in one stock increases risk because poor performance of that company directly impacts your investment.",
  },
  {
    id: 22,
    question: "What does 'capital gain' refer to?",
    options: [
      { id: "a", text: "The interest earned on a bond" },
      {
        id: "b",
        text: "The profit made from selling an asset for more than its purchase price",
      },
      { id: "c", text: "A type of dividend" },
      { id: "d", text: "A tax penalty" },
    ],
    correctAnswer: "b",
    explanation:
      "Capital gain is the profit realized when an asset, like a stock, is sold for more than its original cost.",
  },
  {
    id: 23,
    question: "What is a 'penny stock'?",
    options: [
      { id: "a", text: "A stock from a major corporation" },
      { id: "b", text: "A low-priced, speculative stock, often under $5" },
      { id: "c", text: "A government-issued stock" },
      { id: "d", text: "A stock with no risk" },
    ],
    correctAnswer: "b",
    explanation:
      "Penny stocks are inexpensive but risky, often from small companies with high volatility.",
  },
  {
    id: 24,
    question: "Why might someone prefer a savings account over stocks?",
    options: [
      { id: "a", text: "For higher returns" },
      { id: "b", text: "For safety and guaranteed principal" },
      { id: "c", text: "For diversification" },
      { id: "d", text: "For long-term growth" },
    ],
    correctAnswer: "b",
    explanation:
      "Savings accounts offer low risk and protect your initial deposit, though they provide minimal growth.",
  },
  {
    id: 25,
    question: "What is the role of a financial advisor in investing?",
    options: [
      { id: "a", text: "To guarantee profits" },
      {
        id: "b",
        text: "To provide guidance and help create an investment plan",
      },
      { id: "c", text: "To manage taxes only" },
      { id: "d", text: "To lend money" },
    ],
    correctAnswer: "b",
    explanation:
      "A financial advisor offers expertise and personalized strategies to help investors meet their goals.",
  },
  {
    id: 26,
    question: "What is the primary purpose of a stock split?",
    options: [
      { id: "a", text: "To increase the company's profits" },
      {
        id: "b",
        text: "To make shares more affordable by increasing the number of shares",
      },
      { id: "c", text: "To reduce the company's debt" },
      { id: "d", text: "To pay dividends" },
    ],
    correctAnswer: "b",
    explanation:
      "A stock split increases the number of shares and lowers the price per share, making it more accessible to investors.",
  },
  {
    id: 27,
    question: "What does 'expense ratio' refer to in mutual funds?",
    options: [
      { id: "a", text: "The profit earned by the fund" },
      {
        id: "b",
        text: "The annual fee charged by the fund as a percentage of assets",
      },
      { id: "c", text: "The tax rate on investments" },
      { id: "d", text: "The amount invested" },
    ],
    correctAnswer: "b",
    explanation:
      "The expense ratio is the yearly cost of managing the fund, deducted from the fund's assets.",
  },
  {
    id: 28,
    question: "What is a key advantage of investing in municipal bonds?",
    options: [
      { id: "a", text: "High risk and high reward" },
      { id: "b", text: "Tax-exempt interest income" },
      { id: "c", text: "Guaranteed doubling of money" },
      { id: "d", text: "Instant liquidity" },
    ],
    correctAnswer: "b",
    explanation:
      "Municipal bonds often offer interest payments that are exempt from federal and sometimes state taxes.",
  },
  {
    id: 29,
    question: "What does it mean when a stock is 'overbought'?",
    options: [
      { id: "a", text: "It has too many buyers and may be overvalued" },
      { id: "b", text: "It is undervalued and a good buy" },
      { id: "c", text: "It has no buyers" },
      { id: "d", text: "It is guaranteed to rise" },
    ],
    correctAnswer: "a",
    explanation:
      "An overbought stock has seen excessive buying, potentially leading to a price correction.",
  },
  {
    id: 30,
    question: "What is the main goal of a balanced mutual fund?",
    options: [
      { id: "a", text: "To invest only in stocks" },
      { id: "b", text: "To provide a mix of growth and income" },
      { id: "c", text: "To focus solely on bonds" },
      { id: "d", text: "To avoid all risk" },
    ],
    correctAnswer: "b",
    explanation:
      "Balanced funds invest in both stocks and bonds to offer growth potential and income stability.",
  },
  {
    id: 31,
    question: "What does 'short selling' involve?",
    options: [
      { id: "a", text: "Buying stocks to hold long-term" },
      {
        id: "b",
        text: "Borrowing and selling a stock, hoping to buy it back cheaper",
      },
      { id: "c", text: "Investing in short-term bonds" },
      { id: "d", text: "Diversifying a portfolio" },
    ],
    correctAnswer: "b",
    explanation:
      "Short selling is a strategy to profit from a stock's price decline by selling borrowed shares and repurchasing them later.",
  },
  {
    id: 32,
    question: "What is a 'sector fund'?",
    options: [
      { id: "a", text: "A fund investing across all industries" },
      {
        id: "b",
        text: "A fund focused on a specific industry, like technology",
      },
      { id: "c", text: "A government-backed fund" },
      { id: "d", text: "A fund with no fees" },
    ],
    correctAnswer: "b",
    explanation:
      "Sector funds concentrate investments in one industry, offering targeted exposure but less diversification.",
  },
  {
    id: 33,
    question: "What is the primary risk of investing in foreign stocks?",
    options: [
      { id: "a", text: "Guaranteed losses" },
      { id: "b", text: "Currency exchange rate fluctuations" },
      { id: "c", text: "Lack of liquidity" },
      { id: "d", text: "No dividends" },
    ],
    correctAnswer: "b",
    explanation:
      "Foreign stocks carry currency risk, where changes in exchange rates can affect returns.",
  },
  {
    id: 34,
    question: "What does 'rebalancing' a portfolio mean?",
    options: [
      { id: "a", text: "Selling all investments" },
      {
        id: "b",
        text: "Adjusting investments to maintain a desired asset allocation",
      },
      { id: "c", text: "Investing only in bonds" },
      { id: "d", text: "Avoiding stocks" },
    ],
    correctAnswer: "b",
    explanation:
      "Rebalancing restores a portfolio's target mix by buying or selling assets as their values shift.",
  },
  {
    id: 35,
    question: "What is a 'call option' in investing?",
    options: [
      { id: "a", text: "A right to sell a stock at a set price" },
      { id: "b", text: "A right to buy a stock at a set price" },
      { id: "c", text: "A type of bond" },
      { id: "d", text: "A guaranteed return" },
    ],
    correctAnswer: "b",
    explanation:
      "A call option gives the holder the right, but not obligation, to buy a stock at a specified price within a timeframe.",
  },
  {
    id: 36,
    question: "Why might an investor choose a money market fund?",
    options: [
      { id: "a", text: "For high growth potential" },
      { id: "b", text: "For safety and modest returns" },
      { id: "c", text: "For tax-free income" },
      { id: "d", text: "For long-term investment" },
    ],
    correctAnswer: "b",
    explanation:
      "Money market funds invest in short-term, low-risk securities, prioritizing safety over high returns.",
  },
  {
    id: 37,
    question: "What does 'P/E ratio' stand for in stock analysis?",
    options: [
      { id: "a", text: "Profit-to-Earnings ratio" },
      { id: "b", text: "Price-to-Earnings ratio" },
      { id: "c", text: "Portfolio-to-Equity ratio" },
      { id: "d", text: "Payment-to-Expense ratio" },
    ],
    correctAnswer: "b",
    explanation:
      "The P/E ratio compares a stock's price to its earnings per share, indicating its valuation.",
  },
  {
    id: 38,
    question: "What is a 'put option'?",
    options: [
      { id: "a", text: "A right to buy a stock at a set price" },
      { id: "b", text: "A right to sell a stock at a set price" },
      { id: "c", text: "A type of mutual fund" },
      { id: "d", text: "A government bond" },
    ],
    correctAnswer: "b",
    explanation:
      "A put option allows the holder to sell a stock at a specified price, often used to hedge against declines.",
  },
  {
    id: 39,
    question: "What is the main benefit of investing in a dividend stock?",
    options: [
      { id: "a", text: "Guaranteed high growth" },
      { id: "b", text: "Regular income from dividend payments" },
      { id: "c", text: "No risk" },
      { id: "d", text: "Tax exemption" },
    ],
    correctAnswer: "b",
    explanation:
      "Dividend stocks provide periodic cash payments, offering income alongside potential price appreciation.",
  },
  {
    id: 40,
    question: "What does 'market capitalization' measure?",
    options: [
      { id: "a", text: "A company's total debt" },
      { id: "b", text: "The total value of a company's outstanding shares" },
      { id: "c", text: "The company's annual profit" },
      { id: "d", text: "The tax rate" },
    ],
    correctAnswer: "b",
    explanation:
      "Market cap is calculated by multiplying a company's share price by its number of shares, reflecting its size.",
  },
  {
    id: 41,
    question: "What is a 'hedge fund'?",
    options: [
      { id: "a", text: "A government savings account" },
      {
        id: "b",
        text: "A pooled investment using advanced strategies to maximize returns",
      },
      { id: "c", text: "A type of bond" },
      { id: "d", text: "A low-risk mutual fund" },
    ],
    correctAnswer: "b",
    explanation:
      "Hedge funds use aggressive strategies, like leverage and derivatives, to seek high returns, often for wealthy investors.",
  },
  {
    id: 42,
    question: "What does it mean if a stock is 'oversold'?",
    options: [
      { id: "a", text: "It has too many buyers" },
      { id: "b", text: "It has been heavily sold and may be undervalued" },
      { id: "c", text: "It is guaranteed to drop" },
      { id: "d", text: "It has no volatility" },
    ],
    correctAnswer: "b",
    explanation:
      "An oversold stock has experienced excessive selling, potentially signaling a buying opportunity.",
  },
  {
    id: 43,
    question: "What is the primary purpose of a stop-loss order?",
    options: [
      { id: "a", text: "To buy a stock at a lower price" },
      {
        id: "b",
        text: "To limit losses by selling if a stock drops to a certain price",
      },
      { id: "c", text: "To guarantee profits" },
      { id: "d", text: "To diversify investments" },
    ],
    correctAnswer: "b",
    explanation:
      "A stop-loss order automatically sells a stock when it reaches a preset price to cap potential losses.",
  },
  {
    id: 44,
    question: "What is a 'REIT'?",
    options: [
      { id: "a", text: "A type of savings account" },
      {
        id: "b",
        text: "A Real Estate Investment Trust that invests in property",
      },
      { id: "c", text: "A government bond" },
      { id: "d", text: "A stock index" },
    ],
    correctAnswer: "b",
    explanation:
      "REITs allow investors to own real estate indirectly, often paying high dividends from rental income.",
  },
  {
    id: 45,
    question: "What does 'annualized return' measure?",
    options: [
      { id: "a", text: "The total profit made" },
      { id: "b", text: "The average yearly return of an investment" },
      { id: "c", text: "The tax rate" },
      { id: "d", text: "The initial investment amount" },
    ],
    correctAnswer: "b",
    explanation:
      "Annualized return calculates the average return per year over a period, accounting for compounding.",
  },
  {
    id: 46,
    question: "What is the main risk of using margin in trading?",
    options: [
      { id: "a", text: "No risk at all" },
      { id: "b", text: "Amplified losses if investments decline" },
      { id: "c", text: "Guaranteed profits" },
      { id: "d", text: "Lack of diversification" },
    ],
    correctAnswer: "b",
    explanation:
      "Margin involves borrowing to invest, increasing both potential gains and losses.",
  },
  {
    id: 47,
    question: "What does 'beta' measure in relation to a stock?",
    options: [
      { id: "a", text: "Its dividend yield" },
      { id: "b", text: "Its volatility compared to the overall market" },
      { id: "c", text: "Its total return" },
      { id: "d", text: "Its tax liability" },
    ],
    correctAnswer: "b",
    explanation:
      "Beta indicates how much a stock's price moves relative to the market, with 1 being equal to the market.",
  },
  {
    id: 48,
    question: "What is a 'closed-end fund'?",
    options: [
      { id: "a", text: "A fund with unlimited shares" },
      {
        id: "b",
        text: "A fund with a fixed number of shares traded like stocks",
      },
      { id: "c", text: "A savings account" },
      { id: "d", text: "A type of bond" },
    ],
    correctAnswer: "b",
    explanation:
      "Closed-end funds issue a set number of shares that trade on exchanges, unlike open-end mutual funds.",
  },
  {
    id: 49,
    question: "Why might an investor avoid speculative investments?",
    options: [
      { id: "a", text: "They offer guaranteed returns" },
      { id: "b", text: "They carry high risk and uncertainty" },
      { id: "c", text: "They are too diversified" },
      { id: "d", text: "They are tax-exempt" },
    ],
    correctAnswer: "b",
    explanation:
      "Speculative investments, like penny stocks, involve high risk with no assurance of returns.",
  },
  {
    id: 50,
    question: "What is the primary benefit of a tax-deferred account?",
    options: [
      { id: "a", text: "Immediate tax-free withdrawals" },
      { id: "b", text: "Paying taxes later, allowing more money to grow now" },
      { id: "c", text: "Avoiding all taxes" },
      { id: "d", text: "Guaranteed high returns" },
    ],
    correctAnswer: "b",
    explanation:
      "Tax-deferred accounts, like traditional IRAs, delay taxes until withdrawal, enhancing growth potential.",
  },
  {
    id: 51,
    question:
      "What is the main purpose of a prospectus for an investment fund?",
    options: [
      { id: "a", text: "To guarantee returns" },
      {
        id: "b",
        text: "To provide detailed information about the fund's objectives and risks",
      },
      { id: "c", text: "To advertise tax benefits" },
      { id: "d", text: "To list all investors" },
    ],
    correctAnswer: "b",
    explanation:
      "A prospectus outlines a fund's goals, strategies, fees, and risks to inform potential investors.",
  },
  {
    id: 52,
    question: "What does 'total return' include when evaluating an investment?",
    options: [
      { id: "a", text: "Only the initial investment" },
      {
        id: "b",
        text: "Both capital gains and income like dividends or interest",
      },
      { id: "c", text: "Only taxes paid" },
      { id: "d", text: "Only the fees charged" },
    ],
    correctAnswer: "b",
    explanation:
      "Total return combines price appreciation (capital gains) and any income generated, such as dividends.",
  },
  {
    id: 53,
    question: "What is a 'cyclical stock'?",
    options: [
      { id: "a", text: "A stock unaffected by economic changes" },
      {
        id: "b",
        text: "A stock tied to economic cycles, like automotive or travel",
      },
      { id: "c", text: "A stock with no dividends" },
      { id: "d", text: "A stock with guaranteed returns" },
    ],
    correctAnswer: "b",
    explanation:
      "Cyclical stocks rise and fall with economic conditions, thriving in booms and struggling in recessions.",
  },
  {
    id: 54,
    question: "What does 'NAV' stand for in the context of mutual funds?",
    options: [
      { id: "a", text: "Net Annual Value" },
      { id: "b", text: "Net Asset Value" },
      { id: "c", text: "New Account Value" },
      { id: "d", text: "Nominal Asset Valuation" },
    ],
    correctAnswer: "b",
    explanation:
      "Net Asset Value (NAV) is the per-share value of a fund, calculated by dividing total assets minus liabilities by the number of shares.",
  },
  {
    id: 55,
    question: "What is the primary advantage of a laddered bond portfolio?",
    options: [
      { id: "a", text: "Guaranteed high returns" },
      { id: "b", text: "Reducing interest rate risk by spreading maturities" },
      { id: "c", text: "Avoiding all taxes" },
      { id: "d", text: "Instant liquidity" },
    ],
    correctAnswer: "b",
    explanation:
      "A bond ladder staggers maturities to provide regular cash flow and mitigate the impact of rate changes.",
  },
  {
    id: 56,
    question: "What does 'going long' mean in investing?",
    options: [
      { id: "a", text: "Selling a stock to profit from a decline" },
      { id: "b", text: "Buying a stock expecting its price to rise" },
      { id: "c", text: "Holding a stock for less than a day" },
      { id: "d", text: "Avoiding all risk" },
    ],
    correctAnswer: "b",
    explanation:
      "Going long is the traditional strategy of buying an asset with the hope its value increases over time.",
  },
  {
    id: 57,
    question: "What is a 'defensive stock'?",
    options: [
      { id: "a", text: "A stock tied to economic booms" },
      {
        id: "b",
        text: "A stock from stable industries like utilities or healthcare",
      },
      { id: "c", text: "A highly volatile stock" },
      { id: "d", text: "A stock with no dividends" },
    ],
    correctAnswer: "b",
    explanation:
      "Defensive stocks perform steadily in economic downturns due to consistent demand for their products.",
  },
  {
    id: 58,
    question: "What does 'arbitrage' refer to in investing?",
    options: [
      { id: "a", text: "Buying and holding a single stock" },
      {
        id: "b",
        text: "Profiting from price differences in different markets",
      },
      { id: "c", text: "Avoiding all investments" },
      { id: "d", text: "Paying higher taxes" },
    ],
    correctAnswer: "b",
    explanation:
      "Arbitrage exploits price discrepancies of the same asset across markets for a risk-free profit.",
  },
  {
    id: 59,
    question: "What is the main purpose of a watchlist in investing?",
    options: [
      {
        id: "a",
        text: "To track investments you're considering or monitoring",
      },
      { id: "b", text: "To guarantee purchases" },
      { id: "c", text: "To pay dividends" },
      { id: "d", text: "To avoid taxes" },
    ],
    correctAnswer: "a",
    explanation:
      "A watchlist helps investors keep an eye on potential opportunities without committing to a trade.",
  },
  {
    id: 60,
    question: "What is a 'convertible bond'?",
    options: [
      { id: "a", text: "A bond that can be exchanged for company stock" },
      { id: "b", text: "A bond with no interest" },
      { id: "c", text: "A bond that matures in one day" },
      { id: "d", text: "A bond with guaranteed returns" },
    ],
    correctAnswer: "a",
    explanation:
      "Convertible bonds offer the option to convert into a set number of shares, blending debt and equity features.",
  },
  {
    id: 61,
    question: "What does 'technical analysis' focus on in investing?",
    options: [
      { id: "a", text: "A company's financial statements" },
      { id: "b", text: "Price patterns and market trends" },
      { id: "c", text: "Government policies" },
      { id: "d", text: "Tax implications" },
    ],
    correctAnswer: "b",
    explanation:
      "Technical analysis uses historical price and volume data to predict future market movements.",
  },
  {
    id: 62,
    question: "What is the primary benefit of a no-load mutual fund?",
    options: [
      { id: "a", text: "Guaranteed high returns" },
      { id: "b", text: "No sales commission fees" },
      { id: "c", text: "Tax-free income" },
      { id: "d", text: "Instant liquidity" },
    ],
    correctAnswer: "b",
    explanation:
      "No-load funds don't charge a commission, reducing costs for investors compared to load funds.",
  },
  {
    id: 63,
    question: "What does 'fundamental analysis' evaluate?",
    options: [
      { id: "a", text: "Market rumors" },
      { id: "b", text: "A company's financial health and performance" },
      { id: "c", text: "Short-term price changes" },
      { id: "d", text: "Weather patterns" },
    ],
    correctAnswer: "b",
    explanation:
      "Fundamental analysis assesses a company's earnings, assets, and management to determine its value.",
  },
  {
    id: 64,
    question: "What is a 'trailing stop' order?",
    options: [
      { id: "a", text: "A fixed sell price" },
      {
        id: "b",
        text: "A sell order that adjusts with the stock's price rise",
      },
      { id: "c", text: "A buy order for a declining stock" },
      { id: "d", text: "A diversification strategy" },
    ],
    correctAnswer: "b",
    explanation:
      "A trailing stop rises with the stock price but triggers a sale if the price drops by a set percentage.",
  },
  {
    id: 65,
    question: "What is the main appeal of small-cap stocks?",
    options: [
      { id: "a", text: "Low risk" },
      { id: "b", text: "High growth potential" },
      { id: "c", text: "Guaranteed dividends" },
      { id: "d", text: "Tax exemptions" },
    ],
    correctAnswer: "b",
    explanation:
      "Small-cap stocks, from smaller companies, offer significant growth opportunities but with higher risk.",
  },
  {
    id: 66,
    question: "What does 'asset class' refer to?",
    options: [
      { id: "a", text: "A single stock" },
      {
        id: "b",
        text: "A category of investments with similar characteristics",
      },
      { id: "c", text: "A tax bracket" },
      { id: "d", text: "A type of loan" },
    ],
    correctAnswer: "b",
    explanation:
      "Asset classes include stocks, bonds, and real estate, each with distinct risk and return profiles.",
  },
  {
    id: 67,
    question: "What is the primary risk of investing in emerging markets?",
    options: [
      { id: "a", text: "No risk" },
      { id: "b", text: "Political and economic instability" },
      { id: "c", text: "Guaranteed losses" },
      { id: "d", text: "Lack of diversification" },
    ],
    correctAnswer: "b",
    explanation:
      "Emerging markets offer growth but face risks like political upheaval and currency volatility.",
  },
  {
    id: 68,
    question: "What does 'book value' represent for a company?",
    options: [
      { id: "a", text: "The market price of its stock" },
      { id: "b", text: "The value of its assets minus liabilities" },
      { id: "c", text: "Its annual revenue" },
      { id: "d", text: "Its tax obligations" },
    ],
    correctAnswer: "b",
    explanation:
      "Book value is a company's net worth, calculated as total assets minus total liabilities.",
  },
  {
    id: 69,
    question: "What is a 'target-date fund' designed for?",
    options: [
      { id: "a", text: "Short-term trading" },
      { id: "b", text: "Retirement planning with an adjusting asset mix" },
      { id: "c", text: "High-risk speculation" },
      { id: "d", text: "Tax avoidance" },
    ],
    correctAnswer: "b",
    explanation:
      "Target-date funds shift from aggressive to conservative investments as the target retirement date nears.",
  },
  {
    id: 70,
    question: "What does 'wash sale' mean in investing?",
    options: [
      {
        id: "a",
        text: "Selling and rebuying a stock within 30 days, affecting tax losses",
      },
      { id: "b", text: "Cleaning investment records" },
      { id: "c", text: "Selling all stocks at once" },
      { id: "d", text: "A guaranteed profit strategy" },
    ],
    correctAnswer: "a",
    explanation:
      "A wash sale occurs when you sell a stock at a loss and repurchase it within 30 days, disallowing the tax loss.",
  },
  {
    id: 71,
    question: "What is the main benefit of a high-yield bond?",
    options: [
      { id: "a", text: "No risk" },
      { id: "b", text: "Higher interest payments" },
      { id: "c", text: "Guaranteed principal" },
      { id: "d", text: "Tax-free returns" },
    ],
    correctAnswer: "b",
    explanation:
      "High-yield bonds pay more interest but come with increased risk of default.",
  },
  {
    id: 72,
    question: "What does 'EPS' stand for in stock analysis?",
    options: [
      { id: "a", text: "Earnings Per Share" },
      { id: "b", text: "Equity Per Stock" },
      { id: "c", text: "Expense Per Sale" },
      { id: "d", text: "Estimated Profit System" },
    ],
    correctAnswer: "a",
    explanation:
      "Earnings Per Share (EPS) measures a company's profit divided by its outstanding shares.",
  },
  {
    id: 73,
    question: "What is a 'large-cap stock'?",
    options: [
      { id: "a", text: "A stock from a small company" },
      {
        id: "b",
        text: "A stock from a company with a large market capitalization",
      },
      { id: "c", text: "A stock with no growth" },
      { id: "d", text: "A stock with high volatility" },
    ],
    correctAnswer: "b",
    explanation:
      "Large-cap stocks are from companies with market caps typically over $10 billion, offering stability.",
  },
  {
    id: 74,
    question: "What is the purpose of a dividend reinvestment plan (DRIP)?",
    options: [
      { id: "a", text: "To pay taxes immediately" },
      { id: "b", text: "To automatically use dividends to buy more shares" },
      { id: "c", text: "To sell stocks" },
      { id: "d", text: "To reduce risk" },
    ],
    correctAnswer: "b",
    explanation:
      "A DRIP reinvests dividends into additional shares, compounding an investor's holdings over time.",
  },
  {
    id: 75,
    question: "What does 'margin call' mean in trading?",
    options: [
      { id: "a", text: "A request to diversify" },
      {
        id: "b",
        text: "A demand to add funds when a margin account falls below a threshold",
      },
      { id: "c", text: "A call to sell all investments" },
      { id: "d", text: "A guaranteed profit" },
    ],
    correctAnswer: "b",
    explanation:
      "A margin call requires an investor to deposit more money or sell assets if their borrowed account value drops too low.",
  },
  {
    id: 76,
    question: "What is the main purpose of a stock ticker symbol?",
    options: [
      { id: "a", text: "To indicate the company's profit" },
      { id: "b", text: "To uniquely identify a stock on an exchange" },
      { id: "c", text: "To set the stock's price" },
      { id: "d", text: "To track taxes" },
    ],
    correctAnswer: "b",
    explanation:
      "A ticker symbol is a short code used to identify a specific stock or security on a trading platform.",
  },
  {
    id: 77,
    question: "What does 'bid price' represent in stock trading?",
    options: [
      { id: "a", text: "The price a seller wants" },
      { id: "b", text: "The highest price a buyer is willing to pay" },
      { id: "c", text: "The average market price" },
      { id: "d", text: "The guaranteed sale price" },
    ],
    correctAnswer: "b",
    explanation:
      "The bid price is the maximum amount a buyer offers for a stock at a given moment.",
  },
  {
    id: 78,
    question: "What is an 'ask price' in the context of stocks?",
    options: [
      { id: "a", text: "The lowest price a seller will accept" },
      { id: "b", text: "The price a buyer sets" },
      { id: "c", text: "The tax on a stock" },
      { id: "d", text: "The price of a bond" },
    ],
    correctAnswer: "a",
    explanation:
      "The ask price is the minimum a seller is willing to accept for their stock.",
  },
  {
    id: 79,
    question: "What does 'spread' mean in trading?",
    options: [
      { id: "a", text: "The total profit earned" },
      { id: "b", text: "The difference between the bid and ask prices" },
      { id: "c", text: "The diversification of a portfolio" },
      { id: "d", text: "The tax rate" },
    ],
    correctAnswer: "b",
    explanation:
      "The spread is the gap between the bid and ask prices, reflecting the cost of trading.",
  },
  {
    id: 80,
    question: "What is the primary goal of a growth mutual fund?",
    options: [
      { id: "a", text: "To provide steady income" },
      { id: "b", text: "To achieve capital appreciation" },
      { id: "c", text: "To avoid all risk" },
      { id: "d", text: "To pay high dividends" },
    ],
    correctAnswer: "b",
    explanation:
      "Growth mutual funds focus on stocks with strong potential for price increases rather than income.",
  },
  {
    id: 81,
    question: "What does 'ex-dividend date' signify?",
    options: [
      { id: "a", text: "The date a stock doubles in value" },
      {
        id: "b",
        text: "The date after which new buyers won't receive the next dividend",
      },
      { id: "c", text: "The date a stock is sold" },
      { id: "d", text: "The date taxes are due" },
    ],
    correctAnswer: "b",
    explanation:
      "The ex-dividend date marks when a stock trades without its upcoming dividend, affecting eligibility.",
  },
  {
    id: 82,
    question: "What is a 'preferred stock'?",
    options: [
      { id: "a", text: "A stock with voting rights only" },
      {
        id: "b",
        text: "A stock with priority for dividends and assets over common stock",
      },
      { id: "c", text: "A stock with no dividends" },
      { id: "d", text: "A stock with guaranteed returns" },
    ],
    correctAnswer: "b",
    explanation:
      "Preferred stock offers higher claims on dividends and liquidation proceeds but often lacks voting rights.",
  },
  {
    id: 83,
    question: "What does 'ROE' stand for in financial analysis?",
    options: [
      { id: "a", text: "Return on Equity" },
      { id: "b", text: "Rate of Earnings" },
      { id: "c", text: "Risk of Exposure" },
      { id: "d", text: "Revenue Over Expenses" },
    ],
    correctAnswer: "a",
    explanation:
      "Return on Equity measures a company's profitability relative to shareholders' equity.",
  },
  {
    id: 84,
    question: "What is the main advantage of a passively managed fund?",
    options: [
      { id: "a", text: "High returns guaranteed" },
      { id: "b", text: "Lower fees due to minimal active management" },
      { id: "c", text: "Tax-free income" },
      { id: "d", text: "Daily trading" },
    ],
    correctAnswer: "b",
    explanation:
      "Passively managed funds, like index funds, track markets with less intervention, reducing costs.",
  },
  {
    id: 85,
    question: "What does 'day trading' involve?",
    options: [
      { id: "a", text: "Holding stocks for years" },
      {
        id: "b",
        text: "Buying and selling stocks within the same trading day",
      },
      { id: "c", text: "Investing only in bonds" },
      { id: "d", text: "Avoiding all stocks" },
    ],
    correctAnswer: "b",
    explanation:
      "Day trading seeks to profit from short-term price movements by closing all positions daily.",
  },
  {
    id: 86,
    question: "What is a 'blue-sky law'?",
    options: [
      { id: "a", text: "A law about weather and investing" },
      {
        id: "b",
        text: "A state law protecting investors from fraudulent securities",
      },
      { id: "c", text: "A federal tax regulation" },
      { id: "d", text: "A law banning stock trading" },
    ],
    correctAnswer: "b",
    explanation:
      "Blue-sky laws regulate securities offerings at the state level to prevent fraud.",
  },
  {
    id: 87,
    question: "What does 'capital loss' mean?",
    options: [
      { id: "a", text: "The profit from selling an asset" },
      {
        id: "b",
        text: "The loss from selling an asset below its purchase price",
      },
      { id: "c", text: "The tax paid on investments" },
      { id: "d", text: "The initial investment amount" },
    ],
    correctAnswer: "b",
    explanation:
      "A capital loss occurs when an asset is sold for less than its original cost.",
  },
  {
    id: 88,
    question: "What is the primary purpose of an income fund?",
    options: [
      { id: "a", text: "To focus on capital growth" },
      {
        id: "b",
        text: "To generate regular income through dividends or interest",
      },
      { id: "c", text: "To avoid all taxes" },
      { id: "d", text: "To speculate on prices" },
    ],
    correctAnswer: "b",
    explanation:
      "Income funds invest in assets like bonds or dividend stocks to provide steady income.",
  },
  {
    id: 89,
    question: "What does 'OTC' stand for in stock trading?",
    options: [
      { id: "a", text: "Over-The-Counter" },
      { id: "b", text: "On-Time Capital" },
      { id: "c", text: "Open Trading Commission" },
      { id: "d", text: "Optimal Tax Credit" },
    ],
    correctAnswer: "a",
    explanation:
      "Over-The-Counter trading occurs directly between parties, not on a formal exchange.",
  },
  {
    id: 90,
    question: "What is a 'pink sheet' stock?",
    options: [
      { id: "a", text: "A stock from a major exchange" },
      { id: "b", text: "A low-priced stock traded over-the-counter" },
      { id: "c", text: "A stock with guaranteed dividends" },
      { id: "d", text: "A government bond" },
    ],
    correctAnswer: "b",
    explanation:
      "Pink sheet stocks are typically small, OTC stocks with less regulatory oversight.",
  },
  {
    id: 91,
    question: "What does 'averaging down' mean in investing?",
    options: [
      { id: "a", text: "Selling a stock at a loss" },
      {
        id: "b",
        text: "Buying more shares of a declining stock to lower the average cost",
      },
      { id: "c", text: "Diversifying a portfolio" },
      { id: "d", text: "Guaranteeing profits" },
    ],
    correctAnswer: "b",
    explanation:
      "Averaging down reduces the average purchase price by buying additional shares as the price drops.",
  },
  {
    id: 92,
    question: "What is the main risk of a leveraged ETF?",
    options: [
      { id: "a", text: "No risk" },
      { id: "b", text: "Amplified losses in volatile markets" },
      { id: "c", text: "Lack of liquidity" },
      { id: "d", text: "Guaranteed returns" },
    ],
    correctAnswer: "b",
    explanation:
      "Leveraged ETFs use debt to magnify returns, but this also increases potential losses.",
  },
  {
    id: 93,
    question: "What does 'DCA' stand for in investment strategies?",
    options: [
      { id: "a", text: "Daily Capital Allocation" },
      { id: "b", text: "Dollar-Cost Averaging" },
      { id: "c", text: "Dividend Cash Adjustment" },
      { id: "d", text: "Debt Control Analysis" },
    ],
    correctAnswer: "b",
    explanation:
      "Dollar-Cost Averaging involves investing a fixed amount regularly to reduce timing risk.",
  },
  {
    id: 94,
    question: "What is a 'zero-coupon bond'?",
    options: [
      { id: "a", text: "A bond that pays no interest until maturity" },
      { id: "b", text: "A bond with daily interest payments" },
      { id: "c", text: "A bond with no risk" },
      { id: "d", text: "A bond tied to stocks" },
    ],
    correctAnswer: "a",
    explanation:
      "Zero-coupon bonds are sold at a discount and pay no periodic interest, only the face value at maturity.",
  },
  {
    id: 95,
    question: "What does 'holding period' refer to?",
    options: [
      { id: "a", text: "The time a stock is traded daily" },
      { id: "b", text: "The duration an investor owns an asset" },
      { id: "c", text: "The tax calculation period" },
      { id: "d", text: "The dividend payment cycle" },
    ],
    correctAnswer: "b",
    explanation:
      "The holding period is the length of time an investor keeps an investment before selling it.",
  },
  {
    id: 96,
    question: "What is the primary benefit of a corporate bond?",
    options: [
      { id: "a", text: "Ownership in the company" },
      { id: "b", text: "Regular interest payments" },
      { id: "c", text: "No risk" },
      { id: "d", text: "Tax-free income" },
    ],
    correctAnswer: "b",
    explanation:
      "Corporate bonds provide periodic interest payments, offering income to investors.",
  },
  {
    id: 97,
    question: "What does 'SEC' stand for in the U.S. investment context?",
    options: [
      { id: "a", text: "Stock Exchange Commission" },
      { id: "b", text: "Securities and Exchange Commission" },
      { id: "c", text: "Savings Enhancement Corporation" },
      { id: "d", text: "Standard Equity Control" },
    ],
    correctAnswer: "b",
    explanation:
      "The Securities and Exchange Commission regulates securities markets to protect investors.",
  },
  {
    id: 98,
    question: "What is a 'mid-cap stock'?",
    options: [
      {
        id: "a",
        text: "A stock from a company with a medium market capitalization",
      },
      { id: "b", text: "A stock with no growth potential" },
      { id: "c", text: "A stock from a tiny company" },
      { id: "d", text: "A stock with guaranteed dividends" },
    ],
    correctAnswer: "a",
    explanation:
      "Mid-cap stocks, typically $2–$10 billion in market cap, balance growth and stability.",
  },
  {
    id: 99,
    question: "What does 'portfolio turnover' measure?",
    options: [
      { id: "a", text: "The total profit of a portfolio" },
      { id: "b", text: "How often assets in a portfolio are bought and sold" },
      { id: "c", text: "The tax rate on investments" },
      { id: "d", text: "The initial investment amount" },
    ],
    correctAnswer: "b",
    explanation:
      "Portfolio turnover reflects trading frequency, impacting costs and tax implications.",
  },
  {
    id: 100,
    question: "What is the main goal of value investing?",
    options: [
      { id: "a", text: "To buy stocks at the highest price" },
      { id: "b", text: "To buy undervalued stocks with strong fundamentals" },
      { id: "c", text: "To trade daily for quick profits" },
      { id: "d", text: "To avoid all stocks" },
    ],
    correctAnswer: "b",
    explanation:
      "Value investing seeks stocks trading below their intrinsic value for long-term gains.",
  },
];

export default function investmentquiz() {
  const { userData, refreshUserData } = useAuth();
  const [quizState, setQuizState] = useState("start"); // start, playing, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    const randomQuestions = getRandomQuestions(questions, 10);
    setRandomQuestions(randomQuestions);
    setQuizState("playing");
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setTimeLeft(300);
    setTimerActive(true);
  };

  const handleAnswerSelect = (questionId, answerId) => {
    if (selectedAnswers[questionId]) return; // Prevent changing answer

    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });

    setShowExplanation(true);

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < randomQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowExplanation(false);
      } else {
        setQuizState("result");
        setTimerActive(false);
        handleQuizEnd();
      }
    }, 2000);
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    Object.keys(selectedAnswers).forEach((questionId) => {
      const question = randomQuestions.find((q) => q.id === Number.parseInt(questionId));
      if (question && selectedAnswers[questionId] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Effect for timer
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setQuizState("result");
      setTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Function to get random questions
  const getRandomQuestions = (questions, count) => {
    const randomQuestions = [];
    const questionsCopy = [...questions];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * questionsCopy.length);
      randomQuestions.push(questionsCopy[randomIndex]);
      questionsCopy.splice(randomIndex, 1);
    }

    return randomQuestions;
  };

  // Handle Quiz End
  const handleQuizEnd = async () => {
    if (!userData || isSubmitting) return;

    const score = calculateScore();
    const xpEarned = Math.round((score / randomQuestions.length) * 30);
    const coinsEarned = Math.round((score / randomQuestions.length) * 20);

    try {
      setIsSubmitting(true);
      const result = await saveActivityProgress(
        userData.id,
        "quiz",
        "Investment Basics",
        score,
        xpEarned,
        coinsEarned
      );

      if (result.success) {
        await refreshUserData();
        toast({
          title: "Quiz Complete!",
          description: `You earned ${xpEarned} XP and ${coinsEarned} Coins!`,
          className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white",
        });
      } else {
        throw new Error("Failed to save progress");
      }
    } catch (error) {
      console.error("Error saving quiz progress:", error);
      toast({
        title: "Error",
        description: "Failed to save progress.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/quizzes">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">
              Investment Basics Quiz
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              Beginner
            </Badge>
          </div>
        </div>

        {quizState === "start" && (
          <Card>
            <CardHeader>
              <CardTitle>Investment Basics Quiz</CardTitle>
              <CardDescription>
                Test your knowledge about Investment principles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Quiz Instructions</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      You have 5 minutes to complete 10 multiple-choice
                      questions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <span>Each question has one correct answer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <span>You'll see an explanation after each answer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      You can earn up to 20 coins and 30 XP for a perfect score
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Topics Covered</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This quiz covers types of investments, risk vs. return,
                  diversification, and basic investment strategies.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStart} className="w-full">
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        )}

        {quizState === "playing" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Question {currentQuestion + 1} of {randomQuestions.length}
                  </CardTitle>
                  <CardDescription>Investment Basics</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={timeLeft < 60 ? "text-red-500" : ""}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {Math.round((currentQuestion / randomQuestions.length) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(currentQuestion / randomQuestions.length) * 100}
                  className="h-2"
                />
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">
                  {randomQuestions[currentQuestion].question}
                </p>
              </div>

              <div className="space-y-3">
                {randomQuestions[currentQuestion].options.map((option) => {
                  const isSelected =
                    selectedAnswers[randomQuestions[currentQuestion].id] ===
                    option.id;
                  const isCorrect =
                    option.id === randomQuestions[currentQuestion].correctAnswer;

                  return (
                    <button
                      key={option.id}
                      className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted ${isSelected
                        ? isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : ""
                        }`}
                      onClick={() =>
                        handleAnswerSelect(
                          randomQuestions[currentQuestion].id,
                          option.id
                        )
                      }
                      disabled={
                        selectedAnswers[randomQuestions[currentQuestion].id] !==
                        undefined
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.text}</span>
                        {isSelected &&
                          (isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div
                  className={`rounded-md p-3 ${selectedAnswers[randomQuestions[currentQuestion].id] ===
                    randomQuestions[currentQuestion].correctAnswer
                    ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                >
                  <div className="flex items-start gap-2">
                    {selectedAnswers[randomQuestions[currentQuestion].id] ===
                      randomQuestions[currentQuestion].correctAnswer ? (
                      <CheckCircle className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {selectedAnswers[randomQuestions[currentQuestion].id] ===
                          randomQuestions[currentQuestion].correctAnswer
                          ? "Correct!"
                          : "Incorrect"}
                      </p>
                      <p className="text-sm">
                        {randomQuestions[currentQuestion].explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {quizState === "result" && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Complete!</CardTitle>
              <CardDescription>
                You've completed the Investment Basics Quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">
                    Your Score: {calculateScore()}/{randomQuestions.length}
                  </h3>
                  <p className="text-muted-foreground">
                    {calculateScore() >= 8
                      ? "Excellent! You have a strong understanding of budgeting principles."
                      : calculateScore() >= 6
                        ? "Good job! You understand the basics of budgeting."
                        : "You're on your way to understanding budgeting principles."}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    You've earned{" "}
                    {Math.round((calculateScore() / randomQuestions.length) * 20)}{" "}
                    Coins and{" "}
                    {Math.round((calculateScore() / randomQuestions.length) * 30)} XP!
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Question Summary</h3>
                <div className="mt-4 space-y-3">
                  {randomQuestions.map((question, index) => {
                    const userAnswer = selectedAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;

                    return (
                      <div
                        key={question.id}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${isCorrect
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm">
                          Question {index + 1}:{" "}
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Key Takeaways</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      Investments grow your wealth over time but come with
                      varying levels of risk.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      Diversification helps reduce risk by spreading investments
                      across assets.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      Stocks, bonds, and mutual funds are common investment
                      options.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      Long-term investing is generally more stable and
                      profitable than short-term speculation.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleStart}>
                Retake Quiz
              </Button>
              <Link href="/dashboard/quizzes">
                <Button>Back to Quizzes</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
