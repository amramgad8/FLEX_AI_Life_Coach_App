
import React, { useState } from 'react';
import { EnhancedTodo } from '@/models/Todo';
import TaskItem from './TaskItem';
import { format, parseISO, isSameDay } from 'date-fns';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DayViewProps {
  date: Date;
  tasks: EnhancedTodo[];
  onEditTask: (task: EnhancedTodo) => void;
  onCompleteTask: (task: EnhancedTodo, completed: boolean) => void;
  onDeleteTask: (task: EnhancedTodo) => void;
  onAddTask: (date: Date) => void;
  onDropTask: (taskId: string, date: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  tasks,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  onDropTask
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => onDropTask(item.id, date),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Group tasks by hour
  const tasksByHour: Record<number, EnhancedTodo[]> = {};
  
  for (let i = 0; i < 24; i++) {
    tasksByHour[i] = [];
  }
  
  tasks.forEach(task => {
    if (task.startTime) {
      // Use the task's scheduled time
      const startTime = new Date(task.startTime);
      const hour = startTime.getHours();
      
      if (tasksByHour[hour]) {
        tasksByHour[hour].push(task);
      }
    } else {
      // Default to 9 AM if no time specified
      const defaultHour = 9;
      if (tasksByHour[defaultHour]) {
        tasksByHour[defaultHour].push(task);
      }
    }
  });

  return (
    <div
      ref={drop}
      className={`flex flex-col h-full overflow-y-auto ${isOver ? 'bg-blue-50' : ''}`}
    >
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <h3 className="text-xl font-semibold">{format(date, 'EEEE, MMMM d')}</h3>
        <p className="text-gray-500">{tasks.length} tasks</p>
        <Button
          onClick={() => onAddTask(date)}
          className="mt-2"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Task
        </Button>
      </div>
      
      <div className="flex-1 p-4">
        {Array.from({ length: 24 }).map((_, hour) => (
          <div key={hour} className="mb-4">
            <div className="flex items-center mb-2">
              <div className="text-sm font-medium text-gray-500 w-16">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            
            <div className="pl-16">
              {tasksByHour[hour].length > 0 ? (
                tasksByHour[hour].map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onClick={onEditTask}
                    onComplete={onCompleteTask}
                    onDelete={onDeleteTask}
                  />
                ))
              ) : (
                <div 
                  className="h-12 border border-dashed border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    // Create a date object for this specific hour
                    const newTaskDate = new Date(date);
                    newTaskDate.setHours(hour, 0, 0, 0);
                    onAddTask(newTaskDate);
                  }}
                >
                  <Plus className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400 ml-1">Add task</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;
