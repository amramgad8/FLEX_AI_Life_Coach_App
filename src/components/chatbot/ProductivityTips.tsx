import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Timer, Brain, Compass, ListChecks } from 'lucide-react';

interface ProductivityTipsProps {
  onApplySuggestion: (suggestion: string) => void;
}

const productivity_tips = [
  {
    id: 1,
    title: 'Time Blocking',
    description: 'Dedicate specific time blocks for different types of tasks to improve focus and efficiency.',
    action: 'Help me set up time blocks for today',
    icon: <Timer className="h-4 w-4" />
  },
  {
    id: 2,
    title: 'Pomodoro Technique',
    description: 'Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.',
    action: 'Start a Pomodoro timer',
    icon: <Brain className="h-4 w-4" />
  },
  {
    id: 3,
    title: 'Daily Planning',
    description: 'Take 10 minutes each evening to plan your tasks for the next day.',
    action: 'Help me plan tomorrow',
    icon: <Compass className="h-4 w-4" />
  },
  {
    id: 4,
    title: 'Task Batching',
    description: 'Group similar tasks together to minimize context switching and improve efficiency.',
    action: 'Help me batch my tasks',
    icon: <ListChecks className="h-4 w-4" />
  }
];

const ProductivityTips: React.FC<ProductivityTipsProps> = ({ onApplySuggestion }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Productivity Tips</h3>
      
      <div className="space-y-3">
        {productivity_tips.map((tip) => (
          <Card key={tip.id} className="overflow-hidden">
            <CardHeader className="p-3 pb-0">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  {tip.icon}
                </div>
                <CardTitle className="text-sm">{tip.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <CardDescription className="text-xs">
                {tip.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-3 pt-0 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => onApplySuggestion(tip.action)}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Apply
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductivityTips;
