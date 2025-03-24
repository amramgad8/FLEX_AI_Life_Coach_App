
import React from 'react';
import { ScheduleItem } from '@/models/AIPlanner';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

interface DailyScheduleItemProps {
  item: ScheduleItem;
  showAddToTasks?: boolean;
}

const DailyScheduleItem = ({ item, showAddToTasks = false }: DailyScheduleItemProps) => {
  const { createTask } = useTasks();

  const handleAddToTasks = () => {
    createTask({
      title: item.activity,
      completed: false,
      priority: item.priority || 'medium',
      category: 'other',
      duration: item.duration || 30,
      aiGenerated: true,
      resources: item.resources
    });
  };

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0 group">
      <div className="flex items-center space-x-4">
        <div className="font-medium min-w-16">{item.time}</div>
        <div className="flex-1">
          <div className="font-medium">{item.activity}</div>
          {item.duration && (
            <div className="text-sm text-gray-500">{item.duration} minutes</div>
          )}
        </div>
      </div>

      {showAddToTasks && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleAddToTasks}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DailyScheduleItem;
