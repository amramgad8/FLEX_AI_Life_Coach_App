
import React from 'react';
import { EnhancedTodo } from '@/models/Todo';
import TaskItem from './TaskItem';
import { 
  addDays, 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameDay,
  isSameMonth
} from 'date-fns';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';

interface MonthViewProps {
  date: Date;
  tasks: EnhancedTodo[];
  onEditTask: (task: EnhancedTodo) => void;
  onCompleteTask: (task: EnhancedTodo, completed: boolean) => void;
  onDeleteTask: (task: EnhancedTodo) => void;
  onAddTask: (date: Date) => void;
  onDropTask: (taskId: string, date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  date,
  tasks,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  onDropTask
}) => {
  // Create calendar days for month view
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const rows = [];
  let days = [];
  let day = startDate;
  
  // Create calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const currentDay = day;
      days.push({
        date: day,
        isCurrentMonth: isSameMonth(day, monthStart),
        tasks: tasks.filter(task => 
          task.dueDate && isSameDay(new Date(task.dueDate), day)
        )
      });
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }
  
  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-7 border-b">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 auto-rows-fr">
        {rows.flat().map(({ date: dayDate, isCurrentMonth, tasks: dayTasks }) => {
          // Create a drop ref for each day cell
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
              className={`border-r border-b p-1 min-h-[120px] ${
                !isCurrentMonth ? 'bg-gray-50' : isOver ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className={`
                  text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-blue-600 text-white' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                `}>
                  {format(dayDate, 'd')}
                </div>
                
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => onAddTask(dayDate)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-24">
                {dayTasks.slice(0, 3).map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onClick={onEditTask}
                    onComplete={onCompleteTask}
                    onDelete={onDeleteTask}
                    compact
                    className="p-1 text-xs"
                  />
                ))}
                
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
