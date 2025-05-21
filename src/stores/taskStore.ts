
import { create } from 'zustand';

interface Task {
  id?: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  addTasks: (tasks: Omit<Task, 'id'>[]) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }]
  })),
  addTasks: (tasks) => set((state) => ({
    tasks: [
      ...state.tasks, 
      ...tasks.map(task => ({ ...task, id: crypto.randomUUID() }))
    ]
  })),
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === id ? { ...task, ...updatedTask } : task
    )
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id)
  })),
  getTasks: () => get().tasks
}));