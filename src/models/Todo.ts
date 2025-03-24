
// Todo data model
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export type CreateTodoInput = Omit<Todo, 'id' | 'createdAt'>;
export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt'>>;

// Enhanced Todo with additional fields
export interface EnhancedTodo extends Todo {
  priority: 'low' | 'medium' | 'high';
  duration: number; // in minutes
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  description?: string;
}

export type CreateEnhancedTodoInput = Omit<EnhancedTodo, 'id' | 'createdAt'>;
export type UpdateEnhancedTodoInput = Partial<Omit<EnhancedTodo, 'id' | 'createdAt'>>;
