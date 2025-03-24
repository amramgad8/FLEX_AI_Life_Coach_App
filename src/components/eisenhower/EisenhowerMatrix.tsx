
import React, { useState } from 'react';
import { EnhancedTodo, EisenhowerQuadrant, EISENHOWER_CONFIG } from '@/models/Todo';
import { useTasks } from '@/hooks/useTasks';
import TaskItem from '@/components/calendar/TaskItem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Search, Plus } from 'lucide-react';
import { useDrop } from 'react-dnd';

interface EisenhowerMatrixProps {
  tasks: EnhancedTodo[];
}

// Individual quadrant component
interface QuadrantProps {
  title: string;
  description: string;
  action: string;
  quadrant: EisenhowerQuadrant;
  tasks: EnhancedTodo[];
  className: string;
  onTaskDrop: (taskId: string, quadrant: EisenhowerQuadrant) => void;
  onEditTask: (task: EnhancedTodo) => void;
  onCompleteTask: (task: EnhancedTodo, completed: boolean) => void;
  onDeleteTask: (task: EnhancedTodo) => void;
}

const Quadrant: React.FC<QuadrantProps> = ({
  title,
  description,
  action,
  quadrant,
  tasks,
  className,
  onTaskDrop,
  onEditTask,
  onCompleteTask,
  onDeleteTask
}) => {
  // Set up drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => onTaskDrop(item.id, quadrant),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop} 
      className={`${className} p-4 rounded-md transition-colors ${isOver ? 'bg-slate-100' : ''}`}
    >
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-xs italic mb-4 text-gray-500">{action}</p>
      
      <div className="space-y-2 min-h-32">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-6">
            Drop tasks here
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={onEditTask}
              onComplete={onCompleteTask}
              onDelete={onDeleteTask}
              compact
            />
          ))
        )}
      </div>
    </div>
  );
};

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks }) => {
  const { updateEisenhowerQuadrant, updateTask, completeTask, deleteTask } = useTasks();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState<EisenhowerQuadrant | null>(null);
  
  const handleTaskDrop = (taskId: string, quadrant: EisenhowerQuadrant) => {
    updateEisenhowerQuadrant(taskId, quadrant);
  };

  // Create a wrapper function to match the expected prop types
  const handleDeleteTask = (task: EnhancedTodo) => {
    deleteTask(task.id);
  };

  // Group tasks by quadrant
  const tasksByQuadrant: Record<EisenhowerQuadrant, EnhancedTodo[]> = {
    'urgent-important': tasks.filter(t => t.eisenhowerQuadrant === 'urgent-important'),
    'not-urgent-important': tasks.filter(t => t.eisenhowerQuadrant === 'not-urgent-important'),
    'urgent-not-important': tasks.filter(t => t.eisenhowerQuadrant === 'urgent-not-important'),
    'not-urgent-not-important': tasks.filter(t => t.eisenhowerQuadrant === 'not-urgent-not-important'),
  };

  // Get tasks without an assigned quadrant
  const unassignedTasks = tasks.filter(t => !t.eisenhowerQuadrant);

  // Filter unassigned tasks based on search query
  const filteredUnassignedTasks = unassignedTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {unassignedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uncategorized Tasks</CardTitle>
            <CardDescription>
              Drag these tasks to the appropriate quadrant in the matrix
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {unassignedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onClick={updateTask}
                  onComplete={completeTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Task to {selectedQuadrant && EISENHOWER_CONFIG[selectedQuadrant].label}</DialogTitle>
            <DialogDescription>
              Search for a task to add to this quadrant
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
            {filteredUnassignedTasks.length > 0 ? (
              filteredUnassignedTasks.map(task => (
                <div
                  key={task.id}
                  className="p-2 border rounded hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                  onClick={() => assignTaskToQuadrant(task.id)}
                >
                  <span className="font-medium">{task.title}</span>
                  <Button size="sm" variant="ghost">
                    Add
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                {searchQuery ? "No tasks found" : "No uncategorized tasks available"}
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
    </div>
  );
};

export default EisenhowerMatrix;
