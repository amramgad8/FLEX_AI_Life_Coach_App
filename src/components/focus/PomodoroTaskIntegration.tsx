
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { EnhancedTodo } from '@/models/Todo';
import { useTasks } from '@/hooks/useTasks';
import { Clock, Play, Check, Tag, Timer, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

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
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    onSelectTask(taskId);
    setIsSearchDialogOpen(false);
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  // Filter tasks based on search query
  const filteredTasks = incompleteTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="flex-1">
                <h3 className="font-medium">Current Task:</h3>
                <p className="text-lg truncate max-w-full">{activeTask.title}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className={`${activeTask.timeSpent ? 'bg-blue-50 text-blue-600' : ''}`}>
                    <Clock className="inline h-3 w-3 mr-1" /> 
                    {activeTask.timeSpent ? `${activeTask.timeSpent} minutes logged` : 'No time logged yet'}
                  </Badge>
                  {activeTask.eisenhowerQuadrant && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-600">
                      Eisenhower: {activeTask.eisenhowerQuadrant.split('-').join(' ')}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 shrink-0"
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
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsSearchDialogOpen(true)}
                className="w-full"
                variant="outline"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Tasks
              </Button>
              
              {selectedTaskId && (
                <Button 
                  onClick={() => onSelectTask(selectedTaskId)}
                  className="flex-shrink-0"
                >
                  <Timer className="mr-2 h-4 w-4" />
                  Focus
                </Button>
              )}
            </div>
            
            {incompleteTasks.length > 5 && (
              <p className="text-xs text-gray-500 mt-2">
                {incompleteTasks.length} tasks available. Use search to find specific tasks.
              </p>
            )}
            
            {incompleteTasks.length <= 5 && incompleteTasks.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">Quick select:</p>
                {incompleteTasks.slice(0, 5).map(task => (
                  <div 
                    key={task.id}
                    className="p-2 border rounded hover:bg-slate-50 cursor-pointer"
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      onSelectTask(task.id);
                    }}
                  >
                    <p className="font-medium">{task.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select a Task</DialogTitle>
            <DialogDescription>
              Choose a task to focus on during your Pomodoro session
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className="p-2 border rounded hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                  onClick={() => handleTaskSelect(task.id)}
                >
                  <span className="font-medium">{task.title}</span>
                  <Button size="sm" variant="ghost">
                    Select
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                {searchQuery ? "No tasks found" : "No tasks available"}
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsSearchDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PomodoroTaskIntegration;
