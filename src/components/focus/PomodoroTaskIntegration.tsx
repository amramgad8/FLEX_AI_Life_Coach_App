
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTodo } from '@/models/Todo';
import { useTasks } from '@/hooks/useTasks';
import { Clock, Play, Check, Tag } from 'lucide-react';

interface PomodoroTaskIntegrationProps {
  onSelectTask: (taskId: string) => void;
  onSessionComplete: (taskId: string, minutes: number) => void;
  activeTaskId?: string;
  sessionLength: number;
}

const PomodoroTaskIntegration: React.FC<PomodoroTaskIntegrationProps> = ({
  onSelectTask,
  onSessionComplete,
  activeTaskId,
  sessionLength
}) => {
  const { tasks } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState(activeTaskId || '');

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    onSelectTask(taskId);
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Focus on a Task
        </CardTitle>
        <CardDescription>
          Link your Pomodoro session to a specific task to track your progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeTask ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Current Task:</h3>
                <p className="text-lg">{activeTask.title}</p>
                {activeTask.timeSpent && (
                  <p className="text-sm text-gray-500">
                    <Clock className="inline h-4 w-4 mr-1" /> 
                    Time spent: {activeTask.timeSpent} minutes
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600"
                onClick={() => onSessionComplete(activeTask.id, sessionLength)}
              >
                <Check className="mr-1 h-4 w-4" />
                Complete Session
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select a task to focus on during your Pomodoro session:
            </p>
            <Select value={selectedTaskId} onValueChange={handleTaskSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a task" />
              </SelectTrigger>
              <SelectContent>
                {incompleteTasks.length > 0 ? (
                  incompleteTasks.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No incomplete tasks
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {selectedTaskId && (
              <Button 
                onClick={() => onSelectTask(selectedTaskId)}
                className="w-full"
              >
                <Play className="mr-2 h-4 w-4" />
                Focus on This Task
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PomodoroTaskIntegration;
