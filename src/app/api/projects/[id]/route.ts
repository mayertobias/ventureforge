import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionStorageService } from "@/lib/session-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get database project first
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

    // Get session data if available
    const sessionProject = SessionStorageService.getProjectSession(projectId, user.id);
    console.log(`[PROJECT_FETCH] Project ID: ${projectId}, User ID: ${user.id}`);
    console.log(`[PROJECT_FETCH] Session found:`, !!sessionProject);
    if (sessionProject) {
      console.log(`[PROJECT_FETCH] Session data keys:`, Object.keys(sessionProject.data));
      console.log(`[PROJECT_FETCH] ideaOutput exists:`, !!sessionProject.data.ideaOutput);
      console.log(`[PROJECT_FETCH] researchOutput exists:`, !!sessionProject.data.researchOutput);
      if (sessionProject.data.researchOutput) {
        console.log(`[PROJECT_FETCH] researchOutput structure:`, sessionProject.data.researchOutput);
      }
    }

    // Convert to expected project format, prioritizing session data
    const project = {
      id: dbProject.id,
      name: dbProject.name,
      createdAt: dbProject.createdAt.toISOString(),
      updatedAt: dbProject.updatedAt.toISOString(),
      userId: dbProject.userId,
      storageMode: dbProject.storageMode,
      expiresAt: dbProject.expiresAt?.toISOString(),
      // Use session data if available, otherwise database data (for persistent projects)
      ideaOutput: sessionProject?.data.ideaOutput || dbProject.ideaOutput,
      researchOutput: sessionProject?.data.researchOutput || dbProject.researchOutput,
      blueprintOutput: sessionProject?.data.blueprintOutput || dbProject.blueprintOutput,
      financialOutput: sessionProject?.data.financialOutput || dbProject.financialOutput,
      pitchOutput: sessionProject?.data.pitchOutput || dbProject.pitchOutput,
      gtmOutput: sessionProject?.data.gtmOutput || dbProject.gtmOutput,
    };

    console.log(`[PROJECT_FETCH] Final project researchOutput:`, project.researchOutput);

    // Extend session when user accesses the project (if session exists)
    if (sessionProject) {
      SessionStorageService.extendSession(projectId, user.id, 2);
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}