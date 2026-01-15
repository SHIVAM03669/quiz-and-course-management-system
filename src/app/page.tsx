
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center space-y-16">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white">
            Master Any Subject with <span className="text-primary">QuizPortal</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The all-in-one platform for creating quizzes, tracking progress, and achieving your learning goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <Card className="relative overflow-hidden group hover:border-primary transition-colors">
            <CardHeader className="text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>Create courses, add lessons, and design challenging quizzes.</CardDescription>
            </CardHeader>
            <CardContent className="text-left">
              <Link href="/admin">
                <Button className="w-full group/btn">
                  Go to Admin <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:border-primary transition-colors border-2 border-primary/20 bg-primary/[0.02]">
            <CardHeader className="text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Student Portal</CardTitle>
              <CardDescription>Browse available courses and test your knowledge with interactive quizzes.</CardDescription>
            </CardHeader>
            <CardContent className="text-left">
              <Link href="/quiz">
                <Button className="w-full group/btn" variant="default">
                  Start Learning <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:border-primary transition-colors">
            <CardHeader className="text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Progress Reports</CardTitle>
              <CardDescription>Visualize your learning journey and track your quiz performance over time.</CardDescription>
            </CardHeader>
            <CardContent className="text-left">
              <Link href="/reports">
                <Button className="w-full group/btn" variant="outline">
                  View Reports <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="pt-10 border-t w-full flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
          <p>© 2024 QuizPortal. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </main>
    </div>
  );
}
