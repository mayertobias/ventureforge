import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionStorageService } from "@/lib/session-storage";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, persistentStorage } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine storage mode based on user preference and request
    const shouldUsePersistentStorage = persistentStorage && user.allowPersistentStorage;
    const storageMode = shouldUsePersistentStorage ? 'PERSISTENT' : 'MEMORY_ONLY';

    // Create database record first to get proper ID
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        userId: user.id,
        storageMode: storageMode as any,
        expiresAt: shouldUsePersistentStorage ? null : new Date(Date.now() + 24 * 60 * 60 * 1000),
        // Content fields remain null - populated based on storage mode
      },
    });

    // Create session-based storage using the database project ID
    SessionStorageService.createProjectSession(
      user.id, 
      name.trim(),
      shouldUsePersistentStorage,
      project.expiresAt || undefined,
      project.id // Use the database project ID
    );

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get database projects and merge with session data
    const dbProjects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    // Convert to expected format, merging with session data
    const projects = await Promise.all(dbProjects.map(async (dbProject) => {
      const sessionProject = await SessionStorageService.getProjectSession(dbProject.id, user.id);
      
      return {
        id: dbProject.id,
        name: dbProject.name,
        createdAt: dbProject.createdAt.toISOString(),
        updatedAt: dbProject.updatedAt.toISOString(),
        userId: dbProject.userId,
        storageMode: dbProject.storageMode,
        expiresAt: dbProject.expiresAt?.toISOString(),
        // Use session data if available, otherwise database data
        ideaOutput: sessionProject?.data.ideaOutput || dbProject.ideaOutput,
        researchOutput: sessionProject?.data.researchOutput || dbProject.researchOutput,
        blueprintOutput: sessionProject?.data.blueprintOutput || dbProject.blueprintOutput,
        financialOutput: sessionProject?.data.financialOutput || dbProject.financialOutput,
        pitchOutput: sessionProject?.data.pitchOutput || dbProject.pitchOutput,
        gtmOutput: sessionProject?.data.gtmOutput || dbProject.gtmOutput,
      };
    }));

    // Filter out expired memory-only projects
    const filteredProjects = projects.filter(project => {
      if (project.storageMode === 'MEMORY_ONLY' && project.expiresAt) {
        return new Date(project.expiresAt) > new Date();
      }
      return true;
    });

    return NextResponse.json({ projects: filteredProjects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}