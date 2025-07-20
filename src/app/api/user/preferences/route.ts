import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user preferences with storage settings
    const preferences = {
      allowPersistentStorage: user.allowPersistentStorage,
      defaultStorageMode: user.allowPersistentStorage ? 'PERSISTENT' : 'MEMORY_ONLY',
      preferences: user.preferences || {
        theme: 'light',
        defaultTemplate: 'comprehensive',
        autoSaveEnabled: true,
        dataRetentionDays: 30,
        analyticsOptOut: false,
        marketingOptOut: false,
        emailNotifications: true,
        exportNotifications: true,
        creditAlerts: true
      }
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user storage preferences
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        allowPersistentStorage: updates.allowPersistentStorage ?? user.allowPersistentStorage,
        privacyPolicyAccepted: updates.privacyPolicyAccepted ?? user.privacyPolicyAccepted,
        termsOfServiceAccepted: updates.termsOfServiceAccepted ?? user.termsOfServiceAccepted
      }
    });

    // Update or create user preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        theme: updates.preferences?.theme,
        defaultTemplate: updates.preferences?.defaultTemplate,
        autoSaveEnabled: updates.preferences?.autoSaveEnabled,
        dataRetentionDays: updates.preferences?.dataRetentionDays,
        analyticsOptOut: updates.preferences?.analyticsOptOut,
        marketingOptOut: updates.preferences?.marketingOptOut,
        emailNotifications: updates.preferences?.emailNotifications,
        exportNotifications: updates.preferences?.exportNotifications,
        creditAlerts: updates.preferences?.creditAlerts
      },
      create: {
        userId: user.id,
        theme: updates.preferences?.theme || 'light',
        defaultTemplate: updates.preferences?.defaultTemplate || 'comprehensive',
        autoSaveEnabled: updates.preferences?.autoSaveEnabled ?? true,
        dataRetentionDays: updates.preferences?.dataRetentionDays || 30,
        analyticsOptOut: updates.preferences?.analyticsOptOut || false,
        marketingOptOut: updates.preferences?.marketingOptOut || false,
        emailNotifications: updates.preferences?.emailNotifications ?? true,
        exportNotifications: updates.preferences?.exportNotifications ?? true,
        creditAlerts: updates.preferences?.creditAlerts ?? true
      }
    });

    console.log(`[PRIVACY] User ${user.id} updated storage preferences: persistent=${updatedUser.allowPersistentStorage}`);

    return NextResponse.json({
      success: true,
      allowPersistentStorage: updatedUser.allowPersistentStorage,
      defaultStorageMode: updatedUser.allowPersistentStorage ? 'PERSISTENT' : 'MEMORY_ONLY',
      preferences
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}