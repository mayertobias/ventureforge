import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { SessionStorageService } from "@/lib/session-storage";
import { UsageTrackingService } from "@/lib/usage-tracking";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const RESEARCH_COST = 8; // Credits required for deep research (legacy route - being phased out)

const RESEARCH_PROMPT = `You are the 'Deep Dive Research' module of VentureForge AI (Legacy Route).

**PRIVACY NOTE:** This is a legacy research route that is being phased out in favor of research-gemini for better privacy compliance.

**Task:** Conduct exhaustive, data-backed research on the selected business idea. Synthesize information and provide comprehensive market analysis.

**INPUT:**
- selected_idea: {selected_idea}

**OUTPUT FORMAT:**
Return a JSON object with this exact structure:
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

Conduct comprehensive research analysis now.`;

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

    // Check if user has enough credits using tracking service
    const hasCredits = await UsageTrackingService.checkCredits(user.id, RESEARCH_COST);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits", required: RESEARCH_COST, current: user.credits },
        { status: 402 }
      );
    }

    // Verify project exists in database and user owns it
    const dbProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!dbProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if project has expired
    if (dbProject.expiresAt && dbProject.expiresAt < new Date()) {
      return NextResponse.json({ error: "Project has expired" }, { status: 404 });
    }

    // Get or create session storage for this project
    let sessionProject = await SessionStorageService.getProjectSession(projectId, user.id);
    if (!sessionProject) {
      await SessionStorageService.createProjectSession(
        user.id,
        dbProject.name,
        dbProject.storageMode === 'PERSISTENT',
        dbProject.expiresAt || undefined,
        dbProject.id
      );
      sessionProject = await SessionStorageService.getProjectSession(projectId, user.id);
    }

    if (!sessionProject) {
      return NextResponse.json({ error: "Failed to initialize project session" }, { status: 500 });
    }

    // Call OpenAI API with faster model and reduced tokens to avoid timeout
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Faster model
      messages: [
        {
          role: "system",
          content: RESEARCH_PROMPT.replace("{selected_idea}", JSON.stringify(selectedIdea)),
        },
        {
          role: "user",
          content: `Please conduct comprehensive market research for this business idea: ${JSON.stringify(selectedIdea)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000, // Reduced tokens
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
        marketLandscape: {
          totalAddressableMarket: "To be determined",
          serviceableAddressableMarket: "To be determined",
          marketGrowthRate: "To be analyzed",
          keyDrivers: ["Market analysis in progress"]
        },
        targetSegments: [{
          segment: "Primary Target",
          size: "To be determined",
          characteristics: aiResponse.substring(0, 200) + "...",
          painPoints: ["Analysis in progress"]
        }],
        competitiveLandscape: {
          directCompetitors: [],
          indirectCompetitors: [],
          competitiveGap: "Detailed analysis required"
        },
        keyTrends: [],
        technologyAnalysis: {
          requiredTechnologies: [],
          implementationComplexity: "To be determined",
          technologyTrends: "Analysis pending"
        },
        riskFactors: []
      };
    }

    // Store research output in session memory (respects privacy preferences)
    console.log(`[RESEARCH-LEGACY] Storing data for project ${projectId}, user ${user.id}`);
    console.log(`[RESEARCH-LEGACY] Data to store:`, parsedResponse);
    
    const updateSuccess = await SessionStorageService.updateProjectData(
      projectId,
      user.id,
      'researchOutput',
      parsedResponse
    );

    console.log(`[RESEARCH-LEGACY] Update success:`, updateSuccess);
    if (!updateSuccess) {
      console.error(`[RESEARCH-LEGACY] Failed to update session data`);
      return NextResponse.json({ error: "Failed to update project data" }, { status: 500 });
    }
    
    // Verify the data was stored correctly
    const verifySession = await SessionStorageService.getProjectSession(projectId, user.id);
    console.log(`[RESEARCH-LEGACY] Verification - session exists:`, !!verifySession);
    if (verifySession) {
      console.log(`[RESEARCH-LEGACY] Verification - researchOutput stored:`, !!verifySession.data.researchOutput);
    }

    // Track usage and deduct credits
    await UsageTrackingService.trackUsage({
      userId: user.id,
      action: 'RESEARCH',
      creditsUsed: RESEARCH_COST,
      projectId: projectId,
      projectName: sessionProject.name,
      metadata: {
        aiModel: 'gpt-4o-mini',
        selectedIdea: selectedIdea?.title || 'Unknown',
        routeType: 'legacy'
      }
    });

    return NextResponse.json({
      success: true,
      output: parsedResponse,
      creditsUsed: RESEARCH_COST,
      creditsRemaining: user.credits - RESEARCH_COST,
    });
  } catch (error) {
    console.error("Error in research:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}