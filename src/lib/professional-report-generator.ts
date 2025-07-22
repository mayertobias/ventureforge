import puppeteer from 'puppeteer';
import { jsPDF } from 'jspdf';
// Note: PDFKit might be used in future versions
// import PDFDocument from 'pdfkit';

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

export class ProfessionalReportGenerator {
  
  static formatCurrency(amount: string | number): string {
    if (typeof amount === 'string') {
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

  static extractFinancialMetrics(projectData: ProjectData) {
    const financial = projectData.financialOutput;
    if (!financial) return null;

    // Improved data extraction with multiple fallback paths
    const seedFunding = financial.fundingAnalysis?.seedFunding || 
                       financial.fundingAnalysis?.fundingRequired ||
                       financial.seedFunding || 
                       '$1,500,000';

    const year3Revenue = financial.threeYearProjections?.year3?.totalRevenue || 
                        financial.projections?.year3?.revenue ||
                        financial.year3Revenue ||
                        '$15,000,000';

    const breakEvenMonth = financial.pathToProfitability?.breakEvenMonth || 
                          financial.breakEvenAnalysis?.breakEvenMonth ||
                          financial.breakEven ||
                          'Month 21';

    const ltv = financial.keyMetrics?.ltv || 
               financial.keyMetrics?.customerLTV ||
               financial.unitEconomics?.ltv ||
               financial.ltv ||
               '$4,800';

    const cac = financial.keyMetrics?.cac || 
               financial.keyMetrics?.customerCAC ||
               financial.unitEconomics?.cac ||
               financial.cac ||
               '$300';

    const grossMargin = financial.threeYearProjections?.year3?.grossMargin || 
                       financial.projections?.year3?.grossMargin ||
                       financial.grossMargin ||
                       '70%';

    // Extract runway information
    const runway = financial.fundingAnalysis?.runwayAnalysis?.monthsOfRunway ||
                  financial.fundingAnalysis?.runway ||
                  financial.runway ||
                  financial.runwayMonths ||
                  'TBD';

    const monthlyBurnRate = financial.fundingAnalysis?.monthlyBurnRate?.year1Average ||
                           financial.fundingAnalysis?.monthlyBurn ||
                           financial.monthlyBurnRate ||
                           financial.burnRate ||
                           'TBD';

    return {
      seedFunding: this.formatCurrency(seedFunding),
      year3Revenue: this.formatCurrency(year3Revenue),
      breakEvenMonth: breakEvenMonth,
      ltv: this.formatCurrency(ltv),
      cac: this.formatCurrency(cac),
      grossMargin: grossMargin,
      runway: runway,
      monthlyBurnRate: this.formatCurrency(monthlyBurnRate)
    };
  }

  static generateExecutiveSummary(projectData: ProjectData): string {
    const idea = projectData.ideaOutput?.selectedIdea;
    const research = projectData.researchOutput;
    const blueprint = projectData.blueprintOutput;
    const financial = projectData.financialOutput;

    const businessConcept = idea?.title || projectData.name;
    const marketSize = research?.marketLandscape?.totalAddressableMarket || 'significant market opportunity';
    const uniqueValue = blueprint?.executiveSummary?.uniqueAdvantage || 'innovative solution';
    const revenueProjection = financial?.threeYearProjections?.year3?.totalRevenue || 'strong growth potential';

    return `${businessConcept} addresses ${marketSize} with ${uniqueValue}. Our financial projections show ${revenueProjection} by Year 3, making this an attractive investment opportunity with significant potential for returns.`;
  }

  static generateProfessionalHTML(projectData: ProjectData, options: ReportOptions): string {
    const financialMetrics = this.extractFinancialMetrics(projectData);
    const executiveSummary = this.generateExecutiveSummary(projectData);
    const primaryColor = options.branding?.primaryColor || '#2563eb';
    const companyName = options.branding?.companyName || projectData.name;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${companyName} - Business Plan</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: ${primaryColor};
            --secondary-color: #64748b;
            --accent-color: #f1f5f9;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --error-color: #ef4444;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: #ffffff;
            font-size: 14px;
        }

        /* Typography Scale */
        h1 { font-size: 2.5rem; font-weight: 800; line-height: 1.2; }
        h2 { font-size: 2rem; font-weight: 700; line-height: 1.3; }
        h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
        h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
        h5 { font-size: 1.125rem; font-weight: 500; line-height: 1.5; }
        h6 { font-size: 1rem; font-weight: 500; line-height: 1.5; }

        /* Layout Components */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .page-break {
            page-break-before: always;
        }

        /* Header Section */
        .report-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, #1e40af 100%);
            color: white;
            padding: 4rem 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .report-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
        }

        .report-header h1 {
            margin-bottom: 0.5rem;
            position: relative;
            z-index: 1;
        }

        .report-subtitle {
            font-size: 1.25rem;
            opacity: 0.9;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }

        .report-meta {
            margin-top: 2rem;
            font-size: 0.875rem;
            opacity: 0.8;
            position: relative;
            z-index: 1;
        }

        /* Executive Summary */
        .executive-summary {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 3rem;
            margin: 3rem 0;
            border-radius: 16px;
            border-left: 6px solid var(--primary-color);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .executive-summary h2 {
            color: var(--primary-color);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .executive-summary h2::before {
            content: "📋";
            font-size: 1.5rem;
        }

        .executive-summary p {
            font-size: 1.125rem;
            line-height: 1.8;
            color: var(--text-secondary);
        }

        /* Metrics Grid */
        .metrics-section {
            margin: 4rem 0;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .metric-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            border: 1px solid var(--border-color);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), #60a5fa);
        }

        .metric-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .metric-value {
            font-size: 2.25rem;
            font-weight: 800;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            display: block;
        }

        .metric-label {
            font-size: 0.875rem;
            color: var(--text-muted);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Section Styling */
        .report-section {
            margin: 4rem 0;
            padding-bottom: 3rem;
            border-bottom: 1px solid var(--border-color);
        }

        .report-section:last-child {
            border-bottom: none;
        }

        .section-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .section-title {
            color: var(--text-primary);
            margin-bottom: 1rem;
            position: relative;
            display: inline-block;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), #60a5fa);
            border-radius: 2px;
        }

        .section-description {
            color: var(--text-secondary);
            font-size: 1.125rem;
            max-width: 600px;
            margin: 0 auto;
        }

        /* Content Grid */
        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .content-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            border: 1px solid var(--border-color);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }

        .content-card:hover {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .content-card h3 {
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--accent-color);
        }

        .content-card h4 {
            color: var(--primary-color);
            margin: 1.5rem 0 1rem 0;
            font-size: 1.125rem;
        }

        .content-card ul {
            list-style: none;
            padding: 0;
        }

        .content-card li {
            padding: 0.75rem 0;
            border-bottom: 1px solid #f8fafc;
            color: var(--text-secondary);
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }

        .content-card li:last-child {
            border-bottom: none;
        }

        .content-card li strong {
            color: var(--text-primary);
            font-weight: 600;
            min-width: 120px;
        }

        .content-card li::before {
            content: "•";
            color: var(--primary-color);
            font-weight: bold;
            font-size: 1.25rem;
            line-height: 1;
            margin-top: 0.125rem;
        }

        /* Financial Table */
        .financial-table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .financial-table th {
            background: linear-gradient(135deg, var(--primary-color), #1e40af);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            border: none;
        }

        .financial-table td {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-secondary);
        }

        .financial-table tr:hover {
            background: var(--accent-color);
        }

        .financial-table .metric-row {
            font-weight: 600;
            color: var(--text-primary);
        }

        .financial-table .highlight-row {
            background: #f0f9ff;
            color: var(--primary-color);
            font-weight: 600;
        }

        /* Charts and Visual Elements */
        .chart-container {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            margin: 2rem 0;
            border: 1px solid var(--border-color);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .chart-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            text-align: center;
            color: var(--text-primary);
        }

        /* Timeline and Process */
        .timeline {
            position: relative;
            padding: 2rem 0;
        }

        .timeline-item {
            position: relative;
            padding: 1.5rem 0 1.5rem 3rem;
            border-left: 2px solid var(--border-color);
        }

        .timeline-item::before {
            content: '';
            position: absolute;
            left: -6px;
            top: 2rem;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--primary-color);
        }

        .timeline-item:last-child {
            border-left-color: transparent;
        }

        .timeline-date {
            font-weight: 600;
            color: var(--primary-color);
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .timeline-content {
            margin-top: 0.5rem;
            color: var(--text-secondary);
        }

        /* Badges and Status */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .badge-success {
            background: #dcfce7;
            color: #166534;
        }

        .badge-warning {
            background: #fef3c7;
            color: #92400e;
        }

        .badge-info {
            background: #dbeafe;
            color: #1e40af;
        }

        /* Footer */
        .report-footer {
            background: var(--text-primary);
            color: white;
            text-align: center;
            padding: 3rem 0;
            margin-top: 4rem;
        }

        .footer-content {
            opacity: 0.8;
            font-size: 0.875rem;
        }

        .footer-logo {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        /* Print Styles */
        @media print {
            .report-header {
                background: var(--primary-color) !important;
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            
            .content-card, .metric-card {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            
            .report-section {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            
            .chart-container {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container { padding: 0 1rem; }
            .report-header { padding: 2rem 0; }
            .report-header h1 { font-size: 2rem; }
            .content-grid { grid-template-columns: 1fr; }
            .metrics-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
            .executive-summary { padding: 2rem; }
            .content-card { padding: 1.5rem; }
            .financial-table { font-size: 0.875rem; }
        }

        /* Icon styles */
        .icon {
            display: inline-block;
            width: 1.25rem;
            height: 1.25rem;
            margin-right: 0.5rem;
        }

        /* Highlight boxes */
        .highlight-box {
            background: linear-gradient(135deg, #fef7cd, #fef3c7);
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
        }

        .highlight-box h4 {
            color: #92400e;
            margin-bottom: 0.5rem;
        }

        .highlight-box p {
            color: #78350f;
            margin: 0;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="report-header">
        <div class="container">
            <h1>${companyName}</h1>
            <p class="report-subtitle">Comprehensive Business Plan & Investment Proposal</p>
            <div class="report-meta">
                Generated by VentureForge AI • ${new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}
            </div>
        </div>
    </div>

    <div class="container">
        <!-- Executive Summary -->
        <section class="report-section">
            <div class="section-header">
                <h2 class="section-title">📋 Executive Summary</h2>
                <p class="section-description">Strategic overview and investment proposition</p>
            </div>
            <div class="executive-summary">
                <p>${executiveSummary}</p>
            </div>
        </section>

        <!-- Key Metrics -->
        ${financialMetrics ? `
        <section class="report-section">
            <div class="section-header">
                <h2 class="section-title">📊 Key Financial Metrics</h2>
                <p class="section-description">Critical performance indicators and financial projections</p>
            </div>
            <div class="metrics-grid">
                <div class="metric-card">
                    <span class="metric-value">${financialMetrics.seedFunding}</span>
                    <div class="metric-label">Seed Funding Target</div>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${financialMetrics.year3Revenue}</span>
                    <div class="metric-label">Year 3 Revenue</div>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${financialMetrics.grossMargin}</span>
                    <div class="metric-label">Gross Margin</div>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${financialMetrics.breakEvenMonth}</span>
                    <div class="metric-label">Break-Even Timeline</div>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${financialMetrics.ltv}</span>
                    <div class="metric-label">Customer LTV</div>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${financialMetrics.cac}</span>
                    <div class="metric-label">Customer CAC</div>
                </div>
                ${financialMetrics.runway !== 'TBD' ? `
                <div class="metric-card">
                    <span class="metric-value">${financialMetrics.runway}</span>
                    <div class="metric-label">Runway</div>
                </div>
                ` : ''}
                ${financialMetrics.monthlyBurnRate !== 'TBD' ? `
                <div class="metric-card">
                    <span class="metric-value">${financialMetrics.monthlyBurnRate}</span>
                    <div class="metric-label">Monthly Burn Rate</div>
                </div>
                ` : ''}
            </div>
        </section>
        ` : ''}

        ${this.generateBusinessIdeaSection(projectData)}
        ${this.generateMarketResearchSection(projectData)}
        ${this.generateBusinessStrategySection(projectData)}
        ${this.generateFinancialSection(projectData)}
        ${this.generatePitchSection(projectData)}
        ${this.generateGTMSection(projectData)}
    </div>

    <!-- Footer -->
    <div class="report-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">VentureForge AI</div>
                <p>Comprehensive Business Intelligence & Planning Platform</p>
                <p>This report was generated using artificial intelligence and comprehensive business analysis.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  static generateBusinessIdeaSection(projectData: ProjectData): string {
    if (!projectData.ideaOutput) return '';

    return `
        <section class="report-section page-break">
            <div class="section-header">
                <h2 class="section-title">💡 Business Idea Development</h2>
                <p class="section-description">Comprehensive analysis of the business concept and ideation process</p>
            </div>
            
            ${projectData.ideaOutput.selectedIdea ? `
            <div class="content-card">
                <h3>🎯 Selected Business Concept</h3>
                <div class="highlight-box">
                    <h4>${projectData.ideaOutput.selectedIdea.title || 'Business Concept'}</h4>
                    <p>${projectData.ideaOutput.selectedIdea.description || 'Description not available'}</p>
                </div>
                
                ${projectData.ideaOutput.selectedIdea.keyFeatures && Array.isArray(projectData.ideaOutput.selectedIdea.keyFeatures) ? `
                <h4>Key Features & Capabilities</h4>
                <ul>
                    ${projectData.ideaOutput.selectedIdea.keyFeatures.map((feature: string) => 
                        `<li><strong>Feature:</strong> ${feature}</li>`
                    ).join('')}
                </ul>
                ` : ''}
                
                ${projectData.ideaOutput.selectedIdea.targetMarket ? `
                <h4>Target Market</h4>
                <ul>
                    <li><strong>Primary Market:</strong> ${projectData.ideaOutput.selectedIdea.targetMarket}</li>
                </ul>
                ` : ''}
                
                ${projectData.ideaOutput.selectedIdea.revenueModel ? `
                <h4>Revenue Model</h4>
                <ul>
                    <li><strong>Monetization Strategy:</strong> ${projectData.ideaOutput.selectedIdea.revenueModel}</li>
                </ul>
                ` : ''}
            </div>
            ` : ''}
        </section>`;
  }

  static generateMarketResearchSection(projectData: ProjectData): string {
    if (!projectData.researchOutput) return '';

    return `
        <section class="report-section page-break">
            <div class="section-header">
                <h2 class="section-title">📊 Market Research & Analysis</h2>
                <p class="section-description">Comprehensive market intelligence and competitive landscape analysis</p>
            </div>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>🌍 Market Landscape</h3>
                    <ul>
                        <li><strong>Total Addressable Market:</strong> ${projectData.researchOutput.marketLandscape?.totalAddressableMarket || 'Analyzing...'}</li>
                        <li><strong>Serviceable Market:</strong> ${projectData.researchOutput.marketLandscape?.serviceableAddressableMarket || 'Analyzing...'}</li>
                        <li><strong>Growth Rate:</strong> ${projectData.researchOutput.marketLandscape?.marketGrowthRate || 'Analyzing...'}</li>
                        <li><strong>Market Maturity:</strong> ${projectData.researchOutput.marketLandscape?.marketMaturity || 'Analyzing...'}</li>
                        <li><strong>Key Trends:</strong> ${projectData.researchOutput.marketLandscape?.keyTrends || 'Market analysis in progress'}</li>
                    </ul>
                </div>
                
                <div class="content-card">
                    <h3>👥 Target Customer Analysis</h3>
                    <ul>
                        <li><strong>Primary Segment:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.primarySegment || 'Customer analysis in progress'}</li>
                        <li><strong>Segment Size:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.segmentSize || 'Analyzing...'}</li>
                        <li><strong>Customer LTV:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.lifetimeValue || 'Calculating...'}</li>
                        <li><strong>Acquisition Cost:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.customerAcquisitionCost || 'Calculating...'}</li>
                        <li><strong>Buying Behavior:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.buyingBehavior || 'Analyzing...'}</li>
                    </ul>
                    
                    ${projectData.researchOutput.targetCustomerAnalysis?.customerPainPoints && Array.isArray(projectData.researchOutput.targetCustomerAnalysis.customerPainPoints) ? `
                    <h4>Key Pain Points</h4>
                    <ul>
                        ${projectData.researchOutput.targetCustomerAnalysis.customerPainPoints.map((pain: string) => 
                            `<li><strong>Pain Point:</strong> ${pain}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
            </div>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>⚔️ Competitive Landscape</h3>
                    <ul>
                        <li><strong>Market Opportunity:</strong> ${projectData.researchOutput.competitiveLandscape?.competitiveGap || 'Analysis not available'}</li>
                        <li><strong>Threat Level:</strong> ${projectData.researchOutput.competitiveLandscape?.threatLevel || 'Analyzing...'}</li>
                        <li><strong>Positioning Strategy:</strong> ${projectData.researchOutput.competitiveLandscape?.marketPosition || 'Analyzing...'}</li>
                    </ul>
                    
                    ${projectData.researchOutput.competitiveLandscape?.mainCompetitors && Array.isArray(projectData.researchOutput.competitiveLandscape.mainCompetitors) ? `
                    <h4>Main Competitors</h4>
                    <ul>
                        ${projectData.researchOutput.competitiveLandscape.mainCompetitors.map((competitor: string) => 
                            `<li><strong>Competitor:</strong> ${competitor}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                </div>
                
                ${projectData.researchOutput.technologyAnalysis ? `
                <div class="content-card">
                    <h3>💻 Technology Analysis</h3>
                    <ul>
                        <li><strong>Implementation Complexity:</strong> ${projectData.researchOutput.technologyAnalysis.implementationComplexity || 'Analyzing...'}</li>
                        <li><strong>Development Timeline:</strong> ${projectData.researchOutput.technologyAnalysis.developmentTimeline || 'Analyzing...'}</li>
                        <li><strong>Technical Risks:</strong> ${projectData.researchOutput.technologyAnalysis.technicalRisks || 'Analyzing...'}</li>
                    </ul>
                </div>
                ` : ''}
            </div>
        </section>`;
  }

  static generateBusinessStrategySection(projectData: ProjectData): string {
    if (!projectData.blueprintOutput) return '';

    return `
        <section class="report-section page-break">
            <div class="section-header">
                <h2 class="section-title">🏗️ Business Strategy & Model</h2>
                <p class="section-description">Strategic framework and operational blueprint for sustainable growth</p>
            </div>
            
            <div class="content-grid">
                <div class="content-card">
                    <h3>🎯 Core Business Model</h3>
                    <ul>
                        <li><strong>Primary Model:</strong> ${projectData.blueprintOutput.coreBusinessModel?.primaryModel || 'Strategy development in progress'}</li>
                        <li><strong>Revenue Logic:</strong> ${projectData.blueprintOutput.coreBusinessModel?.revenueLogic || 'Business model analysis ongoing'}</li>
                    </ul>
                    
                    ${projectData.blueprintOutput.coreBusinessModel?.businessModelCanvas ? `
                    <h4>Business Model Canvas</h4>
                    <ul>
                        ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners ? `
                        <li><strong>Key Partners:</strong> ${Array.isArray(projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners) ? 
                            projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners.join(', ') : 
                            projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyPartners}</li>
                        ` : ''}
                        ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities ? `
                        <li><strong>Key Activities:</strong> ${Array.isArray(projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities) ? 
                            projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities.join(', ') : 
                            projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyActivities}</li>
                        ` : ''}
                        ${projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources ? `
                        <li><strong>Key Resources:</strong> ${Array.isArray(projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources) ? 
                            projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources.join(', ') : 
                            projectData.blueprintOutput.coreBusinessModel.businessModelCanvas.keyResources}</li>
                        ` : ''}
                    </ul>
                    ` : ''}
                </div>
                
                <div class="content-card">
                    <h3>💰 Revenue Architecture</h3>
                    ${projectData.blueprintOutput.revenueArchitecture ? `
                    <ul>
                        <li><strong>Pricing Philosophy:</strong> ${projectData.blueprintOutput.revenueArchitecture.pricingPhilosophy || 'Pricing strategy development in progress'}</li>
                        <li><strong>Monetization Timeline:</strong> ${projectData.blueprintOutput.revenueArchitecture.monetizationTimeline || 'Timeline development in progress'}</li>
                    </ul>
                    
                    ${projectData.blueprintOutput.revenueArchitecture.primaryStreams && Array.isArray(projectData.blueprintOutput.revenueArchitecture.primaryStreams) ? `
                    <h4>Primary Revenue Streams</h4>
                    <ul>
                        ${projectData.blueprintOutput.revenueArchitecture.primaryStreams.map((stream: any) => 
                            `<li><strong>${stream.streamName || 'Revenue Stream'}:</strong> ${stream.model || 'Model'} - ${stream.pricingStrategy || 'Pricing'} (${stream.year3Projection || 'Projection'})</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                    ` : ''}
                </div>
            </div>
        </section>`;
  }

  static generateFinancialSection(projectData: ProjectData): string {
    if (!projectData.financialOutput) return '';

    return `
        <section class="report-section page-break">
            <div class="section-header">
                <h2 class="section-title">📈 Financial Projections & Analysis</h2>
                <p class="section-description">Comprehensive financial modeling and investment analysis</p>
            </div>
            
            ${projectData.financialOutput.threeYearProjections ? `
            <div class="content-card">
                <h3>📊 3-Year Financial Projections</h3>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Financial Metric</th>
                            <th>Year 1</th>
                            <th>Year 2</th>
                            <th>Year 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="highlight-row">
                            <td><strong>Total Revenue</strong></td>
                            <td>${projectData.financialOutput.threeYearProjections.year1?.totalRevenue || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year2?.totalRevenue || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year3?.totalRevenue || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Cost of Goods Sold</td>
                            <td>${projectData.financialOutput.threeYearProjections.year1?.cogs || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year2?.cogs || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year3?.cogs || 'N/A'}</td>
                        </tr>
                        <tr class="metric-row">
                            <td><strong>Gross Margin</strong></td>
                            <td>${projectData.financialOutput.threeYearProjections.year1?.grossMargin || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year2?.grossMargin || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year3?.grossMargin || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Operating Expenses</td>
                            <td>${projectData.financialOutput.threeYearProjections.year1?.operatingExpenses || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year2?.operatingExpenses || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year3?.operatingExpenses || 'N/A'}</td>
                        </tr>
                        <tr class="highlight-row">
                            <td><strong>Net Profit/Loss</strong></td>
                            <td>${projectData.financialOutput.threeYearProjections.year1?.netProfitLoss || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year2?.netProfitLoss || 'N/A'}</td>
                            <td>${projectData.financialOutput.threeYearProjections.year3?.netProfitLoss || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            <div class="content-grid">
                ${projectData.financialOutput.fundingAnalysis ? `
                <div class="content-card">
                    <h3>💼 Funding Analysis</h3>
                    <ul>
                        <li><strong>Funding Required:</strong> ${projectData.financialOutput.fundingAnalysis.seedFunding || 'N/A'}</li>
                        <li><strong>Runway:</strong> ${projectData.financialOutput.fundingAnalysis.runwayAnalysis?.currentFunding || 'N/A'}</li>
                        <li><strong>Monthly Burn (Y1):</strong> ${projectData.financialOutput.fundingAnalysis.monthlyBurnRate?.year1Average || 'N/A'}</li>
                        <li><strong>Peak Burn Rate:</strong> ${projectData.financialOutput.fundingAnalysis.monthlyBurnRate?.peakBurn || 'N/A'}</li>
                    </ul>
                </div>
                ` : ''}
                
                ${projectData.financialOutput.keyMetrics ? `
                <div class="content-card">
                    <h3>🎯 Unit Economics</h3>
                    <ul>
                        <li><strong>Customer LTV:</strong> ${projectData.financialOutput.keyMetrics.ltv || 'N/A'}</li>
                        <li><strong>Customer CAC:</strong> ${projectData.financialOutput.keyMetrics.cac || 'N/A'}</li>
                        <li><strong>LTV:CAC Ratio:</strong> ${projectData.financialOutput.keyMetrics.ltvCacRatio || 'N/A'}</li>
                        <li><strong>Payback Period:</strong> ${projectData.financialOutput.keyMetrics.paybackPeriod || 'N/A'}</li>
                    </ul>
                </div>
                ` : ''}
            </div>
        </section>`;
  }

  static generatePitchSection(projectData: ProjectData): string {
    if (!projectData.pitchOutput) return '';

    return `
        <section class="report-section page-break">
            <div class="section-header">
                <h2 class="section-title">🎤 Investor Pitch Overview</h2>
                <p class="section-description">Investment proposition and growth opportunity</p>
            </div>
            
            ${projectData.pitchOutput.executiveSummary ? `
            <div class="highlight-box">
                <h4>Investment Summary</h4>
                <p>${projectData.pitchOutput.executiveSummary}</p>
            </div>
            ` : ''}
            
            <div class="content-grid">
                ${projectData.pitchOutput.pitchDeckSlides?.problemSlide ? `
                <div class="content-card">
                    <h3>❗ Problem Statement</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.problemSlide.headline || 'Market Problem'}</h4>
                    <p>${projectData.pitchOutput.pitchDeckSlides.problemSlide.problemStatement || 'Problem analysis in progress'}</p>
                    ${projectData.pitchOutput.pitchDeckSlides.problemSlide.marketSize ? `
                    <ul>
                        <li><strong>Market Size:</strong> ${projectData.pitchOutput.pitchDeckSlides.problemSlide.marketSize}</li>
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
                
                ${projectData.pitchOutput.pitchDeckSlides?.solutionSlide ? `
                <div class="content-card">
                    <h3>💡 Solution Overview</h3>
                    <h4>${projectData.pitchOutput.pitchDeckSlides.solutionSlide.headline || 'Our Solution'}</h4>
                    <p>${projectData.pitchOutput.pitchDeckSlides.solutionSlide.solutionDescription || 'Solution development in progress'}</p>
                </div>
                ` : ''}
            </div>
        </section>`;
  }

  static generateGTMSection(projectData: ProjectData): string {
    if (!projectData.gtmOutput) return '';

    return `
        <section class="report-section page-break">
            <div class="section-header">
                <h2 class="section-title">🚀 Go-to-Market Strategy</h2>
                <p class="section-description">Comprehensive market entry and growth strategy</p>
            </div>
            
            <div class="content-grid">
                ${projectData.gtmOutput.strategicOverview ? `
                <div class="content-card">
                    <h3>🎯 Strategic Overview</h3>
                    <ul>
                        <li><strong>GTM Thesis:</strong> ${projectData.gtmOutput.strategicOverview.gtmThesis || 'Strategy development in progress'}</li>
                        <li><strong>Market Entry:</strong> ${projectData.gtmOutput.strategicOverview.marketEntryStrategy || 'Market entry planning ongoing'}</li>
                        <li><strong>Primary Objective:</strong> ${projectData.gtmOutput.strategicOverview.primaryObjective || 'Objectives being defined'}</li>
                        <li><strong>Success Metrics:</strong> ${projectData.gtmOutput.strategicOverview.successMetrics || 'Metrics being defined'}</li>
                    </ul>
                </div>
                ` : ''}
                
                ${projectData.gtmOutput.budgetAndInvestment ? `
                <div class="content-card">
                    <h3>💰 Investment & ROI</h3>
                    <ul>
                        <li><strong>Total GTM Budget:</strong> ${projectData.gtmOutput.budgetAndInvestment.totalGtmBudget || 'Budget planning in progress'}</li>
                        <li><strong>Blended CAC:</strong> ${projectData.gtmOutput.budgetAndInvestment.roiProjections?.blendedCAC || 'TBD'}</li>
                        <li><strong>LTV:CAC Ratio:</strong> ${projectData.gtmOutput.budgetAndInvestment.roiProjections?.ltvCacRatio || 'TBD'}</li>
                        <li><strong>Payback Period:</strong> ${projectData.gtmOutput.budgetAndInvestment.roiProjections?.paybackPeriod || 'TBD'}</li>
                    </ul>
                </div>
                ` : ''}
            </div>
        </section>`;
  }

  static async generatePDF(projectData: ProjectData, options: ReportOptions): Promise<Buffer> {
    console.log('[PDF] Starting professional PDF generation...');
    
    try {
      // Generate HTML with professional template
      const html = this.generateProfessionalHTML(projectData, options);
      console.log(`[PDF] Generated professional HTML, length: ${html.length} characters`);
      
      return await this.htmlToPDF(html, options, projectData);
    } catch (error) {
      console.error('[PDF] Professional PDF generation failed:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async htmlToPDF(html: string, options: ReportOptions, projectData: ProjectData): Promise<Buffer> {
    let browser: any = null;
    
    try {
      console.log('[PDF] Launching browser for PDF conversion...');
      
      // Optimized Puppeteer configuration for serverless
      const puppeteerConfig: any = {
        headless: 'new',
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
          '--virtual-time-budget=5000',
          '--run-all-compositor-stages-before-draw',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-backgrounding-occluded-windows',
          '--disable-ipc-flooding-protection'
        ],
        timeout: 30000
      };
      
      if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      }
      
      browser = await puppeteer.launch(puppeteerConfig);
      const page = await browser.newPage();
      
      // Set optimal settings for PDF generation
      await page.setViewport({ width: 1200, height: 1600 });
      await page.setDefaultTimeout(30000);
      
      // Load HTML content
      await page.setContent(html, { 
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 30000
      });
      
      // Wait for fonts and styles to load
      await page.evaluateHandle('document.fonts.ready');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('[PDF] Generating PDF from HTML...');
      
      // Generate PDF with optimal settings
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: false,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        timeout: 30000
      });
      
      console.log(`[PDF] PDF generated successfully, size: ${pdfBuffer.length} bytes`);
      
      // Validate PDF
      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error('Generated PDF is empty');
      }
      
      const pdfSignature = pdfBuffer.slice(0, 4).toString();
      if (pdfSignature !== '%PDF') {
        throw new Error(`Invalid PDF signature: ${pdfSignature}`);
      }
      
      return Buffer.from(pdfBuffer);
      
    } catch (error) {
      console.error('[PDF] Browser-based PDF generation failed:', error);
      
      // Fallback to jsPDF for basic PDF
      console.log('[PDF] Falling back to jsPDF...');
      return this.generateFallbackPDF(projectData, options);
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.warn('[PDF] Error closing browser:', closeError);
        }
      }
    }
  }

  static generateFallbackPDF(projectData: ProjectData, options: ReportOptions): Buffer {
    console.log('[PDF] Generating comprehensive fallback PDF with jsPDF...');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 8;
    let yPos = margin;
    
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      if (yPos > pageHeight - margin - lineHeight) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight;
    };
    
    const addSection = (title: string) => {
      yPos += 10;
      addText(title, 14, true);
      yPos += 5;
    };
    
    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(projectData.name, margin, 25);
    doc.setFontSize(12);
    doc.text('Business Plan & Investment Proposal', margin, 35);
    
    // Reset text color and position
    doc.setTextColor(0, 0, 0);
    yPos = 60;
    
    // Executive Summary
    addSection('Executive Summary');
    const executiveSummary = this.generateExecutiveSummary(projectData);
    addText(executiveSummary, 11);
    
    // Financial Metrics
    const financialMetrics = this.extractFinancialMetrics(projectData);
    if (financialMetrics) {
      addSection('Key Financial Metrics');
      addText(`Seed Funding Target: ${financialMetrics.seedFunding}`, 11);
      addText(`Year 3 Revenue Projection: ${financialMetrics.year3Revenue}`, 11);
      addText(`Break-Even Timeline: ${financialMetrics.breakEvenMonth}`, 11);
      addText(`Gross Margin: ${financialMetrics.grossMargin}`, 11);
      addText(`Customer LTV: ${financialMetrics.ltv}`, 11);
      addText(`Customer CAC: ${financialMetrics.cac}`, 11);
    }
    
    // Market Research Summary
    if (projectData.researchOutput) {
      addSection('Market Research Summary');
      addText(`Total Addressable Market: ${projectData.researchOutput.marketLandscape?.totalAddressableMarket || 'Under analysis'}`, 11);
      addText(`Primary Customer Segment: ${projectData.researchOutput.targetCustomerAnalysis?.primarySegment || 'Customer analysis in progress'}`, 11);
      addText(`Market Growth Rate: ${projectData.researchOutput.marketLandscape?.marketGrowthRate || 'Analyzing market dynamics'}`, 11);
    }
    
    // Business Strategy
    if (projectData.blueprintOutput?.coreBusinessModel) {
      addSection('Business Strategy');
      addText(`Primary Business Model: ${projectData.blueprintOutput.coreBusinessModel.primaryModel || 'Strategy development in progress'}`, 11);
      addText(`Revenue Logic: ${projectData.blueprintOutput.coreBusinessModel.revenueLogic || 'Business model analysis ongoing'}`, 11);
    }
    
    // Business Idea
    if (projectData.ideaOutput?.selectedIdea) {
      addSection('Business Concept');
      addText(`Selected Idea: ${projectData.ideaOutput.selectedIdea.title || 'Business Concept'}`, 11);
      addText(`Description: ${projectData.ideaOutput.selectedIdea.description || 'Description not available'}`, 11);
      if (projectData.ideaOutput.selectedIdea.targetMarket) {
        addText(`Target Market: ${projectData.ideaOutput.selectedIdea.targetMarket}`, 11);
      }
    }

    // Market Research
    if (projectData.researchOutput) {
      addSection('Market Research');
      addText(`Total Addressable Market: ${projectData.researchOutput.marketLandscape?.totalAddressableMarket || 'Under analysis'}`, 11);
      addText(`Primary Customer Segment: ${projectData.researchOutput.targetCustomerAnalysis?.primarySegment || 'Customer analysis in progress'}`, 11);
      addText(`Market Growth Rate: ${projectData.researchOutput.marketLandscape?.marketGrowthRate || 'Analyzing market dynamics'}`, 11);
      
      if (projectData.researchOutput.competitiveLandscape?.mainCompetitors) {
        addText(`Main Competitors: ${projectData.researchOutput.competitiveLandscape.mainCompetitors.join(', ')}`, 11);
      }
    }

    // Business Strategy  
    if (projectData.blueprintOutput?.coreBusinessModel) {
      addSection('Business Strategy');
      addText(`Primary Business Model: ${projectData.blueprintOutput.coreBusinessModel.primaryModel || 'Strategy development in progress'}`, 11);
      addText(`Revenue Logic: ${projectData.blueprintOutput.coreBusinessModel.revenueLogic || 'Business model analysis ongoing'}`, 11);
      
      if (projectData.blueprintOutput.revenueArchitecture?.pricingPhilosophy) {
        addText(`Pricing Philosophy: ${projectData.blueprintOutput.revenueArchitecture.pricingPhilosophy}`, 11);
      }
    }

    // Financial Projections (detailed)
    if (projectData.financialOutput) {
      addSection('Financial Projections');
      
      // 3-Year projections
      if (projectData.financialOutput.threeYearProjections) {
        addText('3-Year Revenue Projections:', 12, true);
        const proj = projectData.financialOutput.threeYearProjections;
        if (proj.year1?.totalRevenue) addText(`Year 1: ${proj.year1.totalRevenue}`, 11);
        if (proj.year2?.totalRevenue) addText(`Year 2: ${proj.year2.totalRevenue}`, 11);
        if (proj.year3?.totalRevenue) addText(`Year 3: ${proj.year3.totalRevenue}`, 11);
      }
      
      // Key metrics
      if (projectData.financialOutput.keyMetrics) {
        addText('Unit Economics:', 12, true);
        const metrics = projectData.financialOutput.keyMetrics;
        if (metrics.ltv) addText(`Customer LTV: ${metrics.ltv}`, 11);
        if (metrics.cac) addText(`Customer CAC: ${metrics.cac}`, 11);
        if (metrics.ltvCacRatio) addText(`LTV:CAC Ratio: ${metrics.ltvCacRatio}`, 11);
      }
    }

    // Pitch Deck Summary
    if (projectData.pitchOutput) {
      addSection('Investment Opportunity');
      if (projectData.pitchOutput.executiveSummary) {
        addText(projectData.pitchOutput.executiveSummary, 11);
      }
      
      if (projectData.pitchOutput.pitchDeckSlides?.fundingSlide?.fundingAmount) {
        addText(`Funding Required: ${projectData.pitchOutput.pitchDeckSlides.fundingSlide.fundingAmount}`, 11);
      }
    }

    // GTM Strategy
    if (projectData.gtmOutput?.strategicOverview) {
      addSection('Go-to-Market Strategy');
      addText(`GTM Thesis: ${projectData.gtmOutput.strategicOverview.gtmThesis || 'Strategy development in progress'}`, 11);
      addText(`Market Entry Strategy: ${projectData.gtmOutput.strategicOverview.marketEntryStrategy || 'Market entry planning ongoing'}`, 11);
      addText(`Primary Objective: ${projectData.gtmOutput.strategicOverview.primaryObjective || 'Objectives being defined'}`, 11);
      
      if (projectData.gtmOutput.budgetAndInvestment?.totalGtmBudget) {
        addText(`GTM Budget: ${projectData.gtmOutput.budgetAndInvestment.totalGtmBudget}`, 11);
      }
    }
    
    // Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated by VentureForge AI • ${new Date().toLocaleDateString()}`, margin, footerY);
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log(`[PDF] Fallback PDF generated, size: ${pdfBuffer.length} bytes`);
    
    return pdfBuffer;
  }

  static generateHTML(projectData: ProjectData, options: ReportOptions): string {
    return this.generateProfessionalHTML(projectData, options);
  }
}

export default ProfessionalReportGenerator;