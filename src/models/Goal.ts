import { ScheduleItem } from "./AIPlanner";

export interface GoalNode {
  id: string;
  title: string;
  description?: string;
  status?: string;
  deadline?: string;
  progress: number;
  completed: boolean;
  parentId?: string;
  children: string[];
  color?: string;
  notes?: string[];
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  taskIds?: string[]; // Reference to tasks from the Tasks page
}

export interface GoalMap {
  [id: string]: GoalNode;
}

export interface GoalState {
  goals: GoalMap;
  rootGoals: string[]; // IDs of root-level goals
}

export type GoalStatus = 'completed' | 'in-progress' | 'not-started';

export interface GoalComment {
  id: string;
  goalId: string;
  text: string;
  createdAt: Date;
  author: string;
}

export interface GoalProgress {
  goalId: string;
  completedSubtasks: number;
  totalSubtasks: number;
  percentComplete: number;
  status: GoalStatus;
}