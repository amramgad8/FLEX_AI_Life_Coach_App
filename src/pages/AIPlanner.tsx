
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIPlannerController } from '../controllers/AIPlannerController';
import { UserPreferences, AIGeneratedPlan } from '../models/AIPlanner';
import { OnboardingData } from './Onboarding';
import { toast } from '@/components/ui/use-toast';
import Navbar from '../components/Navbar';
import PlannerHeader from '../components/ai-planner/PlannerHeader';
import PreferencesForm from '../components/ai-planner/PreferencesForm';
import GeneratedPlan from '../components/ai-planner/GeneratedPlan';

const AIPlanner = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<UserPreferences>(
    AIPlannerController.getSamplePreferences()
  );
  const [generatedPlan, setGeneratedPlan] = useState<AIGeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  // Load onboarding data if available
  useEffect(() => {
    const storedData = localStorage.getItem('onboardingData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as OnboardingData;
        setOnboardingData(parsedData);
        
        // Use onboarding data to personalize preferences
        const updatedPreferences: UserPreferences = {
          ...preferences
        };
        
        // Update primary goal based on user's goal from onboarding
        if (parsedData.goal) {
          switch (parsedData.goal) {
            case 'productivity':
              updatedPreferences.primaryGoal = 'Increase Productivity';
              break;
            case 'focus':
              updatedPreferences.primaryGoal = 'Improve Focus';
              break;
            case 'task-management':
              updatedPreferences.primaryGoal = 'Better Task Management';
              break;
            case 'big-goals':
              updatedPreferences.primaryGoal = 'Achieve Big Goals';
              break;
          }
        }
        
        // Adjust focus periods based on time commitment
        if (parsedData.timeCommitment) {
          switch (parsedData.timeCommitment) {
            case 'less-than-30':
              updatedPreferences.focusPeriods = 2;
              break;
            case '30-to-60':
              updatedPreferences.focusPeriods = 3;
              break;
            case '60-to-120':
              updatedPreferences.focusPeriods = 5;
              break;
            case 'unlimited':
              updatedPreferences.focusPeriods = 8;
              break;
          }
        }
        
        setPreferences(updatedPreferences);
      } catch (error) {
        console.error("Error parsing onboarding data:", error);
      }
    }
  }, []);

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

  const generatePlan = async () => {
    setIsGenerating(true);
    
    try {
      // Pass onboarding data to generate a more personalized plan
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <Navbar />
      <div className="container mx-auto py-28 px-4">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <PlannerHeader 
            personalizedGreeting={onboardingData ? `Based on your ${onboardingData.mbtiType} personality type` : undefined}
          />

          <PreferencesForm
            preferences={preferences}
            isEditing={isEditing}
            isGenerating={isGenerating}
            onInputChange={handleInputChange}
            onNumberChange={handleNumberChange}
            onGeneratePlan={generatePlan}
            hasGeneratedPlan={!!generatedPlan}
          />

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
