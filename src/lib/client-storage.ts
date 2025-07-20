/**
 * Client-Side Storage Service for Memory-Only Projects
 * Handles all 6 AI generation steps (Idea Spark → Go-to-Market) in browser storage
 * Provides true privacy compliance with zero server-side data persistence
 */

export interface ProjectData {
  id: string;
  name: string;
  storageMode: 'MEMORY_ONLY' | 'PERSISTENT';
  createdAt: string;
  lastModified: string;
  expiresAt: string; // 24 hours from creation
  
  // All 6 AI generation steps
  ideaOutput?: any;      // Step 1: Generated business ideas
  researchOutput?: any;  // Step 2: Market research & analysis
  blueprintOutput?: any; // Step 3: Business model & strategy
  financialOutput?: any; // Step 4: Financial projections
  pitchOutput?: any;     // Step 5: Investor pitch deck
  gtmOutput?: any;       // Step 6: Go-to-market strategy
}

export class ClientStorageService {
  private static readonly STORAGE_PREFIX = 'vf_project_';
  private static readonly INDEX_KEY = 'vf_projects_index';

  /**
   * Initialize a new memory-only project in client storage
   */
  static initializeProject(projectId: string, name: string): void {
    if (typeof window === 'undefined') return; // SSR safety

    const project: ProjectData = {
      id: projectId,
      name,
      storageMode: 'MEMORY_ONLY',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    // Store project data
    localStorage.setItem(
      `${this.STORAGE_PREFIX}${projectId}`, 
      JSON.stringify(project)
    );

    // Update projects index
    this.updateProjectsIndex(projectId);
    
    console.log(`[CLIENT_STORAGE] Initialized memory-only project: ${projectId}`);
  }

  /**
   * Save AI response for any of the 6 steps
   */
  static saveAIResponse(
    projectId: string, 
    step: 'ideaOutput' | 'researchOutput' | 'blueprintOutput' | 'financialOutput' | 'pitchOutput' | 'gtmOutput',
    data: any
  ): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const project = this.getProject(projectId);
      if (!project) {
        console.error(`[CLIENT_STORAGE] Project ${projectId} not found`);
        return false;
      }

      // Check if project has expired
      if (new Date(project.expiresAt) < new Date()) {
        console.warn(`[CLIENT_STORAGE] Project ${projectId} has expired`);
        this.deleteProject(projectId);
        return false;
      }

      // Update project with new AI response
      project[step] = data;
      project.lastModified = new Date().toISOString();

      // Save back to localStorage
      localStorage.setItem(
        `${this.STORAGE_PREFIX}${projectId}`, 
        JSON.stringify(project)
      );

      console.log(`[CLIENT_STORAGE] Saved ${step} for project: ${projectId}`);
      return true;
    } catch (error) {
      console.error(`[CLIENT_STORAGE] Error saving ${step}:`, error);
      return false;
    }
  }

  /**
   * Get complete project data
   */
  static getProject(projectId: string): ProjectData | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}${projectId}`);
      if (!data) return null;

      const project: ProjectData = JSON.parse(data);

      // Check if project has expired
      if (new Date(project.expiresAt) < new Date()) {
        console.warn(`[CLIENT_STORAGE] Project ${projectId} expired, cleaning up`);
        this.deleteProject(projectId);
        return null;
      }

      return project;
    } catch (error) {
      console.error(`[CLIENT_STORAGE] Error getting project ${projectId}:`, error);
      return null;
    }
  }

  /**
   * Get all client-stored projects
   */
  static getAllProjects(): ProjectData[] {
    if (typeof window === 'undefined') return [];

    try {
      const indexData = localStorage.getItem(this.INDEX_KEY);
      if (!indexData) return [];

      const projectIds: string[] = JSON.parse(indexData);
      const projects: ProjectData[] = [];

      for (const projectId of projectIds) {
        const project = this.getProject(projectId);
        if (project) {
          projects.push(project);
        }
      }

      // Sort by last modified (newest first)
      return projects.sort((a, b) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
    } catch (error) {
      console.error('[CLIENT_STORAGE] Error getting all projects:', error);
      return [];
    }
  }

  /**
   * Export complete project data (all 6 steps)
   */
  static exportProject(projectId: string): ProjectData | null {
    const project = this.getProject(projectId);
    if (!project) return null;

    // Create comprehensive export with all AI responses
    const exportData: ProjectData = {
      ...project,
      lastModified: new Date().toISOString()
    };

    console.log(`[CLIENT_STORAGE] Exported project: ${projectId}`);
    return exportData;
  }

  /**
   * Export project as downloadable JSON file
   */
  static downloadProjectExport(projectId: string): boolean {
    const project = this.exportProject(projectId);
    if (!project) return false;

    try {
      const dataStr = JSON.stringify(project, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_complete_business_plan_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      console.log(`[CLIENT_STORAGE] Downloaded export for project: ${projectId}`);
      return true;
    } catch (error) {
      console.error('[CLIENT_STORAGE] Error downloading export:', error);
      return false;
    }
  }

  /**
   * Delete project from client storage
   */
  static deleteProject(projectId: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      // Remove project data
      localStorage.removeItem(`${this.STORAGE_PREFIX}${projectId}`);
      
      // Update projects index
      const indexData = localStorage.getItem(this.INDEX_KEY);
      if (indexData) {
        const projectIds: string[] = JSON.parse(indexData);
        const updatedIds = projectIds.filter(id => id !== projectId);
        localStorage.setItem(this.INDEX_KEY, JSON.stringify(updatedIds));
      }

      console.log(`[CLIENT_STORAGE] Deleted project: ${projectId}`);
      return true;
    } catch (error) {
      console.error(`[CLIENT_STORAGE] Error deleting project ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Clear all expired projects (privacy cleanup)
   */
  static cleanupExpiredProjects(): number {
    if (typeof window === 'undefined') return 0;

    const projects = this.getAllProjects();
    let cleanedCount = 0;

    for (const project of projects) {
      if (new Date(project.expiresAt) < new Date()) {
        this.deleteProject(project.id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[CLIENT_STORAGE] Cleaned up ${cleanedCount} expired projects`);
    }

    return cleanedCount;
  }

  /**
   * Get storage usage statistics
   */
  static getStorageStats(): {
    projectCount: number;
    totalSize: number;
    oldestProject?: string;
    newestProject?: string;
  } {
    if (typeof window === 'undefined') return { projectCount: 0, totalSize: 0 };

    const projects = this.getAllProjects();
    let totalSize = 0;

    // Calculate total storage size
    projects.forEach(project => {
      const projectData = localStorage.getItem(`${this.STORAGE_PREFIX}${project.id}`);
      if (projectData) {
        totalSize += new Blob([projectData]).size;
      }
    });

    return {
      projectCount: projects.length,
      totalSize,
      oldestProject: projects.length > 0 ? projects[projects.length - 1].name : undefined,
      newestProject: projects.length > 0 ? projects[0].name : undefined
    };
  }

  /**
   * Check if project has all 6 steps completed
   */
  static getProjectCompletionStatus(projectId: string): {
    completed: string[];
    remaining: string[];
    isComplete: boolean;
  } {
    const project = this.getProject(projectId);
    if (!project) {
      return { completed: [], remaining: [], isComplete: false };
    }

    const allSteps = [
      { key: 'ideaOutput', name: 'Idea Spark' },
      { key: 'researchOutput', name: 'Deep Research' },
      { key: 'blueprintOutput', name: 'Blueprint Architect' },
      { key: 'financialOutput', name: 'Financial Forecaster' },
      { key: 'pitchOutput', name: 'Pitch Perfect' },
      { key: 'gtmOutput', name: 'Go-to-Market' }
    ];

    const completed = allSteps.filter(step => project[step.key as keyof ProjectData]).map(step => step.name);
    const remaining = allSteps.filter(step => !project[step.key as keyof ProjectData]).map(step => step.name);

    return {
      completed,
      remaining,
      isComplete: completed.length === 6
    };
  }

  /**
   * Update projects index
   */
  private static updateProjectsIndex(projectId: string): void {
    try {
      const indexData = localStorage.getItem(this.INDEX_KEY);
      let projectIds: string[] = indexData ? JSON.parse(indexData) : [];
      
      if (!projectIds.includes(projectId)) {
        projectIds.push(projectId);
        localStorage.setItem(this.INDEX_KEY, JSON.stringify(projectIds));
      }
    } catch (error) {
      console.error('[CLIENT_STORAGE] Error updating projects index:', error);
    }
  }
}

// Auto-cleanup expired projects on service initialization
if (typeof window !== 'undefined') {
  ClientStorageService.cleanupExpiredProjects();
}