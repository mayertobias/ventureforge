"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, BarChart3, FileText, Calculator, Presentation, Target, Search } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>
              You&apos;re already signed in. Ready to build your next business?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold">VentureForge AI</h1>
          </div>
          <Button onClick={() => signIn("google")} className="flex items-center space-x-2">
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-800">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Business Intelligence
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Transform Your Ideas Into
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse"> 
              Investor-Ready 
            </span>
            Business Plans
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            VentureForge AI guides you through a complete business planning process in minutes, 
            not months. From initial concept to comprehensive financial projections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => signIn("google")} className="flex items-center space-x-2">
              <span>Start Building Your Business</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Start with 25 free credits • No credit card required
          </p>
        </div>
      </section>

      {/* AI Modules Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Complete Business Planning Workflow</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI guides you through 6 specialized modules to create a comprehensive business plan
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Idea Spark</CardTitle>
                <Badge variant="outline" className="text-xs">5 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate 3 unique, viable business ideas tailored to your interests and market opportunities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Deep Research</CardTitle>
                <Badge variant="outline" className="text-xs">10 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive market analysis including TAM/SAM, competitive landscape, and key trends.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Blueprint Architect</CardTitle>
                <Badge variant="outline" className="text-xs">15 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Business model formulation with revenue streams, value propositions, and operational plan.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Financial Forecaster</CardTitle>
                <Badge variant="outline" className="text-xs">12 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Realistic 3-year financial projections, funding requirements, and path to profitability.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Presentation className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Pitch Perfect</CardTitle>
                <Badge variant="outline" className="text-xs">8 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Investor-ready pitch deck and executive summary based on your complete business plan.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Go-to-Market</CardTitle>
                <Badge variant="outline" className="text-xs">10 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                6-month launch strategy with actionable tactics and measurable goals for market entry.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose VentureForge AI?</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Data-Driven Insights</h3>
            <p className="text-muted-foreground">
              All outputs are grounded in real market data and industry benchmarks, not generic templates.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Speed</h3>
            <p className="text-muted-foreground">
              Complete business plans in hours, not months. From idea to investor pitch in one session.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Professional Quality</h3>
            <p className="text-muted-foreground">
              Investor-ready documents with comprehensive analysis and clear recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Business?</h2>
          <p className="text-muted-foreground mb-8">
            Join entrepreneurs who are turning their ideas into reality with AI-powered business intelligence.
          </p>
          <Button size="lg" onClick={() => signIn("google")} className="flex items-center space-x-2 mx-auto">
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            25 free credits • Complete first business plan • No commitment required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 VentureForge AI. Revolutionizing business planning with artificial intelligence.</p>
        </div>
      </footer>
    </div>
  );
}