"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Download, 
  Trash2, 
  Shield, 
  CheckCircle,
  Loader2,
  FileDown,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

interface ExportDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  storageMode?: string;
  onSuccess?: () => void;
}

export function ExportDeleteDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  storageMode = "MEMORY_ONLY",
  onSuccess
}: ExportDeleteDialogProps) {
  const [step, setStep] = useState<'confirm' | 'export' | 'delete' | 'complete'>('confirm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportData, setExportData] = useState<any>(null);
  const [userConfirmed, setUserConfirmed] = useState(false);

  const handleExportAndDelete = async () => {
    if (!userConfirmed) {
      setError("Please confirm that you understand this action is permanent");
      return;
    }

    setLoading(true);
    setError(null);
    setStep('export');

    try {
      const response = await fetch(`/api/projects/${projectId}/export-and-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export and delete project');
      }

      const result = await response.json();
      setExportData(result.export);
      
      // Trigger download
      const dataStr = JSON.stringify(result.export, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      setStep('complete');
      
      // Notify parent component of success
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        resetDialog();
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('confirm');
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setStep('confirm');
    setLoading(false);
    setError(null);
    setExportData(null);
    setUserConfirmed(false);
  };

  const renderContent = () => {
    switch (step) {
      case 'confirm':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Export and Delete Project
              </DialogTitle>
              <DialogDescription>
                This will permanently delete &quot;{projectName}&quot; from all VentureForge systems.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Privacy-First Deletion:</strong> This project will be completely removed from our systems. 
                  {storageMode === 'MEMORY_ONLY' && " Since this is a memory-only project, no sensitive data was stored in our database."}
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What happens when you proceed:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Download className="h-3 w-3" />
                    Your project data will be exported as a JSON file
                  </li>
                  <li className="flex items-center gap-2">
                    <Trash2 className="h-3 w-3" />
                    All project data will be permanently deleted
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    No recovery will be possible
                  </li>
                </ul>
              </div>

              <div className="flex items-top space-x-2">
                <Checkbox 
                  id="confirm-deletion" 
                  checked={userConfirmed}
                  onCheckedChange={(checked) => setUserConfirmed(checked as boolean)}
                />
                <label htmlFor="confirm-deletion" className="text-sm leading-5">
                  I understand this action is permanent and cannot be undone. I want to export my data and delete this project.
                </label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleExportAndDelete}
                disabled={loading || !userConfirmed}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export & Delete
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        );

      case 'export':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileDown className="h-5 w-5 text-blue-500" />
                Exporting Project Data...
              </DialogTitle>
              <DialogDescription>
                Please wait while we prepare your data for download and delete the project.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                <p className="text-sm text-gray-600">
                  Securely exporting your project data...
                </p>
              </div>
            </div>
          </>
        );

      case 'complete':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Export Complete & Project Deleted
              </DialogTitle>
              <DialogDescription>
                Your project has been successfully exported and permanently deleted.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Privacy Compliance:</strong> All project data has been permanently removed from VentureForge systems. 
                  Your exported file contains all the AI-generated content for your records.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Export Summary:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✅ Project data exported successfully</li>
                  <li>✅ All database records deleted</li>
                  <li>✅ Memory storage cleared</li>
                  <li>✅ Privacy compliance verified</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                This dialog will close automatically in a few seconds.
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetDialog();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}