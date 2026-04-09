import { create } from 'zustand';
import { Task, TasksAPI } from '@/lib/api';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (newTasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await TasksAPI.getTasks();
      const sortedTasks = response.data.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
      set({ tasks: sortedTasks });
    } catch  {
      set({ error: 'Failed to fetch tasks' });
    } finally {
      set({ isLoading: false });
    }
  },
  createTask: async (task) => {
    set({ isLoading: true, error: null });
    try {
      const response = await TasksAPI.createTask(task);
      set({ tasks: [response.data, ...get().tasks] });
    } catch {
      set({ error: 'Failed to create task' });
    } finally {
      set({ isLoading: false });
    }
  },
  updateTask: async (id, task) => {
    set({ isLoading: true, error: null });
    try {
      const response = await TasksAPI.updateTask(id, task);
      const updatedTasks = get().tasks.map((t) => (t.id === id ? response.data : t));
      set({
        tasks: updatedTasks,
      });
    } catch  {
      set({ error: 'Failed to update task' });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await TasksAPI.deleteTask(id);
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
    } catch  {
      set({ error: 'Failed to delete task' });
    } finally {
      set({ isLoading: false });
    }
  },
  reorderTasks: (newTasks) => {
    set({ tasks: newTasks });
  },
}));