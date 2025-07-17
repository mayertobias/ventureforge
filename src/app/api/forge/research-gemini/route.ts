import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { geminiModel } from "@/lib/gemini";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const RESEARCH_COST = 5; // Reduced cost for Gemini (more efficient)

const RESEARCH_PROMPT = `You are the 'Deep Dive Research' module of VentureForge AI.

**Task:** Conduct exhaustive, data-backed research on the selected business idea. Synthesize information and provide comprehensive market analysis.

**INPUT:**
- selected_idea: {selected_idea}

**OUTPUT FORMAT:**
Return a valid JSON object with this exact structure:
{
  "marketLandscape": {
    "totalAddressableMarket": "$X.X Billion",
    "serviceableAddressableMarket": "$X.X Million",
    "marketGrowthRate": "X% CAGR",
    "keyDrivers": ["driver1", "driver2", "driver3"]
  },
  "targetSegments": [
    {
      "segment": "Primary Target Segment",
      "size": "$XX Million",
      "characteristics": "Key demographics and behaviors",
      "painPoints": ["pain1", "pain2", "pain3"]
    }
  ],
  "competitiveLandscape": {
    "directCompetitors": [
      {
        "name": "Competitor Name",
        "strength": "Key competitive advantage",
        "weakness": "Notable limitation",
        "marketShare": "X%"
      }
    ],
    "indirectCompetitors": ["alternative1", "alternative2"],
    "competitiveGap": "Key opportunity in the market"
  },
  "keyTrends": [
    {
      "trend": "Trend Name",
      "impact": "High/Medium/Low",
      "description": "How this trend affects the market"
    }
  ],
  "technologyAnalysis": {
    "requiredTechnologies": ["tech1", "tech2", "tech3"],
    "implementationComplexity": "High/Medium/Low",
    "technologyTrends": "Relevant technological developments"
  },
  "riskFactors": [
    {
      "risk": "Risk Name",
      "severity": "High/Medium/Low",
      "mitigation": "Proposed mitigation strategy"
    }
  ]
}

**Core Principles:**
- Data-Backed & Non-Hallucinatory: Ground all analysis in realistic market data
- Professional & Analytical Tone: Maintain expertise and objectivity
- Comprehensive Coverage: Address all key aspects of market analysis
- Actionable Insights: Provide strategic implications for each finding

Conduct comprehensive research analysis now. Return ONLY the JSON object, no additional text.`;

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