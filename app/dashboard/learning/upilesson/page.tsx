"use client";
import Link from "next/link";
import React from "react";

export default function upiLesson() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">📲 UPI & Digital Wallets</h1>

      <section className="mb-8">
        <p className="text-lg">
          UPI (Unified Payments Interface) and digital wallets have transformed the way we handle money. With just a smartphone, you can send, receive, and manage funds instantly—anytime, anywhere.
        </p>
        <blockquote className="italic text-indigo-700 mt-4 border-l-4 border-indigo-400 pl-4">
          “The future of money is digital currency.” – Bill Gates
        </blockquote>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          💼 What is UPI?
        </h2>
        <p className="mb-4">
          Unified Payments Interface (UPI) is a real-time payment system developed by the National Payments Corporation of India (NPCI). It enables you to link multiple bank accounts in one app and make seamless money transfers.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>⚡ Instant money transfer 24/7</li>
          <li>🔒 Secure with PIN and device binding</li>
          <li>🏦 Linked directly to your bank account</li>
          <li>🔁 Supports QR code and mobile number payments</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          💳 What are Digital Wallets?
        </h2>
        <p className="mb-4">
          Digital wallets like Paytm, Google Pay, PhonePe, and Amazon Pay store money electronically and allow easy payments without bank details each time.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-pink-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-pink-800 mb-1">
              Advantages
            </h3>
            <ul className="list-disc list-inside">
              <li>Easy to use</li>
              <li>Faster transactions</li>
              <li>Can store loyalty points & coupons</li>
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-gray-800 mb-1">
              Limitations
            </h3>
            <ul className="list-disc list-inside">
              <li>Sometimes require wallet top-up</li>
              <li>May not work offline</li>
              <li>Transaction limits may apply</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10 bg-blue-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">📚 Quick Tip</h2>
        <p className="mb-2">
          Always double-check UPI IDs or QR codes before sending money. Also, use official apps and keep your app updated to avoid security issues.
        </p>
        <p className="text-sm text-gray-700">
          🔐 Pro Tip: Enable app lock and biometric security for an extra layer of protection.
        </p>
      </section>

      <div className="text-center mt-8">
        <Link href="/dashboard/quizzes/upi">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition">
            🧠 Go to Quiz
          </button>
        </Link>
      </div>
    </div>
  );
}