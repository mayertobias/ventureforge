import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionStorageService } from "@/lib/session-storage";

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

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Export project data and delete from memory
    const exportedProject = SessionStorageService.exportAndDelete(projectId, user.id);

    if (!exportedProject) {
      return NextResponse.json({ error: "Project not found or expired" }, { status: 404 });
    }

    // Delete the minimal database record as well
    try {
      await prisma.project.delete({
        where: {
          id: projectId,
          userId: user.id, // Ensure user owns the project
        },
      });
    } catch (error) {
      // Project might not exist in database (memory-only), that's okay
      console.log(`Database project ${projectId} not found, but memory export completed`);
    }

    // Return the exported data for final download/processing
    const exportData = {
      projectName: exportedProject.name,
      createdAt: exportedProject.createdAt,
      exportedAt: new Date(),
      data: exportedProject.data,
      message: "Project exported and permanently deleted from all systems"
    };

    return NextResponse.json({
      success: true,
      export: exportData,
      deleted: true,
    });

  } catch (error) {
    console.error("Error in export-and-delete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}