"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProjectStepper } from "@/components/project-stepper";
import { CreditDisplay } from "@/components/credit-display";
import { VentureForgeLoader } from "@/components/ui/venture-forge-loader";
import { CompleteReportView } from "@/components/complete-report-view";
import { Loader2, Coins, ArrowLeft, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { ClientStorageService } from "@/lib/client-storage";
import Link from "next/link";
import toast from "react-hot-toast";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  storageMode?: 'MEMORY_ONLY' | 'PERSISTENT';
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
  const searchParams = useSearchParams();
  const projectId = params?.id as string;
  const stepFromUrl = searchParams?.get('step');
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState("idea");
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [hasAutoNavigated, setHasAutoNavigated] = useState(false);

  const fetchProject = useCallback(async (skipStepUpdate = false) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        const dbProject = data.project;
        
        // For MEMORY_ONLY projects, merge with client-side data
        let finalProject;
        if (dbProject.storageMode === 'MEMORY_ONLY') {
          const clientProject = ClientStorageService.getProject(projectId);
          
          if (clientProject) {
            // Merge database metadata with client AI responses
            finalProject = {
              ...dbProject,
              ideaOutput: clientProject.ideaOutput,
              researchOutput: clientProject.researchOutput,
              blueprintOutput: clientProject.blueprintOutput,
              financialOutput: clientProject.financialOutput,
              pitchOutput: clientProject.pitchOutput,
              gtmOutput: clientProject.gtmOutput,
            };
            setProject(finalProject);
            console.log('[CLIENT_STORAGE] Merged client data with database metadata');
          } else {
            // Initialize client storage for this project
            ClientStorageService.initializeProject(projectId, dbProject.name);
            finalProject = dbProject;
            setProject(dbProject);
            console.log('[CLIENT_STORAGE] Initialized client storage for memory-only project');
          }
        } else {
          // PERSISTENT projects use database data directly
          finalProject = dbProject;
          setProject(dbProject);
          console.log('[DB_STORAGE] Using database data for persistent project');
        }
        
        // Determine current step based on URL parameter or what's completed
        if (!skipStepUpdate) {
          if (stepFromUrl) {
            // Validate that the step from URL is accessible
            const validSteps = ["idea", "research", "blueprint", "financials", "pitch", "gtm", "complete"];
            if (validSteps.includes(stepFromUrl)) {
              setCurrentStep(stepFromUrl);
            }
          } else {
            // Auto-set based on completion status only if no URL step specified
            // Use finalProject (merged data) instead of data.project for accurate step determination
            if (finalProject.gtmOutput) setCurrentStep("complete");
            else if (finalProject.pitchOutput) setCurrentStep("gtm");
            else if (finalProject.financialOutput) setCurrentStep("pitch");
            else if (finalProject.blueprintOutput) setCurrentStep("financials");
            else if (finalProject.researchOutput) setCurrentStep("blueprint");
            else if (finalProject.ideaOutput) setCurrentStep("research");
            else setCurrentStep("idea");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId, stepFromUrl]);

  useEffect(() => {
    if (session) {
      fetchProject();
    }
  }, [session, fetchProject]);

  const getCompletedSteps = useCallback(() => {
    if (!project) return [];
    const completed = [];
    if (project.ideaOutput) completed.push("idea");
    if (project.researchOutput) completed.push("research");
    if (project.blueprintOutput) completed.push("blueprint");
    if (project.financialOutput) completed.push("financials");
    if (project.pitchOutput) completed.push("pitch");
    if (project.gtmOutput) completed.push("gtm");
    return completed;
  }, [project]);

  const handleAIGeneration = async (
    endpoint: string, 
    payload: any, 
    successMessage: string, 
    nextStep?: string,
    stepField?: 'ideaOutput' | 'researchOutput' | 'blueprintOutput' | 'financialOutput' | 'pitchOutput' | 'gtmOutput'
  ) => {
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

      // For MEMORY_ONLY projects, also save to client storage
      if (project?.storageMode === 'MEMORY_ONLY' && stepField && data.output) {
        ClientStorageService.saveAIResponse(projectId, stepField, data.output);
        console.log(`[CLIENT_STORAGE] Saved ${stepField} to client storage`);
      }
      
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
      
      // Refresh project data (skip step update to preserve current step)
      await fetchProject(true);
      
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
    await handleAIGeneration("idea-spark", { userInput: userInput.trim() }, "Ideas generated successfully!", undefined, "ideaOutput");
    setUserInput("");
  };

  const handleResearchGeneration = async () => {
    if (!selectedIdea) return;
    await handleAIGeneration("research-gemini", { selectedIdea }, "Market research completed!", undefined, "researchOutput");
  };

  const handleBlueprintGeneration = async () => {
    const payload = project?.storageMode === 'MEMORY_ONLY' 
      ? { researchData: project.researchOutput }
      : {};
    await handleAIGeneration("blueprint", payload, "Business blueprint created!", undefined, "blueprintOutput");
  };

  const handleFinancialsGeneration = async () => {
    const payload = project?.storageMode === 'MEMORY_ONLY' 
      ? { blueprintData: project.blueprintOutput }
      : {};
    await handleAIGeneration("financials", payload, "Financial projections completed!", undefined, "financialOutput");
  };

  const handlePitchGeneration = async () => {
    const payload = project?.storageMode === 'MEMORY_ONLY' 
      ? { 
          allData: {
            idea: project.ideaOutput,
            research: project.researchOutput,
            blueprint: project.blueprintOutput,
            financials: project.financialOutput
          }
        }
      : {};
    await handleAIGeneration("pitch", payload, "Investor pitch created!", undefined, "pitchOutput");
  };

  const handleGTMGeneration = async () => {
    const payload = project?.storageMode === 'MEMORY_ONLY' 
      ? { 
          allData: {
            idea: project.ideaOutput,
            research: project.researchOutput,
            blueprint: project.blueprintOutput,
            financials: project.financialOutput,
            pitch: project.pitchOutput
          }
        }
      : {};
    await handleAIGeneration("gtm", payload, "Go-to-market strategy completed!", undefined, "gtmOutput");
  };

  // Navigation helpers
  const stepOrder = ["idea", "research", "blueprint", "financials", "pitch", "gtm", "complete"];
  const getCurrentStepIndex = () => stepOrder.indexOf(currentStep);
  const canGoPrevious = () => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex > 0;
  };
  const canGoNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex >= stepOrder.length - 1) return false;
    const completed = getCompletedSteps();
    const nextStep = stepOrder[currentIndex + 1];
    // Can go to next step if current step is completed
    return completed.includes(currentStep) || nextStep === "complete";
  };
  
  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
      setHasAutoNavigated(true); // Prevent auto-navigation interference
    }
  };
  
  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      setCurrentStep(nextStep);
      setHasAutoNavigated(true); // Prevent auto-navigation interference
    }
  };

  // Auto-advance based on completed steps - only run once when project loads
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
    if (completed.includes("gtm")) return "complete";
    return "gtm";
  }, [project, getCompletedSteps, selectedIdea]);

  // Auto-navigate to next incomplete step when project loads - only once
  useEffect(() => {
    if (project && !isGenerating && !stepFromUrl && !hasAutoNavigated) {
      const nextStep = getNextStep();
      if (nextStep !== currentStep) {
        setCurrentStep(nextStep);
      }
      setHasAutoNavigated(true);
    }
  }, [project, isGenerating, stepFromUrl, hasAutoNavigated, getNextStep, currentStep]);

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
        onStepClick={(step) => {
          // Allow navigation to any completed step or current step
          const completed = getCompletedSteps();
          if (completed.includes(step) || step === currentStep || step === "complete") {
            setCurrentStep(step);
            setHasAutoNavigated(true); // Prevent auto-navigation interference
          }
        }}
      />

      {/* Navigation buttons */}
      {currentStep !== "complete" && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={!canGoPrevious()}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={goToNextStep}
            disabled={!canGoNext()}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

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
                {console.log('[DEBUG] About to render ideas:', project.ideaOutput.ideas)}
                {project.ideaOutput.ideas && project.ideaOutput.ideas.length > 0 ? (
                  project.ideaOutput.ideas.map((idea: any, index: number) => (
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
                ))
                ) : (
                  <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Debug:</strong> Ideas were generated but the data structure is unexpected.
                    </p>
                    <p className="text-xs text-yellow-700 mt-2">
                      Raw data: {JSON.stringify(project.ideaOutput, null, 2)}
                    </p>
                  </div>
                )}
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
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Market Research Results:</h3>
                  {project.researchOutput._fallback && (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        ⚠️ AI Service Error
                      </Badge>
                      <Button
                        onClick={handleResearchGeneration}
                        disabled={isGenerating}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        🔄 Regenerate Research
                      </Button>
                    </div>
                  )}
                </div>
                
                {project.researchOutput._fallback && (
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
                    <div className="flex items-start gap-2">
                      <div className="text-amber-600 mt-0.5">⚠️</div>
                      <div>
                        <p className="text-sm font-medium text-amber-800">Research Generation Incomplete</p>
                        <p className="text-sm text-amber-700 mt-1">
                          {project.researchOutput._reason || "The AI service encountered an issue while conducting market research. Please try regenerating for a complete analysis."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid gap-4">
                  {/* Market Landscape */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      📊 Market Landscape
                    </h4>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {project.researchOutput.marketLandscape?.totalAddressableMarket || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Addressable Market</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {project.researchOutput.marketLandscape?.serviceableAddressableMarket || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">Serviceable Addressable Market</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {project.researchOutput.marketLandscape?.marketGrowthRate || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">Market Growth Rate</div>
                      </div>
                    </div>
                    {project.researchOutput.marketLandscape?.keyTrends && (
                      <div className="mt-3">
                        <p className="text-sm"><strong>Key Trends:</strong> {project.researchOutput.marketLandscape.keyTrends}</p>
                      </div>
                    )}
                  </Card>
                  
                  {/* Competitive Landscape */}
                  {project.researchOutput.competitiveLandscape && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🏆 Competitive Analysis
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm"><strong>Key Opportunity:</strong></p>
                          <p className="text-sm text-muted-foreground">{project.researchOutput.competitiveLandscape.competitiveGap}</p>
                        </div>
                        {project.researchOutput.competitiveLandscape.mainCompetitors && (
                          <div>
                            <p className="text-sm"><strong>Main Competitors:</strong></p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.researchOutput.competitiveLandscape.mainCompetitors.map((competitor: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">{competitor}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.researchOutput.competitiveLandscape.competitiveAdvantages && (
                          <div>
                            <p className="text-sm"><strong>Competitive Advantages:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.researchOutput.competitiveLandscape.competitiveAdvantages.map((advantage: string, index: number) => (
                                <li key={index}>{advantage}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Target Customer Analysis */}
                  {project.researchOutput.targetCustomerAnalysis && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🎯 Target Customer Analysis
                      </h4>
                      <div className="space-y-3">
                        {project.researchOutput.targetCustomerAnalysis.primarySegment && (
                          <div>
                            <p className="text-sm"><strong>Primary Segment:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.researchOutput.targetCustomerAnalysis.primarySegment}</p>
                          </div>
                        )}
                        {project.researchOutput.targetCustomerAnalysis.customerPainPoints && (
                          <div>
                            <p className="text-sm"><strong>Pain Points:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.researchOutput.targetCustomerAnalysis.customerPainPoints.map((pain: string, index: number) => (
                                <li key={index}>{pain}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.researchOutput.targetCustomerAnalysis.buyingBehavior && (
                          <div>
                            <p className="text-sm"><strong>Buying Behavior:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.researchOutput.targetCustomerAnalysis.buyingBehavior}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Technology Analysis */}
                  {project.researchOutput.technologyAnalysis && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ⚡ Technology Analysis
                      </h4>
                      <div className="space-y-3">
                        {project.researchOutput.technologyAnalysis.requiredTechnologies && (
                          <div>
                            <p className="text-sm"><strong>Required Technologies:</strong></p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.researchOutput.technologyAnalysis.requiredTechnologies.map((tech: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.researchOutput.technologyAnalysis.implementationComplexity && (
                          <div>
                            <p className="text-sm"><strong>Implementation Complexity:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.researchOutput.technologyAnalysis.implementationComplexity}</p>
                          </div>
                        )}
                        {project.researchOutput.technologyAnalysis.developmentTimeline && (
                          <div>
                            <p className="text-sm"><strong>Development Timeline:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.researchOutput.technologyAnalysis.developmentTimeline}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Regulatory Considerations */}
                  {project.researchOutput.regulatoryConsiderations && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ⚖️ Regulatory Considerations
                      </h4>
                      <div className="space-y-3">
                        {project.researchOutput.regulatoryConsiderations.relevantRegulations && (
                          <div>
                            <p className="text-sm"><strong>Relevant Regulations:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.researchOutput.regulatoryConsiderations.relevantRegulations.map((reg: string, index: number) => (
                                <li key={index}>{reg}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.researchOutput.regulatoryConsiderations.complianceRequirements && (
                          <div>
                            <p className="text-sm"><strong>Compliance Requirements:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.researchOutput.regulatoryConsiderations.complianceRequirements}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
                
                {!project.researchOutput._fallback && (
                  <Button 
                    onClick={() => setCurrentStep("blueprint")}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Continue to Business Blueprint →
                  </Button>
                )}
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
              isGenerating ? (
                <VentureForgeLoader 
                  stage="Business Blueprint"
                  steps={[
                    { text: "Analyzing market research", completed: true },
                    { text: "Designing business model", loading: true },
                    { text: "Crafting value proposition", pending: true },
                    { text: "Building strategic framework", pending: true }
                  ]}
                />
              ) : (
                <Button 
                  onClick={handleBlueprintGeneration}
                  className="w-full"
                >
                  📋 Generate Business Blueprint (15 Credits)
                </Button>
              )
            )}

            {project.blueprintOutput && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Business Blueprint:</h3>
                  {project.blueprintOutput._fallback && (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        ⚠️ AI Service Error
                      </Badge>
                      <Button
                        onClick={handleBlueprintGeneration}
                        disabled={isGenerating}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        🔄 Regenerate Blueprint
                      </Button>
                    </div>
                  )}
                </div>
                
                {project.blueprintOutput._fallback && (
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
                    <div className="flex items-start gap-2">
                      <div className="text-amber-600 mt-0.5">⚠️</div>
                      <div>
                        <p className="text-sm font-medium text-amber-800">Blueprint Generation Incomplete</p>
                        <p className="text-sm text-amber-700 mt-1">
                          {project.blueprintOutput._reason || "The AI service encountered an issue while generating your business blueprint. Please try regenerating for a complete analysis."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid gap-4">
                  {/* Executive Summary */}
                  {project.blueprintOutput.executiveSummary && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📋 Executive Summary
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.executiveSummary.businessConcept && (
                          <div>
                            <p className="text-sm"><strong>Business Concept:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.executiveSummary.businessConcept}</p>
                          </div>
                        )}
                        {project.blueprintOutput.executiveSummary.marketOpportunity && (
                          <div>
                            <p className="text-sm"><strong>Market Opportunity:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.executiveSummary.marketOpportunity}</p>
                          </div>
                        )}
                        {project.blueprintOutput.executiveSummary.uniqueAdvantage && (
                          <div>
                            <p className="text-sm"><strong>Unique Advantage:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.executiveSummary.uniqueAdvantage}</p>
                          </div>
                        )}
                        {project.blueprintOutput.executiveSummary.revenueProjection && (
                          <div>
                            <p className="text-sm"><strong>Revenue Projection:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.executiveSummary.revenueProjection}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Core Business Model */}
                  {project.blueprintOutput.coreBusinessModel && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🏗️ Core Business Model
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.coreBusinessModel.primaryModel && (
                          <div>
                            <p className="text-sm"><strong>Primary Model:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.coreBusinessModel.primaryModel}</p>
                          </div>
                        )}
                        {project.blueprintOutput.coreBusinessModel.rationale && (
                          <div>
                            <p className="text-sm"><strong>Rationale:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.coreBusinessModel.rationale}</p>
                          </div>
                        )}
                        {project.blueprintOutput.coreBusinessModel.revenueLogic && (
                          <div>
                            <p className="text-sm"><strong>Revenue Logic:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.coreBusinessModel.revenueLogic}</p>
                          </div>
                        )}
                        {project.blueprintOutput.coreBusinessModel.businessModelCanvas && (
                          <div>
                            <p className="text-sm"><strong>Business Model Canvas:</strong></p>
                            <div className="mt-2 space-y-2">
                              {project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners && Array.isArray(project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners) && (
                                <div>
                                  <p className="text-xs font-medium">Key Partners:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners.map((partner: string, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs">{partner}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities && Array.isArray(project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities) && (
                                <div>
                                  <p className="text-xs font-medium">Key Activities:</p>
                                  <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                                    {project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities.map((activity: string, index: number) => (
                                      <li key={index}>{activity}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources && Array.isArray(project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources) && (
                                <div>
                                  <p className="text-xs font-medium">Key Resources:</p>
                                  <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                                    {project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources.map((resource: string, index: number) => (
                                      <li key={index}>{resource}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {project.blueprintOutput.coreBusinessModel.businessModelCanvas.costStructure && Array.isArray(project.blueprintOutput.coreBusinessModel.businessModelCanvas.costStructure) && (
                                <div>
                                  <p className="text-xs font-medium">Cost Structure:</p>
                                  <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                                    {project.blueprintOutput.coreBusinessModel.businessModelCanvas.costStructure.map((cost: string, index: number) => (
                                      <li key={index}>{cost}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Revenue Architecture */}
                  {project.blueprintOutput.revenueArchitecture && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        💰 Revenue Architecture
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.revenueArchitecture.primaryStreams && Array.isArray(project.blueprintOutput.revenueArchitecture.primaryStreams) && (
                          <div>
                            <p className="text-sm"><strong>Primary Revenue Streams:</strong></p>
                            <div className="mt-2 space-y-3">
                              {project.blueprintOutput.revenueArchitecture.primaryStreams.map((stream: any, index: number) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-md">
                                  <p className="text-sm font-medium">{stream.streamName}</p>
                                  <div className="mt-2 space-y-1">
                                    {stream.model && typeof stream.model === 'string' && (
                                      <p className="text-xs"><strong>Model:</strong> {stream.model}</p>
                                    )}
                                    {stream.targetSegment && typeof stream.targetSegment === 'string' && (
                                      <p className="text-xs"><strong>Target:</strong> {stream.targetSegment}</p>
                                    )}
                                    {stream.pricingStrategy && typeof stream.pricingStrategy === 'string' && (
                                      <p className="text-xs"><strong>Pricing:</strong> {stream.pricingStrategy}</p>
                                    )}
                                    {stream.justification && typeof stream.justification === 'string' && (
                                      <p className="text-xs"><strong>Justification:</strong> {stream.justification}</p>
                                    )}
                                    {stream.year3Projection && typeof stream.year3Projection === 'string' && (
                                      <p className="text-xs"><strong>Year 3 Projection:</strong> {stream.year3Projection}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.blueprintOutput.revenueArchitecture.pricingPhilosophy && (
                          <div>
                            <p className="text-sm"><strong>Pricing Philosophy:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.revenueArchitecture.pricingPhilosophy}</p>
                          </div>
                        )}
                        {project.blueprintOutput.revenueArchitecture.monetizationTimeline && (
                          <div>
                            <p className="text-sm"><strong>Monetization Timeline:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.revenueArchitecture.monetizationTimeline}</p>
                          </div>
                        )}
                        {project.blueprintOutput.revenueArchitecture.unitEconomics && (
                          <div>
                            <p className="text-sm"><strong>Unit Economics:</strong></p>
                            <div className="mt-1 space-y-1">
                              {project.blueprintOutput.revenueArchitecture.unitEconomics.averageRevenuePerUser && (
                                <p className="text-xs"><strong>ARPU:</strong> {project.blueprintOutput.revenueArchitecture.unitEconomics.averageRevenuePerUser}</p>
                              )}
                              {project.blueprintOutput.revenueArchitecture.unitEconomics.customerAcquisitionCost && (
                                <p className="text-xs"><strong>CAC:</strong> {project.blueprintOutput.revenueArchitecture.unitEconomics.customerAcquisitionCost}</p>
                              )}
                              {project.blueprintOutput.revenueArchitecture.unitEconomics.lifetimeValue && (
                                <p className="text-xs"><strong>LTV:</strong> {project.blueprintOutput.revenueArchitecture.unitEconomics.lifetimeValue}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Customer Strategy */}
                  {project.blueprintOutput.customerStrategy && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        👥 Customer Strategy
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.customerStrategy.targetSegments && Array.isArray(project.blueprintOutput.customerStrategy.targetSegments) && (
                          <div>
                            <p className="text-sm"><strong>Target Segments:</strong></p>
                            <div className="mt-2 space-y-2">
                              {project.blueprintOutput.customerStrategy.targetSegments.map((segment: any, index: number) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-md">
                                  <p className="text-sm font-medium">{segment.segmentName}</p>
                                  <div className="mt-1 space-y-1">
                                    {segment.marketSize && typeof segment.marketSize === 'string' && (
                                      <p className="text-xs"><strong>Size:</strong> {segment.marketSize}</p>
                                    )}
                                    {segment.painPoints && typeof segment.painPoints === 'string' && (
                                      <p className="text-xs"><strong>Pain Points:</strong> {segment.painPoints}</p>
                                    )}
                                    {segment.valueProposition && typeof segment.valueProposition === 'string' && (
                                      <p className="text-xs"><strong>Value Prop:</strong> {segment.valueProposition}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.blueprintOutput.customerStrategy.customerJourney && (
                          <div>
                            <p className="text-sm"><strong>Customer Journey:</strong></p>
                            <div className="mt-2 space-y-1">
                              {project.blueprintOutput.customerStrategy.customerJourney.awareness && (
                                <p className="text-xs"><strong>Awareness:</strong> {project.blueprintOutput.customerStrategy.customerJourney.awareness}</p>
                              )}
                              {project.blueprintOutput.customerStrategy.customerJourney.consideration && (
                                <p className="text-xs"><strong>Consideration:</strong> {project.blueprintOutput.customerStrategy.customerJourney.consideration}</p>
                              )}
                              {project.blueprintOutput.customerStrategy.customerJourney.decision && (
                                <p className="text-xs"><strong>Decision:</strong> {project.blueprintOutput.customerStrategy.customerJourney.decision}</p>
                              )}
                              {project.blueprintOutput.customerStrategy.customerJourney.retention && (
                                <p className="text-xs"><strong>Retention:</strong> {project.blueprintOutput.customerStrategy.customerJourney.retention}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Operational Blueprint */}
                  {project.blueprintOutput.operationalBlueprint && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ⚙️ Operational Blueprint
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.operationalBlueprint.coreOperations && Array.isArray(project.blueprintOutput.operationalBlueprint.coreOperations) && (
                          <div>
                            <p className="text-sm"><strong>Core Operations:</strong></p>
                            <div className="mt-2 space-y-3">
                              {project.blueprintOutput.operationalBlueprint.coreOperations.map((operation: any, index: number) => (
                                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  <p className="text-sm font-medium text-blue-800">{operation?.operationName || `Operation ${index + 1}`}</p>
                                  <div className="mt-2 space-y-1">
                                    {operation?.description && (
                                      <p className="text-xs text-blue-700"><strong>Description:</strong> {operation.description}</p>
                                    )}
                                    {operation?.keyPersonnel && (
                                      <p className="text-xs text-blue-700"><strong>Key Personnel:</strong> {operation.keyPersonnel}</p>
                                    )}
                                    {operation?.toolsAndSystems && (
                                      <p className="text-xs text-blue-700"><strong>Tools & Systems:</strong> {operation.toolsAndSystems}</p>
                                    )}
                                    {operation?.scalingStrategy && (
                                      <p className="text-xs text-blue-700"><strong>Scaling Strategy:</strong> {operation.scalingStrategy}</p>
                                    )}
                                    {operation?.qualityMetrics && (
                                      <p className="text-xs text-blue-700"><strong>Quality Metrics:</strong> {operation.qualityMetrics}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.blueprintOutput.operationalBlueprint.technologyArchitecture && (
                          <div>
                            <p className="text-sm"><strong>Technology Architecture:</strong></p>
                            <div className="mt-2 space-y-1">
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.frontend && (
                                <p className="text-xs"><strong>Frontend:</strong> {project.blueprintOutput.operationalBlueprint.technologyArchitecture.frontend}</p>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.backend && (
                                <p className="text-xs"><strong>Backend:</strong> {project.blueprintOutput.operationalBlueprint.technologyArchitecture.backend}</p>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.database && (
                                <p className="text-xs"><strong>Database:</strong> {project.blueprintOutput.operationalBlueprint.technologyArchitecture.database}</p>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.infrastructure && (
                                <p className="text-xs"><strong>Infrastructure:</strong> {project.blueprintOutput.operationalBlueprint.technologyArchitecture.infrastructure}</p>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.aiMlStack && (
                                <p className="text-xs"><strong>AI/ML Stack:</strong> {project.blueprintOutput.operationalBlueprint.technologyArchitecture.aiMlStack}</p>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.securityCompliance && (
                                <p className="text-xs"><strong>Security & Compliance:</strong> {project.blueprintOutput.operationalBlueprint.technologyArchitecture.securityCompliance}</p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {project.blueprintOutput.operationalBlueprint.qualityAssurance && typeof project.blueprintOutput.operationalBlueprint.qualityAssurance === 'object' && (
                          <div>
                            <p className="text-sm"><strong>Quality Assurance:</strong></p>
                            <div className="mt-2 space-y-1">
                              {project.blueprintOutput.operationalBlueprint.qualityAssurance.productQuality && typeof project.blueprintOutput.operationalBlueprint.qualityAssurance.productQuality === 'string' && (
                                <p className="text-xs"><strong>Product Quality:</strong> {project.blueprintOutput.operationalBlueprint.qualityAssurance.productQuality}</p>
                              )}
                              {project.blueprintOutput.operationalBlueprint.qualityAssurance.serviceQuality && typeof project.blueprintOutput.operationalBlueprint.qualityAssurance.serviceQuality === 'string' && (
                                <p className="text-xs"><strong>Service Quality:</strong> {project.blueprintOutput.operationalBlueprint.qualityAssurance.serviceQuality}</p>
                              )}
                              {project.blueprintOutput.operationalBlueprint.qualityAssurance.dataQuality && typeof project.blueprintOutput.operationalBlueprint.qualityAssurance.dataQuality === 'string' && (
                                <p className="text-xs"><strong>Data Quality:</strong> {project.blueprintOutput.operationalBlueprint.qualityAssurance.dataQuality}</p>
                              )}
                              {project.blueprintOutput.operationalBlueprint.qualityAssurance.continuousImprovement && typeof project.blueprintOutput.operationalBlueprint.qualityAssurance.continuousImprovement === 'string' && (
                                <p className="text-xs"><strong>Continuous Improvement:</strong> {project.blueprintOutput.operationalBlueprint.qualityAssurance.continuousImprovement}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Go-to-Market Execution */}
                  {project.blueprintOutput.goToMarketExecution && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🚀 Go-to-Market Execution
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.goToMarketExecution.launchStrategy && typeof project.blueprintOutput.goToMarketExecution.launchStrategy === 'object' && (
                          <div>
                            <p className="text-sm"><strong>Launch Strategy:</strong></p>
                            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                              {project.blueprintOutput.goToMarketExecution.launchStrategy.mvpDefinition && (
                                <p className="text-xs text-green-700 mb-1"><strong>MVP Definition:</strong> {project.blueprintOutput.goToMarketExecution.launchStrategy.mvpDefinition}</p>
                              )}
                              {project.blueprintOutput.goToMarketExecution.launchStrategy.targetDate && (
                                <p className="text-xs text-green-700 mb-1"><strong>Target Date:</strong> {project.blueprintOutput.goToMarketExecution.launchStrategy.targetDate}</p>
                              )}
                              {project.blueprintOutput.goToMarketExecution.launchStrategy.initialMarket && (
                                <p className="text-xs text-green-700 mb-1"><strong>Initial Market:</strong> {project.blueprintOutput.goToMarketExecution.launchStrategy.initialMarket}</p>
                              )}
                              {project.blueprintOutput.goToMarketExecution.launchStrategy.successMetrics && (
                                <p className="text-xs text-green-700"><strong>Success Metrics:</strong> {project.blueprintOutput.goToMarketExecution.launchStrategy.successMetrics}</p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {project.blueprintOutput.goToMarketExecution.acquisitionChannels && Array.isArray(project.blueprintOutput.goToMarketExecution.acquisitionChannels) && (
                          <div>
                            <p className="text-sm"><strong>Acquisition Channels:</strong></p>
                            <div className="mt-2 space-y-3">
                              {project.blueprintOutput.goToMarketExecution.acquisitionChannels.map((channel: any, index: number) => (
                                <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                                  <p className="text-sm font-medium text-purple-800">{channel.channel || `Channel ${index + 1}`}</p>
                                  <div className="mt-2 space-y-1">
                                    {channel.strategy && typeof channel.strategy === 'string' && (
                                      <p className="text-xs text-purple-700"><strong>Strategy:</strong> {channel.strategy}</p>
                                    )}
                                    {channel.investment && typeof channel.investment === 'string' && (
                                      <p className="text-xs text-purple-700"><strong>Investment:</strong> {channel.investment}</p>
                                    )}
                                    {channel.expectedResults && typeof channel.expectedResults === 'string' && (
                                      <p className="text-xs text-purple-700"><strong>Expected Results:</strong> {channel.expectedResults}</p>
                                    )}
                                    {channel.scalability && typeof channel.scalability === 'string' && (
                                      <p className="text-xs text-purple-700"><strong>Scalability:</strong> {channel.scalability}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {project.blueprintOutput.goToMarketExecution.partnershipStrategy && typeof project.blueprintOutput.goToMarketExecution.partnershipStrategy === 'object' && (
                          <div>
                            <p className="text-sm"><strong>Partnership Strategy:</strong></p>
                            <div className="mt-2 space-y-2">
                              {project.blueprintOutput.goToMarketExecution.partnershipStrategy.strategicPartnerships && Array.isArray(project.blueprintOutput.goToMarketExecution.partnershipStrategy.strategicPartnerships) && (
                                <div>
                                  <p className="text-xs font-medium">Strategic Partnerships:</p>
                                  <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                                    {project.blueprintOutput.goToMarketExecution.partnershipStrategy.strategicPartnerships.map((partner: string, index: number) => (
                                      <li key={index}>{partner}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {project.blueprintOutput.goToMarketExecution.partnershipStrategy.channelPartnerships && typeof project.blueprintOutput.goToMarketExecution.partnershipStrategy.channelPartnerships === 'string' && (
                                <div>
                                  <p className="text-xs font-medium">Channel Partnerships:</p>
                                  <p className="text-xs text-muted-foreground">{project.blueprintOutput.goToMarketExecution.partnershipStrategy.channelPartnerships}</p>
                                </div>
                              )}
                              {project.blueprintOutput.goToMarketExecution.partnershipStrategy.technologyPartnerships && typeof project.blueprintOutput.goToMarketExecution.partnershipStrategy.technologyPartnerships === 'string' && (
                                <div>
                                  <p className="text-xs font-medium">Technology Partnerships:</p>
                                  <p className="text-xs text-muted-foreground">{project.blueprintOutput.goToMarketExecution.partnershipStrategy.technologyPartnerships}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Competitive Strategy */}
                  {project.blueprintOutput.competitiveStrategy && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🎯 Competitive Strategy
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.competitiveStrategy.sustainableAdvantages && Array.isArray(project.blueprintOutput.competitiveStrategy.sustainableAdvantages) && (
                          <div>
                            <p className="text-sm"><strong>Sustainable Advantages:</strong></p>
                            <div className="mt-2 space-y-3">
                              {project.blueprintOutput.competitiveStrategy.sustainableAdvantages.map((advantage: any, index: number) => (
                                <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                                  <p className="text-sm font-medium text-orange-800">{advantage.advantage || `Advantage ${index + 1}`}</p>
                                  <div className="mt-2 space-y-1">
                                    {advantage.description && typeof advantage.description === 'string' && (
                                      <p className="text-xs text-orange-700"><strong>Description:</strong> {advantage.description}</p>
                                    )}
                                    {advantage.defensibility && typeof advantage.defensibility === 'string' && (
                                      <p className="text-xs text-orange-700"><strong>Defensibility:</strong> {advantage.defensibility}</p>
                                    )}
                                    {advantage.strengthening && typeof advantage.strengthening === 'string' && (
                                      <p className="text-xs text-orange-700"><strong>Strengthening:</strong> {advantage.strengthening}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {project.blueprintOutput.competitiveStrategy.competitiveResponse && typeof project.blueprintOutput.competitiveStrategy.competitiveResponse === 'object' && (
                          <div>
                            <p className="text-sm"><strong>Competitive Response:</strong></p>
                            <div className="mt-2 space-y-2">
                              {project.blueprintOutput.competitiveStrategy.competitiveResponse.directCompetitors && typeof project.blueprintOutput.competitiveStrategy.competitiveResponse.directCompetitors === 'string' && (
                                <div>
                                  <p className="text-xs font-medium">Direct Competitors:</p>
                                  <p className="text-xs text-muted-foreground">{project.blueprintOutput.competitiveStrategy.competitiveResponse.directCompetitors}</p>
                                </div>
                              )}
                              {project.blueprintOutput.competitiveStrategy.competitiveResponse.indirectThreats && typeof project.blueprintOutput.competitiveStrategy.competitiveResponse.indirectThreats === 'string' && (
                                <div>
                                  <p className="text-xs font-medium">Indirect Threats:</p>
                                  <p className="text-xs text-muted-foreground">{project.blueprintOutput.competitiveStrategy.competitiveResponse.indirectThreats}</p>
                                </div>
                              )}
                              {project.blueprintOutput.competitiveStrategy.competitiveResponse.newEntrants && typeof project.blueprintOutput.competitiveStrategy.competitiveResponse.newEntrants === 'string' && (
                                <div>
                                  <p className="text-xs font-medium">New Entrants:</p>
                                  <p className="text-xs text-muted-foreground">{project.blueprintOutput.competitiveStrategy.competitiveResponse.newEntrants}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {project.blueprintOutput.competitiveStrategy.innovationStrategy && typeof project.blueprintOutput.competitiveStrategy.innovationStrategy === 'object' && (
                          <div>
                            <p className="text-sm"><strong>Innovation Strategy:</strong></p>
                            <div className="mt-2 space-y-2">
                              {project.blueprintOutput.competitiveStrategy.innovationStrategy.rdInvestment && typeof project.blueprintOutput.competitiveStrategy.innovationStrategy.rdInvestment === 'string' && (
                                <div>
                                  <p className="text-xs font-medium">R&D Investment:</p>
                                  <p className="text-xs text-muted-foreground">{project.blueprintOutput.competitiveStrategy.innovationStrategy.rdInvestment}</p>
                                </div>
                              )}
                              {project.blueprintOutput.competitiveStrategy.innovationStrategy.innovationAreas && typeof project.blueprintOutput.competitiveStrategy.innovationStrategy.innovationAreas === 'string' && (
                                <div>
                                  <p className="text-xs font-medium">Innovation Areas:</p>
                                  <p className="text-xs text-muted-foreground">{project.blueprintOutput.competitiveStrategy.innovationStrategy.innovationAreas}</p>
                                </div>
                              )}
                              {project.blueprintOutput.competitiveStrategy.innovationStrategy.patentStrategy && typeof project.blueprintOutput.competitiveStrategy.innovationStrategy.patentStrategy === 'string' && (
                                <div>
                                  <p className="text-xs font-medium">Patent Strategy:</p>
                                  <p className="text-xs text-muted-foreground">{project.blueprintOutput.competitiveStrategy.innovationStrategy.patentStrategy}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Risk Management */}
                  {project.blueprintOutput.riskManagement && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ⚠️ Risk Management
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.riskManagement.businessRisks && Array.isArray(project.blueprintOutput.riskManagement.businessRisks) && (
                          <div>
                            <p className="text-sm"><strong>Business Risks:</strong></p>
                            <div className="mt-2 space-y-2">
                              {project.blueprintOutput.riskManagement.businessRisks.map((risk: any, index: number) => (
                                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                                  <p className="text-sm font-medium text-red-800">{risk.risk || `Business Risk ${index + 1}`}</p>
                                  <div className="mt-1 space-y-1">
                                    {risk.probability && typeof risk.probability === 'string' && (
                                      <p className="text-xs text-red-700"><strong>Probability:</strong> {risk.probability}</p>
                                    )}
                                    {risk.impact && typeof risk.impact === 'string' && (
                                      <p className="text-xs text-red-700"><strong>Impact:</strong> {risk.impact}</p>
                                    )}
                                    {risk.mitigation && typeof risk.mitigation === 'string' && (
                                      <p className="text-xs text-red-700"><strong>Mitigation:</strong> {risk.mitigation}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {project.blueprintOutput.riskManagement.operationalRisks && Array.isArray(project.blueprintOutput.riskManagement.operationalRisks) && (
                          <div>
                            <p className="text-sm"><strong>Operational Risks:</strong></p>
                            <div className="mt-2 space-y-2">
                              {project.blueprintOutput.riskManagement.operationalRisks.map((risk: any, index: number) => (
                                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                  <p className="text-sm font-medium text-yellow-800">{risk.risk || `Operational Risk ${index + 1}`}</p>
                                  <div className="mt-1 space-y-1">
                                    {risk.probability && typeof risk.probability === 'string' && (
                                      <p className="text-xs text-yellow-700"><strong>Probability:</strong> {risk.probability}</p>
                                    )}
                                    {risk.impact && typeof risk.impact === 'string' && (
                                      <p className="text-xs text-yellow-700"><strong>Impact:</strong> {risk.impact}</p>
                                    )}
                                    {risk.mitigation && typeof risk.mitigation === 'string' && (
                                      <p className="text-xs text-yellow-700"><strong>Mitigation:</strong> {risk.mitigation}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {project.blueprintOutput.riskManagement.contingencyPlans && typeof project.blueprintOutput.riskManagement.contingencyPlans === 'string' && (
                          <div>
                            <p className="text-sm"><strong>Contingency Plans:</strong></p>
                            <p className="text-sm text-muted-foreground mt-1">{project.blueprintOutput.riskManagement.contingencyPlans}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
                
                {!project.blueprintOutput._fallback && (
                  <Button 
                    onClick={() => setCurrentStep("financials")}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  >
                    Continue to Financial Projections →
                  </Button>
                )}
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
              isGenerating ? (
                <VentureForgeLoader 
                  stage="Financial Projections"
                  steps={[
                    { text: "Analyzing business model", completed: true },
                    { text: "Calculating revenue projections", loading: true },
                    { text: "Determining funding needs", pending: true },
                    { text: "Building profit scenarios", pending: true }
                  ]}
                />
              ) : (
                <Button 
                  onClick={handleFinancialsGeneration}
                  className="w-full"
                >
                  💰 Generate Financial Projections (12 Credits)
                </Button>
              )
            )}

            {project.financialOutput && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Financial Projections:</h3>
                  {project.financialOutput._fallback && (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        ⚠️ AI Service Error
                      </Badge>
                      <Button
                        onClick={handleFinancialsGeneration}
                        disabled={isGenerating}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        🔄 Regenerate Financials
                      </Button>
                    </div>
                  )}
                </div>
                
                {project.financialOutput._fallback && (
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
                    <div className="flex items-start gap-2">
                      <div className="text-amber-600 mt-0.5">⚠️</div>
                      <div>
                        <p className="text-sm font-medium text-amber-800">Financial Projections Incomplete</p>
                        <p className="text-sm text-amber-700 mt-1">
                          {project.financialOutput._reason || "The AI service encountered an issue while generating financial projections. Please try regenerating for a complete analysis."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid gap-4">
                  {/* Funding Analysis */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      💰 Funding Analysis
                    </h4>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {project.financialOutput.fundingAnalysis?.seedFunding || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">Seed Funding Required</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {project.financialOutput.fundingAnalysis?.runwayMonths || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">Runway</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {project.financialOutput.fundingAnalysis?.avgMonthlyNetBurnYear1 || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">Monthly Burn Rate</div>
                      </div>
                    </div>
                    {project.financialOutput.fundingAnalysis?.runwayCalculation && (
                      <div className="mt-3">
                        <p className="text-sm"><strong>Runway Calculation:</strong></p>
                        <p className="text-sm text-muted-foreground">{project.financialOutput.fundingAnalysis.runwayCalculation}</p>
                      </div>
                    )}
                  </Card>

                  {/* Three Year Projections */}
                  {project.financialOutput.threeYearProjections && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📈 Three Year Financial Projections
                      </h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold text-primary">
                            {project.financialOutput.threeYearProjections.year1?.totalRevenue || 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground">Year 1 Revenue</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Profit: {project.financialOutput.threeYearProjections.year1?.netProfitLoss || 'N/A'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold text-primary">
                            {project.financialOutput.threeYearProjections.year2?.totalRevenue || 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground">Year 2 Revenue</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Profit: {project.financialOutput.threeYearProjections.year2?.netProfitLoss || 'N/A'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold text-primary">
                            {project.financialOutput.threeYearProjections.year3?.totalRevenue || 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground">Year 3 Revenue</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Profit: {project.financialOutput.threeYearProjections.year3?.netProfitLoss || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Path to Profitability */}
                  {project.financialOutput.pathToProfitability && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📈 Path to Profitability
                      </h4>
                      <div className="space-y-3">
                        {project.financialOutput.pathToProfitability.breakEvenMonth && (
                          <div>
                            <p className="text-sm"><strong>Break-even Timeline:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.financialOutput.pathToProfitability.breakEvenMonth}</p>
                          </div>
                        )}
                        {project.financialOutput.pathToProfitability.keyMilestones && project.financialOutput.pathToProfitability.keyMilestones.length > 0 && (
                          <div>
                            <p className="text-sm"><strong>Key Milestones:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.financialOutput.pathToProfitability.keyMilestones.map((milestone: string, index: number) => (
                                <li key={index}>{milestone}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.financialOutput.pathToProfitability.profitabilityStrategy && (
                          <div>
                            <p className="text-sm"><strong>Strategy:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.financialOutput.pathToProfitability.profitabilityStrategy}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Key Metrics */}
                  {project.financialOutput.keyMetrics && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🎯 Key Financial Metrics
                      </h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {project.financialOutput.keyMetrics.cac && (
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              {project.financialOutput.keyMetrics.cac}
                            </div>
                            <div className="text-xs text-muted-foreground">Customer Acquisition Cost</div>
                          </div>
                        )}
                        {project.financialOutput.keyMetrics.ltv && (
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              {project.financialOutput.keyMetrics.ltv}
                            </div>
                            <div className="text-xs text-muted-foreground">Customer Lifetime Value</div>
                          </div>
                        )}
                        {project.financialOutput.keyMetrics.ltvCacRatio && (
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              {project.financialOutput.keyMetrics.ltvCacRatio}
                            </div>
                            <div className="text-xs text-muted-foreground">LTV:CAC Ratio</div>
                          </div>
                        )}
                        {project.financialOutput.keyMetrics.paybackPeriod && (
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              {project.financialOutput.keyMetrics.paybackPeriod}
                            </div>
                            <div className="text-xs text-muted-foreground">Payback Period</div>
                          </div>
                        )}
                        {project.financialOutput.keyMetrics.arr && (
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              {project.financialOutput.keyMetrics.arr}
                            </div>
                            <div className="text-xs text-muted-foreground">Annual Recurring Revenue</div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Revenue Breakdown */}
                  {project.financialOutput.revenueBreakdown && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        💰 Revenue Breakdown
                      </h4>
                      <div className="space-y-4">
                        {project.financialOutput.revenueBreakdown.year1 && project.financialOutput.revenueBreakdown.year1.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Year 1 Revenue Streams:</p>
                            <div className="space-y-2">
                              {project.financialOutput.revenueBreakdown.year1.map((stream: any, index: number) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                  <span className="text-sm">{stream.stream}</span>
                                  <div className="text-right">
                                    <div className="text-sm font-medium">{stream.amount}</div>
                                    <div className="text-xs text-muted-foreground">{stream.percentage}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Financial Assumptions */}
                  {project.financialOutput.keyAssumptions && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📋 Key Financial Assumptions
                      </h4>
                      <div className="space-y-3">
                        {project.financialOutput.keyAssumptions.map((assumption: any, index: number) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-medium">{assumption.assumption || assumption}</p>
                              {assumption.value && (
                                <Badge variant="outline" className="text-xs">{assumption.value}</Badge>
                              )}
                            </div>
                            {assumption.justification && (
                              <p className="text-xs text-muted-foreground">{assumption.justification}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
                
                {!project.financialOutput._fallback && (
                  <Button 
                    onClick={() => setCurrentStep("pitch")}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    Continue to Investor Pitch →
                  </Button>
                )}
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
              isGenerating ? (
                <VentureForgeLoader 
                  stage="Investor Pitch"
                  steps={[
                    { text: "Reviewing business data", completed: true },
                    { text: "Crafting compelling narrative", loading: true },
                    { text: "Designing pitch structure", pending: true },
                    { text: "Optimizing for investors", pending: true }
                  ]}
                />
              ) : (
                <Button 
                  onClick={handlePitchGeneration}
                  className="w-full"
                >
                  🎯 Generate Investor Pitch (8 Credits)
                </Button>
              )
            )}

            {project.pitchOutput && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Investor Pitch:</h3>
                  {project.pitchOutput._fallback && (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        ⚠️ AI Service Error
                      </Badge>
                      <Button
                        onClick={handlePitchGeneration}
                        disabled={isGenerating}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        🔄 Regenerate Pitch
                      </Button>
                    </div>
                  )}
                </div>
                
                {project.pitchOutput._fallback && (
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
                    <div className="flex items-start gap-2">
                      <div className="text-amber-600 mt-0.5">⚠️</div>
                      <div>
                        <p className="text-sm font-medium text-amber-800">Pitch Generation Incomplete</p>
                        <p className="text-sm text-amber-700 mt-1">
                          {project.pitchOutput._reason || "The AI service encountered an issue while creating your investor pitch. Please try regenerating for a complete presentation."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid gap-4">
                  {/* Executive Summary */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      📄 Executive Summary
                    </h4>
                    <p className="text-sm leading-relaxed">{project.pitchOutput.executiveSummary}</p>
                  </Card>

                  {/* Pitch Deck Slides */}
                  {project.pitchOutput.pitchDeckSlides && (
                    <>
                      {/* Problem & Solution */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {project.pitchOutput.pitchDeckSlides.problemSlide && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              ❗ {project.pitchOutput.pitchDeckSlides.problemSlide.headline || "The Problem"}
                            </h4>
                            <div className="space-y-2">
                              {project.pitchOutput.pitchDeckSlides.problemSlide.problemStatement && (
                                <p className="text-sm">{project.pitchOutput.pitchDeckSlides.problemSlide.problemStatement}</p>
                              )}
                              {project.pitchOutput.pitchDeckSlides.problemSlide.marketPainPoints && Array.isArray(project.pitchOutput.pitchDeckSlides.problemSlide.marketPainPoints) && (
                                <div>
                                  <p className="text-sm font-medium">Market Pain Points:</p>
                                  <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                                    {project.pitchOutput.pitchDeckSlides.problemSlide.marketPainPoints.map((pain: string, index: number) => (
                                      <li key={index}>{pain}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {project.pitchOutput.pitchDeckSlides.problemSlide.urgency && (
                                <div className="p-2 bg-red-50 border border-red-200 rounded">
                                  <p className="text-xs text-red-700"><strong>Urgency:</strong> {project.pitchOutput.pitchDeckSlides.problemSlide.urgency}</p>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}

                        {project.pitchOutput.pitchDeckSlides.solutionSlide && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              💡 {project.pitchOutput.pitchDeckSlides.solutionSlide.headline || "The Solution"}
                            </h4>
                            <div className="space-y-2">
                              {project.pitchOutput.pitchDeckSlides.solutionSlide.solutionDescription && (
                                <p className="text-sm">{project.pitchOutput.pitchDeckSlides.solutionSlide.solutionDescription}</p>
                              )}
                              {project.pitchOutput.pitchDeckSlides.solutionSlide.keyDifferentiators && Array.isArray(project.pitchOutput.pitchDeckSlides.solutionSlide.keyDifferentiators) && (
                                <div>
                                  <p className="text-sm font-medium">Key Differentiators:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {project.pitchOutput.pitchDeckSlides.solutionSlide.keyDifferentiators.map((diff: string, index: number) => (
                                      <Badge key={index} variant="secondary" className="text-xs">{diff}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {project.pitchOutput.pitchDeckSlides.solutionSlide.proofOfConcept && (
                                <div className="p-2 bg-green-50 border border-green-200 rounded">
                                  <p className="text-xs text-green-700"><strong>Proof of Concept:</strong> {project.pitchOutput.pitchDeckSlides.solutionSlide.proofOfConcept}</p>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}
                      </div>

                      {/* Market Opportunity */}
                      {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide && (
                        <Card className="p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            🌍 {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.headline || "Market Opportunity"}
                          </h4>
                          {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.marketSizing && (
                            <div className="grid gap-3 md:grid-cols-3 mb-3">
                              <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-lg font-bold text-blue-800">
                                  {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.marketSizing.tam || 'N/A'}
                                </div>
                                <div className="text-xs text-blue-600">Total Addressable Market</div>
                              </div>
                              <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="text-lg font-bold text-green-800">
                                  {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.marketSizing.sam || 'N/A'}
                                </div>
                                <div className="text-xs text-green-600">Serviceable Addressable Market</div>
                              </div>
                              <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="text-lg font-bold text-purple-800">
                                  {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.marketSizing.som || 'N/A'}
                                </div>
                                <div className="text-xs text-purple-600">Serviceable Obtainable Market</div>
                              </div>
                            </div>
                          )}
                          {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.marketTrends && Array.isArray(project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.marketTrends) && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-2">Market Trends:</p>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.marketTrends.map((trend: string, index: number) => (
                                  <li key={index}>{trend}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.timingRationale && (
                            <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                              <p className="text-xs text-orange-700"><strong>Why Now:</strong> {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.timingRationale}</p>
                            </div>
                          )}
                        </Card>
                      )}

                      {/* Business Model & Traction */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {project.pitchOutput.pitchDeckSlides.businessModelSlide && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              💼 {project.pitchOutput.pitchDeckSlides.businessModelSlide.headline || "Business Model"}
                            </h4>
                            <div className="space-y-3">
                              {project.pitchOutput.pitchDeckSlides.businessModelSlide.revenueModel && (
                                <div>
                                  <p className="text-sm font-medium">Revenue Model:</p>
                                  <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckSlides.businessModelSlide.revenueModel}</p>
                                </div>
                              )}
                              {project.pitchOutput.pitchDeckSlides.businessModelSlide.unitEconomics && (
                                <div>
                                  <p className="text-sm font-medium">Unit Economics:</p>
                                  <div className="grid gap-2 mt-1">
                                    {project.pitchOutput.pitchDeckSlides.businessModelSlide.unitEconomics.customerAcquisitionCost && (
                                      <div className="text-xs bg-muted p-2 rounded">
                                        <strong>CAC:</strong> {project.pitchOutput.pitchDeckSlides.businessModelSlide.unitEconomics.customerAcquisitionCost}
                                      </div>
                                    )}
                                    {project.pitchOutput.pitchDeckSlides.businessModelSlide.unitEconomics.lifetimeValue && (
                                      <div className="text-xs bg-muted p-2 rounded">
                                        <strong>LTV:</strong> {project.pitchOutput.pitchDeckSlides.businessModelSlide.unitEconomics.lifetimeValue}
                                      </div>
                                    )}
                                    {project.pitchOutput.pitchDeckSlides.businessModelSlide.unitEconomics.grossMargin && (
                                      <div className="text-xs bg-muted p-2 rounded">
                                        <strong>Gross Margin:</strong> {project.pitchOutput.pitchDeckSlides.businessModelSlide.unitEconomics.grossMargin}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {project.pitchOutput.pitchDeckSlides.businessModelSlide.revenueStreams && (
                                <div>
                                  <p className="text-sm font-medium">Revenue Streams:</p>
                                  <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckSlides.businessModelSlide.revenueStreams}</p>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}

                        {project.pitchOutput.pitchDeckSlides.tractionSlide && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              📈 {project.pitchOutput.pitchDeckSlides.tractionSlide.headline || "Traction"}
                            </h4>
                            <div className="space-y-3">
                              {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics && (
                                <div>
                                  <p className="text-sm font-medium mb-2">Key Metrics:</p>
                                  <div className="grid gap-2">
                                    {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.customers && (
                                      <div className="text-xs bg-green-50 border border-green-200 p-2 rounded">
                                        <strong>Customers:</strong> {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.customers}
                                      </div>
                                    )}
                                    {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.revenue && (
                                      <div className="text-xs bg-blue-50 border border-blue-200 p-2 rounded">
                                        <strong>Revenue:</strong> {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.revenue}
                                      </div>
                                    )}
                                    {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.retention && (
                                      <div className="text-xs bg-purple-50 border border-purple-200 p-2 rounded">
                                        <strong>Retention:</strong> {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.retention}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {project.pitchOutput.pitchDeckSlides.tractionSlide.socialProof && Array.isArray(project.pitchOutput.pitchDeckSlides.tractionSlide.socialProof) && (
                                <div>
                                  <p className="text-sm font-medium">Social Proof:</p>
                                  <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                                    {project.pitchOutput.pitchDeckSlides.tractionSlide.socialProof.map((proof: string, index: number) => (
                                      <li key={index}>{proof}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}
                      </div>

                      {/* Additional Slides */}
                      {project.pitchOutput.pitchDeckSlides.competitionSlide && (
                        <Card className="p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            🏆 {project.pitchOutput.pitchDeckSlides.competitionSlide.headline || "Competition"}
                          </h4>
                          <div className="space-y-3">
                            {project.pitchOutput.pitchDeckSlides.competitionSlide.competitiveLandscape && (
                              <div>
                                <p className="text-sm font-medium">Competitive Landscape:</p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckSlides.competitionSlide.competitiveLandscape}</p>
                              </div>
                            )}
                            {project.pitchOutput.pitchDeckSlides.competitionSlide.competitiveAdvantages && Array.isArray(project.pitchOutput.pitchDeckSlides.competitionSlide.competitiveAdvantages) && (
                              <div>
                                <p className="text-sm font-medium">Competitive Advantages:</p>
                                <div className="space-y-2 mt-2">
                                  {project.pitchOutput.pitchDeckSlides.competitionSlide.competitiveAdvantages.map((adv: any, index: number) => (
                                    <div key={index} className="p-2 bg-orange-50 border border-orange-200 rounded">
                                      <p className="text-sm font-medium text-orange-800">{adv.advantage || `Advantage ${index + 1}`}</p>
                                      {adv.description && (
                                        <p className="text-xs text-orange-700 mt-1">{adv.description}</p>
                                      )}
                                      {adv.defensibility && (
                                        <p className="text-xs text-orange-600 mt-1"><strong>Defensibility:</strong> {adv.defensibility}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}

                      {/* Financial Projections */}
                      {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide && (
                        <Card className="p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            💰 {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.headline || "Financial Projections"}
                          </h4>
                          <div className="space-y-3">
                            {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth && (
                              <div>
                                <p className="text-sm font-medium mb-2">Revenue Growth:</p>
                                <div className="grid gap-2 md:grid-cols-2">
                                  {Object.entries(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth).map(([year, revenue], index) => (
                                    <div key={index} className="text-center p-2 bg-muted rounded">
                                      <div className="text-sm font-bold">{revenue as string}</div>
                                      <div className="text-xs text-muted-foreground capitalize">{year.replace(/(\d+)/, ' $1')}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.profitabilityMetrics && (
                              <div>
                                <p className="text-sm font-medium mb-2">Profitability Metrics:</p>
                                <div className="grid gap-2 md:grid-cols-3">
                                  {Object.entries(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.profitabilityMetrics).map(([metric, value], index) => (
                                    <div key={index} className="text-center p-2 bg-green-50 border border-green-200 rounded">
                                      <div className="text-sm font-bold text-green-800">{value as string}</div>
                                      <div className="text-xs text-green-600 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}

                      {/* Funding Ask */}
                      {project.pitchOutput.pitchDeckSlides.fundingAskSlide && (
                        <Card className="p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            💎 {project.pitchOutput.pitchDeckSlides.fundingAskSlide.headline || "Funding Ask"}
                          </h4>
                          <div className="space-y-3">
                            {project.pitchOutput.pitchDeckSlides.fundingAskSlide.fundingAmount && (
                              <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-xl font-bold text-blue-800">{project.pitchOutput.pitchDeckSlides.fundingAskSlide.fundingAmount}</div>
                              </div>
                            )}
                            {project.pitchOutput.pitchDeckSlides.fundingAskSlide.useOfFunds && (
                              <div>
                                <p className="text-sm font-medium mb-2">Use of Funds:</p>
                                <div className="space-y-2">
                                  {Object.entries(project.pitchOutput.pitchDeckSlides.fundingAskSlide.useOfFunds).map(([category, details], index) => (
                                    <div key={index} className="p-2 bg-muted rounded">
                                      <p className="text-sm font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</p>
                                      <p className="text-xs text-muted-foreground">{details as string}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {project.pitchOutput.pitchDeckSlides.fundingAskSlide.keyMilestones && (
                              <div>
                                <p className="text-sm font-medium">Key Milestones:</p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckSlides.fundingAskSlide.keyMilestones}</p>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}

                      {/* Team */}
                      {project.pitchOutput.pitchDeckSlides.teamSlide && (
                        <Card className="p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            👥 {project.pitchOutput.pitchDeckSlides.teamSlide.headline || "Team"}
                          </h4>
                          <div className="space-y-3">
                            {project.pitchOutput.pitchDeckSlides.teamSlide.founderBios && (
                              <div>
                                <p className="text-sm font-medium">Founder Bios:</p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckSlides.teamSlide.founderBios}</p>
                              </div>
                            )}
                            {project.pitchOutput.pitchDeckSlides.teamSlide.teamStrengths && (
                              <div>
                                <p className="text-sm font-medium">Team Strengths:</p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckSlides.teamSlide.teamStrengths}</p>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}

                      {/* Exit Strategy */}
                      {project.pitchOutput.pitchDeckSlides.exitStrategySlide && (
                        <Card className="p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            🚀 {project.pitchOutput.pitchDeckSlides.exitStrategySlide.headline || "Exit Strategy"}
                          </h4>
                          <div className="space-y-3">
                            {project.pitchOutput.pitchDeckSlides.exitStrategySlide.exitScenarios && Array.isArray(project.pitchOutput.pitchDeckSlides.exitStrategySlide.exitScenarios) && (
                              <div>
                                <p className="text-sm font-medium mb-2">Exit Scenarios:</p>
                                <div className="space-y-2">
                                  {project.pitchOutput.pitchDeckSlides.exitStrategySlide.exitScenarios.map((scenario: any, index: number) => (
                                    <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded">
                                      <p className="text-sm font-medium text-purple-800">{scenario.type}</p>
                                      {scenario.valuationRange && (
                                        <p className="text-xs text-purple-700 mt-1"><strong>Valuation:</strong> {scenario.valuationRange}</p>
                                      )}
                                      {scenario.strategicRationale && (
                                        <p className="text-xs text-purple-600 mt-1">{scenario.strategicRationale}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}

                      {/* Investor Q&A */}
                      {project.pitchOutput.investorQA && Array.isArray(project.pitchOutput.investorQA) && (
                        <Card className="p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            🤔 Investor Q&A
                          </h4>
                          <div className="space-y-3">
                            {project.pitchOutput.investorQA.map((qa: any, index: number) => (
                              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                <p className="text-sm font-medium text-blue-800 mb-1">{qa.question}</p>
                                <p className="text-sm text-muted-foreground">{qa.answer}</p>
                              </div>
                            ))}
                          </div>
                        </Card>
                      )}
                    </>
                  )}
                </div>
                
                {!project.pitchOutput._fallback && (
                  <Button 
                    onClick={() => setCurrentStep("gtm")}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    Continue to Go-to-Market Strategy →
                  </Button>
                )}
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
              isGenerating ? (
                <VentureForgeLoader 
                  stage="Go-to-Market Strategy"
                  steps={[
                    { text: "Analyzing target customers", completed: true },
                    { text: "Mapping launch timeline", loading: true },
                    { text: "Designing marketing channels", pending: true },
                    { text: "Setting success metrics", pending: true }
                  ]}
                />
              ) : (
                <Button 
                  onClick={handleGTMGeneration}
                  className="w-full"
                >
                  🚀 Generate GTM Strategy (10 Credits)
                </Button>
              )
            )}

            {project.gtmOutput && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Go-to-Market Strategy:</h3>
                  {project.gtmOutput._fallback && (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        ⚠️ AI Service Error
                      </Badge>
                      <Button
                        onClick={handleGTMGeneration}
                        disabled={isGenerating}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        🔄 Regenerate GTM Strategy
                      </Button>
                    </div>
                  )}
                </div>
                
                {project.gtmOutput._fallback && (
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
                    <div className="flex items-start gap-2">
                      <div className="text-amber-600 mt-0.5">⚠️</div>
                      <div>
                        <p className="text-sm font-medium text-amber-800">Go-to-Market Strategy Incomplete</p>
                        <p className="text-sm text-amber-700 mt-1">
                          {project.gtmOutput._reason || "The AI service encountered an issue while creating your go-to-market strategy. Please try regenerating for a complete strategy."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid gap-4">
                  {/* Strategic Overview */}
                  {project.gtmOutput.strategicOverview && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🎯 Strategic Overview
                      </h4>
                      <div className="space-y-3">
                        {project.gtmOutput.strategicOverview.gtmThesis && (
                          <div>
                            <p className="text-sm"><strong>GTM Thesis:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.strategicOverview.gtmThesis}</p>
                          </div>
                        )}
                        {project.gtmOutput.strategicOverview.marketEntryStrategy && (
                          <div>
                            <p className="text-sm"><strong>Market Entry Strategy:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.strategicOverview.marketEntryStrategy}</p>
                          </div>
                        )}
                        {project.gtmOutput.strategicOverview.primaryObjective && (
                          <div>
                            <p className="text-sm"><strong>Primary Objective:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.strategicOverview.primaryObjective}</p>
                          </div>
                        )}
                        {project.gtmOutput.strategicOverview.successMetrics && (
                          <div>
                            <p className="text-sm"><strong>Success Metrics:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.strategicOverview.successMetrics}</p>
                          </div>
                        )}
                        {project.gtmOutput.strategicOverview.competitivePositioning && (
                          <div>
                            <p className="text-sm"><strong>Competitive Positioning:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.strategicOverview.competitivePositioning}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Customer Acquisition Framework */}
                  {project.gtmOutput.customerAcquisitionFramework && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📈 Customer Acquisition Framework
                      </h4>
                      <div className="space-y-4">
                        {/* Ideal Customer Profile */}
                        {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile && (
                          <div>
                            <p className="text-sm font-medium mb-2">Ideal Customer Profile</p>
                            <div className="bg-muted rounded-lg p-3 space-y-2">
                              {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.primarySegment && (
                                <p className="text-sm"><strong>Primary Segment:</strong> {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.primarySegment}</p>
                              )}
                              {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.customerJobs && (
                                <p className="text-sm"><strong>Customer Jobs:</strong> {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.customerJobs}</p>
                              )}
                              {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.painPoints && Array.isArray(project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.painPoints) && (
                                <div>
                                  <p className="text-sm"><strong>Pain Points:</strong></p>
                                  <ul className="text-sm text-muted-foreground ml-4 list-disc">
                                    {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.painPoints.map((point: string, index: number) => (
                                      <li key={index}>{point}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.buyingProcess && (
                                <p className="text-sm"><strong>Buying Process:</strong> {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.buyingProcess}</p>
                              )}
                              {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.budget && (
                                <p className="text-sm"><strong>Budget Range:</strong> {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.budget}</p>
                              )}
                              {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.decisionCriteria && (
                                <p className="text-sm"><strong>Decision Criteria:</strong> {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.decisionCriteria}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Acquisition Channels */}
                        {project.gtmOutput.customerAcquisitionFramework.acquisitionChannels && Array.isArray(project.gtmOutput.customerAcquisitionFramework.acquisitionChannels) && (
                          <div>
                            <p className="text-sm font-medium mb-2">Acquisition Channels</p>
                            <div className="space-y-3">
                              {project.gtmOutput.customerAcquisitionFramework.acquisitionChannels.map((channel: any, index: number) => (
                                <div key={index} className="border border-muted rounded-lg p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-medium">{channel.channelName || 'Channel'}</p>
                                    <Badge variant="secondary" className="text-xs">{channel.channelType || 'Type'}</Badge>
                                  </div>
                                  {channel.implementation && (
                                    <p className="text-xs text-muted-foreground mb-2">{channel.implementation}</p>
                                  )}
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    {channel.monthlyInvestment && (
                                      <p><strong>Investment:</strong> {channel.monthlyInvestment}</p>
                                    )}
                                    {channel.cac && (
                                      <p><strong>CAC:</strong> {channel.cac}</p>
                                    )}
                                  </div>
                                  {channel.expectedResults && (
                                    <div className="mt-2 text-xs">
                                      <p><strong>Expected Results:</strong></p>
                                      <div className="ml-2 text-muted-foreground">
                                        {channel.expectedResults.month1 && <p>Month 1: {channel.expectedResults.month1}</p>}
                                        {channel.expectedResults.month3 && <p>Month 3: {channel.expectedResults.month3}</p>}
                                        {channel.expectedResults.month6 && <p>Month 6: {channel.expectedResults.month6}</p>}
                                      </div>
                                    </div>
                                  )}
                                  {channel.conversionPath && (
                                    <p className="text-xs text-muted-foreground mt-1"><strong>Conversion:</strong> {channel.conversionPath}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Monthly Execution Plan */}
                  {project.gtmOutput.monthlyExecutionPlan && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📅 Monthly Execution Plan
                      </h4>
                      <div className="grid gap-4 md:grid-cols-3">
                        {/* Month 1 */}
                        {project.gtmOutput.monthlyExecutionPlan.month1 && (
                          <div className="border border-muted rounded-lg p-3">
                            <div className="text-sm font-bold text-primary mb-2">Month 1</div>
                            {project.gtmOutput.monthlyExecutionPlan.month1.primaryFocus && (
                              <p className="text-xs font-medium mb-2">{project.gtmOutput.monthlyExecutionPlan.month1.primaryFocus}</p>
                            )}
                            {project.gtmOutput.monthlyExecutionPlan.month1.keyActivities && Array.isArray(project.gtmOutput.monthlyExecutionPlan.month1.keyActivities) && (
                              <div className="mb-2">
                                <p className="text-xs font-medium">Key Activities:</p>
                                <ul className="text-xs text-muted-foreground ml-2 list-disc">
                                  {project.gtmOutput.monthlyExecutionPlan.month1.keyActivities.map((activity: string, index: number) => (
                                    <li key={index}>{activity}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics && (
                              <div className="text-xs">
                                <p className="font-medium">Target Metrics:</p>
                                <div className="text-muted-foreground">
                                  {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.newCustomers && <p>Customers: {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.newCustomers}</p>}
                                  {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.mrr && <p>MRR: {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.mrr}</p>}
                                  {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.pipeline && <p>Pipeline: {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.pipeline}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Month 3 */}
                        {project.gtmOutput.monthlyExecutionPlan.month3 && (
                          <div className="border border-muted rounded-lg p-3">
                            <div className="text-sm font-bold text-primary mb-2">Month 3</div>
                            {project.gtmOutput.monthlyExecutionPlan.month3.primaryFocus && (
                              <p className="text-xs font-medium mb-2">{project.gtmOutput.monthlyExecutionPlan.month3.primaryFocus}</p>
                            )}
                            {project.gtmOutput.monthlyExecutionPlan.month3.keyActivities && Array.isArray(project.gtmOutput.monthlyExecutionPlan.month3.keyActivities) && (
                              <div className="mb-2">
                                <p className="text-xs font-medium">Key Activities:</p>
                                <ul className="text-xs text-muted-foreground ml-2 list-disc">
                                  {project.gtmOutput.monthlyExecutionPlan.month3.keyActivities.map((activity: string, index: number) => (
                                    <li key={index}>{activity}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics && (
                              <div className="text-xs">
                                <p className="font-medium">Target Metrics:</p>
                                <div className="text-muted-foreground">
                                  {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.newCustomers && <p>Customers: {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.newCustomers}</p>}
                                  {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.mrr && <p>MRR: {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.mrr}</p>}
                                  {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.customerSuccess && <p>Success: {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.customerSuccess}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Month 6 */}
                        {project.gtmOutput.monthlyExecutionPlan.month6 && (
                          <div className="border border-muted rounded-lg p-3">
                            <div className="text-sm font-bold text-primary mb-2">Month 6</div>
                            {project.gtmOutput.monthlyExecutionPlan.month6.primaryFocus && (
                              <p className="text-xs font-medium mb-2">{project.gtmOutput.monthlyExecutionPlan.month6.primaryFocus}</p>
                            )}
                            {project.gtmOutput.monthlyExecutionPlan.month6.keyActivities && Array.isArray(project.gtmOutput.monthlyExecutionPlan.month6.keyActivities) && (
                              <div className="mb-2">
                                <p className="text-xs font-medium">Key Activities:</p>
                                <ul className="text-xs text-muted-foreground ml-2 list-disc">
                                  {project.gtmOutput.monthlyExecutionPlan.month6.keyActivities.map((activity: string, index: number) => (
                                    <li key={index}>{activity}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics && (
                              <div className="text-xs">
                                <p className="font-medium">Target Metrics:</p>
                                <div className="text-muted-foreground">
                                  {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.newCustomers && <p>Customers: {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.newCustomers}</p>}
                                  {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.mrr && <p>MRR: {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.mrr}</p>}
                                  {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.efficiency && <p>Efficiency: {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.efficiency}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Sales Playbook */}
                  {project.gtmOutput.salesPlaybook && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        💼 Sales Playbook
                      </h4>
                      <div className="space-y-4">
                        {/* Sales Process */}
                        {project.gtmOutput.salesPlaybook.salesProcess && (
                          <div>
                            <p className="text-sm font-medium mb-2">Sales Process</p>
                            <div className="space-y-2">
                              {project.gtmOutput.salesPlaybook.salesProcess.prospectQualification && (
                                <div className="bg-muted rounded-lg p-2">
                                  <p className="text-xs"><strong>Qualification:</strong> {project.gtmOutput.salesPlaybook.salesProcess.prospectQualification}</p>
                                </div>
                              )}
                              {project.gtmOutput.salesPlaybook.salesProcess.demoStrategy && (
                                <div className="bg-muted rounded-lg p-2">
                                  <p className="text-xs"><strong>Demo Strategy:</strong> {project.gtmOutput.salesPlaybook.salesProcess.demoStrategy}</p>
                                </div>
                              )}
                              {project.gtmOutput.salesPlaybook.salesProcess.closingTechniques && (
                                <div className="bg-muted rounded-lg p-2">
                                  <p className="text-xs"><strong>Closing:</strong> {project.gtmOutput.salesPlaybook.salesProcess.closingTechniques}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Sales Targets */}
                        {project.gtmOutput.salesPlaybook.salesTargets && (
                          <div>
                            <p className="text-sm font-medium mb-2">Sales Targets</p>
                            <div className="grid gap-2 md:grid-cols-3">
                              {project.gtmOutput.salesPlaybook.salesTargets.month1 && (
                                <div className="bg-muted rounded-lg p-2 text-xs">
                                  <p className="font-medium">Month 1</p>
                                  {project.gtmOutput.salesPlaybook.salesTargets.month1.pipeline && <p>Pipeline: {project.gtmOutput.salesPlaybook.salesTargets.month1.pipeline}</p>}
                                  {project.gtmOutput.salesPlaybook.salesTargets.month1.closedWon && <p>Closed: {project.gtmOutput.salesPlaybook.salesTargets.month1.closedWon}</p>}
                                  {project.gtmOutput.salesPlaybook.salesTargets.month1.averageDealSize && <p>Deal Size: {project.gtmOutput.salesPlaybook.salesTargets.month1.averageDealSize}</p>}
                                </div>
                              )}
                              {project.gtmOutput.salesPlaybook.salesTargets.month3 && (
                                <div className="bg-muted rounded-lg p-2 text-xs">
                                  <p className="font-medium">Month 3</p>
                                  {project.gtmOutput.salesPlaybook.salesTargets.month3.pipeline && <p>Pipeline: {project.gtmOutput.salesPlaybook.salesTargets.month3.pipeline}</p>}
                                  {project.gtmOutput.salesPlaybook.salesTargets.month3.closedWon && <p>Closed: {project.gtmOutput.salesPlaybook.salesTargets.month3.closedWon}</p>}
                                  {project.gtmOutput.salesPlaybook.salesTargets.month3.averageDealSize && <p>Deal Size: {project.gtmOutput.salesPlaybook.salesTargets.month3.averageDealSize}</p>}
                                </div>
                              )}
                              {project.gtmOutput.salesPlaybook.salesTargets.month6 && (
                                <div className="bg-muted rounded-lg p-2 text-xs">
                                  <p className="font-medium">Month 6</p>
                                  {project.gtmOutput.salesPlaybook.salesTargets.month6.pipeline && <p>Pipeline: {project.gtmOutput.salesPlaybook.salesTargets.month6.pipeline}</p>}
                                  {project.gtmOutput.salesPlaybook.salesTargets.month6.closedWon && <p>Closed: {project.gtmOutput.salesPlaybook.salesTargets.month6.closedWon}</p>}
                                  {project.gtmOutput.salesPlaybook.salesTargets.month6.averageDealSize && <p>Deal Size: {project.gtmOutput.salesPlaybook.salesTargets.month6.averageDealSize}</p>}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Budget and Investment */}
                  {project.gtmOutput.budgetAndInvestment && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        💰 Budget & Investment
                      </h4>
                      <div className="space-y-3">
                        {project.gtmOutput.budgetAndInvestment.totalGtmBudget && (
                          <div>
                            <p className="text-sm"><strong>Total GTM Budget:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.budgetAndInvestment.totalGtmBudget}</p>
                          </div>
                        )}
                        
                        {/* Channel Investment */}
                        {project.gtmOutput.budgetAndInvestment.channelInvestment && (
                          <div>
                            <p className="text-sm font-medium mb-2">Channel Investment</p>
                            <div className="space-y-1">
                              {project.gtmOutput.budgetAndInvestment.channelInvestment.contentMarketing && (
                                <p className="text-xs text-muted-foreground">Content Marketing: {project.gtmOutput.budgetAndInvestment.channelInvestment.contentMarketing}</p>
                              )}
                              {project.gtmOutput.budgetAndInvestment.channelInvestment.salesDevelopment && (
                                <p className="text-xs text-muted-foreground">Sales Development: {project.gtmOutput.budgetAndInvestment.channelInvestment.salesDevelopment}</p>
                              )}
                              {project.gtmOutput.budgetAndInvestment.channelInvestment.partnerships && (
                                <p className="text-xs text-muted-foreground">Partnerships: {project.gtmOutput.budgetAndInvestment.channelInvestment.partnerships}</p>
                              )}
                              {project.gtmOutput.budgetAndInvestment.channelInvestment.customerSuccess && (
                                <p className="text-xs text-muted-foreground">Customer Success: {project.gtmOutput.budgetAndInvestment.channelInvestment.customerSuccess}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ROI Projections */}
                        {project.gtmOutput.budgetAndInvestment.roiProjections && (
                          <div>
                            <p className="text-sm font-medium mb-2">ROI Projections</p>
                            <div className="grid gap-2 md:grid-cols-2">
                              {project.gtmOutput.budgetAndInvestment.roiProjections.month6Revenue && (
                                <p className="text-xs text-muted-foreground">Month 6 Revenue: {project.gtmOutput.budgetAndInvestment.roiProjections.month6Revenue}</p>
                              )}
                              {project.gtmOutput.budgetAndInvestment.roiProjections.blendedCAC && (
                                <p className="text-xs text-muted-foreground">Blended CAC: {project.gtmOutput.budgetAndInvestment.roiProjections.blendedCAC}</p>
                              )}
                              {project.gtmOutput.budgetAndInvestment.roiProjections.ltvCacRatio && (
                                <p className="text-xs text-muted-foreground">LTV:CAC Ratio: {project.gtmOutput.budgetAndInvestment.roiProjections.ltvCacRatio}</p>
                              )}
                              {project.gtmOutput.budgetAndInvestment.roiProjections.paybackPeriod && (
                                <p className="text-xs text-muted-foreground">Payback Period: {project.gtmOutput.budgetAndInvestment.roiProjections.paybackPeriod}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Operational Requirements */}
                  {project.gtmOutput.operationalRequirements && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ⚙️ Operational Requirements
                      </h4>
                      <div className="space-y-3">
                        {/* Team Structure */}
                        {project.gtmOutput.operationalRequirements.teamStructure && (
                          <div>
                            <p className="text-sm font-medium mb-2">Team Structure</p>
                            <div className="space-y-1">
                              {project.gtmOutput.operationalRequirements.teamStructure.month1 && (
                                <p className="text-xs text-muted-foreground">Month 1: {project.gtmOutput.operationalRequirements.teamStructure.month1}</p>
                              )}
                              {project.gtmOutput.operationalRequirements.teamStructure.month3 && (
                                <p className="text-xs text-muted-foreground">Month 3: {project.gtmOutput.operationalRequirements.teamStructure.month3}</p>
                              )}
                              {project.gtmOutput.operationalRequirements.teamStructure.month6 && (
                                <p className="text-xs text-muted-foreground">Month 6: {project.gtmOutput.operationalRequirements.teamStructure.month6}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tool Stack */}
                        {project.gtmOutput.operationalRequirements.toolStack && (
                          <div>
                            <p className="text-sm font-medium mb-2">Tool Stack</p>
                            <div className="space-y-1">
                              {project.gtmOutput.operationalRequirements.toolStack.crm && (
                                <p className="text-xs text-muted-foreground">CRM: {project.gtmOutput.operationalRequirements.toolStack.crm}</p>
                              )}
                              {project.gtmOutput.operationalRequirements.toolStack.marketing && (
                                <p className="text-xs text-muted-foreground">Marketing: {project.gtmOutput.operationalRequirements.toolStack.marketing}</p>
                              )}
                              {project.gtmOutput.operationalRequirements.toolStack.sales && (
                                <p className="text-xs text-muted-foreground">Sales: {project.gtmOutput.operationalRequirements.toolStack.sales}</p>
                              )}
                              {project.gtmOutput.operationalRequirements.toolStack.analytics && (
                                <p className="text-xs text-muted-foreground">Analytics: {project.gtmOutput.operationalRequirements.toolStack.analytics}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Risk Mitigation */}
                  {project.gtmOutput.riskMitigation && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ⚠️ Risk Mitigation
                      </h4>
                      <div className="space-y-3">
                        {/* Channel Risks */}
                        {project.gtmOutput.riskMitigation.channelRisks && Array.isArray(project.gtmOutput.riskMitigation.channelRisks) && (
                          <div>
                            <p className="text-sm font-medium mb-2">Channel Risks</p>
                            <div className="space-y-2">
                              {project.gtmOutput.riskMitigation.channelRisks.map((risk: any, index: number) => (
                                <div key={index} className="border border-muted rounded-lg p-2">
                                  <div className="flex justify-between items-start mb-1">
                                    <p className="text-xs font-medium">{risk.risk || 'Risk'}</p>
                                    <div className="flex gap-1">
                                      {risk.probability && <Badge variant="outline" className="text-xs">P: {risk.probability}</Badge>}
                                      {risk.impact && <Badge variant="outline" className="text-xs">I: {risk.impact}</Badge>}
                                    </div>
                                  </div>
                                  {risk.mitigation && (
                                    <p className="text-xs text-muted-foreground"><strong>Mitigation:</strong> {risk.mitigation}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contingency Plans */}
                        {project.gtmOutput.riskMitigation.contingencyPlans && (
                          <div>
                            <p className="text-sm font-medium mb-2">Contingency Plans</p>
                            <div className="space-y-1">
                              {project.gtmOutput.riskMitigation.contingencyPlans.underperformance && (
                                <div className="bg-muted rounded-lg p-2">
                                  <p className="text-xs"><strong>Underperformance:</strong> {project.gtmOutput.riskMitigation.contingencyPlans.underperformance}</p>
                                </div>
                              )}
                              {project.gtmOutput.riskMitigation.contingencyPlans.overperformance && (
                                <div className="bg-muted rounded-lg p-2">
                                  <p className="text-xs"><strong>Overperformance:</strong> {project.gtmOutput.riskMitigation.contingencyPlans.overperformance}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
                
                {/* Show complete report button when all steps are done and no fallbacks */}
                {!project.gtmOutput._fallback && (
                  <div className="mt-6 pt-6 border-t">
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-3">
                          <h3 className="text-lg font-semibold text-green-800">🎉 Business Plan Complete!</h3>
                          <p className="text-sm text-green-700">All sections have been generated. View your complete business plan and export it.</p>
                          <Button 
                            onClick={() => {
                              setCurrentStep("complete");
                              setHasAutoNavigated(true); // Prevent auto-navigation from interfering
                            }}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            View Complete Report & Export →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Complete Report View */}
      {currentStep === "complete" && project && (
        <>
          <CompleteReportView project={project} />
        </>
      )}

    </div>
  );
}