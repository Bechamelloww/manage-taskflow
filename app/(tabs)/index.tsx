import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '@/stores/taskStore';
import { Plus, Trash, ListChecks, X } from 'lucide-react-native';
import { TaskItem } from '@/components/TaskItem';
import { TaskModal } from '@/components/TaskModal';
import { Task } from '@/lib/api';
import { theme } from '@/lib/colors';
import { useTranslation } from '@/hooks/useTranslation';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TasksScreen() {
  const { t, changeLanguage, locale } = useTranslation();
  const { tasks, isLoading, error, fetchTasks, createTask, deleteTask, updateTask, reorderTasks } = useTaskStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  const handleSaveTask = useCallback(async (taskData: { title: string; description: string; dueDate: string | null; color?: string }) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await createTask({ ...taskData, completed: false });
    }
  }, [editingTask, updateTask, createTask]);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingTask(null);
    setModalVisible(true);
  }, []);

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

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<Task>) => {
    const isSelected = selectedTasks.includes(item.id);
    return (
      <TaskItem
        task={item}
        onToggleComplete={(id, completed) => {
          if (multiSelectMode) {
            toggleSelectTask(id);
          } else {
            updateTask(id, { completed });
          }
        }}
        onDelete={deleteTask}
        onEdit={openEditModal}
        multi={multiSelectMode}
        isSelected={isSelected}
        onDrag={drag}
        isActive={isActive}
      />
    );
  }, [multiSelectMode, selectedTasks, deleteTask, openEditModal, updateTask, toggleSelectTask]);

  if (isLoading && tasks.length === 0) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.centerText}>{t('index.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <DraggableFlatList
          data={tasks}
          keyExtractor={item => item.id}
          onDragEnd={({ data }) => reorderTasks(data)}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('index.noTask')}</Text>
          }
        />

      <Pressable testID="add-button" onPress={openCreateModal} style={styles.fab}>
        <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>

      <Pressable
        style={[styles.fabSelect, multiSelectMode && styles.fabSelectActive]}
        onPress={() => {
          if (multiSelectMode) setSelectedTasks([]);
          setMultiSelectMode(!multiSelectMode);
        }}>
        {multiSelectMode ? (
          <X size={22} color="#FFF" strokeWidth={2.5} />
        ) : (
          <ListChecks size={22} color="#FFF" strokeWidth={2.5} />
        )}
      </Pressable>

      {multiSelectMode && selectedTasks.length > 0 && (
        <Pressable style={styles.deleteAllButton} onPress={deleteSelectedTasks}>
          <Text style={styles.deleteAllText}>{selectedTasks.length}</Text>
          <Trash size={20} color="#FFF" />
        </Pressable>
      )}

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
    </SafeAreaView>
  </GestureHandlerRootView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 140,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  headerTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  headerCount: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.text,
    letterSpacing: -0.8,
  },
  headerCountMuted: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textMuted,
  },
  headerPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 3,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  centerText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.textMuted,
  },
  errorText: {
    color: theme.danger,
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: theme.textMuted,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabSelect: {
    position: 'absolute',
    bottom: 28,
    right: 96,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  fabSelectActive: {
    backgroundColor: theme.danger,
    shadowColor: theme.danger,
  },
  deleteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.danger,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 26,
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    shadowColor: theme.danger,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  deleteAllText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
