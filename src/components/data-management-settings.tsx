"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Trash2, 
  Shield, 
  AlertTriangle,
  FileDown,
  Database,
  Eye,
  Lock,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DataManagementSettings() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportAllData = async () => {
    setExportLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/export-all-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteAfterExport: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const result = await response.json();
      
      // Trigger download
      const dataStr = JSON.stringify(result.export, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `ventureforge_full_export_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      setShowExportDialog(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirmed) {
      setError("Please confirm account deletion");
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/export-all-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteAfterExport: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      const result = await response.json();
      
      // Trigger download of final export
      const dataStr = JSON.stringify(result.export, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `ventureforge_final_export_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      // Redirect to logout or home page after successful deletion
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account deletion failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal data and exercise your privacy rights.
        </p>
      </div>

      {/* Privacy Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Your Privacy Rights
          </CardTitle>
          <CardDescription>
            VentureForge respects your privacy and gives you full control over your data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Data Transparency</h4>
                <p className="text-sm text-gray-600">See exactly what data we store about you</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Data Portability</h4>
                <p className="text-sm text-gray-600">Export all your data in a standard format</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Memory-Only Storage</h4>
                <p className="text-sm text-gray-600">Sensitive data stored in memory only</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Right to be Forgotten</h4>
                <p className="text-sm text-gray-600">Delete all your data permanently</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a complete copy of all your VentureForge data including projects, AI responses, and usage history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Full Data Export</h4>
              <p className="text-sm text-gray-600">
                Includes all projects, AI-generated content, account details, and usage history
              </p>
            </div>
            <Button 
              onClick={() => setShowExportDialog(true)}
              variant="outline"
              className="shrink-0"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your VentureForge account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This action cannot be undone. All your projects, AI responses, 
              and account data will be permanently deleted from our systems.
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Complete Account Deletion</h4>
              <p className="text-sm text-gray-600">
                We&apos;ll export your data first, then permanently delete everything
              </p>
            </div>
            <Button 
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export All Your Data</DialogTitle>
            <DialogDescription>
              This will create a comprehensive export of all your VentureForge data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Export includes:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Account information and preferences</li>
                <li>• All project data and AI-generated content</li>
                <li>• Usage history and credit transactions</li>
                <li>• Privacy settings and compliance records</li>
              </ul>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportAllData} disabled={exportLoading}>
              {exportLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Your Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your VentureForge account and all data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>This action cannot be undone.</strong> All your projects, AI responses, 
                account data, and usage history will be permanently deleted.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What happens:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>1. We&apos;ll export all your data for download</li>
                <li>2. All projects will be permanently deleted</li>
                <li>3. Your account will be completely removed</li>
                <li>4. You&apos;ll be automatically logged out</li>
              </ul>
            </div>

            <div className="flex items-top space-x-2">
              <Checkbox 
                id="confirm-account-deletion" 
                checked={deleteConfirmed}
                onCheckedChange={(checked) => setDeleteConfirmed(checked as boolean)}
              />
              <label htmlFor="confirm-account-deletion" className="text-sm leading-5">
                I understand this action is permanent and I want to delete my account and all data.
              </label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount} 
              disabled={deleteLoading || !deleteConfirmed}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}