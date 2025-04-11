"use client";
import Link from "next/link";
import React from "react";

export default function creditscorelearning() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">📊 Mastering Credit Scores</h1>

      <section className="mb-8">
        <p className="text-lg">
          Your credit score is your adulting power level. It's like a trust
          score that lenders use to decide whether to give you loans, credit
          cards, or better interest rates.
        </p>
        <blockquote className="italic text-purple-600 mt-4 border-l-4 border-purple-300 pl-4">
          “A good credit score opens doors. A bad one closes them.”
        </blockquote>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          📈 What is a Credit Score?
        </h2>
        <p className="mb-3">
          It's a 3-digit number (usually from **300 to 900**) that shows how
          reliable you are at repaying borrowed money. The higher, the better.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-red-100 p-4 rounded shadow text-center">
            <h3 className="font-bold text-lg mb-1 text-red-600">
              Poor (300–579)
            </h3>
            <p>
              🚫 High risk for lenders
              <br />
              Difficult to get loans
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow text-center">
            <h3 className="font-bold text-lg mb-1 text-yellow-700">
              Fair to Good (580–749)
            </h3>
            <p>
              🟡 Moderate trust
              <br />
              Okay interest rates
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <h3 className="font-bold text-lg mb-1 text-green-600">
              Excellent (750–900)
            </h3>
            <p>
              ✅ High trust
              <br />
              Low interest, fast approvals
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🔍 How It's Calculated</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Payment History</strong> (35%) – Pay on time!
          </li>
          <li>
            <strong>Credit Utilization</strong> (30%) – Don't max out cards
          </li>
          <li>
            <strong>Credit Age</strong> (15%) – Older accounts = better
          </li>
          <li>
            <strong>Credit Mix</strong> (10%) – A healthy mix of loans/cards
          </li>
          <li>
            <strong>New Credit Inquiries</strong> (10%) – Too many = risky
          </li>
        </ul>
      </section>

      <section className="mb-10 bg-blue-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">💡 Mini Activity</h2>
        <p className="mb-2">
          Your friend pays credit card bills 10 days late every month. What
          happens?
        </p>
        <ul className="list-disc list-inside">
          <li>❌ Credit score drops</li>
          <li>⚠️ Interest and penalties grow</li>
          <li>💳 Lenders lose trust</li>
        </ul>
        <p className="text-sm text-gray-700 mt-2">
          🧠 Tip: Set reminders or auto-pay to never miss due dates.
        </p>
      </section>

      <div className="text-center mt-8">
        <Link href="/dashboard/quizzes/credit-score">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition">
          📚 Go to Quiz
        </button>
        </Link>

      </div>
    </div>
  );
}
