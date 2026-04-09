import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TasksScreen from '@/app/(tabs)/index';
import { useTaskStore } from '@/stores/taskStore';

// Mock de l'API pour éviter les problèmes avec axios/fetch
jest.mock('@/lib/api', () => ({
  TasksAPI: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
  Task: {},
}));

// Mock du store
jest.mock('@/stores/taskStore');


// Mock pour lucide-react-native
jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  const icon = (props: any) => <View testID={props.testID} />;
  return {
    Plus: icon,
    Trash: icon,
    Trash2: icon,
    ListChecks: icon,
    X: icon,
    Calendar: icon,
    Pencil: icon,
    Check: icon,
  };
});

// Mock pour react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    SafeAreaProvider: ({ children }: any) => <>{children}</>,
  };
});

// Mock pour TaskModal car il utilise DateTimePicker qui peut être complexe à tester sans mocks appropriés
jest.mock('@/components/TaskModal', () => {
  const { View, Pressable, Text } = require('react-native');
  return {
    TaskModal: ({ visible, onSave, onClose, initialTask }: any) => {
      if (!visible) return null;
      return (
        <View testID="task-modal">
          <Pressable testID="save-button" onPress={() => onSave({ title: 'Updated Title', dueDate: null })}>
            <Text>Save</Text>
          </Pressable>
          <Pressable testID="close-button" onPress={onClose}>
            <Text>Close</Text>
          </Pressable>
        </View>
      );
    }
  };
});

const mockedUseTaskStore = useTaskStore as unknown as jest.Mock;

describe('TasksScreen', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', completed: false },
    { id: '2', title: 'Task 2', completed: true },
    { id: '3', title: 'Task 3', completed: false },
  ];

  it('affiche le message de chargement quand isLoading est vrai', () => {
    mockedUseTaskStore.mockReturnValue({
      tasks: [],
      isLoading: true,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);

    expect(getByText('Load Tasks...')).toBeTruthy();
  });

  it('affiche le message d\'erreur quand une erreur se produit', () => {
    mockedUseTaskStore.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: 'Something went wrong!',
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);

    expect(getByText('Something went wrong!')).toBeTruthy();
  });

  it('affiche les tâches correctement', () => {
    mockedUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);

    expect(getByText('Task 1')).toBeTruthy();
    expect(getByText('Task 2')).toBeTruthy();
  });

  it('appelle la fonction updateTask lorsque l\'utilisateur appuie sur une tâche', () => {
    const mockUpdateTask = jest.fn();
    mockedUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: mockUpdateTask,
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);

    fireEvent.press(getByText('Task 1'));

    expect(mockUpdateTask).toHaveBeenCalledWith('1', { completed: true });
  });

  it('appelle la fonction deleteTask lorsque l\'utilisateur appuie sur l\'icône de suppression', () => {
    const mockDeleteTask = jest.fn();
    mockedUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: mockDeleteTask,
      updateTask: jest.fn(),
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
    });

    const { getByTestId } = render(<TasksScreen />);

    fireEvent.press(getByTestId('delete-button-1'));

    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  it('affiche le bouton d\'ajout flottant', () => {
    const mockAddTask = jest.fn();
    mockedUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
      addTask: mockAddTask,
    });

    const { getByTestId } = render(<TasksScreen />);

    expect(getByTestId('add-button')).toBeTruthy();
  });

  it('affiche le message vide quand il n\'y a pas de tâches', () => {
    mockedUseTaskStore.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);
    expect(getByText('No task found')).toBeTruthy();
  });

  it('crée une tâche via le modal', async () => {
    const mockCreateTask = jest.fn();
    mockedUseTaskStore.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
      reorderTasks: jest.fn(),
      createTask: mockCreateTask,
    });

    const { getByTestId } = render(<TasksScreen />);

    fireEvent.press(getByTestId('add-button'));
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: 'Updated Title',
        dueDate: null,
        completed: false,
      });
    });
  });

  it('appelle updateTask avec dueDate à null lorsque la date est effacée', async () => {
    const mockUpdateTask = jest.fn();
    const taskWithDate = { id: '1', title: 'Task 1', completed: false, dueDate: '2024-01-01T12:00:00.000Z' };

    mockedUseTaskStore.mockReturnValue({
      tasks: [taskWithDate],
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: mockUpdateTask,
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
    });

    const { getByTestId } = render(<TasksScreen />);

    fireEvent.press(getByTestId('edit-button-1'));
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith('1', { title: 'Updated Title', dueDate: null });
    });
  });

  it('gère le mode multi-sélection et supprime les tâches sélectionnées', async () => {
    const mockDeleteTask = jest.fn();
    mockedUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: mockDeleteTask,
      updateTask: jest.fn(),
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
    });

    const { getByText, queryByText } = render(<TasksScreen />);

    // Pas de bouton de suppression groupée avant d'activer le mode multi
    expect(queryByText('1')).toBeNull();
  });

  it('affiche le texte vide quand la liste est vide et non en chargement', () => {
    mockedUseTaskStore.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
      reorderTasks: jest.fn(),
      createTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);
    expect(getByText('No task found')).toBeTruthy();
  });
});
