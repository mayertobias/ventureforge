import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ProgressStep } from './progress-step';

interface VentureForgeLoaderProps {
  stage: string;
  steps?: Array<{
    text: string;
    completed?: boolean;
    loading?: boolean;
    pending?: boolean;
  }>;
}

export function VentureForgeLoader({ stage, steps }: VentureForgeLoaderProps) {
  const defaultSteps = [
    { text: "Gathering market intelligence", completed: true },
    { text: "Analyzing competition", loading: true },
    { text: "Generating recommendations", pending: true },
    { text: "Crafting strategic insights", pending: true }
  ];

  const progressSteps = steps || defaultSteps;

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <motion.div
          className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <div className="absolute inset-4 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
      </motion.div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Forging Your {stage}...
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Our AI is analyzing market data and trends
        </p>
      </motion.div>
      
      <motion.div 
        className="w-full max-w-xs space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {progressSteps.map((step, index) => (
          <ProgressStep
            key={index}
            text={step.text}
            completed={step.completed}
            loading={step.loading}
            pending={step.pending}
          />
        ))}
      </motion.div>
      
      <motion.div
        className="mt-4 px-4 py-2 bg-blue-50 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-blue-600 font-medium">
          This may take 1-5 minutes
        </p>
      </motion.div>
    </div>
  );
}