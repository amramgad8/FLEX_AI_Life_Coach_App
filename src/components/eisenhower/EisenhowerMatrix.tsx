
import React, { useState } from 'react';
import { EnhancedTodo, EisenhowerQuadrant, EISENHOWER_CONFIG } from '@/models/Todo';
import { useTasks } from '@/hooks/useTasks';
import Quadrant from './Quadrant';
import TaskSearchDialog from './TaskSearchDialog';
import UncategorizedTasksCard from './UncategorizedTasksCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EisenhowerMatrixProps {
  tasks: EnhancedTodo[];
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks }) => {
  const { updateEisenhowerQuadrant, updateTask, completeTask, deleteTask } = useTasks();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState<EisenhowerQuadrant | null>(null);
  
  // Event handlers
  const handleTaskDrop = (taskId: string, quadrant: EisenhowerQuadrant) => {
    updateEisenhowerQuadrant(taskId, quadrant);
  };

  const handleDeleteTask = (task: EnhancedTodo) => {
    deleteTask(task.id);
  };

  const openAddTaskDialog = (quadrant: EisenhowerQuadrant) => {
    setSelectedQuadrant(quadrant);
    setSearchQuery('');
    setIsSearchDialogOpen(true);
  };

  const assignTaskToQuadrant = (taskId: string) => {
    if (selectedQuadrant) {
      updateEisenhowerQuadrant(taskId, selectedQuadrant);
      setIsSearchDialogOpen(false);
    }
  };

  // Data organization
  const tasksByQuadrant: Record<EisenhowerQuadrant, EnhancedTodo[]> = {
    'urgent-important': tasks.filter(t => t.eisenhowerQuadrant === 'urgent-important'),
    'not-urgent-important': tasks.filter(t => t.eisenhowerQuadrant === 'not-urgent-important'),
    'urgent-not-important': tasks.filter(t => t.eisenhowerQuadrant === 'urgent-not-important'),
    'not-urgent-not-important': tasks.filter(t => t.eisenhowerQuadrant === 'not-urgent-not-important'),
  };

  // Get and filter unassigned tasks
  const unassignedTasks = tasks.filter(t => !t.eisenhowerQuadrant);
  const filteredUnassignedTasks = unassignedTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Eisenhower Matrix</CardTitle>
          <CardDescription>
            Organize your tasks by urgency and importance to prioritize effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(EISENHOWER_CONFIG).map(([key, config]) => {
              const quadrantKey = key as EisenhowerQuadrant;
              return (
                <div key={quadrantKey} className="flex flex-col">
                  <Quadrant
                    title={config.label}
                    description={config.description}
                    action={config.action}
                    quadrant={quadrantKey}
                    tasks={tasksByQuadrant[quadrantKey]}
                    className={config.bgColor}
                    onTaskDrop={handleTaskDrop}
                    onEditTask={updateTask}
                    onCompleteTask={completeTask}
                    onDeleteTask={handleDeleteTask}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 self-center"
                    onClick={() => openAddTaskDialog(quadrantKey)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <UncategorizedTasksCard 
        tasks={unassignedTasks}
        onEditTask={updateTask}
        onCompleteTask={completeTask}
        onDeleteTask={handleDeleteTask}
      />

      <TaskSearchDialog
        isOpen={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
        selectedQuadrant={selectedQuadrant}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredTasks={filteredUnassignedTasks}
        onTaskSelect={assignTaskToQuadrant}
      />
    </div>
  );
};

export default EisenhowerMatrix;
