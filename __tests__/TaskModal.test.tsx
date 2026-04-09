import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TaskModal } from '@/components/TaskModal';

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  const icon = (props: any) => <View testID={props.testID} />;
  return { Calendar: icon, Check: icon, X: icon };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View testID="date-time-picker" />,
  };
});

describe('TaskModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when not visible', () => {
    const { queryByText } = render(
      <TaskModal visible={false} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(queryByText('New Task')).toBeNull();
  });

  it('renders the modal when visible', () => {
    const { getByText } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(getByText('New Task')).toBeTruthy();
  });

  it('shows "Edit Task" when initialTask is provided', () => {
    const task = { id: '1', title: 'Test', completed: false, description: 'Desc', dueDate: '2025-06-01T12:00:00Z', color: '#FF2D55', createdAt: '', updatedAt: '' };
    const { getByText } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} initialTask={task} />
    );
    expect(getByText('Edit the Task')).toBeTruthy();
  });

  it('calls onSave with task data when save is pressed', async () => {
    const { getByTestId } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.changeText(getByTestId('title-input'), 'My Task');
    fireEvent.changeText(getByTestId('description-input'), 'Some description');
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'My Task', description: 'Some description' })
      );
    });
  });

  it('does not call onSave when title is empty', () => {
    const { getByTestId } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.press(getByTestId('save-button'));
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('shows date picker when due date button is pressed', () => {
    const { getByTestId, queryByTestId } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    expect(queryByTestId('date-time-picker')).toBeNull();
    fireEvent.press(getByTestId('due-date-button'));
    expect(getByTestId('date-time-picker')).toBeTruthy();
  });

  it('allows selecting a color', async () => {
    const { getByTestId } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.press(getByTestId('color-#FF2D55'));
    fireEvent.changeText(getByTestId('title-input'), 'Colored Task');
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ color: '#FF2D55' })
      );
    });
  });
});
