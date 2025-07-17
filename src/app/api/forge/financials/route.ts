import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

const FINANCIALS_COST = 12; // Credits required for financial projections

const FINANCIALS_PROMPT = `You are the 'Financial Forecaster' module of VentureForge AI.

**Task:** Develop realistic 3-year financial projections. You must state all assumptions clearly and show key calculations.

**INPUT:**
- business_plan: {business_plan}
- funding_ask: $1,500,000

**OUTPUT FORMAT:**
Return a JSON object with this exact structure:
{
  "keyAssumptions": [
    {
      "assumption": "Customer Acquisition Cost (CAC)",
      "value": "$XXX",
      "justification": "Based on industry benchmarks for B2B SaaS, similar companies spend $X-Y per customer"
    },
    {
      "assumption": "Annual Churn Rate",
      "value": "X%",
      "justification": "Industry average for this sector is X%, we project Y% due to strong value prop"
    },
    {
      "assumption": "Average Revenue Per User (ARPU)",
      "value": "$XXX/month",
      "justification": "Based on pricing strategy and market analysis"
    }
  ],
  "fundingAnalysis": {
    "seedFunding": "$1,500,000",
    "avgMonthlyGrossBurn": "$XXX,XXX",
    "avgMonthlyNetBurnYear1": "$XXX,XXX",
    "runwayMonths": "XX months",
    "runwayCalculation": "Funding / Net Monthly Burn = $1,500,000 / $XXX,XXX"
  },
  "threeYearProjections": {
    "year1": {
      "totalRevenue": "$XXX,XXX",
      "cogs": "$XX,XXX",
      "grossMargin": "XX%",
      "operatingExpenses": "$XXX,XXX",
      "netProfitLoss": "-$XXX,XXX"
    },
    "year2": {
      "totalRevenue": "$X,XXX,XXX",
      "cogs": "$XXX,XXX",
      "grossMargin": "XX%",
      "operatingExpenses": "$X,XXX,XXX",
      "netProfitLoss": "-$XXX,XXX"
    },
    "year3": {
      "totalRevenue": "$X,XXX,XXX",
      "cogs": "$XXX,XXX",
      "grossMargin": "XX%",
      "operatingExpenses": "$X,XXX,XXX",
      "netProfitLoss": "$XXX,XXX"
    }
  },
  "revenueBreakdown": {
    "year1": [
      {
        "stream": "Revenue Stream Name",
        "amount": "$XXX,XXX",
        "percentage": "XX%"
      }
    ],
    "year2": [],
    "year3": []
  },
  "pathToProfitability": {
    "breakEvenMonth": "Month XX",
    "keyMilestones": [
      "Month 6: $XXk MRR",
      "Month 12: $XXk MRR",
      "Month 18: Break-even"
    ],
    "profitabilityStrategy": "Explanation of how and when profitability is achieved"
  },
  "keyMetrics": {
    "ltv": "$XXX",
    "cac": "$XXX",
    "ltvCacRatio": "X:1",
    "paybackPeriod": "XX months",
    "arr": "$X,XXX,XXX"
  }
}

**Core Principles:**
- Realistic Projections: Base all numbers on industry benchmarks
- Clear Assumptions: Label all assumptions explicitly
- Conservative Estimates: Err on the side of caution
- Growth Trajectory: Show realistic scaling path

Generate comprehensive financial projections now.`;

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
    if (user.credits < FINANCIALS_COST) {
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

    if (!project.blueprintOutput) {
      return NextResponse.json(
        { error: "Business blueprint must be completed before financial projections" },
        { status: 400 }
      );
    }

    // Combine all previous outputs for context
    const businessPlan = {
      idea: project.ideaOutput,
      research: project.researchOutput,
      blueprint: project.blueprintOutput
    };

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: FINANCIALS_PROMPT.replace("{business_plan}", JSON.stringify(businessPlan)),
        },
        {
          role: "user",
          content: `Please create comprehensive financial projections based on the business plan data.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 3500,
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
        keyAssumptions: [{
          assumption: "Customer Acquisition Cost",
          value: "To be determined",
          justification: "Industry analysis required"
        }],
        fundingAnalysis: {
          seedFunding: "$1,500,000",
          avgMonthlyGrossBurn: "To be calculated",
          avgMonthlyNetBurnYear1: "To be calculated",
          runwayMonths: "To be determined",
          runwayCalculation: "Pending burn rate analysis"
        },
        threeYearProjections: {
          year1: {
            totalRevenue: "To be projected",
            cogs: "To be calculated",
            grossMargin: "To be determined",
            operatingExpenses: "To be estimated",
            netProfitLoss: "To be calculated"
          },
          year2: {
            totalRevenue: "To be projected",
            cogs: "To be calculated", 
            grossMargin: "To be determined",
            operatingExpenses: "To be estimated",
            netProfitLoss: "To be calculated"
          },
          year3: {
            totalRevenue: "To be projected",
            cogs: "To be calculated",
            grossMargin: "To be determined", 
            operatingExpenses: "To be estimated",
            netProfitLoss: "To be calculated"
          }
        },
        revenueBreakdown: {
          year1: [],
          year2: [],
          year3: []
        },
        pathToProfitability: {
          breakEvenMonth: "To be determined",
          keyMilestones: [],
          profitabilityStrategy: aiResponse.substring(0, 300) + "..."
        },
        keyMetrics: {
          ltv: "To be calculated",
          cac: "To be determined",
          ltvCacRatio: "To be analyzed",
          paybackPeriod: "To be estimated",
          arr: "To be projected"
        }
      };
    }

    // Update project with the financial output and deduct credits
    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          financialOutput: parsedResponse,
          updatedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: user.credits - FINANCIALS_COST,
        },
      }),
    ]);

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