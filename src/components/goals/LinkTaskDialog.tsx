
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGoals } from '@/hooks/useGoals';
import { useTasks } from '@/hooks/useTasks';
import { Search, Link2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { EnhancedTodo } from '@/models/Todo';
import TaskFormDialog from '../calendar/TaskFormDialog';

interface LinkTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
}

const LinkTaskDialog = ({ isOpen, onClose, goalId }: LinkTaskDialogProps) => {
  const { linkTaskToGoal, getGoalById } = useGoals();
  const { tasks, updateTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<EnhancedTodo | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const goal = getGoalById(goalId);
  
  // Reset selections when the dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedTasks([]);
    }
  }, [isOpen]);
  
  const filteredTasks = tasks.filter(task => {
    // Don't show tasks that are already linked to this goal
    if (goal?.taskIds?.includes(task.id)) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      return task.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });
  
  const handleToggleTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  const handleLinkTasks = () => {
    selectedTasks.forEach(taskId => {
      linkTaskToGoal(goalId, taskId);
    });
    onClose();
  };

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
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Link Tasks to Goal</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              {filteredTasks.length > 0 ? (
                <div className="space-y-2">
                  {filteredTasks.map(task => (
                    <div 
                      key={task.id}
                      className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleToggleTask(task.id)}
                    >
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        {task.dueDate && (
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock size={12} className="mr-1" />
                            {format(new Date(task.dueDate), 'PPP')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                        >
                          Edit
                        </Button>
                        
                        <Link 
                          to="/todo" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                        >
                          View
                        </Link>
                      </div>
                      
                      {task.priority && (
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {task.priority}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <Link2 className="text-gray-300 mb-2" size={32} />
                  <p className="text-gray-500">
                    {searchTerm 
                      ? "No matching tasks found" 
                      : "No available tasks to link. Create new tasks or all tasks are already linked."}
                  </p>
                  <Link to="/todo" className="mt-3">
                    <Button variant="outline" size="sm">
                      Go to Task Manager
                    </Button>
                  </Link>
                </div>
              )}
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleLinkTasks}
              disabled={selectedTasks.length === 0}
            >
              Link {selectedTasks.length} Task{selectedTasks.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default LinkTaskDialog;