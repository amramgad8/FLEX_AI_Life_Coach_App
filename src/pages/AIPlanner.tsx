import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIPlannerController } from '../controllers/AIPlannerController';
import { UserPreferences, AIGeneratedPlan } from '../models/AIPlanner';
import { toast } from '@/components/ui/use-toast';
import Navbar from '../components/Navbar';
import PlannerHeader from '../components/ai-planner/PlannerHeader';
import PreferencesForm from '../components/ai-planner/PreferencesForm';
import GeneratedPlan from '../components/ai-planner/GeneratedPlan';
import AIPlannerChat from '../components/ai-planner/AIPlannerChat';
import ModifyPlanDialog from '../components/ai-planner/ModifyPlanDialog';
import { OnboardingData } from './Onboarding';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import AIPlannerForm from '../components/ai-planner/AIPlannerForm';
import { Card } from '../components/ui/card';
import { Lightbulb } from 'lucide-react';
import ChatPlanCard from '../components/ai-planner/ChatPlanCard';
import { Button } from '@/components/ui/button';
import { ChangeEvent } from 'react';

// Add a wrapper for AIPlannerForm to handle the extra props
const EnhancedAIPlannerForm = (props: any) => {
  const { 
    preferences, 
    onInputChange, 
    onNumberChange, 
    isGenerating, 
    onGeneratePlan, 
    hasGeneratedPlan, 
    ...formProps 
  } = props;
  
  // We only pass through the props that AIPlannerForm actually accepts
  return <AIPlannerForm {...formProps} />;
};

const AIPlanner = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<UserPreferences>(
    AIPlannerController.getSamplePreferences()
  );
  const [generatedPlan, setGeneratedPlan] = useState<AIGeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [useChatInterface, setUseChatInterface] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [chatContext, setChatContext] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const { toast: useToastToast } = useToast();

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

  const handleModifyPlan = () => {
    setShowModifyDialog(true);
  };

  const handleUpdatePlan = async (updatedPreferences: UserPreferences) => {
    setPreferences(updatedPreferences);
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
      
      const plan = await AIPlannerController.generatePlan(updatedPreferences, onboardingData);
      setGeneratedPlan(plan);
      
      toast({
        title: "Plan Updated!",
        description: "Your personalized schedule has been updated.",
      });
    } catch (error) {
      console.error("Error generating plan:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your plan. Please try again.",
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
    setIsEditing(true); 
  };

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ form_data: formData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      const data = await response.json();
      setFormData(formData);
      setGeneratedPlan(data.plan);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Your personalized plan has been generated!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatInteraction = async (message: string) => {
    setIsLoading(true);
    setHasUserSentMessage(true);
    try {
      const response = await fetch('http://localhost:8000/api/chat/interactive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: chatContext,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process chat message');
      }
      
      const data = await response.json();
      
      setChatContext(prev => ({
        ...prev,
        ...data.response.context,
      }));

      return data.response.message;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process message. Please try again.",
        variant: "destructive",
      });
      return "I apologize, but I encountered an error. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = (task: any) => {
    toast({
      title: "Task Added",
      description: `Added task: ${task.title}`,
    });
  };

  const handleAddAllTasks = (milestone: any) => {
    toast({
      title: "Tasks Added",
      description: `Added ${milestone.tasks.length} tasks from ${milestone.title}`,
    });
  };

  function cleanAndParsePlan(plan: any) {
    if (typeof plan === 'string') {
      let cleaned = plan.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }
      try {
        return JSON.parse(cleaned);
      } catch {
        return null;
      }
    }
    return plan;
  }

  function renderPlan(plan: any) {
    const parsedPlan = cleanAndParsePlan(plan);
    if (!parsedPlan || !parsedPlan.milestones) {
      return (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600">Invalid plan format. Showing raw data:</p>
          <pre className="whitespace-pre-wrap text-sm text-gray-800 mt-2">
            {typeof plan === 'string' ? plan : JSON.stringify(plan, null, 2)}
          </pre>
        </div>
      );
    }
    return (
      <ChatPlanCard
        plan={parsedPlan}
        onAddTask={handleAddTask}
        onAddAllTasks={handleAddAllTasks}
        onModifyPlan={handleModifyPlan}
        onSavePlan={savePlan}
        expandable={true}
      />
    );
  }

  const generatePlanFromChat = async () => {
    setIsGenerating(true);
    try {
      const planPreferences = {
        ...preferences,
        ...chatContext.preferences,
      };
      
      const plan = await AIPlannerController.generatePlan(planPreferences);
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

  const generateFormPlan = async () => {
    setIsGenerating(true);
    try {
      const plan = await AIPlannerController.generatePlan(preferences);
      setGeneratedPlan(plan);
      setIsEditing(false);
      toast({
        title: "Plan Generated!",
        description: "Your personalized schedule is ready to review.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your plan.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateChatPlan = async () => {
    setIsGenerating(true);
    try {
      const planPreferences = { ...preferences, ...chatContext };
      const plan = await AIPlannerController.generatePlan(planPreferences);
      setGeneratedPlan(plan);
      setIsEditing(false);
      toast({
        title: "Plan Generated!",
        description: "Your personalized schedule is ready to review.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your plan.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Add an effect to hide the generate button when chat is closed
  useEffect(() => {
    // Listen for clicks on the chat toggle button
    const handleClick = (event: MouseEvent) => {
      // Cast as HTMLElement to access textContent
      const target = event.target as HTMLElement;
      
      // Check if the clicked element is a button and contains text related to the chat
      if (target.tagName === 'BUTTON') {
        // If the button text indicates closing the chat, hide the generate button
        if (target.textContent?.includes('Close Chat')) {
          setHasUserSentMessage(false);
        }
      }
    };
    
    // Add event listener to the document
    document.addEventListener('click', handleClick);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto py-28 px-4">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <PlannerHeader />

          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border">
              <button
                onClick={toggleInterface}
                className={`text-sm px-4 py-2 rounded-full transition-colors ${
                  !useChatInterface 
                    ? 'bg-flex-green text-white font-medium' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Form Mode
              </button>
              <button
                onClick={toggleInterface}
                className={`text-sm px-4 py-2 rounded-full transition-colors ${
                  useChatInterface 
                    ? 'bg-flex-green text-white font-medium' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Chat Mode
              </button>
            </div>
          </div>

          {useChatInterface ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                <h2 className="text-xl font-semibold text-flex-text flex items-center">
                  <span className="bg-flex-green text-white p-1 rounded-md mr-2">AI</span>
                  AI Planner Agent
                </h2>
                <p className="text-gray-600">
                  I'll help you create a personalized schedule based on your preferences and goals.
                  Start a chat below to tell me about your needs, and I'll generate an optimized plan for you.
                </p>
                
                <AIPlannerChat 
                  onUpdatePreferences={handleChatInteraction}
                  onComplete={() => {
                    useToastToast({
                      title: "Success",
                      description: "Chat interaction completed successfully",
                    });
                  }}
                  onAddTask={handleAddTask}
                  onAddAllTasks={handleAddAllTasks}
                  onModifyPlan={handleModifyPlan}
                />
                
                {hasUserSentMessage && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={generateChatPlan}
                      className="bg-flex-green hover:bg-flex-green-dark text-white py-2 px-6 rounded-full shadow-md transition-all"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </span>
                      ) : (
                        'Generate My Plan'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <EnhancedAIPlannerForm 
                preferences={preferences}
                onInputChange={handleInputChange}
                onNumberChange={handleNumberChange}
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                isGenerating={isGenerating}
                onGeneratePlan={generateFormPlan}
                hasGeneratedPlan={!!generatedPlan}
              />
            </motion.div>
          )}

          {generatedPlan && !isEditing && (
            <Card className="p-6 mt-4">
              <h3 className="text-lg font-semibold mb-2">Your Personalized Plan</h3>
              {renderPlan(generatedPlan)}
            </Card>
          )}

          <ModifyPlanDialog 
            isOpen={showModifyDialog}
            onClose={() => setShowModifyDialog(false)}
            preferences={preferences}
            onSave={handleUpdatePlan}
          />
        </div>
      </div>
    </div>
  );
};

export default AIPlanner;