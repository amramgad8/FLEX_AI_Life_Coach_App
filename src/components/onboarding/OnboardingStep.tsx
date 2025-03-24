
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface OnboardingOption {
  value: string;
  label: string;
  icon: string;
  description?: string;
}

interface OnboardingStepProps {
  title: string;
  description?: string;
  options: OnboardingOption[];
  currentStep: number;
  totalSteps: number;
  onNext: (selectedOption: string) => void;
  onPrevious: () => void;
  showPrevious?: boolean;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  options,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  showPrevious = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center max-w-md mx-auto"
    >
      {/* Progress indicator */}
      <div className="w-full mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step title and description */}
      <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
      {description && <p className="text-gray-600 text-center mb-6">{description}</p>}

      {/* Option buttons */}
      <div className="grid grid-cols-1 gap-4 w-full mb-8">
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => onNext(option.value)}
            variant="outline"
            className="flex items-center justify-start p-4 h-auto text-lg hover:bg-slate-100 border-2 hover:border-blue-500 transition-all"
          >
            <span className="text-2xl mr-3">{option.icon}</span>
            <div className="text-left">
              <div className="font-medium">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-500">{option.description}</div>
              )}
            </div>
          </Button>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex w-full justify-between">
        {showPrevious ? (
          <Button 
            onClick={onPrevious} 
            variant="outline"
          >
            Back
          </Button>
        ) : <div></div>}
      </div>
    </motion.div>
  );
};

export default OnboardingStep;
