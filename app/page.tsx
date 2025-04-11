"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardHover = {
    hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
  };

  const buttonHover = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
      >
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <motion.span
                className="font-bold text-xl text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                finZ
              </motion.span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/about">
                <motion.div whileHover="hover" variants={buttonHover}>
                  <Button variant="ghost" className="hover:bg-muted/50">
                    About
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div whileHover="hover" variants={buttonHover}>
                  <Button variant="ghost" className="hover:bg-muted/50">
                    Login
                  </Button>
                </motion.div>
              </Link>
              <Link href="/register">
                <motion.div whileHover="hover" variants={buttonHover}>
                  <Button variant="default" className="bg-primary text-white hover:bg-primary/90">
                    Sign Up
                  </Button>
                </motion.div>
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="flex flex-col justify-center space-y-6"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                    Learn Finance Through Play
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    finZ makes financial literacy fun and engaging through interactive gameplay, simulations, and
                    challenges designed for Gen Z.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/register">
                    <motion.div whileHover="hover" variants={buttonHover}>
                      <Button size="lg" className="w-full bg-primary text-white hover:bg-primary/90">
                        Get Started
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/login">
                    <motion.div whileHover="hover" variants={buttonHover}>
                      <Button size="lg" variant="outline" className="w-full hover:bg-muted/50">
                        Login
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="mx-auto lg:mr-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative w-full max-w-[400px] h-[300px] bg-gradient-to-br from-primary/20 to-primary/40 rounded-xl shadow-md overflow-hidden">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-4xl font-bold text-primary">finZ</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                Features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover how finZ makes learning about finance engaging and fun
              </p>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {[
                {
                  title: "Interactive Simulations",
                  desc: "Experience real-world financial scenarios",
                  content: "Make financial decisions in simulated environments and see the consequences in real-time.",
                },
                {
                  title: "Mini-Games",
                  desc: "Learn while having fun",
                  content: "Play quick games designed to teach financial concepts in an engaging way.",
                },
                {
                  title: "Quizzes & Challenges",
                  desc: "Test your knowledge",
                  content: "Take daily quizzes and complete challenges to earn XP and virtual currency.",
                },
                {
                  title: "Progress Tracking",
                  desc: "See your growth",
                  content: "Track your learning journey with visual progress indicators and achievement badges.",
                },
                {
                  title: "Virtual Wallet",
                  desc: "Practice money management",
                  content: "Manage your in-game currency and learn about saving, spending, and investing.",
                },
                {
                  title: "Leaderboards",
                  desc: "Compete with friends",
                  content: "See how you stack up against other players and challenge your friends.",
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={fadeIn} whileHover="hover">
                  <Card className="bg-background border-muted shadow-sm hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-foreground">{feature.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{feature.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 finZ. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}