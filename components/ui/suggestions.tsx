// components/ui/suggestions.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { getUserSuggestions } from "@/actions/user-actions";
import { BookOpen, Gamepad2, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Suggestion {
  title: string;
  description: string;
  type: "quiz" | "game" | "simulation";
  name: string;
  path: string;
  action: string;
}

export default function Suggestions() {
  const { userData } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const itemHover = {
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!userData) return;
      setLoading(true);
      setError(null);
      try {
        const { success, data, error } = await getUserSuggestions(userData.id);
        if (success) {
          setSuggestions(data || []);
        } else {
          console.error("Error fetching suggestions:", error);
          setError("Could not load suggestions. Try again later.");
        }
      } catch (err) {
        console.error("Unexpected error fetching suggestions:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [userData]);

  if (!userData) return null;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="col-span-3">
      <Card className="bg-card border-muted shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-extrabold text-foreground">Recommended For You</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Personalized tasks based on your activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-xs text-muted-foreground">Loading suggestions...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-3 text-xs text-muted-foreground">
              No suggestions yet. Keep playing to get personalized recommendations!
            </div>
          ) : (
            <motion.div variants={staggerChildren} className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover="hover"
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0 rounded-full bg-primary/10 p-1.5">
                      {suggestion.type === "quiz" && <BookOpen className="h-4 w-4 text-primary" />}
                      {suggestion.type === "game" && <Gamepad2 className="h-4 w-4 text-primary" />}
                      {suggestion.type === "simulation" && <BookOpen className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-foreground truncate">{suggestion.title}</h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{suggestion.description}</p>
                    </div>
                  </div>
                  <Link href={suggestion.path} className="ml-2">
                    <Button
                      variant="outline"
                      size="xs"
                      className="hover:bg-primary/20 text-[10px] px-2 py-1 rounded-md shadow-sm transition-all duration-200"
                    >
                      {suggestion.action}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}