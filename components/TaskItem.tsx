import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Trash2, Calendar, Pencil, Check } from 'lucide-react-native';
import { Task } from '@/lib/api';
import { getTint, theme, DEFAULT_COLOR } from '@/lib/colors';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  multi: boolean;
  isSelected: boolean;
  onDrag?: () => void;
  isActive?: boolean;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const TaskItem = ({ task, onToggleComplete, onDelete, onEdit, multi, isSelected, onDrag, isActive }: TaskItemProps) => {
  const color = task.color || DEFAULT_COLOR;
  const tint = getTint(color);
  const isOverdue = !!task.dueDate && !task.completed && new Date(task.dueDate).getTime() < Date.now();

  return (
    <Pressable
      onPress={() => onToggleComplete(task.id, !task.completed)}
      onLongPress={multi ? undefined : onDrag}
      delayLongPress={200}
      style={({ pressed }) => [
        styles.taskItem,
        { backgroundColor: tint },
        task.completed && styles.taskItemCompleted,
        (pressed || isActive) && styles.taskItemPressed,
        isActive && { elevation: 8, zIndex: 99, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65 },
      ]}>
      <View style={[styles.cornerAccent, { backgroundColor: color }]} />

      <View
        style={[
          styles.checkbox,
          { borderColor: color },
          task.completed && { backgroundColor: color, borderColor: color },
        ]}>
        {task.completed && <Check size={16} color="#FFF" strokeWidth={3} />}
      </View>

      <View style={styles.taskContent}>
        <Text
          numberOfLines={2}
          style={[styles.taskTitle, task.completed && styles.completedTask]}>
          {task.title}
        </Text>
        {!!task.description && !task.completed && (
          <Text numberOfLines={2} style={styles.description}>
            {task.description}
          </Text>
        )}
        {!!task.dueDate && (
          <View
            style={[
              styles.dueDateRow,
              { backgroundColor: isOverdue ? '#FFE5E5' : 'rgba(255,255,255,0.75)' },
            ]}>
            <Calendar size={12} color={isOverdue ? theme.danger : color} />
            <Text
              style={[
                styles.dueDateText,
                { color: isOverdue ? theme.danger : color },
              ]}>
              {formatDate(task.dueDate)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {multi ? (
          <View
            style={[
              styles.selectCircle,
              isSelected && { backgroundColor: color, borderColor: color },
            ]}>
            {isSelected && <Check size={14} color="#FFF" strokeWidth={3} />}
          </View>
        ) : (
          <>
            <Pressable
              onPress={() => onEdit(task)}
              testID={`edit-button-${task.id}`}
              hitSlop={6}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Pencil size={18} color={theme.textSoft} />
            </Pressable>
            <Pressable
              onPress={() => onDelete(task.id)}
              testID={`delete-button-${task.id}`}
              hitSlop={6}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Trash2 size={18} color={theme.danger} />
            </Pressable>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingRight: 12,
    paddingLeft: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  taskItemCompleted: {
    opacity: 0.6,
  },
  taskItemPressed: {
    transform: [{ scale: 0.985 }],
    shadowOpacity: 0.1,
  },
  cornerAccent: {
    position: 'absolute',
    top: -28,
    right: -28,
    width: 64,
    height: 64,
    borderRadius: 32,
    opacity: 0.22,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    letterSpacing: -0.2,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: theme.textMuted,
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    color: theme.textSoft,
    lineHeight: 18,
  },
  dueDateRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  pressed: {
    backgroundColor: theme.bg,
  },
  selectCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#D1D1D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
});
