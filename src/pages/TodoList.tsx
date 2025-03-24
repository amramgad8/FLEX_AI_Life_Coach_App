
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoController } from '../controllers/TodoController';
import { EnhancedTodo, CreateEnhancedTodoInput } from '../models/Todo';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plus, CalendarDays, Calendar as CalendarIcon, ListTodo, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { addDays, isSameDay, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import TaskCalendarView from '@/components/todo/TaskCalendarView';
import TaskForm from '@/components/todo/TaskForm';
import TaskFilters, { TaskFilters as TaskFiltersType } from '@/components/todo/TaskFilters';
import { DragDropContext } from 'react-beautiful-dnd';

type ViewMode = 'day' | 'week' | 'month' | 'year';

const TodoList = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<EnhancedTodo | undefined>(undefined);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [filters, setFilters] = useState<TaskFiltersType>({
    searchQuery: '',
    priority: null,
    deadlineFilter: null,
    durationFilter: null,
    showCompleted: true
  });
  
  const queryClient = useQueryClient();

  // Fetch todos using React Query
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => TodoController.getTodos().then(todos => 
      todos.map(todo => ({
        ...todo,
        priority: (todo as any).priority || 'medium',
        duration: (todo as any).duration || 30,
        dueDate: (todo as any).dueDate ? new Date((todo as any).dueDate) : undefined,
        startTime: (todo as any).startTime ? new Date((todo as any).startTime) : undefined,
        endTime: (todo as any).endTime ? new Date((todo as any).endTime) : undefined,
        description: (todo as any).description || ''
      })) as EnhancedTodo[]
    )
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: (newTodo: CreateEnhancedTodoInput) => 
      TodoController.createTodo(newTodo as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task added!",
        description: "Your new task has been created.",
      });
      setIsTaskFormOpen(false);
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
      setIsTaskFormOpen(false);
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

  const handleCreateTask = (date?: Date) => {
    setCurrentTask(undefined);
    setIsCreatingTask(true);
    setIsTaskFormOpen(true);
    
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleEditTask = (task: EnhancedTodo) => {
    setCurrentTask(task);
    setIsCreatingTask(false);
    setIsTaskFormOpen(true);
  };

  const handleSubmitTask = (taskData: Partial<EnhancedTodo>) => {
    if (isCreatingTask) {
      // Create new task
      addTodoMutation.mutate({
        title: taskData.title || '',
        completed: false,
        priority: taskData.priority || 'medium',
        duration: taskData.duration || 30,
        dueDate: taskData.dueDate,
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        description: taskData.description
      } as CreateEnhancedTodoInput);
    } else if (currentTask) {
      // Update existing task
      updateTodoMutation.mutate({
        ...currentTask,
        ...taskData
      } as EnhancedTodo);
    }
  };

  const handleDeleteTask = () => {
    if (currentTask) {
      deleteTodoMutation.mutate(currentTask.id);
      setIsTaskFormOpen(false);
    }
  };

  // Filter todos based on the current filters
  const filteredTodos = todos.filter(todo => {
    // Search query filter
    if (filters.searchQuery && !todo.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(todo.priority)) {
      return false;
    }
    
    // Deadline filter
    if (filters.deadlineFilter) {
      const today = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());
      const nextWeek = endOfDay(addDays(new Date(), 7));
      
      if (filters.deadlineFilter === 'today' && (!todo.dueDate || !isSameDay(todo.dueDate, today))) {
        return false;
      }
      
      if (filters.deadlineFilter === 'upcoming' && (!todo.dueDate || !(isAfter(todo.dueDate, today) && isBefore(todo.dueDate, nextWeek)))) {
        return false;
      }
      
      if (filters.deadlineFilter === 'overdue' && (!todo.dueDate || !isBefore(todo.dueDate, today))) {
        return false;
      }
    }
    
    // Duration filter
    if (filters.durationFilter) {
      if (filters.durationFilter === 'short' && todo.duration >= 30) {
        return false;
      }
      
      if (filters.durationFilter === 'medium' && (todo.duration < 30 || todo.duration > 60)) {
        return false;
      }
      
      if (filters.durationFilter === 'long' && todo.duration <= 60) {
        return false;
      }
    }
    
    // Completed filter
    if (!filters.showCompleted && todo.completed) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-28 px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-flex-gradient">
            Task Stream
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Organize your tasks visually in calendar format
          </p>
        </motion.div>
        
        {/* Filters */}
        <TaskFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        {/* View Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-card border rounded-full p-1 shadow-sm inline-flex">
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
              className={`rounded-full ${viewMode === 'day' ? 'bg-flex-green text-white' : ''}`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Day
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className={`rounded-full ${viewMode === 'week' ? 'bg-flex-green text-white' : ''}`}
            >
              <ListTodo className="h-4 w-4 mr-2" />
              Week
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className={`rounded-full ${viewMode === 'month' ? 'bg-flex-green text-white' : ''}`}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Month
            </Button>
            <Button
              variant={viewMode === 'year' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('year')}
              className={`rounded-full ${viewMode === 'year' ? 'bg-flex-green text-white' : ''}`}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Year
            </Button>
          </div>
        </div>
        
        {/* Calendar View */}
        <TaskCalendarView
          todos={filteredTodos}
          selectedDate={selectedDate}
          onDateSelect={(date) => date && setSelectedDate(date)}
          onEditTask={handleEditTask}
          onCreateTask={handleCreateTask}
        />
        
        {/* Create Task Button */}
        <motion.div
          className="fixed bottom-8 right-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => handleCreateTask()}
            className="h-14 w-14 rounded-full bg-flex-gradient hover:opacity-90 shadow-lg"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </motion.div>
        
        {/* Task Form Dialog */}
        <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <TaskForm
              task={currentTask}
              onSubmit={handleSubmitTask}
              onCancel={() => setIsTaskFormOpen(false)}
              isCreating={isCreatingTask}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TodoList;
