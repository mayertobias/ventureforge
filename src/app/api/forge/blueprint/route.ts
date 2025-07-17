import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const BLUEPRINT_COST = 15; // Credits required for business blueprint

const BLUEPRINT_PROMPT = `You are the 'Blueprint Architect' module of VentureForge AI.

**Task:** Formulate a comprehensive business model and strategic plan based on the provided research.

**INPUT:**
- research_report: {research_report}

**OUTPUT FORMAT:**
Return a JSON object with this exact structure:
{
  "coreBusinessModel": {
    "model": "Platform-as-a-Service (PaaS) / Data-as-a-Service (DaaS) / SaaS / Marketplace / etc.",
    "rationale": "Explanation why this model is optimal for the business"
  },
  "revenueStreams": [
    {
      "stream": "Revenue Stream Name",
      "type": "Subscription / One-Time / Usage-Based / Commission",
      "targetSegment": "Target customer segment",
      "illustrativePrice": "$XX/month or $XXX one-time",
      "justification": "Why this pricing makes sense"
    }
  ],
  "valuePropositions": [
    {
      "segment": "Customer Segment",
      "value": "Specific value proposition for this segment",
      "keyBenefits": ["benefit1", "benefit2", "benefit3"]
    }
  ],
  "operationalPlan": {
    "coreOperations": [
      {
        "operation": "Operation Name",
        "description": "What this operation involves",
        "resources": "Required resources",
        "scalingStrategy": "How to scale this operation"
      }
    ],
    "technologyStack": {
      "frontend": "Technology choices for frontend",
      "backend": "Backend architecture recommendations",
      "database": "Database technology and structure",
      "ai_ml": "AI/ML components and models"
    },
    "qualityControl": {
      "kpis": ["KPI 1", "KPI 2", "KPI 3"],
      "qualityMetrics": "How to measure and maintain quality",
      "scalingPlan": "Strategy for scaling operations"
    }
  },
  "goToMarketStrategy": {
    "primaryChannels": ["channel1", "channel2", "channel3"],
    "customerAcquisition": "Strategy for acquiring first customers",
    "partnerships": "Potential strategic partnerships",
    "marketingStrategy": "High-level marketing approach"
  },
  "competitiveAdvantage": {
    "dataMoat": "How data creates competitive advantage",
    "networkEffects": "Any network effects in the business",
    "switchingCosts": "Factors that create customer stickiness",
    "uniqueAssets": "Proprietary assets or capabilities"
  }
}

**Core Principles:**
- Strategic & Analytical: Focus on business model viability
- Data-Driven: Ground recommendations in research insights
- Scalable: Design for growth and expansion
- Defensible: Create sustainable competitive advantages

Generate comprehensive business blueprint now.`;

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
    if (user.credits < BLUEPRINT_COST) {
      return NextResponse.json(
        { error: "Insufficient credits", required: BLUEPRINT_COST, current: user.credits },
        { status: 402 }
      );
    }

    // Verify project ownership and get research data
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.researchOutput) {
      return NextResponse.json(
        { error: "Research must be completed before creating blueprint" },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: BLUEPRINT_PROMPT.replace("{research_report}", JSON.stringify(project.researchOutput)),
        },
        {
          role: "user",
          content: `Please create a comprehensive business blueprint based on the research data.`,
        },
      ],
      temperature: 0.7,
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
        coreBusinessModel: {
          model: "To be determined",
          rationale: aiResponse.substring(0, 200) + "..."
        },
        revenueStreams: [],
        valuePropositions: [],
        operationalPlan: {
          coreOperations: [],
          technologyStack: {
            frontend: "To be determined",
            backend: "To be determined",
            database: "To be determined",
            ai_ml: "To be determined"
          },
          qualityControl: {
            kpis: [],
            qualityMetrics: "To be defined",
            scalingPlan: "To be developed"
          }
        },
        goToMarketStrategy: {
          primaryChannels: [],
          customerAcquisition: "To be defined",
          partnerships: "To be explored",
          marketingStrategy: "To be developed"
        },
        competitiveAdvantage: {
          dataMoat: "To be established",
          networkEffects: "To be analyzed",
          switchingCosts: "To be created",
          uniqueAssets: "To be developed"
        }
      };
    }

    // Update project with the blueprint output and deduct credits
    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          blueprintOutput: parsedResponse,
          updatedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: user.credits - BLUEPRINT_COST,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      result: parsedResponse,
      creditsUsed: BLUEPRINT_COST,
      creditsRemaining: user.credits - BLUEPRINT_COST,
    });
  } catch (error) {
    console.error("Error in blueprint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}