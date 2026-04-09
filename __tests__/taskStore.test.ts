import { describe, it, expect, beforeEach } from '@jest/globals';
import { useTaskStore } from '@/stores/taskStore';
import { TasksAPI } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  TasksAPI: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

const mockedAPI = TasksAPI as jest.Mocked<typeof TasksAPI>;

describe('taskStore', () => {
  beforeEach(() => {
    // Reset the store state
    useTaskStore.setState({ tasks: [], isLoading: false, error: null });
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    const state = useTaskStore.getState();
    expect(state.tasks).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  describe('fetchTasks', () => {
    it('fetches and sorts tasks by dueDate', async () => {
      const tasks = [
        { id: '2', title: 'B', completed: false, description: '', dueDate: '2025-02-01', createdAt: '', updatedAt: '' },
        { id: '1', title: 'A', completed: false, description: '', dueDate: '2025-01-01', createdAt: '', updatedAt: '' },
      ];
      mockedAPI.getTasks.mockResolvedValue({ data: tasks } as any);

      await useTaskStore.getState().fetchTasks();

      const state = useTaskStore.getState();
      expect(state.tasks[0].id).toBe('1');
      expect(state.tasks[1].id).toBe('2');
      expect(state.isLoading).toBe(false);
    });

    it('places tasks without dueDate at the end', async () => {
      const tasks = [
        { id: '1', title: 'No date', completed: false, description: '', dueDate: null, createdAt: '', updatedAt: '' },
        { id: '2', title: 'Has date', completed: false, description: '', dueDate: '2025-01-01', createdAt: '', updatedAt: '' },
      ];
      mockedAPI.getTasks.mockResolvedValue({ data: tasks } as any);

      await useTaskStore.getState().fetchTasks();

      const state = useTaskStore.getState();
      expect(state.tasks[0].id).toBe('2');
      expect(state.tasks[1].id).toBe('1');
    });

    it('sets error on failure', async () => {
      mockedAPI.getTasks.mockRejectedValue(new Error('Network error'));

      await useTaskStore.getState().fetchTasks();

      const state = useTaskStore.getState();
      expect(state.error).toBe('Failed to fetch tasks');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('createTask', () => {
    it('adds the new task to the beginning', async () => {
      useTaskStore.setState({ tasks: [{ id: '1', title: 'Existing', completed: false, description: '', createdAt: '', updatedAt: '' }] });
      const newTask = { id: '2', title: 'New', completed: false, description: '', createdAt: '', updatedAt: '' };
      mockedAPI.createTask.mockResolvedValue({ data: newTask } as any);

      await useTaskStore.getState().createTask({ title: 'New', completed: false, description: '' });

      const state = useTaskStore.getState();
      expect(state.tasks[0].id).toBe('2');
      expect(state.tasks).toHaveLength(2);
    });

    it('sets error on failure', async () => {
      mockedAPI.createTask.mockRejectedValue(new Error('fail'));

      await useTaskStore.getState().createTask({ title: 'New', completed: false, description: '' });

      expect(useTaskStore.getState().error).toBe('Failed to create task');
    });
  });

  describe('updateTask', () => {
    it('updates the task in the list', async () => {
      const task = { id: '1', title: 'Old', completed: false, description: '', createdAt: '', updatedAt: '' };
      useTaskStore.setState({ tasks: [task] });
      const updated = { ...task, title: 'Updated' };
      mockedAPI.updateTask.mockResolvedValue({ data: updated } as any);

      await useTaskStore.getState().updateTask('1', { title: 'Updated' });

      expect(useTaskStore.getState().tasks[0].title).toBe('Updated');
    });

    it('sets error on failure', async () => {
      useTaskStore.setState({ tasks: [{ id: '1', title: 'T', completed: false, description: '', createdAt: '', updatedAt: '' }] });
      mockedAPI.updateTask.mockRejectedValue(new Error('fail'));

      await useTaskStore.getState().updateTask('1', { title: 'X' });

      expect(useTaskStore.getState().error).toBe('Failed to update task');
    });
  });

  describe('deleteTask', () => {
    it('removes the task from the list', async () => {
      useTaskStore.setState({
        tasks: [
          { id: '1', title: 'A', completed: false, description: '', createdAt: '', updatedAt: '' },
          { id: '2', title: 'B', completed: false, description: '', createdAt: '', updatedAt: '' },
        ],
      });
      mockedAPI.deleteTask.mockResolvedValue({} as any);

      await useTaskStore.getState().deleteTask('1');

      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].id).toBe('2');
    });

    it('sets error on failure', async () => {
      useTaskStore.setState({ tasks: [{ id: '1', title: 'T', completed: false, description: '', createdAt: '', updatedAt: '' }] });
      mockedAPI.deleteTask.mockRejectedValue(new Error('fail'));

      await useTaskStore.getState().deleteTask('1');

      expect(useTaskStore.getState().error).toBe('Failed to delete task');
    });
  });

});
