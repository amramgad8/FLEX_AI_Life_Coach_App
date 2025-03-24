
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoController } from '@/controllers/TodoController';
import { EnhancedTodo, TaskFilters } from '@/models/Todo';
import { toast } from '@/components/ui/use-toast';
import { isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';

export const useTasks = () => {
  const queryClient = useQueryClient();
  
  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: (newTask: Partial<EnhancedTodo>) => 
      TodoController.createTodo(newTask as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task created",
        description: "Your task has been added to the calendar.",
      });
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: (task: Partial<EnhancedTodo>) => 
      TodoController.updateTodo(task.id!, task as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    }
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => 
      TodoController.deleteTodo(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task deleted",
        description: "Your task has been removed from the calendar.",
      });
    }
  });
  
  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, newDate }: { taskId: string; newDate: Date }) => 
      TodoController.moveToDate(taskId, newDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task moved",
        description: "Your task has been rescheduled successfully.",
      });
    }
  });

  // Tasks query
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => TodoController.getTodos()
  });

  // Filter tasks
  const filterTasks = (tasks: EnhancedTodo[], filters: TaskFilters) => {
    return tasks.filter(task => {
      // Filter by search
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filter by priority
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }
      
      // Filter by category
      if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateRange.from && task.dueDate && 
          isBefore(new Date(task.dueDate), startOfDay(filters.dateRange.from))) {
        return false;
      }
      
      if (filters.dateRange.to && task.dueDate && 
          isAfter(new Date(task.dueDate), startOfDay(filters.dateRange.to))) {
        return false;
      }
      
      // Filter by duration
      if (filters.durationRange.min !== undefined && task.duration < filters.durationRange.min) {
        return false;
      }
      
      if (filters.durationRange.max !== undefined && task.duration > filters.durationRange.max) {
        return false;
      }
      
      // Filter by completion status
      if (!filters.showCompleted && task.completed) {
        return false;
      }
      
      return true;
    });
  };

  return {
    tasks,
    isLoading,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    moveTask: moveTaskMutation.mutate,
    completeTask: (task: EnhancedTodo, completed: boolean) => {
      updateTaskMutation.mutate({ id: task.id, completed });
    },
    filterTasks
  };
};
