
import React from 'react';
import { EnhancedTodo } from '@/models/Todo';
import TaskItem from './TaskItem';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';

interface WeekViewProps {
  date: Date;
  tasks: EnhancedTodo[];
  onEditTask: (task: EnhancedTodo) => void;
  onCompleteTask: (task: EnhancedTodo, completed: boolean) => void;
  onDeleteTask: (task: EnhancedTodo) => void;
  onAddTask: (date: Date) => void;
  onDropTask: (taskId: string, date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  date,
  tasks,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  onDropTask
}) => {
  // Create an array of days for the week
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Group tasks by day
  const tasksByDay = weekDays.map(day => {
    return {
      date: day,
      tasks: tasks.filter(task => 
        task.dueDate && isSameDay(new Date(task.dueDate), day)
      )
    };
  });

  return (
    <div className="grid grid-cols-7 h-full overflow-hidden">
      {tasksByDay.map(({ date: dayDate, tasks: dayTasks }) => {
        // Create a drop ref for each day column
        const [{ isOver }, drop] = useDrop(() => ({
          accept: 'task',
          drop: (item: { id: string }) => onDropTask(item.id, dayDate),
          collect: (monitor) => ({
            isOver: !!monitor.isOver(),
          }),
        }));

        const isToday = isSameDay(dayDate, new Date());

        return (
          <div 
            key={dayDate.toISOString()} 
            ref={drop}
            className={`border-r min-h-[600px] flex flex-col ${isOver ? 'bg-blue-50' : ''}`}
          >
            <div className={`p-2 text-center sticky top-0 z-10 bg-white border-b ${isToday ? 'font-bold bg-blue-50' : ''}`}>
              <div className="text-xs text-gray-500">{format(dayDate, 'EEE')}</div>
              <div className={`text-2xl ${isToday ? 'text-blue-600' : ''}`}>
                {format(dayDate, 'd')}
              </div>
            </div>
            
            <div className="flex-1 p-2 overflow-y-auto">
              {dayTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onClick={onEditTask}
                  onComplete={onCompleteTask}
                  onDelete={onDeleteTask}
                  compact
                />
              ))}
              
              <div 
                className="mt-2 border border-dashed border-gray-200 rounded-md p-2 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                onClick={() => onAddTask(dayDate)}
              >
                <Plus className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-400 ml-1">Add</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
