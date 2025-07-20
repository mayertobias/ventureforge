import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;
    const requestBody = await request.json();
    const { projectData } = requestBody;

    if (!projectData) {
      return NextResponse.json({ error: "Project data is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the project exists and belongs to the user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
        storageMode: 'MEMORY_ONLY', // Only allow upgrading memory-only projects
      },
    });

    if (!project) {
      return NextResponse.json({ 
        error: "Project not found or not eligible for upgrade" 
      }, { status: 404 });
    }

    // Update the project to PERSISTENT mode and save the data
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        storageMode: 'PERSISTENT',
        ideaOutput: projectData.ideaOutput,
        researchOutput: projectData.researchOutput,
        blueprintOutput: projectData.blueprintOutput,
        financialOutput: projectData.financialOutput,
        pitchOutput: projectData.pitchOutput,
        gtmOutput: projectData.gtmOutput,
        expiresAt: null, // Remove expiration for persistent projects
      },
    });

    // Clean up any temporary session storage for this project
    await prisma.temporarySessionStorage.deleteMany({
      where: {
        projectId: projectId,
        userId: user.id,
      },
    });

    console.log(`[STORAGE_UPGRADE] Successfully upgraded project ${projectId} to persistent storage`);

    return NextResponse.json({ 
      success: true,
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        storageMode: updatedProject.storageMode,
        updatedAt: updatedProject.updatedAt.toISOString(),
      }
    });

  } catch (error) {
    console.error("Error upgrading project storage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}