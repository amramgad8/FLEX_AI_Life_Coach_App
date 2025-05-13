import { useState } from 'react';
import AIPlannerForm from '../components/ai-planner/AIPlannerForm';
import ChatPlanCard from '../components/ai-planner/ChatPlanCard';
import { toast } from '@/components/ui/use-toast';

const AIPlannerFormPage = () => {
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/form', {
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
      setGeneratedPlan(data.plan);
      toast({
        title: 'Success',
        description: 'Your personalized plan has been generated!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-28 px-4">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">AI Planner (Form Mode)</h2>
          <AIPlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          {generatedPlan && (
            <div className="mt-8">
              <ChatPlanCard
                plan={generatedPlan}
                onAddTask={() => {}}
                onAddAllTasks={() => {}}
                onModifyPlan={() => {}}
                onSavePlan={() => {}}
                expandable={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPlannerFormPage; 