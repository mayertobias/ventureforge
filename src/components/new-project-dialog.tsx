"use client";

import * as React from "react";
import { Plus, Sparkles, ArrowRight, Lightbulb } from "lucide-react";
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

interface NewProjectDialogProps {
  hasExistingProjects?: boolean;
}

export function NewProjectDialog({ hasExistingProjects = false }: NewProjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const { project } = await response.json();
      setOpen(false);
      setProjectName("");
      
      // Redirect to project workspace
      window.location.href = `/projects/${project.id}`;
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleCreateProject}
            disabled={!projectName.trim() || isLoading}
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