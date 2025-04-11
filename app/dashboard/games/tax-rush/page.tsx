"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/auth-context";
import { saveActivityProgress } from "@/actions/user-actions";
import { toast } from "@/components/ui/use-toast";

// Type Definitions
type TaxItem = { id: string; label: string; category: "Income" | "Deduction" | "Invalid" };
type DropZoneCategory = "Income" | "Deduction" | "Invalid";

// Sample Tax Items
const taxItems: TaxItem[] = [
  { id: uuidv4(), label: "W-2 Form", category: "Income" },
  { id: uuidv4(), label: "Charity Donation Receipt", category: "Deduction" },
  { id: uuidv4(), label: "Lottery Ticket", category: "Invalid" },
  { id: uuidv4(), label: "1099 Form", category: "Income" },
  { id: uuidv4(), label: "Medical Bill", category: "Deduction" },
  { id: uuidv4(), label: "Mortgage Interest Statement", category: "Deduction" },
  { id: uuidv4(), label: "Birthday Card", category: "Invalid" },
  { id: uuidv4(), label: "Student Loan Interest", category: "Deduction" },
  { id: uuidv4(), label: "Dividend Statement", category: "Income" },
];

export default function TaxRushGame() {
  const router = useRouter();
  const { userData, refreshUserData } = useAuth();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [currentItems, setCurrentItems] = useState<TaxItem[]>(taxItems);
  const [gameStatus, setGameStatus] = useState<"not_started" | "in_progress" | "completed">("not_started");
  const [draggedItem, setDraggedItem] = useState<TaxItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (gameStatus !== "in_progress") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus("completed");
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStatus]);

  // Drag and Drop Handlers
  const handleDragStart = (item: TaxItem) => setDraggedItem(item);

  const handleDrop = async (zone: DropZoneCategory) => {
    if (!draggedItem) return;

    setCurrentItems((prev) => prev.filter((i) => i.id !== draggedItem.id));
    if (draggedItem.category === zone) {
      setScore((prev) => prev + 10);
      toast({ title: "Nice Move!", description: "+10 Points!", className: "bg-green-500 text-white" });
    } else {
      setTimeLeft((prev) => Math.max(prev - 10, 0));
      toast({ title: "Oops!", description: "-10 Seconds!", variant: "destructive" });
    }
    setDraggedItem(null);

    if (currentItems.length === 1) {
      setGameStatus("completed");
      handleGameEnd();
    }
  };

  // Time Formatting
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Calculate Rewards
  const calculateRewards = () => {
    const xpEarned = Math.floor(score / 10) * 5; // 5 XP per correct answer
    const coinsEarned = Math.floor(score / 10) * 3; // 3 coins per correct answer
    return { xpEarned, coinsEarned };
  };

  // Handle Game End
  const handleGameEnd = async () => {
    if (!userData || isSubmitting) return;

    const { xpEarned, coinsEarned } = calculateRewards();
    try {
      setIsSubmitting(true);
      const result = await saveActivityProgress(
        userData.id,
        "game",
        "Tax Rush",
        score,
        xpEarned,
        coinsEarned
      );
      if (result.success) {
        await refreshUserData();
        toast({
          title: "Tax Rush Mastered!",
          description: `You earned ${xpEarned} XP and ${coinsEarned} Coins!`,
          className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white",
        });
      }
    } catch (error) {
      console.error("Error saving game progress:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 flex flex-col items-center p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between w-full max-w-4xl mb-6"
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/games">
            <Button variant="outline" size="icon" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md">Tax Rush</h1>
        </div>
        <Badge className="bg-teal-400 text-white text-sm font-semibold">Intermediate</Badge>
      </motion.div>

      {/* Game Card */}
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border-none shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white text-center">Tax Rush</CardTitle>
          <CardDescription className="text-center text-teal-200">
            Drag tax items to the right zones before time runs out!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <motion.div
            className="flex justify-between text-white font-semibold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              animate={{ scale: timeLeft < 30 ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: timeLeft < 30 ? Infinity : 0, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              ⏳ {formatTime(timeLeft)}
            </motion.span>
            <motion.span animate={{ scale: score > 0 ? [1, 1.05, 1] : 1 }} className="flex items-center gap-2">
              🏆 {score}
            </motion.span>
          </motion.div>

          {/* Start Screen */}
          {gameStatus === "not_started" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <h3 className="text-2xl font-bold text-white">How to Play</h3>
              <p className="text-teal-100">
                Drag tax items to <span className="text-yellow-300">Income</span>,{" "}
                <span className="text-green-300">Deduction</span>, or{" "}
                <span className="text-red-300">Invalid</span>. Correct moves earn 10 points, mistakes cost 10 seconds!
              </p>
              <Button
                onClick={() => setGameStatus("in_progress")}
                className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:from-teal-500 hover:to-blue-600"
              >
                Start the Rush
              </Button>
            </motion.div>
          )}

          {/* Playing Screen */}
          {gameStatus === "in_progress" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tax Items */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white mb-4">Tax Items</h3>
                {currentItems.map((item) => (
                  <motion.div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    className="bg-white/20 p-4 rounded-xl shadow-md text-white cursor-grab border border-white/30"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileDrag={{ scale: 1.1, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  >
                    {item.label}
                  </motion.div>
                ))}
              </div>

              {/* Drop Zones */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Drop Zones</h3>
                {(["Income", "Deduction", "Invalid"] as DropZoneCategory[]).map((zone) => (
                  <motion.div
                    key={zone}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(zone)}
                    className={`p-6 rounded-xl border-2 border-dashed text-center text-white font-medium ${
                      zone === "Income"
                        ? "border-yellow-300 bg-yellow-500/20"
                        : zone === "Deduction"
                        ? "border-green-300 bg-green-500/20"
                        : "border-red-300 bg-red-500/20"
                    }`}
                    whileHover={{ scale: 1.02, borderColor: "#fff" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {zone} Zone
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Screen */}
          <AnimatePresence>
            {gameStatus === "completed" && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 space-y-6"
              >
                <motion.div
                  className="rounded-full bg-teal-500/30 p-6 inline-block"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Award className="h-16 w-16 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white">Tax Rush Complete!</h3>
                <motion.p
                  className="text-2xl text-teal-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Final Score: {score}
                </motion.p>
                {userData && (
                  <motion.div
                    className="text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
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
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            Back to Games
          </Button>
          {gameStatus === "completed" && (
            <Button
              onClick={() => {
                setScore(0);
                setTimeLeft(600);
                setCurrentItems(taxItems);
                setGameStatus("not_started");
              }}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-blue-600"
            >
              {isSubmitting ? "Saving..." : "Play Again"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Footer Stats */}
      {userData && (
        <motion.div
          className="flex justify-between text-white mt-6 w-full max-w-4xl"
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