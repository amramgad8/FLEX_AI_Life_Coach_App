
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoController } from '../controllers/TodoController';
import { Todo, CreateTodoInput } from '../models/Todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { 
  Trash2, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  Edit,
  ArrowUpDown,
  Plus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatbotAssistant from '../components/ChatbotAssistant';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

// Task priority options with their colors
const PRIORITY_CONFIG = {
  low: { 
    label: 'Low', 
    color: 'bg-flex-green-light',
    borderColor: 'border-flex-green', 
  },
  medium: { 
    label: 'Medium', 
    color: 'bg-flex-yellow-light', 
    borderColor: 'border-flex-yellow', 
  },
  high: { 
    label: 'High', 
    color: 'bg-flex-orange-light', 
    borderColor: 'border-flex-orange', 
  }
};

// Task duration options
const DURATIONS = [15, 30, 45, 60, 90, 120];

// Enhanced Todo type with additional properties
interface EnhancedTodo extends Todo {
  priority: 'low' | 'medium' | 'high';
  duration: number; // in minutes
}

const FlowTasks = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<EnhancedTodo | null>(null);
  const queryClient = useQueryClient();

  // Fetch todos using React Query
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => TodoController.getTodos().then(todos => 
      // Convert basic todos to enhanced todos with default values if needed
      todos.map(todo => ({
        ...todo,
        priority: (todo as any).priority || 'medium',
        duration: (todo as any).duration || 30
      })) as EnhancedTodo[]
    )
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: (newTodo: CreateTodoInput & { priority: string, duration: number }) => 
      TodoController.createTodo(newTodo as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task added!",
        description: "Your new task has been added to Flow Tasks.",
      });
      setNewTodoTitle('');
    }
  });

  // Toggle todo completion mutation
  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      TodoController.updateTodo(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: (todo: EnhancedTodo) => 
      TodoController.updateTodo(todo.id, todo as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task updated!",
        description: "Your task has been successfully updated.",
      });
      setIsEditDialogOpen(false);
    }
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => TodoController.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task removed",
        description: "The task has been deleted.",
      });
    }
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    
    addTodoMutation.mutate({
      title: newTodoTitle,
      completed: false,
      priority: 'medium',
      duration: 30
    });
  };

  const handleEditTodo = (todo: EnhancedTodo) => {
    setCurrentTodo(todo);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTodo = () => {
    if (currentTodo) {
      updateTodoMutation.mutate(currentTodo);
    }
  };

  const handlePriorityChange = (todo: EnhancedTodo, priority: 'low' | 'medium' | 'high') => {
    updateTodoMutation.mutate({
      ...todo,
      priority
    });
  };

  const taskListVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const taskItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-28 px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-flex-gradient">
          Flow Tasks
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Adapt and evolve your daily workflow
        </p>
        
        {/* Add Todo Form */}
        <Card className="mb-8 shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a new task to your flow..."
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={addTodoMutation.isPending}
                className="bg-flex-gradient hover:opacity-90 text-white"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-40 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && todos.length === 0 && (
          <Card className="py-12 flex flex-col items-center justify-center bg-white/50">
            <div className="text-center p-6 max-w-sm mx-auto">
              <div className="mb-4 bg-flex-green-light p-3 rounded-full inline-block">
                <CheckCircle2 className="h-6 w-6 text-flex-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
              <p className="text-gray-500 mb-4">
                Add your first task to start organizing your flow!
              </p>
              <Button 
                className="bg-flex-gradient hover:opacity-90 text-white"
                onClick={() => document.querySelector('input')?.focus()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </div>
          </Card>
        )}
        
        {/* Todo List */}
        {!isLoading && todos.length > 0 && (
          <motion.div 
            className="space-y-3"
            variants={taskListVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {todos.map((todo) => {
                const enhancedTodo = todo as EnhancedTodo;
                const priorityConfig = PRIORITY_CONFIG[enhancedTodo.priority || 'medium'];
                
                return (
                  <motion.div
                    key={todo.id}
                    variants={taskItemVariants}
                    exit="exit"
                    layout
                    className="group"
                  >
                    <Card 
                      className={`border-l-4 ${priorityConfig.borderColor} hover:shadow-md transition-all duration-200 bg-white`}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div>
                            <Checkbox
                              checked={todo.completed}
                              onCheckedChange={(checked) => 
                                toggleTodoMutation.mutate({ 
                                  id: todo.id, 
                                  completed: checked as boolean 
                                })
                              }
                              className={`${todo.completed ? 'bg-flex-green border-flex-green' : ''}`}
                            />
                          </div>
                          
                          <div className="flex-1">
                            <p className={`font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {todo.title}
                            </p>
                            
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${priorityConfig.color} text-gray-700`}>
                                {priorityConfig.label}
                              </span>
                              
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {enhancedTodo.duration || 30} min
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-700"
                            onClick={() => handleEditTodo(enhancedTodo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-red-50 hover:text-red-600"
                            onClick={() => deleteTodoMutation.mutate(todo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Task Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          
          {currentTodo && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <FormLabel>Task</FormLabel>
                <Input 
                  value={currentTodo.title} 
                  onChange={(e) => setCurrentTodo({...currentTodo, title: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Priority</FormLabel>
                <div className="flex space-x-2">
                  {(Object.keys(PRIORITY_CONFIG) as Array<keyof typeof PRIORITY_CONFIG>).map((priority) => (
                    <Button
                      key={priority}
                      type="button"
                      variant={currentTodo.priority === priority ? 'default' : 'outline'}
                      className={currentTodo.priority === priority ? `bg-flex-${priority} text-white` : ''}
                      onClick={() => setCurrentTodo({...currentTodo, priority})}
                    >
                      {PRIORITY_CONFIG[priority].label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Duration (minutes)</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((duration) => (
                    <Button
                      key={duration}
                      type="button"
                      variant={currentTodo.duration === duration ? 'default' : 'outline'}
                      className={currentTodo.duration === duration ? 'bg-flex-green text-white' : ''}
                      onClick={() => setCurrentTodo({...currentTodo, duration})}
                    >
                      {duration}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTodo} className="bg-flex-gradient text-white">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Chatbot Assistant */}
      <ChatbotAssistant />
    </div>
  );
};

export default FlowTasks;
