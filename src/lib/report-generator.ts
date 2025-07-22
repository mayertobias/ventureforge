import puppeteer from 'puppeteer';
import { jsPDF } from 'jspdf';
import { ProfessionalReportGenerator } from './professional-report-generator';

export interface ProjectData {
  id: string;
  name: string;
  ideaOutput?: any;
  researchOutput?: any;
  blueprintOutput?: any;
  financialOutput?: any;
  pitchOutput?: any;
  gtmOutput?: any;
  createdAt: string;
}

export interface ReportOptions {
  format: 'pdf' | 'html' | 'json';
  template: 'executive' | 'investor' | 'comprehensive' | 'pitch-deck' | 'full-comprehensive';
  includeCharts: boolean;
  branding?: {
    logo?: string;
    primaryColor?: string;
    companyName?: string;
  };
}


export class ReportGenerator {
  public static formatCurrency(amount: string | number): string {
    if (typeof amount === 'string') {
      // Extract number from string like "$1,500,000" or "1.5M"
      const numStr = amount.replace(/[$,]/g, '');
      if (numStr.includes('M')) {
        return `$${parseFloat(numStr.replace('M', ''))}M`;
      }
      if (numStr.includes('K')) {
        return `$${parseFloat(numStr.replace('K', ''))}K`;
      }
      const num = parseFloat(numStr);
      if (!isNaN(num)) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(num);
      }
    }
    return amount.toString();
  }

  public static extractFinancialMetrics(projectData: ProjectData) {
    const financial = projectData.financialOutput;
    if (!financial) return null;

    return {
      seedFunding: this.formatCurrency(financial.fundingAnalysis?.seedFunding || '$1,500,000'),
      year3Revenue: this.formatCurrency(financial.threeYearProjections?.year3?.totalRevenue || 'TBD'),
      breakEvenMonth: financial.pathToProfitability?.breakEvenMonth || 'Month 18',
      ltv: this.formatCurrency(financial.keyMetrics?.ltv || '$5,000'),
      cac: this.formatCurrency(financial.keyMetrics?.cac || '$500'),
      grossMargin: financial.threeYearProjections?.year3?.grossMargin || '75%'
    };
  }

  public static generateExecutiveSummary(projectData: ProjectData): string {
    const idea = projectData.ideaOutput?.selectedIdea;
    const research = projectData.researchOutput;
    const blueprint = projectData.blueprintOutput;
    const financial = projectData.financialOutput;

    const businessConcept = idea?.title || projectData.name;
    const marketSize = research?.marketLandscape?.totalAddressableMarket || 'Significant market opportunity';
    const uniqueValue = blueprint?.executiveSummary?.uniqueAdvantage || 'Innovative solution';
    const revenueProjection = financial?.threeYearProjections?.year3?.totalRevenue || 'Strong growth potential';

    return `${businessConcept} addresses ${marketSize} with ${uniqueValue}. Our financial projections show ${revenueProjection} by Year 3, making this an attractive investment opportunity with significant potential for returns.`;
  }

  static generateHTML(projectData: ProjectData, options: ReportOptions): string {
    // Use the professional template by default
    try {
      return ProfessionalReportGenerator.generateProfessionalHTML(projectData, options);
    } catch (error) {
      console.warn('[REPORT] Professional template failed, falling back to basic template:', error);
      // Fallback to original template
      return this.generateBasicHTML(projectData, options);
    }
  }

  static generateBasicHTML(projectData: ProjectData, options: ReportOptions): string {
    const financialMetrics = this.extractFinancialMetrics(projectData);
    const executiveSummary = this.generateExecutiveSummary(projectData);
    const primaryColor = options.branding?.primaryColor || '#3B82F6';
    const companyName = options.branding?.companyName || projectData.name;

    const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${companyName} - Business Plan</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #ffffff;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .header {
            background: linear-gradient(135deg, ${primaryColor} 0%, #1e40af 100%);
            color: white;
            padding: 60px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="30"/></g></svg>') repeat;
            opacity: 0.1;
        }
        
        .header h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .section {
            padding: 80px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .section:last-child { border-bottom: none; }
        
        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 30px;
            color: #111827;
            text-align: center;
        }
        
        .executive-summary {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 60px;
            border-radius: 20px;
            margin: 40px 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .executive-summary h2 {
            color: ${primaryColor};
            font-size: 2rem;
            margin-bottom: 20px;
        }
        
        .executive-summary p {
            font-size: 1.2rem;
            line-height: 1.8;
            color: #374151;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        
        .metric-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .metric-value {
            font-size: 2.5rem;
            font-weight: 800;
            color: ${primaryColor};
            margin-bottom: 10px;
        }
        
        .metric-label {
            font-size: 1rem;
            color: #6b7280;
            font-weight: 500;
        }
        
        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 40px;
            margin: 40px 0;
        }
        
        .content-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-left: 5px solid ${primaryColor};
        }
        
        .content-card h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: #111827;
        }
        
        .content-card ul {
            list-style: none;
            padding: 0;
        }
        
        .content-card li {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
            color: #374151;
        }
        
        .content-card li:last-child { border-bottom: none; }
        
        .chart-container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            margin: 40px 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            height: 400px;
            max-height: 400px;
            overflow: hidden;
        }
        
        .chart-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 30px;
            text-align: center;
            color: #111827;
        }
        
        .chart-wrapper {
            position: relative;
            height: 300px;
            width: 100%;
        }
        
        .chart-wrapper canvas {
            max-height: 300px !important;
            width: 100% !important;
        }
        
        .footer {
            background: #1f2937;
            color: white;
            text-align: center;
            padding: 40px 0;
            margin-top: 80px;
        }
        
        .generated-by {
            opacity: 0.7;
            font-size: 0.9rem;
        }
        
        @media print {
            .header { background: ${primaryColor} !important; }
            .section { page-break-inside: avoid; }
            .metric-card, .content-card { break-inside: avoid; }
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2.5rem; }
            .metrics-grid { grid-template-columns: 1fr; }
            .content-grid { grid-template-columns: 1fr; }
            .executive-summary { padding: 30px; }
            .chart-container { 
                padding: 20px; 
                height: 300px;
                max-height: 300px;
            }
            .chart-wrapper { 
                height: 200px; 
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${companyName}</h1>
            <p class="subtitle">Comprehensive Business Plan & Investment Proposal</p>
        </div>
    </div>

    <div class="container">
        <div class="executive-summary">
            <h2>Executive Summary</h2>
            <p>${executiveSummary}</p>
        </div>

        ${options.template === 'full-comprehensive' && projectData.ideaOutput ? `
        <div class="section">
            <h2 class="section-title">Business Idea Development</h2>
            
            ${projectData.ideaOutput.selectedIdea ? `
            <div class="content-card">
                <h3>Selected Business Concept</h3>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
                    <h4 style="color: #1f2937; margin-bottom: 10px;">${projectData.ideaOutput.selectedIdea.title || 'Business Concept'}</h4>
                    <p style="margin-bottom: 15px;">${projectData.ideaOutput.selectedIdea.description || 'Description not available'}</p>
                    ${projectData.ideaOutput.selectedIdea.keyFeatures && Array.isArray(projectData.ideaOutput.selectedIdea.keyFeatures) ? `
                    <h5>Key Features:</h5>
                    <ul style="margin-left: 20px;">
                        ${projectData.ideaOutput.selectedIdea.keyFeatures.map((feature: string) => 
                            `<li>${feature}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                    ${projectData.ideaOutput.selectedIdea.targetMarket ? `
                    <p><strong>Target Market:</strong> ${projectData.ideaOutput.selectedIdea.targetMarket}</p>
                    ` : ''}
                    ${projectData.ideaOutput.selectedIdea.revenueModel ? `
                    <p><strong>Revenue Model:</strong> ${projectData.ideaOutput.selectedIdea.revenueModel}</p>
                    ` : ''}
                </div>
            </div>
            ` : ''}
            
            ${projectData.ideaOutput.ideas && Array.isArray(projectData.ideaOutput.ideas) ? `
            <div class="content-card">
                <h3>Initial AI-Generated Ideas</h3>
                <p style="margin-bottom: 20px;">These are the original business ideas generated by VentureForge AI during the Idea Spark phase:</p>
                <div style="display: grid; gap: 15px;">
                    ${projectData.ideaOutput.ideas.map((idea: any, index: number) => `
                    <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; ${idea.title === projectData.ideaOutput.selectedIdea?.title ? 'background: #f0f9ff; border-color: #3b82f6;' : ''}">
                        <h4 style="margin-bottom: 8px; color: #1f2937;">${index + 1}. ${idea.title || `Business Idea ${index + 1}`}</h4>
                        <p style="margin-bottom: 10px; color: #6b7280;">${idea.description || 'Description not available'}</p>
                        ${idea.keyFeatures && Array.isArray(idea.keyFeatures) ? `
                        <div style="margin-top: 10px;">
                            <strong>Key Features:</strong> ${idea.keyFeatures.join(', ')}
                        </div>
                        ` : ''}
                        ${idea.targetMarket ? `
                        <div style="margin-top: 5px;">
                            <strong>Target Market:</strong> ${idea.targetMarket}
                        </div>
                        ` : ''}
                        ${idea.title === projectData.ideaOutput.selectedIdea?.title ? `
                        <div style="margin-top: 10px; color: #3b82f6; font-weight: 600;">
                            ✓ Selected for Development
                        </div>
                        ` : ''}
                    </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        ` : ''}

        ${financialMetrics ? `
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">${financialMetrics.seedFunding}</div>
                <div class="metric-label">Seed Funding Target</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${financialMetrics.year3Revenue}</div>
                <div class="metric-label">Year 3 Revenue Projection</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${financialMetrics.grossMargin}</div>
                <div class="metric-label">Gross Margin</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${financialMetrics.breakEvenMonth}</div>
                <div class="metric-label">Break-Even Timeline</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${financialMetrics.ltv}</div>
                <div class="metric-label">Customer LTV</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${financialMetrics.cac}</div>
                <div class="metric-label">Customer CAC</div>
            </div>
        </div>
        ` : ''}

        ${projectData.researchOutput ? `
        <div class="section">
            <h2 class="section-title">Market Research & Analysis</h2>
            <div class="content-grid">
                <div class="content-card">
                    <h3>Market Landscape</h3>
                    <ul>
                        <li><strong>Total Addressable Market:</strong> ${projectData.researchOutput.marketLandscape?.totalAddressableMarket || 'Analyzing...'}</li>
                        <li><strong>Serviceable Addressable Market:</strong> ${projectData.researchOutput.marketLandscape?.serviceableAddressableMarket || 'Analyzing...'}</li>
                        <li><strong>Market Growth Rate:</strong> ${projectData.researchOutput.marketLandscape?.marketGrowthRate || 'Analyzing...'}</li>
                        <li><strong>Key Trends:</strong> ${projectData.researchOutput.marketLandscape?.keyTrends || 'Market analysis in progress'}</li>
                        <li><strong>Market Maturity:</strong> ${projectData.researchOutput.marketLandscape?.marketMaturity || 'Analyzing...'}</li>
                        ${projectData.researchOutput.marketLandscape?.seasonality ? `<li><strong>Seasonality:</strong> ${projectData.researchOutput.marketLandscape.seasonality}</li>` : ''}
                    </ul>
                </div>
                <div class="content-card">
                    <h3>Target Customer Analysis</h3>
                    <ul>
                        <li><strong>Primary Segment:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.primarySegment || 'Customer analysis in progress'}</li>
                        <li><strong>Segment Size:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.segmentSize || 'Analyzing...'}</li>
                        <li><strong>Customer LTV:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.lifetimeValue || 'Calculating...'}</li>
                        <li><strong>Customer CAC:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.customerAcquisitionCost || 'Calculating...'}</li>
                        <li><strong>Buying Behavior:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.buyingBehavior || 'Analyzing...'}</li>
                    </ul>
                    ${projectData.researchOutput.targetCustomerAnalysis?.customerPainPoints && Array.isArray(projectData.researchOutput.targetCustomerAnalysis.customerPainPoints) ? `
                    <h4>Key Pain Points:</h4>
                    <ul>
                        ${projectData.researchOutput.targetCustomerAnalysis.customerPainPoints.map((pain: string) => 
                            `<li>• ${pain}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
            </div>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>Competitive Landscape</h3>
                    <ul>
                        <li><strong>Market Opportunity:</strong> ${projectData.researchOutput.competitiveLandscape?.competitiveGap || 'Analysis not available'}</li>
                        <li><strong>Threat Level:</strong> ${projectData.researchOutput.competitiveLandscape?.threatLevel || 'Analyzing...'}</li>
                        <li><strong>Recommended Positioning:</strong> ${projectData.researchOutput.competitiveLandscape?.marketPosition || 'Analyzing...'}</li>
                    </ul>
                    ${projectData.researchOutput.competitiveLandscape?.mainCompetitors ? `
                    <h4>Main Competitors:</h4>
                    <ul>
                        ${projectData.researchOutput.competitiveLandscape.mainCompetitors.map((competitor: string) => 
                            `<li>• ${competitor}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                    ${projectData.researchOutput.competitiveLandscape?.competitiveAdvantages ? `
                    <h4>Competitive Advantages:</h4>
                    <ul>
                        ${projectData.researchOutput.competitiveLandscape.competitiveAdvantages.map((advantage: string) => 
                            `<li>• ${advantage}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                
                ${projectData.researchOutput.technologyAnalysis ? `
                <div class="content-card">
                    <h3>Technology Analysis</h3>
                    <ul>
                        <li><strong>Implementation Complexity:</strong> ${projectData.researchOutput.technologyAnalysis.implementationComplexity || 'Analyzing...'}</li>
                        <li><strong>Development Timeline:</strong> ${projectData.researchOutput.technologyAnalysis.developmentTimeline || 'Analyzing...'}</li>
                        <li><strong>Technical Risks:</strong> ${projectData.researchOutput.technologyAnalysis.technicalRisks || 'Analyzing...'}</li>
                    </ul>
                    ${projectData.researchOutput.technologyAnalysis.requiredTechnologies ? `
                    <h4>Required Technologies:</h4>
                    <ul>
                        ${projectData.researchOutput.technologyAnalysis.requiredTechnologies.map((tech: string) => 
                            `<li>• ${tech}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
            </div>
            
            ${projectData.researchOutput.financialBenchmarks ? `
            <div class="content-grid">
                <div class="content-card">
                    <h3>Industry Financial Benchmarks</h3>
                    <ul>
                        <li><strong>Industry Metrics:</strong> ${projectData.researchOutput.financialBenchmarks.industryMetrics || 'Analyzing...'}</li>
                        <li><strong>Revenue Models:</strong> ${projectData.researchOutput.financialBenchmarks.revenueModels || 'Analyzing...'}</li>
                        <li><strong>Pricing Strategies:</strong> ${projectData.researchOutput.financialBenchmarks.pricingStrategies || 'Analyzing...'}</li>
                        <li><strong>Unit Economics:</strong> ${projectData.researchOutput.financialBenchmarks.unitEconomics || 'Analyzing...'}</li>
                    </ul>
                </div>
                
                ${projectData.researchOutput.regulatoryConsiderations ? `
                <div class="content-card">
                    <h3>Regulatory Considerations</h3>
                    <ul>
                        <li><strong>Compliance Requirements:</strong> ${projectData.researchOutput.regulatoryConsiderations.complianceRequirements || 'Analyzing...'}</li>
                        <li><strong>Regulatory Trends:</strong> ${projectData.researchOutput.regulatoryConsiderations.regulatoryTrends || 'Analyzing...'}</li>
                    </ul>
                    ${projectData.researchOutput.regulatoryConsiderations.relevantRegulations ? `
                    <h4>Relevant Regulations:</h4>
                    <ul>
                        ${projectData.researchOutput.regulatoryConsiderations.relevantRegulations.map((regulation: string) => 
                            `<li>• ${regulation}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>
        ` : ''}

        ${projectData.blueprintOutput ? `
        <div class="section">
            <h2 class="section-title">Business Strategy & Model</h2>
            
            ${projectData.blueprintOutput.executiveSummary ? `
            <div class="content-grid">
                <div class="content-card">
                    <h3>Executive Summary</h3>
                    <ul>
                        <li><strong>Business Concept:</strong> ${projectData.blueprintOutput.executiveSummary.businessConcept || 'Business concept development in progress'}</li>
                        <li><strong>Market Opportunity:</strong> ${projectData.blueprintOutput.executiveSummary.marketOpportunity || 'Market analysis ongoing'}</li>
                        <li><strong>Unique Advantage:</strong> ${projectData.blueprintOutput.executiveSummary.uniqueAdvantage || 'Competitive advantage analysis in progress'}</li>
                        <li><strong>Revenue Projection:</strong> ${projectData.blueprintOutput.executiveSummary.revenueProjection || 'Financial projections in development'}</li>
                    </ul>
                </div>
            </div>
            ` : ''}
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>Core Business Model</h3>
                    <ul>
                        <li><strong>Primary Model:</strong> ${projectData.blueprintOutput.coreBusinessModel?.primaryModel || 'Strategy development in progress'}</li>
                        <li><strong>Revenue Logic:</strong> ${projectData.blueprintOutput.coreBusinessModel?.revenueLogic || 'Business model analysis ongoing'}</li>
                    </ul>
                    ${projectData.blueprintOutput.coreBusinessModel?.businessModelCanvas ? `
                    <h4>Business Model Canvas:</h4>
                    <ul>
                        ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners ? `
                        <li><strong>Key Partners:</strong> ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners.join(', ')}</li>
                        ` : ''}
                        ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities ? `
                        <li><strong>Key Activities:</strong> ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities.join(', ')}</li>
                        ` : ''}
                        ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources ? `
                        <li><strong>Key Resources:</strong> ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources.join(', ')}</li>
                        ` : ''}
                        ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.costStructure ? `
                        <li><strong>Cost Structure:</strong> ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.costStructure.join(', ')}</li>
                        ` : ''}
                    </ul>
                    ` : ''}
                </div>
                
                <div class="content-card">
                    <h3>Revenue Architecture</h3>
                    ${projectData.blueprintOutput.revenueArchitecture ? `
                    <ul>
                        <li><strong>Pricing Philosophy:</strong> ${projectData.blueprintOutput.revenueArchitecture.pricingPhilosophy || 'Pricing strategy development in progress'}</li>
                        <li><strong>Monetization Timeline:</strong> ${projectData.blueprintOutput.revenueArchitecture.monetizationTimeline || 'Timeline development in progress'}</li>
                    </ul>
                    ${projectData.blueprintOutput.revenueArchitecture.primaryStreams ? `
                    <h4>Primary Revenue Streams:</h4>
                    <ul>
                        ${projectData.blueprintOutput.revenueArchitecture.primaryStreams.map((stream: any) => 
                            `<li><strong>${stream.streamName}:</strong> ${stream.model} - ${stream.pricingStrategy} (${stream.year3Projection})</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                    ${projectData.blueprintOutput.revenueArchitecture.unitEconomics ? `
                    <h4>Unit Economics:</h4>
                    <ul>
                        <li><strong>ARPU:</strong> ${projectData.blueprintOutput.revenueArchitecture.unitEconomics.averageRevenuePerUser || 'Calculating...'}</li>
                        <li><strong>Customer LTV:</strong> ${projectData.blueprintOutput.revenueArchitecture.unitEconomics.customerLifetimeValue || 'Calculating...'}</li>
                        <li><strong>Gross Margin:</strong> ${projectData.blueprintOutput.revenueArchitecture.unitEconomics.grossMarginPerCustomer || 'Calculating...'}</li>
                    </ul>
                    ` : ''}
                    ` : ''}
                </div>
            </div>
            
            ${projectData.blueprintOutput.customerStrategy ? `
            <div class="content-grid">
                <div class="content-card">
                    <h3>Customer Strategy</h3>
                    ${projectData.blueprintOutput.customerStrategy.primarySegments ? `
                    <h4>Primary Customer Segments:</h4>
                    ${projectData.blueprintOutput.customerStrategy.primarySegments.map((segment: any) => `
                        <div style="margin-bottom: 15px;">
                            <strong>${segment.segmentName}:</strong> ${segment.size}<br>
                            <strong>Characteristics:</strong> ${segment.characteristics}<br>
                            <strong>Value Proposition:</strong> ${segment.valueProposition}<br>
                            <strong>Willingness to Pay:</strong> ${segment.willingnessToPay}<br>
                            <strong>Acquisition Strategy:</strong> ${segment.acquisitionStrategy}
                            ${segment.painPoints ? `<br><strong>Pain Points:</strong> ${segment.painPoints.join(', ')}` : ''}
                        </div>
                    `).join('')}
                    ` : ''}
                </div>
            </div>
            ` : ''}
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>Competitive Advantages</h3>
                    <ul>
                        ${projectData.blueprintOutput.competitiveStrategy?.sustainableAdvantages?.map((adv: any) => 
                            `<li><strong>${adv.advantage}:</strong> ${adv.description}</li>`
                        ).join('') || '<li>Competitive analysis in progress</li>'}
                    </ul>
                </div>
            </div>
        </div>
        ` : ''}

        ${projectData.financialOutput ? `
        <div class="section">
            <h2 class="section-title">Financial Projections & Analysis</h2>
            
            ${projectData.financialOutput.keyAssumptions ? `
            <div class="content-grid">
                <div class="content-card">
                    <h3>Key Financial Assumptions</h3>
                    ${projectData.financialOutput.keyAssumptions.map((assumption: any) => `
                        <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-left: 4px solid #007bff;">
                            <strong>${assumption.assumption}:</strong> ${assumption.value}<br>
                            <small style="color: #666;">${assumption.justification}</small>
                            ${assumption.sensitivity ? `<br><small style="color: #0066cc;"><strong>Sensitivity:</strong> ${assumption.sensitivity}</small>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${projectData.financialOutput.threeYearProjections ? `
            <div class="content-card">
                <h3>3-Year Financial Projections</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Metric</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Year 1</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Year 2</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Year 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Total Revenue</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year1?.totalRevenue || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year2?.totalRevenue || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year3?.totalRevenue || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">Cost of Goods Sold (COGS)</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year1?.cogs || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year2?.cogs || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year3?.cogs || 'N/A'}</td>
                        </tr>
                        <tr style="background: #e8f5e8;">
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Gross Margin</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">${projectData.financialOutput.threeYearProjections.year1?.grossMargin || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">${projectData.financialOutput.threeYearProjections.year2?.grossMargin || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">${projectData.financialOutput.threeYearProjections.year3?.grossMargin || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">Operating Expenses</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year1?.operatingExpenses || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year2?.operatingExpenses || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year3?.operatingExpenses || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">EBITDA</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year1?.ebitda || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year2?.ebitda || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year3?.ebitda || 'N/A'}</td>
                        </tr>
                        <tr style="background: #e8f4fd;">
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Net Profit/Loss</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">${projectData.financialOutput.threeYearProjections.year1?.netProfitLoss || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">${projectData.financialOutput.threeYearProjections.year2?.netProfitLoss || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">${projectData.financialOutput.threeYearProjections.year3?.netProfitLoss || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">Cash Flow</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year1?.cashFlow || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year2?.cashFlow || 'N/A'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${projectData.financialOutput.threeYearProjections.year3?.cashFlow || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            <div class="content-grid">
                ${projectData.financialOutput.fundingAnalysis ? `
                <div class="content-card">
                    <h3>Funding Analysis & Burn Rate</h3>
                    <ul>
                        <li><strong>Funding Amount:</strong> ${projectData.financialOutput.fundingAnalysis.seedFunding || 'N/A'}</li>
                        <li><strong>Year 1 Burn Rate:</strong> ${projectData.financialOutput.fundingAnalysis.monthlyBurnRate?.year1Average || 'N/A'}</li>
                        <li><strong>Year 2 Burn Rate:</strong> ${projectData.financialOutput.fundingAnalysis.monthlyBurnRate?.year2Average || 'N/A'}</li>
                        <li><strong>Peak Burn:</strong> ${projectData.financialOutput.fundingAnalysis.monthlyBurnRate?.peakBurn || 'N/A'}</li>
                        <li><strong>Runway:</strong> ${projectData.financialOutput.fundingAnalysis.runwayAnalysis?.currentFunding || 'N/A'}</li>
                    </ul>
                    ${projectData.financialOutput.fundingAnalysis.useOfFunds ? `
                    <h4>Use of Funds:</h4>
                    <ul>
                        ${Object.entries(projectData.financialOutput.fundingAnalysis.useOfFunds).map(([category, allocation]: [string, any]) => 
                            `<li><strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong> ${allocation}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
                
                ${projectData.financialOutput.keyMetrics ? `
                <div class="content-card">
                    <h3>Unit Economics & Key Metrics</h3>
                    <ul>
                        <li><strong>Customer LTV:</strong> ${projectData.financialOutput.keyMetrics.ltv || 'N/A'}</li>
                        <li><strong>Customer CAC:</strong> ${projectData.financialOutput.keyMetrics.cac || 'N/A'}</li>
                        <li><strong>LTV:CAC Ratio:</strong> ${projectData.financialOutput.keyMetrics.ltvCacRatio || 'N/A'}</li>
                        <li><strong>Payback Period:</strong> ${projectData.financialOutput.keyMetrics.paybackPeriod || 'N/A'}</li>
                        <li><strong>ARR Growth:</strong> ${projectData.financialOutput.keyMetrics.arr || 'N/A'}</li>
                        <li><strong>Revenue Growth:</strong> ${projectData.financialOutput.keyMetrics.revenueGrowth || 'N/A'}</li>
                    </ul>
                </div>
                ` : ''}
            </div>
            
            ${projectData.financialOutput.pathToProfitability ? `
            <div class="content-card">
                <h3>Path to Profitability</h3>
                <ul>
                    <li><strong>Break-even Month:</strong> ${projectData.financialOutput.pathToProfitability.breakEvenMonth || 'N/A'}</li>
                    <li><strong>Break-even Revenue:</strong> ${projectData.financialOutput.pathToProfitability.breakEvenRevenue || 'N/A'}</li>
                    <li><strong>Key Drivers:</strong> ${projectData.financialOutput.pathToProfitability.keyDrivers || 'N/A'}</li>
                    <li><strong>Strategy:</strong> ${projectData.financialOutput.pathToProfitability.profitabilityStrategy || 'N/A'}</li>
                </ul>
            </div>
            ` : ''}
        </div>
        ` : ''}

        ${projectData.pitchOutput ? `
        <div class="section">
            <h2 class="section-title">Investor Pitch Deck</h2>
            
            ${projectData.pitchOutput.executiveSummary ? `
            <div class="content-card">
                <h3>Executive Summary</h3>
                <p>${projectData.pitchOutput.executiveSummary}</p>
            </div>
            ` : ''}
            
            ${projectData.pitchOutput.pitchDeckSlides ? `
            <div class="content-grid">
                ${projectData.pitchOutput.pitchDeckSlides.problemSlide ? `
                <div class="content-card">
                    <h3>Problem Statement</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.problemSlide.headline || 'Problem Analysis'}</h4>
                    <p>${projectData.pitchOutput.pitchDeckSlides.problemSlide.problemStatement || 'Problem identification in progress'}</p>
                    ${projectData.pitchOutput.pitchDeckSlides.problemSlide.marketSize ? `
                    <ul>
                        <li><strong>Market Size:</strong> ${projectData.pitchOutput.pitchDeckSlides.problemSlide.marketSize}</li>
                        <li><strong>Pain Points:</strong> ${projectData.pitchOutput.pitchDeckSlides.problemSlide.painPoints || 'Analyzing customer pain points'}</li>
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
                
                ${projectData.pitchOutput.pitchDeckSlides.solutionSlide ? `
                <div class="content-card">
                    <h3>Solution Overview</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.solutionSlide.headline || 'Solution Strategy'}</h4>
                    <p>${projectData.pitchOutput.pitchDeckSlides.solutionSlide.solutionDescription || 'Solution development in progress'}</p>
                    ${projectData.pitchOutput.pitchDeckSlides.solutionSlide.keyFeatures && Array.isArray(projectData.pitchOutput.pitchDeckSlides.solutionSlide.keyFeatures) ? `
                    <h4>Key Features:</h4>
                    <ul>
                        ${projectData.pitchOutput.pitchDeckSlides.solutionSlide.keyFeatures.map((feature: string) => 
                            `<li>${feature}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
            </div>
            
            <div class="content-grid">
                ${projectData.pitchOutput.pitchDeckSlides.marketOpportunitySlide ? `
                <div class="content-card">
                    <h3>Market Opportunity</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.marketOpportunitySlide.headline || 'Market Analysis'}</h4>
                    <ul>
                        <li><strong>TAM:</strong> ${projectData.pitchOutput.pitchDeckSlides.marketOpportunitySlide.tam || 'Calculating...'}</li>
                        <li><strong>SAM:</strong> ${projectData.pitchOutput.pitchDeckSlides.marketOpportunitySlide.sam || 'Calculating...'}</li>
                        <li><strong>SOM:</strong> ${projectData.pitchOutput.pitchDeckSlides.marketOpportunitySlide.som || 'Calculating...'}</li>
                        <li><strong>Growth Rate:</strong> ${projectData.pitchOutput.pitchDeckSlides.marketOpportunitySlide.growthRate || 'Analyzing...'}</li>
                    </ul>
                    ${projectData.pitchOutput.pitchDeckSlides.marketOpportunitySlide.keyTrends && Array.isArray(projectData.pitchOutput.pitchDeckSlides.marketOpportunitySlide.keyTrends) ? `
                    <h4>Key Market Trends:</h4>
                    <ul>
                        ${projectData.pitchOutput.pitchDeckSlides.marketOpportunitySlide.keyTrends.map((trend: string) => 
                            `<li>${trend}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
                
                ${projectData.pitchOutput.pitchDeckSlides.businessModelSlide ? `
                <div class="content-card">
                    <h3>Business Model</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.businessModelSlide.headline || 'Revenue Model'}</h4>
                    <ul>
                        <li><strong>Revenue Model:</strong> ${projectData.pitchOutput.pitchDeckSlides.businessModelSlide.revenueModel || 'Model development in progress'}</li>
                        <li><strong>Pricing Strategy:</strong> ${projectData.pitchOutput.pitchDeckSlides.businessModelSlide.pricingStrategy || 'Pricing analysis ongoing'}</li>
                        <li><strong>Customer LTV:</strong> ${projectData.pitchOutput.pitchDeckSlides.businessModelSlide.customerLTV || 'Calculating...'}</li>
                        <li><strong>Customer CAC:</strong> ${projectData.pitchOutput.pitchDeckSlides.businessModelSlide.customerCAC || 'Calculating...'}</li>
                    </ul>
                    ${projectData.pitchOutput.pitchDeckSlides.businessModelSlide.revenueStreams && Array.isArray(projectData.pitchOutput.pitchDeckSlides.businessModelSlide.revenueStreams) ? `
                    <h4>Revenue Streams:</h4>
                    <ul>
                        ${projectData.pitchOutput.pitchDeckSlides.businessModelSlide.revenueStreams.map((stream: string) => 
                            `<li>${stream}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
            </div>
            
            <div class="content-grid">
                ${projectData.pitchOutput.pitchDeckSlides.tractionSlide ? `
                <div class="content-card">
                    <h3>Traction & Validation</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.tractionSlide.headline || 'Market Validation'}</h4>
                    <ul>
                        <li><strong>Current Metrics:</strong> ${projectData.pitchOutput.pitchDeckSlides.tractionSlide.currentMetrics || 'Metrics being tracked'}</li>
                        <li><strong>Customer Validation:</strong> ${projectData.pitchOutput.pitchDeckSlides.tractionSlide.customerValidation || 'Validation in progress'}</li>
                        <li><strong>Key Partnerships:</strong> ${projectData.pitchOutput.pitchDeckSlides.tractionSlide.partnerships || 'Partnership development ongoing'}</li>
                    </ul>
                    ${projectData.pitchOutput.pitchDeckSlides.tractionSlide.milestones && Array.isArray(projectData.pitchOutput.pitchDeckSlides.tractionSlide.milestones) ? `
                    <h4>Key Milestones:</h4>
                    <ul>
                        ${projectData.pitchOutput.pitchDeckSlides.tractionSlide.milestones.map((milestone: string) => 
                            `<li>${milestone}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
                
                ${projectData.pitchOutput.pitchDeckSlides.competitionSlide ? `
                <div class="content-card">
                    <h3>Competitive Analysis</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.competitionSlide.headline || 'Competitive Landscape'}</h4>
                    <ul>
                        <li><strong>Competitive Advantage:</strong> ${projectData.pitchOutput.pitchDeckSlides.competitionSlide.competitiveAdvantage || 'Advantage analysis in progress'}</li>
                        <li><strong>Market Position:</strong> ${projectData.pitchOutput.pitchDeckSlides.competitionSlide.marketPosition || 'Positioning strategy development'}</li>
                        <li><strong>Barriers to Entry:</strong> ${projectData.pitchOutput.pitchDeckSlides.competitionSlide.barriersToEntry || 'Analyzing competitive barriers'}</li>
                    </ul>
                    ${projectData.pitchOutput.pitchDeckSlides.competitionSlide.competitors && Array.isArray(projectData.pitchOutput.pitchDeckSlides.competitionSlide.competitors) ? `
                    <h4>Key Competitors:</h4>
                    <ul>
                        ${projectData.pitchOutput.pitchDeckSlides.competitionSlide.competitors.map((competitor: string) => 
                            `<li>${competitor}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
            </div>
            
            <div class="content-grid">
                ${projectData.pitchOutput.pitchDeckSlides.financialProjectionsSlide ? `
                <div class="content-card">
                    <h3>Financial Projections</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.financialProjectionsSlide.headline || 'Revenue Projections'}</h4>
                    <ul>
                        <li><strong>Year 1 Revenue:</strong> ${projectData.pitchOutput.pitchDeckSlides.financialProjectionsSlide.year1Revenue || 'Projecting...'}</li>
                        <li><strong>Year 2 Revenue:</strong> ${projectData.pitchOutput.pitchDeckSlides.financialProjectionsSlide.year2Revenue || 'Projecting...'}</li>
                        <li><strong>Year 3 Revenue:</strong> ${projectData.pitchOutput.pitchDeckSlides.financialProjectionsSlide.year3Revenue || 'Projecting...'}</li>
                        <li><strong>Break-even:</strong> ${projectData.pitchOutput.pitchDeckSlides.financialProjectionsSlide.breakEven || 'Calculating...'}</li>
                    </ul>
                    ${projectData.pitchOutput.pitchDeckSlides.financialProjectionsSlide.keyMetrics && Array.isArray(projectData.pitchOutput.pitchDeckSlides.financialProjectionsSlide.keyMetrics) ? `
                    <h4>Key Financial Metrics:</h4>
                    <ul>
                        ${projectData.pitchOutput.pitchDeckSlides.financialProjectionsSlide.keyMetrics.map((metric: string) => 
                            `<li>${metric}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
                
                ${projectData.pitchOutput.pitchDeckSlides.fundingSlide ? `
                <div class="content-card">
                    <h3>Funding Request</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.fundingSlide.headline || 'Investment Opportunity'}</h4>
                    <ul>
                        <li><strong>Funding Amount:</strong> ${projectData.pitchOutput.pitchDeckSlides.fundingSlide.fundingAmount || 'Amount being determined'}</li>
                        <li><strong>Funding Round:</strong> ${projectData.pitchOutput.pitchDeckSlides.fundingSlide.fundingRound || 'Round type being determined'}</li>
                        <li><strong>Runway:</strong> ${projectData.pitchOutput.pitchDeckSlides.fundingSlide.runway || 'Runway calculation in progress'}</li>
                    </ul>
                    ${projectData.pitchOutput.pitchDeckSlides.fundingSlide.useOfFunds ? `
                    <h4>Use of Funds:</h4>
                    <ul>
                        ${Object.entries(projectData.pitchOutput.pitchDeckSlides.fundingSlide.useOfFunds).map(([category, amount]: [string, any]) => 
                            `<li><strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong> ${amount}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
            </div>
            
            ${projectData.pitchOutput.pitchDeckSlides.teamSlide ? `
            <div class="content-card">
                <h3>Team & Execution</h3>
                <h4>${projectData.pitchOutput.pitchDeckSlides.teamSlide.headline || 'Leadership Team'}</h4>
                <p>${projectData.pitchOutput.pitchDeckSlides.teamSlide.teamOverview || 'Team composition analysis in progress'}</p>
                ${projectData.pitchOutput.pitchDeckSlides.teamSlide.keyTeamMembers && Array.isArray(projectData.pitchOutput.pitchDeckSlides.teamSlide.keyTeamMembers) ? `
                <h4>Key Team Members:</h4>
                <ul>
                    ${projectData.pitchOutput.pitchDeckSlides.teamSlide.keyTeamMembers.map((member: string) => 
                        `<li>${member}</li>`
                    ).join('')}
                </ul>
                ` : ''}
                ${projectData.pitchOutput.pitchDeckSlides.teamSlide.advisors && Array.isArray(projectData.pitchOutput.pitchDeckSlides.teamSlide.advisors) ? `
                <h4>Advisors:</h4>
                <ul>
                    ${projectData.pitchOutput.pitchDeckSlides.teamSlide.advisors.map((advisor: string) => 
                        `<li>${advisor}</li>`
                    ).join('')}
                </ul>
                ` : ''}
            </div>
            ` : ''}
            ` : ''}
        </div>
        ` : ''}

        ${options.includeCharts ? `
        <div class="chart-container">
            <h3 class="chart-title">Financial Projections (3-Year)</h3>
            <div class="chart-wrapper">
                <canvas id="revenueChart"></canvas>
            </div>
        </div>
        ` : ''}

        ${projectData.gtmOutput ? `
        <div class="section">
            <h2 class="section-title">Go-to-Market Strategy</h2>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>Strategic Overview</h3>
                    <ul>
                        <li><strong>GTM Thesis:</strong> ${projectData.gtmOutput.strategicOverview?.gtmThesis || 'Strategy development in progress'}</li>
                        <li><strong>Market Entry:</strong> ${projectData.gtmOutput.strategicOverview?.marketEntryStrategy || 'Market entry planning ongoing'}</li>
                        <li><strong>Primary Objective:</strong> ${projectData.gtmOutput.strategicOverview?.primaryObjective || 'Objectives being defined'}</li>
                        <li><strong>Success Metrics:</strong> ${projectData.gtmOutput.strategicOverview?.successMetrics || 'Metrics being defined'}</li>
                        <li><strong>Competitive Positioning:</strong> ${projectData.gtmOutput.strategicOverview?.competitivePositioning || 'Positioning strategy development'}</li>
                    </ul>
                </div>
                
                <div class="content-card">
                    <h3>Budget & Investment</h3>
                    <ul>
                        <li><strong>Total GTM Budget:</strong> ${projectData.gtmOutput.budgetAndInvestment?.totalGtmBudget || 'Budget planning in progress'}</li>
                        <li><strong>Month 1 Allocation:</strong> ${projectData.gtmOutput.budgetAndInvestment?.monthlyAllocation?.month1 || 'TBD'}</li>
                        <li><strong>Months 2-3 Allocation:</strong> ${projectData.gtmOutput.budgetAndInvestment?.monthlyAllocation?.["months2-3"] || 'TBD'}</li>
                        <li><strong>Months 4-6 Allocation:</strong> ${projectData.gtmOutput.budgetAndInvestment?.monthlyAllocation?.["months4-6"] || 'TBD'}</li>
                    </ul>
                    ${projectData.gtmOutput.budgetAndInvestment?.roiProjections ? `
                    <h4>ROI Projections:</h4>
                    <ul>
                        <li><strong>Month 6 Revenue:</strong> ${projectData.gtmOutput.budgetAndInvestment.roiProjections.month6Revenue || 'TBD'}</li>
                        <li><strong>Month 6 Customers:</strong> ${projectData.gtmOutput.budgetAndInvestment.roiProjections.month6Customers || 'TBD'}</li>
                        <li><strong>Blended CAC:</strong> ${projectData.gtmOutput.budgetAndInvestment.roiProjections.blendedCAC || 'TBD'}</li>
                        <li><strong>LTV:CAC Ratio:</strong> ${projectData.gtmOutput.budgetAndInvestment.roiProjections.ltvCacRatio || 'TBD'}</li>
                        <li><strong>Payback Period:</strong> ${projectData.gtmOutput.budgetAndInvestment.roiProjections.paybackPeriod || 'TBD'}</li>
                    </ul>
                    ` : ''}
                </div>
            </div>
            
            ${projectData.gtmOutput.customerAcquisitionFramework ? `
            <div class="content-card">
                <h3>Customer Acquisition Framework</h3>
                ${projectData.gtmOutput.customerAcquisitionFramework.idealCustomerProfile ? `
                <h4>Ideal Customer Profile:</h4>
                <ul>
                    <li><strong>Primary Segment:</strong> ${projectData.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.primarySegment || 'Segment analysis in progress'}</li>
                    <li><strong>Customer Jobs:</strong> ${projectData.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.customerJobs || 'Jobs-to-be-done analysis ongoing'}</li>
                    <li><strong>Budget:</strong> ${projectData.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.budget || 'Budget analysis in progress'}</li>
                    <li><strong>Buying Process:</strong> ${projectData.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.buyingProcess || 'Process mapping ongoing'}</li>
                    <li><strong>Decision Criteria:</strong> ${projectData.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.decisionCriteria || 'Criteria analysis in progress'}</li>
                </ul>
                ${projectData.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.painPoints ? `
                <h4>Key Pain Points:</h4>
                <ul>
                    ${projectData.gtmOutput.customerAcquisitionFramework.idealCustomerProfile.painPoints.map((pain: string) => 
                        `<li>${pain}</li>`
                    ).join('')}
                </ul>
                ` : ''}
                ` : ''}
            </div>
            ` : ''}
            
            ${projectData.gtmOutput.customerAcquisitionFramework?.acquisitionChannels ? `
            <div class="content-grid">
                <h3>Customer Acquisition Channels</h3>
                ${projectData.gtmOutput.customerAcquisitionFramework.acquisitionChannels.map((channel: any, index: number) => `
                <div class="content-card">
                    <h4>${channel.channelName || `Channel ${index + 1}`}</h4>
                    <ul>
                        <li><strong>Channel Type:</strong> ${channel.channelType || 'TBD'}</li>
                        <li><strong>Monthly Investment:</strong> ${channel.monthlyInvestment || 'TBD'}</li>
                        <li><strong>Customer CAC:</strong> ${channel.cac || 'TBD'}</li>
                        <li><strong>Implementation:</strong> ${channel.implementation || 'Strategy development in progress'}</li>
                        <li><strong>Conversion Path:</strong> ${channel.conversionPath || 'Path mapping in progress'}</li>
                        <li><strong>Optimization Plan:</strong> ${channel.optimizationPlan || 'Optimization strategy development'}</li>
                    </ul>
                    ${channel.expectedResults ? `
                    <h5>Expected Results:</h5>
                    <ul>
                        <li><strong>Month 1:</strong> ${channel.expectedResults.month1 || 'TBD'}</li>
                        <li><strong>Month 3:</strong> ${channel.expectedResults.month3 || 'TBD'}</li>
                        <li><strong>Month 6:</strong> ${channel.expectedResults.month6 || 'TBD'}</li>
                    </ul>
                    ` : ''}
                </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${projectData.gtmOutput.monthlyExecutionPlan ? `
            <div class="content-grid">
                <h3>Monthly Execution Plan</h3>
                
                ${projectData.gtmOutput.monthlyExecutionPlan.month1 ? `
                <div class="content-card">
                    <h4>Month 1: ${projectData.gtmOutput.monthlyExecutionPlan.month1.primaryFocus || 'Initial Launch'}</h4>
                    ${projectData.gtmOutput.monthlyExecutionPlan.month1.keyActivities ? `
                    <h5>Key Activities:</h5>
                    <ul>
                        ${projectData.gtmOutput.monthlyExecutionPlan.month1.keyActivities.map((activity: string) => 
                            `<li>${activity}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                    ${projectData.gtmOutput.monthlyExecutionPlan.month1.targetMetrics ? `
                    <h5>Target Metrics:</h5>
                    <ul>
                        <li><strong>New Customers:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.newCustomers || 'TBD'}</li>
                        <li><strong>MRR:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.mrr || 'TBD'}</li>
                        <li><strong>Pipeline:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.pipeline || 'TBD'}</li>
                        <li><strong>Channel Mix:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month1.targetMetrics.channelMix || 'TBD'}</li>
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
                
                ${projectData.gtmOutput.monthlyExecutionPlan.month3 ? `
                <div class="content-card">
                    <h4>Month 3: ${projectData.gtmOutput.monthlyExecutionPlan.month3.primaryFocus || 'Growth & Optimization'}</h4>
                    ${projectData.gtmOutput.monthlyExecutionPlan.month3.keyActivities ? `
                    <h5>Key Activities:</h5>
                    <ul>
                        ${projectData.gtmOutput.monthlyExecutionPlan.month3.keyActivities.map((activity: string) => 
                            `<li>${activity}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                    ${projectData.gtmOutput.monthlyExecutionPlan.month3.targetMetrics ? `
                    <h5>Target Metrics:</h5>
                    <ul>
                        <li><strong>New Customers:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.newCustomers || 'TBD'}</li>
                        <li><strong>MRR:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.mrr || 'TBD'}</li>
                        <li><strong>Pipeline:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.pipeline || 'TBD'}</li>
                        <li><strong>Customer Success:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month3.targetMetrics.customerSuccess || 'TBD'}</li>
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
                
                ${projectData.gtmOutput.monthlyExecutionPlan.month6 ? `
                <div class="content-card">
                    <h4>Month 6: ${projectData.gtmOutput.monthlyExecutionPlan.month6.primaryFocus || 'Scale & Sustainable Growth'}</h4>
                    ${projectData.gtmOutput.monthlyExecutionPlan.month6.keyActivities ? `
                    <h5>Key Activities:</h5>
                    <ul>
                        ${projectData.gtmOutput.monthlyExecutionPlan.month6.keyActivities.map((activity: string) => 
                            `<li>${activity}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                    ${projectData.gtmOutput.monthlyExecutionPlan.month6.targetMetrics ? `
                    <h5>Target Metrics:</h5>
                    <ul>
                        <li><strong>New Customers:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.newCustomers || 'TBD'}</li>
                        <li><strong>MRR:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.mrr || 'TBD'}</li>
                        <li><strong>Pipeline:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.pipeline || 'TBD'}</li>
                        <li><strong>Efficiency:</strong> ${projectData.gtmOutput.monthlyExecutionPlan.month6.targetMetrics.efficiency || 'TBD'}</li>
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            ${projectData.gtmOutput.salesPlaybook ? `
            <div class="content-card">
                <h3>Sales Playbook & Targets</h3>
                ${projectData.gtmOutput.salesPlaybook.salesProcess ? `
                <h4>Sales Process:</h4>
                <ul>
                    <li><strong>Prospect Qualification:</strong> ${projectData.gtmOutput.salesPlaybook.salesProcess.prospectQualification || 'Qualification framework development'}</li>
                    <li><strong>Demo Strategy:</strong> ${projectData.gtmOutput.salesPlaybook.salesProcess.demoStrategy || 'Demo strategy development'}</li>
                    <li><strong>Proposal Format:</strong> ${projectData.gtmOutput.salesPlaybook.salesProcess.proposalFormat || 'Proposal template development'}</li>
                    <li><strong>Closing Techniques:</strong> ${projectData.gtmOutput.salesPlaybook.salesProcess.closingTechniques || 'Closing methodology development'}</li>
                </ul>
                ${projectData.gtmOutput.salesPlaybook.salesProcess.discoveryQuestions ? `
                <h5>Discovery Questions:</h5>
                <ul>
                    ${projectData.gtmOutput.salesPlaybook.salesProcess.discoveryQuestions.map((question: string) => 
                        `<li>${question}</li>`
                    ).join('')}
                </ul>
                ` : ''}
                ` : ''}
                
                ${projectData.gtmOutput.salesPlaybook.salesTargets ? `
                <h4>Sales Targets:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 10px;">
                    ${projectData.gtmOutput.salesPlaybook.salesTargets.month1 ? `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <h5>Month 1 Targets:</h5>
                        <ul>
                            <li><strong>Pipeline:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month1.pipeline || 'TBD'}</li>
                            <li><strong>Closed Won:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month1.closedWon || 'TBD'}</li>
                            <li><strong>Avg Deal Size:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month1.averageDealSize || 'TBD'}</li>
                            <li><strong>Sales Cycle:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month1.salesCycle || 'TBD'}</li>
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${projectData.gtmOutput.salesPlaybook.salesTargets.month3 ? `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <h5>Month 3 Targets:</h5>
                        <ul>
                            <li><strong>Pipeline:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month3.pipeline || 'TBD'}</li>
                            <li><strong>Closed Won:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month3.closedWon || 'TBD'}</li>
                            <li><strong>Avg Deal Size:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month3.averageDealSize || 'TBD'}</li>
                            <li><strong>Sales Cycle:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month3.salesCycle || 'TBD'}</li>
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${projectData.gtmOutput.salesPlaybook.salesTargets.month6 ? `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <h5>Month 6 Targets:</h5>
                        <ul>
                            <li><strong>Pipeline:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month6.pipeline || 'TBD'}</li>
                            <li><strong>Closed Won:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month6.closedWon || 'TBD'}</li>
                            <li><strong>Avg Deal Size:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month6.averageDealSize || 'TBD'}</li>
                            <li><strong>Sales Cycle:</strong> ${projectData.gtmOutput.salesPlaybook.salesTargets.month6.salesCycle || 'TBD'}</li>
                        </ul>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>
        ` : ''}
    </div>

    <div class="footer">
        <div class="container">
            <p class="generated-by">Generated by VentureForge AI • ${new Date().toLocaleDateString()}</p>
        </div>
    </div>

    ${options.includeCharts && financialMetrics ? `
    <script>
        // Revenue Growth Chart
        const ctx = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3'],
                datasets: [{
                    label: 'Revenue Projection',
                    data: [500000, 2000000, 5000000], // Sample data - would be dynamic
                    borderColor: '${primaryColor}',
                    backgroundColor: '${primaryColor}20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                },
                layout: {
                    padding: 10
                }
            }
        });
    </script>
    ` : ''}
</body>
</html>`;

    return template;
  }


  static generateSimplePDF(projectData: ProjectData, options: ReportOptions): Buffer {
    console.log('[PDF] Using jsPDF fallback method...');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 10;
    let yPos = margin;
    
    // Helper function to add text with wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      if (yPos > pageHeight - margin - lineHeight) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont('helvetica', 'bold');
      else doc.setFont('helvetica', 'normal');
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight;
    };
    
    // Title
    addText(projectData.name, 20, true);
    addText('Business Plan & Investment Proposal', 16);
    yPos += 10;
    
    // Executive Summary
    const executiveSummary = this.generateExecutiveSummary(projectData);
    addText('Executive Summary', 16, true);
    addText(executiveSummary, 12);
    yPos += 10;
    
    // Financial Metrics
    const financialMetrics = this.extractFinancialMetrics(projectData);
    if (financialMetrics) {
      addText('Key Financial Metrics', 16, true);
      addText(`Seed Funding Target: ${financialMetrics.seedFunding}`, 12);
      addText(`Year 3 Revenue: ${financialMetrics.year3Revenue}`, 12);
      addText(`Break-Even: ${financialMetrics.breakEvenMonth}`, 12);
      addText(`Gross Margin: ${financialMetrics.grossMargin}`, 12);
      yPos += 10;
    }
    
    // Market Research
    if (projectData.researchOutput) {
      addText('Market Research & Analysis', 16, true);
      addText(`Total Addressable Market: ${projectData.researchOutput.marketLandscape?.totalAddressableMarket || 'Analyzing...'}`, 12);
      addText(`Primary Customer Segment: ${projectData.researchOutput.targetCustomerAnalysis?.primarySegment || 'Customer analysis in progress'}`, 12);
      addText(`Market Growth Rate: ${projectData.researchOutput.marketLandscape?.marketGrowthRate || 'Analyzing...'}`, 12);
      yPos += 10;
    }
    
    // Business Strategy
    if (projectData.blueprintOutput) {
      addText('Business Strategy & Model', 16, true);
      addText(`Primary Business Model: ${projectData.blueprintOutput.coreBusinessModel?.primaryModel || 'Strategy development in progress'}`, 12);
      addText(`Revenue Logic: ${projectData.blueprintOutput.coreBusinessModel?.revenueLogic || 'Business model analysis ongoing'}`, 12);
      yPos += 10;
    }
    
    // Footer
    yPos = pageHeight - margin;
    addText(`Generated by VentureForge AI • ${new Date().toLocaleDateString()}`, 10);
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log(`[PDF] jsPDF generated successfully, size: ${pdfBuffer.length} bytes`);
    
    return pdfBuffer;
  }

  static async generatePDF(projectData: ProjectData, options: ReportOptions): Promise<Buffer> {
    console.log('[PDF] Starting professional PDF generation process...');
    
    // Try professional generator first
    try {
      console.log('[PDF] Attempting professional PDF generation...');
      return await ProfessionalReportGenerator.generatePDF(projectData, options);
    } catch (professionalError) {
      console.warn('[PDF] Professional PDF generation failed, falling back to simple PDF:', professionalError);
      
      // Fallback to simple jsPDF
      try {
        console.log('[PDF] Attempting fallback jsPDF generation...');
        return this.generateSimplePDF(projectData, options);
      } catch (jsPdfError) {
        console.warn('[PDF] jsPDF failed, falling back to Puppeteer:', jsPdfError);
      }
    }
    
    // Fallback to Puppeteer
    const pdfOptions = {
      ...options,
      includeCharts: false // Disable charts for PDF to avoid loading issues
    };
    
    let browser: any = null;
    
    try {
      // Generate clean HTML without external dependencies
      const html = this.generateHTML(projectData, pdfOptions);
      console.log(`[PDF] Generated HTML content, length: ${html.length} characters`);
      
      console.log('[PDF] Launching Puppeteer browser...');
      
      // Try different Puppeteer configurations
      const puppeteerConfig: any = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-images',
          '--disable-javascript',
          '--virtual-time-budget=5000'
        ],
        timeout: 60000 // Increased timeout
      };
      
      // Add executable path if available
      if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      }
      
      browser = await puppeteer.launch(puppeteerConfig);
      console.log('[PDF] Browser launched successfully');
      
      const page = await browser.newPage();
      console.log('[PDF] New page created');
      
      // Set viewport and disable JavaScript for PDF
      await page.setViewport({ width: 1200, height: 800 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      console.log('[PDF] Setting page content...');
      
      // Try setting content with different wait strategies
      try {
        await page.setContent(html, { 
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
        console.log('[PDF] Content set successfully');
      } catch (contentError) {
        console.warn('[PDF] Failed to set content, trying alternative method:', contentError);
        
        // Alternative: navigate to data URI
        const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
        await page.goto(dataUri, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('[PDF] Content set via data URI');
      }
      
      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('[PDF] Generating PDF...');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        timeout: 60000
      });
      
      console.log(`[PDF] PDF generated, buffer size: ${pdfBuffer.length} bytes`);
      
      // Enhanced validation
      if (!pdfBuffer) {
        throw new Error('PDF buffer is null or undefined');
      }
      
      if (pdfBuffer.length === 0) {
        throw new Error('PDF buffer is empty (0 bytes)');
      }
      
      if (pdfBuffer.length < 1000) {
        console.warn(`[PDF] PDF buffer is very small: ${pdfBuffer.length} bytes`);
        console.warn(`[PDF] Buffer preview: ${pdfBuffer.toString('hex', 0, Math.min(50, pdfBuffer.length))}`);
      }
      
      // Check PDF signature
      const pdfSignature = pdfBuffer.slice(0, 4).toString();
      console.log(`[PDF] PDF signature: ${pdfSignature}`);
      
      if (pdfSignature !== '%PDF') {
        console.error(`[PDF] Invalid PDF signature: ${pdfSignature}`);
        console.error(`[PDF] Buffer start: ${pdfBuffer.toString('hex', 0, 20)}`);
        throw new Error(`Generated buffer is not a valid PDF. Signature: ${pdfSignature}`);
      }
      
      console.log('[PDF] PDF validation successful');
      return Buffer.from(pdfBuffer);
      
    } catch (error) {
      console.error('[PDF] PDF generation failed:', error);
      console.error('[PDF] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (browser) {
        console.log('[PDF] Closing browser...');
        try {
          await browser.close();
          console.log('[PDF] Browser closed successfully');
        } catch (closeError) {
          console.warn('[PDF] Error closing browser:', closeError);
        }
      }
    }
  }
}

export default ReportGenerator;