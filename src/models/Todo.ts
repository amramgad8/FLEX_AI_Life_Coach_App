// Todo data model
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export type CreateTodoInput = Omit<Todo, 'id' | 'createdAt'>;
export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt'>>;

// Task priority types and configuration
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'work' | 'personal' | 'study' | 'health' | 'errands' | 'meeting' | 'other';

// Eisenhower Matrix quadrants
export type EisenhowerQuadrant = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';

export const PRIORITY_CONFIG: Record<TaskPriority, { 
  label: string; 
  color: string;
  borderColor: string; 
  bgColor: string;
  textColor: string;
}> = {
  low: { 
    label: 'Low', 
    color: 'bg-green-500',
    borderColor: 'border-green-500', 
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  medium: { 
    label: 'Medium', 
    color: 'bg-yellow-500', 
    borderColor: 'border-yellow-500', 
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  high: { 
    label: 'High', 
    color: 'bg-orange-500', 
    borderColor: 'border-orange-500', 
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800'
  },
  urgent: { 
    label: 'Urgent', 
    color: 'bg-red-500', 
    borderColor: 'border-red-500', 
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  }
};

export const CATEGORY_CONFIG: Record<TaskCategory, {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  work: {
    label: 'Work',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  personal: {
    label: 'Personal',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800'
  },
  study: {
    label: 'Study',
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800'
  },
  health: {
    label: 'Health',
    color: 'bg-teal-500',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-800'
  },
  errands: {
    label: 'Errands',
    color: 'bg-cyan-500',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-800'
  },
  meeting: {
    label: 'Meeting',
    color: 'bg-pink-500',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800'
  },
  other: {
    label: 'Other',
    color: 'bg-gray-500',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  }
};

// Eisenhower Matrix configuration
export const EISENHOWER_CONFIG: Record<EisenhowerQuadrant, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  action: string;
}> = {
  'urgent-important': {
    label: 'Do First',
    description: 'Urgent and Important',
    color: 'bg-red-500',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    action: 'Do these tasks immediately'
  },
  'not-urgent-important': {
    label: 'Schedule',
    description: 'Not Urgent but Important',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    action: 'Decide when to do these tasks'
  },
  'urgent-not-important': {
    label: 'Delegate',
    description: 'Urgent but Not Important',
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    action: 'Who can help with these tasks?'
  },
  'not-urgent-not-important': {
    label: 'Eliminate',
    description: 'Not Urgent and Not Important',
    color: 'bg-gray-500',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    action: 'Eliminate these tasks if possible'
  }
};

// Enhanced Todo with additional fields
export interface EnhancedTodo extends Todo {
  priority: TaskPriority;
  category: TaskCategory;
  duration: number; // in minutes
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  description?: string;
  location?: string;
  eisenhowerQuadrant?: EisenhowerQuadrant;
  timeSpent?: number; // in minutes, for pomodoro tracking
  aiGenerated?: boolean; // flag for AI generated tasks
  resources?: string[]; // list of related resources
}

export type CreateEnhancedTodoInput = Omit<EnhancedTodo, 'id' | 'createdAt'>;
export type UpdateEnhancedTodoInput = Partial<Omit<EnhancedTodo, 'id' | 'createdAt'>>;

// Filters for tasks
export interface TaskFilters {
  search: string;
  priorities: TaskPriority[];
  categories: TaskCategory[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  durationRange: {
    min?: number;
    max?: number;
  };
  showCompleted: boolean;
  eisenhowerQuadrants?: EisenhowerQuadrant[];
}
