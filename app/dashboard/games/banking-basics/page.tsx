"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Landmark, CreditCard, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { saveActivityProgress } from "@/actions/user-actions";
import { toast } from "@/components/ui/use-toast";

export default function BankingBasics() {
  const router = useRouter();
  const { userData, refreshUserData } = useAuth();
  const [balance, setBalance] = useState(1000);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes
  const [gameStatus, setGameStatus] = useState<"not_started" | "in_progress" | "completed">("not_started");
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interestAccrued, setInterestAccrued] = useState(0);

  useEffect(() => {
    if (gameStatus !== "in_progress") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameStatus("completed");
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });

      if (accountType === "Savings" && timeLeft % 30 === 0) {
        const interest = Number.parseFloat((balance * 0.01).toFixed(2));
        setBalance((prev) => Number.parseFloat((prev + interest).toFixed(2)));
        setInterestAccrued((prev) => Number.parseFloat((prev + interest).toFixed(2)));
        setTransactions((prev) => [...prev, `Earned $${interest.toFixed(2)} interest`]);
        setScore((prev) => prev + 5);
        toast({ title: "Interest!", description: `+$${interest.toFixed(2)}`, className: "bg-green-700 text-gray-100" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, timeLeft, accountType, balance]);

  const handleAccountSelection = (type: string) => {
    if (accountType) {
      setTransactions((prev) => [...prev, `Switched to ${type}`]);
    } else {
      setTransactions((prev) => [...prev, `Opened ${type}`]);
      setScore((prev) => prev + 10);
    }
    setAccountType(type);
    toast({ title: "Account Set!", description: `${type} selected`, className: "bg-teal-700 text-gray-100" });
  };

  const makeDeposit = (amount: number) => {
    setBalance((prev) => Number.parseFloat((prev + amount).toFixed(2)));
    setTransactions((prev) => [...prev, `Deposited $${amount.toFixed(2)}`]);
    setScore((prev) => prev + 5);
    toast({ title: "Deposit!", description: `+$${amount.toFixed(2)}`, className: "bg-green-700 text-gray-100" });
  };

  const makeWithdrawal = (amount: number) => {
    if (balance >= amount) {
      setBalance((prev) => Number.parseFloat((prev - amount).toFixed(2)));
      setTransactions((prev) => [...prev, `Withdrew $${amount.toFixed(2)}`]);
      if (accountType === "Savings" && amount > 100) {
        const penalty = 5;
        setBalance((prev) => Number.parseFloat((prev - penalty).toFixed(2)));
        setTransactions((prev) => [...prev, `Penalty: -$${penalty.toFixed(2)}`]);
        setScore((prev) => prev - 5);
        toast({ title: "Penalty!", description: "-$5 fee", className: "bg-red-800 text-gray-100" });
      } else {
        setScore((prev) => prev + 3);
      }
    } else {
      setTransactions((prev) => [...prev, `Failed: Insufficient funds`]);
      setScore((prev) => prev - 10);
      toast({ title: "Overdraft!", description: "Not enough funds!", className: "bg-red-800 text-gray-100" });
    }
  };

  const handleGameEnd = async () => {
    if (!userData) return;
    const { xpEarned, coinsEarned, finalScore } = calculateRewards();
    try {
      setIsSubmitting(true);
      const result = await saveActivityProgress(userData.id, "game", "Banking Basics", finalScore, xpEarned, coinsEarned);
      if (result.success) {
        await refreshUserData();
        toast({
          title: "Banking Mastered!",
          description: `You earned ${xpEarned} XP and ${coinsEarned} Coins!`,
          className: "bg-gradient-to-r from-teal-700 to-gray-700 text-gray-100",
        });
      }
    } catch (error) {
      console.error("Error saving game progress:", error);
      toast({ title: "Error", description: "Failed to save progress.", className: "bg-red-800 text-gray-100" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const calculateRewards = () => {
    const finalScore = score + Math.floor(balance / 100) * 5;
    const xpEarned = Math.min(Math.max(finalScore, 15), 50);
    const coinsEarned = Math.min(Math.max(Math.floor(finalScore / 2), 10), 30);
    return { xpEarned, coinsEarned, finalScore };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 flex flex-col items-center p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between w-full max-w-4xl mb-6"
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/games">
            <Button variant="outline" size="icon" className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-100 drop-shadow-md">Banking Basics</h1>
        </div>
        <Badge className="bg-teal-700 text-gray-100 text-sm font-semibold">Beginner</Badge>
      </motion.div>

      {/* Game Card */}
      <Card className="w-full max-w-4xl bg-gray-800/80 backdrop-blur-lg border border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-100 text-center">Banking Basics</CardTitle>
          <CardDescription className="text-center text-teal-300">
            Master your money moves!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <motion.div
            className="flex justify-between text-gray-100 font-semibold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              animate={{ scale: timeLeft < 30 ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: timeLeft < 30 ? Infinity : 0, duration: 0.5 }}
            >
              ⏳ {formatTime(timeLeft)}
            </motion.span>
            <span>💰 Balance: ${balance.toFixed(2)}</span>
            <span>🏆 Score: {score}</span>
          </motion.div>

          {/* Start Screen */}
          {gameStatus === "not_started" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-100">Welcome to Banking Basics!</h3>
              <p className="text-teal-300">
                Pick an account, make deposits, and withdraw wisely. Savings earns 1% interest every 30s but watch out for penalties!
              </p>
              <Button
                onClick={() => setGameStatus("in_progress")}
                className="bg-gradient-to-r from-teal-700 to-gray-700 text-gray-100 px-6 py-3 rounded-full shadow-lg hover:from-teal-600 hover:to-gray-600"
              >
                Start Banking
              </Button>
            </motion.div>
          )}

          {/* Playing Screen */}
          {gameStatus === "in_progress" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Selection & Transactions */}
              <div className="space-y-6">
                <motion.div
                  className="p-4 bg-gray-700/50 rounded-xl border border-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">Choose Your Account</h3>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleAccountSelection("Savings")}
                      variant={accountType === "Savings" ? "default" : "outline"}
                      className={`flex gap-2 ${accountType === "Savings" ? "bg-teal-700 hover:bg-teal-600" : "bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"}`}
                    >
                      <PiggyBank className="h-4 w-4" />
                      Savings
                    </Button>
                    <Button
                      onClick={() => handleAccountSelection("Checking")}
                      variant={accountType === "Checking" ? "default" : "outline"}
                      className={`flex gap-2 ${accountType === "Checking" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"}`}
                    >
                      <CreditCard className="h-4 w-4" />
                      Checking
                    </Button>
                  </div>
                  <p className="text-xs text-teal-300 mt-2">
                    {accountType === "Savings" ? "1% interest every 30s, but penalties for big withdrawals." : accountType === "Checking" ? "No interest, no penalties." : "Pick an account to start!"}
                  </p>
                </motion.div>

                <motion.div
                  className="p-4 bg-gray-700/50 rounded-xl border border-gray-600 max-h-48 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">Activity Log</h3>
                  <ul className="space-y-1 text-sm text-teal-300">
                    {transactions.length === 0 ? (
                      <li>No moves yet—start banking!</li>
                    ) : (
                      transactions.map((entry, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Landmark className="h-3 w-3 text-teal-400" />
                          {entry}
                        </li>
                      ))
                    )}
                  </ul>
                </motion.div>
              </div>

              {/* Transactions & Summary */}
              <div className="space-y-6">
                <motion.div
                  className="p-4 bg-gray-700/50 rounded-xl border border-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">Make a Move</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => makeDeposit(100)}
                      className="flex gap-2 bg-green-700 hover:bg-green-600 text-gray-100 rounded-full"
                      disabled={!accountType}
                    >
                      <ArrowDownRight className="h-4 w-4" />
                      $100
                    </Button>
                    <Button
                      onClick={() => makeDeposit(500)}
                      className="flex gap-2 bg-green-700 hover:bg-green-600 text-gray-100 rounded-full"
                      disabled={!accountType}
                    >
                      <ArrowDownRight className="h-4 w-4" />
                      $500
                    </Button>
                    <Button
                      onClick={() => makeWithdrawal(50)}
                      className="flex gap-2 bg-red-800 hover:bg-red-700 text-gray-100 rounded-full"
                      disabled={!accountType || balance < 50}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      $50
                    </Button>
                    <Button
                      onClick={() => makeWithdrawal(200)}
                      className="flex gap-2 bg-red-800 hover:bg-red-700 text-gray-100 rounded-full"
                      disabled={!accountType || balance < 200}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      $200
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  className="p-4 bg-gray-700/50 rounded-xl border border-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">Account Summary</h3>
                  <div className="space-y-2 text-teal-300">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{accountType || "None"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance:</span>
                      <span className="text-gray-100">${balance.toFixed(2)}</span>
                    </div>
                    {accountType === "Savings" && (
                      <div className="flex justify-between">
                        <span>Interest:</span>
                        <span className="text-teal-400">${interestAccrued.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* End Screen */}
          <AnimatePresence>
            {gameStatus === "completed" && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 space-y-6"
              >
                <motion.div
                  className="rounded-full bg-teal-700/30 p-6 inline-block"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Award className="h-16 w-16 text-gray-100" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-100">Banking Done!</h3>
                <motion.p
                  className="text-2xl text-teal-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Final Balance: ${balance.toFixed(2)}
                </motion.p>
                {accountType === "Savings" && (
                  <motion.p
                    className="text-lg text-teal-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Interest Earned: ${interestAccrued.toFixed(2)}
                  </motion.p>
                )}
                <motion.p
                  className="text-lg text-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Final Score: {calculateRewards().finalScore}
                </motion.p>
                {userData && (
                  <motion.div
                    className="text-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <p>You earned {calculateRewards().xpEarned} XP & {calculateRewards().coinsEarned} Coins!</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/games")}
            className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
          >
            Back to Games
          </Button>
          {gameStatus === "completed" && (
            <Button
              onClick={() => {
                setBalance(1000);
                setAccountType(null);
                setTransactions([]);
                setTimeLeft(480);
                setScore(0);
                setInterestAccrued(0);
                setGameStatus("not_started");
              }}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-teal-700 to-gray-700 text-gray-100 rounded-full shadow-lg hover:from-teal-600 hover:to-gray-600"
            >
              {isSubmitting ? "Saving..." : "Play Again"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Footer Stats */}
      {userData && (
        <motion.div
          className="flex justify-between text-gray-100 mt-6 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>XP: {userData.xp + (gameStatus === "completed" ? calculateRewards().xpEarned : 0)}</p>
          <p>Coins: {userData.coins + (gameStatus === "completed" ? calculateRewards().coinsEarned : 0)}</p>
        </motion.div>
      )}
    </div>
  );
}