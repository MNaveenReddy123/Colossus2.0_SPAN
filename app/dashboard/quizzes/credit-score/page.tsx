"use client"

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
const questions= [
  {
    id: 1,
    question: "What is a credit score?",
    options: [
      { id: "a", text: "A measure of your income" },
      { id: "b", text: "A numerical rating of your creditworthiness" },
      { id: "c", text: "Your total savings amount" },
      { id: "d", text: "A type of bank account" },
    ],
    correctAnswer: "b",
    explanation:
      "A credit score is a number that reflects how well you manage credit, used by lenders to assess risk.",
  },
  {
    id: 2,
    question: "Which organization is NOT a major credit bureau?",
    options: [
      { id: "a", text: "Equifax" },
      { id: "b", text: "TransUnion" },
      { id: "c", text: "Experian" },
      { id: "d", text: "Walmart" },
    ],
    correctAnswer: "d",
    explanation:
      "Equifax, TransUnion, and Experian are the three major credit bureaus; Walmart is a retailer, not a bureau.",
  },
  {
    id: 3,
    question: "What is the most commonly used credit score model?",
    options: [
      { id: "a", text: "VantageScore" },
      { id: "b", text: "FICO Score" },
      { id: "c", text: "CreditPlus" },
      { id: "d", text: "ScoreMaster" },
    ],
    correctAnswer: "b",
    explanation:
      "The FICO Score is the most widely used model by lenders to evaluate creditworthiness.",
  },
  {
    id: 4,
    question: "What is the typical range of a FICO credit score?",
    options: [
      { id: "a", text: "0–100" },
      { id: "b", text: "300–850" },
      { id: "c", text: "500–1000" },
      { id: "d", text: "100–500" },
    ],
    correctAnswer: "b",
    explanation:
      "FICO scores range from 300 to 850, with higher scores indicating better creditworthiness.",
  },
  {
    id: 5,
    question: "Which factor has the greatest impact on your credit score?",
    options: [
      { id: "a", text: "Types of credit used" },
      { id: "b", text: "Payment history" },
      { id: "c", text: "New credit inquiries" },
      { id: "d", text: "Length of credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "Payment history, accounting for 35% of a FICO score, is the most significant factor.",
  },
  {
    id: 6,
    question: "What does a high credit score indicate?",
    options: [
      { id: "a", text: "High debt levels" },
      { id: "b", text: "Good credit management" },
      { id: "c", text: "Frequent late payments" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A high credit score suggests you manage credit responsibly, paying bills on time and keeping debt low.",
  },
  {
    id: 7,
    question: "How often can you check your credit report without hurting your score?",
    options: [
      { id: "a", text: "Once a year" },
      { id: "b", text: "As often as you want" },
      { id: "c", text: "Only once every five years" },
      { id: "d", text: "Twice a month" },
    ],
    correctAnswer: "b",
    explanation:
      "Checking your own credit report is a soft inquiry and doesn’t affect your score, so you can do it anytime.",
  },
  {
    id: 8,
    question: "What is a hard inquiry on your credit report?",
    options: [
      { id: "a", text: "Checking your own credit score" },
      { id: "b", text: "A lender checking your credit for a loan application" },
      { id: "c", text: "Paying a bill on time" },
      { id: "d", text: "Closing a credit card" },
    ],
    correctAnswer: "b",
    explanation:
      "A hard inquiry occurs when a lender reviews your credit for a loan or credit application, which can slightly lower your score.",
  },
  {
    id: 9,
    question: "How long does a hard inquiry stay on your credit report?",
    options: [
      { id: "a", text: "6 months" },
      { id: "b", text: "1 year" },
      { id: "c", text: "2 years" },
      { id: "d", text: "5 years" },
    ],
    correctAnswer: "c",
    explanation:
      "Hard inquiries remain on your credit report for 2 years, though their impact fades over time.",
  },
  {
    id: 10,
    question: "What is the second most important factor in your FICO score?",
    options: [
      { id: "a", text: "Credit utilization" },
      { id: "b", text: "Length of credit history" },
      { id: "c", text: "New credit" },
      { id: "d", text: "Types of credit" },
    ],
    correctAnswer: "a",
    explanation:
      "Credit utilization, or the amount of credit you’re using, is 30% of your FICO score, making it the second biggest factor.",
  },
  {
    id: 11,
    question: "What is considered a good credit utilization ratio?",
    options: [
      { id: "a", text: "Below 30%" },
      { id: "b", text: "50–70%" },
      { id: "c", text: "Above 90%" },
      { id: "d", text: "100%" },
    ],
    correctAnswer: "a",
    explanation:
      "Keeping credit utilization below 30% is recommended to maintain a healthy credit score.",
  },
  {
    id: 12,
    question: "How can paying bills late affect your credit score?",
    options: [
      { id: "a", text: "It has no effect" },
      { id: "b", text: "It can lower your score" },
      { id: "c", text: "It improves your score" },
      { id: "d", text: "It doubles your score" },
    ],
    correctAnswer: "b",
    explanation:
      "Late payments can significantly decrease your credit score, as payment history is a major factor.",
  },
  {
    id: 13,
    question: "What is the minimum payment on a credit card?",
    options: [
      { id: "a", text: "The full balance" },
      { id: "b", text: "A small percentage of the balance" },
      { id: "c", text: "Half the balance" },
      { id: "d", text: "Nothing" },
    ],
    correctAnswer: "b",
    explanation:
      "The minimum payment is typically a small percentage of your credit card balance, but paying only this can increase interest costs.",
  },
  {
    id: 14,
    question: "How long does a bankruptcy stay on your credit report?",
    options: [
      { id: "a", text: "1 year" },
      { id: "b", text: "5 years" },
      { id: "c", text: "7–10 years" },
      { id: "d", text: "Forever" },
    ],
    correctAnswer: "c",
    explanation:
      "A bankruptcy can remain on your credit report for 7 to 10 years, depending on the type, severely impacting your score.",
  },
  {
    id: 15,
    question: "What is one way to improve your credit score?",
    options: [
      { id: "a", text: "Maxing out credit cards" },
      { id: "b", text: "Paying bills on time" },
      { id: "c", text: "Ignoring your credit report" },
      { id: "d", text: "Applying for many loans at once" },
    ],
    correctAnswer: "b",
    explanation:
      "Consistently paying bills on time boosts your payment history, a key factor in your credit score.",
  },
  {
    id: 16,
    question: "Why might closing an old credit card hurt your score?",
    options: [
      { id: "a", text: "It increases your credit limit" },
      { id: "b", text: "It shortens your credit history" },
      { id: "c", text: "It lowers your interest rates" },
      { id: "d", text: "It removes late payments" },
    ],
    correctAnswer: "b",
    explanation:
      "Closing an old account reduces the length of your credit history, which can negatively affect your score.",
  },
  {
    id: 17,
    question: "What does ‘credit utilization’ measure?",
    options: [
      { id: "a", text: "How long you’ve had credit" },
      { id: "b", text: "The percentage of available credit you’re using" },
      { id: "c", text: "Your total income" },
      { id: "d", text: "The number of credit inquiries" },
    ],
    correctAnswer: "b",
    explanation:
      "Credit utilization is the ratio of your credit card balances to your credit limits, impacting your score.",
  },
  {
    id: 18,
    question: "What is a secured credit card?",
    options: [
      { id: "a", text: "A card with no credit limit" },
      { id: "b", text: "A card backed by a cash deposit" },
      { id: "c", text: "A card for high-income earners" },
      { id: "d", text: "A card with no interest" },
    ],
    correctAnswer: "b",
    explanation:
      "A secured credit card requires a deposit as collateral, helping build credit for those with low scores.",
  },
  {
    id: 19,
    question: "How can too many credit inquiries hurt your score?",
    options: [
      { id: "a", text: "They increase your credit limit" },
      { id: "b", text: "They signal risk to lenders" },
      { id: "c", text: "They improve your payment history" },
      { id: "d", text: "They lower your interest rates" },
    ],
    correctAnswer: "b",
    explanation:
      "Multiple hard inquiries in a short time can suggest financial distress, lowering your score.",
  },
  {
    id: 20,
    question: "What is a benefit of having a good credit score?",
    options: [
      { id: "a", text: "Higher interest rates" },
      { id: "b", text: "Lower loan interest rates" },
      { id: "c", text: "Fewer credit options" },
      { id: "d", text: "More late fees" },
    ],
    correctAnswer: "b",
    explanation:
      "A good credit score can qualify you for lower interest rates, saving money on loans and credit.",
  },
  {
    id: 21,
    question: "What does a credit report contain?",
    options: [
      { id: "a", text: "Your social media activity" },
      { id: "b", text: "Your credit history and accounts" },
      { id: "c", text: "Your grocery spending" },
      { id: "d", text: "Your tax returns" },
    ],
    correctAnswer: "b",
    explanation:
      "A credit report details your credit accounts, payment history, and inquiries, used to calculate your score.",
  },
  {
    id: 22,
    question: "How often are you entitled to a free credit report from each bureau?",
    options: [
      { id: "a", text: "Every month" },
      { id: "b", text: "Once a year" },
      { id: "c", text: "Every 5 years" },
      { id: "d", text: "Never" },
    ],
    correctAnswer: "b",
    explanation:
      "You can request a free credit report from each of the three major bureaus annually via AnnualCreditReport.com.",
  },
  {
    id: 23,
    question: "What is a common credit score range for excellent credit?",
    options: [
      { id: "a", text: "300–579" },
      { id: "b", text: "580–669" },
      { id: "c", text: "740–850" },
      { id: "d", text: "670–739" },
    ],
    correctAnswer: "c",
    explanation:
      "A FICO score of 740–850 is typically considered excellent, offering the best loan terms.",
  },
  {
    id: 24,
    question: "What does it mean to ‘freeze’ your credit?",
    options: [
      { id: "a", text: "Close all credit accounts" },
      { id: "b", text: "Prevent new credit from being opened in your name" },
      { id: "c", text: "Increase your credit limit" },
      { id: "d", text: "Pay off all debts" },
    ],
    correctAnswer: "b",
    explanation:
      "A credit freeze restricts access to your credit report, preventing fraud by blocking new account openings.",
  },
  {
    id: 25,
    question: "How can you dispute an error on your credit report?",
    options: [
      { id: "a", text: "Ignore it" },
      { id: "b", text: "Contact the credit bureau and provide evidence" },
      { id: "c", text: "Apply for more credit" },
      { id: "d", text: "Close your accounts" },
    ],
    correctAnswer: "b",
    explanation:
      "Disputing errors involves contacting the credit bureau with proof to correct inaccuracies that may hurt your score.",
  },
  {
    id: 26,
    question: "What is a co-signer on a loan?",
    options: [
      { id: "a", text: "Someone who pays your taxes" },
      { id: "b", text: "Someone who agrees to repay the loan if you don’t" },
      { id: "c", text: "A type of credit card" },
      { id: "d", text: "A bank employee" },
    ],
    correctAnswer: "b",
    explanation:
      "A co-signer guarantees loan repayment, which can help you get approved but affects their credit too.",
  },
  {
    id: 27,
    question: "How does a late payment affect your credit score?",
    options: [
      { id: "a", text: "It has no impact" },
      { id: "b", text: "It can lower your score significantly" },
      { id: "c", text: "It raises your score" },
      { id: "d", text: "It doubles your credit limit" },
    ],
    correctAnswer: "b",
    explanation:
      "Late payments, especially if 30+ days late, can drop your score as they harm your payment history.",
  },
  {
    id: 28,
    question: "What is a good habit to maintain a high credit score?",
    options: [
      { id: "a", text: "Maxing out credit cards" },
      { id: "b", text: "Paying off balances in full each month" },
      { id: "c", text: "Missing payments occasionally" },
      { id: "d", text: "Opening many new accounts" },
    ],
    correctAnswer: "b",
    explanation:
      "Paying balances in full keeps utilization low and payment history strong, boosting your score.",
  },
  {
    id: 29,
    question: "What does ‘length of credit history’ refer to?",
    options: [
      { id: "a", text: "How much you owe" },
      { id: "b", text: "How long you’ve had credit accounts" },
      { id: "c", text: "The number of credit cards you own" },
      { id: "d", text: "Your income level" },
    ],
    correctAnswer: "b",
    explanation:
      "Length of credit history measures the age of your accounts, contributing 15% to your FICO score.",
  },
  {
    id: 30,
    question: "Why might a lender deny you a loan?",
    options: [
      { id: "a", text: "A high credit score" },
      { id: "b", text: "A low credit score" },
      { id: "c", text: "Paying bills on time" },
      { id: "d", text: "Low credit utilization" },
    ],
    correctAnswer: "b",
    explanation:
      "A low credit score signals higher risk to lenders, often leading to loan denials or higher rates.",
  },
  {
    id: 31,
    question: "What is a credit limit?",
    options: [
      { id: "a", text: "The maximum amount you can borrow on a credit card" },
      { id: "b", text: "Your monthly income" },
      { id: "c", text: "The minimum payment due" },
      { id: "d", text: "Your total savings" },
    ],
    correctAnswer: "a",
    explanation:
      "A credit limit is the maximum amount a lender allows you to borrow on a credit card.",
  },
  {
    id: 32,
    question: "How can opening a new credit card affect your score?",
    options: [
      { id: "a", text: "It always improves it" },
      { id: "b", text: "It may lower it temporarily due to an inquiry" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It doubles your score" },
    ],
    correctAnswer: "b",
    explanation:
      "A new card triggers a hard inquiry and may shorten average credit age, temporarily lowering your score.",
  },
  {
    id: 33,
    question: "What is the purpose of a credit score?",
    options: [
      { id: "a", text: "To track your spending habits" },
      { id: "b", text: "To assess your ability to repay debt" },
      { id: "c", text: "To measure your income" },
      { id: "d", text: "To monitor your savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Lenders use credit scores to evaluate how likely you are to repay borrowed money.",
  },
  {
    id: 34,
    question: "What does a score of 300 indicate?",
    options: [
      { id: "a", text: "Excellent credit" },
      { id: "b", text: "Very poor credit" },
      { id: "c", text: "Average credit" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A score of 300, the lowest in the FICO range, indicates very poor credit management.",
  },
  {
    id: 35,
    question: "How can you build credit if you have no credit history?",
    options: [
      { id: "a", text: "Avoid all credit" },
      { id: "b", text: "Use a secured credit card responsibly" },
      { id: "c", text: "Max out a credit card" },
      { id: "d", text: "Miss payments" },
    ],
    correctAnswer: "b",
    explanation:
      "A secured credit card, used responsibly, helps establish a positive credit history.",
  },
  {
    id: 36,
    question: "What is an authorized user on a credit card?",
    options: [
      { id: "a", text: "Someone who owns the card" },
      { id: "b", text: "Someone allowed to use the card by the primary owner" },
      { id: "c", text: "A bank employee" },
      { id: "d", text: "A loan officer" },
    ],
    correctAnswer: "b",
    explanation:
      "An authorized user can use the card, and the account’s history may help their credit score.",
  },
  {
    id: 37,
    question: "How long does a late payment stay on your credit report?",
    options: [
      { id: "a", text: "1 year" },
      { id: "b", text: "3 years" },
      { id: "c", text: "7 years" },
      { id: "d", text: "Forever" },
    ],
    correctAnswer: "c",
    explanation:
      "Late payments remain on your credit report for 7 years, impacting your score during that time.",
  },
  {
    id: 38,
    question: "What is a benefit of a diverse credit mix?",
    options: [
      { id: "a", text: "Higher debt" },
      { id: "b", text: "It can improve your credit score" },
      { id: "c", text: "More late payments" },
      { id: "d", text: "Fewer credit options" },
    ],
    correctAnswer: "b",
    explanation:
      "Managing various types of credit (e.g., credit cards, loans) well can positively affect your score.",
  },
  {
    id: 39,
    question: "What does ‘defaulting on a loan’ mean?",
    options: [
      { id: "a", text: "Paying it off early" },
      { id: "b", text: "Failing to make payments as agreed" },
      { id: "c", text: "Increasing your credit limit" },
      { id: "d", text: "Lowering interest rates" },
    ],
    correctAnswer: "b",
    explanation:
      "Defaulting occurs when you don’t repay a loan, severely damaging your credit score.",
  },
  {
    id: 40,
    question: "Why might your credit score differ between bureaus?",
    options: [
      { id: "a", text: "They use the same data" },
      { id: "b", text: "They may have different information or scoring models" },
      { id: "c", text: "Your income changes" },
      { id: "d", text: "You checked it too often" },
    ],
    correctAnswer: "b",
    explanation:
      "Bureaus may receive different data from lenders or use varying scoring models, causing score differences.",
  },
  {
    id: 41,
    question: "What is a common myth about credit scores?",
    options: [
      { id: "a", text: "Checking your score hurts it" },
      { id: "b", text: "Paying bills on time helps it" },
      { id: "c", text: "Low utilization is good" },
      { id: "d", text: "Old accounts benefit it" },
    ],
    correctAnswer: "a",
    explanation:
      "Checking your own score is a soft inquiry and doesn’t harm it, unlike the myth suggests.",
  },
  {
    id: 42,
    question: "What does a score of 700 generally indicate?",
    options: [
      { id: "a", text: "Poor credit" },
      { id: "b", text: "Good credit" },
      { id: "c", text: "No credit history" },
      { id: "d", text: "Excellent credit" },
    ],
    correctAnswer: "b",
    explanation:
      "A score of 700 falls in the good range (670–739), showing responsible credit use.",
  },
  {
    id: 43,
    question: "How can paying off a loan affect your credit score?",
    options: [
      { id: "a", text: "It always lowers it" },
      { id: "b", text: "It may improve it by reducing debt" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It doubles your score" },
    ],
    correctAnswer: "b",
    explanation:
      "Paying off a loan reduces your debt, which can boost your score, though closing the account might slightly offset this.",
  },
  {
    id: 44,
    question: "What is identity theft’s impact on your credit score?",
    options: [
      { id: "a", text: "It improves it" },
      { id: "b", text: "It can lower it if accounts are misused" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It increases your limit" },
    ],
    correctAnswer: "b",
    explanation:
      "Fraudulent accounts or missed payments from identity theft can damage your credit score.",
  },
  {
    id: 45,
    question: "What is a credit counselor?",
    options: [
      { id: "a", text: "A type of credit card" },
      { id: "b", text: "A professional who helps manage debt and credit" },
      { id: "c", text: "A bank teller" },
      { id: "d", text: "A loan officer" },
    ],
    correctAnswer: "b",
    explanation:
      "Credit counselors offer advice to improve credit and manage debt, often aiding score recovery.",
  },
  {
    id: 46,
    question: "Why might a landlord check your credit score?",
    options: [
      { id: "a", text: "To see your income" },
      { id: "b", text: "To assess your reliability as a tenant" },
      { id: "c", text: "To offer you a job" },
      { id: "d", text: "To check your savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Landlords use credit scores to evaluate if you’ll pay rent on time, reflecting financial responsibility.",
  },
  {
    id: 47,
    question: "What is a derogatory mark on a credit report?",
    options: [
      { id: "a", text: "A positive payment record" },
      { id: "b", text: "A negative item like a late payment" },
      { id: "c", text: "A new credit card" },
      { id: "d", text: "A high credit limit" },
    ],
    correctAnswer: "b",
    explanation:
      "Derogatory marks, such as late payments or defaults, hurt your credit score.",
  },
  {
    id: 48,
    question: "How can you monitor your credit score?",
    options: [
      { id: "a", text: "Ignore it" },
      { id: "b", text: "Use a free credit monitoring service" },
      { id: "c", text: "Max out your cards" },
      { id: "d", text: "Close all accounts" },
    ],
    correctAnswer: "b",
    explanation:
      "Free services from banks or bureaus let you track your score and spot issues early.",
  },
  {
    id: 49,
    question: "What does a score below 580 indicate?",
    options: [
      { id: "a", text: "Excellent credit" },
      { id: "b", text: "Poor credit" },
      { id: "c", text: "Good credit" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A score below 580 is considered poor, often leading to higher interest rates or loan denials.",
  },
  {
    id: 50,
    question: "What is a benefit of keeping old accounts open?",
    options: [
      { id: "a", text: "Higher interest rates" },
      { id: "b", text: "Longer credit history" },
      { id: "c", text: "More late payments" },
      { id: "d", text: "Fewer credit options" },
    ],
    correctAnswer: "b",
    explanation:
      "Old accounts extend your credit history length, which can positively influence your score.",
  },
  {
    id: 51,
    question: "What is a charge-off on your credit report?",
    options: [
      { id: "a", text: "Paying off a debt early" },
      { id: "b", text: "A debt written off as uncollectible" },
      { id: "c", text: "Opening a new account" },
      { id: "d", text: "Increasing your limit" },
    ],
    correctAnswer: "b",
    explanation:
      "A charge-off occurs when a lender gives up on collecting a debt, badly hurting your score.",
  },
  {
    id: 52,
    question: "How can student loans affect your credit score?",
    options: [
      { id: "a", text: "They always lower it" },
      { id: "b", text: "Timely payments can improve it" },
      { id: "c", text: "They have no effect" },
      { id: "d", text: "They double your score" },
    ],
    correctAnswer: "b",
    explanation:
      "Paying student loans on time builds a positive payment history, boosting your score.",
  },
  {
    id: 53,
    question: "What is a credit builder loan?",
    options: [
      { id: "a", text: "A loan with no repayment" },
      { id: "b", text: "A small loan to help establish credit" },
      { id: "c", text: "A high-interest mortgage" },
      { id: "d", text: "A type of credit card" },
    ],
    correctAnswer: "b",
    explanation:
      "Credit builder loans are designed to help people build credit through manageable payments.",
  },
  {
    id: 54,
    question: "Why might an employer check your credit report?",
    options: [
      { id: "a", text: "To determine your salary" },
      { id: "b", text: "To assess financial responsibility" },
      { id: "c", text: "To offer you a loan" },
      { id: "d", text: "To check your savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Some employers check credit to gauge reliability, especially for finance-related roles.",
  },
  {
    id: 55,
    question: "What does ‘revolving credit’ mean?",
    options: [
      { id: "a", text: "A fixed loan amount" },
      { id: "b", text: "Credit you can reuse, like a credit card" },
      { id: "c", text: "A one-time payment" },
      { id: "d", text: "A type of savings account" },
    ],
    correctAnswer: "b",
    explanation:
      "Revolving credit, like credit cards, lets you borrow repeatedly up to a limit as you repay.",
  },
  {
    id: 56,
    question: "How can a high balance affect your credit score?",
    options: [
      { id: "a", text: "It improves it" },
      { id: "b", text: "It can lower it due to high utilization" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It doubles your score" },
    ],
    correctAnswer: "b",
    explanation:
      "High balances increase credit utilization, which can reduce your score if it exceeds 30%.",
  },
  {
    id: 57,
    question: "What is a soft inquiry?",
    options: [
      { id: "a", text: "A lender applying for your credit" },
      { id: "b", text: "Checking your own credit" },
      { id: "c", text: "Missing a payment" },
      { id: "d", text: "Closing an account" },
    ],
    correctAnswer: "b",
    explanation:
      "A soft inquiry, like checking your own credit, doesn’t impact your score.",
  },
  {
    id: 58,
    question: "How can you avoid credit score damage from medical bills?",
    options: [
      { id: "a", text: "Ignore them" },
      { id: "b", text: "Pay or negotiate them before collections" },
      { id: "c", text: "Max out credit cards" },
      { id: "d", text: "Apply for more loans" },
    ],
    correctAnswer: "b",
    explanation:
      "Paying or negotiating medical bills before they go to collections prevents negative reporting.",
  },
  {
    id: 59,
    question: "What does a score of 800+ indicate?",
    options: [
      { id: "a", text: "Poor credit" },
      { id: "b", text: "Excellent credit" },
      { id: "c", text: "Average credit" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A score of 800+ is excellent, reflecting outstanding credit management.",
  },
  {
    id: 60,
    question: "What is a benefit of a low credit utilization ratio?",
    options: [
      { id: "a", text: "Higher interest rates" },
      { id: "b", text: "Improved credit score" },
      { id: "c", text: "More late payments" },
      { id: "d", text: "Fewer credit options" },
    ],
    correctAnswer: "b",
    explanation:
      "Low utilization shows you’re not over-relying on credit, boosting your score.",
  },
  {
    id: 61,
    question: "What is a collection account?",
    options: [
      { id: "a", text: "A savings account" },
      { id: "b", text: "An unpaid debt sent to a collection agency" },
      { id: "c", text: "A type of credit card" },
      { id: "d", text: "A paid-off loan" },
    ],
    correctAnswer: "b",
    explanation:
      "A collection account is a delinquent debt handed to an agency, harming your credit score.",
  },
  {
    id: 62,
    question: "How can a credit score affect renting an apartment?",
    options: [
      { id: "a", text: "It has no effect" },
      { id: "b", text: "A low score might lead to rejection" },
      { id: "c", text: "It increases your rent" },
      { id: "d", text: "It lowers your deposit" },
    ],
    correctAnswer: "b",
    explanation:
      "Landlords may reject applicants with low scores due to perceived payment risk.",
  },
  {
    id: 63,
    question: "What is a good way to recover from a low credit score?",
    options: [
      { id: "a", text: "Ignore it" },
      { id: "b", text: "Pay bills on time consistently" },
      { id: "c", text: "Max out credit cards" },
      { id: "d", text: "Close all accounts" },
    ],
    correctAnswer: "b",
    explanation:
      "Consistent on-time payments rebuild your payment history, gradually raising your score.",
  },
  {
    id: 64,
    question: "What does ‘creditworthiness’ mean?",
    options: [
      { id: "a", text: "Your total savings" },
      { id: "b", text: "Your ability to repay debt" },
      { id: "c", text: "Your income level" },
      { id: "d", text: "Your spending habits" },
    ],
    correctAnswer: "b",
    explanation:
      "Creditworthiness is how trustworthy you are to repay borrowed money, reflected in your score.",
  },
  {
    id: 65,
    question: "How can a missed mortgage payment affect your score?",
    options: [
      { id: "a", text: "It improves it" },
      { id: "b", text: "It can drop it significantly" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It doubles your score" },
    ],
    correctAnswer: "b",
    explanation:
      "Missing a mortgage payment, a large debt, can severely lower your score due to its impact on payment history.",
  },
  {
    id: 66,
    question: "What is a benefit of monitoring your credit report?",
    options: [
      { id: "a", text: "Higher debt" },
      { id: "b", text: "Catching errors or fraud early" },
      { id: "c", text: "More late payments" },
      { id: "d", text: "Fewer credit options" },
    ],
    correctAnswer: "b",
    explanation:
      "Monitoring helps you spot and fix inaccuracies or identity theft that could harm your score.",
  },
  {
    id: 67,
    question: "What does a score of 620 indicate?",
    options: [
      { id: "a", text: "Excellent credit" },
      { id: "b", text: "Fair credit" },
      { id: "c", text: "Poor credit" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A score of 620 falls in the fair range (580–669), indicating moderate creditworthiness.",
  },
  {
    id: 68,
    question: "How can a debt settlement affect your credit score?",
    options: [
      { id: "a", text: "It always improves it" },
      { id: "b", text: "It can lower it due to partial payment" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It doubles your score" },
    ],
    correctAnswer: "b",
    explanation:
      "Settling a debt for less than owed can hurt your score, as it shows you didn’t fully repay.",
  },
  {
    id: 69,
    question: "What is a good way to maintain a stable credit score?",
    options: [
      { id: "a", text: "Frequently open new accounts" },
      { id: "b", text: "Keep utilization low and pay on time" },
      { id: "c", text: "Miss occasional payments" },
      { id: "d", text: "Close old accounts" },
    ],
    correctAnswer: "b",
    explanation:
      "Low utilization and timely payments keep your score steady and strong.",
  },
  {
    id: 70,
    question: "Why might a utility company check your credit?",
    options: [
      { id: "a", text: "To offer you a job" },
      { id: "b", text: "To determine deposit requirements" },
      { id: "c", text: "To check your savings" },
      { id: "d", text: "To increase your income" },
    ],
    correctAnswer: "b",
    explanation:
      "Utilities may check credit to decide if a deposit is needed based on payment risk.",
  },
  {
    id: 71,
    question: "What is a benefit of paying more than the minimum on a credit card?",
    options: [
      { id: "a", text: "Higher interest costs" },
      { id: "b", text: "Lower utilization and less interest" },
      { id: "c", text: "More debt" },
      { id: "d", text: "Fewer credit options" },
    ],
    correctAnswer: "b",
    explanation:
      "Paying more reduces your balance faster, lowering utilization and interest, helping your score.",
  },
  {
    id: 72,
    question: "What does ‘public record’ mean on a credit report?",
    options: [
      { id: "a", text: "Your social media posts" },
      { id: "b", text: "Legal events like bankruptcy" },
      { id: "c", text: "Your income" },
      { id: "d", text: "Your spending habits" },
    ],
    correctAnswer: "b",
    explanation:
      "Public records include events like bankruptcies or liens, which negatively affect your score.",
  },
  {
    id: 73,
    question: "How can a credit score impact car insurance rates?",
    options: [
      { id: "a", text: "It has no effect" },
      { id: "b", text: "A low score may raise rates" },
      { id: "c", text: "It lowers rates automatically" },
      { id: "d", text: "It doubles your premium" },
    ],
    correctAnswer: "b",
    explanation:
      "Insurers may charge higher rates for low scores, linking credit to risk of claims.",
  },
  {
    id: 74,
    question: "What is a good way to avoid credit score damage?",
    options: [
      { id: "a", text: "Max out all cards" },
      { id: "b", text: "Pay debts before they’re delinquent" },
      { id: "c", text: "Apply for many loans" },
      { id: "d", text: "Close old accounts" },
    ],
    correctAnswer: "b",
    explanation:
      "Paying debts on time prevents negative marks that could lower your score.",
  },
  {
    id: 75,
    question: "What does a score of 500 indicate?",
    options: [
      { id: "a", text: "Excellent credit" },
      { id: "b", text: "Poor credit" },
      { id: "c", text: "Good credit" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A score of 500 is poor, suggesting significant credit issues like missed payments.",
  },
  {
    id: 76,
    question: "How can a high credit limit help your score?",
    options: [
      { id: "a", text: "It increases debt" },
      { id: "b", text: "It lowers utilization if you don’t overspend" },
      { id: "c", text: "It raises interest rates" },
      { id: "d", text: "It shortens credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A higher limit can reduce utilization percentage, boosting your score if spending stays low.",
  },
  {
    id: 77,
    question: "What is a foreclosure’s effect on your credit score?",
    options: [
      { id: "a", text: "It improves it" },
      { id: "b", text: "It can drop it significantly" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It doubles your score" },
    ],
    correctAnswer: "b",
    explanation:
      "Foreclosure, a major default, can lower your score by 100+ points and stays for 7 years.",
  },
  {
    id: 78,
    question: "Why might you request a credit limit increase?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To lower your utilization ratio" },
      { id: "c", text: "To close the account" },
      { id: "d", text: "To miss payments" },
    ],
    correctAnswer: "b",
    explanation:
      "A higher limit can improve your score by reducing utilization, if you don’t increase spending.",
  },
  {
    id: 79,
    question: "What is a benefit of having no missed payments?",
    options: [
      { id: "a", text: "Higher debt" },
      { id: "b", text: "Strong payment history" },
      { id: "c", text: "More inquiries" },
      { id: "d", text: "Fewer credit options" },
    ],
    correctAnswer: "b",
    explanation:
      "No missed payments build a solid payment history, a major boost to your score.",
  },
  {
    id: 80,
    question: "What does ‘credit mix’ refer to?",
    options: [
      { id: "a", text: "Your income sources" },
      { id: "b", text: "The variety of credit types you have" },
      { id: "c", text: "Your spending habits" },
      { id: "d", text: "Your savings accounts" },
    ],
    correctAnswer: "b",
    explanation:
      "Credit mix is the diversity of credit (e.g., cards, loans), impacting 10% of your FICO score.",
  },
  {
    id: 81,
    question: "How can a divorce affect your credit score?",
    options: [
      { id: "a", text: "It automatically lowers it" },
      { id: "b", text: "It depends on joint account management" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It doubles your score" },
    ],
    correctAnswer: "b",
    explanation:
      "Divorce itself doesn’t affect your score, but missed payments on joint accounts can lower it.",
  },
  {
    id: 82,
    question: "What is a good way to avoid credit fraud?",
    options: [
      { id: "a", text: "Share your SSN freely" },
      { id: "b", text: "Monitor your credit and freeze it if needed" },
      { id: "c", text: "Ignore your report" },
      { id: "d", text: "Open many accounts" },
    ],
    correctAnswer: "b",
    explanation:
      "Monitoring and freezing your credit helps protect against unauthorized use that could hurt your score.",
  },
  {
    id: 83,
    question: "What does a score of 750 indicate?",
    options: [
      { id: "a", text: "Poor credit" },
      { id: "b", text: "Excellent credit" },
      { id: "c", text: "Fair credit" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A score of 750 is excellent, showing strong credit habits and qualifying for top rates.",
  },
  {
    id: 84,
    question: "How can a repossession affect your credit score?",
    options: [
      { id: "a", text: "It improves it" },
      { id: "b", text: "It can lower it significantly" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It increases your limit" },
    ],
    correctAnswer: "b",
    explanation:
      "Repossession, like losing a car for non-payment, can drop your score and stay for 7 years.",
  },
  {
    id: 85,
    question: "What is a good way to use credit cards responsibly?",
    options: [
      { id: "a", text: "Max them out" },
      { id: "b", text: "Pay them off monthly" },
      { id: "c", text: "Miss payments" },
      { id: "d", text: "Close them often" },
    ],
    correctAnswer: "b",
    explanation:
      "Paying off credit cards monthly keeps utilization low and builds a positive history.",
  },
  {
    id: 86,
    question: "Why might a bank offer you a lower interest rate?",
    options: [
      { id: "a", text: "A low credit score" },
      { id: "b", text: "A high credit score" },
      { id: "c", text: "Frequent late payments" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A high score signals low risk, prompting banks to offer better rates.",
  },
  {
    id: 87,
    question: "What is a benefit of correcting credit report errors?",
    options: [
      { id: "a", text: "Higher debt" },
      { id: "b", text: "A potentially higher score" },
      { id: "c", text: "More inquiries" },
      { id: "d", text: "Fewer credit options" },
    ],
    correctAnswer: "b",
    explanation:
      "Fixing errors removes negative inaccuracies, which can improve your credit score.",
  },
  {
    id: 88,
    question: "What does ‘installment credit’ mean?",
    options: [
      { id: "a", text: "Credit you reuse, like a card" },
      { id: "b", text: "A fixed loan repaid in payments" },
      { id: "c", text: "A type of savings" },
      { id: "d", text: "A one-time payment" },
    ],
    correctAnswer: "b",
    explanation:
      "Installment credit, like a car loan, involves fixed payments over time.",
  },
  {
    id: 89,
    question: "How can a low score affect buying a home?",
    options: [
      { id: "a", text: "Lower mortgage rates" },
      { id: "b", text: "Higher rates or denial" },
      { id: "c", text: "No effect" },
      { id: "d", text: "Faster approval" },
    ],
    correctAnswer: "b",
    explanation:
      "A low score can lead to higher mortgage rates or rejection due to perceived risk.",
  },
  {
    id: 90,
    question: "What is a good way to rebuild credit after bankruptcy?",
    options: [
      { id: "a", text: "Avoid all credit" },
      { id: "b", text: "Use a secured card responsibly" },
      { id: "c", text: "Max out new cards" },
      { id: "d", text: "Miss payments" },
    ],
    correctAnswer: "b",
    explanation:
      "A secured card, used wisely, helps rebuild credit post-bankruptcy with low risk.",
  },
  {
    id: 91,
    question: "What does a score of 670 indicate?",
    options: [
      { id: "a", text: "Poor credit" },
      { id: "b", text: "Good credit" },
      { id: "c", text: "Excellent credit" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A score of 670 is good, showing decent credit management and reasonable loan terms.",
  },
  {
    id: 92,
    question: "How can closing a credit card affect utilization?",
    options: [
      { id: "a", text: "It lowers it" },
      { id: "b", text: "It can raise it by reducing available credit" },
      { id: "c", text: "It has no effect" },
      { id: "d", text: "It doubles your score" },
    ],
    correctAnswer: "b",
    explanation:
      "Closing a card reduces total credit, potentially increasing utilization and lowering your score.",
  },
  {
    id: 93,
    question: "What is a benefit of a long credit history?",
    options: [
      { id: "a", text: "Higher debt" },
      { id: "b", text: "It can improve your score" },
      { id: "c", text: "More late payments" },
      { id: "d", text: "Fewer credit options" },
    ],
    correctAnswer: "b",
    explanation:
      "A longer history shows stability, positively impacting your credit score.",
  },
  {
    id: 94,
    question: "Why might you avoid applying for multiple cards at once?",
    options: [
      { id: "a", text: "It improves your score" },
      { id: "b", text: "It causes multiple hard inquiries" },
      { id: "c", text: "It increases your limit" },
      { id: "d", text: "It has no effect" },
    ],
    correctAnswer: "b",
    explanation:
      "Multiple applications trigger hard inquiries, which can temporarily lower your score.",
  },
  {
    id: 95,
    question: "What does a score of 600 indicate?",
    options: [
      { id: "a", text: "Excellent credit" },
      { id: "b", text: "Fair credit" },
      { id: "c", text: "Poor credit" },
      { id: "d", text: "No credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "A score of 600 is fair, indicating some credit issues but not the worst standing.",
  },
  {
    id: 96,
    question: "How can a paid-off collection account affect your score?",
    options: [
      { id: "a", text: "It removes the negative mark" },
      { id: "b", text: "It stays but may have less impact" },
      { id: "c", text: "It doubles your score" },
      { id: "d", text: "It has no effect" },
    ],
    correctAnswer: "b",
    explanation:
      "Paying a collection doesn’t remove it but may lessen its negative weight over time.",
  },
  {
    id: 97,
    question: "What is a good way to boost your score quickly?",
    options: [
      { id: "a", text: "Close all accounts" },
      { id: "b", text: "Pay down credit card balances" },
      { id: "c", text: "Miss a payment" },
      { id: "d", text: "Apply for many loans" },
    ],
    correctAnswer: "b",
    explanation:
      "Reducing balances lowers utilization, often raising your score within a month.",
  },
  {
    id: 98,
    question: "Why might a creditor report to only one bureau?",
    options: [
      { id: "a", text: "They must report to all" },
      { id: "b", text: "They choose which to report to" },
      { id: "c", text: "It’s illegal" },
      { id: "d", text: "It improves your score" },
    ],
    correctAnswer: "b",
    explanation:
      "Creditors aren’t required to report to all bureaus, leading to score variations.",
  },
  {
    id: 99,
    question: "What is a benefit of a consistent payment history?",
    options: [
      { id: "a", text: "Higher debt" },
      { id: "b", text: "A stronger credit score" },
      { id: "c", text: "More inquiries" },
      { id: "d", text: "Fewer credit options" },
    ],
    correctAnswer: "b",
    explanation:
      "Consistent payments build a reliable history, significantly boosting your score.",
  },
  {
    id: 100,
    question: "What does a credit score NOT consider?",
    options: [
      { id: "a", text: "Payment history" },
      { id: "b", text: "Your income" },
      { id: "c", text: "Credit utilization" },
      { id: "d", text: "Length of credit history" },
    ],
    correctAnswer: "b",
    explanation:
      "Credit scores focus on credit behavior, not personal factors like income or employment.",
  },
];


  const getRandomQuestions = (questionsArray, count) => {
    const shuffled = [...questionsArray].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
  
  export default function BudgetingQuizPage() {
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
              <h2 className="text-3xl font-bold tracking-tight">Credit-Score Basics Quiz</h2>
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
                <CardTitle>Credit-Score Basics Quiz</CardTitle>
                <CardDescription>Test your knowledge about Credit-Score principles</CardDescription>
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
                    This quiz covers credit scores, factors affecting scores, improving credit health, and the impact of credit-related behaviors.
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
                    <CardDescription>Credit-Score Basics</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className={timeLeft < 60 ? "text-red-500" : ""}>{formatTime(timeLeft)}</span>
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
                <CardDescription>You've completed the Budgeting Basics Quiz</CardDescription>
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
                        ? "Excellent! You have a strong understanding of budgeting principles."
                        : calculateScore() >= 6
                          ? "Good job! You understand the basics of budgeting."
                          : "You're on your way to understanding budgeting principles."}
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
                            {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
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
                      <span>A credit score reflects your creditworthiness and affects loan approvals.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Payment history and credit utilization are major factors influencing your score.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Good credit habits—like timely payments—help build a strong credit profile.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span>Regularly checking your credit report can prevent errors and fraud.</span>
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
