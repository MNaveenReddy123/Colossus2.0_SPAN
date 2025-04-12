"use client";
import Link from "next/link";
import React from "react";
import  LearningLayout, { LearningSection, LearningTip } from "../LearningLayout"

export default function BankingLearning() {
  return (
    <LearningLayout title="🏦 Introduction to Banking" quizLink="/dashboard/quizzes/banking">
      <LearningSection>
        <p className="text-lg">
          Banking is the foundation of personal finance. Whether it’s storing your money, paying bills, or earning
          interest, banks are essential for managing your finances efficiently and securely.
        </p>
        <blockquote className="italic text-[#FFD700] mt-4 border-l-4 border-[#FFD700]/50 pl-4">
          “A bank is a place that will lend you money if you can prove that you don’t need it.” – Bob Hope
        </blockquote>
      </LearningSection>

      <LearningSection title="🔑 Key Functions of a Bank">
        <ul className="list-disc list-inside space-y-2">
          <li>💰 Keeps your money safe</li>
          <li>📈 Pays you interest on savings</li>
          <li>💳 Provides debit and credit cards</li>
          <li>🏠 Offers loans (home, car, education, etc.)</li>
          <li>📲 Facilitates digital transactions and payments</li>
        </ul>
      </LearningSection>

      <LearningSection title="🏦 Types of Bank Accounts">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#FFD700]/20 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-[#FFD700] mb-1">1. Savings Account</h3>
            <p>Earn interest while saving money. Ideal for everyday users.</p>
          </div>
          <div className="bg-[#0A6C74]/20 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-[#0A6C74] mb-1">2. Current Account</h3>
            <p>Used by businesses for frequent transactions. No interest.</p>
          </div>
          <div className="bg-[#FFD700]/20 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-[#FFD700] mb-1">3. Fixed Deposit (FD)</h3>
            <p>Lock in your money for a period to earn higher interest.</p>
          </div>
          <div className="bg-[#0A6C74]/20 p-4 rounded shadow">
            <h3 className="font-bold text-lg text-[#0A6C74] mb-1">4. Recurring Deposit (RD)</h3>
            <p>Deposit a fixed amount every month for a specific period.</p>
          </div>
        </div>
      </LearningSection>

      <LearningTip>
        <p className="mb-2">
          Always check the bank’s interest rate, minimum balance rules, and digital banking features before opening an
          account.
        </p>
        <p className="text-sm text-[#F5F7FA]/80">
          🛡️ Pro Tip: Use mobile banking apps to track expenses and avoid overdrafts!
        </p>
      </LearningTip>
    </LearningLayout>
  );
}