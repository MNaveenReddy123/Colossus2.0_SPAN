"use client";
import Link from "next/link";
import React from "react";

export default function investmentlearning() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">
        📈 Introduction to Investments
      </h1>

      <section className="mb-8">
        <p className="text-lg">
          Investing is how you make your money work *for you*. It helps grow
          your wealth over time instead of letting your savings just sit in a
          bank account.
        </p>
        <blockquote className="italic text-green-600 mt-4 border-l-4 border-green-300 pl-4">
          “Don’t work for money, let money work for you.” – Robert Kiyosaki
        </blockquote>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          💸 Why Should You Invest?
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>🚀 Grow your wealth with time (thanks to compound interest!)</li>
          <li>
            📉 Beat inflation (money loses value over time if not invested)
          </li>
          <li>🎯 Reach financial goals faster (buying a car, home, etc.)</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">📊 Types of Investments</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-yellow-800 mb-1">
              1. Stocks
            </h3>
            <p>Part ownership in a company. High returns, high risk.</p>
          </div>
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-blue-800 mb-1">
              2. Mutual Funds
            </h3>
            <p>Pool of money managed by experts. Diversified, moderate risk.</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-green-800 mb-1">
              3. Fixed Deposits
            </h3>
            <p>Safe and steady returns, but low growth.</p>
          </div>
          <div className="bg-purple-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-purple-800 mb-1">
              4. Gold & Real Estate
            </h3>
            <p>Physical assets that usually appreciate in value.</p>
          </div>
        </div>
      </section>

      <section className="mb-10 bg-orange-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">🧠 Mini Scenario</h2>
        <p className="mb-2">
          You save ₹1,000/month in a savings account (3% interest) vs investing
          in a mutual fund (10% return). After 10 years:
        </p>
        <ul className="list-disc list-inside">
          <li>🏦 Savings: ~₹1.4 lakhs</li>
          <li>📈 Mutual Fund: ~₹2.05 lakhs</li>
        </ul>
        <p className="text-sm text-gray-700 mt-2">
          📊 Small differences in return = big impact long-term!
        </p>
      </section>

      <div className="text-center mt-8">
        <Link href="/dashboard/quizzes/investment">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition">
            📚 Go to Quiz
          </button>
        </Link>
      </div>
    </div>
  );
}
