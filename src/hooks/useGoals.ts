import { useState, useCallback } from 'react';
import { GoalNode, GoalStatus } from '@/models/Goal';
import { GoalController } from '@/controllers/GoalController';

type GoalMap = Record<string, GoalNode>;

export const useGoals = () => {
  const [goals, setGoals] = useState<GoalMap>(GoalController.state.goals);
  const [isLoading, setIsLoading] = useState(false);

  const rootGoals = Object.keys(goals).filter(id => !goals[id].parentId);

  const createGoal = useCallback((goal: Partial<GoalNode>, parentId?: string) => {
    const newGoal = GoalController.createGoal(goal, parentId);
    setGoals(GoalController.state.goals);
    return newGoal;
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<GoalNode>) => {
    const updated = GoalController.updateGoal(id, updates);
    if (updated) {
      setGoals(GoalController.state.goals);
    }
    return updated;
  }, []);

  const deleteGoal = useCallback((id: string) => {
    const success = GoalController.deleteGoal(id);
    if (success) {
      setGoals(GoalController.state.goals);
    }
    return success;
  }, []);

  const getGoalById = useCallback((id: string) => GoalController.getGoalById(id), []);

  const getGoalProgress = useCallback((id: string) => GoalController.getGoalProgress(id), []);

  const getStatusColor = useCallback((status: GoalStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  }, []);

  const linkTaskToGoal = useCallback(async (goalId: string, taskId: string) => {
    const success = GoalController.linkTaskToGoal(goalId, taskId);
    if (success) {
      setGoals(GoalController.state.goals);
    }
    return success;
  }, []);

  const unlinkTaskFromGoal = useCallback(async (goalId: string, taskId: string) => {
    const success = GoalController.unlinkTaskFromGoal(goalId, taskId);
    if (success) {
      setGoals(GoalController.state.goals);
    }
    return success;
  }, []);

  return {
    goals,
    rootGoals,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalById,
    getGoalProgress,
    getStatusColor,
    linkTaskToGoal,
    unlinkTaskFromGoal,
  };
}; 