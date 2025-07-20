/**
 * Storage Mode Validation Service
 * Ensures frontend UI consistency with privacy-first storage policies
 */

import { ProjectStorageMode } from "@prisma/client";

export interface ProjectData {
  id: string;
  name: string;
  createdAt: string | Date;
  storageMode?: ProjectStorageMode | string;
  ideaOutput?: any;
  researchOutput?: any;
  blueprintOutput?: any;
  financialOutput?: any;
  pitchOutput?: any;
  gtmOutput?: any;
  expiresAt?: Date | string | null;
}

export interface StorageValidationResult {
  isValid: boolean;
  hasPrivacyViolation: boolean;
  hasExpiredData: boolean;
  shouldShowWarning: boolean;
  shouldRedirectToExport: boolean;
  warningMessage: string;
  recommendations: string[];
}

export class StorageValidationService {
  /**
   * Validate storage mode consistency for a project
   */
  static validateProject(project: ProjectData): StorageValidationResult {
    const isMemoryOnly = project.storageMode === 'MEMORY_ONLY';
    const isExpired = project.expiresAt ? new Date(project.expiresAt) < new Date() : false;
    
    // Check for AI data that shouldn't exist in database for MEMORY_ONLY projects
    const hasDbStoredAiData = !!(
      project.ideaOutput ||
      project.researchOutput ||
      project.blueprintOutput ||
      project.financialOutput ||
      project.pitchOutput ||
      project.gtmOutput
    );

    const hasPrivacyViolation = isMemoryOnly && hasDbStoredAiData;
    const hasExpiredData = isExpired;
    
    let warningMessage = '';
    let recommendations: string[] = [];
    let shouldShowWarning = false;
    let shouldRedirectToExport = false;

    if (hasPrivacyViolation) {
      shouldShowWarning = true;
      shouldRedirectToExport = true;
      warningMessage = 'Privacy Inconsistency Detected: This memory-only project has data stored in our database.';
      recommendations = [
        'Export your project data immediately',
        'Delete the project to ensure privacy compliance',
        'Contact support if this issue persists'
      ];
    } else if (hasExpiredData) {
      shouldShowWarning = true;
      shouldRedirectToExport = true;
      warningMessage = 'Project Expired: This project has exceeded its retention period.';
      recommendations = [
        'Export any important data before it\'s automatically deleted',
        'Create a new project to continue working'
      ];
    } else if (isMemoryOnly && !hasDbStoredAiData) {
      // This is the expected state for memory-only projects
      warningMessage = 'Privacy-First Storage: Your data is stored in memory only and won\'t be persisted.';
      recommendations = [
        'Export your project regularly to avoid data loss',
        'Consider upgrading to persistent storage for reliability'
      ];
    }

    return {
      isValid: !hasPrivacyViolation && !hasExpiredData,
      hasPrivacyViolation,
      hasExpiredData,
      shouldShowWarning,
      shouldRedirectToExport,
      warningMessage,
      recommendations
    };
  }

  /**
   * Validate storage mode for multiple projects
   */
  static validateProjects(projects: ProjectData[]): {
    validProjects: ProjectData[];
    problematicProjects: Array<ProjectData & { validation: StorageValidationResult }>;
    summary: {
      total: number;
      valid: number;
      privacyViolations: number;
      expired: number;
    };
  } {
    const validProjects: ProjectData[] = [];
    const problematicProjects: Array<ProjectData & { validation: StorageValidationResult }> = [];

    let privacyViolations = 0;
    let expired = 0;

    projects.forEach(project => {
      const validation = this.validateProject(project);
      
      if (validation.isValid) {
        validProjects.push(project);
      } else {
        problematicProjects.push({ ...project, validation });
        
        if (validation.hasPrivacyViolation) privacyViolations++;
        if (validation.hasExpiredData) expired++;
      }
    });

    return {
      validProjects,
      problematicProjects,
      summary: {
        total: projects.length,
        valid: validProjects.length,
        privacyViolations,
        expired
      }
    };
  }

  /**
   * Get storage mode display information
   */
  static getStorageModeInfo(storageMode?: ProjectStorageMode | string) {
    switch (storageMode) {
      case 'MEMORY_ONLY':
        return {
          label: 'Memory Only',
          description: 'Data stored in memory only - maximum privacy',
          icon: '🔒',
          color: 'green',
          warning: 'Data will be lost when session ends'
        };
      case 'PERSISTENT':
        return {
          label: 'Persistent',
          description: 'Data stored securely in database',
          icon: '💾',
          color: 'blue',
          warning: null
        };
      default:
        return {
          label: 'Unknown',
          description: 'Storage mode not specified',
          icon: '❓',
          color: 'gray',
          warning: 'Storage mode should be specified'
        };
    }
  }

  /**
   * Check if project data should be displayed
   */
  static shouldDisplayData(project: ProjectData): {
    shouldDisplay: boolean;
    reason?: string;
    action?: string;
  } {
    const validation = this.validateProject(project);
    
    if (validation.hasPrivacyViolation) {
      return {
        shouldDisplay: false,
        reason: 'Privacy violation detected',
        action: 'export_and_delete'
      };
    }
    
    if (validation.hasExpiredData) {
      return {
        shouldDisplay: false,
        reason: 'Project has expired',
        action: 'export_and_delete'
      };
    }

    return { shouldDisplay: true };
  }

  /**
   * Generate privacy-compliant display warning
   */
  static getDisplayWarning(project: ProjectData): {
    show: boolean;
    type: 'info' | 'warning' | 'error';
    title: string;
    message: string;
    actions: Array<{
      label: string;
      action: string;
      variant: 'default' | 'destructive' | 'outline';
    }>;
  } {
    const validation = this.validateProject(project);
    const storageInfo = this.getStorageModeInfo(project.storageMode);

    if (validation.hasPrivacyViolation) {
      return {
        show: true,
        type: 'error',
        title: 'Privacy Violation Detected',
        message: 'This memory-only project has data inappropriately stored in our database. Please export and delete immediately.',
        actions: [
          { label: 'Export & Delete', action: 'export_delete', variant: 'destructive' },
          { label: 'Contact Support', action: 'contact_support', variant: 'outline' }
        ]
      };
    }

    if (validation.hasExpiredData) {
      return {
        show: true,
        type: 'warning',
        title: 'Project Expired',
        message: 'This project has exceeded its retention period and may be automatically deleted.',
        actions: [
          { label: 'Export Data', action: 'export', variant: 'default' },
          { label: 'Delete Now', action: 'delete', variant: 'destructive' }
        ]
      };
    }

    if (project.storageMode === 'MEMORY_ONLY') {
      return {
        show: true,
        type: 'info',
        title: `${storageInfo.icon} Privacy-First Storage`,
        message: 'Your data is stored in memory only for maximum privacy. Remember to export regularly.',
        actions: [
          { label: 'Export Project', action: 'export', variant: 'outline' },
          { label: 'Upgrade Storage', action: 'upgrade_storage', variant: 'default' }
        ]
      };
    }

    return {
      show: false,
      type: 'info',
      title: '',
      message: '',
      actions: []
    };
  }
}