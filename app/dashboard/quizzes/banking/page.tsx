"use client";

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {   Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {   ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  AlertTriangle, } from "lucide-react"

// Quiz questions
const questions = [
  {
    id: 1,
    question: "What is the primary function of a commercial bank?",
    options: [
      { id: "a", text: "To print money" },
      { id: "b", text: "To accept deposits and provide loans" },
      { id: "c", text: "To regulate stock markets" },
      { id: "d", text: "To manage government budgets" },
    ],
    correctAnswer: "b",
    explanation: "Commercial banks primarily serve individuals and businesses by accepting deposits and offering loans."
  },
  {
    id: 2,
    question: "What does FDIC stand for in the U.S. banking system?",
    options: [
      { id: "a", text: "Federal Deposit Insurance Corporation" },
      { id: "b", text: "Financial Development Investment Council" },
      { id: "c", text: "Federal Debt Insurance Company" },
      { id: "d", text: "Funded Deposit Interest Corporation" },
    ],
    correctAnswer: "a",
    explanation: "The FDIC insures deposits in banks and thrift institutions up to a certain amount to protect customers."
  },
  {
    id: 3,
    question: "What is the purpose of a central bank?",
    options: [
      { id: "a", text: "To provide personal loans" },
      { id: "b", text: "To control the money supply and monetary policy" },
      { id: "c", text: "To manage individual savings accounts" },
      { id: "d", text: "To issue credit cards" },
    ],
    correctAnswer: "b",
    explanation: "Central banks, like the Federal Reserve, regulate a nation’s money supply and economic stability."
  },
  {
    id: 4,
    question: "What is a 'checking account' used for?",
    options: [
      { id: "a", text: "Long-term savings" },
      { id: "b", text: "Daily transactions and bill payments" },
      { id: "c", text: "High-interest investments" },
      { id: "d", text: "Retirement planning" },
    ],
    correctAnswer: "b",
    explanation: "Checking accounts provide easy access to funds for everyday spending and payments."
  },
  {
    id: 5,
    question: "What does the term 'interest rate' refer to?",
    options: [
      { id: "a", text: "The cost of borrowing or return on savings" },
      { id: "b", text: "The tax rate on bank profits" },
      { id: "c", text: "The fee for opening an account" },
      { id: "d", text: "The value of bank stocks" },
    ],
    correctAnswer: "a",
    explanation: "Interest rates represent the cost of borrowing money or the reward for saving it."
  },
  {
    id: 6,
    question: "What is the main goal of monetary policy?",
    options: [
      { id: "a", text: "To increase bank profits" },
      { id: "b", text: "To stabilize the economy by controlling money supply" },
      { id: "c", text: "To regulate stock prices" },
      { id: "d", text: "To eliminate all taxes" },
    ],
    correctAnswer: "b",
    explanation: "Monetary policy aims to manage inflation, employment, and growth through money supply adjustments."
  },
  {
    id: 7,
    question: "What is a 'savings account' designed for?",
    options: [
      { id: "a", text: "Daily spending" },
      { id: "b", text: "Short- to medium-term savings with interest" },
      { id: "c", text: "High-risk investments" },
      { id: "d", text: "Immediate withdrawals" },
    ],
    correctAnswer: "b",
    explanation: "Savings accounts encourage saving by offering interest with limited access to funds."
  },
  {
    id: 8,
    question: "What does 'APR' stand for in banking?",
    options: [
      { id: "a", text: "Annual Percentage Rate" },
      { id: "b", text: "Average Profit Ratio" },
      { id: "c", text: "Adjusted Payment Return" },
      { id: "d", text: "Annual Policy Review" },
    ],
    correctAnswer: "a",
    explanation: "APR represents the yearly cost of borrowing, including interest and fees."
  },
  {
    id: 9,
    question: "What is the purpose of a credit score?",
    options: [
      { id: "a", text: "To track bank profits" },
      { id: "b", text: "To assess a borrower’s creditworthiness" },
      { id: "c", text: "To determine tax rates" },
      { id: "d", text: "To set investment returns" },
    ],
    correctAnswer: "b",
    explanation: "A credit score helps lenders evaluate the risk of lending based on past credit behavior."
  },
  {
    id: 10,
    question: "What is 'compound interest'?",
    options: [
      { id: "a", text: "Interest paid only on the initial deposit" },
      { id: "b", text: "Interest earned on the principal and accumulated interest" },
      { id: "c", text: "A flat fee for loans" },
      { id: "d", text: "A tax on savings" },
    ],
    correctAnswer: "b",
    explanation: "Compound interest grows savings or debt by adding interest to both the principal and prior interest."
  },
  {
    id: 11,
    question: "What does 'liquidity' mean in banking?",
    options: [
      { id: "a", text: "The ability to quickly access cash or assets" },
      { id: "b", text: "The total profit of a bank" },
      { id: "c", text: "The tax rate on loans" },
      { id: "d", text: "The number of bank branches" },
    ],
    correctAnswer: "a",
    explanation: "Liquidity refers to how easily assets can be converted to cash without significant loss."
  },
  {
    id: 12,
    question: "What is the role of the Federal Reserve in the U.S.?",
    options: [
      { id: "a", text: "To issue credit cards" },
      { id: "b", text: "To act as the central bank and set monetary policy" },
      { id: "c", text: "To manage individual bank accounts" },
      { id: "d", text: "To regulate stock exchanges" },
    ],
    correctAnswer: "b",
    explanation: "The Federal Reserve oversees monetary policy, bank supervision, and financial stability in the U.S."
  },
  {
    id: 13,
    question: "What is a 'certificate of deposit' (CD)?",
    options: [
      { id: "a", text: "A type of checking account" },
      { id: "b", text: "A fixed-term deposit with a set interest rate" },
      { id: "c", text: "A credit card" },
      { id: "d", text: "A loan agreement" },
    ],
    correctAnswer: "b",
    explanation: "A CD locks funds for a specific period in exchange for a higher, fixed interest rate."
  },
  {
    id: 14,
    question: "What does 'overdraft' mean?",
    options: [
      { id: "a", text: "Excess savings in an account" },
      { id: "b", text: "Spending more than the available balance in an account" },
      { id: "c", text: "A type of loan" },
      { id: "d", text: "A high-interest savings plan" },
    ],
    correctAnswer: "b",
    explanation: "An overdraft occurs when withdrawals exceed the account balance, often incurring fees."
  },
  {
    id: 15,
    question: "What is the purpose of a bank reserve requirement?",
    options: [
      { id: "a", text: "To limit customer withdrawals" },
      { id: "b", text: "To ensure banks have enough cash for withdrawals" },
      { id: "c", text: "To increase bank profits" },
      { id: "d", text: "To set tax rates" },
    ],
    correctAnswer: "b",
    explanation: "Reserve requirements mandate banks to hold a portion of deposits in cash for liquidity."
  },
  {
    id: 16,
    question: "What is a 'money market account'?",
    options: [
      { id: "a", text: "A high-risk investment account" },
      { id: "b", text: "A savings account with higher interest and limited withdrawals" },
      { id: "c", text: "A checking account with no interest" },
      { id: "d", text: "A loan account" },
    ],
    correctAnswer: "b",
    explanation: "Money market accounts offer higher interest than regular savings with some restrictions."
  },
  {
    id: 17,
    question: "What does 'KYC' stand for in banking?",
    options: [
      { id: "a", text: "Know Your Customer" },
      { id: "b", text: "Keep Your Cash" },
      { id: "c", text: "Key Yield Control" },
      { id: "d", text: "Know Your Credit" },
    ],
    correctAnswer: "a",
    explanation: "KYC policies require banks to verify customer identities to prevent fraud and money laundering."
  },
  {
    id: 18,
    question: "What is the main purpose of a debit card?",
    options: [
      { id: "a", text: "To borrow money" },
      { id: "b", text: "To spend money directly from a bank account" },
      { id: "c", text: "To invest in stocks" },
      { id: "d", text: "To earn interest" },
    ],
    correctAnswer: "b",
    explanation: "Debit cards allow users to access and spend funds directly from their bank accounts."
  },
  {
    id: 19,
    question: "What is 'fiscal policy'?",
    options: [
      { id: "a", text: "Bank rules for lending" },
      { id: "b", text: "Government spending and taxation to influence the economy" },
      { id: "c", text: "Central bank interest rate adjustments" },
      { id: "d", text: "A type of bank account" },
    ],
    correctAnswer: "b",
    explanation: "Fiscal policy uses government revenue and expenditure to manage economic growth and stability."
  },
  {
    id: 20,
    question: "What does 'ATM' stand for?",
    options: [
      { id: "a", text: "Automated Teller Machine" },
      { id: "b", text: "Annual Transaction Monitor" },
      { id: "c", text: "Advanced Tax Machine" },
      { id: "d", text: "Account Transfer Method" },
    ],
    correctAnswer: "a",
    explanation: "An ATM allows customers to perform banking transactions like withdrawals and deposits."
  },
  {
    id: 21,
    question: "What is a 'fixed-rate loan'?",
    options: [
      { id: "a", text: "A loan with a variable interest rate" },
      { id: "b", text: "A loan with a constant interest rate throughout its term" },
      { id: "c", text: "A loan with no interest" },
      { id: "d", text: "A loan for investments only" },
    ],
    correctAnswer: "b",
    explanation: "Fixed-rate loans maintain the same interest rate, providing predictable payments."
  },
  {
    id: 22,
    question: "What is the purpose of the Basel Accords?",
    options: [
      { id: "a", text: "To set international banking regulations" },
      { id: "b", text: "To issue credit cards globally" },
      { id: "c", text: "To manage individual savings" },
      { id: "d", text: "To eliminate all bank fees" },
    ],
    correctAnswer: "a",
    explanation: "The Basel Accords establish global standards for bank capital, risk, and liquidity."
  },
  {
    id: 23,
    question: "What does 'ACH' stand for in banking?",
    options: [
      { id: "a", text: "Automated Clearing House" },
      { id: "b", text: "Annual Credit History" },
      { id: "c", text: "Adjusted Cash Holdings" },
      { id: "d", text: "Account Control Hub" },
    ],
    correctAnswer: "a",
    explanation: "ACH facilitates electronic payments and transfers between bank accounts."
  },
  {
    id: 24,
    question: "What is a 'variable-rate loan'?",
    options: [
      { id: "a", text: "A loan with a fixed interest rate" },
      { id: "b", text: "A loan with an interest rate that can change" },
      { id: "c", text: "A loan with no repayment" },
      { id: "d", text: "A loan for savings only" },
    ],
    correctAnswer: "b",
    explanation: "Variable-rate loans have interest rates that fluctuate with market conditions."
  },
  {
    id: 25,
    question: "What is the purpose of a bank stress test?",
    options: [
      { id: "a", text: "To evaluate a bank’s ability to withstand economic downturns" },
      { id: "b", text: "To increase customer deposits" },
      { id: "c", text: "To set new interest rates" },
      { id: "d", text: "To issue more loans" },
    ],
    correctAnswer: "a",
    explanation: "Stress tests assess a bank’s resilience against financial crises or adverse conditions."
  },
  {
    id: 26,
    question: "What does 'collateral' mean in banking?",
    options: [
      { id: "a", text: "A bank fee" },
      { id: "b", text: "An asset pledged to secure a loan" },
      { id: "c", text: "A type of savings account" },
      { id: "d", text: "A tax deduction" },
    ],
    correctAnswer: "b",
    explanation: "Collateral reduces lender risk by providing an asset that can be seized if the loan isn’t repaid."
  },
  {
    id: 27,
    question: "What is the main role of a credit union?",
    options: [
      { id: "a", text: "To profit from stock trading" },
      { id: "b", text: "To provide banking services to members, often with lower fees" },
      { id: "c", text: "To regulate banks" },
      { id: "d", text: "To issue government bonds" },
    ],
    correctAnswer: "b",
    explanation: "Credit unions are member-owned, not-for-profit institutions offering competitive banking services."
  },
  {
    id: 28,
    question: "What does 'LIBOR' stand for?",
    options: [
      { id: "a", text: "London Interbank Offered Rate" },
      { id: "b", text: "Local Investment Banking Organization Rate" },
      { id: "c", text: "Loan Interest Basis Over Rate" },
      { id: "d", text: "Limited Income Banking Option Rate" },
    ],
    correctAnswer: "a",
    explanation: "LIBOR is a benchmark interest rate for loans between banks, influencing global lending rates."
  },
  {
    id: 29,
    question: "What is a 'prime rate'?",
    options: [
      { id: "a", text: "The highest interest rate offered" },
      { id: "b", text: "The rate banks charge their most creditworthy customers" },
      { id: "c", text: "A fixed savings rate" },
      { id: "d", text: "A tax rate" },
    ],
    correctAnswer: "b",
    explanation: "The prime rate is a base rate for loans offered to top-tier borrowers, influencing other rates."
  },
  {
    id: 30,
    question: "What is the purpose of an escrow account?",
    options: [
      { id: "a", text: "To hold funds for taxes and insurance, often in mortgages" },
      { id: "b", text: "To invest in stocks" },
      { id: "c", text: "To pay daily expenses" },
      { id: "d", text: "To earn high interest" },
    ],
    correctAnswer: "a",
    explanation: "Escrow accounts manage funds for specific purposes, like property taxes, until needed."
  },
  {
    id: 31,
    question: "What does 'AML' stand for in banking regulations?",
    options: [
      { id: "a", text: "Annual Mortgage Limit" },
      { id: "b", text: "Anti-Money Laundering" },
      { id: "c", text: "Adjusted Market Loan" },
      { id: "d", text: "Asset Management Level" },
    ],
    correctAnswer: "b",
    explanation: "AML policies aim to prevent illegal money laundering through banking systems."
  },
  {
    id: 32,
    question: "What is a 'wire transfer'?",
    options: [
      { id: "a", text: "A physical cash delivery" },
      { id: "b", text: "An electronic transfer of funds between banks" },
      { id: "c", text: "A type of loan" },
      { id: "d", text: "A savings plan" },
    ],
    correctAnswer: "b",
    explanation: "Wire transfers move money quickly and securely between accounts, often internationally."
  },
  {
    id: 33,
    question: "What is the purpose of the Dodd-Frank Act?",
    options: [
      { id: "a", text: "To increase bank profits" },
      { id: "b", text: "To reform financial regulation and protect consumers" },
      { id: "c", text: "To eliminate all banking fees" },
      { id: "d", text: "To issue more credit cards" },
    ],
    correctAnswer: "b",
    explanation: "The Dodd-Frank Act was enacted post-2008 crisis to enhance financial stability and consumer protection."
  },
  {
    id: 34,
    question: "What does ' SWIFT' stand for in international banking?",
    options: [
      { id: "a", text: "Society for Worldwide Interbank Financial Telecommunication" },
      { id: "b", text: "Standard Western International Funds Transfer" },
      { id: "c", text: "Secure Withdrawal Interest Funding Team" },
      { id: "d", text: "Systematic Wealth Investment Finance Tool" },
    ],
    correctAnswer: "a",
    explanation: "SWIFT provides a network for secure, standardized international financial transactions."
  },
  {
    id: 35,
    question: "What is a 'mortgage'?",
    options: [
      { id: "a", text: "A savings account" },
      { id: "b", text: "A loan secured by real estate" },
      { id: "c", text: "A type of credit card" },
      { id: "d", text: "A tax refund" },
    ],
    correctAnswer: "b",
    explanation: "A mortgage is a loan to purchase property, with the property as collateral."
  },
  {
    id: 36,
    question: "What is the main purpose of a bank’s capital adequacy ratio?",
    options: [
      { id: "a", text: "To measure customer deposits" },
      { id: "b", text: "To ensure the bank can absorb losses and remain solvent" },
      { id: "c", text: "To set interest rates" },
      { id: "d", text: "To increase loan availability" },
    ],
    correctAnswer: "b",
    explanation: "The capital adequacy ratio assesses a bank’s financial strength to handle potential losses."
  },
  {
    id: 37,
    question: "What does 'APR' differ from 'APY' in banking?",
    options: [
      { id: "a", text: "APR includes compounding, APY does not" },
      { id: "b", text: "APY includes compounding, APR does not" },
      { id: "c", text: "They are the same" },
      { id: "d", text: "APR is for savings, APY is for loans" },
    ],
    correctAnswer: "b",
    explanation: "Annual Percentage Yield (APY) accounts for compound interest, while APR does not."
  },
  {
    id: 38,
    question: "What is a 'non-sufficient funds' (NSF) fee?",
    options: [
      { id: "a", text: "A fee for having too much money" },
      { id: "b", text: "A fee charged when an account lacks funds for a transaction" },
      { id: "c", text: "A loan origination fee" },
      { id: "d", text: "A savings bonus" },
    ],
    correctAnswer: "b",
    explanation: "An NSF fee is applied when a payment fails due to insufficient account balance."
  },
  {
    id: 39,
    question: "What is the purpose of the Glass-Steagall Act?",
    options: [
      { id: "a", text: "To separate commercial and investment banking" },
      { id: "b", text: "To increase bank mergers" },
      { id: "c", text: "To eliminate interest rates" },
      { id: "d", text: "To issue more loans" },
    ],
    correctAnswer: "a",
    explanation: "The Glass-Steagall Act aimed to reduce risk by separating banking and securities activities."
  },
  {
    id: 40,
    question: "What does 'EFT' stand for?",
    options: [
      { id: "a", text: "Electronic Funds Transfer" },
      { id: "b", text: "Efficient Financial Transaction" },
      { id: "c", text: "Emergency Fund Tax" },
      { id: "d", text: "Equity Funding Tool" },
    ],
    correctAnswer: "a",
    explanation: "EFT refers to the electronic movement of money between accounts."
  },
  {
    id: 41,
    question: "What is a 'line of credit'?",
    options: [
      { id: "a", text: "A fixed loan amount" },
      { id: "b", text: "A flexible borrowing limit you can draw from as needed" },
      { id: "c", text: "A savings account" },
      { id: "d", text: "A type of bond" },
    ],
    correctAnswer: "b",
    explanation: "A line of credit allows borrowing up to a set limit, with interest only on the amount used."
  },
  {
    id: 42,
    question: "What is the main goal of quantitative easing?",
    options: [
      { id: "a", text: "To reduce bank profits" },
      { id: "b", text: "To stimulate the economy by increasing money supply" },
      { id: "c", text: "To raise taxes" },
      { id: "d", text: "To limit loans" },
    ],
    correctAnswer: "b",
    explanation: "Quantitative easing involves central banks buying assets to inject money into the economy."
  },
  {
    id: 43,
    question: "What does 'CD laddering' mean?",
    options: [
      { id: "a", text: "Stacking certificates of deposit with different maturities" },
      { id: "b", text: "Reducing interest rates" },
      { id: "c", text: "Combining all CDs into one" },
      { id: "d", text: "Avoiding CDs" },
    ],
    correctAnswer: "a",
    explanation: "CD laddering spreads investments across various terms for liquidity and interest rate benefits."
  },
  {
    id: 44,
    question: "What is a 'bank run'?",
    options: [
      { id: "a", text: "A race organized by banks" },
      { id: "b", text: "A mass withdrawal of deposits due to panic" },
      { id: "c", text: "A new banking policy" },
      { id: "d", text: "A loan approval process" },
    ],
    correctAnswer: "b",
    explanation: "A bank run occurs when many customers withdraw funds simultaneously, fearing insolvency."
  },
  {
    id: 45,
    question: "What does 'IBAN' stand for?",
    options: [
      { id: "a", text: "International Bank Account Number" },
      { id: "b", text: "Interest-Based Annual Note" },
      { id: "c", text: "Investment Banking Adjustment Number" },
      { id: "d", text: "Internal Balance Account Note" },
    ],
    correctAnswer: "a",
    explanation: "IBAN is a standardized format for identifying bank accounts internationally."
  },
  {
    id: 46,
    question: "What is the purpose of a bank holding company?",
    options: [
      { id: "a", text: "To own and control one or more banks" },
      { id: "b", text: "To issue personal loans" },
      { id: "c", text: "To regulate interest rates" },
      { id: "d", text: "To manage tax refunds" },
    ],
    correctAnswer: "a",
    explanation: "A bank holding company oversees subsidiary banks, often diversifying financial services."
  },
  {
    id: 47,
    question: "What does 'tier 1 capital' refer to in banking?",
    options: [
      { id: "a", text: "Customer deposits" },
      { id: "b", text: "A bank’s core capital, like equity and reserves" },
      { id: "c", text: "Short-term loans" },
      { id: "d", text: "Government bonds" },
    ],
    correctAnswer: "b",
    explanation: "Tier 1 capital is a bank’s primary funding source to absorb losses without ceasing operations."
  },
  {
    id: 48,
    question: "What is a 'payday loan'?",
    options: [
      { id: "a", text: "A long-term mortgage" },
      { id: "b", text: "A short-term, high-interest loan until the next paycheck" },
      { id: "c", text: "A savings plan" },
      { id: "d", text: "A tax refund" },
    ],
    correctAnswer: "b",
    explanation: "Payday loans provide quick cash with high interest, repayable by the borrower’s next payday."
  },
  {
    id: 49,
    question: "What is the purpose of the Truth in Lending Act?",
    options: [
      { id: "a", text: "To regulate bank mergers" },
      { id: "b", text: "To ensure transparency in loan terms and costs" },
      { id: "c", text: "To eliminate interest rates" },
      { id: "d", text: "To issue more credit cards" },
    ],
    correctAnswer: "b",
    explanation: "The Truth in Lending Act requires lenders to disclose credit terms clearly to protect consumers."
  },
  {
    id: 50,
    question: "What does 'repo rate' mean?",
    options: [
      { id: "a", text: "The rate at which banks lend to customers" },
      { id: "b", text: "The rate at which central banks lend to commercial banks" },
      { id: "c", text: "The savings account interest rate" },
      { id: "d", text: "The tax rate on loans" },
    ],
    correctAnswer: "b",
    explanation: "The repo rate is the interest rate for short-term loans from a central bank to commercial banks."
  },
  {
    id: 51,
    question: "What is a 'traveler’s check'?",
    options: [
      { id: "a", text: "A prepaid payment method for travel" },
      { id: "b", text: "A type of loan" },
      { id: "c", text: "A savings account" },
      { id: "d", text: "A credit card" },
    ],
    correctAnswer: "a",
    explanation: "Traveler’s checks are secure, prepaid instruments replaceable if lost, used for travel."
  },
  {
    id: 52,
    question: "What does 'redlining' refer to in banking?",
    options: [
      { id: "a", text: "Approving all loans" },
      { id: "b", text: "Denying services to certain areas based on demographics" },
      { id: "c", text: "Reducing interest rates" },
      { id: "d", text: "Increasing bank branches" },
    ],
    correctAnswer: "b",
    explanation: "Redlining is an illegal practice of refusing loans or services to specific neighborhoods."
  },
  {
    id: 53,
    question: "What is the purpose of a bank’s loan-to-deposit ratio?",
    options: [
      { id: "a", text: "To measure how much it lends compared to deposits" },
      { id: "b", text: "To set tax rates" },
      { id: "c", text: "To increase savings" },
      { id: "d", text: "To reduce customer fees" },
    ],
    correctAnswer: "a",
    explanation: "The loan-to-deposit ratio shows the proportion of deposits a bank lends out."
  },
  {
    id: 54,
    question: "What does 'FSLIC' stand for?",
    options: [
      { id: "a", text: "Federal Savings and Loan Insurance Corporation" },
      { id: "b", text: "Financial Security Lending Investment Company" },
      { id: "c", text: "Funded Savings Loan Interest Corporation" },
      { id: "d", text: "Federal Stock Liquidity Insurance Council" },
    ],
    correctAnswer: "a",
    explanation: "FSLIC insured deposits in savings and loan associations until it was replaced by the FDIC."
  },
  {
    id: 55,
    question: "What is a 'lockbox service' in banking?",
    options: [
      { id: "a", text: "A secure deposit box" },
      { id: "b", text: "A service to collect and process payments for businesses" },
      { id: "c", text: "A type of loan" },
      { id: "d", text: "A savings account" },
    ],
    correctAnswer: "b",
    explanation: "Lockbox services help businesses by receiving and depositing payments directly."
  },
  {
    id: 56,
    question: "What does 'CRR' stand for in banking policy?",
    options: [
      { id: "a", text: "Cash Reserve Ratio" },
      { id: "b", text: "Credit Risk Reduction" },
      { id: "c", text: "Customer Retention Rate" },
      { id: "d", text: "Capital Recovery Ratio" },
    ],
    correctAnswer: "a",
    explanation: "The Cash Reserve Ratio is the percentage of deposits banks must keep with the central bank."
  },
  {
    id: 57,
    question: "What is a 'balloon payment'?",
    options: [
      { id: "a", text: "A small initial loan payment" },
      { id: "b", text: "A large final payment on a loan" },
      { id: "c", text: "A savings bonus" },
      { id: "d", text: "A tax refund" },
    ],
    correctAnswer: "b",
    explanation: "A balloon payment is a lump sum due at the end of a loan term after smaller payments."
  },
  {
    id: 58,
    question: "What does 'NOW account' stand for?",
    options: [
      { id: "a", text: "Negotiable Order of Withdrawal account" },
      { id: "b", text: "New Opportunity Wealth account" },
      { id: "c", text: "Net Operating Withdrawal account" },
      { id: "d", text: "National Ownership Wealth account" },
    ],
    correctAnswer: "a",
    explanation: "A NOW account is an interest-bearing account allowing withdrawals via negotiable orders."
  },
  {
    id: 59,
    question: "What is the purpose of the Community Reinvestment Act?",
    options: [
      { id: "a", text: "To encourage banks to serve low-income communities" },
      { id: "b", text: "To reduce bank branches" },
      { id: "c", text: "To increase loan interest rates" },
      { id: "d", text: "To eliminate savings accounts" },
    ],
    correctAnswer: "a",
    explanation: "The CRA promotes banking services in underserved areas to reduce discrimination."
  },
  {
    id: 60,
    question: "What does 'SOFR' stand for?",
    options: [
      { id: "a", text: "Secured Overnight Financing Rate" },
      { id: "b", text: "Standard Operational Funding Rate" },
      { id: "c", text: "Savings Offset Financing Rate" },
      { id: "d", text: "Simple Overnight Fixed Rate" },
    ],
    correctAnswer: "a",
    explanation: "SOFR is a benchmark interest rate replacing LIBOR, based on secured overnight loans."
  },
  {
    id: 61,
    question: "What is a 'custodial account'?",
    options: [
      { id: "a", text: "An account managed for a minor by an adult" },
      { id: "b", text: "A high-interest loan" },
      { id: "c", text: "A corporate savings account" },
      { id: "d", text: "A tax-free investment" },
    ],
    correctAnswer: "a",
    explanation: "Custodial accounts hold assets for minors until they reach a certain age."
  },
  {
    id: 62,
    question: "What does 'leverage ratio' measure in banking?",
    options: [
      { id: "a", text: "The ratio of loans to deposits" },
      { id: "b", text: "The ratio of a bank’s capital to its total assets" },
      { id: "c", text: "The interest rate on savings" },
      { id: "d", text: "The tax rate on profits" },
    ],
    correctAnswer: "b",
    explanation: "The leverage ratio evaluates a bank’s financial stability by comparing capital to assets."
  },
  {
    id: 63,
    question: "What is a 'prepayment penalty'?",
    options: [
      { id: "a", text: "A bonus for early loan repayment" },
      { id: "b", text: "A fee for paying off a loan early" },
      { id: "c", text: "A tax deduction" },
      { id: "d", text: "A savings reward" },
    ],
    correctAnswer: "b",
    explanation: "A prepayment penalty compensates lenders for lost interest when a loan is paid off early."
  },
  {
    id: 64,
    question: "What does 'TARP' stand for?",
    options: [
      { id: "a", text: "Troubled Assets Relief Program" },
      { id: "b", text: "Tax Adjustment Recovery Plan" },
      { id: "c", text: "Total Asset Reduction Policy" },
      { id: "d", text: "Temporary Account Relief Program" },
    ],
    correctAnswer: "a",
    explanation: "TARP was a U.S. program to bail out banks during the 2008 financial crisis."
  },
  {
    id: 65,
    question: "What is a 'demand deposit'?",
    options: [
      { id: "a", text: "A fixed-term savings account" },
      { id: "b", text: "Funds available for withdrawal at any time" },
      { id: "c", text: "A type of loan" },
      { id: "d", text: "A high-risk investment" },
    ],
    correctAnswer: "b",
    explanation: "Demand deposits, like checking accounts, can be accessed without notice."
  },
  {
    id: 66,
    question: "What is the purpose of a bank’s net interest margin?",
    options: [
      { id: "a", text: "To measure the difference between interest income and expenses" },
      { id: "b", text: "To set customer fees" },
      { id: "c", text: "To reduce loan amounts" },
      { id: "d", text: "To increase taxes" },
    ],
    correctAnswer: "a",
    explanation: "Net interest margin shows profitability from interest-earning assets versus interest paid."
  },
  {
    id: 67,
    question: "What does 'FICO' stand for?",
    options: [
      { id: "a", text: "Fair Isaac Corporation" },
      { id: "b", text: "Financial Investment Control Organization" },
      { id: "c", text: "Federal Interest Credit Option" },
      { id: "d", text: "Funded Income Calculation Office" },
    ],
    correctAnswer: "a",
    explanation: "FICO is a company that develops widely used credit scoring models."
  },
  {
    id: 68,
    question: "What is a 'reverse mortgage'?",
    options: [
      { id: "a", text: "A loan that pays homeowners based on home equity" },
      { id: "b", text: "A traditional home purchase loan" },
      { id: "c", text: "A savings account" },
      { id: "d", text: "A tax refund" },
    ],
    correctAnswer: "a",
    explanation: "A reverse mortgage allows seniors to borrow against home equity, repaid when the home is sold."
  },
  {
    id: 69,
    question: "What does 'CFPB' stand for?",
    options: [
      { id: "a", text: "Consumer Financial Protection Bureau" },
      { id: "b", text: "Central Funding Policy Board" },
      { id: "c", text: "Certified Financial Planning Bureau" },
      { id: "d", text: "Consumer Fee Protection Board" },
    ],
    correctAnswer: "a",
    explanation: "The CFPB protects consumers by regulating financial products and services."
  },
  {
    id: 70,
    question: "What is a 'grace period' in banking?",
    options: [
      { id: "a", text: "A time when no interest is earned" },
      { id: "b", text: "A period to pay a bill without penalty" },
      { id: "c", text: "A loan repayment delay" },
      { id: "d", text: "A tax-free period" },
    ],
    correctAnswer: "b",
    explanation: "A grace period allows late payments without fees or interest, often on credit cards."
  },
  {
    id: 71,
    question: "What does 'UCC' stand for in banking law?",
    options: [
      { id: "a", text: "Uniform Commercial Code" },
      { id: "b", text: "United Credit Corporation" },
      { id: "c", text: "Universal Cash Control" },
      { id: "d", text: "Underwritten Capital Code" },
    ],
    correctAnswer: "a",
    explanation: "The UCC standardizes commercial transactions, including banking, across U.S. states."
  },
  {
    id: 72,
    question: "What is a 'secured loan'?",
    options: [
      { id: "a", text: "A loan with no collateral" },
      { id: "b", text: "A loan backed by an asset" },
      { id: "c", text: "A loan with no interest" },
      { id: "d", text: "A savings account" },
    ],
    correctAnswer: "b",
    explanation: "Secured loans use collateral, like a car or house, to reduce lender risk."
  },
  {
    id: 73,
    question: "What is the purpose of the Equal Credit Opportunity Act?",
    options: [
      { id: "a", text: "To ensure fair lending practices" },
      { id: "b", text: "To increase bank profits" },
      { id: "c", text: "To reduce loan availability" },
      { id: "d", text: "To eliminate credit scores" },
    ],
    correctAnswer: "a",
    explanation: "The ECOA prohibits discrimination in lending based on race, gender, or other factors."
  },
  {
    id: 74,
    question: "What does 'ACH debit' mean?",
    options: [
      { id: "a", text: "An electronic withdrawal from an account" },
      { id: "b", text: "A deposit into an account" },
      { id: "c", text: "A type of loan" },
      { id: "d", text: "A savings bonus" },
    ],
    correctAnswer: "a",
    explanation: "An ACH debit pulls funds from an account electronically, often for bill payments."
  },
  {
    id: 75,
    question: "What is a 'merchant bank'?",
    options: [
      { id: "a", text: "A bank focused on retail customers" },
      { id: "b", text: "A bank providing services to businesses, like trade finance" },
      { id: "c", text: "A savings-only bank" },
      { id: "d", text: "A tax collection agency" },
    ],
    correctAnswer: "b",
    explanation: "Merchant banks specialize in corporate finance, underwriting, and international trade."
  },
  {
    id: 76,
    question: "What does 'LTV' stand for in lending?",
    options: [
      { id: "a", text: "Loan-to-Value ratio" },
      { id: "b", text: "Long-Term Value" },
      { id: "c", text: "Lending Tax Variation" },
      { id: "d", text: "Liquidity Transfer Value" },
    ],
    correctAnswer: "a",
    explanation: "The Loan-to-Value ratio compares a loan amount to the value of the collateral."
  },
  {
    id: 77,
    question: "What is a 'bankruptcy'?",
    options: [
      { id: "a", text: "A profitable bank merger" },
      { id: "b", text: "A legal process for those unable to repay debts" },
      { id: "c", text: "A type of savings account" },
      { id: "d", text: "A tax refund" },
    ],
    correctAnswer: "b",
    explanation: "Bankruptcy allows individuals or businesses to restructure or discharge debts under court supervision."
  },
  {
    id: 78,
    question: "What does 'PMI' stand for in mortgages?",
    options: [
      { id: "a", text: "Private Mortgage Insurance" },
      { id: "b", text: "Public Market Investment" },
      { id: "c", text: "Personal Mortgage Interest" },
      { id: "d", text: "Primary Market Index" },
    ],
    correctAnswer: "a",
    explanation: "PMI protects lenders if a borrower defaults on a mortgage with a low down payment."
  },
  {
    id: 79,
    question: "What is a 'stop payment'?",
    options: [
      { id: "a", text: "A request to cancel a check or payment" },
      { id: "b", text: "A loan repayment pause" },
      { id: "c", text: "A savings withdrawal" },
      { id: "d", text: "A tax penalty" },
    ],
    correctAnswer: "a",
    explanation: "A stop payment instructs a bank to prevent a specific check or transaction from clearing."
  },
  {
    id: 80,
    question: "What does 'FRB' stand for?",
    options: [
      { id: "a", text: "Federal Reserve Bank" },
      { id: "b", text: "Financial Recovery Board" },
      { id: "c", text: "Funded Risk Bureau" },
      { id: "d", text: "Fiscal Revenue Base" },
    ],
    correctAnswer: "a",
    explanation: "The Federal Reserve Bank is part of the U.S. central banking system."
  },
  {
    id: 81,
    question: "What is a 'subprime loan'?",
    options: [
      { id: "a", text: "A loan for top-tier borrowers" },
      { id: "b", text: "A loan for borrowers with poor credit" },
      { id: "c", text: "A tax-free loan" },
      { id: "d", text: "A savings account" },
    ],
    correctAnswer: "b",
    explanation: "Subprime loans target higher-risk borrowers, often with higher interest rates."
  },
  {
    id: 82,
    question: "What does ' Basel III' focus on?",
    options: [
      { id: "a", text: "Improving bank capital and liquidity standards" },
      { id: "b", text: "Reducing customer fees" },
      { id: "c", text: "Increasing loan amounts" },
      { id: "d", text: "Eliminating taxes" },
    ],
    correctAnswer: "a",
    explanation: "Basel III strengthens bank regulations post-2008 to enhance financial stability."
  },
  {
    id: 83,
    question: "What is a 'trust account'?",
    options: [
      { id: "a", text: "An account managed by one party for another’s benefit" },
      { id: "b", text: "A high-risk investment" },
      { id: "c", text: "A loan account" },
      { id: "d", text: "A tax collection account" },
    ],
    correctAnswer: "a",
    explanation: "Trust accounts hold funds or assets managed by a trustee for a beneficiary."
  },
  {
    id: 84,
    question: "What does 'NCUA' stand for?",
    options: [
      { id: "a", text: "National Credit Union Administration" },
      { id: "b", text: "New Capital Utilization Agency" },
      { id: "c", text: "National Cash Underwriting Association" },
      { id: "d", text: "Net Credit Union Adjustment" },
    ],
    correctAnswer: "a",
    explanation: "The NCUA insures deposits and regulates credit unions in the U.S."
  },
  {
    id: 85,
    question: "What is a 'cashier’s check'?",
    options: [
      { id: "a", text: "A personal check" },
      { id: "b", text: "A check guaranteed by a bank" },
      { id: "c", text: "A loan document" },
      { id: "d", text: "A savings certificate" },
    ],
    correctAnswer: "b",
    explanation: "A cashier’s check is drawn on a bank’s funds, ensuring payment security."
  },
  {
    id: 86,
    question: "What does 'open market operations' mean?",
    options: [
      { id: "a", text: "Banks selling stocks" },
      { id: "b", text: "Central banks buying or selling securities to control money supply" },
      { id: "c", text: "Customer withdrawals" },
      { id: "d", text: "Tax collection" },
    ],
    correctAnswer: "b",
    explanation: "Open market operations adjust liquidity by trading government securities."
  },
  {
    id: 87,
    question: "What is a 'joint account'?",
    options: [
      { id: "a", text: "An account owned by multiple people" },
      { id: "b", text: "A single-owner savings account" },
      { id: "c", text: "A loan account" },
      { id: "d", text: "A tax-free account" },
    ],
    correctAnswer: "a",
    explanation: "A joint account allows multiple individuals to access and manage the same funds."
  },
  {
    id: 88,
    question: "What does 'FATCA' stand for?",
    options: [
      { id: "a", text: "Foreign Account Tax Compliance Act" },
      { id: "b", text: "Financial Asset Tracking Control Act" },
      { id: "c", text: "Federal Annual Tax Collection Act" },
      { id: "d", text: "Funded Account Transfer Compliance Act" },
    ],
    correctAnswer: "a",
    explanation: "FATCA requires reporting of foreign assets to combat tax evasion by U.S. citizens."
  },
  {
    id: 89,
    question: "What is a 'negative amortization'?",
    options: [
      { id: "a", text: "A loan where the balance decreases" },
      { id: "b", text: "A loan where the balance increases due to unpaid interest" },
      { id: "c", text: "A savings bonus" },
      { id: "d", text: "A tax refund" },
    ],
    correctAnswer: "b",
    explanation: "Negative amortization occurs when payments don’t cover interest, increasing the loan principal."
  },
  {
    id: 90,
    question: "What does 'tier 2 capital' include?",
    options: [
      { id: "a", text: "Core equity only" },
      { id: "b", text: "Supplementary capital like subordinated debt" },
      { id: "c", text: "Customer deposits" },
      { id: "d", text: "Short-term loans" },
    ],
    correctAnswer: "b",
    explanation: "Tier 2 capital provides additional financial cushion beyond tier 1, including less liquid assets."
  },
  {
    id: 91,
    question: "What is a 'home equity loan'?",
    options: [
      { id: "a", text: "A loan based on the value of a home’s equity" },
      { id: "b", text: "A loan for buying stocks" },
      { id: "c", text: "A savings account" },
      { id: "d", text: "A tax-free loan" },
    ],
    correctAnswer: "a",
    explanation: "A home equity loan uses the homeowner’s equity as collateral for borrowing."
  },
  {
    id: 92,
    question: "What does 'OCC' stand for?",
    options: [
      { id: "a", text: "Office of the Comptroller of the Currency" },
      { id: "b", text: "Operational Cash Control" },
      { id: "c", text: "Overseas Credit Corporation" },
      { id: "d", text: "Official Capital Committee" },
    ],
    correctAnswer: "a",
    explanation: "The OCC regulates and supervises national banks in the U.S."
  },
  {
    id: 93,
    question: "What is a 'sinking fund' in banking?",
    options: [
      { id: "a", text: "A fund to pay off debt over time" },
      { id: "b", text: "A high-risk investment" },
      { id: "c", text: "A savings account" },
      { id: "d", text: "A tax collection" },
    ],
    correctAnswer: "a",
    explanation: "A sinking fund sets aside money to gradually repay a debt or bond."
  },
  {
    id: 94,
    question: "What does 'ECOA' stand for?",
    options: [
      { id: "a", text: "Equal Credit Opportunity Act" },
      { id: "b", text: "Enhanced Capital Oversight Act" },
      { id: "c", text: "Emergency Cash Operations Act" },
      { id: "d", text: "Economic Credit Optimization Act" },
    ],
    correctAnswer: "a",
    explanation: "The ECOA ensures fair access to credit without discrimination."
  },
  {
    id: 95,
    question: "What is a 'charge-off'?",
    options: [
      { id: "a", text: "A debt written off as uncollectible" },
      { id: "b", text: "A savings bonus" },
      { id: "c", text: "A tax refund" },
      { id: "d", text: "A loan approval" },
    ],
    correctAnswer: "a",
    explanation: "A charge-off occurs when a bank deems a debt unlikely to be repaid, though it may still pursue collection."
  },
  {
    id: 96,
    question: "What does 'discount rate' mean in central banking?",
    options: [
      { id: "a", text: "The rate banks charge customers" },
      { id: "b", text: "The rate the central bank charges banks for loans" },
      { id: "c", text: "The savings interest rate" },
      { id: "d", text: "The tax rate" },
    ],
    correctAnswer: "b",
    explanation: "The discount rate influences monetary policy by setting the cost of borrowing from the central bank."
  },
  {
    id: 97,
    question: "What is a 'letter of credit'?",
    options: [
      { id: "a", text: "A bank guarantee of payment for a transaction" },
      { id: "b", text: "A personal loan" },
      { id: "c", text: "A savings certificate" },
      { id: "d", text: "A tax document" },
    ],
    correctAnswer: "a",
    explanation: "A letter of credit ensures payment in trade, reducing risk for sellers."
  },
  {
    id: 98,
    question: "What does 'FDCPA' stand for?",
    options: [
      { id: "a", text: "Fair Debt Collection Practices Act" },
      { id: "b", text: "Federal Deposit Control Policy Act" },
      { id: "c", text: "Financial Debt Compensation Plan Act" },
      { id: "d", text: "Funded Debt Collection Protection Act" },
    ],
    correctAnswer: "a",
    explanation: "The FDCPA regulates debt collection practices to protect consumers from harassment."
  },
  {
    id: 99,
    question: "What is a 'bridge loan'?",
    options: [
      { id: "a", text: "A long-term mortgage" },
      { id: "b", text: "A short-term loan to bridge a financing gap" },
      { id: "c", text: "A savings account" },
      { id: "d", text: "A tax-free loan" },
    ],
    correctAnswer: "b",
    explanation: "A bridge loan provides temporary funding until permanent financing is secured."
  },
  {
    id: 100,
    question: "What does 'BSA' stand for in banking regulations?",
    options: [
      { id: "a", text: "Bank Secrecy Act" },
      { id: "b", text: "Business Savings Account" },
      { id: "c", text: "Banking Standards Association" },
      { id: "d", text: "Basic Security Act" },
    ],
    correctAnswer: "a",
    explanation: "The Bank Secrecy Act requires banks to report suspicious activities to combat money laundering."
  }
];
const getRandomQuestions = (questionsArray, count) => {
  const shuffled = [...questionsArray].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export default function BankingQuizPage() {
  const [quizState, setQuizState] = useState("start") // start, playing, result
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false)
  const [activeQuestions, setActiveQuestions] = useState([]) // Store randomly selected questions

  const handleStart = () => {
    const randomQuestions = getRandomQuestions(questions, 10) // Select 10 random questions
    setActiveQuestions(randomQuestions)
    setQuizState("playing")
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowExplanation(false)
    setTimeLeft(300)
    setTimerActive(true)
  }

  const handleAnswerSelect = (questionId, answerId) => {
    if (selectedAnswers[questionId]) return // Prevent changing answer

    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    })

    setShowExplanation(true)

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < activeQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setShowExplanation(false)
      } else {
        setQuizState("result")
        setTimerActive(false)
      }
    }, 2000)
  }

  // Calculate score
  const calculateScore = () => {
    let correct = 0
    Object.keys(selectedAnswers).forEach((questionId) => {
      const question = activeQuestions.find((q) => q.id === Number.parseInt(questionId))
      if (question && selectedAnswers[questionId] === question.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Effect for timer
  useEffect(() => {
    let interval
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setQuizState("result")
      setTimerActive(false)
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

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
            <h2 className="text-3xl font-bold tracking-tight">Banking Basics Quiz</h2>
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
              <CardTitle>Banking Basics Quiz</CardTitle>
              <CardDescription>Test your knowledge about banking and its policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Quiz Instructions</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <span>You have 5 minutes to complete 10 multiple-choice questions randomly selected from a larger set</span>
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
                    <span>You can earn up to 20 coins and 30 XP for a perfect score</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Topics Covered</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This quiz covers topics such as types of bank accounts,
                  functions of the RBI, roles of commercial banks, online
                  banking services, interest types, loan concepts, financial
                  instruments like cheques and demand drafts, and banking
                  regulations like KYC and CRR.
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
                    Question {currentQuestion + 1} of {activeQuestions.length}
                  </CardTitle>
                  <CardDescription>Banking Basics</CardDescription>
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
                  <span>{Math.round((currentQuestion / activeQuestions.length) * 100)}%</span>
                </div>
                <Progress value={(currentQuestion / activeQuestions.length) * 100} className="h-2" />
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">{activeQuestions[currentQuestion].question}</p>
              </div>

              <div className="space-y-3">
                {activeQuestions[currentQuestion].options.map((option) => {
                  const isSelected = selectedAnswers[activeQuestions[currentQuestion].id] === option.id
                  const isCorrect = option.id === activeQuestions[currentQuestion].correctAnswer

                  return (
                    <button
                      key={option.id}
                      className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted ${
                        isSelected
                          ? isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : ""
                      }`}
                      onClick={() => handleAnswerSelect(activeQuestions[currentQuestion].id, option.id)}
                      disabled={selectedAnswers[activeQuestions[currentQuestion].id] !== undefined}
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
                  )
                })}
              </div>

              {showExplanation && (
                <div
                  className={`rounded-md p-3 ${
                    selectedAnswers[activeQuestions[currentQuestion].id] === activeQuestions[currentQuestion].correctAnswer
                      ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {selectedAnswers[activeQuestions[currentQuestion].id] === activeQuestions[currentQuestion].correctAnswer ? (
                      <CheckCircle className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {selectedAnswers[activeQuestions[currentQuestion].id] === activeQuestions[currentQuestion].correctAnswer
                          ? "Correct!"
                          : "Incorrect"}
                      </p>
                      <p className="text-sm">{activeQuestions[currentQuestion].explanation}</p>
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
              <CardDescription>You've completed the Banking Basics Quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">
                    Your Score: {calculateScore()}/{activeQuestions.length}
                  </h3>
                  <p className="text-muted-foreground">
                    {calculateScore() >= 8
                      ? "Excellent! You have a strong understanding of Banking principles."
                      : calculateScore() >= 6
                        ? "Good job! You understand the basics of Banking."
                        : "You're on your way to understanding Banking principles."}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    You've earned {Math.round((calculateScore() / activeQuestions.length) * 20)} Coins and{" "}
                    {Math.round((calculateScore() / activeQuestions.length) * 30)} XP!
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Question Summary</h3>
                <div className="mt-4 space-y-3">
                  {activeQuestions.map((question, index) => {
                    const userAnswer = selectedAnswers[question.id]
                    const isCorrect = userAnswer === question.correctAnswer

                    return (
                      <div key={question.id} className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm">
                          Question {index + 1}: {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                    )
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
                    <span>Know different bank account types and their uses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>Understand basic banking services like loans and online banking.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>Learn the role of RBI and key regulations like KYC.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>Get familiar with tools like cheques, debit cards, and drafts.</span>
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
  )
}