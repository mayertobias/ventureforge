import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const GTM_COST = 10; // Credits required for go-to-market strategy

const GTM_PROMPT = `You are the 'Go-to-Market Strategist' module of VentureForge AI.

**Task:** Based on the full business plan, create a detailed and actionable Go-to-Market (GTM) strategy for the first 6 months post-launch.

**INPUT:**
- full_business_plan: {full_business_plan}

**OUTPUT FORMAT:**
Return a JSON object with this exact structure:
{
  "preLaunch": {
    "timeline": "Month -1",
    "activities": [
      {
        "activity": "Build waitlist landing page",
        "goal": "Capture 500 interested leads",
        "channels": ["Product Hunt Upcoming", "BetaList", "relevant subreddits"],
        "budget": "$X,XXX",
        "success_metrics": ["500 signups", "20% conversion rate"]
      }
    ]
  },
  "launch": {
    "timeline": "Month 1", 
    "activities": [
      {
        "activity": "Official Product Hunt launch",
        "goal": "Top 5 product of the day",
        "channels": ["Product Hunt", "tech newsletters", "personal networks"],
        "budget": "$X,XXX",
        "success_metrics": ["Top 5 ranking", "1000 visitors", "50 signups"]
      }
    ]
  },
  "contentStrategy": {
    "timeline": "Months 1-6",
    "pillarContent": [
      {
        "type": "In-depth guides",
        "frequency": "1 per month",
        "example": "The Ultimate Guide to Market Sizing for Startups",
        "distribution": ["blog posts", "Twitter threads", "LinkedIn articles"]
      }
    ],
    "contentGoals": {
      "organicTraffic": "10,000 monthly visitors by Month 6",
      "leadGeneration": "500 qualified leads per month",
      "brandAwareness": "Establish thought leadership"
    }
  },
  "customerAcquisition": {
    "timeline": "Months 1-3",
    "targetPersona": "Primary target from business plan",
    "acquisitionTactics": [
      {
        "tactic": "Direct LinkedIn outreach",
        "description": "Personalized outreach to target personas",
        "volume": "100 messages per week",
        "conversionRate": "5% to demo",
        "cost": "$500/month"
      }
    ],
    "acquisitionGoals": {
      "paidCustomers": "20 from premium plan",
      "freemiumUsers": "200 active users",
      "pipeline": "$50k ARR pipeline"
    }
  },
  "partnerships": {
    "strategicPartners": [
      {
        "type": "Integration partners",
        "examples": ["Partner 1", "Partner 2"],
        "benefit": "Mutual customer value",
        "timeline": "Month 2-3"
      }
    ],
    "channelPartners": [
      {
        "type": "Affiliate program",
        "structure": "Revenue sharing model",
        "target": "Industry consultants",
        "timeline": "Month 4-6"
      }
    ]
  },
  "marketingChannels": {
    "paidChannels": [
      {
        "channel": "Google Ads",
        "budget": "$X,XXX/month",
        "targeting": "High-intent keywords",
        "expectedROI": "X:1 after 3 months"
      }
    ],
    "organicChannels": [
      {
        "channel": "SEO Content",
        "investment": "Time + content creation",
        "timeline": "3-6 months to see results",
        "expectedTraffic": "1000 visitors/month by Month 6"
      }
    ]
  },
  "salesProcess": {
    "salesFunnel": [
      {
        "stage": "Awareness",
        "tactics": ["Content marketing", "Social media"],
        "metrics": ["Website traffic", "Social media engagement"]
      },
      {
        "stage": "Interest", 
        "tactics": ["Lead magnets", "Webinars"],
        "metrics": ["Email signups", "Demo requests"]
      },
      {
        "stage": "Decision",
        "tactics": ["Product demos", "Free trials"],
        "metrics": ["Trial-to-paid conversion", "Sales velocity"]
      }
    ],
    "salesTargets": {
      "month1": "$5k ARR",
      "month3": "$25k ARR", 
      "month6": "$75k ARR"
    }
  },
  "keyMetrics": {
    "acquisitionMetrics": {
      "CAC": "$XXX",
      "LTV": "$X,XXX",
      "paybackPeriod": "XX months"
    },
    "engagementMetrics": {
      "DAU": "XXX users",
      "retention": "XX% monthly",
      "NPS": "XX+"
    },
    "revenueMetrics": {
      "MRR": "$XX,XXX by Month 6",
      "ARR": "$XXX,XXX by Month 6",
      "churnRate": "X% monthly"
    }
  }
}

**Core Principles:**
- Actionable: Provide specific tactics and timelines
- Measurable: Include clear success metrics
- Resource-Conscious: Consider budget and team constraints
- Market-Driven: Align with target customer behavior

Generate comprehensive 6-month GTM strategy now.`;

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

    // Combine all previous outputs for context
    const fullBusinessPlan = {
      idea: project.ideaOutput,
      research: project.researchOutput,
      blueprint: project.blueprintOutput,
      financials: project.financialOutput,
      pitch: project.pitchOutput
    };

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: GTM_PROMPT.replace("{full_business_plan}", JSON.stringify(fullBusinessPlan)),
        },
        {
          role: "user",
          content: `Please create a comprehensive 6-month go-to-market strategy based on the complete business plan.`,
        },
      ],
      temperature: 0.7,
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
        preLaunch: {
          timeline: "Month -1",
          activities: [{
            activity: "Pre-launch preparation",
            goal: "Build awareness and waitlist",
            channels: ["To be determined"],
            budget: "To be allocated",
            success_metrics: ["To be defined"]
          }]
        },
        launch: {
          timeline: "Month 1",
          activities: [{
            activity: "Product launch",
            goal: "Market entry and initial traction",
            channels: ["To be determined"],
            budget: "To be allocated", 
            success_metrics: ["To be defined"]
          }]
        },
        contentStrategy: {
          timeline: "Months 1-6",
          pillarContent: [],
          contentGoals: {
            organicTraffic: "To be targeted",
            leadGeneration: "To be planned",
            brandAwareness: "To be established"
          }
        },
        customerAcquisition: {
          timeline: "Months 1-3",
          targetPersona: "To be defined from research",
          acquisitionTactics: [],
          acquisitionGoals: {
            paidCustomers: "To be targeted",
            freemiumUsers: "To be planned",
            pipeline: "To be projected"
          }
        },
        partnerships: {
          strategicPartners: [],
          channelPartners: []
        },
        marketingChannels: {
          paidChannels: [],
          organicChannels: []
        },
        salesProcess: {
          salesFunnel: [],
          salesTargets: {
            month1: "To be set",
            month3: "To be targeted",
            month6: "To be achieved"
          }
        },
        keyMetrics: {
          acquisitionMetrics: {
            CAC: "To be calculated",
            LTV: "To be determined",
            paybackPeriod: "To be estimated"
          },
          engagementMetrics: {
            DAU: "To be tracked",
            retention: "To be measured",
            NPS: "To be surveyed"
          },
          revenueMetrics: {
            MRR: "To be built",
            ARR: "To be achieved",
            churnRate: "To be minimized"
          }
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