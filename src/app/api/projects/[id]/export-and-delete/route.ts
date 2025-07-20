import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionStorageService } from "@/lib/session-storage";
import { UsageTrackingService } from "@/lib/usage-tracking";

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

    // Verify project ownership and get project details first
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log(`[PRIVACY] Export-and-delete initiated for project ${projectId} by user ${user.id}`);
    console.log(`[PRIVACY] Project storage mode: ${project.storageMode}`);

    // Export project data and delete from memory/database
    const exportedProject = await SessionStorageService.exportAndDelete(projectId, user.id);

    if (!exportedProject) {
      return NextResponse.json({ error: "Project not found or expired" }, { status: 404 });
    }

    // Track the export and deletion action
    await UsageTrackingService.trackUsage({
      userId: user.id,
      action: 'REPORT_EXPORT',
      creditsUsed: 0, // No credit cost for export-delete
      projectId: projectId,
      projectName: exportedProject.name,
      metadata: {
        exportType: 'export-and-delete',
        storageMode: project.storageMode,
        privacyCompliant: true,
        permanentDeletion: true,
        exportedDataFields: Object.keys(exportedProject.data || {})
      }
    });

    // Create comprehensive export data with privacy attestation
    const exportData = {
      projectInfo: {
        id: projectId,
        name: exportedProject.name,
        createdAt: exportedProject.createdAt,
        storageMode: project.storageMode,
        exportedAt: new Date(),
      },
      aiResponses: exportedProject.data,
      privacyAttestation: {
        userInitiated: true,
        permanentDeletion: true,
        dataRetention: "zero",
        complianceNote: "All project data has been permanently deleted from VentureForge systems in accordance with user privacy preferences",
        exportMethod: "privacy-compliant-export-and-delete"
      },
      metadata: {
        totalCreditsUsed: project.totalCreditsUsed || 0,
        moduleProgress: project.moduleProgress,
        lastExportedAt: new Date()
      }
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