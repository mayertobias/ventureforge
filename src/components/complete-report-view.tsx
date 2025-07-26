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
  Sparkles,
  Database,
  Shield
} from "lucide-react";
import toast from "react-hot-toast";
import { ReportGenerator } from "@/components/report-generator";
import { ClientStorageService } from "@/lib/client-storage";
import DataParsingUtils from "@/lib/data-parsing-utils";

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

interface CompleteReportViewProps {
  project: Project;
}

export function CompleteReportView({ project }: CompleteReportViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
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

  const handleStorageUpgrade = async () => {
    if (!project.storageMode || project.storageMode === 'PERSISTENT') {
      toast.error('This project is already stored persistently');
      return;
    }

    setIsUpgrading(true);
    try {
      // Get the complete project data from client storage
      const clientProject = ClientStorageService.getProject(project.id);
      if (!clientProject) {
        throw new Error('Client project data not found');
      }

      // Call the upgrade API
      const response = await fetch(`/api/projects/${project.id}/upgrade-storage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectData: {
            ideaOutput: clientProject.ideaOutput,
            researchOutput: clientProject.researchOutput,
            blueprintOutput: clientProject.blueprintOutput,
            financialOutput: clientProject.financialOutput,
            pitchOutput: clientProject.pitchOutput,
            gtmOutput: clientProject.gtmOutput,
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upgrade storage');
      }

      // Clear client storage after successful upgrade
      ClientStorageService.deleteProject(project.id);

      toast.success(
        '🎉 Project upgraded to persistent storage! Your data is now safely stored in our secure database.',
        {
          duration: 5000,
          icon: '🔒',
        }
      );

      // Refresh the page to update the project view
      window.location.reload();

    } catch (error) {
      console.error('Storage upgrade error:', error);
      toast.error('Failed to upgrade storage. Please try again.', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setIsUpgrading(false);
      setShowUpgradePrompt(false);
    }
  };

  const handleExportAndUpgrade = () => {
    // Show the upgrade prompt after export
    setShowUpgradePrompt(true);
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
            <ReportGenerator projectId={project.id} projectName={project.name} project={project} />
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" onClick={() => window.open(`/projects/${project.id}/share`, '_blank')}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Memory-Only Storage Notice */}
          {project.storageMode === 'MEMORY_ONLY' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">Privacy-First Storage</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    This project is stored locally in your browser for maximum privacy. Your business data never touched our servers.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowUpgradePrompt(true)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Upgrade to Persistent Storage
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Storage Upgrade Modal */}
          {showUpgradePrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Upgrade to Persistent Storage
                  </CardTitle>
                  <CardDescription>
                    Move your project from local browser storage to our secure database
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Your data will be encrypted and securely stored</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Access your project from any device</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>No expiration - permanent storage</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Enhanced collaboration features</span>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Once upgraded, your project will be permanently moved to our database. 
                      This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowUpgradePrompt(false)}
                      disabled={isUpgrading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleStorageUpgrade}
                      disabled={isUpgrading}
                      className="flex-1"
                    >
                      {isUpgrading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Upgrading...
                        </>
                      ) : (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Upgrade Storage
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="idea">Idea</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="pitch">Pitch</TabsTrigger>
          <TabsTrigger value="gtm">GTM</TabsTrigger>
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
                <p className="text-sm text-gray-800 mb-3">{selectedIdea?.concept || 'No concept available'}</p>
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
                  <p className="text-sm text-gray-800 mb-4">{selectedIdea?.concept || 'No concept available'}</p>
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
            {/* Market Landscape */}
            <Card>
              <CardHeader>
                <CardTitle>Market Landscape</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Total Addressable Market</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {DataParsingUtils.formatValue(DataParsingUtils.parseMarketData(marketData?.totalAddressableMarket || '').value)}
                    </div>
                    {DataParsingUtils.parseMarketData(marketData?.totalAddressableMarket || '').methodology && (
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {DataParsingUtils.cleanMethodology(DataParsingUtils.parseMarketData(marketData?.totalAddressableMarket || '').methodology)}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Serviceable Addressable Market</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {DataParsingUtils.formatValue(DataParsingUtils.parseMarketData(marketData?.serviceableAddressableMarket || '').value)}
                    </div>
                    {DataParsingUtils.parseMarketData(marketData?.serviceableAddressableMarket || '').methodology && (
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {DataParsingUtils.cleanMethodology(DataParsingUtils.parseMarketData(marketData?.serviceableAddressableMarket || '').methodology)}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Market Growth Rate</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {DataParsingUtils.formatValue(DataParsingUtils.parseMarketData(marketData?.marketGrowthRate || '').value)}
                    </div>
                    {DataParsingUtils.parseMarketData(marketData?.marketGrowthRate || '').methodology && (
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {DataParsingUtils.cleanMethodology(DataParsingUtils.parseMarketData(marketData?.marketGrowthRate || '').methodology)}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Key Trends */}
                {project.researchOutput?.marketLandscape?.keyTrends && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Key Market Trends</h4>
                    <p className="text-sm text-gray-800">{project.researchOutput.marketLandscape.keyTrends}</p>
                  </div>
                )}
                
                {/* Market Maturity and Seasonality */}
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  {project.researchOutput?.marketLandscape?.marketMaturity && (
                    <div>
                      <h4 className="font-medium mb-2">Market Maturity</h4>
                      <p className="text-sm text-gray-800">{project.researchOutput.marketLandscape.marketMaturity}</p>
                    </div>
                  )}
                  {project.researchOutput?.marketLandscape?.seasonality && (
                    <div>
                      <h4 className="font-medium mb-2">Seasonality</h4>
                      <p className="text-sm text-gray-800">{project.researchOutput.marketLandscape.seasonality}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Target Customer Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Target Customer Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Primary Customer Segment</h4>
                    <p className="text-sm">{project.researchOutput?.targetCustomerAnalysis?.primarySegment || 'Customer segment not available'}</p>
                  </div>
                  
                  {project.researchOutput?.targetCustomerAnalysis?.customerPainPoints && (
                    <div>
                      <h4 className="font-medium mb-2">Key Pain Points</h4>
                      <div className="space-y-2">
                        {project.researchOutput.targetCustomerAnalysis.customerPainPoints.map((painPoint: string, index: number) => (
                          <div key={index} className="text-sm p-3 bg-red-50 rounded-lg border-l-4 border-red-200">
                            {painPoint}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.researchOutput?.targetCustomerAnalysis?.buyingBehavior && (
                      <div>
                        <h4 className="font-medium mb-2">Buying Behavior</h4>
                        <p className="text-sm text-gray-800">{project.researchOutput.targetCustomerAnalysis.buyingBehavior}</p>
                      </div>
                    )}
                    {project.researchOutput?.targetCustomerAnalysis?.segmentSize && (
                      <div>
                        <h4 className="font-medium mb-2">Segment Size</h4>
                        <p className="text-sm text-gray-800">{project.researchOutput.targetCustomerAnalysis.segmentSize}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.researchOutput?.targetCustomerAnalysis?.customerAcquisitionCost && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Industry CAC Benchmark</div>
                        <div className="text-lg font-bold text-blue-800 mb-2">
                          {DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.researchOutput.targetCustomerAnalysis.customerAcquisitionCost).value)}
                        </div>
                        {DataParsingUtils.parseFinancialValue(project.researchOutput.targetCustomerAnalysis.customerAcquisitionCost).methodology && (
                          <div className="text-xs text-blue-600 leading-relaxed">
                            {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.researchOutput.targetCustomerAnalysis.customerAcquisitionCost).methodology)}
                          </div>
                        )}
                      </div>
                    )}
                    {project.researchOutput?.targetCustomerAnalysis?.lifetimeValue && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Expected LTV</div>
                        <div className="text-lg font-bold text-green-800 mb-2">
                          {DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.researchOutput.targetCustomerAnalysis.lifetimeValue).value)}
                        </div>
                        {DataParsingUtils.parseFinancialValue(project.researchOutput.targetCustomerAnalysis.lifetimeValue).methodology && (
                          <div className="text-xs text-green-600 leading-relaxed">
                            {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.researchOutput.targetCustomerAnalysis.lifetimeValue).methodology)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Competitive Landscape */}
            <Card>
              <CardHeader>
                <CardTitle>Competitive Landscape</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Market Opportunity</h4>
                    <p className="text-sm">{project.researchOutput?.competitiveLandscape?.competitiveGap || 'Analysis not available'}</p>
                  </div>
                  
                  {project.researchOutput?.competitiveLandscape?.mainCompetitors && (
                    <div>
                      <h4 className="font-medium mb-2">Main Competitors</h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {project.researchOutput.competitiveLandscape.mainCompetitors.map((competitor: string, index: number) => (
                          <div key={index} className="text-sm p-2 bg-muted rounded">
                            {competitor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.researchOutput?.competitiveLandscape?.directCompetitors && (
                    <div>
                      <h4 className="font-medium mb-2">Direct Competitors</h4>
                      <div className="space-y-2">
                        {project.researchOutput.competitiveLandscape.directCompetitors.map((competitor: any, index: number) => (
                          <div key={index} className="text-xs p-2 bg-muted rounded">
                            <p className="font-medium">{competitor.name}</p>
                            <p className="text-gray-800">{competitor.strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.researchOutput?.competitiveLandscape?.competitiveAdvantages && (
                    <div>
                      <h4 className="font-medium mb-2">Competitive Advantages</h4>
                      <div className="space-y-2">
                        {project.researchOutput.competitiveLandscape.competitiveAdvantages.map((advantage: string, index: number) => (
                          <div key={index} className="text-sm p-3 bg-green-50 rounded-lg border-l-4 border-green-200">
                            {advantage}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.researchOutput?.competitiveLandscape?.threatLevel && (
                      <div>
                        <h4 className="font-medium mb-2">Threat Level</h4>
                        <p className="text-sm text-gray-800">{project.researchOutput.competitiveLandscape.threatLevel}</p>
                      </div>
                    )}
                    {project.researchOutput?.competitiveLandscape?.marketPosition && (
                      <div>
                        <h4 className="font-medium mb-2">Recommended Positioning</h4>
                        <p className="text-sm text-gray-800">{project.researchOutput.competitiveLandscape.marketPosition}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technology Analysis */}
            {project.researchOutput?.technologyAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Technology Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.researchOutput.technologyAnalysis.requiredTechnologies && (
                      <div>
                        <h4 className="font-medium mb-2">Required Technologies</h4>
                        {Array.isArray(project.researchOutput.technologyAnalysis.requiredTechnologies) ? (
                          <div className="grid gap-2 md:grid-cols-2">
                            {project.researchOutput.technologyAnalysis.requiredTechnologies.map((tech: string, index: number) => (
                              <div key={index} className="text-sm p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r text-blue-900">
                                {tech}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r">
                            <p className="text-sm text-blue-900">{project.researchOutput.technologyAnalysis.requiredTechnologies}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {project.researchOutput.technologyAnalysis.technologyTrends && (
                      <div>
                        <h4 className="font-medium mb-2">Technology Trends</h4>
                        {Array.isArray(project.researchOutput.technologyAnalysis.technologyTrends) ? (
                          <div className="grid gap-2 md:grid-cols-2">
                            {project.researchOutput.technologyAnalysis.technologyTrends.map((trend: string, index: number) => (
                              <div key={index} className="text-sm p-3 bg-green-50 border-l-4 border-green-500 rounded-r text-green-900">
                                {trend}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r">
                            <p className="text-sm text-green-900">{project.researchOutput.technologyAnalysis.technologyTrends}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {project.researchOutput.technologyAnalysis.implementationComplexity && (
                        <div>
                          <h4 className="font-medium mb-2">Implementation Complexity</h4>
                          <p className="text-sm text-gray-800">{project.researchOutput.technologyAnalysis.implementationComplexity}</p>
                        </div>
                      )}
                      {project.researchOutput.technologyAnalysis.developmentTimeline && (
                        <div>
                          <h4 className="font-medium mb-2">Development Timeline</h4>
                          <p className="text-sm text-gray-800">{project.researchOutput.technologyAnalysis.developmentTimeline}</p>
                        </div>
                      )}
                    </div>
                    
                    {project.researchOutput.technologyAnalysis.technicalRisks && (
                      <div>
                        <h4 className="font-medium mb-2">Technical Risks</h4>
                        {Array.isArray(project.researchOutput.technologyAnalysis.technicalRisks) ? (
                          <div className="space-y-3">
                            {project.researchOutput.technologyAnalysis.technicalRisks.map((risk: string, index: number) => (
                              <div key={index} className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                                <p className="text-sm text-red-800 leading-relaxed">{risk}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                            <p className="text-sm text-red-800 leading-relaxed">{project.researchOutput.technologyAnalysis.technicalRisks}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Benchmarks */}
            {project.researchOutput?.financialBenchmarks && (
              <Card>
                <CardHeader>
                  <CardTitle>Industry Financial Benchmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.researchOutput.financialBenchmarks.industryMetrics && (
                      <div>
                        <h4 className="font-medium mb-2">Industry Metrics</h4>
                        <p className="text-sm text-gray-800">{project.researchOutput.financialBenchmarks.industryMetrics}</p>
                      </div>
                    )}
                    
                    {project.researchOutput.financialBenchmarks.revenueModels && (
                      <div>
                        <h4 className="font-medium mb-2">Revenue Models</h4>
                        <p className="text-sm text-gray-800">{project.researchOutput.financialBenchmarks.revenueModels}</p>
                      </div>
                    )}
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {project.researchOutput.financialBenchmarks.pricingStrategies && (
                        <div>
                          <h4 className="font-medium mb-2">Pricing Strategies</h4>
                          <p className="text-sm text-gray-800">{project.researchOutput.financialBenchmarks.pricingStrategies}</p>
                        </div>
                      )}
                      {project.researchOutput.financialBenchmarks.unitEconomics && (
                        <div>
                          <h4 className="font-medium mb-2">Unit Economics Benchmarks</h4>
                          <p className="text-sm text-gray-800">{project.researchOutput.financialBenchmarks.unitEconomics}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Regulatory Considerations */}
            {project.researchOutput?.regulatoryConsiderations && (
              <Card>
                <CardHeader>
                  <CardTitle>Regulatory Considerations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.researchOutput.regulatoryConsiderations.regulatoryTrends && (
                      <div>
                        <h4 className="font-medium mb-2">Regulatory Trends</h4>
                        <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded-r">
                          <p className="text-sm text-purple-900 leading-relaxed">{project.researchOutput.regulatoryConsiderations.regulatoryTrends}</p>
                        </div>
                      </div>
                    )}
                    
                    {project.researchOutput.regulatoryConsiderations.relevantRegulations && (
                      <div>
                        <h4 className="font-medium mb-2">Relevant Regulations</h4>
                        <div className="space-y-2">
                          {project.researchOutput.regulatoryConsiderations.relevantRegulations.map((regulation: string, index: number) => (
                            <div key={index} className="text-sm p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 text-yellow-900">
                              {regulation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {project.researchOutput.regulatoryConsiderations.complianceRequirements && (
                      <div>
                        <h4 className="font-medium mb-2">Compliance Requirements</h4>
                        <p className="text-sm text-gray-800">{project.researchOutput.regulatoryConsiderations.complianceRequirements}</p>
                      </div>
                    )}
                    
                    {project.researchOutput.regulatoryConsiderations.regulatoryTrends && (
                      <div>
                        <h4 className="font-medium mb-2">Regulatory Trends</h4>
                        <p className="text-sm text-gray-800">{project.researchOutput.regulatoryConsiderations.regulatoryTrends}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="blueprint">
          <div className="space-y-4">
            {/* Executive Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Business Concept</h4>
                    <p className="text-sm">{project.blueprintOutput?.executiveSummary?.businessConcept || 'No concept available'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Market Opportunity</h4>
                    <p className="text-sm">{project.blueprintOutput?.executiveSummary?.marketOpportunity || 'No market opportunity available'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Unique Advantage</h4>
                    <p className="text-sm">{project.blueprintOutput?.executiveSummary?.uniqueAdvantage || 'No unique advantage available'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Revenue Projection</h4>
                    <p className="text-sm font-medium text-green-600">{project.blueprintOutput?.executiveSummary?.revenueProjection || 'No projection available'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Core Business Model */}
            <Card>
              <CardHeader>
                <CardTitle>Core Business Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Primary Model</h4>
                    <p className="text-sm"><strong>Model:</strong> {project.blueprintOutput?.coreBusinessModel?.primaryModel || businessModel?.model || 'Not specified'}</p>
                    <p className="text-sm mt-2">{project.blueprintOutput?.coreBusinessModel?.rationale || businessModel?.rationale || 'No rationale provided'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Revenue Logic</h4>
                    <p className="text-sm">{project.blueprintOutput?.coreBusinessModel?.revenueLogic || 'No revenue logic specified'}</p>
                  </div>

                  {/* Business Model Canvas */}
                  {project.blueprintOutput?.coreBusinessModel?.businessModelCanvas && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Key Partners</h4>
                        <div className="space-y-1">
                          {project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners?.map((partner: string, index: number) => (
                            <div key={index} className="text-xs p-2 bg-muted rounded">
                              {partner}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Key Activities</h4>
                        <div className="space-y-1">
                          {project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities?.map((activity: string, index: number) => (
                            <div key={index} className="text-xs p-2 bg-muted rounded">
                              {activity}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Key Resources</h4>
                        <div className="space-y-1">
                          {project.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources?.map((resource: string, index: number) => (
                            <div key={index} className="text-xs p-2 bg-muted rounded">
                              {resource}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Cost Structure</h4>
                        <div className="space-y-1">
                          {project.blueprintOutput.coreBusinessModel.businessModelCanvas.costStructure?.map((cost: string, index: number) => (
                            <div key={index} className="text-xs p-2 bg-muted rounded">
                              {cost}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Architecture */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Primary Revenue Streams</h4>
                    {project.blueprintOutput?.revenueArchitecture?.primaryStreams?.length > 0 ? (
                      <div className="space-y-3">
                        {project.blueprintOutput.revenueArchitecture.primaryStreams.map((stream: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{stream.streamName}</h5>
                              <span className="text-sm text-green-600 font-medium">{stream.year3Projection}</span>
                            </div>
                            <p className="text-sm text-gray-800 mb-2"><strong>Model:</strong> {stream.model}</p>
                            <p className="text-sm text-gray-800 mb-2"><strong>Target:</strong> {stream.targetSegment}</p>
                            <p className="text-sm text-gray-800 mb-2"><strong>Pricing:</strong> {stream.pricingStrategy}</p>
                            <p className="text-sm">{stream.justification}</p>
                            <p className="text-xs text-blue-600 mt-2"><strong>Scalability:</strong> {stream.scalabilityFactor}</p>
                          </div>
                        ))}
                      </div>
                    ) : project.blueprintOutput?.revenueStreams?.length > 0 ? (
                      <div className="space-y-2">
                        {project.blueprintOutput.revenueStreams.map((stream: any, index: number) => (
                          <div key={index} className="p-3 bg-muted rounded text-sm">
                            <p className="font-medium">{stream.stream} ({stream.type})</p>
                            <p className="text-gray-800 mt-1">{stream.justification}</p>
                            <p className="text-xs mt-1"><strong>Price:</strong> {stream.illustrativePrice}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">No revenue streams defined</p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Pricing Philosophy</h4>
                    <p className="text-sm">{project.blueprintOutput?.revenueArchitecture?.pricingPhilosophy || 'No pricing philosophy specified'}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Monetization Timeline</h4>
                    <p className="text-sm">{project.blueprintOutput?.revenueArchitecture?.monetizationTimeline || 'No timeline specified'}</p>
                  </div>

                  {/* Unit Economics */}
                  {project.blueprintOutput?.revenueArchitecture?.unitEconomics && (
                    <div>
                      <h4 className="font-medium mb-2">Unit Economics</h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">ARPU</div>
                          <div className="text-sm font-bold text-primary mb-2">
                            {project.blueprintOutput.revenueArchitecture.unitEconomics.averageRevenuePerUser ? 
                              DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.blueprintOutput.revenueArchitecture.unitEconomics.averageRevenuePerUser).value) : 'N/A'}
                          </div>
                          {project.blueprintOutput.revenueArchitecture.unitEconomics.averageRevenuePerUser && 
                           DataParsingUtils.parseFinancialValue(project.blueprintOutput.revenueArchitecture.unitEconomics.averageRevenuePerUser).methodology && (
                            <div className="text-xs text-gray-700 leading-relaxed">
                              {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.blueprintOutput.revenueArchitecture.unitEconomics.averageRevenuePerUser).methodology)}
                            </div>
                          )}
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Customer LTV</div>
                          <div className="text-sm font-bold text-primary mb-2">
                            {project.blueprintOutput.revenueArchitecture.unitEconomics.customerLifetimeValue ? 
                              DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.blueprintOutput.revenueArchitecture.unitEconomics.customerLifetimeValue).value) : 'N/A'}
                          </div>
                          {project.blueprintOutput.revenueArchitecture.unitEconomics.customerLifetimeValue && 
                           DataParsingUtils.parseFinancialValue(project.blueprintOutput.revenueArchitecture.unitEconomics.customerLifetimeValue).methodology && (
                            <div className="text-xs text-gray-700 leading-relaxed">
                              {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.blueprintOutput.revenueArchitecture.unitEconomics.customerLifetimeValue).methodology)}
                            </div>
                          )}
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Gross Margin</div>
                          <div className="text-sm font-bold text-primary mb-2">
                            {project.blueprintOutput.revenueArchitecture.unitEconomics.grossMarginPerCustomer ? 
                              DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.blueprintOutput.revenueArchitecture.unitEconomics.grossMarginPerCustomer).value) : 'N/A'}
                          </div>
                          {project.blueprintOutput.revenueArchitecture.unitEconomics.grossMarginPerCustomer && 
                           DataParsingUtils.parseFinancialValue(project.blueprintOutput.revenueArchitecture.unitEconomics.grossMarginPerCustomer).methodology && (
                            <div className="text-xs text-gray-700 leading-relaxed">
                              {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.blueprintOutput.revenueArchitecture.unitEconomics.grossMarginPerCustomer).methodology)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fallback for legacy value propositions */}
            {project.blueprintOutput?.valuePropositions?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Value Propositions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.blueprintOutput.valuePropositions.map((vp: any, index: number) => (
                      <div key={index} className="p-3 bg-muted rounded text-sm">
                        <p className="font-medium">For {vp.segment}:</p>
                        <p className="text-gray-800 mt-1">{vp.value}</p>
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
                </CardContent>
              </Card>
            )}

            {/* Customer Strategy */}
            {project.blueprintOutput?.customerStrategy && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Strategy</CardTitle>
                  <CardDescription>Detailed customer journey and segment analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Customer Journey */}
                    {project.blueprintOutput.customerStrategy.customerJourney && Array.isArray(project.blueprintOutput.customerStrategy.customerJourney) && (
                      <div>
                        <h4 className="font-medium mb-3">Customer Journey</h4>
                        <div className="space-y-3">
                          {project.blueprintOutput.customerStrategy.customerJourney.map((stage: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <h5 className="font-medium">{stage.stage}</h5>
                              </div>
                              <p className="text-sm text-gray-800 mb-2">{stage.customerAction}</p>
                              <p className="text-sm mb-2"><strong>Touchpoints:</strong> {stage.touchpoints}</p>
                              <p className="text-sm"><strong>Key Metrics:</strong> {stage.keyMetrics}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customer Segments */}
                    {project.blueprintOutput.customerStrategy.customerSegments && Array.isArray(project.blueprintOutput.customerStrategy.customerSegments) && (
                      <div>
                        <h4 className="font-medium mb-3">Customer Segments</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {project.blueprintOutput.customerStrategy.customerSegments.map((segment: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h5 className="font-medium text-blue-600 mb-2">{segment.segment}</h5>
                              <p className="text-sm text-gray-800 mb-2">{segment.description}</p>
                              <div className="space-y-2">
                                <p className="text-sm"><strong>Size:</strong> {segment.size}</p>
                                <p className="text-sm"><strong>Growth:</strong> {segment.growth}</p>
                                <p className="text-sm"><strong>Value:</strong> {segment.value}</p>
                                <p className="text-sm"><strong>Priority:</strong> 
                                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                    segment.priority === 'High' ? 'bg-red-100 text-red-700' :
                                    segment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {segment.priority}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Competitive Strategy */}
            {project.blueprintOutput?.competitiveStrategy && (
              <Card>
                <CardHeader>
                  <CardTitle>Competitive Strategy</CardTitle>
                  <CardDescription>Sustainable advantages and innovation strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Sustainable Advantages */}
                    {project.blueprintOutput.competitiveStrategy.sustainableAdvantages && Array.isArray(project.blueprintOutput.competitiveStrategy.sustainableAdvantages) && (
                      <div>
                        <h4 className="font-medium mb-3">Sustainable Competitive Advantages</h4>
                        <div className="space-y-3">
                          {project.blueprintOutput.competitiveStrategy.sustainableAdvantages.map((advantage: any, index: number) => (
                            <div key={index} className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r">
                              <h5 className="font-medium text-green-800 mb-2">{advantage.advantage}</h5>
                              <p className="text-sm text-green-700 mb-2">{advantage.description}</p>
                              <p className="text-sm text-green-600"><strong>Defensibility:</strong> {advantage.defensibility}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Innovation Strategy */}
                    {project.blueprintOutput.competitiveStrategy.innovationStrategy && (
                      <div>
                        <h4 className="font-medium mb-3">Innovation Strategy</h4>
                        <div className="p-4 bg-blue-50 border rounded-lg">
                          {typeof project.blueprintOutput.competitiveStrategy.innovationStrategy === 'string' ? (
                            <p className="text-sm text-blue-800 leading-relaxed">
                              {project.blueprintOutput.competitiveStrategy.innovationStrategy}
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {project.blueprintOutput.competitiveStrategy.innovationStrategy.rdInvestment && (
                                <div>
                                  <h5 className="font-medium text-blue-800 mb-2">R&D Investment</h5>
                                  <p className="text-sm text-blue-700">{project.blueprintOutput.competitiveStrategy.innovationStrategy.rdInvestment}</p>
                                </div>
                              )}
                              {project.blueprintOutput.competitiveStrategy.innovationStrategy.patentStrategy && (
                                <div>
                                  <h5 className="font-medium text-blue-800 mb-2">Patent Strategy</h5>
                                  <p className="text-sm text-blue-700">{project.blueprintOutput.competitiveStrategy.innovationStrategy.patentStrategy}</p>
                                </div>
                              )}
                              {project.blueprintOutput.competitiveStrategy.innovationStrategy.innovationAreas && Array.isArray(project.blueprintOutput.competitiveStrategy.innovationStrategy.innovationAreas) && (
                                <div>
                                  <h5 className="font-medium text-blue-800 mb-2">Innovation Areas</h5>
                                  <div className="space-y-1">
                                    {project.blueprintOutput.competitiveStrategy.innovationStrategy.innovationAreas.map((area: string, index: number) => (
                                      <div key={index} className="text-sm p-2 bg-blue-100 rounded text-blue-800">
                                        {area}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Competitive Response Plan */}
                    {project.blueprintOutput.competitiveStrategy.competitiveResponse && Array.isArray(project.blueprintOutput.competitiveStrategy.competitiveResponse) && (
                      <div>
                        <h4 className="font-medium mb-3">Competitive Response Plan</h4>
                        <div className="space-y-3">
                          {project.blueprintOutput.competitiveStrategy.competitiveResponse.map((response: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">{response.scenario}</h5>
                              <p className="text-sm text-gray-800 mb-2">{response.response}</p>
                              <p className="text-sm"><strong>Timeline:</strong> {response.timeline}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Management */}
            {project.blueprintOutput?.riskManagement && (
              <Card>
                <CardHeader>
                  <CardTitle>Risk Management</CardTitle>
                  <CardDescription>Business risks and contingency plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Business Risks */}
                    {project.blueprintOutput.riskManagement.businessRisks && Array.isArray(project.blueprintOutput.riskManagement.businessRisks) && (
                      <div>
                        <h4 className="font-medium mb-3">Business Risks</h4>
                        <div className="space-y-3">
                          {project.blueprintOutput.riskManagement.businessRisks.map((risk: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium">{risk.risk}</h5>
                                <div className="flex gap-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    risk.probability === 'High' ? 'bg-red-100 text-red-700' :
                                    risk.probability === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {risk.probability} Prob
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    risk.impact === 'High' ? 'bg-red-100 text-red-700' :
                                    risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {risk.impact} Impact
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-800 mb-2">{risk.description}</p>
                              <p className="text-sm"><strong>Mitigation:</strong> {risk.mitigation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contingency Plans */}
                    {project.blueprintOutput.riskManagement.contingencyPlans && Array.isArray(project.blueprintOutput.riskManagement.contingencyPlans) && (
                      <div>
                        <h4 className="font-medium mb-3">Contingency Plans</h4>
                        <div className="space-y-3">
                          {project.blueprintOutput.riskManagement.contingencyPlans.map((plan: any, index: number) => (
                            <div key={index} className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r">
                              <h5 className="font-medium text-orange-800 mb-2">{plan.scenario}</h5>
                              <p className="text-sm text-orange-700 mb-2">{plan.plan}</p>
                              <p className="text-sm text-orange-600"><strong>Resources Required:</strong> {plan.resourcesRequired}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Operational Blueprint */}
            {project.blueprintOutput?.operationalBlueprint && (
              <Card>
                <CardHeader>
                  <CardTitle>Operational Blueprint</CardTitle>
                  <CardDescription>Core operations and technology architecture</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Core Operations */}
                    {project.blueprintOutput.operationalBlueprint.coreOperations && Array.isArray(project.blueprintOutput.operationalBlueprint.coreOperations) && (
                      <div>
                        <h4 className="font-medium mb-3">Core Operations</h4>
                        <div className="space-y-3">
                          {project.blueprintOutput.operationalBlueprint.coreOperations.map((operation: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">{operation.function}</h5>
                              <p className="text-sm text-gray-800 mb-2">{operation.description}</p>
                              <div className="grid gap-2 md:grid-cols-3">
                                <p className="text-sm"><strong>Owner:</strong> {operation.owner}</p>
                                <p className="text-sm"><strong>Priority:</strong> {operation.priority}</p>
                                <p className="text-sm"><strong>Timeline:</strong> {operation.timeline}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technology Architecture */}
                    {project.blueprintOutput.operationalBlueprint.technologyArchitecture && (
                      <div>
                        <h4 className="font-medium mb-3">Technology Architecture</h4>
                        <div className="p-4 bg-gray-50 border rounded-lg">
                          {typeof project.blueprintOutput.operationalBlueprint.technologyArchitecture === 'string' ? (
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture}
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.backend && (
                                <div>
                                  <h5 className="font-medium text-gray-800 mb-2">Backend</h5>
                                  <p className="text-sm text-gray-700">{project.blueprintOutput.operationalBlueprint.technologyArchitecture.backend}</p>
                                </div>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.frontend && (
                                <div>
                                  <h5 className="font-medium text-gray-800 mb-2">Frontend</h5>
                                  <p className="text-sm text-gray-700">{project.blueprintOutput.operationalBlueprint.technologyArchitecture.frontend}</p>
                                </div>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.database && (
                                <div>
                                  <h5 className="font-medium text-gray-800 mb-2">Database</h5>
                                  <p className="text-sm text-gray-700">{project.blueprintOutput.operationalBlueprint.technologyArchitecture.database}</p>
                                </div>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.aiMlStack && (
                                <div>
                                  <h5 className="font-medium text-gray-800 mb-2">AI/ML Stack</h5>
                                  <p className="text-sm text-gray-700">{project.blueprintOutput.operationalBlueprint.technologyArchitecture.aiMlStack}</p>
                                </div>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.infrastructure && (
                                <div>
                                  <h5 className="font-medium text-gray-800 mb-2">Infrastructure</h5>
                                  <p className="text-sm text-gray-700">{project.blueprintOutput.operationalBlueprint.technologyArchitecture.infrastructure}</p>
                                </div>
                              )}
                              {project.blueprintOutput.operationalBlueprint.technologyArchitecture.securityCompliance && (
                                <div>
                                  <h5 className="font-medium text-gray-800 mb-2">Security & Compliance</h5>
                                  <p className="text-sm text-gray-700">{project.blueprintOutput.operationalBlueprint.technologyArchitecture.securityCompliance}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key Processes */}
                    {project.blueprintOutput.operationalBlueprint.keyProcesses && Array.isArray(project.blueprintOutput.operationalBlueprint.keyProcesses) && (
                      <div>
                        <h4 className="font-medium mb-3">Key Processes</h4>
                        <div className="space-y-3">
                          {project.blueprintOutput.operationalBlueprint.keyProcesses.map((process: any, index: number) => (
                            <div key={index} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
                              <h5 className="font-medium text-blue-800 mb-2">{process.process}</h5>
                              <p className="text-sm text-blue-700 mb-2">{process.description}</p>
                              <p className="text-sm text-blue-600"><strong>Success Metrics:</strong> {process.successMetrics}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="financials">
          <div className="space-y-4">
            {/* Key Financial Assumptions */}
            <Card>
              <CardHeader>
                <CardTitle>Key Financial Assumptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData?.keyAssumptions?.map((assumption: any, index: number) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{assumption.assumption}</h4>
                        <span className="text-lg font-bold text-primary">{assumption.value}</span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2">{assumption.justification}</p>
                      {assumption.sensitivity && (
                        <p className="text-xs text-blue-600"><strong>Sensitivity:</strong> {assumption.sensitivity}</p>
                      )}
                      {assumption.impact && (
                        <p className="text-xs text-orange-600"><strong>Impact:</strong> {assumption.impact}</p>
                      )}
                    </div>
                  )) || (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-gray-800">Financial assumptions not available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 3-Year P&L Table */}
            <Card>
              <CardHeader>
                <CardTitle>3-Year Profit & Loss Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-gray-200 px-4 py-2 text-left font-medium">Metric</th>
                        <th className="border border-gray-200 px-4 py-2 text-right font-medium">Year 1</th>
                        <th className="border border-gray-200 px-4 py-2 text-right font-medium">Year 2</th>
                        <th className="border border-gray-200 px-4 py-2 text-right font-medium">Year 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2 font-medium">Total Revenue</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year1?.totalRevenue || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year2?.totalRevenue || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year3?.totalRevenue || 'Not available'}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2">Cost of Goods Sold (COGS)</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year1?.cogs || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year2?.cogs || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year3?.cogs || 'Not available'}</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="border border-gray-200 px-4 py-2 font-medium">Gross Profit</td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-medium">
                          {(() => {
                            const revenue = financialData?.threeYearProjections?.year1?.totalRevenue;
                            const cogs = financialData?.threeYearProjections?.year1?.cogs;
                            if (revenue && cogs) {
                              const revenueNum = parseFloat(revenue.replace(/[$,]/g, ''));
                              const cogsNum = parseFloat(cogs.replace(/[$,]/g, ''));
                              if (!isNaN(revenueNum) && !isNaN(cogsNum)) {
                                return `$${(revenueNum - cogsNum).toLocaleString()}`;
                              }
                            }
                            return financialData?.threeYearProjections?.year1?.grossProfit || 'N/A';
                          })()}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-medium">
                          {(() => {
                            const revenue = financialData?.threeYearProjections?.year2?.totalRevenue;
                            const cogs = financialData?.threeYearProjections?.year2?.cogs;
                            if (revenue && cogs) {
                              const revenueNum = parseFloat(revenue.replace(/[$,]/g, ''));
                              const cogsNum = parseFloat(cogs.replace(/[$,]/g, ''));
                              if (!isNaN(revenueNum) && !isNaN(cogsNum)) {
                                return `$${(revenueNum - cogsNum).toLocaleString()}`;
                              }
                            }
                            return financialData?.threeYearProjections?.year2?.grossProfit || 'N/A';
                          })()}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-medium">
                          {(() => {
                            const revenue = financialData?.threeYearProjections?.year3?.totalRevenue;
                            const cogs = financialData?.threeYearProjections?.year3?.cogs;
                            if (revenue && cogs) {
                              const revenueNum = parseFloat(revenue.replace(/[$,]/g, ''));
                              const cogsNum = parseFloat(cogs.replace(/[$,]/g, ''));
                              if (!isNaN(revenueNum) && !isNaN(cogsNum)) {
                                return `$${(revenueNum - cogsNum).toLocaleString()}`;
                              }
                            }
                            return financialData?.threeYearProjections?.year3?.grossProfit || 'N/A';
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2">Operating Expenses</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year1?.operatingExpenses || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year2?.operatingExpenses || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year3?.operatingExpenses || 'Not available'}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2">EBITDA</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year1?.ebitda || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year2?.ebitda || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year3?.ebitda || 'Not available'}</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="border border-gray-200 px-4 py-2 font-medium">Net Profit/Loss</td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-medium">{financialData?.threeYearProjections?.year1?.netProfitLoss || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-medium">{financialData?.threeYearProjections?.year2?.netProfitLoss || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-medium">{financialData?.threeYearProjections?.year3?.netProfitLoss || 'Not available'}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2">Cash Flow</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year1?.cashFlow || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year2?.cashFlow || 'Not available'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">{financialData?.threeYearProjections?.year3?.cashFlow || 'Not available'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Burn Rate Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Burn Rate Analysis & Runway</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">Monthly Burn Rate</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Year 1 Average:</span>
                        <span className="font-medium">{financialData?.fundingAnalysis?.monthlyBurnRate?.year1Average || 'Not calculated'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Year 2 Average:</span>
                        <span className="font-medium">{financialData?.fundingAnalysis?.monthlyBurnRate?.year2Average || 'Not calculated'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Peak Burn:</span>
                        <span className="font-medium text-red-600">{financialData?.fundingAnalysis?.monthlyBurnRate?.peakBurn || 'Not calculated'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Runway Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Funding Amount:</span>
                        <span className="font-medium">{financialData?.fundingAnalysis?.seedFunding || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Runway to Break-even:</span>
                        <span className="font-medium">
                          {financialData?.fundingAnalysis?.runwayAnalysis?.currentFunding || 
                           financialData?.fundingAnalysis?.runwayAnalysis?.breakEvenTimeline ||
                           financialData?.pathToProfitability?.breakEvenTimeline ||
                           'Not calculated'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Break-even Month:</span>
                        <span className="font-medium text-green-600">
                          {financialData?.pathToProfitability?.breakEvenMonth || 
                           financialData?.fundingAnalysis?.runwayAnalysis?.breakEvenMonth ||
                           'Not calculated'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {financialData?.fundingAnalysis?.runwayAnalysis?.keyMilestones && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Key Milestones</h4>
                    <p className="text-sm">{financialData.fundingAnalysis.runwayAnalysis.keyMilestones}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Unit Economics & Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Unit Economics & Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Customer LTV</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {financialData?.keyMetrics?.ltv ? 
                        DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(financialData.keyMetrics.ltv).value) : 'Not calculated'}
                    </div>
                    {financialData?.keyMetrics?.ltv && DataParsingUtils.parseFinancialValue(financialData.keyMetrics.ltv).methodology && (
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(financialData.keyMetrics.ltv).methodology)}
                      </div>
                    )}
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Customer CAC</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {financialData?.keyMetrics?.cac ? 
                        DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(financialData.keyMetrics.cac).value) : 'Not calculated'}
                    </div>
                    {financialData?.keyMetrics?.cac && DataParsingUtils.parseFinancialValue(financialData.keyMetrics.cac).methodology && (
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(financialData.keyMetrics.cac).methodology)}
                      </div>
                    )}
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">LTV:CAC Ratio</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {financialData?.keyMetrics?.ltvCacRatio ? 
                        DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(financialData.keyMetrics.ltvCacRatio).value) : 'Not calculated'}
                    </div>
                    {financialData?.keyMetrics?.ltvCacRatio && DataParsingUtils.parseFinancialValue(financialData.keyMetrics.ltvCacRatio).methodology && (
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(financialData.keyMetrics.ltvCacRatio).methodology)}
                      </div>
                    )}
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Payback Period</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {financialData?.keyMetrics?.paybackPeriod ? 
                        DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(financialData.keyMetrics.paybackPeriod).value) : 'Not calculated'}
                    </div>
                    {financialData?.keyMetrics?.paybackPeriod && DataParsingUtils.parseFinancialValue(financialData.keyMetrics.paybackPeriod).methodology && (
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(financialData.keyMetrics.paybackPeriod).methodology)}
                      </div>
                    )}
                  </div>
                </div>
                {financialData?.keyMetrics?.arr && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">ARR Growth Trajectory</h4>
                    <p className="text-sm">{financialData.keyMetrics.arr}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Use of Funds */}
            {financialData?.fundingAnalysis?.useOfFunds && (
              <Card>
                <CardHeader>
                  <CardTitle>Use of Funds Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(financialData.fundingAnalysis.useOfFunds).map(([category, allocation]: [string, any]) => (
                      <div key={category} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="capitalize font-medium">{category}</span>
                        <span className="text-sm">{allocation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pitch">
          <div className="space-y-4">
            {/* Executive Summary */}
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
            
            {/* Investor Pitch Deck Slides */}
            <div className="grid gap-4">
              {/* Problem Slide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Slide 1</span>
                    The Problem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">
                        {project.pitchOutput?.pitchDeckSlides?.problemSlide?.headline || 'Problem Statement'}
                      </h4>
                      <p className="text-sm mb-2">{project.pitchOutput?.pitchDeckSlides?.problemSlide?.problemStatement || pitchData?.problem?.content || 'Problem statement not available'}</p>
                      {project.pitchOutput?.pitchDeckSlides?.problemSlide?.marketPainPoints && (
                        <div className="grid gap-2 md:grid-cols-3">
                          {project.pitchOutput.pitchDeckSlides.problemSlide.marketPainPoints.map((pain: string, index: number) => (
                            <div key={index} className="text-xs p-2 bg-red-50 rounded text-red-700">
                              {pain}
                            </div>
                          ))}
                        </div>
                      )}
                      {project.pitchOutput?.pitchDeckSlides?.problemSlide?.urgency && (
                        <p className="text-xs text-red-600 mt-2"><strong>Urgency:</strong> {project.pitchOutput.pitchDeckSlides.problemSlide.urgency}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Solution Slide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Slide 2</span>
                    The Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">
                        {project.pitchOutput?.pitchDeckSlides?.solutionSlide?.headline || 'Our Solution'}
                      </h4>
                      <p className="text-sm mb-2">{project.pitchOutput?.pitchDeckSlides?.solutionSlide?.solutionDescription || pitchData?.solution?.content || 'Solution description not available'}</p>
                      {project.pitchOutput?.pitchDeckSlides?.solutionSlide?.keyDifferentiators && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Key Differentiators:</p>
                          {project.pitchOutput.pitchDeckSlides.solutionSlide.keyDifferentiators.map((diff: string, index: number) => (
                            <div key={index} className="text-xs p-2 bg-green-50 rounded text-green-700">
                              {diff}
                            </div>
                          ))}
                        </div>
                      )}
                      {project.pitchOutput?.pitchDeckSlides?.solutionSlide?.proofOfConcept && (
                        <p className="text-xs text-green-600 mt-2"><strong>Proof of Concept:</strong> {project.pitchOutput.pitchDeckSlides.solutionSlide.proofOfConcept}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Opportunity Slide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Slide 3</span>
                    Market Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">
                        {project.pitchOutput?.pitchDeckSlides?.marketOpportunitySlide?.headline || 'Market Opportunity'}
                      </h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">TAM</div>
                          <div className="text-sm font-bold text-blue-800 mb-2">
                            {(() => {
                              const tam = project.pitchOutput?.pitchDeckSlides?.marketOpportunitySlide?.marketSizing?.tam ||
                                         project.researchOutput?.marketSizing?.totalAddressableMarket;
                              if (tam) {
                                return DataParsingUtils.formatValue(DataParsingUtils.parseMarketData(tam).value);
                              }
                              return 'N/A';
                            })()}
                          </div>
                          <div className="text-xs text-blue-600 leading-relaxed">
                            {(() => {
                              const tam = project.pitchOutput?.pitchDeckSlides?.marketOpportunitySlide?.marketSizing?.tam ||
                                         project.researchOutput?.marketSizing?.totalAddressableMarket;
                              if (tam && DataParsingUtils.parseMarketData(tam).methodology) {
                                return DataParsingUtils.cleanMethodology(DataParsingUtils.parseMarketData(tam).methodology);
                              }
                              return 'No methodology available';
                            })()}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">SAM</div>
                          <div className="text-sm font-bold text-blue-800 mb-2">
                            {(() => {
                              const sam = project.pitchOutput?.pitchDeckSlides?.marketOpportunitySlide?.marketSizing?.sam ||
                                         project.researchOutput?.marketSizing?.serviceableAddressableMarket;
                              if (sam) {
                                return DataParsingUtils.formatValue(DataParsingUtils.parseMarketData(sam).value);
                              }
                              return 'N/A';
                            })()}
                          </div>
                          <div className="text-xs text-blue-600 leading-relaxed">
                            {(() => {
                              const sam = project.pitchOutput?.pitchDeckSlides?.marketOpportunitySlide?.marketSizing?.sam ||
                                         project.researchOutput?.marketSizing?.serviceableAddressableMarket;
                              if (sam && DataParsingUtils.parseMarketData(sam).methodology) {
                                return DataParsingUtils.cleanMethodology(DataParsingUtils.parseMarketData(sam).methodology);
                              }
                              return 'No methodology available';
                            })()}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">SOM</div>
                          <div className="text-sm font-bold text-blue-800 mb-2">
                            {(() => {
                              const som = project.pitchOutput?.pitchDeckSlides?.marketOpportunitySlide?.marketSizing?.som ||
                                         project.researchOutput?.marketSizing?.serviceableObtainableMarket;
                              if (som) {
                                return DataParsingUtils.formatValue(DataParsingUtils.parseMarketData(som).value);
                              }
                              return 'N/A';
                            })()}
                          </div>
                          <div className="text-xs text-blue-600 leading-relaxed">
                            {(() => {
                              const som = project.pitchOutput?.pitchDeckSlides?.marketOpportunitySlide?.marketSizing?.som ||
                                         project.researchOutput?.marketSizing?.serviceableObtainableMarket;
                              if (som && DataParsingUtils.parseMarketData(som).methodology) {
                                return DataParsingUtils.cleanMethodology(DataParsingUtils.parseMarketData(som).methodology);
                              }
                              return 'No methodology available';
                            })()}
                          </div>
                        </div>
                      </div>
                      {project.pitchOutput?.pitchDeckSlides?.marketOpportunitySlide?.marketTrends && (
                        <div className="space-y-1 mt-3">
                          <p className="text-xs font-medium">Market Trends:</p>
                          {project.pitchOutput.pitchDeckSlides.marketOpportunitySlide.marketTrends.map((trend: string, index: number) => (
                            <div key={index} className="text-xs p-2 bg-blue-50 rounded">
                              {trend}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Model Slide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Slide 4</span>
                    Business Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">
                        {project.pitchOutput?.pitchDeckSlides?.businessModelSlide?.headline || 'Business Model'}
                      </h4>
                      <p className="text-sm mb-2">
                        {project.pitchOutput?.pitchDeckSlides?.businessModelSlide?.revenueModel || 
                         project.blueprintOutput?.coreBusinessModel?.primaryModel ||
                         'Revenue model not available'}
                      </p>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-sm font-bold text-purple-800">
                            {project.pitchOutput?.pitchDeckSlides?.businessModelSlide?.unitEconomics?.customerAcquisitionCost || 
                             project.financialOutput?.keyMetrics?.cac ||
                             'N/A'}
                          </div>
                          <div className="text-xs text-purple-600">Customer CAC</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-sm font-bold text-purple-800">
                            {project.pitchOutput?.pitchDeckSlides?.businessModelSlide?.unitEconomics?.lifetimeValue || 
                             project.financialOutput?.keyMetrics?.ltv ||
                             'N/A'}
                          </div>
                          <div className="text-xs text-purple-600">Customer LTV</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-sm font-bold text-purple-800">
                            {project.pitchOutput?.pitchDeckSlides?.businessModelSlide?.unitEconomics?.grossMargin || 
                             project.financialOutput?.keyMetrics?.ltvCacRatio ||
                             'N/A'}
                          </div>
                          <div className="text-xs text-purple-600">LTV:CAC Ratio</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Traction Slide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Slide 5</span>
                    Traction & Validation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-orange-700 mb-2">
                        {project.pitchOutput?.pitchDeckSlides?.tractionSlide?.headline || 'Traction & Validation'}
                      </h4>
                      {project.pitchOutput?.pitchDeckSlides?.tractionSlide?.keyMetrics && (
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2">Customers</div>
                            <div className="text-sm font-bold text-orange-800 mb-2">
                              {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.customers ? 
                                DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.customers).value) : 'N/A'}
                            </div>
                            {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.customers && 
                             DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.customers).methodology && (
                              <div className="text-xs text-orange-600 leading-relaxed">
                                {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.customers).methodology)}
                              </div>
                            )}
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2">Revenue</div>
                            <div className="text-sm font-bold text-orange-800 mb-2">
                              {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.revenue ? 
                                DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.revenue).value) : 'N/A'}
                            </div>
                            {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.revenue && 
                             DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.revenue).methodology && (
                              <div className="text-xs text-orange-600 leading-relaxed">
                                {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.revenue).methodology)}
                              </div>
                            )}
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2">Retention</div>
                            <div className="text-sm font-bold text-orange-800 mb-2">
                              {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.retention ? 
                                DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.retention).value) : 'N/A'}
                            </div>
                            {project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.retention && 
                             DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.retention).methodology && (
                              <div className="text-xs text-orange-600 leading-relaxed">
                                {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.tractionSlide.keyMetrics.retention).methodology)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {project.pitchOutput?.pitchDeckSlides?.tractionSlide?.milestoneProgression && (
                        <p className="text-xs text-orange-600 mt-2"><strong>Milestones:</strong> {project.pitchOutput.pitchDeckSlides.tractionSlide.milestoneProgression}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Projections Slide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Slide 6</span>
                    Financial Projections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">
                        {project.pitchOutput?.pitchDeckSlides?.financialProjectionsSlide?.headline || 'Financial Projections'}
                      </h4>
                      {project.pitchOutput?.pitchDeckSlides?.financialProjectionsSlide?.revenueGrowth && (
                        <div className="grid gap-3 md:grid-cols-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Year 1</div>
                            <div className="text-sm font-bold text-green-800 mb-2">
                              {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year1 ? 
                                DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year1).value) : 'N/A'}
                            </div>
                            {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year1 && 
                             DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year1).methodology && (
                              <div className="text-xs text-green-600 leading-relaxed">
                                {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year1).methodology)}
                              </div>
                            )}
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Year 2</div>
                            <div className="text-sm font-bold text-green-800 mb-2">
                              {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year2 ? 
                                DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year2).value) : 'N/A'}
                            </div>
                            {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year2 && 
                             DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year2).methodology && (
                              <div className="text-xs text-green-600 leading-relaxed">
                                {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year2).methodology)}
                              </div>
                            )}
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Year 3</div>
                            <div className="text-sm font-bold text-green-800 mb-2">
                              {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year3 ? 
                                DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year3).value) : 'N/A'}
                            </div>
                            {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year3 && 
                             DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year3).methodology && (
                              <div className="text-xs text-green-600 leading-relaxed">
                                {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year3).methodology)}
                              </div>
                            )}
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Year 5</div>
                            <div className="text-sm font-bold text-green-800 mb-2">
                              {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year5 ? 
                                DataParsingUtils.formatValue(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year5).value) : 'N/A'}
                            </div>
                            {project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year5 && 
                             DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year5).methodology && (
                              <div className="text-xs text-green-600 leading-relaxed">
                                {DataParsingUtils.cleanMethodology(DataParsingUtils.parseFinancialValue(project.pitchOutput.pitchDeckSlides.financialProjectionsSlide.revenueGrowth.year5).methodology)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Funding Ask Slide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Slide 7</span>
                    The Ask
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-yellow-700 mb-2">
                        {project.pitchOutput?.pitchDeckSlides?.fundingAskSlide?.headline || 'Investment Ask'}
                      </h4>
                      <p className="text-lg font-bold text-yellow-800 mb-2">
                        {project.pitchOutput?.pitchDeckSlides?.fundingAskSlide?.fundingAmount || 
                         pitchData?.theAsk?.fundingAmount || 
                         project.financialOutput?.fundingAnalysis?.seedFunding ||
                         'Funding amount not specified'}
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Use of Funds:</p>
                        {(() => {
                          const useOfFunds = project.pitchOutput?.pitchDeckSlides?.fundingAskSlide?.useOfFunds ||
                                           project.financialOutput?.fundingAnalysis?.useOfFunds;
                          
                          if (useOfFunds && typeof useOfFunds === 'object') {
                            return Object.entries(useOfFunds).map(([category, allocation]: [string, any]) => (
                              <div key={category} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                                <span className="text-xs capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className="text-xs font-medium">{allocation}</span>
                              </div>
                            ));
                          }
                          
                          return (
                            <div className="p-2 bg-yellow-50 rounded">
                              <span className="text-xs text-yellow-600">Use of funds breakdown not available</span>
                            </div>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-yellow-600 mt-2">
                        <strong>Key Milestones:</strong> {project.pitchOutput?.pitchDeckSlides?.fundingAskSlide?.keyMilestones || 
                                                        'Key milestones not specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fallback for legacy pitch data */}
              {!project.pitchOutput?.pitchDeckSlides && (
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
                          <p className="text-xs text-gray-700 mt-1">Market Size: {pitchData.problem.marketSize}</p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">The Solution</h4>
                        <p className="text-sm">{pitchData?.solution?.content || 'Solution description not available'}</p>
                        {pitchData?.solution?.keyFeatures && (
                          <div className="mt-2">
                            <p className="text-xs font-medium">Key Features:</p>
                            <ul className="list-disc list-inside text-xs text-gray-700">
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
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gtm">
          <div className="space-y-6">
            <div className="grid gap-6">
              {/* GTM Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Go-to-Market Strategy
                  </CardTitle>
                  <CardDescription>
                    6-month launch and growth execution plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.gtmOutput?.strategicOverview?.gtmThesis && (
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-medium text-blue-900 mb-2">GTM Thesis</h4>
                      <p className="text-sm text-blue-800">{project.gtmOutput.strategicOverview.gtmThesis}</p>
                    </div>
                  )}
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.gtmOutput?.strategicOverview?.marketEntryStrategy && (
                      <div>
                        <h4 className="font-medium mb-2">Market Entry Strategy</h4>
                        <p className="text-sm text-gray-800">{project.gtmOutput.strategicOverview.marketEntryStrategy}</p>
                      </div>
                    )}
                    
                    {project.gtmOutput?.strategicOverview?.competitivePositioning && (
                      <div>
                        <h4 className="font-medium mb-2">Competitive Positioning</h4>
                        <p className="text-sm text-gray-800">{project.gtmOutput.strategicOverview.competitivePositioning}</p>
                      </div>
                    )}
                  </div>
                  
                  {project.gtmOutput?.strategicOverview?.successMetrics && Array.isArray(project.gtmOutput.strategicOverview.successMetrics) && (
                    <div>
                      <h4 className="font-medium mb-2">Success Metrics</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {project.gtmOutput.strategicOverview.successMetrics.map((metric: string, index: number) => (
                          <li key={index}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Acquisition Framework */}
              {project.gtmOutput?.customerAcquisitionFramework && (
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Acquisition Framework</CardTitle>
                    <CardDescription>Multi-channel acquisition strategy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Ideal Customer Profile</h4>
                        <p className="text-sm mb-2"><strong>Primary Segment:</strong> {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.primarySegment || 'Target customer segment'}</p>
                        {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.budget && (
                          <p className="text-sm mb-2"><strong>Budget:</strong> {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.budget}</p>
                        )}
                        {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.painPoints && Array.isArray(project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.painPoints) && (
                          <div>
                            <p className="text-sm font-medium mb-1">Pain Points:</p>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                              {project.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.painPoints.map((pain: string, index: number) => (
                                <li key={index}>{pain}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {project.gtmOutput.customerAcquisitionFramework.acquisitionChannels && Array.isArray(project.gtmOutput.customerAcquisitionFramework.acquisitionChannels) && (
                      <div className="space-y-4">
                        <h4 className="font-medium">Acquisition Channels</h4>
                        {project.gtmOutput.customerAcquisitionFramework.acquisitionChannels.map((channel: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                            <h5 className="font-medium text-blue-900">{channel.channelName || 'Acquisition Channel'}</h5>
                            <div className="grid gap-2 md:grid-cols-3 mt-2">
                              <div className="text-sm">
                                <span className="font-medium">Type:</span> {channel.channelType || 'N/A'}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">CAC:</span> {channel.cac || 'N/A'}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Investment:</span> {channel.monthlyInvestment || 'N/A'}
                              </div>
                            </div>
                            {channel.implementation && (
                              <p className="text-xs text-gray-700 mt-2">{channel.implementation}</p>
                            )}
                            {channel.conversionPath && (
                              <p className="text-xs text-blue-600 mt-1"><strong>Path:</strong> {channel.conversionPath}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Budget & Investment */}
              {project.gtmOutput?.budgetAndInvestment && (
                <Card>
                  <CardHeader>
                    <CardTitle>Budget & Investment</CardTitle>
                    <CardDescription>Financial allocation and ROI projections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Budget Overview</h4>
                        {project.gtmOutput.budgetAndInvestment.totalGtmBudget && (
                          <p className="text-sm mb-1"><strong>Total GTM Budget:</strong> {project.gtmOutput.budgetAndInvestment.totalGtmBudget}</p>
                        )}
                        {project.gtmOutput.budgetAndInvestment.roiProjections && (
                          <div className="text-sm space-y-1">
                            {project.gtmOutput.budgetAndInvestment.roiProjections.month6Revenue && (
                              <p><strong>Month 6 Revenue Target:</strong> {project.gtmOutput.budgetAndInvestment.roiProjections.month6Revenue}</p>
                            )}
                            {project.gtmOutput.budgetAndInvestment.roiProjections.ltvCacRatio && (
                              <p><strong>LTV:CAC Ratio:</strong> {project.gtmOutput.budgetAndInvestment.roiProjections.ltvCacRatio}</p>
                            )}
                            {project.gtmOutput.budgetAndInvestment.roiProjections.paybackPeriod && (
                              <p><strong>Payback Period:</strong> {project.gtmOutput.budgetAndInvestment.roiProjections.paybackPeriod}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {project.gtmOutput.budgetAndInvestment.channelInvestment && (
                        <div>
                          <h4 className="font-medium mb-2">Channel Investment</h4>
                          <div className="space-y-2">
                            {Object.entries(project.gtmOutput.budgetAndInvestment.channelInvestment).map(([channel, investment]: [string, any]) => (
                              <div key={channel} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                                <span className="capitalize">{channel.replace(/([A-Z])/g, ' $1')}</span>
                                <strong>{investment}</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Monthly Execution Plan */}
              {project.gtmOutput?.monthlyExecutionPlan && (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Execution Plan</CardTitle>
                    <CardDescription>Detailed 6-month roadmap with milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {project.gtmOutput.monthlyExecutionPlan.month1 && (
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-blue-900 mb-2">Month 1: {project.gtmOutput.monthlyExecutionPlan.month1.primaryFocus || 'Market Entry'}</h4>
                          {project.gtmOutput.monthlyExecutionPlan.month1.keyActivities && Array.isArray(project.gtmOutput.monthlyExecutionPlan.month1.keyActivities) && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">Key Activities:</p>
                              <ul className="list-disc list-inside text-sm text-gray-700">
                                {project.gtmOutput.monthlyExecutionPlan.month1.keyActivities.map((activity: string, index: number) => (
                                  <li key={index}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics && (
                            <div className="grid gap-2 md:grid-cols-3">
                              {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.mrr && (
                                <div className="text-center p-2 bg-blue-50 rounded">
                                  <div className="text-xs text-blue-600">MRR Target</div>
                                  <div className="font-bold">{project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.mrr}</div>
                                </div>
                              )}
                              {project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.newCustomers && (
                                <div className="text-center p-2 bg-blue-50 rounded">
                                  <div className="text-xs text-blue-600">New Customers</div>
                                  <div className="font-bold">{project.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.newCustomers}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {project.gtmOutput.monthlyExecutionPlan.month3 && (
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium text-green-900 mb-2">Month 3: {project.gtmOutput.monthlyExecutionPlan.month3.primaryFocus || 'Growth Acceleration'}</h4>
                          {project.gtmOutput.monthlyExecutionPlan.month3.keyActivities && Array.isArray(project.gtmOutput.monthlyExecutionPlan.month3.keyActivities) && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">Key Activities:</p>
                              <ul className="list-disc list-inside text-sm text-gray-700">
                                {project.gtmOutput.monthlyExecutionPlan.month3.keyActivities.map((activity: string, index: number) => (
                                  <li key={index}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics && (
                            <div className="grid gap-2 md:grid-cols-3">
                              {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.mrr && (
                                <div className="text-center p-2 bg-green-50 rounded">
                                  <div className="text-xs text-green-600">MRR Target</div>
                                  <div className="font-bold">{project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.mrr}</div>
                                </div>
                              )}
                              {project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.newCustomers && (
                                <div className="text-center p-2 bg-green-50 rounded">
                                  <div className="text-xs text-green-600">New Customers</div>
                                  <div className="font-bold">{project.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.newCustomers}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {project.gtmOutput.monthlyExecutionPlan.month6 && (
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-medium text-purple-900 mb-2">Month 6: {project.gtmOutput.monthlyExecutionPlan.month6.primaryFocus || 'Scale & Optimize'}</h4>
                          {project.gtmOutput.monthlyExecutionPlan.month6.keyActivities && Array.isArray(project.gtmOutput.monthlyExecutionPlan.month6.keyActivities) && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">Key Activities:</p>
                              <ul className="list-disc list-inside text-sm text-gray-700">
                                {project.gtmOutput.monthlyExecutionPlan.month6.keyActivities.map((activity: string, index: number) => (
                                  <li key={index}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics && (
                            <div className="grid gap-2 md:grid-cols-3">
                              {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.mrr && (
                                <div className="text-center p-2 bg-purple-50 rounded">
                                  <div className="text-xs text-purple-600">MRR Target</div>
                                  <div className="font-bold">{project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.mrr}</div>
                                </div>
                              )}
                              {project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.newCustomers && (
                                <div className="text-center p-2 bg-purple-50 rounded">
                                  <div className="text-xs text-purple-600">New Customers</div>
                                  <div className="font-bold">{project.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.newCustomers}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {!project.gtmOutput && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Rocket className="h-12 w-12 text-gray-800 mx-auto mb-4" />
                    <p className="text-gray-800">No Go-to-Market strategy data available.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}