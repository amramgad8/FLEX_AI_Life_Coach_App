
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import OnboardingStep from '@/components/onboarding/OnboardingStep';
import OnboardingSummary from '@/components/onboarding/OnboardingSummary';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the types for our onboarding data
export interface OnboardingData {
  goal: string;
  taskManagement: string;
  timeCommitment: string;
  personalDetails: {
    height?: string;
    weight?: string;
    age?: string;
    gender?: string;
  };
  mbtiType: string;
  challenge: string;
  motivation: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    goal: '',
    taskManagement: '',
    timeCommitment: '',
    personalDetails: {},
    mbtiType: '',
    challenge: '',
    motivation: '',
  });

  // Define all steps in the onboarding process
  const steps = [
    {
      question: "What brings you here?",
      field: "goal",
      options: [
        { icon: "🎯", label: "Boost Productivity", value: "productivity" },
        { icon: "🧠", label: "Improve Focus", value: "focus" },
        { icon: "📅", label: "Better Task Management", value: "task-management" },
        { icon: "🚀", label: "Achieve Big Goals", value: "big-goals" },
      ]
    },
    {
      question: "How do you prefer to manage your tasks?",
      field: "taskManagement",
      options: [
        { icon: "📋", label: "Lists & To-Dos", value: "lists" },
        { icon: "⏳", label: "Time Blocking", value: "time-blocking" },
        { icon: "🎯", label: "Goal-Oriented Plans", value: "goal-oriented" },
        { icon: "❓", label: "Not Sure Yet", value: "unsure" },
      ]
    },
    {
      question: "How much time can you dedicate daily?",
      field: "timeCommitment",
      options: [
        { icon: "🕐", label: "Less than 30 min", value: "less-than-30" },
        { icon: "⏳", label: "30 min - 1 hour", value: "30-to-60" },
        { icon: "⏰", label: "1-2 hours", value: "60-to-120" },
        { icon: "🚀", label: "As much as needed!", value: "unlimited" },
      ]
    },
    {
      question: "Tell us about yourself!",
      field: "personalDetails",
      type: "personal-details",
      subfields: [
        { id: "height", label: "Height (cm)", icon: "📏" },
        { id: "weight", label: "Weight (kg)", icon: "⚖️" },
        { id: "age", label: "Age", icon: "📆" },
        { id: "gender", label: "Gender", icon: "🚻", options: ["Male", "Female", "Non-binary", "Prefer not to say"] }
      ]
    },
    {
      question: "What's your MBTI Personality Type?",
      field: "mbtiType",
      type: "mbti",
      options: [
        { label: "INTJ", value: "INTJ" },
        { label: "INTP", value: "INTP" },
        { label: "ENTJ", value: "ENTJ" },
        { label: "ENTP", value: "ENTP" },
        { label: "INFJ", value: "INFJ" },
        { label: "INFP", value: "INFP" },
        { label: "ENFJ", value: "ENFJ" },
        { label: "ENFP", value: "ENFP" },
        { label: "ISTJ", value: "ISTJ" },
        { label: "ISFJ", value: "ISFJ" },
        { label: "ESTJ", value: "ESTJ" },
        { label: "ESFJ", value: "ESFJ" },
        { label: "ISTP", value: "ISTP" },
        { label: "ISFP", value: "ISFP" },
        { label: "ESTP", value: "ESTP" },
        { label: "ESFP", value: "ESFP" },
        { label: "I don't know", value: "unknown" }
      ],
      helpText: "Don't know your type?",
      helpLink: "https://www.16personalities.com/free-personality-test"
    },
    {
      question: "What's your biggest challenge?",
      field: "challenge",
      options: [
        { icon: "🏃", label: "Staying consistent", value: "consistency" },
        { icon: "⏳", label: "Time management", value: "time-management" },
        { icon: "📈", label: "Tracking progress", value: "tracking-progress" },
        { icon: "💤", label: "Procrastination", value: "procrastination" },
      ]
    },
    {
      question: "What motivates you?",
      field: "motivation",
      options: [
        { icon: "🎯", label: "Reaching Goals", value: "goals" },
        { icon: "⭐", label: "Winning Rewards", value: "rewards" },
        { icon: "🔥", label: "Maintaining Streaks", value: "streaks" },
        { icon: "⏳", label: "Seeing Progress", value: "progress" },
      ]
    },
  ];

  // Handle selection change
  const handleSelectionChange = (field: string, value: any) => {
    setOnboardingData(prev => {
      // Handle the case where the field is personalDetails
      if (field === 'personalDetails') {
        return {
          ...prev,
          personalDetails: {
            ...prev.personalDetails,
            ...value
          }
        };
      }
      
      // Handle other fields
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Go to next step
  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle finish onboarding
  const handleFinish = () => {
    // Save onboarding data to local storage or API
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  // Check if current step is completed
  const isCurrentStepCompleted = () => {
    const step = steps[currentStep];
    
    if (!step) return true; // Summary page
    
    if (step.field === 'personalDetails') {
      // At least one personal detail should be filled
      return Object.values(onboardingData.personalDetails).some(value => value);
    }
    
    return !!onboardingData[step.field as keyof OnboardingData];
  };

  // Render the summary page when all steps are completed
  if (currentStep === steps.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
        <Navbar />
        <div className="container mx-auto py-20 px-4">
          <OnboardingSummary 
            data={onboardingData} 
            onEdit={(stepIndex) => setCurrentStep(stepIndex)}
            onFinish={handleFinish}
          />
        </div>
      </div>
    );
  }

  // Calculate progress
  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <Navbar />
      <div className="container mx-auto py-20 px-4">
        {/* Progress Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Start</span>
            <span>Step {currentStep + 1} of {steps.length + 1}</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <OnboardingStep
              step={steps[currentStep]}
              value={
                steps[currentStep]?.field === 'personalDetails'
                  ? onboardingData.personalDetails
                  : onboardingData[steps[currentStep]?.field as keyof OnboardingData]
              }
              onChange={(value) => handleSelectionChange(steps[currentStep].field, value)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between max-w-xl mx-auto mt-10">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className="w-32"
          >
            Back
          </Button>
          
          <Button
            onClick={goToNextStep}
            disabled={!isCurrentStepCompleted()}
            className="w-32 bg-flex-gradient text-white"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
