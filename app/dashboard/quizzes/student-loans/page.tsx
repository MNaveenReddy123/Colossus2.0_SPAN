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

// Student Loan Management Questions
const questions = [
  {
    id: 1,
    question: "What is the primary purpose of an income-driven repayment plan?",
    options: [
      { id: "a", text: "To pay off loans faster" },
      { id: "b", text: "To lower monthly payments based on income" },
      { id: "c", text: "To increase interest rates" },
      { id: "d", text: "To eliminate all debt immediately" },
    ],
    correctAnswer: "b",
    explanation:
      "Income-driven repayment plans adjust monthly payments based on your income and family size, making them more affordable.",
  },
  {
    id: 2,
    question: "What is a subsidized federal student loan?",
    options: [
      { id: "a", text: "A loan with no repayment required" },
      { id: "b", text: "A loan where the government pays interest while in school" },
      { id: "c", text: "A loan with the highest interest rate" },
      { id: "d", text: "A loan only for graduate students" },
    ],
    correctAnswer: "b",
    explanation:
      "Subsidized loans accrue no interest while you're in school at least half-time, as the government covers it.",
  },
  {
    id: 3,
    question: "What does 'loan consolidation' mean for student loans?",
    options: [
      { id: "a", text: "Combining multiple loans into one with a single payment" },
      { id: "b", text: "Increasing the loan balance" },
      { id: "c", text: "Eliminating all loans" },
      { id: "d", text: "Splitting a loan into multiple payments" },
    ],
    correctAnswer: "a",
    explanation:
      "Consolidation combines multiple federal loans into one, simplifying payments but possibly extending the term.",
  },
  {
    id: 4,
    question: "What is the benefit of making payments during the grace period?",
    options: [
      { id: "a", text: "It increases your loan balance" },
      { id: "b", text: "It reduces interest accrual and principal" },
      { id: "c", text: "It delays repayment" },
      { id: "d", text: "It eliminates the loan" },
    ],
    correctAnswer: "b",
    explanation:
      "Paying during the grace period reduces the principal before interest capitalizes, saving money over time.",
  },
  {
    id: 5,
    question: "What is Public Service Loan Forgiveness (PSLF)?",
    options: [
      { id: "a", text: "A program to increase loan interest" },
      { id: "b", text: "A program forgiving loans after 120 qualifying payments" },
      { id: "c", text: "A private loan refinancing option" },
      { id: "d", text: "A repayment plan for all borrowers" },
    ],
    correctAnswer: "b",
    explanation:
      "PSLF forgives remaining federal loan balances for public sector workers after 120 qualifying payments.",
  },
  {
    id: 6,
    question: "What happens if you miss a student loan payment?",
    options: [
      { id: "a", text: "Your loan is automatically forgiven" },
      { id: "b", text: "You may incur late fees and damage your credit" },
      { id: "c", text: "Your interest rate decreases" },
      { id: "d", text: "Your loan term is shortened" },
    ],
    correctAnswer: "b",
    explanation:
      "Missing payments can lead to penalties, credit score damage, and potential default if prolonged.",
  },
  {
    id: 7,
    question: "What is loan deferment?",
    options: [
      { id: "a", text: "Permanent cancellation of a loan" },
      { id: "b", text: "Temporary pause on loan payments" },
      { id: "c", text: "Doubling the loan balance" },
      { id: "d", text: "Switching to a private lender" },
    ],
    correctAnswer: "b",
    explanation:
      "Deferment pauses payments for specific reasons, like school or hardship, but interest may accrue on unsubsidized loans.",
  },
  {
    id: 8,
    question: "What is the standard repayment plan for federal student loans?",
    options: [
      { id: "a", text: "Payments that increase over time" },
      { id: "b", text: "Fixed payments over 10 years" },
      { id: "c", text: "Payments based on income" },
      { id: "d", text: "No payments until retirement" },
    ],
    correctAnswer: "b",
    explanation:
      "The standard plan involves equal monthly payments over 10 years to pay off the loan efficiently.",
  },
  {
    id: 9,
    question: "Why might someone refinance a student loan?",
    options: [
      { id: "a", text: "To increase their interest rate" },
      { id: "b", text: "To secure a lower interest rate or better terms" },
      { id: "c", text: "To lose federal loan benefits" },
      { id: "d", text: "To avoid repayment" },
    ],
    correctAnswer: "b",
    explanation:
      "Refinancing can lower rates or adjust terms, but federal loans lose benefits like forgiveness when refinanced.",
  },
  {
    id: 10,
    question: "What is capitalization of interest on a student loan?",
    options: [
      { id: "a", text: "Reducing the loan balance" },
      { id: "b", text: "Adding unpaid interest to the principal" },
      { id: "c", text: "Eliminating interest" },
      { id: "d", text: "Paying off the loan early" },
    ],
    correctAnswer: "b",
    explanation:
      "Capitalization adds accrued interest to the principal, increasing the total amount you owe.",
  },
  {
    id: 11,
    question: "What is a private student loan?",
    options: [
      { id: "a", text: "A loan offered by the federal government" },
      { id: "b", text: "A loan from a bank or private lender" },
      { id: "c", text: "A loan with no interest" },
      { id: "d", text: "A loan automatically forgiven" },
    ],
    correctAnswer: "b",
    explanation:
      "Private loans come from non-government lenders and often have fewer protections than federal loans.",
  },
  {
    id: 12,
    question: "What is the purpose of a loan servicer?",
    options: [
      { id: "a", text: "To originate new loans" },
      { id: "b", text: "To manage payments and borrower accounts" },
      { id: "c", text: "To cancel loans" },
      { id: "d", text: "To increase interest rates" },
    ],
    correctAnswer: "b",
    explanation:
      "Loan servicers handle billing, payments, and customer service for student loans.",
  },
  {
    id: 13,
    question: "What does 'forbearance' mean for student loans?",
    options: [
      { id: "a", text: "Permanent loan forgiveness" },
      { id: "b", text: "Temporary relief from payments with interest accrual" },
      { id: "c", text: "Doubling monthly payments" },
      { id: "d", text: "Switching to a new loan type" },
    ],
    correctAnswer: "b",
    explanation:
      "Forbearance pauses or reduces payments temporarily, but interest continues to accrue, increasing debt.",
  },
  {
    id: 14,
    question: "What is the benefit of autopay for student loans?",
    options: [
      { id: "a", text: "It eliminates the loan balance" },
      { id: "b", text: "It may offer an interest rate discount" },
      { id: "c", text: "It increases your payments" },
      { id: "d", text: "It delays repayment" },
    ],
    correctAnswer: "b",
    explanation:
      "Autopay ensures timely payments and often includes a small rate discount, saving money.",
  },
  {
    id: 15,
    question: "What is a Parent PLUS Loan?",
    options: [
      { id: "a", text: "A loan for graduate students" },
      { id: "b", text: "A federal loan for parents to help pay for a child's education" },
      { id: "c", text: "A private loan with no interest" },
      { id: "d", text: "A loan for teachers" },
    ],
    correctAnswer: "b",
    explanation:
      "Parent PLUS Loans allow parents to borrow for their child's undergraduate education, with federal terms.",
  },
  {
    id: 16,
    question: "What is the main risk of defaulting on a student loan?",
    options: [
      { id: "a", text: "Lower interest rates" },
      { id: "b", text: "Wage garnishment and credit damage" },
      { id: "c", text: "Loan forgiveness" },
      { id: "d", text: "Increased loan term" },
    ],
    correctAnswer: "b",
    explanation:
      "Defaulting can lead to severe consequences like wage garnishment, collections, and long-term credit harm.",
  },
  {
    id: 17,
    question: "What is the extended repayment plan for federal loans?",
    options: [
      { id: "a", text: "Payments over 5 years" },
      { id: "b", text: "Payments stretched up to 30 years" },
      { id: "c", text: "Payments based on income only" },
      { id: "d", text: "No payments required" },
    ],
    correctAnswer: "b",
    explanation:
      "The extended plan lengthens repayment to up to 30 years, lowering monthly payments but increasing total interest.",
  },
  {
    id: 18,
    question: "What does 'loan forgiveness' mean?",
    options: [
      { id: "a", text: "Increasing the loan balance" },
      { id: "b", text: "Cancelling part or all of a loan balance" },
      { id: "c", text: "Doubling monthly payments" },
      { id: "d", text: "Switching to private loans" },
    ],
    correctAnswer: "b",
    explanation:
      "Loan forgiveness cancels remaining debt under specific programs, like PSLF, after meeting requirements.",
  },
  {
    id: 19,
    question: "What is the graduated repayment plan?",
    options: [
      { id: "a", text: "Fixed payments for 10 years" },
      { id: "b", text: "Payments that start low and increase over time" },
      { id: "c", text: "Payments based on income" },
      { id: "d", text: "No payments until retirement" },
    ],
    correctAnswer: "b",
    explanation:
      "Graduated plans start with lower payments that rise every two years, assuming income growth.",
  },
  {
    id: 20,
    question: "Why is a budget important for student loan repayment?",
    options: [
      { id: "a", text: "It increases your loan balance" },
      { id: "b", text: "It helps prioritize payments and manage expenses" },
      { id: "c", text: "It delays repayment" },
      { id: "d", text: "It eliminates interest" },
    ],
    correctAnswer: "b",
    explanation:
      "A budget ensures you allocate funds for loan payments while covering other financial needs.",
  },
  {
    id: 21,
    question: "What is an unsubsidized federal student loan?",
    options: [
      { id: "a", text: "A loan with no interest" },
      { id: "b", text: "A loan where interest accrues during school" },
      { id: "c", text: "A loan only for parents" },
      { id: "d", text: "A loan automatically forgiven" },
    ],
    correctAnswer: "b",
    explanation:
      "Unsubsidized loans accrue interest from disbursement, increasing the balance if unpaid.",
  },
  {
    id: 22,
    question: "What is the purpose of the FAFSA for student loans?",
    options: [
      { id: "a", text: "To repay loans" },
      { id: "b", text: "To determine eligibility for federal aid" },
      { id: "c", text: "To increase loan interest" },
      { id: "d", text: "To cancel loans" },
    ],
    correctAnswer: "b",
    explanation:
      "The FAFSA assesses financial need to qualify students for federal loans, grants, and other aid.",
  },
  {
    id: 23,
    question: "What is a cosigner for a student loan?",
    options: [
      { id: "a", text: "Someone who pays off the loan" },
      { id: "b", text: "Someone who shares responsibility for repayment" },
      { id: "c", text: "A loan servicer" },
      { id: "d", text: "A government official" },
    ],
    correctAnswer: "b",
    explanation:
      "A cosigner agrees to repay the loan if the borrower fails to, often required for private loans.",
  },
  {
    id: 24,
    question: "What is the benefit of paying more than the minimum payment?",
    options: [
      { id: "a", text: "It increases interest rates" },
      { id: "b", text: "It reduces the loan term and total interest" },
      { id: "c", text: "It delays repayment" },
      { id: "d", text: "It adds fees" },
    ],
    correctAnswer: "b",
    explanation:
      "Extra payments reduce the principal faster, shortening the loan term and saving on interest.",
  },
  {
    id: 25,
    question: "What is a variable interest rate on a student loan?",
    options: [
      { id: "a", text: "A rate that never changes" },
      { id: "b", text: "A rate that fluctuates with market conditions" },
      { id: "c", text: "A rate with no interest" },
      { id: "d", text: "A rate only for federal loans" },
    ],
    correctAnswer: "b",
    explanation:
      "Variable rates change over time, potentially increasing or decreasing payments, common in private loans.",
  },
  {
    id: 26,
    question: "What is the main goal of the Teacher Loan Forgiveness program?",
    options: [
      { id: "a", text: "To increase loan balances" },
      { id: "b", text: "To forgive loans for teachers in low-income schools" },
      { id: "c", text: "To refinance private loans" },
      { id: "d", text: "To delay payments" },
    ],
    correctAnswer: "b",
    explanation:
      "This program forgives up to $17,500 for teachers who work in qualifying low-income schools for five years.",
  },
  {
    id: 27,
    question: "What does 'loan rehabilitation' mean for defaulted loans?",
    options: [
      { id: "a", text: "Increasing the loan balance" },
      { id: "b", text: "Restoring good standing through consistent payments" },
      { id: "c", text: "Canceling the loan" },
      { id: "d", text: "Switching to private loans" },
    ],
    correctAnswer: "b",
    explanation:
      "Rehabilitation involves making nine on-time payments to remove default status and restore benefits.",
  },
  {
    id: 28,
    question: "What is a fixed interest rate on a student loan?",
    options: [
      { id: "a", text: "A rate that changes monthly" },
      { id: "b", text: "A rate that stays the same throughout the loan" },
      { id: "c", text: "A rate with no interest" },
      { id: "d", text: "A rate only for private loans" },
    ],
    correctAnswer: "b",
    explanation:
      "Fixed rates remain constant, providing predictable payments, common in federal loans.",
  },
  {
    id: 29,
    question: "What is the purpose of a loan repayment calculator?",
    options: [
      { id: "a", text: "To increase interest rates" },
      { id: "b", text: "To estimate monthly payments and total interest" },
      { id: "c", text: "To cancel loans" },
      { id: "d", text: "To borrow more money" },
    ],
    correctAnswer: "b",
    explanation:
      "A calculator helps borrowers plan by showing payment amounts and interest over different terms.",
  },
  {
    id: 30,
    question: "What is the main risk of private student loans?",
    options: [
      { id: "a", text: "They have no interest" },
      { id: "b", text: "They lack federal protections like forgiveness" },
      { id: "c", text: "They are automatically forgiven" },
      { id: "d", text: "They have fixed rates only" },
    ],
    correctAnswer: "b",
    explanation:
      "Private loans often lack income-driven plans or forgiveness, increasing financial risk.",
  },
  {
    id: 31,
    question: "What is the grace period for most federal student loans?",
    options: [
      { id: "a", text: "One month after graduation" },
      { id: "b", text: "Six months after leaving school" },
      { id: "c", text: "One year after borrowing" },
      { id: "d", text: "No grace period" },
    ],
    correctAnswer: "b",
    explanation:
      "Most federal loans offer a six-month grace period before repayment begins, except for PLUS loans.",
  },
  {
    id: 32,
    question: "What is a master promissory note (MPN)?",
    options: [
      { id: "a", text: "A repayment plan" },
      { id: "b", text: "A legal agreement to repay a federal loan" },
      { id: "c", text: "A forgiveness application" },
      { id: "d", text: "A private loan contract" },
    ],
    correctAnswer: "b",
    explanation:
      "The MPN is a binding contract outlining the terms and conditions of federal loan repayment.",
  },
  {
    id: 33,
    question: "Why might someone choose a shorter loan term?",
    options: [
      { id: "a", text: "To pay more interest" },
      { id: "b", text: "To pay off the loan faster and save on interest" },
      { id: "c", text: "To increase monthly payments" },
      { id: "d", text: "To delay repayment" },
    ],
    correctAnswer: "b",
    explanation:
      "A shorter term means higher payments but less total interest and faster debt freedom.",
  },
  {
    id: 34,
    question: "What is the Income-Based Repayment (IBR) plan?",
    options: [
      { id: "a", text: "A plan with fixed payments for 5 years" },
      { id: "b", text: "A plan capping payments at a percentage of income" },
      { id: "c", text: "A plan for private loans only" },
      { id: "d", text: "A plan with no payments" },
    ],
    correctAnswer: "b",
    explanation:
      "IBR limits payments to 10-15% of discretionary income and offers forgiveness after 20-25 years.",
  },
  {
    id: 35,
    question: "What is the benefit of tracking your loan balance?",
    options: [
      { id: "a", text: "It increases interest" },
      { id: "b", text: "It helps you stay informed and plan payments" },
      { id: "c", text: "It cancels the loan" },
      { id: "d", text: "It delays repayment" },
    ],
    correctAnswer: "b",
    explanation:
      "Monitoring your balance ensures you understand your progress and can adjust strategies.",
  },
  {
    id: 36,
    question: "What is a Perkins Loan?",
    options: [
      { id: "a", text: "A private loan with high interest" },
      { id: "b", text: "A federal loan for students with exceptional need" },
      { id: "c", text: "A loan for parents only" },
      { id: "d", text: "A loan with no repayment" },
    ],
    correctAnswer: "b",
    explanation:
      "Perkins Loans were low-interest federal loans for students with high financial need, now discontinued.",
  },
  {
    id: 37,
    question: "What is the purpose of entrance counseling for federal loans?",
    options: [
      { id: "a", text: "To increase loan amounts" },
      { id: "b", text: "To educate borrowers on loan responsibilities" },
      { id: "c", text: "To cancel loans" },
      { id: "d", text: "To refinance loans" },
    ],
    correctAnswer: "b",
    explanation:
      "Entrance counseling informs first-time borrowers about loan terms, repayment, and rights.",
  },
  {
    id: 38,
    question: "What does 'delinquency' mean for a student loan?",
    options: [
      { id: "a", text: "Paying off the loan early" },
      { id: "b", text: "Missing one or more payments" },
      { id: "c", text: "Reducing the loan balance" },
      { id: "d", text: "Increasing interest rates" },
    ],
    correctAnswer: "b",
    explanation:
      "Delinquency occurs when payments are late, risking fees and credit score damage.",
  },
  {
    id: 39,
    question: "What is the Pay As You Earn (PAYE) repayment plan?",
    options: [
      { id: "a", text: "A plan with fixed payments for 10 years" },
      { id: "b", text: "A plan capping payments at 10% of discretionary income" },
      { id: "c", text: "A plan for private loans only" },
      { id: "d", text: "A plan with no payments" },
    ],
    correctAnswer: "b",
    explanation:
      "PAYE limits payments to 10% of discretionary income and offers forgiveness after 20 years.",
  },
  {
    id: 40,
    question: "Why avoid paying only the interest on a loan?",
    options: [
      { id: "a", text: "It reduces the principal" },
      { id: "b", text: "It doesn't reduce the principal, extending debt" },
      { id: "c", text: "It cancels the loan" },
      { id: "d", text: "It lowers interest rates" },
    ],
    correctAnswer: "b",
    explanation:
      "Interest-only payments keep the principal unchanged, prolonging repayment and increasing total costs.",
  },
  {
    id: 41,
    question: "What is the Revised Pay As You Earn (REPAYE) plan?",
    options: [
      { id: "a", text: "A plan with fixed payments for 5 years" },
      { id: "b", text: "A plan adjusting payments based on income" },
      { id: "c", text: "A plan for private loans only" },
      { id: "d", text: "A plan with no payments" },
    ],
    correctAnswer: "b",
    explanation:
      "REPAYE caps payments at 10% of discretionary income and offers forgiveness after 20-25 years.",
  },
  {
    id: 42,
    question: "What is the benefit of federal student loans over private loans?",
    options: [
      { id: "a", text: "Higher interest rates" },
      { id: "b", text: "Access to forgiveness and income-driven plans" },
      { id: "c", text: "No repayment required" },
      { id: "d", text: "Variable rates only" },
    ],
    correctAnswer: "b",
    explanation:
      "Federal loans offer protections like forgiveness, deferment, and income-driven repayment unavailable in most private loans.",
  },
  {
    id: 43,
    question: "What is a loan term?",
    options: [
      { id: "a", text: "The interest rate of the loan" },
      { id: "b", text: "The length of time to repay the loan" },
      { id: "c", text: "The loan's principal amount" },
      { id: "d", text: "The loan's forgiveness amount" },
    ],
    correctAnswer: "b",
    explanation:
      "The loan term is the duration over which the borrower must repay the loan, affecting monthly payments.",
  },
  {
    id: 44,
    question: "What is the purpose of exit counseling for federal loans?",
    options: [
      { id: "a", text: "To increase loan amounts" },
      { id: "b", text: "To prepare borrowers for repayment obligations" },
      { id: "c", text: "To cancel loans" },
      { id: "d", text: "To refinance loans" },
    ],
    correctAnswer: "b",
    explanation:
      "Exit counseling educates borrowers on repayment plans, options, and responsibilities before leaving school.",
  },
  {
    id: 45,
    question: "What is a disbursement fee on a student loan?",
    options: [
      { id: "a", text: "A fee that reduces the principal" },
      { id: "b", text: "A fee charged when the loan is issued" },
      { id: "c", text: "A fee for early repayment" },
      { id: "d", text: "A fee for loan forgiveness" },
    ],
    correctAnswer: "b",
    explanation:
      "Disbursement fees, or origination fees, are charged upfront by lenders, reducing the loan amount received.",
  },
  {
    id: 46,
    question: "What is the benefit of a side hustle for loan repayment?",
    options: [
      { id: "a", text: "It increases interest rates" },
      { id: "b", text: "It provides extra income to pay loans faster" },
      { id: "c", text: "It delays repayment" },
      { id: "d", text: "It cancels the loan" },
    ],
    correctAnswer: "b",
    explanation:
      "A side hustle generates additional funds to make larger payments, reducing the loan term and interest.",
  },
  {
    id: 47,
    question: "What does 'amortization' mean for a student loan?",
    options: [
      { id: "a", text: "Canceling the loan" },
      { id: "b", text: "The process of paying off a loan over time" },
      { id: "c", text: "Increasing the interest rate" },
      { id: "d", text: "Pausing payments" },
    ],
    correctAnswer: "b",
    explanation:
      "Amortization spreads payments over time, covering both principal and interest until the loan is paid off.",
  },
  {
    id: 48,
    question: "What is a credit score's role in private student loans?",
    options: [
      { id: "a", text: "It has no impact" },
      { id: "b", text: "It affects loan approval and interest rates" },
      { id: "c", text: "It cancels the loan" },
      { id: "d", text: "It guarantees approval" },
    ],
    correctAnswer: "b",
    explanation:
      "A higher credit score can secure better rates and terms, while a low score may lead to higher costs.",
  },
  {
    id: 49,
    question: "What is the benefit of loan forgiveness programs?",
    options: [
      { id: "a", text: "They increase loan balances" },
      { id: "b", text: "They reduce or eliminate debt for qualifying borrowers" },
      { id: "c", text: "They raise interest rates" },
      { id: "d", text: "They delay repayment" },
    ],
    correctAnswer: "b",
    explanation:
      "Forgiveness programs cancel debt for borrowers meeting specific criteria, like public service or teaching.",
  },
  {
    id: 50,
    question: "Why communicate with your loan servicer?",
    options: [
      { id: "a", text: "To increase interest rates" },
      { id: "b", text: "To get help with repayment options and issues" },
      { id: "c", text: "To cancel the loan" },
      { id: "d", text: "To borrow more money" },
    ],
    correctAnswer: "b",
    explanation:
      "Servicers provide guidance on plans, deferments, or issues, helping you manage your loan effectively.",
  },
];

export default function StudentLoanQuiz() {
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
        setTimeLeft((prev) => prev - 1);
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
        "Student Loan Management",
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
              Student Loan Management Quiz
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
              <CardTitle>Student Loan Management Quiz</CardTitle>
              <CardDescription>
                Test your knowledge about managing student loans
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
                      You have 5 minutes to complete 10 multiple-choice questions
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
                  This quiz covers repayment plans, interest rates, loan forgiveness, budgeting, and avoiding default.
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
                  <CardDescription>Student Loan Management</CardDescription>
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
                    selectedAnswers[randomQuestions[currentQuestion].id] === option.id;
                  const isCorrect = option.id === randomQuestions[currentQuestion].correctAnswer;

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
                        handleAnswerSelect(randomQuestions[currentQuestion].id, option.id)
                      }
                      disabled={selectedAnswers[randomQuestions[currentQuestion].id] !== undefined}
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
                      <p className="text-sm">{randomQuestions[currentQuestion].explanation}</p>
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
                You've completed the Student Loan Management Quiz
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
                      ? "Excellent! You have a strong understanding of student loan management."
                      : calculateScore() >= 6
                        ? "Good job! You understand the basics of student loans."
                        : "You're on your way to mastering student loan management."}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    You've earned{" "}
                    {Math.round((calculateScore() / randomQuestions.length) * 20)} Coins and{" "}
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
                      <div key={question.id} className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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
                      Federal loans offer flexible repayment plans like income-driven options.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      Budgeting is key to balancing loan payments with other expenses.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      Forgiveness programs can reduce debt for qualifying careers or repayment plans.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      Avoid default by communicating with your servicer and exploring relief options.
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