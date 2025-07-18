"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Coins, Sparkles, TrendingUp, Zap, Trophy, Lightbulb, Target, Calendar } from "lucide-react";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { CreditDisplay } from "@/components/credit-display";
import { OnboardingTour } from "@/components/onboarding-tour";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  ideaOutput?: any;
  researchOutput?: any;
  blueprintOutput?: any;
  financialOutput?: any;
  pitchOutput?: any;
  gtmOutput?: any;
}

interface UserStats {
  projects: Project[];
  credits: number;
  totalIdeas: number;
  creditsUsed: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("Dashboard - Session status:", status);
  console.log("Dashboard - Session data:", session);

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!session) return;
      
      try {
        const [projectsRes, creditsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/user/credits')
        ]);
        
        const projectsData = await projectsRes.json();
        const creditsData = await creditsRes.json();
        
        // Calculate stats
        const projects = projectsData.projects || [];
        const totalIdeas = projects.reduce((acc: number, project: Project) => {
          return acc + (project.ideaOutput ? 1 : 0);
        }, 0);
        
        const creditsUsed = 100 - creditsData.credits; // Assuming they start with 100
        
        setUserStats({
          projects,
          credits: creditsData.credits,
          totalIdeas,
          creditsUsed
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStats();
  }, [session]);

  const getProjectProgress = (project: Project) => {
    const steps = ['ideaOutput', 'researchOutput', 'blueprintOutput', 'financialOutput', 'pitchOutput', 'gtmOutput'];
    const completed = steps.filter(step => project[step as keyof Project]).length;
    return { completed, total: steps.length };
  };

  const getRecentProjects = () => {
    if (!userStats?.projects) return [];
    return userStats.projects
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-muted-foreground">Loading session...</p>
          <p className="mt-1 text-xs text-muted-foreground">Status: {status}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle>Welcome to VentureForge AI</CardTitle>
            <CardDescription>
              Sign in to start building your next business venture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => signIn("google")} className="w-full">
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome back, {session.user?.name?.split(' ')[0] || 'Entrepreneur'}
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to build your next venture? Let&apos;s turn your ideas into reality.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <CreditDisplay />
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{userStats?.projects.length || 0}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {userStats?.projects.length ? `${userStats.projects.length} project${userStats.projects.length > 1 ? 's' : ''} created` : 'Ready to start your journey'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Forge Credits</CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Coins className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{userStats?.credits || 0}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Zap className="h-3 w-3 mr-1" />
              {userStats?.credits ? `${userStats.credits} credits remaining` : 'Loading credits...'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ideas Generated</CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{userStats?.totalIdeas || 0}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Lightbulb className="h-3 w-3 mr-1" />
              {userStats?.totalIdeas ? `${userStats.totalIdeas} idea${userStats.totalIdeas > 1 ? 's' : ''} generated` : 'Start your first project'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Plan</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <Trophy className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">Free</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Target className="h-3 w-3 mr-1" />
              Upgrade for more features
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Quick Start - Takes 2/3 width */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Ready to Build Something Amazing?</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-1">
                  Transform your business idea into a complete venture plan with AI-powered insights
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  What You&apos;ll Get:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                    Market research & competitive analysis
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                    Business model & revenue projections
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                    Go-to-market strategy & roadmap
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                    Financial projections & funding guide
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-center p-4 bg-white/60 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">⚡</div>
                  <p className="text-sm font-medium text-gray-700">Just 5 minutes</p>
                  <p className="text-xs text-gray-500">From idea to business plan</p>
                </div>
                <div className="new-project-button">
                  <NewProjectDialog />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity - Takes 1/3 width */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-gray-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your business development journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!userStats?.projects.length ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  No activity yet. Create your first project to get started!
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Projects</span>
                    <span>0</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Ideas Generated</span>
                    <span>0</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Credits Used</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Projects</span>
                    <span>{userStats.projects.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Ideas Generated</span>
                    <span>{userStats.totalIdeas}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Credits Used</span>
                    <span>{userStats.creditsUsed}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Projects</h4>
                  <div className="space-y-3">
                    {getRecentProjects().map((project) => {
                      const progress = getProjectProgress(project);
                      return (
                        <Link key={project.id} href={`/projects/${project.id}`}>
                          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="text-sm font-medium text-gray-900 truncate">{project.name}</h5>
                              <span className="text-xs text-gray-500">
                                {progress.completed}/{progress.total}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(project.createdAt).toLocaleDateString()}
                              </span>
                              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full" 
                                  style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  
                  {userStats.projects.length > 3 && (
                    <Link href="/projects">
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        View All Projects
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Tips Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
            Pro Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Be Specific</h4>
                <p className="text-xs text-gray-600 mt-1">
                  The more detailed your idea, the better our AI can help you plan
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Think Market</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Consider your target audience and their pain points
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Start Small</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Focus on one core feature or service initially
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Onboarding Tour */}
      <OnboardingTour />
    </div>
  );
}