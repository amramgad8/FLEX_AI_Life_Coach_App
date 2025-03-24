
import React from 'react';
import { EnhancedTodo } from '@/models/Todo';
import { ViewMode } from '@/hooks/useCalendarNavigation';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import { isSameDay } from 'date-fns';

interface CalendarContentProps {
  viewMode: ViewMode;
  currentDate: Date;
  tasks: EnhancedTodo[];
  onEditTask: (task: EnhancedTodo) => void;
  onCompleteTask: (task: EnhancedTodo, completed: boolean) => void;
  onDeleteTask: (task: EnhancedTodo) => void;
  onAddTask: (date: Date) => void;
  onDropTask: (taskId: string, date: Date) => void;
  onMonthClick: (date: Date) => void;
  isLoading: boolean;
}

const CalendarContent: React.FC<CalendarContentProps> = ({
  viewMode,
  currentDate,
  tasks,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  onDropTask,
  onMonthClick,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] border rounded-lg overflow-hidden">
      {viewMode === 'day' && (
        <DayView 
          date={currentDate}
          tasks={tasks.filter(task => 
            task.dueDate && isSameDay(new Date(task.dueDate), currentDate)
          )}
          onEditTask={onEditTask}
          onCompleteTask={onCompleteTask}
          onDeleteTask={onDeleteTask}
          onAddTask={onAddTask}
          onDropTask={onDropTask}
        />
      )}
      
      {viewMode === 'week' && (
        <WeekView 
          date={currentDate}
          tasks={tasks}
          onEditTask={onEditTask}
          onCompleteTask={onCompleteTask}
          onDeleteTask={onDeleteTask}
          onAddTask={onAddTask}
          onDropTask={onDropTask}
        />
      )}
      
      {viewMode === 'month' && (
        <MonthView 
          date={currentDate}
          tasks={tasks}
          onEditTask={onEditTask}
          onCompleteTask={onCompleteTask}
          onDeleteTask={onDeleteTask}
          onAddTask={onAddTask}
          onDropTask={onDropTask}
        />
      )}
      
      {viewMode === 'year' && (
        <YearView 
          date={currentDate}
          tasks={tasks}
          onMonthClick={onMonthClick}
        />
      )}
    </div>
  );
};

export default CalendarContent;
