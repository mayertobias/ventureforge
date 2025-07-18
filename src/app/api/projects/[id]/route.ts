import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KMSService } from "@/lib/kms";

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

    // Find the project and verify ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Decrypt all project data fields before returning
    const decryptedProject = { ...project };
    
    // List of fields to decrypt
    const fieldsToDecrypt = [
      'ideaOutput',
      'researchOutput',
      'blueprintOutput',
      'financialOutput',
      'pitchOutput',
      'gtmOutput'
    ];
    
    for (const field of fieldsToDecrypt) {
      if (project[field as keyof typeof project]) {
        try {
          // Check if data is encrypted before attempting to decrypt
          const fieldData = project[field as keyof typeof project];
          
          // Only attempt decryption if data appears to be encrypted
          if (fieldData && typeof fieldData === 'object' && 
              !Array.isArray(fieldData) && !(fieldData instanceof Date) &&
              ((fieldData as any).encrypted || (fieldData as any).iv || (fieldData as any).authTag)) {
            const decryptedData = await KMSService.decryptUserData(
              user.id, 
              fieldData
            );
            (decryptedProject as any)[field] = decryptedData;
          } else {
            // Data is not encrypted, use as-is
            (decryptedProject as any)[field] = fieldData;
          }
        } catch (error) {
          console.error(`Failed to decrypt ${field}:`, error);
          // Keep the field as-is if decryption fails (for backward compatibility)
        }
      }
    }

    return NextResponse.json({ project: decryptedProject });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}