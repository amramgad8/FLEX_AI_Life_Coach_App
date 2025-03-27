import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GoalController } from '@/controllers/GoalController';
import { GoalNode, GoalState, GoalStatus } from '@/models/Goal';
import { toast } from '@/components/ui/use-toast';

export const useGoals = () => {
  const queryClient = useQueryClient();
  
  // Fetch goals using React Query
  const { data: goalState, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => GoalController.getGoals(),
    refetchOnWindowFocus: false,
  });
  
  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async ({ goal, parentId }: { goal: Partial<GoalNode>; parentId?: string }) => {
      return Promise.resolve(GoalController.createGoal(goal, parentId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Goal created",
        description: "Your new goal has been created.",
      });
    }
  });
  
  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GoalNode> }) => {
      return Promise.resolve(GoalController.updateGoal(id, updates));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully.",
      });
    }
  });
  
  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      return Promise.resolve(GoalController.deleteGoal(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Goal deleted",
        description: "The goal and its subtasks have been removed.",
      });
    }
  });
  
  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      return Promise.resolve(GoalController.updateProgress(id, progress));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    }
  });
  
  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async ({ goalId, note }: { goalId: string; note: string }) => {
      return Promise.resolve(GoalController.addNote(goalId, note));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Note added",
        description: "Your note has been added to the goal.",
      });
    }
  });
  
  // Link task mutation
  const linkTaskMutation = useMutation({
    mutationFn: async ({ goalId, taskId }: { goalId: string; taskId: string }) => {
      return Promise.resolve(GoalController.linkTaskToGoal(goalId, taskId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Task linked",
        description: "The task has been linked to this goal.",
      });
    }
  });

  // Sync with tasks (this would typically be on a schedule or triggered by events)
  useEffect(() => {
    const syncInterval = setInterval(() => {
      GoalController.syncWithTasks();
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    }, 60000); // Sync every minute
    
    return () => clearInterval(syncInterval);
  }, [queryClient]);
  
  // Helper to get status color
  const getStatusColor = (status: GoalStatus): string => {
    switch (status) {
      case 'completed':
        return '#4CAF50'; // Green
      case 'in-progress':
        return '#FFC107'; // Yellow
      case 'not-started':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };
  
  return {
    goals: goalState?.goals || {},
    rootGoals: goalState?.rootGoals || [],
    isLoading,
    createGoal: (goal: Partial<GoalNode>, parentId?: string) => 
      createGoalMutation.mutate({ goal, parentId }),
    updateGoal: (id: string, updates: Partial<GoalNode>) => 
      updateGoalMutation.mutate({ id, updates }),
    deleteGoal: (id: string) => 
      deleteGoalMutation.mutate(id),
    updateProgress: (id: string, progress: number) => 
      updateProgressMutation.mutate({ id, progress }),
    addNote: (goalId: string, note: string) => 
      addNoteMutation.mutate({ goalId, note }),
    linkTask: (goalId: string, taskId: string) => 
      linkTaskMutation.mutate({ goalId, taskId }),
    getGoalById: (id: string) => 
      goalState?.goals[id] || null,
    getChildrenGoals: (parentId: string) => 
      GoalController.getChildrenGoals(parentId),
    getGoalStatus: (goalId: string) => 
      GoalController.getGoalStatus(goalId),
    getGoalProgress: (goalId: string) => 
      GoalController.getGoalProgress(goalId),
    getStatusColor
  };
};