import React from 'react';
import { EnhancedTodo } from '@/models/Todo';
import TaskItem from './TaskItem';
import { format, parseISO } from 'date-fns';
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
  onDropTaskToTimeSlot?: (taskId: string, dateTime: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  tasks,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  onDropTask,
  onDropTaskToTimeSlot
}) => {
  // Create a drop target for the entire day view
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => {
      console.log("Dropped Task ID in DayView:", item.id);
      // By default, dropping on the day view doesn't assign a specific hour
      onDropTask(item.id, date);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Distribute tasks to hours based on their startTime
  const tasksByHour: Record<number, EnhancedTodo[]> = {};

  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    tasksByHour[i] = [];
  }

  // Only assign tasks with a valid startTime to their specific hour
  tasks.forEach(task => {
    if (task.startTime) {
      const parsedTime = typeof task.startTime === 'string' 
        ? parseISO(task.startTime) 
        : new Date(task.startTime);
      
      // Make sure we have a valid date
      if (!isNaN(parsedTime.getTime())) {
        const taskHour = parsedTime.getHours();
        tasksByHour[taskHour].push(task);
      }
    }
  });

  // Filter tasks without startTime for displaying in a separate section
  const unscheduledTasks = tasks.filter(task => !task.startTime);

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
        {/* Unscheduled tasks section */}
        {unscheduledTasks.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Unscheduled Tasks</h4>
              <div className="flex-1 border-t border-gray-200 ml-4"></div>
            </div>
            <div className="space-y-2">
              {unscheduledTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onClick={onEditTask}
                  onComplete={onCompleteTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </div>
        )}
      
        {/* Hour-by-hour schedule */}
        {Array.from({ length: 24 }).map((_, hour) => {
          // Create a separate drop target for each hour
          const [{ isHourOver }, hourDrop] = useDrop(() => ({
            accept: 'task',
            drop: (item: { id: string }) => {
              console.log(`Dropped Task ID: ${item.id} on hour: ${hour}`);
              // Create a new date with the current date and the target hour
              const newDate = new Date(date);
              newDate.setHours(hour, 0, 0, 0);
              // Use the time slot specific drop handler if available
              if (onDropTaskToTimeSlot) {
                onDropTaskToTimeSlot(item.id, newDate);
              } else {
                // Fallback to regular drop
                onDropTask(item.id, newDate);
              }
              return { hour };
            },
            collect: (monitor) => ({
              isHourOver: !!monitor.isOver(),
            }),
          }));

          return (
            <div 
              key={hour} 
              className="mb-4"
              ref={hourDrop}
            >
              <div className="flex items-center mb-2">
                <div className="text-sm font-medium text-gray-500 w-16">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div className={`flex-1 border-t ${isHourOver ? 'border-blue-300 border-2' : 'border-gray-200'}`}></div>
              </div>
              
              <div className="pl-16">
                {tasksByHour[hour].length > 0 ? (
                  <div className="space-y-2">
                    {tasksByHour[hour].map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onClick={onEditTask}
                        onComplete={onCompleteTask}
                        onDelete={onDeleteTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div 
                    className={`h-12 border border-dashed ${isHourOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} rounded-md flex items-center justify-center hover:bg-gray-50 cursor-pointer`}
                    onClick={() => {
                      const newTaskDate = new Date(date);
                      newTaskDate.setHours(hour, 0, 0, 0);
                      console.log("Adding task at:", newTaskDate);
                      onAddTask(newTaskDate);
                    }}
                  >
                    <Plus className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400 ml-1">Add task</span>
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

export default DayView;
