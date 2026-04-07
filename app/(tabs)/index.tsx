import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import { CheckSquare, Plus, Trash2, Trash } from 'lucide-react-native';

export default function TasksScreen() {
  const { tasks, isLoading, error, fetchTasks, deleteTask, updateTask } = useTaskStore();
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleSelectTask = (id: string) => {
    setSelectedTasks(prev =>
      prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]
    );
  };

  const deleteSelectedTasks = async () => {
    for (const id of selectedTasks) {
      await deleteTask(id);
    }
    setSelectedTasks([]);
    setMultiSelectMode(false);
  };

  if (isLoading) {
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
        renderItem={({ item }) => {
          const isSelected = selectedTasks.includes(item.id);
          return (
            <View style={styles.taskItem}>
              <Pressable
                onPress={() => {
                  if (multiSelectMode) {
                    toggleSelectTask(item.id)
                  } else {
                    updateTask(item.id, { completed: !item.completed })
                  }
                }}
                style={styles.taskContent}>
                <Text style={[
                  styles.taskTitle,
                  item.completed && styles.completedTask
                ]}>
                  {item.title}
                </Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
              </Pressable>
              {multiSelectMode && (
                <Pressable onPress={() => toggleSelectTask(item.id)} style={styles.selectButton}>
                  <CheckSquare size={20} color={isSelected ? '#007AFF' : '#CCC'} />
                </Pressable>
              )}
              {!multiSelectMode && (
                <Pressable onPress={() => deleteTask(item.id)}
                  testID={`delete-button-${item.id}`}
                  style={styles.deleteButton}>
                  <Trash2 size={20} color="#FF3B30" />
                </Pressable>
              )}
            </View>
          )
        }
        }
      />
      <Pressable style={styles.fab} testID='add-button'>
        <Plus size={24} color="#FFFFFF" />
      </Pressable>
      <Pressable
        style={[styles.fabSelect, multiSelectMode && styles.fabSelectActive]}
        onPress={() => {
          if (multiSelectMode) setSelectedTasks([]); // réinitialiser si on désactive
          setMultiSelectMode(!multiSelectMode);
        }}
      >
        <Text style={styles.fabSelectText}>
          {multiSelectMode ? '✕' : '✓'}
        </Text>
      </Pressable>
      {multiSelectMode && selectedTasks.length > 0 && (
        <Pressable style={styles.deleteAllButton} onPress={deleteSelectedTasks}>
          <Text style={styles.deleteAllText}>{selectedTasks.length}</Text>
          <Trash size={20} color="#FFF" />
        </Pressable>
      )}
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
  selectButton: { padding: 8, marginRight: 8 },
  fabSelect: {
    position: 'absolute',
    bottom: 24,
    right: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabSelectActive: { backgroundColor: '#FF3B30' },
  fabSelectText: { color: '#FFF', fontSize: 24, fontWeight: '600' },
  deleteAllButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
  },
  deleteAllText: { color: '#FFF', fontWeight: '600' },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
});