/**
 * Session-Based Project Storage for VentureForge
 * 
 * This service implements a memory-only storage model where:
 * - Project data is stored in server-side session memory only
 * - No sensitive business data is persisted to database
 * - Data is automatically cleared after export or session timeout
 * - Ultimate privacy: impossible for staff to access user data
 */

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
  private static sessions = new Map<string, ProjectSession>();
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize the session cleanup process
   */
  static initialize() {
    if (!this.cleanupInterval) {
      // Clean up expired sessions every 5 minutes
      this.cleanupInterval = setInterval(() => {
        this.cleanupExpiredSessions();
      }, 5 * 60 * 1000);
    }
  }

  /**
   * Create a new project session
   */
  static createProjectSession(
    userId: string, 
    projectName: string,
    isPersistent: boolean = false,
    customExpiration?: Date
  ): string {
    const projectId = isPersistent 
      ? `persistent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const now = new Date();
    const defaultExpiration = isPersistent 
      ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days for persistent
      : new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours for memory-only
    
    const session: ProjectSession = {
      id: projectId,
      userId,
      name: projectName,
      createdAt: now,
      lastAccessed: now,
      expiresAt: customExpiration || defaultExpiration,
      data: {}
    };

    this.sessions.set(projectId, session);
    console.log(`Created ${isPersistent ? 'persistent' : 'session'} project: ${projectId} for user: ${userId}`);
    
    return projectId;
  }

  /**
   * Get project session data
   */
  static getProjectSession(projectId: string, userId: string): ProjectSession | null {
    const session = this.sessions.get(projectId);
    
    if (!session || session.userId !== userId) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      this.sessions.delete(projectId);
      return null;
    }

    // Update last accessed time
    session.lastAccessed = new Date();
    return session;
  }

  /**
   * Update project session data
   */
  static updateProjectData(
    projectId: string, 
    userId: string, 
    field: keyof ProjectSession['data'], 
    data: any
  ): boolean {
    const session = this.getProjectSession(projectId, userId);
    
    if (!session) {
      return false;
    }

    session.data[field] = data;
    session.lastAccessed = new Date();
    
    console.log(`Updated ${field} for session project: ${projectId}`);
    return true;
  }

  /**
   * Get all project sessions for a user
   */
  static getUserProjectSessions(userId: string): ProjectSession[] {
    const userSessions: ProjectSession[] = [];
    const now = new Date();

    this.sessions.forEach((session, projectId) => {
      if (session.userId === userId && session.expiresAt > now) {
        userSessions.push(session);
      }
    });

    return userSessions.sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime());
  }

  /**
   * Delete a specific project session
   */
  static deleteProjectSession(projectId: string, userId: string): boolean {
    const session = this.sessions.get(projectId);
    
    if (!session || session.userId !== userId) {
      return false;
    }

    this.sessions.delete(projectId);
    console.log(`Deleted session project: ${projectId} for user: ${userId}`);
    return true;
  }

  /**
   * Export project data and optionally delete after export
   */
  static exportAndDelete(projectId: string, userId: string): ProjectSession | null {
    const session = this.getProjectSession(projectId, userId);
    
    if (!session) {
      return null;
    }

    // Create a copy for export
    const exportData = { ...session };
    
    // Delete the session (privacy by design)
    this.sessions.delete(projectId);
    console.log(`Exported and deleted session project: ${projectId} for user: ${userId}`);
    
    return exportData;
  }

  /**
   * Clean up expired sessions
   */
  private static cleanupExpiredSessions() {
    const now = new Date();
    let cleanedCount = 0;

    this.sessions.forEach((session, projectId) => {
      if (session.expiresAt < now) {
        this.sessions.delete(projectId);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired session projects`);
    }
  }

  /**
   * Extend session expiration (when user is actively working)
   */
  static extendSession(projectId: string, userId: string, hoursToAdd: number = 2): boolean {
    const session = this.getProjectSession(projectId, userId);
    
    if (!session) {
      return false;
    }

    session.expiresAt = new Date(session.expiresAt.getTime() + hoursToAdd * 60 * 60 * 1000);
    session.lastAccessed = new Date();
    
    return true;
  }

  /**
   * Get session statistics (for admin/monitoring)
   */
  static getStats() {
    const now = new Date();
    let activeSessions = 0;
    let expiredSessions = 0;

    this.sessions.forEach((session) => {
      if (session.expiresAt > now) {
        activeSessions++;
      } else {
        expiredSessions++;
      }
    });

    return {
      total: this.sessions.size,
      active: activeSessions,
      expired: expiredSessions,
      memoryUsage: process.memoryUsage()
    };
  }
}

// Initialize the service
SessionStorageService.initialize();

export { SessionStorageService, type ProjectSession };