"use client";
import Link from "next/link";
import React from "react";

export default function studentLoanLesson() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">
        🎓 Understanding Student Loans
      </h1>

      <section className="mb-8">
        <p className="text-lg">
          Student loans help finance your education, but understanding how they
          work is key to managing debt wisely. This lesson covers the essentials
          of borrowing, repaying, and planning ahead.
        </p>
        <blockquote className="italic text-green-700 mt-4 border-l-4 border-green-400 pl-4">
          “An investment in knowledge pays the best interest.” – Benjamin
          Franklin
        </blockquote>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          🧾 Types of Student Loans
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-blue-800 mb-1">
              1. Federal Student Loans
            </h3>
            <p>
              Offered by the government with fixed interest rates and flexible
              repayment plans.
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-red-800 mb-1">
              2. Private Student Loans
            </h3>
            <p>
              Provided by banks or institutions; interest rates and terms vary.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          💡 Smart Loan Management Tips
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>📆 Start planning for repayment while still in school</li>
          <li>📊 Understand your interest rate and how it accrues</li>
          <li>
            💸 Pay more than the minimum if possible to reduce debt faster
          </li>
          <li>🔁 Consider consolidating or refinancing if rates improve</li>
          <li>📱 Use tools or apps to track your loan and payment schedule</li>
        </ul>
      </section>

      <section className="mb-10 bg-yellow-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">📚 Quick Tip</h2>
        <p className="mb-2">
          Always fill out the Free Application for Federal Student Aid (FAFSA)
          to explore your eligibility for grants, scholarships, and low-interest
          loans.
        </p>
        <p className="text-sm text-gray-700">
          📌 Pro Tip: Set up auto-pay for student loans to avoid missed payments
          and sometimes get an interest rate discount.
        </p>
      </section>

      <section className="mb-10">
        {" "}
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/U33-7ouB5hs?si=c-iUmvrjrRTqa4hA"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/ZWviGef3VzE?si=1c4A6XUMNzmYBWIr"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </section>

      <div className="text-center mt-8">
        <Link href="/dashboard/quizzes/student-loans">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition">
            🧠 Go to Quiz
          </button>
        </Link>
      </div>
    </div>
  );
}
