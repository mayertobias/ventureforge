import { prisma } from "@/lib/prisma";

/**
 * Usage Tracking Service for VentureForge
 * 
 * Tracks user actions, credit usage, and provides analytics while
 * respecting privacy preferences. Stores metadata but not sensitive content.
 */

export type UsageAction = 
  | 'IDEA_GENERATION'
  | 'RESEARCH' 
  | 'BLUEPRINT'
  | 'FINANCIALS'
  | 'PITCH'
  | 'GTM'
  | 'REPORT_EXPORT'
  | 'CREDIT_PURCHASE'
  | 'CREDIT_REFUND';

interface TrackUsageParams {
  userId: string;
  action: UsageAction;
  creditsUsed: number;
  projectId?: string;
  projectName?: string;
  metadata?: Record<string, any>;
}

export class UsageTrackingService {
  /**
   * Track a user action and credit usage
   */
  static async trackUsage({
    userId,
    action,
    creditsUsed,
    projectId,
    projectName,
    metadata = {}
  }: TrackUsageParams): Promise<void> {
    try {
      // Get current user to calculate new balance
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true, totalCreditsUsed: true }
      });

      if (!user) {
        throw new Error('User not found for usage tracking');
      }

      const newBalance = user.credits - creditsUsed;
      const newTotalUsed = user.totalCreditsUsed + creditsUsed;

      // Create usage history record and update user credits in transaction
      await prisma.$transaction([
        // Record the usage
        prisma.usageHistory.create({
          data: {
            userId,
            action,
            projectId,
            projectName,
            creditsUsed,
            creditsBalance: newBalance,
            metadata: {
              ...metadata,
              timestamp: new Date().toISOString(),
              userAgent: metadata.userAgent || 'unknown'
            }
          }
        }),
        
        // Update user credits and total usage
        prisma.user.update({
          where: { id: userId },
          data: {
            credits: newBalance,
            totalCreditsUsed: newTotalUsed
          }
        })
      ]);

      console.log(`Tracked usage: ${action} for user ${userId} (${creditsUsed} credits)`);

    } catch (error) {
      console.error('Failed to track usage:', error);
      // Don't throw - usage tracking failure shouldn't break the main flow
    }
  }

  /**
   * Get user's usage history with pagination
   */
  static async getUserUsageHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    try {
      const history = await prisma.usageHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          action: true,
          projectName: true,
          creditsUsed: true,
          creditsBalance: true,
          createdAt: true,
          metadata: true
        }
      });

      return history;
    } catch (error) {
      console.error('Failed to get usage history:', error);
      return [];
    }
  }

  /**
   * Get user's usage summary
   */
  static async getUserUsageSummary(userId: string) {
    try {
      const [user, usageStats] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            credits: true,
            totalCreditsUsed: true,
            subscriptionPlan: true,
            createdAt: true
          }
        }),
        
        prisma.usageHistory.groupBy({
          by: ['action'],
          where: { userId },
          _sum: { creditsUsed: true },
          _count: { action: true }
        })
      ]);

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate usage by action
      const usageByAction = usageStats.reduce((acc, stat) => {
        acc[stat.action] = {
          count: stat._count.action,
          totalCredits: stat._sum.creditsUsed || 0
        };
        return acc;
      }, {} as Record<string, { count: number; totalCredits: number }>);

      return {
        currentCredits: user.credits,
        totalCreditsUsed: user.totalCreditsUsed,
        subscriptionPlan: user.subscriptionPlan,
        memberSince: user.createdAt,
        usageByAction
      };

    } catch (error) {
      console.error('Failed to get usage summary:', error);
      return null;
    }
  }

  /**
   * Check if user has sufficient credits
   */
  static async checkCredits(userId: string, requiredCredits: number): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true }
      });

      return user ? user.credits >= requiredCredits : false;
    } catch (error) {
      console.error('Failed to check credits:', error);
      return false;
    }
  }

  /**
   * Get credit usage trends (for analytics)
   */
  static async getCreditUsageTrends(userId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const dailyUsage = await prisma.usageHistory.groupBy({
        by: ['createdAt'],
        where: {
          userId,
          createdAt: {
            gte: startDate
          }
        },
        _sum: { creditsUsed: true },
        orderBy: { createdAt: 'asc' }
      });

      // Group by day
      const usageByDay = dailyUsage.reduce((acc, usage) => {
        const day = usage.createdAt.toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + (usage._sum.creditsUsed || 0);
        return acc;
      }, {} as Record<string, number>);

      return usageByDay;
    } catch (error) {
      console.error('Failed to get usage trends:', error);
      return {};
    }
  }

  /**
   * Clean up old usage history based on user preferences
   */
  static async cleanupOldUsageHistory(userId: string, retentionDays: number = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const deleted = await prisma.usageHistory.deleteMany({
        where: {
          userId,
          createdAt: {
            lt: cutoffDate
          }
        }
      });

      console.log(`Cleaned up ${deleted.count} old usage records for user ${userId}`);
      return deleted.count;
    } catch (error) {
      console.error('Failed to cleanup usage history:', error);
      return 0;
    }
  }
}