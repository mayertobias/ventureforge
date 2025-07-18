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

    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create session-based project (no database storage for privacy)
    const sessionProjectId = SessionStorageService.createProjectSession(user.id, name.trim());

    // Create minimal database record for project listing (no sensitive data)
    const project = await prisma.project.create({
      data: {
        id: sessionProjectId, // Use session ID as project ID
        name: name.trim(),
        userId: user.id,
        // All output fields will remain null - data stored in session only
      },
    });

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

    // Get session-based projects (active memory only)
    const sessionProjects = SessionStorageService.getUserProjectSessions(user.id);
    
    // Convert to expected format
    const projects = sessionProjects.map(sessionProject => ({
      id: sessionProject.id,
      name: sessionProject.name,
      createdAt: sessionProject.createdAt.toISOString(),
      userId: sessionProject.userId,
      // Include session data for compatibility
      ideaOutput: sessionProject.data.ideaOutput,
      researchOutput: sessionProject.data.researchOutput,
      blueprintOutput: sessionProject.data.blueprintOutput,
      financialOutput: sessionProject.data.financialOutput,
      pitchOutput: sessionProject.data.pitchOutput,
      gtmOutput: sessionProject.data.gtmOutput,
    }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}