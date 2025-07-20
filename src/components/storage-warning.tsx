"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Info, 
  Shield, 
  Clock,
  Download,
  Trash2,
  Mail,
  ArrowUp
} from "lucide-react";
import { ProjectData, StorageValidationService } from "@/lib/storage-validation";
import { ExportDeleteDialog } from "./export-delete-dialog";

interface StorageWarningProps {
  project: ProjectData;
  onExport?: () => void;
  onDelete?: () => void;
  onUpgrade?: () => void;
  className?: string;
}

export function StorageWarning({ 
  project, 
  onExport, 
  onDelete, 
  onUpgrade,
  className = ""
}: StorageWarningProps) {
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const warning = StorageValidationService.getDisplayWarning(project);
  const storageInfo = StorageValidationService.getStorageModeInfo(project.storageMode);

  if (!warning.show) return null;

  const getIcon = () => {
    switch (warning.type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <Clock className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (warning.type) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      case 'info':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'export':
        onExport?.();
        break;
      case 'export_delete':
        setShowExportDialog(true);
        break;
      case 'delete':
        onDelete?.();
        break;
      case 'upgrade_storage':
        onUpgrade?.();
        break;
      case 'contact_support':
        window.open('mailto:support@ventureforge.ai?subject=Privacy%20Violation%20Report', '_blank');
        break;
    }
  };

  return (
    <>
      <Alert variant={getVariant()} className={className}>
        {getIcon()}
        <AlertTitle className="flex items-center gap-2">
          {warning.title}
          <Badge variant="outline" className="ml-auto">
            {storageInfo.icon} {storageInfo.label}
          </Badge>
        </AlertTitle>
        <AlertDescription className="mt-2">
          <div className="space-y-3">
            <p>{warning.message}</p>
            
            {warning.actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {warning.actions.map((action, index) => {
                  const ActionIcon = action.action === 'export' || action.action === 'export_delete' 
                    ? Download 
                    : action.action === 'delete' 
                    ? Trash2 
                    : action.action === 'contact_support'
                    ? Mail
                    : action.action === 'upgrade_storage'
                    ? ArrowUp
                    : Shield;

                  return (
                    <Button
                      key={index}
                      variant={action.variant}
                      size="sm"
                      onClick={() => handleAction(action.action)}
                      className="text-xs"
                    >
                      <ActionIcon className="h-3 w-3 mr-1" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Export Delete Dialog */}
      {showExportDialog && (
        <ExportDeleteDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          projectId={project.id}
          projectName={project.name}
          storageMode={project.storageMode}
          onSuccess={() => {
            setShowExportDialog(false);
            onDelete?.();
          }}
        />
      )}
    </>
  );
}

interface StorageModeBadgeProps {
  storageMode?: string;
  className?: string;
}

export function StorageModeBadge({ storageMode, className = "" }: StorageModeBadgeProps) {
  const info = StorageValidationService.getStorageModeInfo(storageMode);
  
  const getVariant = () => {
    switch (storageMode) {
      case 'MEMORY_ONLY':
        return 'default' as const;
      case 'PERSISTENT':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <Badge 
      variant={getVariant()} 
      className={`${className} text-xs`}
      title={info.description}
    >
      {info.icon} {info.label}
    </Badge>
  );
}

interface ProjectValidationSummaryProps {
  projects: ProjectData[];
  className?: string;
}

export function ProjectValidationSummary({ projects, className = "" }: ProjectValidationSummaryProps) {
  const validation = StorageValidationService.validateProjects(projects);
  
  if (validation.summary.privacyViolations === 0 && validation.summary.expired === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Privacy Issues Detected</AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          <p>We found some issues with your projects that need immediate attention:</p>
          <ul className="text-sm space-y-1">
            {validation.summary.privacyViolations > 0 && (
              <li>• {validation.summary.privacyViolations} project(s) have privacy violations</li>
            )}
            {validation.summary.expired > 0 && (
              <li>• {validation.summary.expired} project(s) have expired</li>
            )}
          </ul>
          <p className="text-sm font-medium">
            Please review and take action on the flagged projects below.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}