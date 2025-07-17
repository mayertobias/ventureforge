"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Sparkles, Search, FileText, Calculator, Presentation, Target } from "lucide-react";

const steps = [
  {
    id: "idea",
    title: "Idea Spark",
    description: "Generate unique business ideas",
    icon: Sparkles,
  },
  {
    id: "research",
    title: "Deep Research",
    description: "Comprehensive market analysis",
    icon: Search,
  },
  {
    id: "blueprint",
    title: "Blueprint",
    description: "Business model & strategy",
    icon: FileText,
  },
  {
    id: "financials",
    title: "Financials",
    description: "Financial projections & metrics",
    icon: Calculator,
  },
  {
    id: "pitch",
    title: "Pitch Perfect",
    description: "Investor-ready presentation",
    icon: Presentation,
  },
  {
    id: "gtm",
    title: "Go-to-Market",
    description: "Launch strategy & tactics",
    icon: Target,
  },
];

interface ProjectStepperProps {
  currentStep: string;
  completedSteps: string[];
  onStepClick?: (stepId: string) => void;
}

export function ProjectStepper({ currentStep, completedSteps, onStepClick }: ProjectStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted || isCurrent || index <= currentStepIndex + 1;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center space-y-2 flex-1",
                isClickable && onStepClick && "cursor-pointer",
                !isClickable && "opacity-50"
              )}
              onClick={() => isClickable && onStepClick?.(step.id)}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors",
                  isCompleted && "bg-green-500 border-green-500 text-white",
                  isCurrent && !isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isCurrent && !isCompleted && "border-muted bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <div className="text-center">
                <div className={cn(
                  "font-medium text-sm",
                  isCurrent && "text-primary",
                  isCompleted && "text-green-600",
                  !isCurrent && !isCompleted && "text-muted-foreground"
                )}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground max-w-20">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-4 px-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1 flex-1 mx-1 rounded-full transition-colors",
              index < currentStepIndex ? "bg-green-500" : 
              index === currentStepIndex ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}