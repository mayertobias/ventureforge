import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const PITCH_COST = 8; // Credits required for pitch generation

const PITCH_PROMPT = `You are the 'Pitch Perfect' module of VentureForge AI.

**Task:** Synthesize all previous outputs into a compelling, investor-ready executive summary and structured pitch deck content.

**INPUT:**
- full_business_plan: {full_business_plan}

**OUTPUT FORMAT:**
Return a JSON object with this exact structure:
{
  "executiveSummary": "A concise, powerful paragraph covering the problem, solution, market, traction, and financial ask. This should be investorready and compelling.",
  "pitchDeckContent": {
    "problem": {
      "title": "The Problem",
      "content": "1-2 sentences describing the core problem being solved",
      "marketSize": "$X.XB market affected by this problem"
    },
    "solution": {
      "title": "The Solution", 
      "content": "1-2 sentences describing the product/service",
      "keyFeatures": ["feature1", "feature2", "feature3"]
    },
    "marketOpportunity": {
      "title": "Market Opportunity",
      "tam": "$X.XB",
      "sam": "$X.XM",
      "marketTrends": "Key trends driving market growth"
    },
    "uniqueValue": {
      "title": "Unique Value & Data Moat",
      "dataMoat": "How data creates competitive advantage",
      "defensibility": "What makes this defensible",
      "networkEffects": "Any network effects present"
    },
    "businessModel": {
      "title": "Business Model",
      "revenueStreams": "Primary revenue streams",
      "pricingStrategy": "How pricing works",
      "unitEconomics": "Key unit economics metrics"
    },
    "traction": {
      "title": "Traction",
      "keyMilestones": ["milestone1", "milestone2", "milestone3"],
      "proofPoints": "Evidence of market validation",
      "earlyCustomers": "Early adopter information"
    },
    "financialHighlights": {
      "title": "Financial Highlights",
      "revenueProjection": "Projecting $XM revenue in Year 3",
      "grossMargin": "X% gross margin",
      "profitability": "Path to profitability timeline"
    },
    "theAsk": {
      "title": "The Ask",
      "fundingAmount": "$1.5M",
      "useOfFunds": "What the money will be used for",
      "keyMilestone": "Key milestone to achieve with funding",
      "timeline": "18-month runway"
    },
    "team": {
      "title": "The Team", 
      "teamStrength": "Brief description of founding team expertise",
      "advisors": "Key advisors or board members",
      "hiringPlan": "Key roles to hire"
    },
    "exitStrategy": {
      "title": "Exit Strategy",
      "potentialAcquirers": ["acquirer1", "acquirer2"],
      "exitTimeline": "5-7 years",
      "valuationMultiple": "X-Y revenue multiple expected"
    }
  },
  "investorFAQ": [
    {
      "question": "What is your competitive advantage?",
      "answer": "Detailed answer addressing defensibility"
    },
    {
      "question": "How do you plan to acquire customers?",
      "answer": "Customer acquisition strategy and costs"
    },
    {
      "question": "What are the key risks?",
      "answer": "Main risks and mitigation strategies"
    }
  ]
}

**Core Principles:**
- Investor-Focused: Write for sophisticated investors
- Compelling Narrative: Tell a cohesive story
- Data-Driven: Support claims with concrete numbers
- Action-Oriented: Clear next steps and asks

Generate investor-ready pitch content now.`;

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