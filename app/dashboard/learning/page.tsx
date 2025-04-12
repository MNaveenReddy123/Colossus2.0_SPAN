"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CreditCard, Landmark, DollarSign, TrendingUp } from "lucide-react"
import axios from "axios";
import { useState,useEffect } from "react"
import {
  
  Gamepad2,
  Trophy,
  Wallet,

  Calendar,
  Clock,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Sample finance Q&A data (can be expanded or fetched from backend)
const financeQAData = [
  {
    question: "What is a stock?",
    context: "A stock is a type of security that represents ownership in a corporation. It gives the holder a claim on part of the company's assets and earnings.",
  },
  {
    question: "What is compound interest?",
    context: "Compound interest is the interest calculated on the initial principal and also on the accumulated interest from previous periods.",
  },
  {
    question: "What is a credit score?",
    context: "A credit score is a numerical expression based on an analysis of a person's credit files, used to represent their creditworthiness.",
  },
  {
    question: "What is a budget?",
    context: "A budget is a financial plan that outlines expected income and expenses over a specific period of time.",
  },
  {
    question: "What are dividends?",
    context: "Dividends are payments made by a corporation to its shareholders, usually as a distribution of profits.",
  },
];


export default function LearningPage() {
  const [qaQuestion, setQaQuestion] = useState("");
    const [qaContext, setQaContext] = useState("");
    const [qaAnswer, setQaAnswer] = useState("");
    const [qaLoading, setQaLoading] = useState(false);
    const [qaError, setQaError] = useState("");
  // Fetch random Q&A and answer
  const fetchRandomQA = async () => {
    setQaLoading(true);
    setQaAnswer("");
    setQaError("");
    try {
      const randomQA = financeQAData[Math.floor(Math.random() * financeQAData.length)];
      setQaQuestion(randomQA.question);
      console.log("here");
      console.log(qaAnswer);
      setQaContext(randomQA.context);
      console.log(qaContext);


      const response = await axios.post("http://127.0.0.1:8000/predict", {
        question: randomQA.question,
        context: randomQA.context,
      });

      if (response.data && response.data.answer) {
        setQaAnswer(response.data.answer);
      } else {
        setQaError("No answer returned from the server");
      }
    } catch (err) {
      setQaError(
        err.response?.data?.detail || "An error occurred while fetching the answer"
      );
      console.error(err);
    } finally {
      setQaLoading(false);
    }
  };

  // Load a random Q&A on tab switch to Q&A
  useEffect(() => {
    if (qaQuestion === "") {
      fetchRandomQA();
    }
  }, [qaQuestion]);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Begin Learning</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Budgeting Basics</CardTitle>
                <Badge variant="outline">8/10</Badge>
              </div>
              <CardDescription>Test your budgeting knowledge</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Beginner</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">Completed today at 2:30 PM</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/budgetinglesson" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Credit Score</CardTitle>
                <Badge variant="outline">Daily</Badge>
              </div>
              <CardDescription>Test your knowledge about credit scores</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">

                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span>Intermediate</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">New questions available today</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/creditscorelesson" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Investment Basics</CardTitle>
                <Badge variant="outline">New</Badge>
              </div>
              <CardDescription>Test your investment knowledge</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">

                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Intermediate</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">Earn up to 30 coins for completion</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/investmentlesson" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Banking Services</CardTitle>
                <Badge variant="outline">Beginner</Badge>
              </div>
              <CardDescription>Learn about different banking services</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">

                </div>
                <div className="flex items-center gap-1">
                  <Landmark className="h-4 w-4" />
                  <span>Beginner</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">Earn up to 20 coins for completion</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/bankinglesson" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Student Loan management</CardTitle>
                <Badge variant="outline">Daily</Badge>
              </div>
              <CardDescription>Learn all about Student Loans</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">

                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span>Intermediate</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">New questions available today</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/studentloanmanagement" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="bg-card border-muted shadow-md">
                  <CardHeader>
                    <CardTitle>Finance Q&A</CardTitle>
                    <CardDescription>Explore random finance questions and answers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {qaLoading && (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading answer...</span>
                      </div>
                    )}
                    {qaError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{qaError}</AlertDescription>
                      </Alert>
                    )}
                    {!qaLoading && !qaError && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Question:</h3>
                          <p className="text-gray-700">{qaQuestion}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Context:</h3>
                          <p className="text-gray-700">{qaContext}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Answer:</h3>
                          <p className="text-gray-700">{qaAnswer || "No answer yet"}</p>
                        </div>
                        <Button
                          onClick={fetchRandomQA}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                          disabled={qaLoading}
                        >
                          Get New Question
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
        </div>
      </div>
    </div>
  )
}
