import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">FinPlay</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="default">Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Learn Finance Through Play
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    FinPlay makes financial literacy fun and engaging through interactive gameplay, simulations, and
                    challenges designed for Gen Z.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mr-0 flex items-center justify-center">
                <div className="w-full max-w-[400px] h-[300px] bg-gradient-to-br from-primary/20 to-primary/40 rounded-xl flex items-center justify-center">
                  <div className="text-4xl font-bold text-primary">FinPlay</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover how FinPlay makes learning about finance engaging and fun
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Simulations</CardTitle>
                  <CardDescription>Experience real-world financial scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Make financial decisions in simulated environments and see the consequences in real-time.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mini-Games</CardTitle>
                  <CardDescription>Learn while having fun</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Play quick games designed to teach financial concepts in an engaging way.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quizzes & Challenges</CardTitle>
                  <CardDescription>Test your knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Take daily quizzes and complete challenges to earn XP and virtual currency.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>See your growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Track your learning journey with visual progress indicators and achievement badges.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Virtual Wallet</CardTitle>
                  <CardDescription>Practice money management</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Manage your in-game currency and learn about saving, spending, and investing.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Leaderboards</CardTitle>
                  <CardDescription>Compete with friends</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>See how you stack up against other players and challenge your friends.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 FinPlay. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
