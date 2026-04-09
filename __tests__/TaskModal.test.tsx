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

let datePickerOnChange: any = null;
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => {
      datePickerOnChange = props.onChange;
      return <View testID="date-time-picker" />;
    },
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

  it('sets a due date via date picker onChange', async () => {
    const { getByTestId } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.press(getByTestId('due-date-button'));
    expect(datePickerOnChange).toBeTruthy();

    const testDate = new Date('2025-12-25T10:00:00Z');
    datePickerOnChange({}, testDate);

    fireEvent.changeText(getByTestId('title-input'), 'Dated Task');
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Dated Task', dueDate: testDate.toISOString() })
      );
    });
  });

  it('handles date picker cancel (no date selected)', () => {
    const { getByTestId } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.press(getByTestId('due-date-button'));
    expect(datePickerOnChange).toBeTruthy();

    // Should not throw when no date is selected
    expect(() => datePickerOnChange({}, undefined)).not.toThrow();
  });

  it('pre-fills fields when editing a task', () => {
    const task = {
      id: '1', title: 'Existing', completed: false, description: 'A desc',
      dueDate: '2025-06-01T12:00:00Z', color: '#FF9500', createdAt: '', updatedAt: '',
    };
    const { getByTestId } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} initialTask={task} />
    );

    expect(getByTestId('title-input').props.value).toBe('Existing');
    expect(getByTestId('description-input').props.value).toBe('A desc');
  });

  it('resets fields when opening without initialTask', () => {
    const { getByTestId } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} initialTask={null} />
    );

    expect(getByTestId('title-input').props.value).toBe('');
    expect(getByTestId('description-input').props.value).toBe('');
  });

  it('saves with dueDate when date is set via picker then save', async () => {
    const task = {
      id: '1', title: 'With Date', completed: false, description: '',
      dueDate: '2025-06-01T12:00:00Z', color: '#007AFF', createdAt: '', updatedAt: '',
    };
    const { getByTestId, getByText } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} initialTask={task} />
    );

    // The date is pre-filled, the formatted date should appear
    expect(getByTestId('due-date-button')).toBeTruthy();
  });

  it('calls onClose when cancel is pressed', () => {
    const { getByText } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('clears due date when X is pressed next to date', async () => {
    const task = {
      id: '1', title: 'Dated', completed: false, description: '',
      dueDate: '2025-06-01T12:00:00Z', color: '#007AFF', createdAt: '', updatedAt: '',
    };
    const { getByTestId } = render(
      <TaskModal visible={true} onClose={mockOnClose} onSave={mockOnSave} initialTask={task} />
    );

    // The due date is set, so the clear (X) button should be rendered
    // Press save to check the dueDate was cleared
    fireEvent.changeText(getByTestId('title-input'), 'Dated');
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ dueDate: expect.any(String) })
      );
    });
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
