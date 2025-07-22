"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Eye, 
  Palette, 
  BarChart3, 
  Users, 
  DollarSign,
  TrendingUp,
  Star,
  Sparkles,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ReportGeneratorProps {
  projectId: string;
  projectName: string;
  project?: any; // For memory-only projects
}

interface ReportOptions {
  format: 'pdf' | 'html' | 'json';
  template: 'executive' | 'investor' | 'comprehensive' | 'pitch-deck' | 'full-comprehensive';
  includeCharts: boolean;
  branding: {
    primaryColor: string;
    companyName: string;
  };
}

const templates = [
  {
    id: 'comprehensive',
    name: 'Complete Business Plan',
    description: 'Complete business plan with all sections, perfect for detailed analysis',
    icon: FileText,
    badge: 'Most Popular',
    features: ['Executive Summary', 'Market Research', 'Financial Projections', 'GTM Strategy']
  },
  {
    id: 'full-comprehensive',
    name: 'Comprehensive Report',
    description: 'Everything included - all responses from all 6 VentureForge AI steps',
    icon: Sparkles,
    badge: 'Complete Analysis',
    features: ['All AI Responses', 'Idea Development', 'Research Analysis', 'Blueprint Strategy', 'Financial Models', 'Pitch Deck', 'GTM Plan']
  },
  {
    id: 'investor',
    name: 'Investor Presentation',
    description: 'Focused on key metrics and financial highlights for investors',
    icon: TrendingUp,
    badge: 'Investor Ready',
    features: ['Key Metrics', 'Financial Highlights', 'Market Opportunity', 'Team & Traction']
  },
  {
    id: 'executive',
    name: 'Executive Summary',
    description: 'Concise overview highlighting the most important aspects',
    icon: Star,
    badge: 'Quick Overview',
    features: ['Business Concept', 'Market Size', 'Financial Summary', 'Key Advantages']
  },
  {
    id: 'pitch-deck',
    name: 'Pitch Deck Format',
    description: 'Slide-style presentation perfect for pitching to investors',
    icon: Users,
    badge: 'Presentation',
    features: ['Problem & Solution', 'Market Size', 'Business Model', 'Financial Ask']
  }
];

const colorPresets = [
  { name: 'Professional Blue', value: '#3B82F6' },
  { name: 'Corporate Navy', value: '#1E40AF' },
  { name: 'Success Green', value: '#10B981' },
  { name: 'Modern Purple', value: '#8B5CF6' },
  { name: 'Energetic Orange', value: '#F59E0B' },
  { name: 'Bold Red', value: '#EF4444' },
];

export function ReportGenerator({ projectId, projectName, project }: ReportGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<ReportOptions>({
    format: 'html',
    template: 'comprehensive',
    includeCharts: true,
    branding: {
      primaryColor: '#3B82F6',
      companyName: projectName
    }
  });

  const selectedTemplate = templates.find(t => t.id === options.template);

  const handleGenerate = async (preview: boolean = false) => {
    setIsGenerating(true);
    
    try {
      const requestBody: any = {
        projectId,
        ...options
      };

      // For memory-only projects, include the project data in the request
      if (project?.storageMode === 'MEMORY_ONLY') {
        requestBody.projectData = {
          id: project.id,
          name: project.name,
          ideaOutput: project.ideaOutput,
          researchOutput: project.researchOutput,
          blueprintOutput: project.blueprintOutput,
          financialOutput: project.financialOutput,
          pitchOutput: project.pitchOutput,
          gtmOutput: project.gtmOutput,
        };
      }

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate report');
      }

      if (preview || options.format === 'html') {
        // Open HTML preview in new tab
        const html = await response.text();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        if (!preview) {
          toast.success('Report generated successfully!');
        } else {
          toast.success('Preview opened in new tab');
        }
      } else {
        // Download file (PDF or JSON)
        let blob = await response.blob();
        
        // Ensure correct MIME type for blob
        if (options.format === 'json') {
          // For JSON, convert to proper JSON blob
          const jsonText = await blob.text();
          blob = new Blob([jsonText], { type: 'application/json' });
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Set correct file extension based on format
        const fileExtension = options.format === 'json' ? 'json' : 'pdf';
        a.download = `${projectName}-business-plan.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        const formatName = options.format === 'json' ? 'JSON export' : 'PDF report';
        toast.success(`${formatName} downloaded successfully!`);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6 text-blue-600" />
            Generate Professional Report
          </DialogTitle>
          <DialogDescription>
            Create a beautiful, investor-ready business plan from your VentureForge AI analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Template Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Choose Report Template</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => {
                const Icon = template.icon;
                const isSelected = options.template === template.id;
                
                return (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setOptions(prev => ({ ...prev, template: template.id as any }))}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                          </div>
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              template.badge === 'Most Popular' ? 'bg-green-100 text-green-700' :
                              template.badge === 'Complete Analysis' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' :
                              template.badge === 'Investor Ready' ? 'bg-purple-100 text-purple-700' :
                              template.badge === 'Quick Overview' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {template.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {template.features.map((feature) => (
                          <span key={feature} className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Format and Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Output Format</Label>
              <Select value={options.format} onValueChange={(value: 'pdf' | 'html' | 'json') => 
                setOptions(prev => ({ ...prev, format: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML (Interactive Preview)</SelectItem>
                  <SelectItem value="pdf">PDF (Print Ready)</SelectItem>
                  <SelectItem value="json">JSON (Data Export)</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <div>
                    <Label className="font-medium">Include Charts & Graphs</Label>
                    <p className="text-sm text-gray-500">Add visual data representations</p>
                  </div>
                </div>
                <Switch
                  checked={options.includeCharts}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeCharts: checked }))
                  }
                />
              </div>
            </div>

            {/* Branding */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Branding & Styling
              </Label>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Company Name</Label>
                  <Input
                    value={options.branding.companyName}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      branding: { ...prev.branding, companyName: e.target.value }
                    }))}
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Primary Color</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color.value}
                        className={`p-2 rounded-lg border text-xs transition-all ${
                          options.branding.primaryColor === color.value
                            ? 'ring-2 ring-offset-2 ring-blue-500'
                            : 'hover:shadow-md'
                        }`}
                        style={{ backgroundColor: color.value + '20', borderColor: color.value }}
                        onClick={() => setOptions(prev => ({
                          ...prev,
                          branding: { ...prev.branding, primaryColor: color.value }
                        }))}
                      >
                        <div 
                          className="w-4 h-4 rounded-full mx-auto mb-1"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {selectedTemplate && (
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview: {selectedTemplate.name}
                </CardTitle>
                <CardDescription>
                  This report will include comprehensive analysis from your VentureForge AI data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Financial Metrics</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">Growth Projections</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium">Market Analysis</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium">Strategic Insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleGenerate(true)}
              disabled={isGenerating}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Report
            </Button>
            
            <Button
              onClick={() => handleGenerate(false)}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : `Generate ${options.format.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}