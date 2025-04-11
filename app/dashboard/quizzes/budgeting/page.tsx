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
const questions = [
  {
    id: 1,
    question: "What is the main purpose of creating a budget?",
    options: [
      { id: "a", text: "To spend money freely" },
      { id: "b", text: "To track and control spending" },
      { id: "c", text: "To avoid saving money" },
      { id: "d", text: "To increase debt" },
    ],
    correctAnswer: "b",
    explanation:
      "A budget helps you monitor income and expenses, ensuring you live within your means and achieve financial goals.",
  },
  {
    id: 2,
    question: "Which of these is considered a fixed expense?",
    options: [
      { id: "a", text: "Dining out" },
      { id: "b", text: "Rent or mortgage payment" },
      { id: "c", text: "Movie tickets" },
      { id: "d", text: "Gasoline" },
    ],
    correctAnswer: "b",
    explanation:
      "Fixed expenses, like rent or mortgage payments, are consistent amounts paid regularly, unlike variable expenses such as dining out.",
  },
  {
    id: 3,
    question: "What does the 50/30/20 budgeting rule suggest?",
    options: [
      { id: "a", text: "50% savings, 30% needs, 20% wants" },
      { id: "b", text: "50% needs, 30% wants, 20% savings" },
      { id: "c", text: "50% wants, 30% savings, 20% needs" },
      { id: "d", text: "50% debt, 30% needs, 20% savings" },
    ],
    correctAnswer: "b",
    explanation:
      "The 50/30/20 rule allocates 50% of income to necessities, 30% to wants, and 20% to savings or debt repayment.",
  },
  {
    id: 4,
    question: "Why is an emergency fund important in a budget?",
    options: [
      { id: "a", text: "To fund luxury purchases" },
      { id: "b", text: "To cover unexpected expenses" },
      { id: "c", text: "To increase monthly spending" },
      { id: "d", text: "To avoid paying bills" },
    ],
    correctAnswer: "b",
    explanation:
      "An emergency fund provides a financial cushion for unforeseen costs, like medical bills or car repairs, preventing debt.",
  },
  {
    id: 5,
    question: "What is a variable expense?",
    options: [
      { id: "a", text: "A car payment" },
      { id: "b", text: "Rent" },
      { id: "c", text: "Grocery bills" },
      { id: "d", text: "Insurance premiums" },
    ],
    correctAnswer: "c",
    explanation:
      "Variable expenses, like groceries, fluctuate in cost month-to-month, unlike fixed expenses such as rent.",
  },
  {
    id: 6,
    question: "Which of the following is a common budgeting mistake?",
    options: [
      { id: "a", text: "Tracking expenses" },
      { id: "b", text: "Setting realistic goals" },
      { id: "c", text: "Underestimating expenses" },
      { id: "d", text: "Saving regularly" },
    ],
    correctAnswer: "c",
    explanation:
      "Underestimating expenses can lead to overspending and derail a budget, making it hard to stick to financial plans.",
  },
  {
    id: 7,
    question: "What does ‘living within your means’ mean?",
    options: [
      { id: "a", text: "Spending more than you earn" },
      { id: "b", text: "Spending only what you earn or less" },
      { id: "c", text: "Borrowing money monthly" },
      { id: "d", text: "Avoiding all savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Living within your means involves spending an amount equal to or less than your income to avoid debt.",
  },
  {
    id: 8,
    question: "Which tool is most helpful for tracking a budget?",
    options: [
      { id: "a", text: "A calculator" },
      { id: "b", text: "A budgeting app or spreadsheet" },
      { id: "c", text: "A shopping list" },
      { id: "d", text: "A credit card" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting apps or spreadsheets allow you to organize, track, and analyze income and expenses effectively.",
  },
  {
    id: 9,
    question: "What is the first step in creating a budget?",
    options: [
      { id: "a", text: "Spending all your money" },
      { id: "b", text: "Calculating your total income" },
      { id: "c", text: "Paying off debt" },
      { id: "d", text: "Buying luxury items" },
    ],
    correctAnswer: "b",
    explanation:
      "Determining your total income is the foundation of a budget, as it sets the limit for your spending and saving.",
  },
  {
    id: 10,
    question: "Why should you review your budget regularly?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To adjust for changes in income or expenses" },
      { id: "c", text: "To avoid saving money" },
      { id: "d", text: "To increase debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Regular reviews ensure your budget reflects current financial circumstances, like income changes or new expenses.",
  },
  {
    id: 11,
    question: "What is a financial goal?",
    options: [
      { id: "a", text: "Spending all your income" },
      { id: "b", text: "A target for saving or spending money" },
      { id: "c", text: "Avoiding all expenses" },
      { id: "d", text: "Increasing credit card debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Financial goals, like saving for a house or paying off debt, guide your budgeting decisions.",
  },
  {
    id: 12,
    question: "Which of these is a short-term financial goal?",
    options: [
      { id: "a", text: "Saving for retirement" },
      { id: "b", text: "Building an emergency fund in 6 months" },
      { id: "c", text: "Buying a house in 10 years" },
      { id: "d", text: "Paying off a 30-year mortgage" },
    ],
    correctAnswer: "b",
    explanation:
      "Short-term goals, like building an emergency fund in 6 months, are achievable within a year or two.",
  },
  {
    id: 13,
    question: "What does ‘discretionary spending’ refer to?",
    options: [
      { id: "a", text: "Paying rent" },
      { id: "b", text: "Buying groceries" },
      { id: "c", text: "Spending on entertainment" },
      { id: "d", text: "Paying utility bills" },
    ],
    correctAnswer: "c",
    explanation:
      "Discretionary spending covers non-essential items like entertainment, unlike necessities such as rent or groceries.",
  },
  {
    id: 14,
    question: "Which expense should be prioritized in a budget?",
    options: [
      { id: "a", text: "Vacation spending" },
      { id: "b", text: "Rent or mortgage" },
      { id: "c", text: "New clothes" },
      { id: "d", text: "Dining out" },
    ],
    correctAnswer: "b",
    explanation:
      "Essential expenses like rent or mortgage payments ensure basic needs are met before discretionary spending.",
  },
  {
    id: 15,
    question: "What is the benefit of automating savings?",
    options: [
      { id: "a", text: "It increases spending" },
      { id: "b", text: "It ensures consistent saving" },
      { id: "c", text: "It avoids tracking expenses" },
      { id: "d", text: "It raises debt levels" },
    ],
    correctAnswer: "b",
    explanation:
      "Automating savings transfers money to savings accounts regularly, building wealth without manual effort.",
  },
  {
    id: 16,
    question: "What does ‘net income’ mean in budgeting?",
    options: [
      { id: "a", text: "Total income before taxes" },
      { id: "b", text: "Income after taxes and deductions" },
      { id: "c", text: "Money spent monthly" },
      { id: "d", text: "Savings only" },
    ],
    correctAnswer: "b",
    explanation:
      "Net income is the money you take home after taxes and deductions, forming the basis of your budget.",
  },
  {
    id: 17,
    question: "Why is it helpful to categorize expenses?",
    options: [
      { id: "a", text: "To confuse your spending habits" },
      { id: "b", text: "To identify areas to cut back" },
      { id: "c", text: "To spend more money" },
      { id: "d", text: "To avoid saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Categorizing expenses helps you see where money goes, making it easier to adjust spending and save.",
  },
  {
    id: 18,
    question: "What is a sinking fund?",
    options: [
      { id: "a", text: "A fund for unexpected emergencies" },
      { id: "b", text: "Savings for a specific planned expense" },
      { id: "c", text: "A type of loan" },
      { id: "d", text: "Money spent on entertainment" },
    ],
    correctAnswer: "b",
    explanation:
      "A sinking fund is savings set aside for a specific future expense, like a vacation or car repair.",
  },
  {
    id: 19,
    question: "Which of these is a sign of overspending?",
    options: [
      { id: "a", text: "Saving 20% of income" },
      { id: "b", text: "Relying on credit cards for bills" },
      { id: "c", text: "Paying bills on time" },
      { id: "d", text: "Building an emergency fund" },
    ],
    correctAnswer: "b",
    explanation:
      "Using credit cards to cover regular expenses indicates spending exceeds income, a key overspending sign.",
  },
  {
    id: 20,
    question: "What is the purpose of a zero-based budget?",
    options: [
      { id: "a", text: "To spend all income without planning" },
      { id: "b", text: "To assign every dollar a purpose" },
      { id: "c", text: "To avoid saving money" },
      { id: "d", text: "To increase debt" },
    ],
    correctAnswer: "b",
    explanation:
      "A zero-based budget allocates every dollar of income to expenses, savings, or debt until nothing remains unassigned.",
  },
  {
    id: 21,
    question: "Which of these is NOT a necessity in a budget?",
    options: [
      { id: "a", text: "Housing" },
      { id: "b", text: "Food" },
      { id: "c", text: "Cable TV" },
      { id: "d", text: "Utilities" },
    ],
    correctAnswer: "c",
    explanation:
      "Cable TV is a discretionary expense, not a necessity like housing, food, or utilities.",
  },
  {
    id: 22,
    question: "What should you do if expenses exceed income?",
    options: [
      { id: "a", text: "Increase spending" },
      { id: "b", text: "Cut back on expenses or increase income" },
      { id: "c", text: "Borrow more money" },
      { id: "d", text: "Ignore the problem" },
    ],
    correctAnswer: "b",
    explanation:
      "Reducing expenses or boosting income restores balance when spending exceeds earnings.",
  },
  {
    id: 23,
    question: "What is a good way to reduce grocery spending?",
    options: [
      { id: "a", text: "Buying only pre-made meals" },
      { id: "b", text: "Planning meals and using a shopping list" },
      { id: "c", text: "Shopping without a budget" },
      { id: "d", text: "Eating out more" },
    ],
    correctAnswer: "b",
    explanation:
      "Meal planning and a shopping list help avoid impulse buys, keeping grocery costs down.",
  },
  {
    id: 24,
    question: "Why is it useful to set a spending limit for wants?",
    options: [
      { id: "a", text: "To increase debt" },
      { id: "b", text: "To prevent overspending on non-essentials" },
      { id: "c", text: "To avoid saving money" },
      { id: "d", text: "To spend all income" },
    ],
    correctAnswer: "b",
    explanation:
      "A limit on wants ensures discretionary spending doesn’t interfere with necessities or savings goals.",
  },
  {
    id: 25,
    question: "What does ‘budget variance’ mean?",
    options: [
      { id: "a", text: "The difference between planned and actual spending" },
      { id: "b", text: "A type of savings account" },
      { id: "c", text: "A fixed expense" },
      { id: "d", text: "Income before taxes" },
    ],
    correctAnswer: "a",
    explanation:
      "Budget variance shows where actual spending deviates from the budget, highlighting areas to adjust.",
  },
  {
    id: 26,
    question: "Which of these is a long-term financial goal?",
    options: [
      { id: "a", text: "Buying a new phone next month" },
      { id: "b", text: "Saving for a child’s college education" },
      { id: "c", text: "Paying this month’s rent" },
      { id: "d", text: "Going on a weekend trip" },
    ],
    correctAnswer: "b",
    explanation:
      "Long-term goals, like saving for college, take several years to achieve, unlike short-term expenses.",
  },
  {
    id: 27,
    question: "What is the benefit of paying bills on time?",
    options: [
      { id: "a", text: "Increasing debt" },
      { id: "b", text: "Avoiding late fees and penalties" },
      { id: "c", text: "Spending more on wants" },
      { id: "d", text: "Reducing savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Timely bill payments prevent extra costs like late fees, keeping your budget on track.",
  },
  {
    id: 28,
    question: "What is a cash flow problem?",
    options: [
      { id: "a", text: "Having too much savings" },
      { id: "b", text: "Spending more cash than you have" },
      { id: "c", text: "Earning a high income" },
      { id: "d", text: "Paying bills early" },
    ],
    correctAnswer: "b",
    explanation:
      "A cash flow problem occurs when outflows exceed inflows, leading to potential financial strain.",
  },
  {
    id: 29,
    question: "Why is it useful to track small daily expenses?",
    options: [
      { id: "a", text: "To spend more on them" },
      { id: "b", text: "To see how they add up over time" },
      { id: "c", text: "To avoid budgeting" },
      { id: "d", text: "To increase debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Small expenses, like coffee, can accumulate significantly, impacting your budget if untracked.",
  },
  {
    id: 30,
    question: "What is the purpose of a debt repayment plan in a budget?",
    options: [
      { id: "a", text: "To increase borrowing" },
      { id: "b", text: "To systematically reduce debt" },
      { id: "c", text: "To avoid saving money" },
      { id: "d", text: "To spend more freely" },
    ],
    correctAnswer: "b",
    explanation:
      "A debt repayment plan allocates funds to pay off debt efficiently, freeing up income over time.",
  },
  {
    id: 31,
    question: "Which of these helps avoid impulse purchases?",
    options: [
      { id: "a", text: "Shopping without a list" },
      { id: "b", text: "Sticking to a budget" },
      { id: "c", text: "Using credit cards only" },
      { id: "d", text: "Ignoring expenses" },
    ],
    correctAnswer: "b",
    explanation:
      "A budget sets spending limits, reducing unplanned purchases that can derail finances.",
  },
  {
    id: 32,
    question: "What is a good strategy for managing irregular income?",
    options: [
      { id: "a", text: "Spending it all immediately" },
      { id: "b", text: "Basing the budget on the lowest expected income" },
      { id: "c", text: "Avoiding savings" },
      { id: "d", text: "Increasing debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Basing a budget on the lowest income ensures essentials are covered, with extra income as a bonus.",
  },
  {
    id: 33,
    question: "What does ‘financial discipline’ mean in budgeting?",
    options: [
      { id: "a", text: "Spending without limits" },
      { id: "b", text: "Sticking to a budget and financial goals" },
      { id: "c", text: "Borrowing frequently" },
      { id: "d", text: "Ignoring expenses" },
    ],
    correctAnswer: "b",
    explanation:
      "Financial discipline involves following a budget and resisting overspending to meet goals.",
  },
  {
    id: 34,
    question: "Which of these is a sign of a healthy budget?",
    options: [
      { id: "a", text: "Spending more than income" },
      { id: "b", text: "Saving a portion of income regularly" },
      { id: "c", text: "Relying on loans for bills" },
      { id: "d", text: "Ignoring debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Regular savings indicate a budget that balances spending and income effectively.",
  },
  {
    id: 35,
    question: "What is the envelope budgeting method?",
    options: [
      { id: "a", text: "Using credit cards for all expenses" },
      { id: "b", text: "Allocating cash to envelopes for different categories" },
      { id: "c", text: "Spending without tracking" },
      { id: "d", text: "Saving all income" },
    ],
    correctAnswer: "b",
    explanation:
      "The envelope method divides cash into categories, limiting spending to what’s in each envelope.",
  },
  {
    id: 36,
    question: "Why is it important to include savings in a budget?",
    options: [
      { id: "a", text: "To spend more later" },
      { id: "b", text: "To prepare for future needs or goals" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To avoid paying bills" },
    ],
    correctAnswer: "b",
    explanation:
      "Savings in a budget build a safety net and fund future plans, like emergencies or big purchases.",
  },
  {
    id: 37,
    question: "What is a common reason budgets fail?",
    options: [
      { id: "a", text: "Setting realistic goals" },
      { id: "b", text: "Lack of commitment or tracking" },
      { id: "c", text: "Saving regularly" },
      { id: "d", text: "Paying bills on time" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgets fail without consistent tracking or commitment, leading to overspending.",
  },
  {
    id: 38,
    question: "What should you do if you overspend in one category?",
    options: [
      { id: "a", text: "Ignore it" },
      { id: "b", text: "Adjust spending in other categories" },
      { id: "c", text: "Borrow more money" },
      { id: "d", text: "Stop budgeting" },
    ],
    correctAnswer: "b",
    explanation:
      "Adjusting other categories helps rebalance the budget after overspending in one area.",
  },
  {
    id: 39,
    question: "What is a benefit of cutting unnecessary subscriptions?",
    options: [
      { id: "a", text: "Increasing debt" },
      { id: "b", text: "Freeing up money for savings or needs" },
      { id: "c", text: "Spending more on wants" },
      { id: "d", text: "Avoiding bill payments" },
    ],
    correctAnswer: "b",
    explanation:
      "Eliminating unused subscriptions boosts available funds for priorities like savings or essentials.",
  },
  {
    id: 40,
    question: "What does ‘income allocation’ mean in budgeting?",
    options: [
      { id: "a", text: "Spending all income randomly" },
      { id: "b", text: "Dividing income into specific categories" },
      { id: "c", text: "Avoiding savings" },
      { id: "d", text: "Increasing debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Income allocation assigns portions of income to expenses, savings, and goals for control.",
  },
  {
    id: 41,
    question: "Which of these is a way to increase income for budgeting?",
    options: [
      { id: "a", text: "Spending more" },
      { id: "b", text: "Taking a side job" },
      { id: "c", text: "Ignoring expenses" },
      { id: "d", text: "Reducing savings" },
    ],
    correctAnswer: "b",
    explanation:
      "A side job adds income, providing more flexibility in your budget for saving or spending.",
  },
  {
    id: 42,
    question: "What is the snowball method for debt repayment?",
    options: [
      { id: "a", text: "Paying off largest debts first" },
      { id: "b", text: "Paying off smallest debts first" },
      { id: "c", text: "Ignoring all debts" },
      { id: "d", text: "Increasing borrowing" },
    ],
    correctAnswer: "b",
    explanation:
      "The snowball method tackles smallest debts first for quick wins, motivating further repayment.",
  },
  {
    id: 43,
    question: "Why is it helpful to budget for irregular expenses?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To avoid financial surprises" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Planning for irregular costs, like car maintenance, prevents unexpected budget disruptions.",
  },
  {
    id: 44,
    question: "What does ‘financial cushion’ refer to?",
    options: [
      { id: "a", text: "Extra spending money" },
      { id: "b", text: "Savings for emergencies" },
      { id: "c", text: "Debt repayment funds" },
      { id: "d", text: "Luxury purchases" },
    ],
    correctAnswer: "b",
    explanation:
      "A financial cushion is savings set aside to handle emergencies without derailing the budget.",
  },
  {
    id: 45,
    question: "What is a good way to stick to a budget?",
    options: [
      { id: "a", text: "Avoiding all planning" },
      { id: "b", text: "Reviewing it weekly" },
      { id: "c", text: "Spending without limits" },
      { id: "d", text: "Ignoring income" },
    ],
    correctAnswer: "b",
    explanation:
      "Weekly reviews keep you accountable and allow adjustments to stay on track.",
  },
  {
    id: 46,
    question: "What is the avalanche method for debt repayment?",
    options: [
      { id: "a", text: "Paying off smallest debts first" },
      { id: "b", text: "Paying off highest interest debts first" },
      { id: "c", text: "Ignoring all debts" },
      { id: "d", text: "Borrowing more money" },
    ],
    correctAnswer: "b",
    explanation:
      "The avalanche method targets high-interest debts first, minimizing total interest paid over time.",
  },
  {
    id: 47,
    question: "Why might a budget need flexibility?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To adapt to unexpected changes" },
      { id: "c", text: "To avoid saving" },
      { id: "d", text: "To increase debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Flexibility allows a budget to handle surprises, like income drops or sudden expenses.",
  },
  {
    id: 48,
    question: "What is a benefit of meal planning in budgeting?",
    options: [
      { id: "a", text: "Increasing dining out costs" },
      { id: "b", text: "Reducing food waste and costs" },
      { id: "c", text: "Spending more on groceries" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Meal planning cuts unnecessary purchases and waste, lowering grocery expenses.",
  },
  {
    id: 49,
    question: "What does ‘budget surplus’ mean?",
    options: [
      { id: "a", text: "Spending more than income" },
      { id: "b", text: "Having money left after expenses" },
      { id: "c", text: "Increasing debt" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "A budget surplus occurs when income exceeds expenses, leaving extra funds for savings or goals.",
  },
  {
    id: 50,
    question: "What is a common discretionary expense?",
    options: [
      { id: "a", text: "Rent" },
      { id: "b", text: "Groceries" },
      { id: "c", text: "Movie tickets" },
      { id: "d", text: "Utilities" },
    ],
    correctAnswer: "c",
    explanation:
      "Discretionary expenses, like movie tickets, are optional, unlike necessities such as rent.",
  },
  {
    id: 51,
    question: "Why is it useful to compare prices before buying?",
    options: [
      { id: "a", text: "To spend more money" },
      { id: "b", text: "To find the best value" },
      { id: "c", text: "To avoid budgeting" },
      { id: "d", text: "To increase debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Comparing prices ensures you get the most for your money, stretching your budget further.",
  },
  {
    id: 52,
    question: "What does ‘financial independence’ mean?",
    options: [
      { id: "a", text: "Relying on loans" },
      { id: "b", text: "Living without needing financial support" },
      { id: "c", text: "Spending all income" },
      { id: "d", text: "Increasing debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Financial independence means covering expenses with your own resources, not relying on others.",
  },
  {
    id: 53,
    question: "What is a good way to handle a financial windfall?",
    options: [
      { id: "a", text: "Spending it all immediately" },
      { id: "b", text: "Saving or investing part of it" },
      { id: "c", text: "Ignoring it" },
      { id: "d", text: "Increasing debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Saving or investing a windfall builds wealth, rather than wasting it on impulsive spending.",
  },
  {
    id: 54,
    question: "Why should you avoid relying on credit cards for daily expenses?",
    options: [
      { id: "a", text: "It builds savings" },
      { id: "b", text: "It can lead to debt accumulation" },
      { id: "c", text: "It reduces spending" },
      { id: "d", text: "It increases income" },
    ],
    correctAnswer: "b",
    explanation:
      "Using credit cards for daily costs can create debt if not paid off, straining your budget.",
  },
  {
    id: 55,
    question: "What is a benefit of setting financial priorities?",
    options: [
      { id: "a", text: "Spending randomly" },
      { id: "b", text: "Focusing on what matters most" },
      { id: "c", text: "Avoiding savings" },
      { id: "d", text: "Increasing debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Priorities guide spending toward key goals, like debt repayment or savings, over less important wants.",
  },
  {
    id: 56,
    question: "What does ‘budget deficit’ mean?",
    options: [
      { id: "a", text: "Having extra money after expenses" },
      { id: "b", text: "Spending more than income" },
      { id: "c", text: "Saving all income" },
      { id: "d", text: "Paying bills early" },
    ],
    correctAnswer: "b",
    explanation:
      "A budget deficit occurs when expenses exceed income, requiring adjustments or borrowing.",
  },
  {
    id: 57,
    question: "What is a good way to reduce utility bills?",
    options: [
      { id: "a", text: "Leaving lights on all day" },
      { id: "b", text: "Using energy-efficient appliances" },
      { id: "c", text: "Increasing usage" },
      { id: "d", text: "Ignoring bills" },
    ],
    correctAnswer: "b",
    explanation:
      "Energy-efficient appliances lower consumption, reducing utility costs in your budget.",
  },
  {
    id: 58,
    question: "Why is it helpful to budget for gifts or holidays?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To avoid overspending during events" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Planning for gifts or holidays prevents unexpected costs from disrupting your budget.",
  },
  {
    id: 59,
    question: "What is a benefit of negotiating bills?",
    options: [
      { id: "a", text: "Increasing expenses" },
      { id: "b", text: "Lowering monthly costs" },
      { id: "c", text: "Spending more on wants" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Negotiating bills, like internet or insurance, reduces fixed expenses, freeing up budget space.",
  },
  {
    id: 60,
    question: "What does ‘opportunity cost’ mean in budgeting?",
    options: [
      { id: "a", text: "The cost of saving money" },
      { id: "b", text: "What you give up by choosing one expense over another" },
      { id: "c", text: "Extra income" },
      { id: "d", text: "A type of debt" },
    ],
    correctAnswer: "b",
    explanation:
      "Opportunity cost is the trade-off, like skipping savings to buy something now.",
  },
  {
    id: 61,
    question: "What is a good way to budget for a big purchase?",
    options: [
      { id: "a", text: "Using all your savings at once" },
      { id: "b", text: "Saving a little each month" },
      { id: "c", text: "Borrowing the full amount" },
      { id: "d", text: "Ignoring the cost" },
    ],
    correctAnswer: "b",
    explanation:
      "Gradual savings for a big purchase avoids debt and keeps your budget intact.",
  },
  {
    id: 62,
    question: "Why is it useful to have a buffer in your budget?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To cover unexpected small costs" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To avoid saving" },
    ],
    correctAnswer: "b",
    explanation:
      "A buffer handles minor surprises, like a small repair, without affecting other categories.",
  },
  {
    id: 63,
    question: "What is a benefit of using cash instead of credit?",
    options: [
      { id: "a", text: "Increasing debt" },
      { id: "b", text: "Limiting spending to what you have" },
      { id: "c", text: "Spending more freely" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Cash restricts spending to available funds, preventing debt from credit overuse.",
  },
  {
    id: 64,
    question: "What does ‘financial security’ mean?",
    options: [
      { id: "a", text: "Spending all income" },
      { id: "b", text: "Having enough savings and income stability" },
      { id: "c", text: "Increasing debt" },
      { id: "d", text: "Avoiding budgeting" },
    ],
    correctAnswer: "b",
    explanation:
      "Financial security comes from savings and steady income, reducing financial stress.",
  },
  {
    id: 65,
    question: "What is a good way to budget with a partner?",
    options: [
      { id: "a", text: "Keeping finances separate" },
      { id: "b", text: "Agreeing on shared goals and tracking together" },
      { id: "c", text: "Spending without discussion" },
      { id: "d", text: "Ignoring expenses" },
    ],
    correctAnswer: "b",
    explanation:
      "Shared goals and tracking align spending, fostering teamwork in budgeting.",
  },
  {
    id: 66,
    question: "Why is it useful to budget for taxes?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To avoid tax-time shortages" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for taxes ensures funds are ready, preventing last-minute financial strain.",
  },
  {
    id: 67,
    question: "What is a benefit of reducing dining out?",
    options: [
      { id: "a", text: "Increasing expenses" },
      { id: "b", text: "Saving money for other goals" },
      { id: "c", text: "Spending more on wants" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Cutting dining out frees up funds for savings or necessities, improving budget health.",
  },
  {
    id: 68,
    question: "What does ‘fixed income’ mean in budgeting?",
    options: [
      { id: "a", text: "Income that varies monthly" },
      { id: "b", text: "Consistent income, like a salary" },
      { id: "c", text: "Spending money" },
      { id: "d", text: "Debt repayment funds" },
    ],
    correctAnswer: "b",
    explanation:
      "Fixed income, like a salary, is predictable, making budgeting easier.",
  },
  {
    id: 69,
    question: "What is a good way to handle seasonal expenses?",
    options: [
      { id: "a", text: "Ignoring them" },
      { id: "b", text: "Saving monthly for them" },
      { id: "c", text: "Borrowing money" },
      { id: "d", text: "Spending all income" },
    ],
    correctAnswer: "b",
    explanation:
      "Saving monthly for seasonal costs, like holidays, spreads the expense evenly.",
  },
  {
    id: 70,
    question: "Why is it helpful to budget for self-care?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To maintain well-being without overspending" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for self-care ensures well-being while keeping spending in check.",
  },
  {
    id: 71,
    question: "What is a benefit of reviewing past spending?",
    options: [
      { id: "a", text: "Increasing debt" },
      { id: "b", text: "Identifying patterns to improve" },
      { id: "c", text: "Spending more freely" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Reviewing past spending highlights habits, helping refine future budgets.",
  },
  {
    id: 72,
    question: "What does ‘cost of living’ mean?",
    options: [
      { id: "a", text: "The cost of luxury items" },
      { id: "b", text: "Expenses for basic needs in an area" },
      { id: "c", text: "Extra savings" },
      { id: "d", text: "Debt repayment" },
    ],
    correctAnswer: "b",
    explanation:
      "Cost of living covers essentials like housing and food, varying by location.",
  },
  {
    id: 73,
    question: "What is a good way to budget for a vacation?",
    options: [
      { id: "a", text: "Spending all savings" },
      { id: "b", text: "Setting aside money monthly" },
      { id: "c", text: "Borrowing the full cost" },
      { id: "d", text: "Ignoring the expense" },
    ],
    correctAnswer: "b",
    explanation:
      "Monthly savings for a vacation avoids debt and keeps your budget balanced.",
  },
  {
    id: 74,
    question: "Why is it useful to budget for charity or giving?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To give without financial strain" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for giving ensures generosity fits within your financial plan.",
  },
  {
    id: 75,
    question: "What is a benefit of avoiding lifestyle inflation?",
    options: [
      { id: "a", text: "Spending more as income rises" },
      { id: "b", text: "Saving more as income increases" },
      { id: "c", text: "Increasing debt" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Avoiding lifestyle inflation keeps spending steady, boosting savings as income grows.",
  },
  {
    id: 76,
    question: "What does ‘gross income’ mean?",
    options: [
      { id: "a", text: "Income after taxes" },
      { id: "b", text: "Total income before deductions" },
      { id: "c", text: "Savings only" },
      { id: "d", text: "Spending money" },
    ],
    correctAnswer: "b",
    explanation:
      "Gross income is your total earnings before taxes and deductions are subtracted.",
  },
  {
    id: 77,
    question: "What is a good way to budget for car maintenance?",
    options: [
      { id: "a", text: "Ignoring repairs" },
      { id: "b", text: "Saving a small amount monthly" },
      { id: "c", text: "Borrowing for repairs" },
      { id: "d", text: "Spending all income" },
    ],
    correctAnswer: "b",
    explanation:
      "Monthly savings for maintenance covers costs without disrupting your budget.",
  },
  {
    id: 78,
    question: "Why is it helpful to budget for insurance?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To ensure coverage without strain" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for insurance keeps you protected without unexpected financial pressure.",
  },
  {
    id: 79,
    question: "What is a benefit of reducing entertainment costs?",
    options: [
      { id: "a", text: "Increasing debt" },
      { id: "b", text: "Freeing up money for savings" },
      { id: "c", text: "Spending more on wants" },
      { id: "d", text: "Avoiding budgeting" },
    ],
    correctAnswer: "b",
    explanation:
      "Cutting entertainment costs redirects funds to savings or other priorities.",
  },
  {
    id: 80,
    question: "What does ‘financial literacy’ mean?",
    options: [
      { id: "a", text: "Spending without planning" },
      { id: "b", text: "Understanding money management" },
      { id: "c", text: "Increasing debt" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Financial literacy is knowledge of budgeting, saving, and managing finances effectively.",
  },
  {
    id: 81,
    question: "What is a good way to budget for pets?",
    options: [
      { id: "a", text: "Ignoring pet costs" },
      { id: "b", text: "Setting aside money for food and vet bills" },
      { id: "c", text: "Borrowing for pet expenses" },
      { id: "d", text: "Spending all income" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for pets ensures their care doesn’t strain your finances.",
  },
  {
    id: 82,
    question: "Why is it useful to budget for subscriptions?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To track and control recurring costs" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for subscriptions prevents unnoticed costs from adding up.",
  },
  {
    id: 83,
    question: "What is a benefit of buying in bulk?",
    options: [
      { id: "a", text: "Increasing waste" },
      { id: "b", text: "Reducing per-unit costs" },
      { id: "c", text: "Spending more overall" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Buying in bulk lowers costs per item, stretching your budget further.",
  },
  {
    id: 84,
    question: "What does ‘debt-to-income ratio’ measure?",
    options: [
      { id: "a", text: "Savings rate" },
      { id: "b", text: "Debt payments relative to income" },
      { id: "c", text: "Spending on wants" },
      { id: "d", text: "Extra income" },
    ],
    correctAnswer: "b",
    explanation:
      "Debt-to-income ratio shows how much of your income goes to debt, affecting budget health.",
  },
  {
    id: 85,
    question: "What is a good way to budget for clothing?",
    options: [
      { id: "a", text: "Buying everything new" },
      { id: "b", text: "Saving for seasonal needs" },
      { id: "c", text: "Borrowing for clothes" },
      { id: "d", text: "Ignoring costs" },
    ],
    correctAnswer: "b",
    explanation:
      "Saving for clothing needs avoids impulse buys and keeps spending planned.",
  },
  {
    id: 86,
    question: "Why is it helpful to budget for education?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To invest in skills without debt" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for education supports growth while avoiding financial strain.",
  },
  {
    id: 87,
    question: "What is a benefit of avoiding unnecessary upgrades?",
    options: [
      { id: "a", text: "Increasing expenses" },
      { id: "b", text: "Keeping more money for savings" },
      { id: "c", text: "Spending more on wants" },
      { id: "d", text: "Avoiding budgeting" },
    ],
    correctAnswer: "b",
    explanation:
      "Skipping upgrades, like a new phone, preserves funds for savings or needs.",
  },
  {
    id: 88,
    question: "What does ‘disposable income’ mean?",
    options: [
      { id: "a", text: "Income before taxes" },
      { id: "b", text: "Money left after essentials" },
      { id: "c", text: "Debt repayment funds" },
      { id: "d", text: "Fixed expenses" },
    ],
    correctAnswer: "b",
    explanation:
      "Disposable income is what remains after necessities, available for wants or savings.",
  },
  {
    id: 89,
    question: "What is a good way to budget for hobbies?",
    options: [
      { id: "a", text: "Spending all income" },
      { id: "b", text: "Allocating a set amount monthly" },
      { id: "c", text: "Borrowing for hobbies" },
      { id: "d", text: "Ignoring costs" },
    ],
    correctAnswer: "b",
    explanation:
      "A set hobby budget allows enjoyment without overspending.",
  },
  {
    id: 90,
    question: "Why is it useful to budget for transportation?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To cover costs like gas or fares" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for transportation ensures mobility without unexpected financial hits.",
  },
  {
    id: 91,
    question: "What is a benefit of using coupons?",
    options: [
      { id: "a", text: "Increasing spending" },
      { id: "b", text: "Lowering purchase costs" },
      { id: "c", text: "Spending more on wants" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Coupons reduce costs, allowing more budget room for other priorities.",
  },
  {
    id: 92,
    question: "What does ‘financial stress’ mean?",
    options: [
      { id: "a", text: "Having extra savings" },
      { id: "b", text: "Worry over money issues" },
      { id: "c", text: "Earning a high income" },
      { id: "d", text: "Paying bills early" },
    ],
    correctAnswer: "b",
    explanation:
      "Financial stress arises from money struggles, often eased by good budgeting.",
  },
  {
    id: 93,
    question: "What is a good way to budget for healthcare?",
    options: [
      { id: "a", text: "Ignoring medical costs" },
      { id: "b", text: "Saving for routine and unexpected care" },
      { id: "c", text: "Borrowing for doctor visits" },
      { id: "d", text: "Spending all income" },
    ],
    correctAnswer: "b",
    explanation:
      "Saving for healthcare covers costs without disrupting your budget.",
  },
  {
    id: 94,
    question: "Why is it helpful to budget for home maintenance?",
    options: [
      { id: "a", text: "To spend more freely" },
      { id: "b", text: "To handle repairs without debt" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for maintenance avoids surprise costs, keeping your finances stable.",
  },
  {
    id: 95,
    question: "What is a benefit of avoiding overdraft fees?",
    options: [
      { id: "a", text: "Increasing debt" },
      { id: "b", text: "Keeping more money in your account" },
      { id: "c", text: "Spending more freely" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Avoiding overdraft fees preserves funds for budgeted priorities.",
  },
  {
    id: 96,
    question: "What does ‘budget adjustment’ mean?",
    options: [
      { id: "a", text: "Spending without limits" },
      { id: "b", text: "Changing the budget to fit new circumstances" },
      { id: "c", text: "Increasing debt" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Adjusting a budget aligns it with changes, like income shifts or new expenses.",
  },
  {
    id: 97,
    question: "What is a good way to budget for gifts?",
    options: [
      { id: "a", text: "Spending all savings" },
      { id: "b", text: "Saving a little each month" },
      { id: "c", text: "Borrowing for presents" },
      { id: "d", text: "Ignoring costs" },
    ],
    correctAnswer: "b",
    explanation:
      "Monthly savings for gifts prevents overspending during gift-giving times.",
  },
  {
    id: 98,
    question: "Why is it useful to budget for retirement?",
    options: [
      { id: "a", text: "To spend more now" },
      { id: "b", text: "To ensure future financial stability" },
      { id: "c", text: "To increase debt" },
      { id: "d", text: "To stop saving" },
    ],
    correctAnswer: "b",
    explanation:
      "Budgeting for retirement builds long-term security without current strain.",
  },
  {
    id: 99,
    question: "What is a benefit of tracking recurring expenses?",
    options: [
      { id: "a", text: "Increasing debt" },
      { id: "b", text: "Spotting areas to cut costs" },
      { id: "c", text: "Spending more freely" },
      { id: "d", text: "Avoiding savings" },
    ],
    correctAnswer: "b",
    explanation:
      "Tracking recurring costs reveals savings opportunities, improving budget efficiency.",
  },
  {
    id: 100,
    question: "What does ‘financial freedom’ mean?",
    options: [
      { id: "a", text: "Living paycheck to paycheck" },
      { id: "b", text: "Having control over your finances" },
      { id: "c", text: "Increasing debt" },
      { id: "d", text: "Spending without limits" },
    ],
    correctAnswer: "b",
    explanation:
      "Financial freedom means managing money to live comfortably and meet goals.",
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
  useEffect(() => {  // Changed from useState to useEffect
    let interval
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)  // Changed to use prev state
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
            <h2 className="text-3xl font-bold tracking-tight">Budgeting Basics Quiz</h2>
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
              <CardTitle>Budgeting Basics Quiz</CardTitle>
              <CardDescription>Test your knowledge about budgeting principles</CardDescription>
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
                  This quiz covers budgeting principles, expense tracking, saving strategies, and financial planning.
                  It's designed to test your knowledge after completing the Budgeting Basics simulation.
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
                  <CardDescription>Budgeting Basics</CardDescription>
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
                    <span>The 50/30/20 rule is a simple framework for budgeting your income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>Emergency funds are crucial for financial security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>Tracking expenses is essential for successful budgeting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>Different budgeting methods work for different people - find what works for you</span>
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
