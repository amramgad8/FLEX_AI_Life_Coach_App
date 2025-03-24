
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ChatbotAssistant from '../components/ChatbotAssistant';
import { TaskFilters } from '@/models/Todo';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';
import { useTasks } from '@/hooks/useTasks';
import CalendarContainer from '@/components/calendar/CalendarContainer';

const TaskHub = () => {
  // Use custom hooks
  const {
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    navigatePrevious,
    navigateNext,
    navigateToday
  } = useCalendarNavigation();
  
  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    completeTask,
    filterTasks
  } = useTasks();
  
  // State for filters
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    priorities: [],
    categories: [],
    dateRange: {},
    durationRange: {},
    showCompleted: false
  });
  
  // Get filtered tasks
  const filteredTasks = filterTasks(tasks, filters);
  
  // Handle month click in year view
  const handleMonthClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode('month');
  };
  
  // Handle adding a task
  const handleAddTask = (date: Date) => {
    const newTask = {
      title: "New Task",
      completed: false,
      priority: "medium",
      category: "other",
      duration: 30,
      dueDate: date
    };
    createTask(newTask as any);
  };

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
          
          <CalendarContainer
            currentDate={currentDate}
            viewMode={viewMode}
            tasks={tasks}
            filteredTasks={filteredTasks}
            filters={filters}
            isLoading={isLoading}
            onFilterChange={setFilters}
            onPrevious={navigatePrevious}
            onNext={navigateNext}
            onToday={navigateToday}
            onViewModeChange={setViewMode}
            onEditTask={updateTask}
            onCompleteTask={completeTask}
            onDeleteTask={(task) => deleteTask(task.id)}
            onDropTask={moveTask}
            onAddTask={handleAddTask}
            onMonthClick={handleMonthClick}
          />
        </div>
        
        <ChatbotAssistant />
      </div>
    </DndProvider>
  );
};

export default TaskHub;
