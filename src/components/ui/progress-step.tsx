import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface ProgressStepProps {
  text: string;
  completed?: boolean;
  loading?: boolean;
  pending?: boolean;
}

export function ProgressStep({ text, completed, loading, pending }: ProgressStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-3 py-2"
    >
      <div className="flex-shrink-0">
        {completed && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        {loading && (
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        )}
        {pending && (
          <Circle className="h-5 w-5 text-gray-300" />
        )}
      </div>
      <span className={`text-sm ${
        completed ? 'text-green-600 font-medium' : 
        loading ? 'text-blue-600 font-medium' : 
        'text-gray-500'
      }`}>
        {text}
      </span>
    </motion.div>
  );
}