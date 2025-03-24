
import React from 'react';
import { ScheduleItem } from '@/models/AIPlanner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import DailyScheduleItem from './DailyScheduleItem';

interface DailyScheduleProps {
  items: ScheduleItem[];
  showAddToTasks?: boolean;
}

const DailySchedule = ({ items, showAddToTasks = false }: DailyScheduleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-green-500" />
          Daily Schedule
        </CardTitle>
        <CardDescription>
          Your recommended daily routine based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {items.map((item, index) => (
            <DailyScheduleItem 
              key={index} 
              item={item} 
              showAddToTasks={showAddToTasks}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySchedule;
