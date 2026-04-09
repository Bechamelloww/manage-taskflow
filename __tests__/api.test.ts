import { describe, it, expect, beforeEach } from '@jest/globals';
import axios from 'axios';

jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
  };
});

import { TasksAPI } from '@/lib/api';

const mockAxios = axios.create() as jest.Mocked<ReturnType<typeof axios.create>>;

describe('TasksAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getTasks calls GET /tasks', async () => {
    const tasks = [{ id: '1', title: 'Test' }];
    (mockAxios.get as jest.Mock).mockResolvedValue({ data: tasks });

    const result = await TasksAPI.getTasks();
    expect(mockAxios.get).toHaveBeenCalledWith('/tasks');
    expect(result.data).toEqual(tasks);
  });

  it('createTask calls POST /tasks', async () => {
    const task = { title: 'New', completed: false, description: '' };
    const created = { id: '1', ...task };
    (mockAxios.post as jest.Mock).mockResolvedValue({ data: created });

    const result = await TasksAPI.createTask(task as any);
    expect(mockAxios.post).toHaveBeenCalledWith('/tasks', task);
    expect(result.data).toEqual(created);
  });

  it('updateTask calls PATCH /tasks/:id', async () => {
    const update = { title: 'Updated' };
    (mockAxios.patch as jest.Mock).mockResolvedValue({ data: { id: '1', ...update } });

    const result = await TasksAPI.updateTask('1', update);
    expect(mockAxios.patch).toHaveBeenCalledWith('/tasks/1', update);
    expect(result.data.title).toBe('Updated');
  });

  it('deleteTask calls DELETE /tasks/:id', async () => {
    (mockAxios.delete as jest.Mock).mockResolvedValue({});

    await TasksAPI.deleteTask('1');
    expect(mockAxios.delete).toHaveBeenCalledWith('/tasks/1');
  });
});
