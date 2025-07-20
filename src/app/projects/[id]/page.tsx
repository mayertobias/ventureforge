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

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        const dbProject = data.project;
        
        // For MEMORY_ONLY projects, merge with client-side data
        if (dbProject.storageMode === 'MEMORY_ONLY') {
          const clientProject = ClientStorageService.getProject(projectId);
          
          if (clientProject) {
            // Merge database metadata with client AI responses
            const mergedProject = {
              ...dbProject,
              ideaOutput: clientProject.ideaOutput,
              researchOutput: clientProject.researchOutput,
              blueprintOutput: clientProject.blueprintOutput,
              financialOutput: clientProject.financialOutput,
              pitchOutput: clientProject.pitchOutput,
              gtmOutput: clientProject.gtmOutput,
            };
            setProject(mergedProject);
            console.log('[CLIENT_STORAGE] Merged client data with database metadata');
          } else {
            // Initialize client storage for this project
            ClientStorageService.initializeProject(projectId, dbProject.name);
            setProject(dbProject);
            console.log('[CLIENT_STORAGE] Initialized client storage for memory-only project');
          }
        } else {
          // PERSISTENT projects use database data directly
          setProject(dbProject);
          console.log('[DB_STORAGE] Using database data for persistent project');
        }
        
        // Determine current step based on URL parameter or what's completed
        if (stepFromUrl) {
          // Validate that the step from URL is accessible
          const validSteps = ["idea", "research", "blueprint", "financials", "pitch", "gtm", "complete"];
          if (validSteps.includes(stepFromUrl)) {
            setCurrentStep(stepFromUrl);
          }
        } else {
          // Auto-set based on completion status only if no URL step specified
          if (data.project.gtmOutput) setCurrentStep("gtm");
          else if (data.project.pitchOutput) setCurrentStep("pitch");
          else if (data.project.financialOutput) setCurrentStep("financials");
          else if (data.project.blueprintOutput) setCurrentStep("blueprint");
          else if (data.project.researchOutput) setCurrentStep("research");
          else if (data.project.ideaOutput) setCurrentStep("research");
          else setCurrentStep("idea");
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
    await handleAIGeneration("idea-spark", { userInput: userInput.trim() }, "Ideas generated successfully!", undefined, "ideaOutput");
    setUserInput("");
  };

  const handleResearchGeneration = async () => {
    if (!selectedIdea) return;
    await handleAIGeneration("research-gemini", { selectedIdea }, "Market research completed!", undefined, "researchOutput");
  };

  const handleBlueprintGeneration = async () => {
    await handleAIGeneration("blueprint", {}, "Business blueprint created!", "financials", "blueprintOutput");
  };

  const handleFinancialsGeneration = async () => {
    await handleAIGeneration("financials", {}, "Financial projections completed!", "pitch", "financialOutput");
  };

  const handlePitchGeneration = async () => {
    await handleAIGeneration("pitch", {}, "Investor pitch created!", "gtm", "pitchOutput");
  };

  const handleGTMGeneration = async () => {
    await handleAIGeneration("gtm", {}, "Go-to-market strategy completed!", undefined, "gtmOutput");
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
                <h3 className="font-semibold">Market Research Results:</h3>
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
                <h3 className="font-semibold">Business Blueprint:</h3>
                <div className="grid gap-4">
                  {/* Core Business Model */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      🏗️ Core Business Model
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm"><strong>Business Model:</strong></p>
                        <p className="text-sm text-muted-foreground">{project.blueprintOutput.coreBusinessModel?.model}</p>
                      </div>
                      <div>
                        <p className="text-sm"><strong>Rationale:</strong></p>
                        <p className="text-sm text-muted-foreground">{project.blueprintOutput.coreBusinessModel?.rationale}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Revenue Streams */}
                  {project.blueprintOutput.revenueStreams && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        💰 Revenue Streams
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.revenueStreams.primary && (
                          <div>
                            <p className="text-sm"><strong>Primary Revenue Stream:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.revenueStreams.primary}</p>
                          </div>
                        )}
                        {project.blueprintOutput.revenueStreams.secondary && project.blueprintOutput.revenueStreams.secondary.length > 0 && (
                          <div>
                            <p className="text-sm"><strong>Secondary Revenue Streams:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.blueprintOutput.revenueStreams.secondary.map((stream: string, index: number) => (
                                <li key={index}>{stream}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.blueprintOutput.revenueStreams.pricingStrategy && (
                          <div>
                            <p className="text-sm"><strong>Pricing Strategy:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.revenueStreams.pricingStrategy}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Value Proposition */}
                  {project.blueprintOutput.valueProposition && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ⭐ Value Proposition
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.valueProposition.core && (
                          <div>
                            <p className="text-sm"><strong>Core Value Proposition:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.valueProposition.core}</p>
                          </div>
                        )}
                        {project.blueprintOutput.valueProposition.keyBenefits && (
                          <div>
                            <p className="text-sm"><strong>Key Benefits:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.blueprintOutput.valueProposition.keyBenefits.map((benefit: string, index: number) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.blueprintOutput.valueProposition.differentiation && (
                          <div>
                            <p className="text-sm"><strong>Differentiation:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.valueProposition.differentiation}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Operations Plan */}
                  {project.blueprintOutput.operationsPlan && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ⚙️ Operations Plan
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.operationsPlan.keyActivities && (
                          <div>
                            <p className="text-sm"><strong>Key Activities:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.blueprintOutput.operationsPlan.keyActivities.map((activity: string, index: number) => (
                                <li key={index}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.blueprintOutput.operationsPlan.keyResources && (
                          <div>
                            <p className="text-sm"><strong>Key Resources:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.blueprintOutput.operationsPlan.keyResources.map((resource: string, index: number) => (
                                <li key={index}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.blueprintOutput.operationsPlan.keyPartners && (
                          <div>
                            <p className="text-sm"><strong>Key Partners:</strong></p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.blueprintOutput.operationsPlan.keyPartners.map((partner: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">{partner}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Market Entry Strategy */}
                  {project.blueprintOutput.marketEntryStrategy && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🎯 Market Entry Strategy
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.marketEntryStrategy.approach && (
                          <div>
                            <p className="text-sm"><strong>Entry Approach:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.marketEntryStrategy.approach}</p>
                          </div>
                        )}
                        {project.blueprintOutput.marketEntryStrategy.initialMarket && (
                          <div>
                            <p className="text-sm"><strong>Initial Target Market:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.marketEntryStrategy.initialMarket}</p>
                          </div>
                        )}
                        {project.blueprintOutput.marketEntryStrategy.expansionPlan && (
                          <div>
                            <p className="text-sm"><strong>Expansion Plan:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.blueprintOutput.marketEntryStrategy.expansionPlan}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Risk Analysis */}
                  {project.blueprintOutput.riskAnalysis && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ⚠️ Risk Analysis
                      </h4>
                      <div className="space-y-3">
                        {project.blueprintOutput.riskAnalysis.keyRisks && (
                          <div>
                            <p className="text-sm"><strong>Key Risks:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.blueprintOutput.riskAnalysis.keyRisks.map((risk: string, index: number) => (
                                <li key={index}>{risk}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.blueprintOutput.riskAnalysis.mitigationStrategies && (
                          <div>
                            <p className="text-sm"><strong>Mitigation Strategies:</strong></p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                              {project.blueprintOutput.riskAnalysis.mitigationStrategies.map((strategy: string, index: number) => (
                                <li key={index}>{strategy}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
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
                <h3 className="font-semibold">Financial Projections:</h3>
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
                <h3 className="font-semibold">Investor Pitch:</h3>
                <div className="grid gap-4">
                  {/* Executive Summary */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      📄 Executive Summary
                    </h4>
                    <p className="text-sm leading-relaxed">{project.pitchOutput.executiveSummary}</p>
                  </Card>

                  {/* Pitch Deck Content */}
                  {project.pitchOutput.pitchDeckContent && (
                    <>
                      {/* Problem & Solution */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {project.pitchOutput.pitchDeckContent.problem && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              ❗ The Problem
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm">{project.pitchOutput.pitchDeckContent.problem.content}</p>
                              {project.pitchOutput.pitchDeckContent.problem.marketSize && (
                                <div className="text-center p-2 bg-muted rounded">
                                  <div className="font-bold text-primary">{project.pitchOutput.pitchDeckContent.problem.marketSize}</div>
                                  <div className="text-xs text-muted-foreground">Market Size Affected</div>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}

                        {project.pitchOutput.pitchDeckContent.solution && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              💡 The Solution
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm">{project.pitchOutput.pitchDeckContent.solution.content}</p>
                              {project.pitchOutput.pitchDeckContent.solution.keyFeatures && (
                                <div>
                                  <p className="text-sm font-medium">Key Features:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {project.pitchOutput.pitchDeckContent.solution.keyFeatures.map((feature: string, index: number) => (
                                      <Badge key={index} variant="secondary" className="text-xs">{feature}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}
                      </div>

                      {/* Market Opportunity */}
                      {project.pitchOutput.pitchDeckContent.marketOpportunity && (
                        <Card className="p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            🌍 Market Opportunity
                          </h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <div className="text-lg font-bold text-primary">
                                {project.pitchOutput.pitchDeckContent.marketOpportunity.tam || 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">Total Addressable Market</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <div className="text-lg font-bold text-primary">
                                {project.pitchOutput.pitchDeckContent.marketOpportunity.sam || 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">Serviceable Addressable Market</div>
                            </div>
                          </div>
                          {project.pitchOutput.pitchDeckContent.marketOpportunity.marketTrends && (
                            <div className="mt-3">
                              <p className="text-sm"><strong>Market Trends:</strong></p>
                              <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.marketOpportunity.marketTrends}</p>
                            </div>
                          )}
                        </Card>
                      )}

                      {/* Business Model & Traction */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {project.pitchOutput.pitchDeckContent.businessModel && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              💼 Business Model
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm"><strong>Revenue Streams:</strong></p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.businessModel.revenueStreams}</p>
                              </div>
                              <div>
                                <p className="text-sm"><strong>Pricing Strategy:</strong></p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.businessModel.pricingStrategy}</p>
                              </div>
                              <div>
                                <p className="text-sm"><strong>Unit Economics:</strong></p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.businessModel.unitEconomics}</p>
                              </div>
                            </div>
                          </Card>
                        )}

                        {project.pitchOutput.pitchDeckContent.traction && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              🚀 Traction
                            </h4>
                            <div className="space-y-2">
                              {project.pitchOutput.pitchDeckContent.traction.keyMilestones && (
                                <div>
                                  <p className="text-sm"><strong>Key Milestones:</strong></p>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                                    {project.pitchOutput.pitchDeckContent.traction.keyMilestones.map((milestone: string, index: number) => (
                                      <li key={index}>{milestone}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {project.pitchOutput.pitchDeckContent.traction.proofPoints && (
                                <div>
                                  <p className="text-sm"><strong>Proof Points:</strong></p>
                                  <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.traction.proofPoints}</p>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}
                      </div>

                      {/* The Ask */}
                      {project.pitchOutput.pitchDeckContent.theAsk && (
                        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            💰 The Ask
                          </h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="text-center p-3 bg-white rounded-lg">
                              <div className="text-2xl font-bold text-primary">
                                {project.pitchOutput.pitchDeckContent.theAsk.fundingAmount || 'N/A'}
                              </div>
                              <div className="text-sm text-muted-foreground">Funding Amount</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <div className="text-2xl font-bold text-primary">
                                {project.pitchOutput.pitchDeckContent.theAsk.timeline || 'N/A'}
                              </div>
                              <div className="text-sm text-muted-foreground">Runway</div>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div>
                              <p className="text-sm"><strong>Use of Funds:</strong></p>
                              <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.theAsk.useOfFunds}</p>
                            </div>
                            <div>
                              <p className="text-sm"><strong>Key Milestone:</strong></p>
                              <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.theAsk.keyMilestone}</p>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Team & Exit Strategy */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {project.pitchOutput.pitchDeckContent.team && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              👥 The Team
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm"><strong>Team Strength:</strong></p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.team.teamStrength}</p>
                              </div>
                              <div>
                                <p className="text-sm"><strong>Advisors:</strong></p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.team.advisors}</p>
                              </div>
                              <div>
                                <p className="text-sm"><strong>Hiring Plan:</strong></p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.team.hiringPlan}</p>
                              </div>
                            </div>
                          </Card>
                        )}

                        {project.pitchOutput.pitchDeckContent.exitStrategy && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              🏁 Exit Strategy
                            </h4>
                            <div className="space-y-2">
                              {project.pitchOutput.pitchDeckContent.exitStrategy.potentialAcquirers && (
                                <div>
                                  <p className="text-sm"><strong>Potential Acquirers:</strong></p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {project.pitchOutput.pitchDeckContent.exitStrategy.potentialAcquirers.map((acquirer: string, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs">{acquirer}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div>
                                <p className="text-sm"><strong>Exit Timeline:</strong></p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.exitStrategy.exitTimeline}</p>
                              </div>
                              <div>
                                <p className="text-sm"><strong>Valuation Multiple:</strong></p>
                                <p className="text-sm text-muted-foreground">{project.pitchOutput.pitchDeckContent.exitStrategy.valuationMultiple}</p>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    </>
                  )}

                  {/* Investor FAQ */}
                  {project.pitchOutput.investorFAQ && project.pitchOutput.investorFAQ.length > 0 && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        ❓ Investor FAQ
                      </h4>
                      <div className="space-y-3">
                        {project.pitchOutput.investorFAQ.map((faq: any, index: number) => (
                          <div key={index} className="border-l-2 border-muted pl-4">
                            <p className="text-sm font-medium mb-1">{faq.question}</p>
                            <p className="text-sm text-muted-foreground">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
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
                <h3 className="font-semibold">Go-to-Market Strategy:</h3>
                <div className="grid gap-4">
                  {/* Launch Timeline */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      ⏰ Launch Timeline
                    </h4>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm font-bold text-primary">Month 1</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {project.gtmOutput.launchTimeline?.month1 || 'Launch activities and goals'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm font-bold text-primary">Month 3</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {project.gtmOutput.launchTimeline?.month3 || 'Growth milestones'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm font-bold text-primary">Month 6</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {project.gtmOutput.launchTimeline?.month6 || 'Scale targets'}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Customer Acquisition */}
                  {project.gtmOutput.customerAcquisition && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📈 Customer Acquisition
                      </h4>
                      <div className="space-y-3">
                        {project.gtmOutput.customerAcquisition.targetPersona && (
                          <div>
                            <p className="text-sm"><strong>Target Persona:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.customerAcquisition.targetPersona}</p>
                          </div>
                        )}
                        {project.gtmOutput.customerAcquisition.acquisitionTactics && (
                          <div>
                            <p className="text-sm"><strong>Acquisition Tactics:</strong></p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.gtmOutput.customerAcquisition.acquisitionTactics.map((tactic: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">{tactic}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.gtmOutput.customerAcquisition.acquisitionGoals && (
                          <div>
                            <p className="text-sm"><strong>Acquisition Goals:</strong></p>
                            <div className="space-y-1 mt-1">
                              {project.gtmOutput.customerAcquisition.acquisitionGoals.paidCustomers && (
                                <p className="text-sm text-muted-foreground">• Paid Customers: {project.gtmOutput.customerAcquisition.acquisitionGoals.paidCustomers}</p>
                              )}
                              {project.gtmOutput.customerAcquisition.acquisitionGoals.pipeline && (
                                <p className="text-sm text-muted-foreground">• Pipeline: {project.gtmOutput.customerAcquisition.acquisitionGoals.pipeline}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Marketing Channels */}
                  {project.gtmOutput.marketingChannels && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📢 Marketing Channels
                      </h4>
                      <div className="space-y-3">
                        {project.gtmOutput.marketingChannels.paidChannels && project.gtmOutput.marketingChannels.paidChannels.length > 0 && (
                          <div>
                            <p className="text-sm"><strong>Paid Channels:</strong></p>
                            <div className="space-y-2 mt-1">
                              {project.gtmOutput.marketingChannels.paidChannels.map((channel: any, index: number) => (
                                <div key={index} className="bg-muted rounded-lg p-2">
                                  <p className="text-sm font-medium">{channel.channel}</p>
                                  <p className="text-xs text-muted-foreground">Budget: {channel.budget} | Expected ROI: {channel.expectedROI}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.gtmOutput.marketingChannels.organicChannels && project.gtmOutput.marketingChannels.organicChannels.length > 0 && (
                          <div>
                            <p className="text-sm"><strong>Organic Channels:</strong></p>
                            <div className="space-y-2 mt-1">
                              {project.gtmOutput.marketingChannels.organicChannels.map((channel: any, index: number) => (
                                <div key={index} className="bg-muted rounded-lg p-2">
                                  <p className="text-sm font-medium">{channel.channel}</p>
                                  <p className="text-xs text-muted-foreground">Investment: {channel.investment} | Expected: {channel.expectedTraffic}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Sales Targets */}
                  {project.gtmOutput.salesTargets && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        💼 Sales Targets
                      </h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-sm font-bold text-primary">Month 1</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {project.gtmOutput.salesTargets.month1 || 'TBD'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-sm font-bold text-primary">Month 3</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {project.gtmOutput.salesTargets.month3 || 'TBD'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-sm font-bold text-primary">Month 6</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {project.gtmOutput.salesTargets.month6 || 'TBD'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Key Metrics */}
                  {project.gtmOutput.keyMetrics && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📊 Key Metrics
                      </h4>
                      <div className="space-y-3">
                        {project.gtmOutput.keyMetrics.CAC && (
                          <div>
                            <p className="text-sm"><strong>Customer Acquisition Cost (CAC):</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.keyMetrics.CAC}</p>
                          </div>
                        )}
                        {project.gtmOutput.keyMetrics.LTV && (
                          <div>
                            <p className="text-sm"><strong>Lifetime Value (LTV):</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.keyMetrics.LTV}</p>
                          </div>
                        )}
                        {project.gtmOutput.keyMetrics.MRR && (
                          <div>
                            <p className="text-sm"><strong>Monthly Recurring Revenue (MRR):</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.keyMetrics.MRR}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Budget Allocation */}
                  {project.gtmOutput.budgetAllocation && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        💰 Budget Allocation
                      </h4>
                      <div className="space-y-3">
                        {project.gtmOutput.budgetAllocation.totalBudget && (
                          <div>
                            <p className="text-sm"><strong>Total GTM Budget:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.budgetAllocation.totalBudget}</p>
                          </div>
                        )}
                        {project.gtmOutput.budgetAllocation.channelAllocation && (
                          <div>
                            <p className="text-sm"><strong>Channel Allocation:</strong></p>
                            <p className="text-sm text-muted-foreground">{project.gtmOutput.budgetAllocation.channelAllocation}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
                
                {/* Show complete report button when all steps are done */}
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