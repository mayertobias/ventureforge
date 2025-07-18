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

    // Get session-based project data
    const sessionProject = SessionStorageService.getProjectSession(projectId, user.id);

    if (!sessionProject) {
      return NextResponse.json({ error: "Project not found or expired" }, { status: 404 });
    }

    // Convert session data to expected project format
    const project = {
      id: sessionProject.id,
      name: sessionProject.name,
      createdAt: sessionProject.createdAt.toISOString(),
      updatedAt: sessionProject.lastAccessed.toISOString(),
      userId: sessionProject.userId,
      ideaOutput: sessionProject.data.ideaOutput,
      researchOutput: sessionProject.data.researchOutput,
      blueprintOutput: sessionProject.data.blueprintOutput,
      financialOutput: sessionProject.data.financialOutput,
      pitchOutput: sessionProject.data.pitchOutput,
      gtmOutput: sessionProject.data.gtmOutput,
    };

    // Extend session when user accesses the project
    SessionStorageService.extendSession(projectId, user.id, 2);

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}