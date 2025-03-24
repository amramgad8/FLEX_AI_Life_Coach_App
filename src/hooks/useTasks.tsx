
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoController } from '@/controllers/TodoController';
import { EnhancedTodo, TaskFilters, EisenhowerQuadrant } from '@/models/Todo';
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

  // Time logging mutation (for Pomodoro)
  const logTimeSpentMutation = useMutation({
    mutationFn: ({ taskId, minutes }: { taskId: string; minutes: number }) => 
      TodoController.logTimeSpent(taskId, minutes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Time logged",
        description: "Time spent has been logged to your task.",
      });
    }
  });

  // Eisenhower Matrix update mutation
  const updateEisenhowerQuadrantMutation = useMutation({
    mutationFn: ({ taskId, quadrant }: { taskId: string; quadrant: EisenhowerQuadrant }) => 
      TodoController.updateEisenhowerQuadrant(taskId, quadrant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Task categorized",
        description: "Task has been categorized in the Eisenhower Matrix.",
      });
    }
  });

  // Convert AI Plan to Tasks mutation
  const convertAIPlanToTasksMutation = useMutation({
    mutationFn: (planItems: any[]) => 
      TodoController.convertAIPlanToTasks(planItems),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Plan converted to tasks",
        description: "AI generated plan has been added to your tasks.",
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
      
      // Filter by Eisenhower quadrant
      if (filters.eisenhowerQuadrants?.length && task.eisenhowerQuadrant && 
          !filters.eisenhowerQuadrants.includes(task.eisenhowerQuadrant)) {
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

  // Get tasks by Eisenhower quadrant
  const getTasksByQuadrant = (quadrant: EisenhowerQuadrant) => {
    return tasks.filter(task => task.eisenhowerQuadrant === quadrant);
  };

  return {
    tasks,
    isLoading,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    moveTask: (taskId: string, date: Date) => {
      moveTaskMutation.mutate({ taskId, newDate: date });
    },
    completeTask: (task: EnhancedTodo, completed: boolean) => {
      updateTaskMutation.mutate({ id: task.id, completed });
    },
    logTimeSpent: (taskId: string, minutes: number) => {
      logTimeSpentMutation.mutate({ taskId, minutes });
    },
    updateEisenhowerQuadrant: (taskId: string, quadrant: EisenhowerQuadrant) => {
      updateEisenhowerQuadrantMutation.mutate({ taskId, quadrant });
    },
    convertAIPlanToTasks: (planItems: any[]) => {
      convertAIPlanToTasksMutation.mutate(planItems);
    },
    filterTasks,
    getTasksByQuadrant
  };
};
