
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Edit } from 'lucide-react';

interface OnboardingSummaryProps {
  answers: Record<string, string>;
  questions: Record<string, string>;
  onEdit: (step: number) => void;
  onComplete: () => void;
}

const OnboardingSummary: React.FC<OnboardingSummaryProps> = ({
  answers,
  questions,
  onEdit,
  onComplete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-2">Your Journey Summary</h2>
      <p className="text-gray-600 text-center mb-6">
        Here's what we know about you so far. You can edit any of these answers.
      </p>

      <div className="w-full bg-white rounded-lg shadow-sm border p-6 mb-8">
        {Object.entries(answers).map(([key, value], index) => (
          <div key={key} className="flex justify-between items-center py-3 border-b last:border-none">
            <div>
              <h3 className="font-medium">{questions[key]}</h3>
              <p className="text-gray-600">{value}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(index + 1)}
              className="text-gray-500 hover:text-blue-600"
            >
              <Edit size={16} />
            </Button>
          </div>
        ))}
      </div>

      <Button
        onClick={onComplete}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2"
      >
        <Check size={18} />
        Complete Setup
      </Button>

      <p className="text-sm text-gray-500 mt-4 text-center">
        You can always update your preferences later in settings.
      </p>
    </motion.div>
  );
};

export default OnboardingSummary;
