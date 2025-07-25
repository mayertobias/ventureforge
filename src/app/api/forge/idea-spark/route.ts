import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { SessionStorageService } from "@/lib/session-storage";
import { UsageTrackingService } from "@/lib/usage-tracking";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const IDEA_SPARK_COST = 5; // Credits required for idea generation

const IDEA_SPARK_PROMPT = `You are the 'Idea Spark' module of VentureForge AI. 

**Task:** Generate 3 unique and viable business ideas based on the user's input. For each idea, provide a concise analysis covering its core concept, target niche, uniqueness, and potential revenue model.

**INPUT:**
- user_parameters: {user_input}

**OUTPUT FORMAT:**
Return a JSON object with this exact structure:
{
  "ideas": [
    {
      "title": "Idea Title",
      "concept": "Brief explanation of the idea",
      "targetNiche": "Describe the specific, underserved market",
      "uniquenessScore": 8,
      "uniquenessReason": "Justify why it stands out",
      "revenueModel": "e.g., SaaS, DaaS, Marketplace, Affiliate"
    }
  ]
}

**Core Principles:**
- Data-Backed & Non-Hallucinatory: Ground all suggestions in realistic market opportunities
- Professional & Analytical Tone: Maintain expertise and objectivity
- Focus on Uniqueness: Avoid common, oversaturated business ideas
- Scalability: Prioritize ideas with growth potential

Generate exactly 3 unique business ideas now.`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, userInput } = await request.json();

    if (!projectId || !userInput) {
      return NextResponse.json(
        { error: "Project ID and user input are required" },
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
    const hasCredits = await UsageTrackingService.checkCredits(user.id, IDEA_SPARK_COST);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits", required: IDEA_SPARK_COST, current: user.credits },
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

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: IDEA_SPARK_PROMPT.replace("{user_input}", userInput),
        },
        {
          role: "user",
          content: `Please generate 3 unique business ideas based on this input: ${userInput}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
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
        ideas: [
          {
            title: "AI-Generated Business Idea",
            concept: aiResponse.substring(0, 200) + "...",
            targetNiche: "To be defined",
            uniquenessScore: 7,
            uniquenessReason: "Generated based on user input",
            revenueModel: "To be determined"
          }
        ]
      };
    }

    // Store idea output in session memory (no database persistence for privacy)
    const updateSuccess = await SessionStorageService.updateProjectData(
      projectId,
      user.id,
      'ideaOutput',
      parsedResponse
    );

    if (!updateSuccess) {
      return NextResponse.json({ error: "Failed to update project data" }, { status: 500 });
    }

    // Track usage and deduct credits
    await UsageTrackingService.trackUsage({
      userId: user.id,
      action: 'IDEA_GENERATION',
      creditsUsed: IDEA_SPARK_COST,
      projectId: projectId,
      projectName: sessionProject.name,
      metadata: {
        aiModel: 'gpt-4',
        inputLength: userInput.length,
        ideaCount: parsedResponse.ideas?.length || 0
      }
    });

    return NextResponse.json({
      success: true,
      output: parsedResponse, // Change 'result' to 'output' to match client expectations
      creditsUsed: IDEA_SPARK_COST,
      creditsRemaining: user.credits - IDEA_SPARK_COST,
    });
  } catch (error) {
    console.error("Error in idea-spark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}