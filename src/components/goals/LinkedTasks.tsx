import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Pencil, Trash2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EnhancedTodo } from '@/models/Todo';
import { useTasks } from '@/hooks/useTasks';
import TaskFormDialog from '../calendar/TaskFormDialog';

interface LinkedTasksProps {
  taskIds: string[];
  onTaskComplete: (taskId: string, completed: boolean) => void;
  onTaskRemove: (taskId: string) => void;
}

const LinkedTasks: React.FC<LinkedTasksProps> = ({ 
  taskIds, 
  onTaskComplete, 
  onTaskRemove 
}) => {
  const { tasks, updateTask } = useTasks();
  const [taskToEdit, setTaskToEdit] = useState<EnhancedTodo | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  // Filter tasks to only include those in the taskIds array
  const linkedTasks = tasks.filter(task => taskIds.includes(task.id));

  const handleEditTask = (task: EnhancedTodo) => {
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = (updatedTask: Partial<EnhancedTodo>) => {
    if (taskToEdit) {
      updateTask({ ...updatedTask, id: taskToEdit.id });
      setIsTaskFormOpen(false);
      setTaskToEdit(null);
    }
  };

  if (linkedTasks.length === 0) {
    return <p className="text-sm text-gray-500 italic mt-2">No tasks linked to this goal</p>;
  }

  return (
    <>
      <div className="mt-3 space-y-2">
        <h4 className="text-sm font-medium">Linked Tasks</h4>
        <div className="space-y-2">
          {linkedTasks.map(task => (
            <div 
              key={task.id}
              className="flex items-center justify-between p-2 text-sm border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={task.completed}
                  onCheckedChange={(checked) => onTaskComplete(task.id, !!checked)}
                />
                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => handleEditTask(task)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit task</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-red-500 hover:text-red-700" 
                  onClick={() => onTaskRemove(task.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove task</span>
                </Button>
                <Link 
                  to="/todo" 
                  className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-gray-200"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="sr-only">View in Todo list</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {taskToEdit && (
        <TaskFormDialog
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSave={handleSaveTask}
          task={taskToEdit}
          selectedDate={taskToEdit.dueDate || new Date()}
        />
      )}
    </>
  );
};

export default LinkedTasks;
