
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIPlannerController } from '../controllers/AIPlannerController';
import { UserPreferences, AIGeneratedPlan } from '../models/AIPlanner';
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
      const plan = await AIPlannerController.generatePlan(preferences);
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
          <PlannerHeader />

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
