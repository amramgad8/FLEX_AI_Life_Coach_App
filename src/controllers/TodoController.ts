import { Todo, CreateTodoInput, UpdateTodoInput, EnhancedTodo, CreateEnhancedTodoInput, UpdateEnhancedTodoInput, EisenhowerQuadrant } from '../models/Todo';
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
          duration: todo.duration || 30,
          eisenhowerQuadrant: todo.eisenhowerQuadrant,
          timeSpent: todo.timeSpent || 0,
          aiGenerated: todo.aiGenerated || false,
          resources: todo.resources || []
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
          title: (todoInput as any).title || 'Untitled Task',
          createdAt: new Date(),
          dueDate: (todoInput as any).dueDate ? new Date((todoInput as any).dueDate) : undefined,
          startTime: (todoInput as any).startTime ? new Date((todoInput as any).startTime) : undefined,
          endTime: (todoInput as any).endTime ? new Date((todoInput as any).endTime) : undefined,
          priority: (todoInput as any).priority || 'medium',
          category: (todoInput as any).category || 'other',
          duration: (todoInput as any).duration || 30,
          timeSpent: (todoInput as any).timeSpent || 0,
          aiGenerated: (todoInput as any).aiGenerated || false,
          resources: (todoInput as any).resources || []
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
  static async updateTodo(id: string, todoInput: UpdateTodoInput | UpdateEnhancedTodoInput): Promise<EnhancedTodo | null> {
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
    console.log("Moving task to new date:", newDate);
    return this.updateTodo(id, { 
      dueDate: newDate 
    } as UpdateEnhancedTodoInput);
  }

  // Move a todo to a specific time slot (update its startTime)
  static async moveToTimeSlot(id: string, newDateTime: Date): Promise<EnhancedTodo | null> {
    console.log("Moving task to time slot:", newDateTime);
    // Create a new date for endTime (1 hour after startTime by default)
    const endDateTime = new Date(newDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);
    
    return this.updateTodo(id, { 
      startTime: newDateTime,
      endTime: endDateTime,
      dueDate: newDateTime // Also update the due date to match
    } as UpdateEnhancedTodoInput);
  }

  // Log time spent on a task (for Pomodoro integration)
  static async logTimeSpent(id: string, minutes: number): Promise<EnhancedTodo | null> {
    const task = await this.getTaskById(id);
    if (!task) return null;
    
    const currentTimeSpent = task.timeSpent || 0;
    return this.updateTodo(id, { 
      timeSpent: currentTimeSpent + minutes 
    } as UpdateEnhancedTodoInput);
  }

  // Get a single task by ID
  static async getTaskById(id: string): Promise<EnhancedTodo | null> {
    try {
      const todos = await this.getTodos();
      return todos.find(todo => todo.id === id) || null;
    } catch (error) {
      console.error('Failed to get task by id:', error);
      return null;
    }
  }

  // Update Eisenhower quadrant for a task
  static async updateEisenhowerQuadrant(id: string, quadrant: EisenhowerQuadrant): Promise<EnhancedTodo | null> {
    return this.updateTodo(id, { eisenhowerQuadrant: quadrant } as UpdateEnhancedTodoInput);
  }

  // Convert AI generated plan to tasks
  static async convertAIPlanToTasks(planItems: any[]): Promise<EnhancedTodo[]> {
    const tasks: EnhancedTodo[] = [];
    
    for (const item of planItems) {
      const newTask = await this.createTodo({
        title: item.activity,
        completed: false,
        priority: item.priority || 'medium',
        category: 'other',
        duration: item.duration || 30,
        dueDate: new Date(),
        description: item.description || '',
        aiGenerated: true,
        resources: item.resources || []
      } as CreateEnhancedTodoInput);
      
      tasks.push(newTask);
    }
    
    return tasks;
  }
}
