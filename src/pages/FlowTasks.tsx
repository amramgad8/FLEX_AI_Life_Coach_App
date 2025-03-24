
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoController } from '../controllers/TodoController';
import { Todo, CreateTodoInput } from '../models/Todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { 
  Trash2, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  Edit,
  ArrowUpDown,
  Plus,
  CheckCircle,
  Calendar as CalendarIcon,
  List,
  LayoutGrid,
  Search,
  Filter,
  Loader2,
  CalendarDays,
  CalendarClock,
  CalendarRange
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatbotAssistant from '../components/ChatbotAssistant';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addDays, format, isSameDay } from 'date-fns';

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

const DURATIONS = [15, 30, 45, 60, 90, 120];

interface EnhancedTodo extends Todo {
  priority: 'low' | 'medium' | 'high';
  duration: number; // in minutes
  dueDate?: Date;
}

type ViewMode = 'day' | 'week' | 'month' | 'calendar';

const FlowTasks = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<EnhancedTodo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => TodoController.getTodos().then(todos => 
      todos.map(todo => ({
        ...todo,
        priority: (todo as any).priority || 'medium',
        duration: (todo as any).duration || 30,
        dueDate: (todo as any).dueDate ? new Date((todo as any).dueDate) : undefined
      })) as EnhancedTodo[]
    )
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo: CreateTodoInput & { priority: string, duration: number, dueDate?: Date }) => 
      TodoController.createTodo(newTodo as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task added!",
        description: "Your new task has been added to Task Stream.",
      });
      setNewTodoTitle('');
    }
  });

  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      TodoController.updateTodo(id, { completed }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      if (variables.completed) {
        toast({
          title: "Task completed!",
          description: "Great job! You've completed a task.",
        });
      }
    }
  });

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
      duration: 30,
      dueDate: selectedDate
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

  const handleReorderTasks = (reorderedTasks: EnhancedTodo[]) => {
    // In a real app, you would persist this order to the backend
    // For now, we'll just update the local cache
    queryClient.setQueryData(['todos'], reorderedTasks);
    
    toast({
      title: "Tasks reordered",
      description: "Your task order has been updated.",
    });
  };

  const filteredTodos = todos.filter(todo => {
    // Filter by search query
    if (searchQuery && !todo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by date view mode
    if (viewMode === 'day' && todo.dueDate && !isSameDay(todo.dueDate, selectedDate)) {
      return false;
    }
    
    // For week view, show tasks due within the next 7 days
    if (viewMode === 'week' && todo.dueDate) {
      const weekEnd = addDays(selectedDate, 7);
      if (todo.dueDate < selectedDate || todo.dueDate > weekEnd) {
        return false;
      }
    }
    
    // Month view shows all tasks
    
    return true;
  });

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery('');
    }
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
      <div className="container mx-auto py-28 px-4 max-w-4xl">
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
            Adapt and evolve your daily workflow
          </p>
        </motion.div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-fit">
              <TabsList>
                <TabsTrigger value="day" className="flex items-center gap-1 text-xs">
                  <CalendarClock className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Today</span>
                </TabsTrigger>
                <TabsTrigger value="week" className="flex items-center gap-1 text-xs">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Week</span>
                </TabsTrigger>
                <TabsTrigger value="month" className="flex items-center gap-1 text-xs">
                  <CalendarRange className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Month</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-1 text-xs">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`relative transition-all duration-300 ${isSearchExpanded ? 'w-40 md:w-60' : 'w-0'}`}>
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`h-9 ${isSearchExpanded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSearchToggle}
              className="h-9 w-9 p-0 flex items-center justify-center rounded-full"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 w-9 p-0 flex items-center justify-center rounded-full"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card className="mb-8 shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a new task to your stream..."
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${viewMode === 'calendar' ? 'col-span-full mb-6' : 'md:col-span-2'}`}>
            {viewMode === 'calendar' && (
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md"
                    disabled={{ before: new Date() }}
                    modifiersStyles={{
                      selected: {
                        backgroundColor: '#4CAF50',
                        color: 'white',
                      }
                    }}
                  />
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-flex-green rounded-full mr-2"></div>
                      <span className="text-xs">Low Priority</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-flex-yellow rounded-full mr-2"></div>
                      <span className="text-xs">Medium Priority</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-flex-orange rounded-full mr-2"></div>
                      <span className="text-xs">High Priority</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-flex-green" />
                  <p className="text-gray-500">Loading your tasks...</p>
                </div>
              </div>
            )}
            
            {!isLoading && filteredTodos.length === 0 && (
              <Card className="py-12 flex flex-col items-center justify-center bg-white/50">
                <div className="text-center p-6 max-w-sm mx-auto">
                  <div className="mb-4 bg-flex-green-light p-3 rounded-full inline-block">
                    <CheckCircle className="h-6 w-6 text-flex-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No tasks {viewMode === 'day' ? 'today' : viewMode === 'week' ? 'this week' : ''}</h3>
                  <p className="text-gray-500 mb-4">
                    {viewMode === 'calendar' 
                      ? 'Select a date to view or add tasks for that day.' 
                      : 'Add your first task to start organizing your flow!'}
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
            
            {!isLoading && filteredTodos.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                      {viewMode === 'day' && `Tasks for ${format(selectedDate, 'MMMM d, yyyy')}`}
                      {viewMode === 'week' && 'This Week\'s Tasks'}
                      {viewMode === 'month' && 'All Tasks'}
                      {viewMode === 'calendar' && `Tasks for ${format(selectedDate, 'MMMM d, yyyy')}`}
                    </h2>
                    <div className="text-sm text-gray-500">
                      {filteredTodos.length} task{filteredTodos.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <Reorder.Group
                    values={filteredTodos}
                    onReorder={handleReorderTasks}
                    className="space-y-3"
                    layoutScroll
                    as="div"
                  >
                    <AnimatePresence>
                      {filteredTodos.map((todo) => {
                        const enhancedTodo = todo as EnhancedTodo;
                        const priorityConfig = PRIORITY_CONFIG[enhancedTodo.priority || 'medium'];
                        
                        return (
                          <Reorder.Item
                            key={todo.id}
                            value={todo}
                            variants={taskItemVariants}
                            exit="exit"
                            layoutId={todo.id}
                            whileDrag={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            className="group cursor-move"
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
                                      
                                      {enhancedTodo.dueDate && (
                                        <span className="flex items-center">
                                          <CalendarIcon className="h-3 w-3 mr-1" />
                                          {format(enhancedTodo.dueDate, 'MMM d')}
                                        </span>
                                      )}
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
                          </Reorder.Item>
                        );
                      })}
                    </AnimatePresence>
                  </Reorder.Group>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          
          {viewMode !== 'calendar' && (
            <div className="hidden md:block">
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md"
                  />
                </CardContent>
                
                <CardFooter className="border-t pt-4 flex-col items-start">
                  <h3 className="font-semibold mb-2 text-sm">Task Summary</h3>
                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Tasks</span>
                      <span className="font-medium">{todos.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-medium">{todos.filter(t => t.completed).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-medium">
                        {todos.length > 0 
                          ? `${Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}%` 
                          : '0%'}
                      </span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          
          {currentTodo && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Task</Label>
                <Input 
                  value={currentTodo.title} 
                  onChange={(e) => setCurrentTodo({...currentTodo, title: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex space-x-2">
                  {(Object.keys(PRIORITY_CONFIG) as Array<keyof typeof PRIORITY_CONFIG>).map((priority) => (
                    <Button
                      key={priority}
                      type="button"
                      variant={currentTodo.priority === priority ? 'default' : 'outline'}
                      className={currentTodo.priority === priority ? `bg-flex-green text-white` : ''}
                      onClick={() => setCurrentTodo({...currentTodo, priority})}
                    >
                      {PRIORITY_CONFIG[priority].label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
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
              
              <div className="space-y-2">
                <Label>Due Date</Label>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={currentTodo.dueDate}
                    onSelect={(date) => setCurrentTodo({...currentTodo, dueDate: date || undefined})}
                    className="rounded-md"
                  />
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
      
      <ChatbotAssistant />
    </div>
  );
};

export default FlowTasks;
