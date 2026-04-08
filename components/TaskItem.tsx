import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Trash2, Calendar, Edit2, CheckSquare } from 'lucide-react-native';
import { Task } from '@/lib/api';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  multi: boolean;
  isSelected: boolean;
}

export const TaskItem = ({ task, onToggleComplete, onDelete, onEdit, multi, isSelected }: TaskItemProps) => {
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

  return (
    <View style={styles.taskItem}>
      <Pressable
        onPress={() => onToggleComplete(task.id, !task.completed)}
        style={styles.taskContent}>
        <Text style={[
          styles.taskTitle,
          task.completed && styles.completedTask
        ]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={[
            styles.description,
            task.completed && styles.completedDesc
          ]}>
            {task.description}
          </Text>
        )}
        {task.dueDate && (
          <View style={styles.dueDateRow}>
            <Calendar size={12} color="#8E8E93" />
            <Text style={styles.dueDateText}>{formatDate(task.dueDate)}</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.actions}>
        {multi && (
          <CheckSquare size={20} color={isSelected ? '#007AFF' : '#CCC'} />
        )}
        {!multi && (<Pressable
          onPress={() => onEdit(task)}
          testID={`edit-button-${task.id}`}
          style={styles.actionButton}>
          <Edit2 size={20} color="#007AFF" />
        </Pressable>)}
        {!multi && (<Pressable
          onPress={() => onDelete(task.id)}
          testID={`delete-button-${task.id}`}
          style={styles.actionButton}>
          <Trash2 size={20} color="#FF3B30" />
        </Pressable>)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  completedDesc: {
    opacity: 0
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
    fontSize: 10,
    color: '#cabebe',
  },
  dueDateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
});
