
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { EnhancedTodo } from '@/models/Todo';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoController } from '@/controllers/TodoController';
import { toast } from '@/components/ui/use-toast';
import { format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface TaskCalendarViewProps {
  todos: EnhancedTodo[];
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
  onEditTask: (task: EnhancedTodo) => void;
  onCreateTask: (date: Date) => void;
}

const getPriorityConfig = (priority: string) => {
  const configs = {
    low: { 
      color: 'bg-flex-green',
      textColor: 'text-white',
      label: 'Low'
    },
    medium: { 
      color: 'bg-flex-yellow',
      textColor: 'text-gray-800',
      label: 'Medium'
    },
    high: { 
      color: 'bg-flex-orange',
      textColor: 'text-white',
      label: 'High'
    }
  };
  
  return configs[priority as keyof typeof configs] || configs.medium;
};

const TaskCalendarView = ({ 
  todos, 
  selectedDate, 
  onDateSelect, 
  onEditTask,
  onCreateTask
}: TaskCalendarViewProps) => {
  const queryClient = useQueryClient();
  
  // Toggle todo completion mutation
  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      TodoController.updateTodo(id, { completed }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      if (variables.completed) {
        toast({
          title: "Task completed!",
          description: "Great job! You've completed a task.",
        });
      }
    }
  });

  // Mutation for moving tasks to different dates
  const updateTaskDateMutation = useMutation({
    mutationFn: ({ id, dueDate }: { id: string; dueDate: Date }) => 
      TodoController.updateTodo(id, { dueDate } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task rescheduled",
        description: "Your task has been moved to a new date.",
      });
    }
  });

  // Date cell renderer with tasks
  const renderDateCell = (date: Date) => {
    const tasksForDate = todos.filter(todo => 
      todo.dueDate && isSameDay(todo.dueDate, date)
    );
    
    return (
      <div 
        className="w-full h-full min-h-[100px] relative"
        onClick={() => onCreateTask(date)}
      >
        <div className="text-xs font-medium mb-1">{format(date, 'd')}</div>
        
        <Droppable droppableId={date.toISOString()}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-1 max-h-[80px] overflow-y-auto scrollbar-none"
            >
              {tasksForDate.map((task, index) => {
                const priorityConfig = getPriorityConfig(task.priority);
                
                return (
                  <Draggable 
                    key={task.id} 
                    draggableId={task.id} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                        className={`px-1 py-0.5 rounded text-xs truncate cursor-pointer 
                          ${priorityConfig.color} ${priorityConfig.textColor}
                          ${task.completed ? 'opacity-60 line-through' : ''}
                          hover:opacity-90 transition-opacity`}
                      >
                        {task.title}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        {tasksForDate.length > 0 && (
          <div className="absolute bottom-1 right-1">
            <Badge variant="outline" className="text-[10px]">
              {tasksForDate.length}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newDate = new Date(destination.droppableId);
    
    updateTaskDateMutation.mutate({
      id: draggableId,
      dueDate: newDate
    });
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            className="w-full border-none"
            components={{
              Day: ({ date, ...props }) => {
                return (
                  <div
                    className="h-full"
                    {...props}
                  >
                    {renderDateCell(date)}
                  </div>
                );
              }
            }}
          />
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default TaskCalendarView;
