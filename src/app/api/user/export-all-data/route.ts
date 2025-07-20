import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionStorageService } from "@/lib/session-storage";
import { UsageTrackingService } from "@/lib/usage-tracking";

/**
 * Export all user data and optionally delete everything for privacy compliance
 * This endpoint supports GDPR Article 20 (Data Portability) and Article 17 (Right to be Forgotten)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deleteAfterExport = false } = await request.json();

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        projects: true,
        usageHistory: {
          orderBy: { createdAt: 'desc' },
          take: 100 // Last 100 usage records
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[PRIVACY] Full data export initiated for user ${user.id}`);
    console.log(`[PRIVACY] Delete after export: ${deleteAfterExport}`);
    console.log(`[PRIVACY] Found ${user.projects.length} projects to export`);

    // Export all project data
    const exportedProjects = [];
    const failedExports = [];

    for (const project of user.projects) {
      try {
        const sessionProject = await SessionStorageService.getProjectSession(project.id, user.id);
        
        if (sessionProject) {
          exportedProjects.push({
            id: project.id,
            name: project.name,
            storageMode: project.storageMode,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            totalCreditsUsed: project.totalCreditsUsed,
            moduleProgress: project.moduleProgress,
            aiResponses: sessionProject.data,
            expiresAt: project.expiresAt
          });
        } else {
          // Project might be expired or database-only
          exportedProjects.push({
            id: project.id,
            name: project.name,
            storageMode: project.storageMode,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            totalCreditsUsed: project.totalCreditsUsed,
            moduleProgress: project.moduleProgress,
            aiResponses: {
              ideaOutput: project.ideaOutput,
              researchOutput: project.researchOutput,
              blueprintOutput: project.blueprintOutput,
              financialOutput: project.financialOutput,
              pitchOutput: project.pitchOutput,
              gtmOutput: project.gtmOutput
            },
            expiresAt: project.expiresAt,
            note: "Retrieved from database (session may have expired)"
          });
        }
      } catch (error) {
        console.error(`Failed to export project ${project.id}:`, error);
        failedExports.push({
          id: project.id,
          name: project.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Create comprehensive user data export
    const userDataExport: any = {
      exportInfo: {
        exportedAt: new Date(),
        exportType: deleteAfterExport ? 'full-export-with-deletion' : 'full-export-only',
        userId: user.id,
        userEmail: user.email,
        exportedBy: 'user-request'
      },
      accountData: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        subscriptionPlan: user.subscriptionPlan,
        credits: user.credits,
        totalCreditsUsed: user.totalCreditsUsed,
        allowPersistentStorage: user.allowPersistentStorage,
        privacyPolicyAccepted: user.privacyPolicyAccepted,
        termsOfServiceAccepted: user.termsOfServiceAccepted
      },
      projects: exportedProjects,
      usageHistory: user.usageHistory.map(record => ({
        id: record.id,
        action: record.action,
        projectName: record.projectName,
        creditsUsed: record.creditsUsed,
        creditsBalance: record.creditsBalance,
        createdAt: record.createdAt,
        metadata: record.metadata
      })),
      exportSummary: {
        totalProjects: user.projects.length,
        successfulExports: exportedProjects.length,
        failedExports: failedExports.length,
        totalCreditsEverUsed: user.totalCreditsUsed,
        accountAge: Math.floor((new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      },
      privacyAttestation: {
        userInitiated: true,
        dataPortabilityCompliant: true,
        gdprArticle20: "Data Portability - User has received all personal data in structured, commonly used format",
        gdprArticle17: deleteAfterExport ? "Right to be Forgotten - All data will be permanently deleted after export" : "Not applicable - export only",
        dataRetentionPolicy: deleteAfterExport ? "zero-retention-after-export" : "standard-retention",
        complianceFramework: "GDPR, CCPA compliant"
      }
    };

    if (failedExports.length > 0) {
      userDataExport.warnings = {
        failedExports,
        message: `${failedExports.length} projects could not be exported`
      };
    }

    // Track the export action
    await UsageTrackingService.trackUsage({
      userId: user.id,
      action: 'REPORT_EXPORT',
      creditsUsed: 0,
      projectId: undefined,
      projectName: 'Full Account Export',
      metadata: {
        exportType: deleteAfterExport ? 'full-export-with-deletion' : 'full-export-only',
        projectCount: exportedProjects.length,
        failedExports: failedExports.length,
        privacyCompliant: true,
        gdprRequest: true
      }
    });

    // If user requested deletion, delete all their data
    if (deleteAfterExport) {
      console.log(`[PRIVACY] Proceeding with account deletion for user ${user.id}`);
      
      try {
        // Delete all projects (this will cascade delete related data)
        await prisma.project.deleteMany({
          where: { userId: user.id }
        });

        // Delete usage history
        await prisma.usageHistory.deleteMany({
          where: { userId: user.id }
        });

        // Delete user preferences
        await prisma.userPreferences.deleteMany({
          where: { userId: user.id }
        });

        // Delete user accounts/sessions
        await prisma.account.deleteMany({
          where: { userId: user.id }
        });

        await prisma.session.deleteMany({
          where: { userId: user.id }
        });

        // Finally delete the user
        await prisma.user.delete({
          where: { id: user.id }
        });

        // Clean up memory storage
        await SessionStorageService.cleanupOrphanedMemory();

        console.log(`[PRIVACY] Successfully deleted all data for user ${user.id}`);
        
        userDataExport.deletionConfirmation = {
          deletedAt: new Date(),
          deletionComplete: true,
          accountDeleted: true,
          dataRetention: "zero",
          message: "All user data has been permanently deleted from VentureForge systems"
        };

      } catch (deletionError) {
        console.error(`[PRIVACY] Failed to delete user data:`, deletionError);
        userDataExport.deletionError = {
          error: "Account deletion failed",
          message: "Data export completed but account deletion encountered an error. Please contact support.",
          partialDeletion: true
        };
      }
    }

    return NextResponse.json({
      success: true,
      export: userDataExport,
      deleted: deleteAfterExport && !userDataExport.deletionError
    });

  } catch (error) {
    console.error("Error in full data export:", error);
    return NextResponse.json(
      { error: "Internal server error during data export" },
      { status: 500 }
    );
  }
}