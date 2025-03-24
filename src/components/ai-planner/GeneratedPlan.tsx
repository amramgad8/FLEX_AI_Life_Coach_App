
import React from 'react';
import { AIGeneratedPlan } from '../../models/AIPlanner';
import DailySchedule from './DailySchedule';
import WeeklyFocus from './WeeklyFocus';
import SuggestedHabits from './SuggestedHabits';
import PlanActions from './PlanActions';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, CalendarClock } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { toast } from '@/components/ui/use-toast';

interface GeneratedPlanProps {
  plan: AIGeneratedPlan;
  onModify: () => void;
  onSave: () => void;
}

const GeneratedPlan = ({ plan, onModify, onSave }: GeneratedPlanProps) => {
  const { convertAIPlanToTasks } = useTasks();

  const handleAddToTasks = () => {
    convertAIPlanToTasks(plan.dailySchedule);
    toast({
      title: "Added to tasks",
      description: "Plan tasks have been added to your calendar.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleAddToTasks}
          className="gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          Add All to My Tasks
        </Button>
      </div>

      <DailySchedule items={plan.dailySchedule} showAddToTasks />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeeklyFocus focusAreas={plan.weeklyFocus} />
        <SuggestedHabits habits={plan.suggestedHabits} />
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-lg font-medium text-blue-700 mb-2">Resources & Tips</h3>
        <ul className="space-y-2 text-sm">
          {plan.resources?.map((resource, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-blue-500">•</span>
              {resource}
            </li>
          ))}
          {!plan.resources?.length && (
            <li className="text-blue-700">No additional resources for this plan.</li>
          )}
        </ul>
      </div>

      <PlanActions onModify={onModify} onSave={onSave} />
    </div>
  );
};

export default GeneratedPlan;
