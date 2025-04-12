"use client";
import Link from "next/link";
import React from "react";
export default function budgetinglesson() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">📘 Budget Like a Boss</h1>

      <section className="mb-8">
        <p className="text-lg">
          Budgeting isn’t about restrictions — it’s about freedom and control.
          Think of it as your personal cheat code to level up financially.
        </p>
        <blockquote className="italic text-blue-600 mt-4 border-l-4 border-blue-300 pl-4">
          “Tell your money where to go, instead of wondering where it went.”
        </blockquote>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          📈 Why Budgeting Matters
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">Without Budgeting ❌</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Money disappears 💨</li>
              <li>Impulse buys = regret</li>
              <li>No savings = panic during emergencies</li>
              <li>Living paycheck-to-paycheck</li>
            </ul>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">With Budgeting ✅</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>You control where your money goes</li>
              <li>Spend smarter, guilt-free</li>
              <li>Prepared for emergencies</li>
              <li>Plan big goals with confidence</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🧠 Budgeting Basics</h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm md:text-base">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Term</th>
                <th className="border px-4 py-2">What it means</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  term: "Income",
                  def: "Your money inflow – salary, freelancing, side hustle etc.",
                },
                {
                  term: "Fixed Expenses",
                  def: "Bills you must pay – rent, EMIs, subscriptions",
                },
                {
                  term: "Variable Expenses",
                  def: "Spending that changes – food, shopping, Netflix",
                },
                {
                  term: "Savings",
                  def: "Money your future self will thank you for",
                },
                {
                  term: "Emergency Fund",
                  def: "Backup cash for unexpected situations",
                },
                {
                  term: "50/30/20 Rule",
                  def: "Spend 50% on Needs, 30% on Wants, 20% on Savings",
                },
              ].map(({ term, def }) => (
                <tr key={term}>
                  <td className="border px-4 py-2 font-semibold">{term}</td>
                  <td className="border px-4 py-2">{def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 bg-yellow-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">🎯 Mini Activity</h2>
        <p className="mb-2">Think back to your last 3 purchases:</p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Was each a <strong>Need</strong> or a <strong>Want</strong>?
          </li>
          <li>Would you spend on it again?</li>
        </ul>
        <p className="text-sm text-gray-700">
          📝 Reflect on this before you move to the quiz. Your money, your
          rules.
        </p>
      </section>
      <section className="mb-10">
        {" "}
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/sVKQn2I4HDM?si=qCDUsdiqYL7jSqHX"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/CbhjhWleKGE?si=GxjVkf3d7_nTSybi"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </section>

      <div className="text-center mt-8">
        <Link href="/dashboard/quizzes/budgeting">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition">
            🚀 Go to Quiz
          </button>
        </Link>
      </div>
    </div>
  );
}
