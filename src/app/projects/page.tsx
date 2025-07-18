"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar, BarChart3, ArrowRight, Trash2, Download, Eye, CheckCircle, Lock } from "lucide-react";
import { NewProjectDialog } from "@/components/new-project-dialog";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  ideaOutput?: any;
  researchOutput?: any;
  blueprintOutput?: any;
  financialOutput?: any;
  pitchOutput?: any;
  gtmOutput?: any;
}

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectProgress = (project: Project) => {
    const steps = [
      project.ideaOutput,
      project.researchOutput,
      project.blueprintOutput,
      project.financialOutput,
      project.pitchOutput,
      project.gtmOutput,
    ];
    const completed = steps.filter(Boolean).length;
    return { completed, total: 6, percentage: (completed / 6) * 100 };
  };

  const getProjectStatus = (project: Project) => {
    const progress = getProjectProgress(project);
    if (progress.completed === 0) return { label: "Not Started", color: "bg-gray-100 text-gray-600", icon: null };
    if (progress.completed === 6) return { label: "Completed", color: "bg-green-100 text-green-600", icon: CheckCircle };
    return { label: "In Progress", color: "bg-blue-100 text-blue-600", icon: null };
  };

  const getCompletedStepNames = (project: Project) => {
    const steps = [
      { name: "Idea", completed: !!project.ideaOutput },
      { name: "Research", completed: !!project.researchOutput },
      { name: "Blueprint", completed: !!project.blueprintOutput },
      { name: "Financials", completed: !!project.financialOutput },
      { name: "Pitch", completed: !!project.pitchOutput },
      { name: "GTM", completed: !!project.gtmOutput },
    ];
    return steps.filter(step => step.completed).map(step => step.name);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your business planning projects and track progress
          </p>
        </div>
        <NewProjectDialog hasExistingProjects={projects.length > 0} />
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const progress = getProjectProgress(project);
            const status = getProjectStatus(project);
            const completedSteps = getCompletedStepNames(project);
            const isCompleted = progress.completed === 6;
            
            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {project.name}
                        <div className="group relative">
                          <Lock className="h-4 w-4 text-green-600" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            This project is encrypted with a key only you can access
                          </div>
                        </div>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={status.color}>
                      {status.icon && <status.icon className="h-3 w-3 mr-1" />}
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.completed}/{progress.total} steps</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Completed Steps */}
                  {completedSteps.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Completed Sections:</div>
                      <div className="flex flex-wrap gap-1">
                        {completedSteps.map((step) => (
                          <Badge key={step} variant="outline" className="text-xs">
                            {step}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isCompleted ? (
                      <>
                        <Button asChild className="flex-1">
                          <Link href={`/projects/${project.id}?step=complete`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/projects/${project.id}?step=complete`}>
                            <Download className="h-4 w-4" />
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <Button asChild className="flex-1">
                        <Link href={`/projects/${project.id}`}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Continue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <PlusCircle className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No projects yet</h3>
              <p className="text-muted-foreground max-w-md">
                Create your first project to start building your business plan with AI assistance.
              </p>
            </div>
            <NewProjectDialog hasExistingProjects={false} />
          </div>
        </div>
      )}
    </div>
  );
}