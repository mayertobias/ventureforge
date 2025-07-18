import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email);
}

async function logAdminAction(action: {
  action: string;
  adminEmail: string;
  targetUser: string;
  oldCredits: number;
  newCredits: number;
}) {
  // Log to console for now - in production, use proper logging service
  console.log(`[ADMIN_ACTION] ${action.action}:`, {
    admin: action.adminEmail,
    target: action.targetUser,
    creditsChange: `${action.oldCredits} → ${action.newCredits}`,
    timestamp: new Date().toISOString()
  });
  
  // TODO: Implement proper audit logging to database
  // await prisma.adminAuditLog.create({
  //   data: {
  //     action: action.action,
  //     adminEmail: action.adminEmail,
  //     targetUser: action.targetUser,
  //     oldValue: action.oldCredits,
  //     newValue: action.newCredits,
  //     timestamp: new Date()
  //   }
  // });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Add admin check
    if (!isAdmin(session.user.email)) {
      console.warn(`[SECURITY] Non-admin user attempted credit update: ${session.user.email}`);
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    // Get request body to determine target user (optional - defaults to self)
    const body = await request.json().catch(() => ({}));
    const targetEmail = body.targetEmail || body.email || session.user.email;
    const newCredits = body.credits || 100;

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { email: targetEmail },
      select: { credits: true, email: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    // Add proper audit logging
    await logAdminAction({
      action: "CREDIT_UPDATE",
      adminEmail: session.user.email,
      targetUser: targetEmail,
      oldCredits: currentUser.credits,
      newCredits: newCredits
    });

    // Update user credits
    const user = await prisma.user.update({
      where: { email: targetEmail },
      data: { credits: newCredits },
    });

    return NextResponse.json({
      success: true,
      message: `Credits updated successfully for ${targetEmail}`,
      targetUser: targetEmail,
      oldCredits: currentUser.credits,
      newCredits: user.credits,
      updatedBy: session.user.email
    });
  } catch (error) {
    console.error("Error updating credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}