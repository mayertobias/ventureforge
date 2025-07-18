"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  FileText, 
  Eye, 
  Share2, 
  CheckCircle,
  Lightbulb,
  Search,
  Building,
  DollarSign,
  Target,
  Rocket,
  Copy,
  ExternalLink,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import { ReportGenerator } from "@/components/report-generator";

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

interface CompleteReportViewProps {
  project: Project;
}

export function CompleteReportView({ project }: CompleteReportViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Helper functions to extract data from AI output structures
  const getSelectedIdea = () => {
    if (project.ideaOutput?.selectedIdea) return project.ideaOutput.selectedIdea;
    if (project.ideaOutput?.ideas?.[0]) return project.ideaOutput.ideas[0];
    return null;
  };
  
  const getMarketData = () => {
    return project.researchOutput?.marketLandscape || {};
  };
  
  const getBusinessModel = () => {
    return project.blueprintOutput?.coreBusinessModel || {};
  };
  
  const getRevenueStreams = () => {
    if (project.blueprintOutput?.revenueArchitecture?.primaryStreams?.[0]) {
      return project.blueprintOutput.revenueArchitecture.primaryStreams[0];
    }
    if (project.blueprintOutput?.revenueStreams?.[0]) {
      return project.blueprintOutput.revenueStreams[0];
    }
    return {};
  };
  
  const getValueProp = () => {
    if (project.blueprintOutput?.customerStrategy?.primarySegments?.[0]?.valueProposition) {
      return project.blueprintOutput.customerStrategy.primarySegments[0].valueProposition;
    }
    if (project.blueprintOutput?.valuePropositions?.[0]?.value) {
      return project.blueprintOutput.valuePropositions[0].value;
    }
    return null;
  };
  
  const getFinancialData = () => {
    return project.financialOutput || {};
  };
  
  const getPitchData = () => {
    return project.pitchOutput?.pitchDeckContent || {};
  };
  
  const selectedIdea = getSelectedIdea();
  const marketData = getMarketData();
  const businessModel = getBusinessModel();
  const revenueStream = getRevenueStreams();
  const valueProp = getValueProp();
  const financialData = getFinancialData();
  const pitchData = getPitchData();

  if (!project) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Report...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Report link copied to clipboard!', {
        icon: '🔗',
        duration: 3000
      });
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy link');
    }
  };


  const completedSteps = [
    { id: 'idea', name: 'Business Idea', icon: Lightbulb, completed: !!project.ideaOutput },
    { id: 'research', name: 'Market Research', icon: Search, completed: !!project.researchOutput },
    { id: 'blueprint', name: 'Business Model', icon: Building, completed: !!project.blueprintOutput },
    { id: 'financials', name: 'Financial Plan', icon: DollarSign, completed: !!project.financialOutput },
    { id: 'pitch', name: 'Investor Pitch', icon: Target, completed: !!project.pitchOutput },
    { id: 'gtm', name: 'Go-to-Market', icon: Rocket, completed: !!project.gtmOutput }
  ];

  const completionPercentage = Math.round((completedSteps.filter(step => step.completed).length / completedSteps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Business Plan Complete!
              </CardTitle>
              <CardDescription className="text-green-700">
                Your comprehensive business plan is ready for review and export
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{completionPercentage}%</div>
              <div className="text-sm text-green-600">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {completedSteps.map(step => (
              <Badge key={step.id} variant={step.completed ? "default" : "secondary"} className="flex items-center gap-1">
                <step.icon className="h-3 w-3" />
                {step.name}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <ReportGenerator projectId={project.id} projectName={project.name} />
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" onClick={() => window.open(`/projects/${project.id}/share`, '_blank')}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="idea">Idea</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="pitch">Pitch</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {project.pitchOutput?.executiveSummary || 'No executive summary available'}
              </p>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Concept</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-2">{selectedIdea?.title || 'No idea selected'}</p>
                <p className="text-sm text-muted-foreground mb-3">{selectedIdea?.concept || 'No concept available'}</p>
                <div className="space-y-1 text-sm">
                  <p><strong>Target:</strong> {selectedIdea?.targetNiche || 'Not specified'}</p>
                  <p><strong>Revenue Model:</strong> {selectedIdea?.revenueModel || 'Not specified'}</p>
                  <p><strong>Uniqueness Score:</strong> {selectedIdea?.uniquenessScore || 'N/A'}/10</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>TAM:</strong> {marketData?.totalAddressableMarket || 'Not available'}</p>
                  <p><strong>SAM:</strong> {marketData?.serviceableAddressableMarket || 'Not available'}</p>
                  <p><strong>Growth Rate:</strong> {marketData?.marketGrowthRate || 'Not available'}</p>
                  {marketData?.keyDrivers && (
                    <div className="mt-3">
                      <p><strong>Key Drivers:</strong></p>
                      <ul className="list-disc list-inside text-xs mt-1">
                        {marketData.keyDrivers.map((driver: string, index: number) => (
                          <li key={index}>{driver}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="idea">
          <Card>
            <CardHeader>
              <CardTitle>Selected Business Idea</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{selectedIdea?.title || 'No idea selected'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedIdea?.concept || 'No concept available'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Target Niche:</span>
                    <p>{selectedIdea?.targetNiche || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Revenue Model:</span>
                    <p>{selectedIdea?.revenueModel || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Uniqueness Score:</span>
                    <p>{selectedIdea?.uniquenessScore || 'N/A'}/10</p>
                  </div>
                  <div>
                    <span className="font-medium">Why Unique:</span>
                    <p>{selectedIdea?.uniquenessReason || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Landscape</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {marketData?.totalAddressableMarket || 'Not available'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Addressable Market</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {marketData?.serviceableAddressableMarket || 'Not available'}
                    </div>
                    <div className="text-sm text-muted-foreground">Serviceable Addressable Market</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {marketData?.marketGrowthRate || 'Not available'}
                    </div>
                    <div className="text-sm text-muted-foreground">Market Growth Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm"><strong>Key Opportunity:</strong> {project.researchOutput?.competitiveLandscape?.competitiveGap || 'Analysis not available'}</p>
                {project.researchOutput?.competitiveLandscape?.directCompetitors && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">Direct Competitors:</p>
                    <div className="space-y-2 mt-2">
                      {project.researchOutput.competitiveLandscape.directCompetitors.map((competitor: any, index: number) => (
                        <div key={index} className="text-xs p-2 bg-muted rounded">
                          <p className="font-medium">{competitor.name}</p>
                          <p className="text-muted-foreground">{competitor.strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blueprint">
          <Card>
            <CardHeader>
              <CardTitle>Business Model & Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Core Business Model</h4>
                  <p className="text-sm"><strong>Model:</strong> {businessModel?.model || 'Not specified'}</p>
                  <p className="text-sm mt-2">{businessModel?.rationale || 'No rationale provided'}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Revenue Streams</h4>
                  {project.blueprintOutput?.revenueStreams?.length > 0 ? (
                    <div className="space-y-2">
                      {project.blueprintOutput.revenueStreams.map((stream: any, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded text-sm">
                          <p className="font-medium">{stream.stream} ({stream.type})</p>
                          <p className="text-muted-foreground mt-1">{stream.justification}</p>
                          <p className="text-xs mt-1"><strong>Price:</strong> {stream.illustrativePrice}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No revenue streams defined</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Value Propositions</h4>
                  {project.blueprintOutput?.valuePropositions?.length > 0 ? (
                    <div className="space-y-2">
                      {project.blueprintOutput.valuePropositions.map((vp: any, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded text-sm">
                          <p className="font-medium">For {vp.segment}:</p>
                          <p className="text-muted-foreground mt-1">{vp.value}</p>
                          {vp.keyBenefits && (
                            <ul className="list-disc list-inside text-xs mt-2">
                              {vp.keyBenefits.map((benefit: string, idx: number) => (
                                <li key={idx}>{benefit}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">{valueProp || 'No value proposition defined'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Funding Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {financialData?.fundingAnalysis?.seedFunding || 'Not calculated'}
                    </div>
                    <div className="text-sm text-muted-foreground">Seed Funding</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {financialData?.fundingAnalysis?.runwayMonths || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Runway (Months)</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {financialData?.pathToProfitability?.breakEvenMonth || 'Not calculated'}
                    </div>
                    <div className="text-sm text-muted-foreground">Break-even Timeline</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {financialData?.threeYearProjections?.year1?.totalRevenue || 'Not projected'}
                    </div>
                    <div className="text-sm text-muted-foreground">Year 1 Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {financialData?.threeYearProjections?.year2?.totalRevenue || 'Not projected'}
                    </div>
                    <div className="text-sm text-muted-foreground">Year 2 Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {financialData?.threeYearProjections?.year3?.totalRevenue || 'Not projected'}
                    </div>
                    <div className="text-sm text-muted-foreground">Year 3 Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pitch">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {project.pitchOutput?.executiveSummary || 'No executive summary available'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Key Pitch Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">The Problem</h4>
                    <p className="text-sm">{pitchData?.problem?.content || 'Problem statement not available'}</p>
                    {pitchData?.problem?.marketSize && (
                      <p className="text-xs text-muted-foreground mt-1">Market Size: {pitchData.problem.marketSize}</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">The Solution</h4>
                    <p className="text-sm">{pitchData?.solution?.content || 'Solution description not available'}</p>
                    {pitchData?.solution?.keyFeatures && (
                      <div className="mt-2">
                        <p className="text-xs font-medium">Key Features:</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                          {pitchData.solution.keyFeatures.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">The Ask</h4>
                    <p className="text-sm"><strong>Funding Amount:</strong> {pitchData?.theAsk?.fundingAmount || 'Not specified'}</p>
                    <p className="text-sm"><strong>Use of Funds:</strong> {pitchData?.theAsk?.useOfFunds || 'Not specified'}</p>
                    {pitchData?.theAsk?.timeline && (
                      <p className="text-sm"><strong>Timeline:</strong> {pitchData.theAsk.timeline}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}