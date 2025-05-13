import { useState } from 'react';
import AIPlannerChat from '../components/ai-planner/AIPlannerChat';
import { toast } from 'sonner';

const AIPlannerChatPage = () => {
  // No form state, only chat
  const handleUpdatePreferences = async (message: string, history: any[], context: any): Promise<any> => {
    try {
      const response = await fetch('/api/chat/interactive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
          history,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const handleComplete = async () => {
    toast.info('Plan generation via chat is handled interactively.');
  };

  const handleAddTask = () => {};
  const handleAddAllTasks = () => {};
  const handleModifyPlan = () => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-28 px-4">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">AI Planner (Chat Mode)</h2>
          <AIPlannerChat
            onUpdatePreferences={handleUpdatePreferences}
            onComplete={handleComplete}
            onAddTask={handleAddTask}
            onAddAllTasks={handleAddAllTasks}
            onModifyPlan={handleModifyPlan}
          />
        </div>
      </div>
    </div>
  );
};

export default AIPlannerChatPage; 