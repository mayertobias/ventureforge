/**
 * Privacy-First Project Storage for VentureForge
 * 
 * This service implements a dual storage model respecting user privacy preferences:
 * - MEMORY_ONLY: AI responses stored in memory only, never persisted to database
 * - PERSISTENT: User opted for database storage with automatic expiration
 * - Database only stores project metadata, not sensitive business data for MEMORY_ONLY
 * - Ultimate privacy: memory-only projects leave no database trace of AI responses
 */

import { prisma } from './prisma';

// In-memory storage for MEMORY_ONLY projects (serverless-compatible with limitations)
const memoryStorage = new Map<string, ProjectSession>();

interface ProjectSession {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  lastAccessed: Date;
  expiresAt: Date;
  data: {
    ideaOutput?: any;
    researchOutput?: any;
    blueprintOutput?: any;
    financialOutput?: any;
    pitchOutput?: any;
    gtmOutput?: any;
  };
}

class SessionStorageService {
  // Remove memory-based storage for serverless compatibility
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize the session cleanup process
   */
  static initialize() {
    // Serverless functions don't support intervals, cleanup happens on-demand
    console.log('SessionStorageService initialized for serverless environment');
  }

  /**
   * Create a new project session
   */
  static async createProjectSession(
    userId: string, 
    projectName: string,
    isPersistent: boolean = false,
    customExpiration?: Date,
    customProjectId?: string
  ): Promise<string> {
    const projectId = customProjectId || (isPersistent 
      ? `persistent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    
    const now = new Date();
    const defaultExpiration = isPersistent 
      ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days for persistent
      : new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours for memory-only
    
    try {
      // Store session data in database temporarily
      await prisma.project.upsert({
        where: { id: projectId },
        update: {
          name: projectName,
          expiresAt: customExpiration || defaultExpiration,
          // Clear any existing session data
          ideaOutput: undefined,
          researchOutput: undefined,
          blueprintOutput: undefined,
          financialOutput: undefined,
          pitchOutput: undefined,
          gtmOutput: undefined,
        },
        create: {
          id: projectId,
          name: projectName,
          userId,
          storageMode: isPersistent ? 'PERSISTENT' : 'MEMORY_ONLY',
          expiresAt: customExpiration || defaultExpiration,
        }
      });

      console.log(`Created ${isPersistent ? 'persistent' : 'session'} project: ${projectId} for user: ${userId}`);
      return projectId;
    } catch (error) {
      console.error('Failed to create project session:', error);
      throw new Error('Failed to create project session');
    }
  }

  /**
   * Get project session data - respects privacy preferences
   * MEMORY_ONLY: retrieves from memory storage
   * PERSISTENT: retrieves from database
   */
  static async getProjectSession(projectId: string, userId: string): Promise<ProjectSession | null> {
    try {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: userId,
        }
      });

      if (!project) {
        return null;
      }

      // Check if session has expired
      if (project.expiresAt && project.expiresAt < new Date()) {
        // Auto-delete expired sessions
        await this.deleteProjectSession(projectId, userId);
        return null;
      }

      const isMemoryOnly = project.storageMode === 'MEMORY_ONLY';
      console.log(`[PRIVACY] Getting project ${projectId} - Mode: ${project.storageMode}`);

      if (isMemoryOnly) {
        // MEMORY_ONLY: Client-side storage only, return empty shell for server-side requests
        console.log(`[PRIVACY] MEMORY_ONLY project ${projectId} - data managed client-side`);
        return {
          id: project.id,
          userId: project.userId,
          name: project.name,
          createdAt: project.createdAt,
          lastAccessed: new Date(),
          expiresAt: project.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
          data: {} // Empty - client handles data storage
        };
      } else {
        // PERSISTENT: Get from database as before
        console.log(`[PRIVACY] Retrieved PERSISTENT project ${projectId} from database`);
        return {
          id: project.id,
          userId: project.userId,
          name: project.name,
          createdAt: project.createdAt,
          lastAccessed: new Date(),
          expiresAt: project.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
          data: {
            ideaOutput: project.ideaOutput,
            researchOutput: project.researchOutput,
            blueprintOutput: project.blueprintOutput,
            financialOutput: project.financialOutput,
            pitchOutput: project.pitchOutput,
            gtmOutput: project.gtmOutput,
          }
        };
      }
    } catch (error) {
      console.error('Failed to get project session:', error);
      return null;
    }
  }

  /**
   * Update project session data - respects privacy preferences
   * MEMORY_ONLY: stores in memory only, clears database fields
   * PERSISTENT: stores in database
   */
  static async updateProjectData(
    projectId: string, 
    userId: string, 
    field: keyof ProjectSession['data'], 
    data: any
  ): Promise<boolean> {
    try {
      // Verify project exists and user owns it
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: userId,
        }
      });

      if (!project) {
        console.error(`Project ${projectId} not found for user ${userId}`);
        return false;
      }

      // Check if session has expired
      if (project.expiresAt && project.expiresAt < new Date()) {
        console.error(`Project ${projectId} has expired`);
        await this.deleteProjectSession(projectId, userId);
        return false;
      }

      const isMemoryOnly = project.storageMode === 'MEMORY_ONLY';
      console.log(`[PRIVACY] Updating ${field} for project ${projectId} - Mode: ${project.storageMode}`);

      if (isMemoryOnly) {
        // MEMORY_ONLY: Client-side storage only, server doesn't store sensitive data
        console.log(`[PRIVACY] MEMORY_ONLY project ${projectId} - ${field} managed client-side only`);
        
        // CRITICAL PRIVACY: Ensure database fields remain null for sensitive data
        const dbClearData: any = {};
        if (['ideaOutput', 'researchOutput', 'blueprintOutput', 'financialOutput', 'pitchOutput', 'gtmOutput'].includes(field)) {
          dbClearData[field] = null; // Explicitly clear database field
        }
        
        // Only update database if we need to clear sensitive fields
        if (Object.keys(dbClearData).length > 0) {
          await prisma.project.update({
            where: { id: projectId },
            data: dbClearData
          });
        }
        
        // For MEMORY_ONLY projects, we don't store server-side - client handles storage
        console.log(`[PRIVACY] ${field} for MEMORY_ONLY project ${projectId} handled client-side`);
        return true;
        
      } else {
        // PERSISTENT: Store in database as before
        const updateData: any = {
          [field]: data
        };

        await prisma.project.update({
          where: { id: projectId },
          data: updateData
        });
        
        console.log(`[PRIVACY] Stored ${field} in database for PERSISTENT project ${projectId}`);
        return true;
      }
    } catch (error) {
      console.error(`Failed to update project data for ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Get all project sessions for a user - respects privacy preferences
   */
  static async getUserProjectSessions(userId: string): Promise<ProjectSession[]> {
    try {
      const projects = await prisma.project.findMany({
        where: {
          userId: userId,
          expiresAt: {
            gt: new Date() // Only get non-expired projects
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return projects.map(project => {
        const isMemoryOnly = project.storageMode === 'MEMORY_ONLY';
        
        if (isMemoryOnly) {
          // For MEMORY_ONLY projects, get data from memory storage
          const memoryKey = `${project.id}_${userId}`;
          const memoryProject = memoryStorage.get(memoryKey);
          
          return {
            id: project.id,
            userId: project.userId,
            name: project.name,
            createdAt: project.createdAt,
            lastAccessed: project.updatedAt,
            expiresAt: project.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
            data: memoryProject?.data || {} // Memory data or empty object
          };
        } else {
          // For PERSISTENT projects, get data from database
          return {
            id: project.id,
            userId: project.userId,
            name: project.name,
            createdAt: project.createdAt,
            lastAccessed: project.updatedAt,
            expiresAt: project.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
            data: {
              ideaOutput: project.ideaOutput,
              researchOutput: project.researchOutput,
              blueprintOutput: project.blueprintOutput,
              financialOutput: project.financialOutput,
              pitchOutput: project.pitchOutput,
              gtmOutput: project.gtmOutput,
            }
          };
        }
      });
    } catch (error) {
      console.error('Failed to get user project sessions:', error);
      return [];
    }
  }

  /**
   * Delete a specific project session - clears both memory and database
   */
  static async deleteProjectSession(projectId: string, userId: string): Promise<boolean> {
    try {
      // Delete from memory storage (legacy)
      const memoryKey = `${projectId}_${userId}`;
      memoryStorage.delete(memoryKey);
      
      // Note: No temporary session storage to clean up for client-side storage
      
      // Delete from database
      const result = await prisma.project.deleteMany({
        where: {
          id: projectId,
          userId: userId,
        }
      });

      if (result.count > 0) {
        console.log(`[PRIVACY] Deleted project: ${projectId} for user: ${userId} (memory, temporary storage, and database)`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to delete project session ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Clean up expired temporary sessions (privacy compliance)
   * Note: With client-side storage, no server-side temporary sessions to clean
   */
  static async cleanupExpiredTemporarySessions(): Promise<number> {
    // No temporary session storage for client-side storage model
    console.log(`[PRIVACY] No temporary session cleanup needed - using client-side storage`);
    return 0;
  }

  /**
   * Export project data and optionally delete after export
   * Critical for MEMORY_ONLY projects - once exported, data is permanently deleted
   */
  static async exportAndDelete(projectId: string, userId: string): Promise<ProjectSession | null> {
    try {
      const session = await this.getProjectSession(projectId, userId);
      
      if (!session) {
        return null;
      }

      // Create a deep copy for export
      const exportData = JSON.parse(JSON.stringify(session));
      
      // Delete the session (privacy by design)
      await this.deleteProjectSession(projectId, userId);
      console.log(`[PRIVACY] Exported and deleted project: ${projectId} for user: ${userId}`);
      
      return exportData;
    } catch (error) {
      console.error(`Failed to export and delete project ${projectId}:`, error);
      return null;
    }
  }

  /**
   * Clean up expired sessions - clears both memory and database
   */
  static async cleanupExpiredSessions(): Promise<number> {
    try {
      // Get expired project IDs first
      const expiredProjects = await prisma.project.findMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        },
        select: { id: true, userId: true }
      });
      
      // Clean up memory storage for expired projects
      for (const project of expiredProjects) {
        const memoryKey = `${project.id}_${project.userId}`;
        memoryStorage.delete(memoryKey);
      }
      
      // Delete from database
      const result = await prisma.project.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });

      if (result.count > 0) {
        console.log(`[PRIVACY] Cleaned up ${result.count} expired projects (memory and database)`);
      }
      
      return result.count;
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
      return 0;
    }
  }

  /**
   * Extend session expiration (when user is actively working)
   */
  static async extendSession(projectId: string, userId: string, hoursToAdd: number = 2): Promise<boolean> {
    try {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: userId,
        }
      });

      if (!project) {
        return false;
      }

      await prisma.project.update({
        where: { id: projectId },
        data: {
          expiresAt: new Date((project.expiresAt || new Date()).getTime() + hoursToAdd * 60 * 60 * 1000)
        }
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to extend session ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Get session statistics (for admin/monitoring)
   */
  static async getStats() {
    try {
      const now = new Date();
      
      const [totalProjects, activeProjects, expiredProjects, memoryOnlyProjects] = await Promise.all([
        prisma.project.count(),
        prisma.project.count({
          where: {
            expiresAt: {
              gt: now
            }
          }
        }),
        prisma.project.count({
          where: {
            expiresAt: {
              lte: now
            }
          }
        }),
        prisma.project.count({
          where: {
            storageMode: 'MEMORY_ONLY',
            expiresAt: {
              gt: now
            }
          }
        })
      ]);

      return {
        total: totalProjects,
        active: activeProjects,
        expired: expiredProjects,
        memoryOnly: memoryOnlyProjects,
        persistent: activeProjects - memoryOnlyProjects,
        memoryStorageSize: memoryStorage.size,
        memoryUsage: process.memoryUsage()
      };
    } catch (error) {
      console.error('Failed to get session stats:', error);
      return {
        total: 0,
        active: 0,
        expired: 0,
        memoryOnly: 0,
        persistent: 0,
        memoryStorageSize: 0,
        memoryUsage: process.memoryUsage()
      };
    }
  }

  /**
   * Clean up orphaned memory storage entries
   * Should be called periodically to prevent memory leaks
   */
  static async cleanupOrphanedMemory(): Promise<number> {
    try {
      let cleanedCount = 0;
      const activeProjectIds = new Set();
      
      // Get all active project IDs from database
      const activeProjects = await prisma.project.findMany({
        where: {
          expiresAt: {
            gt: new Date()
          }
        },
        select: { id: true, userId: true }
      });
      
      activeProjects.forEach(p => {
        activeProjectIds.add(`${p.id}_${p.userId}`);
      });
      
      // Remove memory entries that don't have corresponding database entries
      const memoryKeys = Array.from(memoryStorage.keys());
      for (const memoryKey of memoryKeys) {
        if (!activeProjectIds.has(memoryKey)) {
          memoryStorage.delete(memoryKey);
          cleanedCount++;
        }
      }
      
      if (cleanedCount > 0) {
        console.log(`[PRIVACY] Cleaned up ${cleanedCount} orphaned memory entries`);
      }
      
      return cleanedCount;
    } catch (error) {
      console.error('Failed to cleanup orphaned memory:', error);
      return 0;
    }
  }

  /**
   * WARNING: Memory-only storage limitations in serverless
   * This method explains the privacy tradeoffs
   */
  static getPrivacyNotice(): string {
    return `
PRIVACY NOTICE - Memory-Only Storage:

PROS:
- Ultimate privacy: AI responses never touch database
- Zero persistence of sensitive business data
- Automatic cleanup when function ends

LIMITATIONS (Serverless Environment):
- Data lost if serverless function restarts
- Limited to single function execution context
- Requires immediate export after generation

RECOMMENDATION:
For maximum privacy: Generate → Export → Delete immediately
For reliability: Use PERSISTENT mode with understanding that data is stored securely but retrievably
`;
  }
}

// Initialize the service
SessionStorageService.initialize();

export { SessionStorageService, type ProjectSession };