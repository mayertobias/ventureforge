"use client";

import * as React from "react";
import { Plus, Sparkles, ArrowRight, Lightbulb, Shield, Database, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

interface NewProjectDialogProps {
  hasExistingProjects?: boolean;
}

interface UserPreferences {
  allowPersistentStorage: boolean;
  defaultStorageMode?: string;
}

export function NewProjectDialog({ hasExistingProjects = false }: NewProjectDialogProps) {
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState("");
  const [storageMode, setStorageMode] = React.useState<"MEMORY_ONLY" | "PERSISTENT">("MEMORY_ONLY");
  const [understandsMemoryMode, setUnderstandsMemoryMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [userPreferences, setUserPreferences] = React.useState<UserPreferences | null>(null);

  // Fetch user preferences when dialog opens
  React.useEffect(() => {
    if (open && session?.user) {
      fetchUserPreferences();
    }
  }, [open, session]);

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const prefs = await response.json();
        setUserPreferences(prefs);
        // Set default storage mode based on user preference
        if (prefs.allowPersistentStorage && prefs.defaultStorageMode) {
          setStorageMode(prefs.defaultStorageMode as "MEMORY_ONLY" | "PERSISTENT");
        }
      }
    } catch (error) {
      console.error('Failed to fetch user preferences:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    
    // For memory-only projects, require user confirmation
    if (storageMode === "MEMORY_ONLY" && !understandsMemoryMode) {
      alert("Please confirm that you understand memory-only storage before creating the project.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: projectName,
          persistentStorage: storageMode === "PERSISTENT"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const { project } = await response.json();
      setOpen(false);
      resetForm();
      
      // Redirect to project workspace
      window.location.href = `/projects/${project.id}`;
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProjectName("");
    setStorageMode("MEMORY_ONLY");
    setUnderstandsMemoryMode(false);
  };

  const handleDialogClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button 
          className={`${
            hasExistingProjects 
              ? "justify-center" 
              : "w-full justify-center"
          } bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200`} 
          size={hasExistingProjects ? "default" : "lg"}
        >
          {hasExistingProjects ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Start Your First Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
            <Lightbulb className="h-8 w-8 text-blue-600 mx-auto" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">Turn Your Idea Into Reality</DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Give your project a memorable name. This will be the foundation of your business venture.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Project Name
            </Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., EcoFriendly Food Delivery App"
              className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleCreateProject();
                }
              }}
            />
            <p className="text-xs text-gray-500">
              Choose a name that reflects your vision and target market
            </p>
          </div>

          {/* Storage Mode Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Data Storage Preference
            </Label>
            <RadioGroup value={storageMode} onValueChange={(value) => setStorageMode(value as "MEMORY_ONLY" | "PERSISTENT")}>
              <div className="space-y-3">
                {/* Memory Only Option */}
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="MEMORY_ONLY" id="memory-only" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="memory-only" className="cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <Shield className="h-4 w-4 text-green-600" />
                        Memory Only (Recommended)
                      </div>
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Maximum privacy - your data is stored temporarily in memory only
                    </p>
                  </div>
                </div>

                {/* Persistent Storage Option */}
                <div className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value="PERSISTENT" 
                    id="persistent" 
                    className="mt-1" 
                    disabled={!userPreferences?.allowPersistentStorage}
                  />
                  <div className="flex-1">
                    <Label htmlFor="persistent" className={`cursor-pointer ${!userPreferences?.allowPersistentStorage ? 'opacity-50' : ''}`}>
                      <div className="flex items-center gap-2 font-medium">
                        <Database className="h-4 w-4 text-blue-600" />
                        Persistent Storage
                        {!userPreferences?.allowPersistentStorage && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Disabled</span>
                        )}
                      </div>
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      {userPreferences?.allowPersistentStorage 
                        ? "Your data will be saved in our secure database for easy access"
                        : "Enable persistent storage in your account settings to use this option"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Memory Mode Confirmation */}
          {storageMode === "MEMORY_ONLY" && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Privacy-First Storage</AlertTitle>
              <AlertDescription className="space-y-3">
                <p className="text-sm">
                  With memory-only storage, your project data:
                </p>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• Is stored temporarily in your browser session</li>
                  <li>• Expires after 24 hours automatically</li>
                  <li>• Can be exported at any time as a download</li>
                  <li>• Will be permanently deleted when you close your browser</li>
                </ul>
                <div className="flex items-top space-x-2 mt-3">
                  <Checkbox 
                    id="understand-memory" 
                    checked={understandsMemoryMode}
                    onCheckedChange={(checked) => setUnderstandsMemoryMode(checked as boolean)}
                  />
                  <Label htmlFor="understand-memory" className="text-xs leading-4">
                    I understand that my data will not be permanently saved and I should export my project regularly.
                  </Label>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">What happens next?</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                AI will analyze your idea and generate insights
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                Get market research and competitive analysis
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                Receive a complete business plan and strategy
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="space-x-3">
          <Button
            variant="outline"
            onClick={() => handleDialogClose(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleCreateProject}
            disabled={!projectName.trim() || isLoading || (storageMode === "MEMORY_ONLY" && !understandsMemoryMode)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Creating Your Project...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}