import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TasksScreen from '@/app/(tabs)/index';
import { useTaskStore } from '@/stores/taskStore';
import { View, Button } from 'react-native';

// Mock du store
const mockedUseTaskStore = useTaskStore as unknown as jest.Mock;

// Mock pour TaskModal car il utilise DateTimePicker qui peut être complexe à tester sans mocks appropriés
jest.mock('@/components/TaskModal', () => ({
  TaskModal: ({ visible, onSave, onClose }: any) => {
    if (!visible) return null;
    return (
      <View testID="task-modal">
        <Button testID="save-button" title="Save" onPress={() => onSave({ title: 'Updated Title', dueDate: null })} />
        <Button testID="close-button" title="Close" onPress={onClose} />
      </View>
    );
  }
}));

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
    });

    const { getByText } = render(<TasksScreen />);

    expect(getByText('Chargement des tâches...')).toBeTruthy();
  });

  it('affiche le message d\'erreur quand une erreur se produit', () => {
    mockedUseTaskStore.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: 'Something went wrong!',
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
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
    });

    const { getByText } = render(<TasksScreen />);

    // Vérifie que les titres des tâches sont affichés
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
    });

    const { getByText } = render(<TasksScreen />);

    // Simule un appui sur la première tâche
    fireEvent.press(getByText('Task 1'));

    // Vérifie que la fonction updateTask a été appelée
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
    });

    const { getByTestId } = render(<TasksScreen />);

    // Simule un appui sur l'icône de suppression pour la première tâche
    fireEvent.press(getByTestId('delete-button-1'));

    // Vérifie que la fonction deleteTask a été appelée
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
      addTask: mockAddTask,
    });

    const { getByTestId } = render(<TasksScreen />);

    // Vérifie que le bouton flottant est présent
    expect(getByTestId('add-button')).toBeTruthy();
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
    });

    const { getByText, getByTestId } = render(<TasksScreen />);

    // Simule l'ouverture de la modale d'édition
    // Note: Dans notre mock de TaskItem, onEdit est appelé quand on clique sur le bouton d'édition
    // Mais ici on utilise le composant réel TaskItem qui a un bouton d'édition
    fireEvent.press(getByTestId('edit-button-1'));

    // Le mock de TaskModal devrait maintenant être visible
    // On simule le clic sur "Save" qui appelle onSave avec dueDate: null
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith('1', { title: 'Updated Title', dueDate: null });
    });
  });
});
