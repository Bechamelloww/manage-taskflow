import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import { Plus } from 'lucide-react-native';
import { TaskItem } from '@/components/TaskItem';
import { TaskModal } from '@/components/TaskModal';
import { Task } from '@/lib/api';

export default function TasksScreen() {
  const { tasks, isLoading, error, fetchTasks, createTask, deleteTask, updateTask } = useTaskStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSaveTask = async (taskData: { title: string; dueDate: string | null }) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await createTask({
        ...taskData,
        completed: false,
      });
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>Chargement des tâches...</Text>
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
          <TaskItem
            task={item}
            onToggleComplete={(id, completed) => updateTask(id, { completed })}
            onDelete={deleteTask}
            onEdit={openEditModal}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune tâche pour le moment</Text>
        }
      />
      <Pressable style={styles.fab} testID='add-button' onPress={openCreateModal}>
        <Plus size={24} color="#FFFFFF" />
      </Pressable>

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#8E8E93',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
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
    elevation: 6,
  },
});