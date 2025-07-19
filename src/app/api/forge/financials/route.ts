import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { geminiModel } from "@/lib/gemini";
import { AIService } from "@/lib/ai-service";
import { SessionStorageService } from "@/lib/session-storage";
import { UsageTrackingService } from "@/lib/usage-tracking";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const FINANCIALS_COST = 12; // Credits required for financial projections

const FINANCIALS_PROMPT = `You are the 'Financial Forecaster' module of VentureForge AI, an elite financial modeling expert.

**CRITICAL REQUIREMENT:** Generate investor-grade financial projections that real entrepreneurs and VCs will use for funding decisions. Every number must be defensible, realistic, and based on industry benchmarks. Superficial or placeholder projections are unacceptable.

**TASK:** Create comprehensive 3-year financial model with detailed assumptions and calculations for: {business_plan}

**FUNDING CONTEXT:** $1,500,000 seed funding target

**METHODOLOGY:**
1. Revenue Modeling: Build bottom-up revenue projections based on customer segments, pricing, and market penetration
2. Cost Structure: Detail all operational costs including personnel, technology, marketing, and overhead
3. Unit Economics: Calculate LTV, CAC, payback periods, and contribution margins
4. Cash Flow: Model monthly cash flows to determine funding requirements and runway
5. Scenario Analysis: Provide base case with sensitivity analysis

**OUTPUT FORMAT - COMPREHENSIVE FINANCIAL MODEL:**
{
  "keyAssumptions": [
    {
      "assumption": "Customer Acquisition Cost (CAC)",
      "value": "$XXX",
      "justification": "Based on [specific industry benchmark/study]: SaaS companies in [sector] average $X CAC. We project $Y due to [specific factors]",
      "sensitivity": "Range: $X-Y based on marketing channel efficiency"
    },
    {
      "assumption": "Monthly Churn Rate",
      "value": "X.X%",
      "justification": "Industry benchmark for [business type]: X%. We model Y% due to [specific retention strategies]",
      "impact": "1% churn increase reduces LTV by $X"
    },
    {
      "assumption": "Average Revenue Per User (ARPU)",
      "value": "$XXX/month",
      "justification": "Based on competitive pricing analysis and value proposition. [Competitor A]: $X, [Competitor B]: $Y",
      "growthTrajectory": "ARPU growth: X% annually through upselling and premium features"
    },
    {
      "assumption": "Market Penetration Rate",
      "value": "X.X% by Year 3",
      "justification": "Conservative estimate based on TAM of $XB and similar companies achieving X% penetration",
      "benchmarks": "Comparable companies: [Company A] achieved X% in Y years"
    },
    {
      "assumption": "Gross Margin",
      "value": "XX%",
      "justification": "Industry standard for [business model]: X-Y%. Our model assumes X% due to [cost structure]",
      "trajectory": "Improving from X% Year 1 to Y% Year 3 through economies of scale"
    }
  ],
  "revenueModel": {
    "revenueStreams": [
      {
        "stream": "Primary Subscription Revenue",
        "year1": "$XXX,XXX",
        "year2": "$X,XXX,XXX",
        "year3": "$X,XXX,XXX",
        "assumptions": "X customers × $Y ARPU × Z% growth rate",
        "customerGrowth": "Month 1: X customers → Month 36: Y customers"
      }
    ],
    "customerAcquisition": {
      "year1Customers": "XXX customers",
      "year2Customers": "X,XXX customers", 
      "year3Customers": "XX,XXX customers",
      "acquisitionChannels": "XX% organic, XX% paid, XX% partnerships",
      "seasonality": "Describe any seasonal patterns in customer acquisition"
    }
  },
  "threeYearProjections": {
    "year1": {
      "totalRevenue": "$XXX,XXX",
      "cogs": "$XX,XXX",
      "grossMargin": "XX%",
      "operatingExpenses": "$XXX,XXX",
      "ebitda": "-$XXX,XXX",
      "netProfitLoss": "-$XXX,XXX",
      "cashFlow": "-$XXX,XXX"
    },
    "year2": {
      "totalRevenue": "$X,XXX,XXX",
      "cogs": "$XXX,XXX",
      "grossMargin": "XX%",
      "operatingExpenses": "$X,XXX,XXX",
      "ebitda": "-$XXX,XXX",
      "netProfitLoss": "-$XXX,XXX",
      "cashFlow": "-$XXX,XXX"
    },
    "year3": {
      "totalRevenue": "$X,XXX,XXX",
      "cogs": "$XXX,XXX",
      "grossMargin": "XX%",
      "operatingExpenses": "$X,XXX,XXX",
      "ebitda": "$XXX,XXX",
      "netProfitLoss": "$XXX,XXX",
      "cashFlow": "$XXX,XXX"
    }
  },
  "costStructure": {
    "personnelCosts": {
      "year1": "$XXX,XXX",
      "year2": "$XXX,XXX", 
      "year3": "$XXX,XXX",
      "headcountPlan": "Year 1: X employees, Year 2: Y employees, Year 3: Z employees",
      "keyHires": "Month X: CTO ($X salary), Month Y: VP Sales ($Y salary)"
    },
    "technologyCosts": {
      "year1": "$XX,XXX",
      "year2": "$XX,XXX",
      "year3": "$XXX,XXX",
      "breakdown": "AWS: $X/month, SaaS tools: $Y/month, development: $Z"
    },
    "marketingCosts": {
      "year1": "$XXX,XXX", 
      "year2": "$XXX,XXX",
      "year3": "$XXX,XXX",
      "allocations": "Digital ads: XX%, content: XX%, events: XX%",
      "efficiency": "Blended CAC improving from $X to $Y over 3 years"
    }
  },
  "fundingAnalysis": {
    "seedFunding": "$1,500,000",
    "useOfFunds": {
      "personnel": "XX% ($XXX,XXX) - Engineering, sales, operations team",
      "marketing": "XX% ($XXX,XXX) - Customer acquisition and brand building", 
      "technology": "XX% ($XXX,XXX) - Product development and infrastructure",
      "operations": "XX% ($XXX,XXX) - Working capital and operational expenses",
      "contingency": "XX% ($XXX,XXX) - Risk buffer and unexpected opportunities"
    },
    "monthlyBurnRate": {
      "year1Average": "$XX,XXX/month",
      "year2Average": "$XXX,XXX/month",
      "year3Average": "$XXX,XXX/month",
      "peakBurn": "$XXX,XXX in Month XX"
    },
    "runwayAnalysis": {
      "currentFunding": "XX months to break-even",
      "calculation": "$1,500,000 ÷ $XX,XXX avg monthly burn = XX months",
      "keyMilestones": "Month 12: $X MRR, Month 18: Break-even, Month 24: $Y MRR",
      "nextFundingRound": "Series A: $X-Y million in Month XX at $XM valuation"
    }
  },
  "keyMetrics": {
    "ltv": "$X,XXX",
    "cac": "$XXX", 
    "ltvCacRatio": "X.X:1",
    "paybackPeriod": "XX months",
    "arr": "$XXX,XXX (Year 1) → $X,XXX,XXX (Year 3)",
    "revenueGrowth": "XXX% Year 2, XXX% Year 3",
    "grossMarginTrend": "XX% → XX% → XX%",
    "burnMultiple": "X.X (revenue growth ÷ net burn)"
  },
  "pathToProfitability": {
    "breakEvenMonth": "Month XX (when monthly revenue > monthly costs)",
    "breakEvenRevenue": "$XXX,XXX monthly recurring revenue", 
    "keyDrivers": "Customer growth rate of XX%/month + ARPU growth of X%/year",
    "profitabilityStrategy": "Detailed explanation of how unit economics and scale lead to profitability",
    "sensitivityAnalysis": "Break-even moves ±X months with ±20% change in key assumptions"
  },
  "benchmarkAnalysis": {
    "industryComparisons": "Revenue multiple: X.Xx vs industry average of Y.Y",
    "competitorFinancials": "[Competitor A]: $XM revenue, XX% growth; [Competitor B]: $YM revenue, YY% growth",
    "valuationMetrics": "Projected Year 3 valuation: $X-YM based on X-Y revenue multiple"
  }
}

**QUALITY STANDARDS:**
- All numbers must be realistic and defensible with specific justifications
- Include month-by-month cash flow implications for the first 18 months
- Reference specific industry benchmarks and comparable companies
- Show clear path from current state to profitability
- Include sensitivity analysis for key variables
- Demonstrate understanding of SaaS/startup financial metrics

Generate professional, investor-ready financial projections now. Return ONLY the JSON object.`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough credits using tracking service
    const hasCredits = await UsageTrackingService.checkCredits(user.id, FINANCIALS_COST);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits", required: FINANCIALS_COST, current: user.credits },
        { status: 402 }
      );
    }

    // Verify project ownership and get blueprint data
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if project has expired
    if (project.expiresAt && project.expiresAt < new Date()) {
      return NextResponse.json({ error: "Project has expired" }, { status: 404 });
    }

    // Get or create session storage for this project
    let sessionProject = SessionStorageService.getProjectSession(projectId, user.id);
    if (!sessionProject) {
      SessionStorageService.createProjectSession(
        user.id,
        project.name,
        project.storageMode === 'PERSISTENT',
        project.expiresAt || undefined,
        project.id
      );
      sessionProject = SessionStorageService.getProjectSession(projectId, user.id);
    }

    if (!sessionProject) {
      return NextResponse.json({ error: "Failed to initialize project session" }, { status: 500 });
    }

    // Check if blueprint output exists in session storage
    if (!sessionProject.data.blueprintOutput) {
      return NextResponse.json(
        { error: "Business blueprint must be completed before financial projections" },
        { status: 400 }
      );
    }

    // Get all previous outputs from session storage
    const businessPlan = {
      idea: sessionProject.data.ideaOutput || null,
      research: sessionProject.data.researchOutput || null,
      blueprint: sessionProject.data.blueprintOutput
    };

    // Use the new AI service with retry mechanism
    console.log(`[FINANCIALS] Starting financial projections for project ${projectId}`);
    
    const prompt = FINANCIALS_PROMPT.replace("{business_plan}", JSON.stringify(businessPlan));
    const userPrompt = `Please create comprehensive financial projections based on the business plan data.`;

    const aiResult = await AIService.generateWithRetry({
      prompt,
      userPrompt,
      retryConfig: {
        maxRetries: 3,
        timeoutMs: 240000, // 4 minutes
        backoffMs: 3000    // 3 second initial backoff
      }
    });

    let parsedResponse;
    
    if (aiResult.successful) {
      console.log(`[FINANCIALS] AI generation successful after ${aiResult.retryCount} retries`);
      
      const jsonResult = AIService.parseJSONResponse(aiResult.content);
      
      if (jsonResult.success) {
        parsedResponse = jsonResult.parsed;
      } else {
        console.warn(`[FINANCIALS] JSON parsing failed: ${jsonResult.error}`);
        parsedResponse = AIService.createFallbackResponse('financials', prompt);
        parsedResponse._originalResponse = aiResult.content.substring(0, 500);
      }
    } else {
      console.error(`[FINANCIALS] AI generation failed after ${aiResult.retryCount} retries`);
      parsedResponse = AIService.createFallbackResponse('financials', prompt);
      parsedResponse._retryCount = aiResult.retryCount;
    }

    // Store financial output in session memory (no database persistence for privacy)
    const updateSuccess = SessionStorageService.updateProjectData(
      projectId,
      user.id,
      'financialOutput',
      parsedResponse
    );

    if (!updateSuccess) {
      return NextResponse.json({ error: "Failed to update project data" }, { status: 500 });
    }

    // Track usage and deduct credits
    await UsageTrackingService.trackUsage({
      userId: user.id,
      action: 'FINANCIALS',
      creditsUsed: FINANCIALS_COST,
      projectId: projectId,
      projectName: sessionProject.name,
      metadata: {
        aiModel: 'gpt-4',
        retryCount: aiResult.retryCount,
        successful: aiResult.successful
      }
    });

    return NextResponse.json({
      success: true,
      result: parsedResponse,
      creditsUsed: FINANCIALS_COST,
      creditsRemaining: user.credits - FINANCIALS_COST,
    });
  } catch (error) {
    console.error("Error in financials:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}