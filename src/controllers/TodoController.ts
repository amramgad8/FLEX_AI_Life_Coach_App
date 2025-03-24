
import { Todo, CreateTodoInput, UpdateTodoInput, EnhancedTodo, CreateEnhancedTodoInput } from '../models/Todo';
import { ApiService } from '../services/ApiService';

// This controller interfaces with your FastAPI backend
export class TodoController {
  private static STORAGE_KEY = 'todos';
  private static ENDPOINT = '/todos';

  // Flag to determine if we should use the API or localStorage
  private static useApi = false; // Set to true when your FastAPI backend is ready

  // Get all todos
  static async getTodos(): Promise<EnhancedTodo[]> {
    try {
      if (this.useApi) {
        // Use the API service
        return await ApiService.get<EnhancedTodo[]>(this.ENDPOINT);
      } else {
        // Fallback to localStorage
        const storedTodos = localStorage.getItem(this.STORAGE_KEY);
        const parsedTodos = storedTodos ? JSON.parse(storedTodos) : [];

        // Convert dates from strings to Date objects for any existing date fields
        return parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date(),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          startTime: todo.startTime ? new Date(todo.startTime) : undefined,
          endTime: todo.endTime ? new Date(todo.endTime) : undefined,
          priority: todo.priority || 'medium',
          category: todo.category || 'other',
          duration: todo.duration || 30
        }));
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      return [];
    }
  }

  // Create a new todo
  static async createTodo(todoInput: CreateTodoInput | CreateEnhancedTodoInput): Promise<EnhancedTodo> {
    try {
      if (this.useApi) {
        // Use the API service
        return await ApiService.post<EnhancedTodo>(this.ENDPOINT, todoInput);
      } else {
        // Fallback to localStorage
        const todos = await this.getTodos();
        const newTodo: EnhancedTodo = {
          ...todoInput as any,
          id: Date.now().toString(),
          createdAt: new Date(),
          priority: (todoInput as any).priority || 'medium',
          category: (todoInput as any).category || 'other',
          duration: (todoInput as any).duration || 30
        };
        
        const updatedTodos = [...todos, newTodo];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTodos));
        
        return newTodo;
      }
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw error;
    }
  }

  // Update an existing todo
  static async updateTodo(id: string, todoInput: UpdateTodoInput): Promise<EnhancedTodo | null> {
    try {
      if (this.useApi) {
        // Use the API service
        return await ApiService.put<EnhancedTodo>(`${this.ENDPOINT}/${id}`, todoInput);
      } else {
        // Fallback to localStorage
        const todos = await this.getTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);
        
        if (todoIndex === -1) return null;
        
        const updatedTodo = {
          ...todos[todoIndex],
          ...todoInput
        };
        
        todos[todoIndex] = updatedTodo;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
        
        return updatedTodo;
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  }

  // Delete a todo
  static async deleteTodo(id: string): Promise<boolean> {
    try {
      if (this.useApi) {
        // Use the API service
        await ApiService.delete<void>(`${this.ENDPOINT}/${id}`);
        return true;
      } else {
        // Fallback to localStorage
        const todos = await this.getTodos();
        const filteredTodos = todos.filter(todo => todo.id !== id);
        
        if (filteredTodos.length === todos.length) return false;
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTodos));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw error;
    }
  }

  // Reorder todos (for drag-and-drop functionality)
  static async reorderTodos(todos: EnhancedTodo[]): Promise<boolean> {
    try {
      if (this.useApi) {
        // Use the API service - this would need a custom endpoint
        await ApiService.put<void>(`${this.ENDPOINT}/reorder`, { todos });
        return true;
      } else {
        // Fallback to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
        return true;
      }
    } catch (error) {
      console.error('Failed to reorder todos:', error);
      throw error;
    }
  }

  // Move a todo to a new date
  static async moveToDate(id: string, newDate: Date): Promise<EnhancedTodo | null> {
    return this.updateTodo(id, { dueDate: newDate });
  }
}
