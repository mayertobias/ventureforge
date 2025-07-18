import puppeteer from 'puppeteer';
import { jsPDF } from 'jspdf';

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
  format: 'pdf' | 'html';
  template: 'executive' | 'investor' | 'comprehensive' | 'pitch-deck';
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
                        <li><strong>Market Growth Rate:</strong> ${projectData.researchOutput.marketLandscape?.marketGrowthRate || 'Analyzing...'}</li>
                        <li><strong>Key Trends:</strong> ${projectData.researchOutput.marketLandscape?.keyTrends || 'Market analysis in progress'}</li>
                    </ul>
                </div>
                <div class="content-card">
                    <h3>Target Customer Analysis</h3>
                    <ul>
                        <li><strong>Primary Segment:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.primarySegment || 'Customer analysis in progress'}</li>
                        <li><strong>Segment Size:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.segmentSize || 'Analyzing...'}</li>
                        <li><strong>Customer LTV:</strong> ${projectData.researchOutput.targetCustomerAnalysis?.lifetimeValue || 'Calculating...'}</li>
                    </ul>
                </div>
            </div>
        </div>
        ` : ''}

        ${projectData.blueprintOutput ? `
        <div class="section">
            <h2 class="section-title">Business Strategy & Model</h2>
            <div class="content-grid">
                <div class="content-card">
                    <h3>Core Business Model</h3>
                    <ul>
                        <li><strong>Primary Model:</strong> ${projectData.blueprintOutput.coreBusinessModel?.primaryModel || 'Strategy development in progress'}</li>
                        <li><strong>Revenue Logic:</strong> ${projectData.blueprintOutput.coreBusinessModel?.revenueLogic || 'Business model analysis ongoing'}</li>
                    </ul>
                </div>
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
                    </ul>
                </div>
                <div class="content-card">
                    <h3>6-Month Targets</h3>
                    <ul>
                        <li><strong>Month 1 Revenue:</strong> ${projectData.gtmOutput.salesTargets?.month1 || 'TBD'}</li>
                        <li><strong>Month 3 Revenue:</strong> ${projectData.gtmOutput.salesTargets?.month3 || 'TBD'}</li>
                        <li><strong>Month 6 Revenue:</strong> ${projectData.gtmOutput.salesTargets?.month6 || 'TBD'}</li>
                    </ul>
                </div>
            </div>
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
    console.log('[PDF] Starting PDF generation process...');
    
    // First try jsPDF (more reliable in serverless environments)
    try {
      console.log('[PDF] Attempting jsPDF generation...');
      return this.generateSimplePDF(projectData, options);
    } catch (jsPdfError) {
      console.warn('[PDF] jsPDF failed, falling back to Puppeteer:', jsPdfError);
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