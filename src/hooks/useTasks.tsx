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

  const moveToTimeSlot = (taskId: string, dateTime: Date) => {
    moveTaskMutation.mutate({ taskId, newDate: dateTime });
  };
  
  
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
  const filterTasks = (tasks: EnhancedTodo[], filters: TaskFilters): EnhancedTodo[] => {
    return tasks.filter((task) => {
      const {
        search,
        priorities,
        categories,
        dateRange,
        durationRange,
        showCompleted
      } = filters;
  
      // Search by title
      const matchesSearch = search
        ? task.title.toLowerCase().includes(search.toLowerCase())
        : true;
  
      // Filter by priority
      const matchesPriority = priorities.length > 0
        ? priorities.includes(task.priority)
        : true;
  
      // Filter by category
      const matchesCategory = categories.length > 0
        ? categories.includes(task.category)
        : true;
  
      // Filter by completed status
      const matchesCompleted = showCompleted ? true : !task.completed;
  
      // Filter by date range
      const matchesDateRange =
        dateRange?.from || dateRange?.to
          ? (() => {
              const taskDate = startOfDay(new Date(task.dueDate));
              const start = dateRange.from ? startOfDay(new Date(dateRange.from)) : null;
              const end = dateRange.to ? startOfDay(new Date(dateRange.to)) : null;
  
              return (!start || !isBefore(taskDate, start)) &&
                     (!end || !isAfter(taskDate, end));
            })()
          : true;
  
      // Filter by duration range
      const matchesDurationRange =
        durationRange?.min !== undefined || durationRange?.max !== undefined
          ? (() => {
              const min = durationRange.min ?? 0;
              const max = durationRange.max ?? Infinity;
              return task.duration >= min && task.duration <= max;
            })()
          : true;
  
      // Return if all match
      return (
        matchesSearch &&
        matchesPriority &&
        matchesCategory &&
        matchesCompleted &&
        matchesDateRange &&
        matchesDurationRange
      );
    });
  };
  

  // Get tasks by Eisenhower quadrant
  const getTasksByQuadrant = (quadrant: EisenhowerQuadrant) => {
    return tasks.filter(task => task.eisenhowerQuadrant === quadrant);
  };

  // New function to get task by ID
  const getTaskById = (taskId: string): EnhancedTodo | undefined => {
    return tasks.find(task => task.id === taskId);
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
    moveToTimeSlot, 
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
    getTasksByQuadrant,
    getTaskById
  };
};  
