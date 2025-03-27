import { v4 as uuidv4 } from 'uuid';
import { GoalNode, GoalMap, GoalState, GoalStatus, GoalProgress } from '../models/Goal';
import { TodoController } from './TodoController';

// Mock data for initial development
const initialGoals: GoalMap = {
  'goal-1': {
    id: 'goal-1',
    title: 'Learn React',
    description: 'Master React fundamentals and advanced concepts',
    progress: 65,
    completed: false,
    children: ['goal-2', 'goal-3', 'goal-4'],
    icon: '📚',
    color: '#4CAF50',
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 5, 15),
    notes: ['Focus on hooks', 'Check React 18 features'],
    deadline: new Date(2023, 12, 31).toISOString()
  },
  'goal-2': {
    id: 'goal-2',
    title: 'Learn Hooks',
    description: 'Understand useState, useEffect, useMemo, etc.',
    progress: 100,
    completed: true,
    parentId: 'goal-1',
    children: [],
    icon: '🪝',
    color: '#2196F3',
    createdAt: new Date(2023, 5, 16),
    updatedAt: new Date(2023, 5, 20),
    notes: ['Practice with custom hooks'],
    taskIds: ['task-1', 'task-2']
  },
  'goal-3': {
    id: 'goal-3',
    title: 'Learn Context API',
    description: 'Understand global state management with Context',
    progress: 50,
    completed: false,
    parentId: 'goal-1',
    children: [],
    icon: '🌐',
    color: '#FFC107',
    createdAt: new Date(2023, 5, 18),
    updatedAt: new Date(2023, 5, 22),
    notes: ['Compare with Redux']
  },
  'goal-4': {
    id: 'goal-4',
    title: 'Learn Performance Optimization',
    description: 'Master techniques for optimizing React apps',
    progress: 25,
    completed: false,
    parentId: 'goal-1',
    children: [],
    icon: '⚡',
    color: '#9C27B0',
    createdAt: new Date(2023, 5, 25),
    updatedAt: new Date(2023, 5, 25),
    notes: ['Look into React.memo', 'Understand when to use useMemo and useCallback']
  },
  'goal-5': {
    id: 'goal-5',
    title: 'Fitness Goal',
    description: 'Get in shape and improve overall health',
    progress: 40,
    completed: false,
    children: ['goal-6', 'goal-7'],
    icon: '💪',
    color: '#F44336',
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 5),
    notes: ['Focus on consistency', 'Start slow and build up'],
    deadline: new Date(2023, 12, 31).toISOString()
  },
  'goal-6': {
    id: 'goal-6',
    title: 'Cardio Routine',
    description: 'Establish a regular cardio workout schedule',
    progress: 60,
    completed: false,
    parentId: 'goal-5',
    children: [],
    icon: '🏃',
    color: '#E91E63',
    createdAt: new Date(2023, 6, 2),
    updatedAt: new Date(2023, 6, 10)
  },
  'goal-7': {
    id: 'goal-7',
    title: 'Strength Training',
    description: 'Develop a strength training program',
    progress: 20,
    completed: false,
    parentId: 'goal-5',
    children: [],
    icon: '🏋️',
    color: '#FF5722',
    createdAt: new Date(2023, 6, 3),
    updatedAt: new Date(2023, 6, 15)
  }
};

// Initial state for our goals
const initialState: GoalState = {
  goals: initialGoals,
  rootGoals: ['goal-1', 'goal-5']
};

// In a real app, this would be replaced with API calls
export class GoalController {
  static state: GoalState = { ...initialState };

  // Get all goals
  static getGoals(): GoalState {
    return this.state;
  }

  // Get a specific goal by ID
  static getGoalById(id: string): GoalNode | null {
    return this.state.goals[id] || null;
  }

  // Get children of a goal
  static getChildrenGoals(parentId: string): GoalNode[] {
    const parent = this.getGoalById(parentId);
    if (!parent) return [];
    
    return parent.children.map(childId => this.state.goals[childId]).filter(Boolean);
  }

  // Create a new goal
  static createGoal(goal: Partial<GoalNode>, parentId?: string): GoalNode {
    const id = uuidv4();
    const now = new Date();
    
    const newGoal: GoalNode = {
      id,
      title: goal.title || 'New Goal',
      description: goal.description || '',
      progress: goal.progress || 0,
      completed: goal.completed || false,
      children: goal.children || [],
      color: goal.color || this.getRandomColor(),
      icon: goal.icon || this.getDefaultIcon(),
      deadline: goal.deadline ? goal.deadline : undefined,
      notes: goal.notes || [],
      taskIds: goal.taskIds || [],
      createdAt: now,
      updatedAt: now
    };
    
    // Update state
    this.state = {
      ...this.state,
      goals: {
        ...this.state.goals,
        [id]: newGoal
      }
    };
    
    // If parentId is provided, add this goal as a child
    if (parentId && this.state.goals[parentId]) {
      this.addChildToGoal(parentId, id);
      newGoal.parentId = parentId;
    } else {
      // Otherwise, it's a root goal
      this.state.rootGoals.push(id);
    }
    
    return newGoal;
  }

  // Update an existing goal
  static updateGoal(id: string, updates: Partial<GoalNode>): GoalNode | null {
    const goal = this.getGoalById(id);
    if (!goal) return null;
    
    const updatedGoal = {
      ...goal,
      ...updates,
      updatedAt: new Date()
    };
    
    this.state = {
      ...this.state,
      goals: {
        ...this.state.goals,
        [id]: updatedGoal
      }
    };
    
    return updatedGoal;
  }

  // Delete a goal and all its children
  static deleteGoal(id: string): boolean {
    const goal = this.getGoalById(id);
    if (!goal) return false;
    
    // Recursively delete all children
    goal.children.forEach(childId => this.deleteGoal(childId));
    
    // Remove from parent's children if needed
    if (goal.parentId) {
      const parent = this.getGoalById(goal.parentId);
      if (parent) {
        parent.children = parent.children.filter(childId => childId !== id);
        this.state.goals[goal.parentId] = parent;
      }
    }
    
    // Remove from rootGoals if needed
    if (!goal.parentId) {
      this.state.rootGoals = this.state.rootGoals.filter(goalId => goalId !== id);
    }
    
    // Delete the goal itself
    const { [id]: _, ...restGoals } = this.state.goals;
    this.state.goals = restGoals;
    
    return true;
  }

  // Add a child to a goal
  static addChildToGoal(parentId: string, childId: string): boolean {
    const parent = this.getGoalById(parentId);
    const child = this.getGoalById(childId);
    
    if (!parent || !child) return false;
    
    // Update parent's children array
    parent.children = [...parent.children, childId];
    
    // Update child's parentId
    child.parentId = parentId;
    
    // If child was a root goal, remove from rootGoals
    if (this.state.rootGoals.includes(childId)) {
      this.state.rootGoals = this.state.rootGoals.filter(id => id !== childId);
    }
    
    // Update state
    this.state = {
      ...this.state,
      goals: {
        ...this.state.goals,
        [parentId]: parent,
        [childId]: child
      }
    };
    
    return true;
  }

  // Remove a child from a goal
  static removeChildFromGoal(parentId: string, childId: string): boolean {
    const parent = this.getGoalById(parentId);
    const child = this.getGoalById(childId);
    
    if (!parent || !child) return false;
    
    // Update parent's children array
    parent.children = parent.children.filter(id => id !== childId);
    
    // Remove parentId from child
    child.parentId = undefined;
    
    // Add child to rootGoals
    this.state.rootGoals.push(childId);
    
    // Update state
    this.state = {
      ...this.state,
      goals: {
        ...this.state.goals,
        [parentId]: parent,
        [childId]: child
      }
    };
    
    return true;
  }

  // Update goal progress
  static updateProgress(id: string, progress: number): boolean {
    const goal = this.getGoalById(id);
    if (!goal) return false;
    
    goal.progress = Math.min(Math.max(progress, 0), 100);
    goal.completed = goal.progress === 100;
    goal.updatedAt = new Date();
    
    // Update state
    this.state = {
      ...this.state,
      goals: {
        ...this.state.goals,
        [id]: goal
      }
    };
    
    // If this goal has a parent, update parent's progress
    if (goal.parentId) {
      this.recalculateParentProgress(goal.parentId);
    }
    
    return true;
  }

  // Recalculate a parent goal's progress based on its children
  static recalculateParentProgress(parentId: string): void {
    const parent = this.getGoalById(parentId);
    if (!parent || parent.children.length === 0) return;
    
    const children = parent.children.map(id => this.state.goals[id]).filter(Boolean);
    const totalProgress = children.reduce((sum, child) => sum + child.progress, 0);
    const avgProgress = Math.round(totalProgress / children.length);
    
    parent.progress = avgProgress;
    parent.completed = avgProgress === 100;
    parent.updatedAt = new Date();
    
    // Update state
    this.state = {
      ...this.state,
      goals: {
        ...this.state.goals,
        [parentId]: parent
      }
    };
    
    // Continue up the chain if needed
    if (parent.parentId) {
      this.recalculateParentProgress(parent.parentId);
    }
  }

  // Add a note to a goal
  static addNote(goalId: string, note: string): boolean {
    const goal = this.getGoalById(goalId);
    if (!goal) return false;
    
    goal.notes = [...(goal.notes || []), note];
    goal.updatedAt = new Date();
    
    // Update state
    this.state = {
      ...this.state,
      goals: {
        ...this.state.goals,
        [goalId]: goal
      }
    };
    
    return true;
  }

  // Link a task to a goal
  static linkTaskToGoal(goalId: string, taskId: string): boolean {
    const goal = this.getGoalById(goalId);
    if (!goal) return false;
    
    // Don't add duplicate taskIds
    if (goal.taskIds && goal.taskIds.includes(taskId)) return false;
    
    goal.taskIds = [...(goal.taskIds || []), taskId];
    goal.updatedAt = new Date();
    
    // Update state
    this.state = {
      ...this.state,
      goals: {
        ...this.state.goals,
        [goalId]: goal
      }
    };
    
    return true;
  }

  // Unlink a task from a goal
  static unlinkTaskFromGoal(goalId: string, taskId: string): boolean {
    const goal = this.getGoalById(goalId);
    if (!goal || !goal.taskIds) return false;
    
    // If task is not linked, return false
    if (!goal.taskIds.includes(taskId)) return false;
    
    goal.taskIds = goal.taskIds.filter(id => id !== taskId);
    goal.updatedAt = new Date();
    
    // Update state
    this.state = {
      ...this.state,
      goals: {
        ...this.state.goals,
        [goalId]: goal
      }
    };
    
    return true;
  }

  // Get goal status
  static getGoalStatus(goalId: string): GoalStatus {
    const goal = this.getGoalById(goalId);
    if (!goal) return 'not-started';
    
    if (goal.completed) return 'completed';
    if (goal.progress > 0) return 'in-progress';
    return 'not-started';
  }

  // Get goal progress details
  static getGoalProgress(goalId: string): GoalProgress | null {
    const goal = this.getGoalById(goalId);
    if (!goal) return null;
    
    const children = goal.children.map(id => this.state.goals[id]).filter(Boolean);
    const completedSubtasks = children.filter(child => child.completed).length;
    
    return {
      goalId,
      completedSubtasks,
      totalSubtasks: children.length,
      percentComplete: goal.progress,
      status: this.getGoalStatus(goalId)
    };
  }

  // Helper method to get a random color for goals
  private static getRandomColor(): string {
    const colors = [
      '#4CAF50', // Green
      '#2196F3', // Blue
      '#FFC107', // Yellow
      '#9C27B0', // Purple
      '#F44336', // Red
      '#FF9800', // Orange
      '#00BCD4', // Cyan
      '#795548', // Brown
      '#607D8B', // Blue Grey
      '#E91E63', // Pink
      '#673AB7', // Deep Purple
      '#3F51B5', // Indigo
      '#009688', // Teal
      '#8BC34A'  // Light Green
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Helper method to get a default icon
  private static getDefaultIcon(): string {
    const icons = ['🎯', '📌', '⭐', '📝', '📊', '🚀', '🔍', '⏳', '📈', '🏆'];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  // Sync with tasks from TodoController 
  static async syncWithTasks(): Promise<void> {
    // This would ideally be an API call in a real app
    try {
      const tasks = await TodoController.getTodos();
      
      // Update progress for goals linked to tasks
      Object.values(this.state.goals).forEach(goal => {
        if (!goal.taskIds || goal.taskIds.length === 0) return;
        
        const linkedTasks = tasks.filter(task => goal.taskIds?.includes(task.id));
        if (linkedTasks.length === 0) return;
        
        const completedTasks = linkedTasks.filter(task => task.completed).length;
        const newProgress = Math.round((completedTasks / linkedTasks.length) * 100);
        
        if (newProgress !== goal.progress) {
          this.updateProgress(goal.id, newProgress);
        }
      });
    } catch (error) {
      console.error('Error syncing with tasks:', error);
    }
  }
}