"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingStep {
  title: string;
  content: string;
  target: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to VentureForge AI! 🚀',
    content: 'These are your Forge Credits. Each AI generation costs credits. You start with 100 credits to explore all features!',
    target: '.credit-display',
  },
  {
    title: 'Create Your First Project',
    content: 'Start here! Create your first project to begin building your business plan with AI assistance.',
    target: '.new-project-button',
  },
  {
    title: 'Your Business Building Journey',
    content: 'Follow 6 steps to create a complete business plan: Ideas → Research → Blueprint → Financials → Pitch → GTM',
    target: '.project-stepper',
  }
];

export function OnboardingTour() {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('venture-forge-tour');
    if (!hasSeenTour) {
      // Delay tour start to ensure components are mounted
      setTimeout(() => {
        setShowTour(true);
      }, 2000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('venture-forge-tour', 'completed');
    setShowTour(false);
  };

  const handleSkip = () => {
    localStorage.setItem('venture-forge-tour', 'skipped');
    setShowTour(false);
  };

  if (!showTour) return null;

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <AnimatePresence>
      {showTour && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={handleSkip}
          />
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] max-w-md w-full mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 border">
              {/* Close button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Progress indicator */}
              <div className="flex space-x-2 mb-4">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.content}
                </p>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} of {onboardingSteps.length}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                  >
                    Skip Tour
                  </Button>
                  
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="btn-primary"
                  >
                    {isLastStep ? 'Get Started!' : 'Next'}
                    {!isLastStep && <ArrowRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}