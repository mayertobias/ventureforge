import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const PITCH_COST = 8; // Credits required for pitch generation

const PITCH_PROMPT = `You are the 'Pitch Perfect' module of VentureForge AI, an elite investment banker and pitch strategist.

**CRITICAL REQUIREMENT:** Create an investment-grade pitch that sophisticated VCs and angel investors will immediately understand and evaluate. This pitch will be used in actual funding rounds and board presentations. Generic content or vague assertions are unacceptable.

**TASK:** Transform comprehensive business plan into compelling, investment-ready materials: {full_business_plan}

**METHODOLOGY:**
1. Narrative Architecture: Build a compelling investment story with clear problem-solution fit
2. Market Validation: Demonstrate significant opportunity with defensible positioning
3. Financial Logic: Show clear path to substantial returns with realistic projections
4. Risk Assessment: Address key concerns proactively with mitigation strategies
5. Investor Psychology: Appeal to both rational analysis and emotional conviction

**OUTPUT FORMAT - INVESTMENT-GRADE PITCH:**
{
  "executiveSummary": "Compelling 3-4 sentence summary that captures: (1) The specific problem and market size, (2) Unique solution and defensible advantage, (3) Financial opportunity and growth trajectory, (4) Funding ask and key milestone. Must be immediately compelling to busy investors.",
  "pitchDeckSlides": {
    "problemSlide": {
      "headline": "Specific, Quantified Problem Statement",
      "problemStatement": "Detailed description of the pain point affecting specific customer segments",
      "marketPainPoints": ["$X cost annually", "Y hours wasted per transaction", "Z% failure rate in current solutions"],
      "urgency": "Why this problem is getting worse and needs solving now",
      "personalConnection": "Relatable scenario that makes the problem tangible"
    },
    "solutionSlide": {
      "headline": "Revolutionary Solution That Addresses Root Cause",
      "solutionDescription": "Clear explanation of how the product/service solves the problem uniquely",
      "keyDifferentiators": ["Specific advantage 1", "Specific advantage 2", "Specific advantage 3"],
      "productDemo": "Visual or conceptual description of the user experience",
      "proofOfConcept": "Evidence that the solution works (prototype, pilot, early results)"
    },
    "marketOpportunitySlide": {
      "headline": "Massive Market Opportunity with Clear Entry Point",
      "marketSizing": {
        "tam": "$X.XB Total Addressable Market with methodology",
        "sam": "$X.XM Serviceable Addressable Market with constraints",
        "som": "$X.XM Serviceable Obtainable Market (3-5 year target)"
      },
      "marketTrends": ["Trend 1 driving X% growth", "Trend 2 creating new demand", "Trend 3 disrupting incumbents"],
      "timingRationale": "Why now is the perfect time for this solution"
    },
    "businessModelSlide": {
      "headline": "Proven Revenue Model with Strong Unit Economics",
      "revenueModel": "Primary business model with specific pricing strategy",
      "unitEconomics": {
        "customerAcquisitionCost": "$XXX CAC with 12-month payback",
        "lifetimeValue": "$X,XXX LTV resulting in X:1 LTV/CAC ratio",
        "grossMargin": "XX% gross margin improving to XX% at scale"
      },
      "revenueStreams": "Primary and secondary revenue sources with relative contribution",
      "scalabilityFactors": "How revenue scales with customer growth and market expansion"
    },
    "tractionSlide": {
      "headline": "Strong Early Traction Validates Product-Market Fit",
      "keyMetrics": {
        "customers": "XXX paying customers with XX% month-over-month growth",
        "revenue": "$XXX MRR with $X,XXX average deal size",
        "retention": "XX% retention rate and XX% net revenue retention"
      },
      "socialProof": ["Customer testimonial highlighting specific value", "Industry recognition or awards"],
      "milestoneProgression": "Key achievements in chronological order showing momentum",
      "marketValidation": "Proof points that confirm market demand and willingness to pay"
    },
    "competitionSlide": {
      "headline": "Defensible Competitive Position with Clear Moats",
      "competitiveLandscape": "Direct and indirect competitors with their limitations",
      "competitiveAdvantages": [
        {
          "advantage": "Technology/Data/Network advantage",
          "description": "Specific description of the moat",
          "defensibility": "Why competitors cannot easily replicate this"
        }
      ],
      "marketPositioning": "How the company positions against alternatives",
      "winningStrategy": "Specific plan to capture market share from incumbents"
    },
    "financialProjectionsSlide": {
      "headline": "Path to $XXM Revenue with Clear Profitability Timeline",
      "revenueGrowth": {
        "year1": "$XXX,XXX revenue",
        "year2": "$X.XM revenue (XXX% growth)",
        "year3": "$X.XM revenue (XXX% growth)",
        "year5": "$XXM revenue target"
      },
      "profitabilityMetrics": {
        "grossMargin": "XX% gross margin by Year 3",
        "ebitdaMargin": "XX% EBITDA margin by Year 5",
        "breakEven": "Break-even in Month XX"
      },
      "keyDrivers": "Primary metrics driving financial performance",
      "sensitivityAnalysis": "Upside and downside scenarios with probability estimates"
    },
    "fundingAskSlide": {
      "headline": "Strategic $1.5M Investment to Achieve Market Leadership",
      "fundingAmount": "$1,500,000 Series Seed",
      "useOfFunds": {
        "productDevelopment": "XX% ($XXX,XXX) - Specific development milestones",
        "salesMarketing": "XX% ($XXX,XXX) - Customer acquisition scaling",
        "teamExpansion": "XX% ($XXX,XXX) - Key hires with titles and timing",
        "workingCapital": "XX% ($XXX,XXX) - Operations and contingency"
      },
      "keyMilestones": "Critical achievements this funding will enable",
      "nextFundingRound": "Series A target: $X-YM in Month XX at $XM-YM valuation",
      "investorReturns": "Projected X-Y multiple return based on exit scenarios"
    },
    "teamSlide": {
      "headline": "Proven Team with Domain Expertise and Execution Track Record",
      "founderBios": "Brief but compelling backgrounds highlighting relevant experience",
      "teamStrengths": "Complementary skills covering technology, business, and market expertise",
      "advisorBoard": "Industry advisors and their specific contributions",
      "hiringPlan": "Key roles to be filled with funding and their impact on growth",
      "culturalAdvantage": "Unique team dynamics or hiring advantages"
    },
    "exitStrategySlide": {
      "headline": "Clear Path to Liquidity with Multiple Exit Options",
      "exitScenarios": [
        {
          "type": "Strategic Acquisition",
          "potentialAcquirers": ["Company A (rationale)", "Company B (rationale)"],
          "valuationRange": "$X-YM based on revenue multiples",
          "strategicRationale": "Why acquirers would pay premium"
        },
        {
          "type": "IPO Path",
          "timeline": "Year 5-7 at $XXM+ revenue",
          "comparablePublicCos": "Trading at X-Y revenue multiples",
          "marketReadiness": "Path to IPO-ready scale and metrics"
        }
      ],
      "investorReturns": "Target X-Y multiple return over 5-7 year period",
      "liquidityEvents": "Potential secondary opportunities or partial exits"
    }
  },
  "investorQA": [
    {
      "question": "What is your sustainable competitive advantage?",
      "answer": "Detailed explanation of defensible moats with specific examples and timeline for building them"
    },
    {
      "question": "How do you plan to acquire customers cost-effectively?",
      "answer": "Multi-channel acquisition strategy with specific CAC targets and scaling plan"
    },
    {
      "question": "What are the biggest risks to your business model?",
      "answer": "Honest assessment of key risks with specific mitigation strategies and contingency plans"
    },
    {
      "question": "How does this scale to a billion-dollar company?",
      "answer": "Long-term vision with market expansion opportunities and revenue scale potential"
    },
    {
      "question": "Why is this the right team to execute on this opportunity?",
      "answer": "Team credibility based on relevant experience, domain expertise, and execution capability"
    },
    {
      "question": "What happens if a big tech company enters your market?",
      "answer": "Competitive response strategy and advantages that protect against big tech disruption"
    }
  ],
  "appendixData": {
    "marketResearch": "Key market size and trend data with sources",
    "customerReferences": "Customer testimonials and case studies",
    "technicalDetails": "Product architecture and technical differentiation",
    "financialModel": "Detailed unit economics and assumption sensitivity",
    "competitorAnalysis": "In-depth competitive positioning and response plan"
  }
}

**QUALITY STANDARDS:**
- Every claim must be backed by specific data or logical reasoning
- Financial projections must align with provided business plan
- Narrative must flow logically from problem to solution to opportunity
- Address investor concerns proactively without appearing defensive
- Balance ambitious vision with realistic near-term execution
- Include specific metrics, timelines, and success criteria throughout

Generate a compelling, investment-grade pitch presentation now. Return ONLY the JSON object.`;

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

    // Check if user has enough credits
    if (user.credits < PITCH_COST) {
      return NextResponse.json(
        { error: "Insufficient credits", required: PITCH_COST, current: user.credits },
        { status: 402 }
      );
    }

    // Verify project ownership and get all data
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.financialOutput) {
      return NextResponse.json(
        { error: "Financial projections must be completed before creating pitch" },
        { status: 400 }
      );
    }

    // Combine all previous outputs for context
    const fullBusinessPlan = {
      idea: project.ideaOutput,
      research: project.researchOutput,
      blueprint: project.blueprintOutput,
      financials: project.financialOutput
    };

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: PITCH_PROMPT.replace("{full_business_plan}", JSON.stringify(fullBusinessPlan)),
        },
        {
          role: "user",
          content: `Please create a compelling investor pitch based on the complete business plan.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 4000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      parsedResponse = {
        executiveSummary: aiResponse.substring(0, 500) + "...",
        pitchDeckContent: {
          problem: {
            title: "The Problem",
            content: "Problem analysis in progress",
            marketSize: "To be determined"
          },
          solution: {
            title: "The Solution",
            content: "Solution description pending",
            keyFeatures: []
          },
          marketOpportunity: {
            title: "Market Opportunity",
            tam: "To be calculated",
            sam: "To be determined",
            marketTrends: "Analysis pending"
          },
          uniqueValue: {
            title: "Unique Value & Data Moat",
            dataMoat: "To be defined",
            defensibility: "To be established",
            networkEffects: "To be analyzed"
          },
          businessModel: {
            title: "Business Model",
            revenueStreams: "To be detailed",
            pricingStrategy: "To be finalized",
            unitEconomics: "To be calculated"
          },
          traction: {
            title: "Traction",
            keyMilestones: [],
            proofPoints: "To be gathered",
            earlyCustomers: "To be identified"
          },
          financialHighlights: {
            title: "Financial Highlights",
            revenueProjection: "To be projected",
            grossMargin: "To be calculated",
            profitability: "To be determined"
          },
          theAsk: {
            title: "The Ask",
            fundingAmount: "$1.5M",
            useOfFunds: "To be detailed",
            keyMilestone: "To be defined",
            timeline: "18-month runway"
          },
          team: {
            title: "The Team",
            teamStrength: "To be described",
            advisors: "To be recruited",
            hiringPlan: "To be planned"
          },
          exitStrategy: {
            title: "Exit Strategy",
            potentialAcquirers: [],
            exitTimeline: "5-7 years",
            valuationMultiple: "To be estimated"
          }
        },
        investorFAQ: []
      };
    }

    // Update project with the pitch output and deduct credits
    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          pitchOutput: parsedResponse,
          updatedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: user.credits - PITCH_COST,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      result: parsedResponse,
      creditsUsed: PITCH_COST,
      creditsRemaining: user.credits - PITCH_COST,
    });
  } catch (error) {
    console.error("Error in pitch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}