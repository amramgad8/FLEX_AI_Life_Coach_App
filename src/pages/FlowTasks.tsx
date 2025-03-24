
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TodoController } from '../controllers/TodoController';
import { 
  EnhancedTodo, 
  TaskPriority, 
  TaskCategory
} from '../models/Todo';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ChatbotAssistant from '../components/ChatbotAssistant';
import { toast } from '@/components/ui/use-toast';
import { 
  addDays, 
  addMonths, 
  addWeeks, 
  format, 
  isSameDay,
  isAfter,
  isBefore,
  startOfDay,
  isDate
} from 'date-fns';

// Import calendar components
import CalendarHeader from '@/components/calendar/CalendarHeader';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import YearView from '@/components/calendar/YearView';
import TaskFormDialog from '@/components/calendar/TaskFormDialog';
import FilterBar, { TaskFilters } from '@/components/calendar/FilterBar';
import FloatingActionButton from '@/components/calendar/FloatingActionButton';

type ViewMode = 'day' | 'week' | 'month' | 'year';

const TaskHub = () => {
  const queryClient = useQueryClient();
  
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<EnhancedTodo | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    priorities: [],
    categories: [],
    dateRange: {},
    durationRange: {},
    showCompleted: false
  });
  
  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => TodoController.getTodos()
  });
  
  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: (newTask: Partial<EnhancedTodo>) => 
      TodoController.createTodo(newTask as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task created",
        description: "Your task has been added to the calendar.",
      });
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: (task: Partial<EnhancedTodo>) => 
      TodoController.updateTodo(task.id!, task as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    }
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => 
      TodoController.deleteTodo(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task deleted",
        description: "Your task has been removed from the calendar.",
      });
    }
  });
  
  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, newDate }: { taskId: string; newDate: Date }) => 
      TodoController.moveToDate(taskId, newDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task moved",
        description: "Your task has been rescheduled successfully.",
      });
    }
  });
  
  // Event handlers
  const handleNavigatePrevious = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, -1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, -1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, -1));
        break;
      case 'year':
        setCurrentDate(addMonths(currentDate, -12));
        break;
    }
  };
  
  const handleNavigateNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(addMonths(currentDate, 12));
        break;
    }
  };
  
  const handleNavigateToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };
  
  const handleOpenCreateTask = (date?: Date) => {
    setSelectedDate(date || currentDate);
    setCurrentTask(undefined);
    setIsTaskFormOpen(true);
  };
  
  const handleEditTask = (task: EnhancedTodo) => {
    setCurrentTask(task);
    setIsTaskFormOpen(true);
  };
  
  const handleSaveTask = (task: Partial<EnhancedTodo>) => {
    if (task.id) {
      updateTaskMutation.mutate(task);
    } else {
      createTaskMutation.mutate(task);
    }
    setIsTaskFormOpen(false);
  };
  
  const handleCompleteTask = (task: EnhancedTodo, completed: boolean) => {
    updateTaskMutation.mutate({ 
      id: task.id, 
      completed 
    });
  };
  
  const handleDeleteTask = (task: EnhancedTodo) => {
    deleteTaskMutation.mutate(task.id);
  };
  
  const handleDropTask = (taskId: string, date: Date) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.dueDate && !isSameDay(new Date(task.dueDate), date)) {
      moveTaskMutation.mutate({ taskId, newDate: date });
    }
  };
  
  const handleMonthClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode('month');
  };
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by search
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filter by priority
    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
      return false;
    }
    
    // Filter by category
    if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange.from && task.dueDate && 
        isBefore(new Date(task.dueDate), startOfDay(filters.dateRange.from))) {
      return false;
    }
    
    if (filters.dateRange.to && task.dueDate && 
        isAfter(new Date(task.dueDate), startOfDay(filters.dateRange.to))) {
      return false;
    }
    
    // Filter by duration
    if (filters.durationRange.min !== undefined && task.duration < filters.durationRange.min) {
      return false;
    }
    
    if (filters.durationRange.max !== undefined && task.duration > filters.durationRange.max) {
      return false;
    }
    
    // Filter by completion status
    if (!filters.showCompleted && task.completed) {
      return false;
    }
    
    return true;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto py-20 px-4 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Task Flow
            </h1>
            <p className="text-center text-gray-600">
              Organize your workflow with a calendar-based approach
            </p>
          </motion.div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-20">
            <CalendarHeader 
              currentDate={currentDate}
              viewMode={viewMode}
              onPrevious={handleNavigatePrevious}
              onNext={handleNavigateNext}
              onToday={handleNavigateToday}
              onViewModeChange={handleViewModeChange}
            />
            
            <div className="p-4">
              <FilterBar 
                filters={filters}
                onFilterChange={setFilters}
              />
            
              {isLoading ? (
                <div className="min-h-[500px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="min-h-[500px] border rounded-lg overflow-hidden">
                  {viewMode === 'day' && (
                    <DayView 
                      date={currentDate}
                      tasks={filteredTasks.filter(task => 
                        task.dueDate && isSameDay(new Date(task.dueDate), currentDate)
                      )}
                      onEditTask={handleEditTask}
                      onCompleteTask={handleCompleteTask}
                      onDeleteTask={handleDeleteTask}
                      onAddTask={handleOpenCreateTask}
                      onDropTask={handleDropTask}
                    />
                  )}
                  
                  {viewMode === 'week' && (
                    <WeekView 
                      date={currentDate}
                      tasks={filteredTasks}
                      onEditTask={handleEditTask}
                      onCompleteTask={handleCompleteTask}
                      onDeleteTask={handleDeleteTask}
                      onAddTask={handleOpenCreateTask}
                      onDropTask={handleDropTask}
                    />
                  )}
                  
                  {viewMode === 'month' && (
                    <MonthView 
                      date={currentDate}
                      tasks={filteredTasks}
                      onEditTask={handleEditTask}
                      onCompleteTask={handleCompleteTask}
                      onDeleteTask={handleDeleteTask}
                      onAddTask={handleOpenCreateTask}
                      onDropTask={handleDropTask}
                    />
                  )}
                  
                  {viewMode === 'year' && (
                    <YearView 
                      date={currentDate}
                      tasks={filteredTasks}
                      onMonthClick={handleMonthClick}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          
          <TaskFormDialog 
            isOpen={isTaskFormOpen}
            onClose={() => setIsTaskFormOpen(false)}
            onSave={handleSaveTask}
            task={currentTask}
            selectedDate={selectedDate}
          />
          
          <FloatingActionButton 
            onCreateTask={() => handleOpenCreateTask()}
          />
        </div>
        
        <ChatbotAssistant />
      </div>
    </DndProvider>
  );
};

export default TaskHub;
