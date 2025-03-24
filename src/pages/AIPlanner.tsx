import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIPlannerController } from '../controllers/AIPlannerController';
import { UserPreferences, AIGeneratedPlan } from '../models/AIPlanner';
import { toast } from '@/components/ui/use-toast';
import Navbar from '../components/Navbar';
import PlannerHeader from '../components/ai-planner/PlannerHeader';
import PreferencesForm from '../components/ai-planner/PreferencesForm';
import GeneratedPlan from '../components/ai-planner/GeneratedPlan';
import ChatPlannerFlow from '../components/ai-planner/ChatPlannerFlow';
import { OnboardingData } from './Onboarding';
import { motion } from 'framer-motion';

const AIPlanner = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<UserPreferences>(
    AIPlannerController.getSamplePreferences()
  );
  const [generatedPlan, setGeneratedPlan] = useState<AIGeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [useChatInterface, setUseChatInterface] = useState(true);

  useEffect(() => {
    const onboardingDataStr = localStorage.getItem('onboardingData');
    if (onboardingDataStr) {
      try {
        const onboardingData: OnboardingData = JSON.parse(onboardingDataStr);
        
        const convertedPreferences = convertOnboardingDataToPreferences(onboardingData);
        setPreferences(prev => ({
          ...prev,
          ...convertedPreferences
        }));
        
        const fromOnboarding = localStorage.getItem('fromOnboarding');
        if (fromOnboarding === 'true') {
          localStorage.removeItem('fromOnboarding');
          setTimeout(() => {
            generatePlan();
          }, 500);
        }
      } catch (error) {
        console.error("Error parsing onboarding data:", error);
      }
    }
  }, []);

  const convertOnboardingDataToPreferences = (data: OnboardingData): Partial<UserPreferences> => {
    const preferences: Partial<UserPreferences> = {};
    
    if (data.timeCommitment) {
      switch (data.timeCommitment) {
        case 'less-than-30':
          preferences.wakeUpTime = "07:30";
          preferences.breakDuration = 5;
          preferences.focusPeriods = 2;
          break;
        case '30-to-60':
          preferences.wakeUpTime = "07:00";
          preferences.breakDuration = 10;
          preferences.focusPeriods = 3;
          break;
        case '60-to-120':
          preferences.wakeUpTime = "06:30";
          preferences.breakDuration = 15;
          preferences.focusPeriods = 4;
          break;
        case 'unlimited':
          preferences.wakeUpTime = "06:00";
          preferences.breakDuration = 15;
          preferences.focusPeriods = 5;
          break;
      }
    }
    
    if (data.goal) {
      switch (data.goal) {
        case 'productivity':
          preferences.primaryGoal = "Boost Productivity";
          break;
        case 'focus':
          preferences.primaryGoal = "Improve Focus";
          break;
        case 'task-management':
          preferences.primaryGoal = "Better Task Management";
          break;
        case 'big-goals':
          preferences.primaryGoal = "Achieve Big Goals";
          break;
      }
    }
    
    if (preferences.wakeUpTime) {
      const [hours] = preferences.wakeUpTime.split(':').map(Number);
      const sleepHour = (hours + 16) % 24;
      preferences.sleepTime = `${sleepHour.toString().padStart(2, '0')}:00`;
    }
    
    return preferences;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPrefs
    }));
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    
    try {
      const onboardingDataStr = localStorage.getItem('onboardingData');
      let onboardingData: OnboardingData | null = null;
      
      if (onboardingDataStr) {
        try {
          onboardingData = JSON.parse(onboardingDataStr);
        } catch (error) {
          console.error("Error parsing onboarding data:", error);
        }
      }
      
      const plan = await AIPlannerController.generatePlan(preferences, onboardingData);
      setGeneratedPlan(plan);
      setIsEditing(false);
      
      toast({
        title: "Plan Generated!",
        description: "Your personalized schedule is ready to review.",
      });
    } catch (error) {
      console.error("Error generating plan:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = () => {
    toast({
      title: "Plan Saved!",
      description: "Your personalized schedule has been saved to your dashboard.",
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const toggleInterface = () => {
    setUseChatInterface(!useChatInterface);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <Navbar />
      <div className="container mx-auto py-28 px-4">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <PlannerHeader />

          <div className="flex justify-end mb-2">
            <button
              onClick={toggleInterface}
              className="text-sm text-flex-green underline"
            >
              Switch to {useChatInterface ? 'form' : 'chat'} interface
            </button>
          </div>

          {isEditing ? (
            useChatInterface ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ChatPlannerFlow
                  preferences={preferences}
                  onUpdatePreferences={updatePreferences}
                  onComplete={generatePlan}
                  isGenerating={isGenerating}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <PreferencesForm
                  preferences={preferences}
                  isEditing={isEditing}
                  isGenerating={isGenerating}
                  onInputChange={handleInputChange}
                  onNumberChange={handleNumberChange}
                  onGeneratePlan={generatePlan}
                  hasGeneratedPlan={!!generatedPlan}
                />
              </motion.div>
            )
          ) : null}

          {generatedPlan && (
            <GeneratedPlan
              plan={generatedPlan}
              onModify={() => setIsEditing(true)}
              onSave={savePlan}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPlanner;
