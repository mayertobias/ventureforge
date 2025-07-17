"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProjectStepper } from "@/components/project-stepper";
import { CreditDisplay } from "@/components/credit-display";
import { VentureForgeLoader } from "@/components/ui/venture-forge-loader";
import { Loader2, Coins, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

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

export default function ProjectPage() {
  const { data: session } = useSession();
  const params = useParams();
  const projectId = params?.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState("idea");
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        
        // Determine current step based on what's completed
        if (data.project.gtmOutput) setCurrentStep("gtm");
        else if (data.project.pitchOutput) setCurrentStep("gtm");
        else if (data.project.financialOutput) setCurrentStep("pitch");
        else if (data.project.blueprintOutput) setCurrentStep("financials");
        else if (data.project.researchOutput) setCurrentStep("blueprint");
        else if (data.project.ideaOutput) setCurrentStep("research");
        else setCurrentStep("idea");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (session) {
      fetchProject();
    }
  }, [session, fetchProject]);

  const getCompletedSteps = () => {
    if (!project) return [];
    const completed = [];
    if (project.ideaOutput) completed.push("idea");
    if (project.researchOutput) completed.push("research");
    if (project.blueprintOutput) completed.push("blueprint");
    if (project.financialOutput) completed.push("financials");
    if (project.pitchOutput) completed.push("pitch");
    if (project.gtmOutput) completed.push("gtm");
    return completed;
  };

  const handleAIGeneration = async (endpoint: string, payload: any, successMessage: string, nextStep?: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/forge/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, ...payload }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 402) {
          toast.error(
            `Insufficient credits! You need ${data.required} credits but only have ${data.current}.`,
            {
              duration: 5000,
              icon: '💳',
            }
          );
          return;
        }
        throw new Error(data.error || "Failed to generate content");
      }

      // Refresh project data
      await fetchProject();
      
      // Show success toast with animation
      toast.success(
        `🎉 ${successMessage} Used ${data.creditsUsed} credits.`,
        {
          duration: 4000,
          icon: '⚡',
          style: {
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
          },
        }
      );
      
      // Trigger credit animation if available
      if (typeof window !== 'undefined' && (window as any).animateCreditsUsed) {
        (window as any).animateCreditsUsed(data.creditsUsed);
      }
      
      // Auto-advance to next step if specified
      if (nextStep) {
        setTimeout(() => {
          setCurrentStep(nextStep);
        }, 1000);
      }
      
    } catch (error) {
      console.error(`Error in ${endpoint}:`, error);
      toast.error(
        `Failed to generate content. Please try again.`,
        {
          duration: 4000,
          icon: '❌',
        }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleIdeaGeneration = async () => {
    if (!userInput.trim()) return;
    await handleAIGeneration("idea-spark", { userInput: userInput.trim() }, "Ideas generated successfully!");
    setUserInput("");
  };

  const handleResearchGeneration = async () => {
    if (!selectedIdea) return;
    await handleAIGeneration("research-gemini", { selectedIdea }, "Market research completed!");
  };

  const handleBlueprintGeneration = async () => {
    await handleAIGeneration("blueprint", {}, "Business blueprint created!", "financials");
  };

  const handleFinancialsGeneration = async () => {
    await handleAIGeneration("financials", {}, "Financial projections completed!", "pitch");
  };

  const handlePitchGeneration = async () => {
    await handleAIGeneration("pitch", {}, "Investor pitch created!", "gtm");
  };

  const handleGTMGeneration = async () => {
    await handleAIGeneration("gtm", {}, "Go-to-market strategy completed!");
  };

  // Auto-advance based on completed steps
  const getNextStep = useCallback(() => {
    const completed = getCompletedSteps();
    if (!completed.includes("idea")) return "idea";
    
    // Don't auto-advance from idea to research if ideas exist but none selected
    if (completed.includes("idea") && !completed.includes("research")) {
      if (project?.ideaOutput && !selectedIdea) {
        return "idea"; // Stay on idea step until user selects one
      }
      return "research";
    }
    
    if (!completed.includes("blueprint")) return "blueprint";
    if (!completed.includes("financials")) return "financials";
    if (!completed.includes("pitch")) return "pitch";
    if (!completed.includes("gtm")) return "gtm";
    return "gtm"; // All completed
  }, [project, getCompletedSteps, selectedIdea]);

  // Auto-navigate to next incomplete step when project loads
  useEffect(() => {
    if (project && !isGenerating) {
      const nextStep = getNextStep();
      if (nextStep !== currentStep) {
        setCurrentStep(nextStep);
      }
    }
  }, [project, isGenerating, currentStep, getNextStep]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>
              The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">
            Created on {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        <CreditDisplay />
      </div>

      <ProjectStepper
        currentStep={currentStep}
        completedSteps={getCompletedSteps()}
        onStepClick={setCurrentStep}
      />

      {currentStep === "idea" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✨ Idea Spark
              <Badge variant="outline">5 Credits</Badge>
            </CardTitle>
            <CardDescription>
              Describe your business concept, target market, or industry interest. Our AI will generate 3 unique, viable business ideas tailored to your input.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idea-input">Your Business Concept or Interest</Label>
              <Textarea
                id="idea-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="E.g., I'm interested in sustainable technology, targeting busy professionals, or leveraging AI for small businesses..."
                rows={4}
              />
            </div>
            {isGenerating ? (
              <VentureForgeLoader 
                stage="Business Ideas"
                steps={[
                  { text: "Analyzing your concept", completed: true },
                  { text: "Researching market trends", loading: true },
                  { text: "Generating unique ideas", pending: true },
                  { text: "Validating business models", pending: true }
                ]}
              />
            ) : (
              <Button 
                onClick={handleIdeaGeneration}
                disabled={!userInput.trim()}
                className="w-full"
              >
                ✨ Generate Ideas (5 Credits)
              </Button>
            )}

            {project.ideaOutput && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Generated Ideas:</h3>
                {project.ideaOutput.ideas?.map((idea: any, index: number) => (
                  <Card key={index} className={`p-4 cursor-pointer transition-colors ${selectedIdea === idea ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`} onClick={() => setSelectedIdea(idea)}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{idea.title}</h4>
                      {selectedIdea === idea && <Badge variant="default">Selected</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{idea.concept}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Target:</span> {idea.targetNiche}
                      </div>
                      <div>
                        <span className="font-medium">Revenue:</span> {idea.revenueModel}
                      </div>
                      <div>
                        <span className="font-medium">Uniqueness:</span> {idea.uniquenessScore}/10
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Why unique:</span> {idea.uniquenessReason}
                      </div>
                    </div>
                  </Card>
                ))}
                {selectedIdea && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-muted-foreground mb-2">
                      Selected idea: <strong>{selectedIdea.title}</strong>
                    </p>
                    <Button 
                      onClick={() => setCurrentStep("research")}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Continue to Deep Research →
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === "research" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔍 Deep Research
              <Badge variant="outline">5 Credits</Badge>
            </CardTitle>
            <CardDescription>
              Conduct comprehensive market analysis for your selected business idea. This will analyze market size, competition, trends, and technology requirements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedIdea && project.ideaOutput && (
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md space-y-3">
                <p className="text-sm">Please select an idea from the previous step to continue with market research.</p>
                <Button 
                  onClick={() => setCurrentStep("idea")}
                  variant="outline"
                  className="w-full"
                >
                  ← Back to Ideas
                </Button>
              </div>
            )}
            
            {selectedIdea && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm"><strong>Selected Idea:</strong> {selectedIdea.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedIdea.concept}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setCurrentStep("idea")}
                    variant="outline"
                    className="flex-1"
                  >
                    ← Change Idea
                  </Button>
                  {isGenerating ? (
                    <VentureForgeLoader 
                      stage="Market Research"
                      steps={[
                        { text: "Gathering market intelligence", completed: true },
                        { text: "Analyzing competition", loading: true },
                        { text: "Identifying market gaps", pending: true },
                        { text: "Generating strategic insights", pending: true }
                      ]}
                    />
                  ) : (
                    <Button 
                      onClick={handleResearchGeneration}
                      className="flex-2"
                    >
                      🔍 Generate Market Research (5 Credits)
                    </Button>
                  )}
                </div>
              </div>
            )}

            {project.researchOutput && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Market Research Results:</h3>
                <div className="grid gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Market Landscape</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>TAM:</strong> {project.researchOutput.marketLandscape?.totalAddressableMarket}</p>
                      <p><strong>SAM:</strong> {project.researchOutput.marketLandscape?.serviceableAddressableMarket}</p>
                      <p><strong>Growth Rate:</strong> {project.researchOutput.marketLandscape?.marketGrowthRate}</p>
                    </div>
                  </Card>
                  
                  {project.researchOutput.competitiveLandscape && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Competitive Analysis</h4>
                      <p className="text-sm"><strong>Key Opportunity:</strong> {project.researchOutput.competitiveLandscape.competitiveGap}</p>
                    </Card>
                  )}
                </div>
                
                <Button 
                  onClick={() => setCurrentStep("blueprint")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Continue to Business Blueprint →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === "blueprint" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Blueprint Architect
              <Badge variant="outline">15 Credits</Badge>
            </CardTitle>
            <CardDescription>
              Create your comprehensive business model and strategic plan based on market research insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!project.researchOutput && (
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <p className="text-sm">Market research must be completed before creating the business blueprint.</p>
              </div>
            )}
            
            {project.researchOutput && (
              <Button 
                onClick={handleBlueprintGeneration}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Blueprint...
                  </>
                ) : (
                  <>
                    📋 Generate Business Blueprint (15 Credits)
                  </>
                )}
              </Button>
            )}

            {project.blueprintOutput && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Business Blueprint:</h3>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Core Business Model</h4>
                  <p className="text-sm"><strong>Model:</strong> {project.blueprintOutput.coreBusinessModel?.model}</p>
                  <p className="text-sm mt-2">{project.blueprintOutput.coreBusinessModel?.rationale}</p>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === "financials" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 Financial Forecaster
              <Badge variant="outline">12 Credits</Badge>
            </CardTitle>
            <CardDescription>
              Generate realistic 3-year financial projections, funding requirements, and path to profitability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!project.blueprintOutput && (
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <p className="text-sm">Business blueprint must be completed before financial projections.</p>
              </div>
            )}
            
            {project.blueprintOutput && (
              <Button 
                onClick={handleFinancialsGeneration}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Projections...
                  </>
                ) : (
                  <>
                    💰 Generate Financial Projections (12 Credits)
                  </>
                )}
              </Button>
            )}

            {project.financialOutput && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Financial Projections:</h3>
                <div className="grid gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Funding Analysis</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Seed Funding:</strong> {project.financialOutput.fundingAnalysis?.seedFunding}</p>
                      <p><strong>Runway:</strong> {project.financialOutput.fundingAnalysis?.runwayMonths}</p>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === "pitch" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Pitch Perfect
              <Badge variant="outline">8 Credits</Badge>
            </CardTitle>
            <CardDescription>
              Create an investor-ready pitch presentation and executive summary based on your complete business plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!project.financialOutput && (
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <p className="text-sm">Financial projections must be completed before creating the investor pitch.</p>
              </div>
            )}
            
            {project.financialOutput && (
              <Button 
                onClick={handlePitchGeneration}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Pitch...
                  </>
                ) : (
                  <>
                    🎯 Generate Investor Pitch (8 Credits)
                  </>
                )}
              </Button>
            )}

            {project.pitchOutput && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Investor Pitch:</h3>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Executive Summary</h4>
                  <p className="text-sm">{project.pitchOutput.executiveSummary}</p>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === "gtm" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 Go-to-Market
              <Badge variant="outline">10 Credits</Badge>
            </CardTitle>
            <CardDescription>
              Develop a comprehensive 6-month go-to-market strategy with actionable tactics and measurable goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!project.pitchOutput && (
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <p className="text-sm">Investor pitch must be completed before creating the go-to-market strategy.</p>
              </div>
            )}
            
            {project.pitchOutput && (
              <Button 
                onClick={handleGTMGeneration}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Strategy...
                  </>
                ) : (
                  <>
                    🚀 Generate GTM Strategy (10 Credits)
                  </>
                )}
              </Button>
            )}

            {project.gtmOutput && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Go-to-Market Strategy:</h3>
                <div className="grid gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Launch Timeline</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Pre-Launch:</strong> {project.gtmOutput.preLaunch?.timeline}</p>
                      <p><strong>Launch:</strong> {project.gtmOutput.launch?.timeline}</p>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}