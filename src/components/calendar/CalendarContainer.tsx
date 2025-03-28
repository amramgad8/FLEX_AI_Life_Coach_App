import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnhancedTodo, TaskFilters } from '@/models/Todo';
import { ViewMode } from '@/hooks/useCalendarNavigation';
import CalendarHeader from './CalendarHeader';
import FilterBar from './FilterBar';
import CalendarContent from './CalendarContent';
import TaskFormDialog from './TaskFormDialog';
import FloatingActionButton from './FloatingActionButton';

interface CalendarContainerProps {
  currentDate: Date;
  viewMode: ViewMode;
  tasks: EnhancedTodo[];
  filteredTasks: EnhancedTodo[];
  filters: TaskFilters;
  isLoading: boolean;
  onFilterChange: (filters: TaskFilters) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onEditTask: (task: EnhancedTodo) => void;
  onCompleteTask: (task: EnhancedTodo, completed: boolean) => void;
  onDeleteTask: (task: EnhancedTodo) => void;
  onDropTask: (taskId: string, date: Date) => void;
  onDropTaskToTimeSlot?: (taskId: string, dateTime: Date) => void;
  onAddTask: (date: Date) => void;
  onMonthClick: (date: Date) => void;
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({
  currentDate,
  viewMode,
  tasks,
  filteredTasks,
  filters,
  isLoading,
  onFilterChange,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  onDropTask,
  onDropTaskToTimeSlot,
  onAddTask,
  onMonthClick
}) => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<EnhancedTodo | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
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
      onEditTask(task as EnhancedTodo);
    } else {
      onAddTask(selectedDate);
    }
    setIsTaskFormOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-20">
      <CalendarHeader 
        currentDate={currentDate}
        viewMode={viewMode}
        onPrevious={onPrevious}
        onNext={onNext}
        onToday={onToday}
        onViewModeChange={onViewModeChange}
      />
      
      <div className="p-4">
        <FilterBar 
          filters={filters}
          onFilterChange={onFilterChange}
        />
      
        <CalendarContent 
          viewMode={viewMode}
          currentDate={currentDate}
          tasks={filteredTasks}
          isLoading={isLoading}
          onEditTask={handleEditTask}
          onCompleteTask={onCompleteTask}
          onDeleteTask={onDeleteTask}
          onAddTask={handleOpenCreateTask}
          onDropTask={onDropTask}
          onDropTaskToTimeSlot={onDropTaskToTimeSlot}
          onMonthClick={onMonthClick}
        />
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
  );
};

export default CalendarContainer;
