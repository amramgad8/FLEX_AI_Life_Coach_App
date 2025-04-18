import React, { useRef } from 'react';
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
  const dayRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const boundingRect = dayRef.current?.getBoundingClientRect();

      if (clientOffset && boundingRect) {
        const y = clientOffset.y - boundingRect.top;
        const hourHeight = boundingRect.height / 24;
        const hour = Math.floor(y / hourHeight);

        const newDate = new Date(date);
        newDate.setHours(hour, 0, 0, 0);

        console.log(`Dropped on hour: ${hour}`);

        if (onDropTaskToTimeSlot) {
          onDropTaskToTimeSlot(item.id, newDate);
        } else {
          onDropTask(item.id, newDate);
        }
      } else {
        onDropTask(item.id, date);
      }
    },
  }));

  const tasksByHour: Record<number, EnhancedTodo[]> = {};
  for (let i = 0; i < 24; i++) tasksByHour[i] = [];

  tasks.forEach(task => {
    if (task.startTime) {
      const parsed = typeof task.startTime === 'string' ? parseISO(task.startTime) : new Date(task.startTime);
      if (!isNaN(parsed.getTime())) {
        tasksByHour[parsed.getHours()].push(task);
      }
    }
  });

  const unscheduled = tasks.filter(t => !t.startTime);

  return (
    <div
      ref={(el) => {
        if (el) {
          drop(el); // connect drop
          dayRef.current = el; // connect ref
        }
      }}
      className="flex flex-col h-full overflow-y-auto"
    >
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <h3 className="text-xl font-semibold">{format(date, 'EEEE, MMMM d')}</h3>
        <p className="text-gray-500">{tasks.length} tasks</p>
        <Button onClick={() => onAddTask(date)} className="mt-2" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Task
        </Button>
      </div>

      <div className="flex-1 p-4">
        {unscheduled.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Unscheduled Tasks</h4>
              <div className="flex-1 border-t border-gray-200 ml-4"></div>
            </div>
            <div className="space-y-2">
              {unscheduled.map(task => (
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
                  className="h-12 border border-dashed border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setHours(hour, 0, 0, 0);
                    onAddTask(newDate);
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
