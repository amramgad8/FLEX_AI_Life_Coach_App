import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Calendar, Zap } from 'lucide-react';

const TaskInsights: React.FC = () => {
  // Mock data - in a real app, this would come from your task state or API
  const taskStats = {
    completed: 12,
    total: 20,
    overdue: 2,
    dueToday: 5,
    productivity: 68
  };
  
  const completionRate = Math.round((taskStats.completed / taskStats.total) * 100);
  
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-medium">Task Insights</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="p-3 pb-0 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Completion</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-2xl font-bold">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-1.5 mt-2" />
            <p className="text-xs mt-1 text-muted-foreground">
              {taskStats.completed} of {taskStats.total} tasks completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3 pb-0 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Due Today</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-500" />
              <span className="text-2xl font-bold">{taskStats.dueToday}</span>
            </div>
            <p className="text-xs mt-3 text-muted-foreground">
              {taskStats.overdue > 0 ? `${taskStats.overdue} overdue tasks` : 'No overdue tasks'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader className="p-3 pb-0 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Productivity Score</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-2xl font-bold">{taskStats.productivity}</span>
            </div>
            <Progress value={taskStats.productivity} className="h-1.5 mt-2" />
            <p className="text-xs mt-1 text-muted-foreground">
              Based on completion rate and timeliness
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskInsights;
