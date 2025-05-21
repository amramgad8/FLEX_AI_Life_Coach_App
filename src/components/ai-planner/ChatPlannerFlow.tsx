import React, { useState } from 'react';
import AIPlannerChat from './AIPlannerChat';
import { useTaskStore } from '@/stores/taskStore';
import { toast } from 'sonner';

export interface QuestionState {
  inputType: 'time' | 'text' | 'slider' | 'select' | 'multi-select';
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  sliderOptions?: { min: number; max: number; step: number; defaultValue: number };
}

interface Task {
  title: string;
  completed?: boolean;
}

interface Milestone {
  title: string;
  tasks: Task[];
}

interface Plan {
  header_note: string;
  goal: string;
  milestones: Milestone[];
}

const ChatPlannerFlow: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { addTask, addTasks } = useTaskStore();

  const handleUpdatePreferences = async (message: string, history: any[] = [], context: any = {}): Promise<{ message: string; plan?: any; context?: any; history?: any[]; plan_confirmed?: boolean }> => {
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
      return {
        message: data.response.message || data.response.plan,
        plan: data.response.plan,
        context: data.response.context,
        history: data.response.history,
        plan_confirmed: data.response.plan_confirmed
      };
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const handleComplete = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/chat/interactive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'generate',
          context: {},
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      if (data.response.plan) {
        try {
          const plan: Plan = JSON.parse(data.response.plan);
          toast.success('Plan generated successfully!');
          return plan;
        } catch (error) {
          console.error('Error parsing plan:', error);
          throw new Error('Invalid plan format');
        }
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      toast.error('Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTask = (task: Task) => {
    try {
      addTask({
        title: task.title,
        completed: false,
        createdAt: new Date(),
      });
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task. Please try again.');
    }
  };

  const handleAddAllTasks = (milestone: Milestone) => {
    try {
      const tasks = milestone.tasks.map(task => ({
        title: task.title,
        completed: false,
        createdAt: new Date(),
      }));
      addTasks(tasks);
      toast.success('All tasks added successfully!');
    } catch (error) {
      console.error('Error adding tasks:', error);
      toast.error('Failed to add tasks. Please try again.');
    }
  };

  const handleModifyPlan = () => {
    toast.info('Plan modification coming soon!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AIPlannerChat
        onUpdatePreferences={handleUpdatePreferences}
        onComplete={handleComplete}
        onAddTask={handleAddTask}
        onAddAllTasks={handleAddAllTasks}
        onModifyPlan={handleModifyPlan}
      />
    </div>
  );
};

export default ChatPlannerFlow;