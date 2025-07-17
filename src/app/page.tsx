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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">VentureForge AI</h1>
          </div>
          <Button onClick={() => signIn("google")} size="lg" className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          <Badge className="mb-8 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Business Intelligence
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            <span className="text-gray-900">Transform Your Ideas Into</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> 
              Investor-Ready 
            </span>
            <br />
            <span className="text-gray-900">Business Plans</span>
          </h1>
          
          <p className="text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            VentureForge AI guides you through a complete business planning process in <span className="font-bold text-blue-600">minutes, not months</span>. 
            From initial concept to comprehensive financial projections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={() => signIn("google")} 
              className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl text-lg px-8 py-4 h-auto"
            >
              <span>Start Building Your Business</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4 h-auto font-semibold"
            >
              Watch Demo
            </Button>
          </div>
          
          <p className="text-lg text-gray-600 font-medium">
            Start with <span className="font-bold text-blue-600">25 free credits</span> • No credit card required
          </p>
        </div>
      </section>

      {/* AI Modules Section */}
      <section className="container mx-auto px-4 py-20 bg-white/60 backdrop-blur-sm rounded-3xl my-16 shadow-xl border border-white/20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">Complete Business Planning Workflow</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            Our AI guides you through <span className="font-bold text-blue-600">6 specialized modules</span> to create a comprehensive business plan
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Idea Spark</CardTitle>
                <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200 font-semibold">5 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 text-base leading-relaxed">
                Generate 3 unique, viable business ideas tailored to your interests and market opportunities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Search className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Deep Research</CardTitle>
                <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 font-semibold">10 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 text-base leading-relaxed">
                Comprehensive market analysis including TAM/SAM, competitive landscape, and key trends.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Blueprint Architect</CardTitle>
                <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200 font-semibold">15 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 text-base leading-relaxed">
                Business model formulation with revenue streams, value propositions, and operational plan.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <Calculator className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Financial Forecaster</CardTitle>
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 font-semibold">12 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 text-base leading-relaxed">
                Realistic 3-year financial projections, funding requirements, and path to profitability.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                  <Presentation className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Pitch Perfect</CardTitle>
                <Badge className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border-rose-200 font-semibold">8 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 text-base leading-relaxed">
                Investor-ready pitch deck and executive summary based on your complete business plan.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                  <Target className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Go-to-Market</CardTitle>
                <Badge className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200 font-semibold">10 Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 text-base leading-relaxed">
                6-month launch strategy with actionable tactics and measurable goals for market entry.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">Why Choose VentureForge AI?</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Data-Driven Insights</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              All outputs are grounded in <span className="font-semibold text-blue-600">real market data</span> and industry benchmarks, not generic templates.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">AI-Powered Speed</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Complete business plans in <span className="font-semibold text-purple-600">hours, not months</span>. From idea to investor pitch in one session.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Professional Quality</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              <span className="font-semibold text-green-600">Investor-ready documents</span> with comprehensive analysis and clear recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl my-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">Ready to Build Your Business?</h2>
          <p className="text-2xl text-blue-100 mb-12 leading-relaxed">
            Join entrepreneurs who are turning their ideas into reality with <span className="font-bold text-white">AI-powered business intelligence</span>.
          </p>
          <Button 
            size="lg" 
            onClick={() => signIn("google")} 
            className="flex items-center space-x-3 mx-auto bg-white text-blue-600 hover:bg-blue-50 text-xl px-10 py-6 h-auto font-bold shadow-xl"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
          <p className="text-xl text-blue-100 mt-8 font-medium">
            <span className="font-bold text-white">25 free credits</span> • Complete first business plan • No commitment required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg text-gray-700 font-medium">&copy; 2025 VentureForge AI. Revolutionizing business planning with artificial intelligence.</p>
        </div>
      </footer>
    </div>
  );
}