
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OnboardingStep from '@/components/onboarding/OnboardingStep';
import OnboardingSummary from '@/components/onboarding/OnboardingSummary';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';

// Define the steps for onboarding
const steps = [
  {
    id: 'goal',
    title: "What brings you here?",
    description: "Select your primary goal",
    options: [
      { value: "productivity", label: "Boost Productivity", icon: "🎯" },
      { value: "focus", label: "Improve Focus", icon: "🧠" },
      { value: "task-management", label: "Better Task Management", icon: "📅" },
      { value: "big-goals", label: "Achieve Big Goals", icon: "🚀" },
    ],
  },
  {
    id: 'management-style',
    title: "How do you prefer to manage your tasks?",
    description: "Choose your preferred approach",
    options: [
      { value: "lists", label: "Lists & To-Dos", icon: "📋" },
      { value: "time-blocks", label: "Time Blocking", icon: "⏳" },
      { value: "goal-oriented", label: "Goal-Oriented Plans", icon: "🎯" },
      { value: "not-sure", label: "Not Sure Yet", icon: "❓" },
    ],
  },
  {
    id: 'daily-time',
    title: "How much time can you dedicate daily?",
    description: "Select your availability",
    options: [
      { value: "less-than-30", label: "Less than 30 minutes", icon: "🕐" },
      { value: "30min-1hr", label: "30 minutes - 1 hour", icon: "⏳" },
      { value: "1-2hrs", label: "1-2 hours", icon: "⏰" },
      { value: "as-needed", label: "As much as needed!", icon: "🚀" },
    ],
  },
  {
    id: 'about',
    title: "Tell us about yourself!",
    description: "Basic details help us personalize your experience",
    options: [
      { value: "height-weight", label: "Height & Weight", icon: "📏" },
      { value: "age", label: "Age", icon: "📆" },
      { value: "gender", label: "Gender", icon: "🚻" },
      { value: "skip", label: "Skip this step", icon: "⏭️" },
    ],
  },
  {
    id: 'mbti',
    title: "What's your MBTI Personality Type?",
    description: (
      <span>
        Don't know? <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Take a test
        </a>
      </span>
    ),
    options: [
      { value: "analyst", label: "Analyst", icon: "🧠", description: "INTJ, INTP, ENTJ, ENTP" },
      { value: "diplomat", label: "Diplomat", icon: "🕊️", description: "INFJ, INFP, ENFJ, ENFP" },
      { value: "sentinel", label: "Sentinel", icon: "🛡️", description: "ISTJ, ISFJ, ESTJ, ESFJ" },
      { value: "explorer", label: "Explorer", icon: "🧭", description: "ISTP, ISFP, ESTP, ESFP" },
      { value: "unknown", label: "I don't know / Prefer not to say", icon: "❓" },
    ],
  },
  {
    id: 'challenge',
    title: "What's your biggest challenge?",
    description: "Select your primary obstacle",
    options: [
      { value: "consistency", label: "Staying consistent", icon: "🏃" },
      { value: "time-management", label: "Time management", icon: "⏳" },
      { value: "tracking", label: "Tracking progress", icon: "📈" },
      { value: "procrastination", label: "Procrastination", icon: "💤" },
    ],
  },
  {
    id: 'motivation',
    title: "What motivates you?",
    description: "Choose what drives you most",
    options: [
      { value: "goals", label: "Reaching Goals", icon: "🎯" },
      { value: "rewards", label: "Winning Rewards", icon: "⭐" },
      { value: "streaks", label: "Maintaining Streaks", icon: "🔥" },
      { value: "progress", label: "Seeing Progress", icon: "⏳" },
    ],
  },
];

// Map for display in summary
const questionLabels: Record<string, string> = {
  'goal': 'What brings you here?',
  'management-style': 'Task management style',
  'daily-time': 'Daily time commitment',
  'about': 'Personal details',
  'mbti': 'MBTI personality type',
  'challenge': 'Biggest challenge',
  'motivation': 'Primary motivation',
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
  
  const handleNext = (selectedOption: string) => {
    const stepData = steps[currentStep - 1];
    const selectedLabel = stepData.options.find(opt => opt.value === selectedOption)?.label || selectedOption;
    
    setAnswers(prev => ({
      ...prev,
      [stepData.id]: selectedLabel
    }));
    
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
    setShowSummary(false);
  };
  
  const handleEdit = (step: number) => {
    setCurrentStep(step);
    setShowSummary(false);
  };
  
  const handleComplete = () => {
    // Save answers to localStorage or send to API
    localStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    
    // Show success toast
    toast({
      title: "Setup complete!",
      description: "Your personalized journey is ready to begin.",
    });
    
    // Redirect to dashboard
    navigate('/flow-tasks');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <AnimatePresence mode="wait">
            {!showSummary ? (
              <OnboardingStep
                key={`step-${currentStep}`}
                title={steps[currentStep - 1].title}
                description={typeof steps[currentStep - 1].description === 'string' 
                  ? steps[currentStep - 1].description as string 
                  : undefined}
                options={steps[currentStep - 1].options}
                currentStep={currentStep}
                totalSteps={steps.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                showPrevious={currentStep > 1}
              />
            ) : (
              <OnboardingSummary
                key="summary"
                answers={answers}
                questions={questionLabels}
                onEdit={handleEdit}
                onComplete={handleComplete}
              />
            )}
          </AnimatePresence>
        </Card>
      </div>
      
      <div className="text-center p-6 text-gray-600 text-sm">
        Take your productivity to the next level
      </div>
    </div>
  );
};

export default Onboarding;
