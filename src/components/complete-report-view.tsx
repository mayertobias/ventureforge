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
                {project.pitchOutput?.executiveSummary || 'Executive summary not available'}
              </p>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Concept</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-2">{project.ideaOutput?.selectedIdea?.title || 'N/A'}</p>
                <p className="text-sm text-muted-foreground mb-3">{project.ideaOutput?.selectedIdea?.concept || 'N/A'}</p>
                <div className="space-y-1 text-sm">
                  <p><strong>Target:</strong> {project.ideaOutput?.selectedIdea?.targetNiche || 'N/A'}</p>
                  <p><strong>Revenue Model:</strong> {project.ideaOutput?.selectedIdea?.revenueModel || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>TAM:</strong> {project.researchOutput?.marketLandscape?.totalAddressableMarket || 'N/A'}</p>
                  <p><strong>SAM:</strong> {project.researchOutput?.marketLandscape?.serviceableAddressableMarket || 'N/A'}</p>
                  <p><strong>Growth Rate:</strong> {project.researchOutput?.marketLandscape?.marketGrowthRate || 'N/A'}</p>
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
                  <h3 className="font-medium mb-2">{project.ideaOutput?.selectedIdea?.title || 'N/A'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{project.ideaOutput?.selectedIdea?.concept || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Target Niche:</span>
                    <p>{project.ideaOutput?.selectedIdea?.targetNiche || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Revenue Model:</span>
                    <p>{project.ideaOutput?.selectedIdea?.revenueModel || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Uniqueness Score:</span>
                    <p>{project.ideaOutput?.selectedIdea?.uniquenessScore || 'N/A'}/10</p>
                  </div>
                  <div>
                    <span className="font-medium">Why Unique:</span>
                    <p>{project.ideaOutput?.selectedIdea?.uniquenessReason || 'N/A'}</p>
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
                      {project.researchOutput?.marketLandscape?.totalAddressableMarket || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Addressable Market</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {project.researchOutput?.marketLandscape?.serviceableAddressableMarket || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Serviceable Addressable Market</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {project.researchOutput?.marketLandscape?.marketGrowthRate || 'N/A'}
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
                <p className="text-sm"><strong>Key Opportunity:</strong> {project.researchOutput?.competitiveLandscape?.competitiveGap || 'N/A'}</p>
                <p className="text-sm mt-2"><strong>Market Position:</strong> {project.researchOutput?.competitiveLandscape?.marketPosition || 'N/A'}</p>
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
                  <p className="text-sm"><strong>Model:</strong> {project.blueprintOutput?.coreBusinessModel?.model || 'N/A'}</p>
                  <p className="text-sm mt-2">{project.blueprintOutput?.coreBusinessModel?.rationale || 'N/A'}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Revenue Streams</h4>
                  <p className="text-sm">{project.blueprintOutput?.revenueStreams?.primary || 'N/A'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Value Proposition</h4>
                  <p className="text-sm">{project.blueprintOutput?.valueProposition?.core || 'N/A'}</p>
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
                      {project.financialOutput?.fundingAnalysis?.seedFunding || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Seed Funding</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {project.financialOutput?.fundingAnalysis?.runwayMonths || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Runway (Months)</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {project.financialOutput?.pathToProfitability?.breakEvenMonth || 'N/A'}
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
                      {project.financialOutput?.threeYearProjections?.year1?.totalRevenue || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Year 1 Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {project.financialOutput?.threeYearProjections?.year2?.totalRevenue || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Year 2 Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {project.financialOutput?.threeYearProjections?.year3?.totalRevenue || 'N/A'}
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
                  {project.pitchOutput?.executiveSummary || 'Executive summary not available'}
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
                    <p className="text-sm">{project.pitchOutput?.pitchDeckContent?.problem?.content || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">The Solution</h4>
                    <p className="text-sm">{project.pitchOutput?.pitchDeckContent?.solution?.content || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">The Ask</h4>
                    <p className="text-sm"><strong>Funding Amount:</strong> {project.pitchOutput?.pitchDeckContent?.theAsk?.fundingAmount || 'N/A'}</p>
                    <p className="text-sm"><strong>Use of Funds:</strong> {project.pitchOutput?.pitchDeckContent?.theAsk?.useOfFunds || 'N/A'}</p>
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