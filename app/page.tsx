"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import {
  Wallet,
  Gamepad2,
  BookOpen,
  Trophy,
  BarChart3,
  Star,
  ArrowRight,
  AlignHorizontalDistributeCenter,
} from "lucide-react"

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.2 } },
  }

  const cardHover = {
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      borderColor: "#22c55e",
      transition: { duration: 0.3 },
    },
  }

  const buttonHover = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/fintech-bg.png')] bg-cover opacity-5 animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="rounded-full bg-green-500/10 p-2"
              >
                <Wallet className="h-6 w-6 text-green-600" />
              </motion.div>
              <motion.span
                className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-black to-green-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                FinZ
              </motion.span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              {["about", "login", "register"].map((item, idx) => (
                <Link key={idx} href={`/${item}`}>
                  <motion.div whileHover="hover" variants={buttonHover}>
                    <Button
                      variant={item === "register" ? "default" : "ghost"}
                      className={`${
                        item === "register"
                          ? "bg-black text-white hover:bg-black/90"
                          : "text-black hover:bg-gray-100 hover:text-green-600"
                      } rounded-full px-4 py-2 animate-pulse-subtle`}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Button>
                  </motion.div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {/* Hero Section */}
        <section ref={heroRef} className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-gray-100/20"
            style={{ y: parallaxY }}
          />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="flex flex-col justify-center space-y-6"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="space-y-4">
                  <motion.h1
                    className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-black to-green-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    Master Finance with Fun
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-gray-600 md:text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    FinZ transforms financial literacy into an exciting adventure with games, simulations, and
                    challenges crafted for Gen Z.
                  </motion.p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/register">
                    <motion.div whileHover="hover" variants={buttonHover}>
                      <Button
                        size="lg"
                        className="w-full bg-black text-white hover:bg-black/90 rounded-full animate-pulse-subtle"
                      >
                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/about">
                    <motion.div whileHover="hover" variants={buttonHover}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-black text-black hover:bg-black/5 rounded-full"
                      >
                        Learn More
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
                <div className="relative w-full max-w-[400px] h-[300px] bg-white/50 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-gray-200">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <svg className="h-32 w-32 text-green-600" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
                      <path d="M50 30 L50 50 L60 60" fill="none" stroke="currentColor" strokeWidth="6" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">Why FinZ Rocks</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore features that make learning finance a blast!
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
                  desc: "Real-world scenarios",
                  content: "Make financial decisions in immersive simulations and see instant outcomes.",
                  icon: <AlignHorizontalDistributeCenter className="h-8 w-8 text-green-600" />,
                },
                {
                  title: "Mini-Games",
                  desc: "Fun with purpose",
                  content: "Play addictive games that teach budgeting, taxes, and more.",
                  icon: <Gamepad2 className="h-8 w-8 text-green-600" />,
                },
                {
                  title: "Quizzes & Challenges",
                  desc: "Test your skills",
                  content: "Earn XP and coins with daily quizzes and exciting challenges.",
                  icon: <BookOpen className="h-8 w-8 text-green-600" />,
                },
                {
                  title: "Progress Tracking",
                  desc: "Watch your growth",
                  content: "Visualize your journey with badges and progress bars.",
                  icon: <BarChart3 className="h-8 w-8 text-green-600" />,
                },
                {
                  title: "Virtual Wallet",
                  desc: "Manage money",
                  content: "Practice saving, spending, and investing with in-game currency.",
                  icon: <Wallet className="h-8 w-8 text-green-600" />,
                },
                {
                  title: "Leaderboards",
                  desc: "Compete & win",
                  content: "Challenge friends and climb the global leaderboard.",
                  icon: <Trophy className="h-8 w-8 text-green-600" />,
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={fadeIn} whileHover="hover" variants={cardHover}>
                  <Card className="bg-white border-gray-200 shadow-md rounded-xl overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {feature.icon}
                        <CardTitle className="text-black">{feature.title}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-500">{feature.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
                What Our Users Say
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">Hear from Gen Z learners loving FinZ!</p>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {[
                {
                  name: "Alex M.",
                  quote: "FinZ made budgeting fun! The games are addictive and I'm learning so much.",
                  rating: 5,
                },
                {
                  name: "Sofia R.",
                  quote: "The simulations feel so real. I'm way more confident with money now!",
                  rating: 4,
                },
                {
                  name: "Jayden T.",
                  quote: "Love competing with friends on the leaderboard. It's like gaming with a purpose!",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <motion.div key={index} variants={fadeIn} whileHover={{ y: -5 }}>
                  <Card className="bg-white border-gray-200 shadow-md rounded-xl">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-green-600 fill-green-600" />
                        ))}
                      </div>
                      <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                      <p className="mt-4 font-medium text-black">{testimonial.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {[
                { value: "10K+", label: "Active Learners" },
                { value: "500+", label: "Challenges Completed" },
                { value: "1M+", label: "Coins Earned" },
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeIn} className="flex flex-col items-center text-center">
                  <motion.span
                    className="text-4xl font-bold text-green-600"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  >
                    {stat.value}
                  </motion.span>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="w-full py-12 md:py-24 bg-black">
          <div className="container px-4 md:px-6 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                Ready to Level Up Your Finances?
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-300 md:text-xl">
                Join FinZ today and start your journey to financial mastery!
              </p>
              <Link href="/register">
                <motion.div whileHover="hover" variants={buttonHover}>
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full animate-pulse-subtle">
                    Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-white text-black">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-600">© 2025 FinZ. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Privacy
            </Link>
            <a href="https://twitter.com/FinZ" className="text-gray-600 hover:text-green-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://discord.com/FinZ" className="text-gray-600 hover:text-green-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.078.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.249.077.077 0 00-.078-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.029.027C.533 9.045-.319 13.579.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.677 14.677 0 001.001-1.921.074.074 0 00-.041-.1 13.068 13.068 0 01-1.872-.88.077.077 0 00-.02-.008c-.134-.055-.257-.11-.375-.164a.076.076 0 01-.037-.054c-.025-.044-.047-.09-.067-.135a.073.073 0 01.027-.093c.397-.3.884-.662 1.377-1.008a.077.077 0 01.085-.008c3.947 1.797 8.219 1.797 12.132 0a.077.077 0 01.085.008c.493.346.98.708 1.377 1.008a.073.073 0 01.027.093c-.02.046-.042.091-.067.135a.076.076 0 01-.037.054c-.118.053-.24.108-.375.164a.077.077 0 00-.02.008c-.586.25-1.209.53-1.872.88a.074.074 0 00-.041.1c.296.734.67 1.426 1.001 1.921a.078.078 0 00.084.028 19.827 19.827 0 005.993-3.03.082.082 0 00.031-.057c.456-4.966-.424-9.543-3.241-13.687a.07.07 0 00-.029-.027zM8.024 15.714c-1.184 0-2.157-1.082-2.157-2.419s.965-2.419 2.157-2.419c1.21 0 2.176 1.082 2.157 2.419 0 1.337-.946 2.419-2.157 2.419zm7.952 0c-1.184 0-2.157-1.082-2.157-2.419s.965-2.419 2.157-2.419c1.21 0 2.176 1.082 2.157 2.419 0 1.337-.946 2.419-2.157 2.419z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Sticky CTA for Mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-4 right-4 z-50 md:hidden"
      >
        <Link href="/register">
          <Button className="bg-black text-white hover:bg-black/90 rounded-full p-4 shadow-lg animate-pulse-subtle">
            Join Now
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
