import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, Platform } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import { Plus, Trash2, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TasksScreen() {
  const { tasks, isLoading, error, fetchTasks, createTask, deleteTask, updateTask } = useTaskStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    await createTask({
      title: newTitle,
      description: newDescription,
      completed: false,
      dueDate: newDueDate ? newDueDate.toISOString() : undefined,
    });
    setNewTitle('');
    setNewDescription('');
    setNewDueDate(null);
    setModalVisible(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Pressable
              onPress={() => updateTask(item.id, { completed: !item.completed })}
              style={styles.taskContent}>
              <Text style={[
                styles.taskTitle,
                item.completed && styles.completedTask
              ]}>
                {item.title}
              </Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              {item.dueDate && (
                <View style={styles.dueDateRow}>
                  <Calendar size={12} color="#8E8E93" />
                  <Text style={styles.dueDateText}>{formatDate(item.dueDate)}</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={() => deleteTask(item.id)}
              testID={`delete-button-${item.id}`}
              style={styles.deleteButton}>
              <Trash2 size={20} color="#FF3B30" />
            </Pressable>
          </View>
        )}
      />
      <Pressable style={styles.fab} testID='add-button' onPress={() => setModalVisible(true)}>
        <Plus size={24} color="#FFFFFF" />
      </Pressable>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Task</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What needs to be done?"
              placeholderTextColor="#C7C7CC"
              value={newTitle}
              onChangeText={setNewTitle}
              testID="title-input"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Add some details..."
              placeholderTextColor="#C7C7CC"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              testID="description-input"
            />

            <Text style={styles.label}>Date limite</Text>
            <Pressable
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
              testID="due-date-button">
              <Calendar size={16} color="#8E8E93" />
              <Text style={[styles.datePickerText, !newDueDate && styles.datePickerPlaceholder]}>
                {newDueDate ? formatDate(newDueDate.toISOString()) : 'Choisir une date...'}
              </Text>
              {newDueDate && (
                <Pressable onPress={() => setNewDueDate(null)}>
                  <Text style={styles.clearDateText}>✕</Text>
                </Pressable>
              )}
            </Pressable>

            {showDatePicker && Platform.OS === 'ios' && (
              <Pressable style={styles.dateConfirmButton} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.dateConfirmText}>Confirmer</Text>
              </Pressable>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={newDueDate ?? new Date()}
                mode={Platform.OS === 'ios' ? 'datetime' : datePickerMode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={(_, selectedDate) => {
                  if (!selectedDate) {
                    setShowDatePicker(false);
                    return;
                  }
                  if (Platform.OS === 'android') {
                    if (datePickerMode === 'date') {
                      setNewDueDate(selectedDate);
                      setDatePickerMode('time');
                    } else {
                      setNewDueDate(selectedDate);
                      setDatePickerMode('date');
                      setShowDatePicker(false);
                    }
                  } else {
                    setNewDueDate(selectedDate);
                  }
                }}
              />
            )}

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, !newTitle.trim() && styles.saveButtonDisabled]}
                onPress={handleAddTask}
                disabled={!newTitle.trim()}
                testID="save-button">
                <Text style={styles.saveButtonText}>Add Task</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#000000',
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  datePickerText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  datePickerPlaceholder: {
    color: '#C7C7CC',
  },
  clearDateText: {
    fontSize: 16,
    color: '#8E8E93',
    paddingHorizontal: 4,
  },
  dateConfirmButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  dateConfirmText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#B0D4FF',
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
});