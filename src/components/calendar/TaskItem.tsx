
import React from 'react';
import { EnhancedTodo, PRIORITY_CONFIG, CATEGORY_CONFIG } from '@/models/Todo';
import { format } from 'date-fns';
import { Check, Edit, Trash2, MapPin, AlarmClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDrag } from 'react-dnd';

interface TaskItemProps {
  task: EnhancedTodo;
  onClick: (task: EnhancedTodo) => void;
  onComplete: (task: EnhancedTodo, completed: boolean) => void;
  onDelete: (task: EnhancedTodo) => void;
  isDragging?: boolean;
  className?: string;
  compact?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onClick,
  onComplete,
  onDelete,
  className = '',
  compact = false
}) => {
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const categoryConfig = CATEGORY_CONFIG[task.category];
  
  // Set up drag
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        `group relative rounded-md p-2 mb-1 border-l-4 transition-all ${priorityConfig.borderColor}`,
        task.completed ? 'opacity-60 bg-gray-50' : 'bg-white',
        isDragging ? 'shadow-lg scale-105 opacity-50' : 'hover:shadow-md',
        className
      )}
      style={{ cursor: 'move' }}
    >
      <div className="flex items-start gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-5 w-5 rounded-full border",
            task.completed ? "bg-green-500 text-white border-green-500" : "bg-white border-gray-300"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onComplete(task, !task.completed);
          }}
        >
          {task.completed && <Check className="h-3 w-3" />}
        </Button>
        
        <div className="flex-1 min-w-0" onClick={(e) => {
          e.stopPropagation();
          onClick(task);
        }}>
          <h4 
            className={cn(
              "font-medium text-sm truncate",
              task.completed && "line-through text-gray-500"
            )}
          >
            {task.title}
          </h4>
          
          {!compact && (
            <>
              {task.description && (
                <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1 mt-1">
                <span className={`text-xs px-1.5 rounded-full ${categoryConfig.bgColor} ${categoryConfig.textColor}`}>
                  {categoryConfig.label}
                </span>
                
                {task.duration && (
                  <span className="text-xs flex items-center text-gray-500">
                    <AlarmClock className="h-3 w-3 mr-0.5" />
                    {task.duration} min
                  </span>
                )}
                
                {task.location && (
                  <span className="text-xs flex items-center text-gray-500">
                    <MapPin className="h-3 w-3 mr-0.5" />
                    {task.location}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(task);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Task</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Task</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
