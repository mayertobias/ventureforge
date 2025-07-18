import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const GTM_COST = 10; // Credits required for go-to-market strategy

const GTM_PROMPT = `Create a 6-month Go-to-Market strategy JSON based on: {full_business_plan}

Return JSON with this structure:
{
  "launchTimeline": {
    "month1": "Launch activities and goals",
    "month3": "Growth milestones", 
    "month6": "Scale targets"
  },
  "customerAcquisition": {
    "targetPersona": "Primary customer segment",
    "acquisitionTactics": ["Tactic 1", "Tactic 2", "Tactic 3"],
    "acquisitionGoals": {
      "paidCustomers": "Number target",
      "pipeline": "Revenue target"
    }
  },
  "marketingChannels": {
    "paidChannels": [{"channel": "Name", "budget": "$X/month", "expectedROI": "X:1"}],
    "organicChannels": [{"channel": "Name", "investment": "Resource", "expectedTraffic": "Volume"}]
  },
  "salesTargets": {
    "month1": "$X ARR",
    "month3": "$X ARR",
    "month6": "$X ARR"
  },
  "keyMetrics": {
    "CAC": "$X",
    "LTV": "$X", 
    "MRR": "$X by Month 6"
  },
  "budgetAllocation": {
    "totalBudget": "$X for 6 months",
    "channelAllocation": "Budget breakdown by channel"
  }
}

Make it actionable with specific tactics, metrics, and realistic targets.`;

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
    if (user.credits < GTM_COST) {
      return NextResponse.json(
        { error: "Insufficient credits", required: GTM_COST, current: user.credits },
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

    if (!project.pitchOutput) {
      return NextResponse.json(
        { error: "Investor pitch must be completed before GTM strategy" },
        { status: 400 }
      );
    }

    // Create a summarized business context to reduce token usage
    const ideaOutput = project.ideaOutput as any;
    const researchOutput = project.researchOutput as any;
    const blueprintOutput = project.blueprintOutput as any;
    const financialOutput = project.financialOutput as any;
    const pitchOutput = project.pitchOutput as any;
    
    const businessContext = {
      businessIdea: ideaOutput?.selectedIdea?.title || "Business concept",
      targetMarket: researchOutput?.targetCustomerAnalysis?.primarySegment || "Target market TBD",
      valueProposition: blueprintOutput?.valueProposition?.core || "Value prop TBD",
      revenueModel: blueprintOutput?.revenueStreams?.primary || "Revenue model TBD",
      fundingNeeds: financialOutput?.fundingAnalysis?.seedFunding || "Funding TBD",
      targetCustomers: pitchOutput?.marketOpportunity?.targetCustomer || "Customers TBD"
    };

    // Call OpenAI API with reduced context
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: GTM_PROMPT.replace("{full_business_plan}", JSON.stringify(businessContext)),
        },
        {
          role: "user",
          content: `Create a 6-month go-to-market strategy for: ${businessContext.businessIdea}. Target: ${businessContext.targetCustomers}. Value: ${businessContext.valueProposition}.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500, // Reduced from 4000 to stay within limits
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
      // If JSON parsing fails, create a simplified fallback response
      parsedResponse = {
        launchTimeline: {
          month1: "Product launch and initial marketing campaigns",
          month3: "Growth optimization and expansion", 
          month6: "Scale operations and partnership development"
        },
        customerAcquisition: {
          targetPersona: businessContext.targetCustomers || "Primary customer segment",
          acquisitionTactics: ["Content marketing", "Social media outreach", "Direct sales"],
          acquisitionGoals: {
            paidCustomers: "50 customers",
            pipeline: "$100k ARR pipeline"
          }
        },
        marketingChannels: {
          paidChannels: [{"channel": "Google Ads", "budget": "$2,000/month", "expectedROI": "3:1"}],
          organicChannels: [{"channel": "SEO Content", "investment": "Time + content creation", "expectedTraffic": "1,000 visitors/month"}]
        },
        salesTargets: {
          month1: "$5k ARR",
          month3: "$25k ARR",
          month6: "$75k ARR"
        },
        keyMetrics: {
          CAC: "$200",
          LTV: "$1,200", 
          MRR: "$6,250 by Month 6"
        },
        budgetAllocation: {
          totalBudget: "$30,000 for 6 months",
          channelAllocation: "Marketing: 60%, Sales: 25%, Product: 15%"
        }
      };
    }

    // Update project with the GTM output and deduct credits
    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          gtmOutput: parsedResponse,
          updatedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: user.credits - GTM_COST,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      result: parsedResponse,
      creditsUsed: GTM_COST,
      creditsRemaining: user.credits - GTM_COST,
    });
  } catch (error) {
    console.error("Error in GTM:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}