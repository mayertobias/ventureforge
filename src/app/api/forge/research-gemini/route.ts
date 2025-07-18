import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { geminiModel } from "@/lib/gemini";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const RESEARCH_COST = 5; // Reduced cost for Gemini (more efficient)

const RESEARCH_PROMPT = `You are the 'Deep Dive Research' module of VentureForge AI, an elite business intelligence system.

**CRITICAL REQUIREMENT:** This research will be used by real entrepreneurs and investors making actual business decisions. Provide exhaustive, professional-grade analysis with specific data, citations, and actionable insights. Generic or superficial content is unacceptable.

**TASK:** Conduct comprehensive market research and competitive analysis on the business idea: {selected_idea}

**RESEARCH METHODOLOGY:**
1. Market Sizing: Use bottom-up and top-down approaches with specific data sources
2. Competitive Analysis: Identify actual companies, their financials, and market positions
3. Customer Research: Detail specific personas, segments, and quantified pain points
4. Technology Assessment: Evaluate implementation complexity and required capabilities
5. Financial Benchmarks: Provide industry-specific metrics and benchmarks

**OUTPUT FORMAT - COMPREHENSIVE JSON:**
{
  "marketLandscape": {
    "totalAddressableMarket": "Specific $ amount with methodology (e.g., $12.3B based on X million potential customers × $Y average spend)",
    "serviceableAddressableMarket": "Realistic SAM with geographic/demographic constraints",
    "marketGrowthRate": "X.X% CAGR with time period and driving factors",
    "keyTrends": "Detailed analysis of 3-4 major trends reshaping the industry",
    "marketMaturity": "Stage of market development with implications",
    "seasonality": "Any seasonal patterns affecting demand"
  },
  "targetCustomerAnalysis": {
    "primarySegment": "Detailed description of ideal customer profile",
    "customerPainPoints": ["Specific, quantified pain points with evidence"],
    "buyingBehavior": "How customers currently solve this problem and decision-making process",
    "customerAcquisitionCost": "Industry benchmarks for CAC in this sector",
    "lifetimeValue": "Expected LTV based on similar business models",
    "segmentSize": "Number of potential customers in primary segment"
  },
  "competitiveLandscape": {
    "mainCompetitors": ["List of 5-7 specific companies competing directly"],
    "competitiveGap": "Detailed analysis of unmet needs and positioning opportunities",
    "competitiveAdvantages": ["Specific advantages this business could develop"],
    "threatLevel": "Assessment of competitive intensity and barriers to entry",
    "marketPosition": "Recommended positioning strategy based on competitive gaps"
  },
  "technologyAnalysis": {
    "requiredTechnologies": ["Specific technologies needed for implementation"],
    "implementationComplexity": "Detailed assessment of technical challenges",
    "developmentTimeline": "Realistic timeline for MVP and full product development",
    "technologyTrends": "Emerging technologies that could impact the business",
    "technicalRisks": "Key technology risks and mitigation strategies"
  },
  "regulatoryConsiderations": {
    "relevantRegulations": ["Specific regulations, licenses, or compliance requirements"],
    "complianceRequirements": "Detailed compliance obligations and costs",
    "regulatoryTrends": "Upcoming regulatory changes that could impact the business"
  },
  "financialBenchmarks": {
    "industryMetrics": "Key financial metrics for similar businesses (gross margins, churn rates, etc.)",
    "revenueModels": "Analysis of successful revenue models in this space",
    "pricingStrategies": "Pricing benchmarks and strategies used by competitors",
    "unitEconomics": "Industry benchmarks for unit economics"
  }
}

**QUALITY STANDARDS:**
- Include specific company names, market sizes, and financial figures where relevant
- Provide reasoning and methodology for all quantitative estimates
- Reference industry reports, market studies, or comparable business metrics
- Focus on actionable insights that inform business strategy
- Maintain objectivity while highlighting opportunities

Generate comprehensive, professional-grade market research now. Return ONLY the JSON object.`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, selectedIdea } = await request.json();

    if (!projectId || !selectedIdea) {
      return NextResponse.json(
        { error: "Project ID and selected idea are required" },
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
    if (user.credits < RESEARCH_COST) {
      return NextResponse.json(
        { error: "Insufficient credits", required: RESEARCH_COST, current: user.credits },
        { status: 402 }
      );
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create the research prompt
    const prompt = RESEARCH_PROMPT.replace("{selected_idea}", JSON.stringify(selectedIdea));
    const userPrompt = `Please conduct comprehensive market research for this business idea: ${JSON.stringify(selectedIdea)}

Focus on providing realistic, data-backed insights about:
1. Market size and growth potential
2. Target customer segments and their pain points
3. Competitive landscape and positioning opportunities
4. Technology requirements and implementation complexity
5. Key market trends and risk factors

Return the response as a properly formatted JSON object.`;

    // Call Gemini API with timeout handling
    const result = await Promise.race([
      geminiModel.generateContent([prompt, userPrompt]),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timeout")), 280000) // 4 minutes 40 seconds
      )
    ]) as any;

    const response = result.response;
    const aiResponse = response.text();
    
    if (!aiResponse) {
      throw new Error("No response from Gemini AI");
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", aiResponse);
      
      // If JSON parsing fails, create a structured response
      parsedResponse = {
        marketLandscape: {
          totalAddressableMarket: "Analysis in progress",
          serviceableAddressableMarket: "To be determined",
          marketGrowthRate: "Research ongoing",
          keyDrivers: ["Market analysis in progress"]
        },
        targetSegments: [{
          segment: "Primary Target Segment",
          size: "To be determined",
          characteristics: aiResponse.substring(0, 300) + "...",
          painPoints: ["Analysis in progress"]
        }],
        competitiveLandscape: {
          directCompetitors: [],
          indirectCompetitors: [],
          competitiveGap: "Detailed analysis required"
        },
        keyTrends: [{
          trend: "Market Research",
          impact: "High",
          description: "Comprehensive analysis in progress"
        }],
        technologyAnalysis: {
          requiredTechnologies: ["To be determined"],
          implementationComplexity: "Medium",
          technologyTrends: "Analysis pending"
        },
        riskFactors: [{
          risk: "Market Analysis",
          severity: "Medium",
          mitigation: "Detailed research required"
        }]
      };
    }

    // Update project with the research output and deduct credits
    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          researchOutput: parsedResponse,
          updatedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: user.credits - RESEARCH_COST,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      result: parsedResponse,
      creditsUsed: RESEARCH_COST,
      creditsRemaining: user.credits - RESEARCH_COST,
    });
  } catch (error) {
    console.error("Error in Gemini research:", error);
    
    if (error instanceof Error && error.message === "Request timeout") {
      return NextResponse.json(
        { error: "Research request timed out. Please try again with a simpler query." },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}