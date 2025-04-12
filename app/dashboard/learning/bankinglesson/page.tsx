"use client";
import Link from "next/link";
import React from "react";

export default function bankinglesson() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">🏦 Introduction to Banking</h1>

      <section className="mb-8">
        <p className="text-lg">
          Banking is the foundation of personal finance. Whether it’s storing
          your money, paying bills, or earning interest, banks are essential for
          managing your finances efficiently and securely.
        </p>
        <blockquote className="italic text-yellow-600 mt-4 border-l-4 border-yellow-300 pl-4">
          “A bank is a place that will lend you money if you can prove that you
          don’t need it.” – Bob Hope
        </blockquote>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          🔑 Key Functions of a Bank
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>💰 Keeps your money safe</li>
          <li>📈 Pays you interest on savings</li>
          <li>💳 Provides debit and credit cards</li>
          <li>🏠 Offers loans (home, car, education, etc.)</li>
          <li>📲 Facilitates digital transactions and payments</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          🏦 Types of Bank Accounts
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-yellow-700 mb-1">
              1. Savings Account
            </h3>
            <p>Earn interest while saving money. Ideal for everyday users.</p>
          </div>
          <div className="bg-cyan-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-cyan-700 mb-1">
              2. Current Account
            </h3>
            <p>Used by businesses for frequent transactions. No interest.</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-yellow-700 mb-1">
              3. Fixed Deposit (FD)
            </h3>
            <p>Lock in your money for a period to earn higher interest.</p>
          </div>
          <div className="bg-cyan-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-cyan-700 mb-1">
              4. Recurring Deposit (RD)
            </h3>
            <p>Deposit a fixed amount every month for a specific period.</p>
          </div>
        </div>
      </section>

      <section className="mb-10 bg-yellow-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">💡 Quick Tip</h2>
        <p className="mb-2">
          Always check the bank’s interest rate, minimum balance rules, and
          digital banking features before opening an account.
        </p>
        <p className="text-sm text-gray-700">
          🛡️ Pro Tip: Use mobile banking apps to track expenses and avoid
          overdrafts!
        </p>
      </section>
      <section className="mb-10">
        {" "}
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/fTTGALaRZoc?si=-W3Widep4iiWJ7Q8"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/O4-MtfawzAY?si=JWkZKbp0W-uTgwL-"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </section>

      <div className="text-center mt-8">
        <Link href="/dashboard/quizzes/banking">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition">
            🚀 Go to Quiz
          </button>
        </Link>
      </div>
    </div>
  );
}
