import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CreditCard, Landmark, DollarSign, TrendingUp } from "lucide-react"

export default function LearningPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Begin Learning</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Budgeting Basics</CardTitle>
                <Badge variant="outline">8/10</Badge>
              </div>
              <CardDescription>Test your budgeting knowledge</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Beginner</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">Completed today at 2:30 PM</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/budgetinglesson" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Credit Score</CardTitle>
                <Badge variant="outline">Daily</Badge>
              </div>
              <CardDescription>Test your knowledge about credit scores</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">

                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span>Intermediate</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">New questions available today</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/creditscorelesson" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Investment Basics</CardTitle>
                <Badge variant="outline">New</Badge>
              </div>
              <CardDescription>Test your investment knowledge</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">

                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Intermediate</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">Earn up to 30 coins for completion</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/investmentlesson" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Banking Services</CardTitle>
                <Badge variant="outline">Beginner</Badge>
              </div>
              <CardDescription>Learn about different banking services</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">

                </div>
                <div className="flex items-center gap-1">
                  <Landmark className="h-4 w-4" />
                  <span>Beginner</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">Earn up to 20 coins for completion</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/bankinglesson" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Student Loan management</CardTitle>
                <Badge variant="outline">Daily</Badge>
              </div>
              <CardDescription>Learn all about Student Loans</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">

                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span>Intermediate</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">New questions available today</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/learning/studentloanmanagement" className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
