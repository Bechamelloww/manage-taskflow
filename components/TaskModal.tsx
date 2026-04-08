import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, Platform } from 'react-native';
import { Calendar, Check, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import { TASK_COLORS, DEFAULT_COLOR, theme } from '@/lib/colors';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: { title: string; description: string; dueDate: string | null; color: string }) => Promise<void>;
  initialTask?: Task | null;
}

export const TaskModal = ({ visible, onClose, onSave, initialTask }: TaskModalProps) => {
  const { t, changeLanguage, locale } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description ?? '');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
      setColor(initialTask.color || DEFAULT_COLOR);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(null);
      setColor(DEFAULT_COLOR);
    }
  }, [initialTask, visible]);

  const handleSave = async () => {
    if (!title.trim()) return;
    await onSave({
      title,
      description,
      dueDate: dueDate ? dueDate.toISOString() : null,
      color,
    });
    onClose();
  };

  const formatDate = (date: Date) =>
    date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => { }}>
          <View style={styles.modalHandle} />

          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>
              {initialTask ? t('modal.editTask') : t('modal.newTask')}
            </Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <X size={20} color={theme.textSoft} />
            </Pressable>
          </View>

          <Text style={styles.label}>{t('modal.title')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('modal.title_p')}
            placeholderTextColor="#C7C7CC"
            value={title}
            onChangeText={setTitle}
            testID="title-input"
          />

          <Text style={styles.label}>{t('modal.desc')}</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder={t('modal.description_p')}
            placeholderTextColor="#C7C7CC"
            value={description}
            onChangeText={setDescription}
            multiline
            testID="description-input"
          />

          <Text style={styles.label}>{t('modal.color')}</Text>
          <View style={styles.colorRow}>
            {TASK_COLORS.map(c => {
              const selected = c.hex === color;
              return (
                <Pressable
                  key={c.hex}
                  onPress={() => setColor(c.hex)}
                  testID={`color-${c.hex}`}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c.hex },
                    selected && styles.colorSwatchSelected,
                  ]}>
                  {selected && <Check size={16} color="#FFF" strokeWidth={3} />}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>{t('modal.due')}</Text>
          <Pressable
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
            testID="due-date-button">
            <Calendar size={16} color={color} />
            <Text style={[styles.datePickerText, !dueDate && styles.datePickerPlaceholder]}>
              {dueDate ? formatDate(dueDate) : t('modal.date_p')}
            </Text>
            {dueDate && (
              <Pressable onPress={() => setDueDate(null)} hitSlop={8}>
                <X size={16} color={theme.textMuted} />
              </Pressable>
            )}
          </Pressable>

          {showDatePicker && Platform.OS === 'ios' && (
            <Pressable style={styles.dateConfirmButton} onPress={() => setShowDatePicker(false)}>
              <Text style={[styles.dateConfirmText, { color }]}>Confirmer</Text>
            </Pressable>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={dueDate ?? new Date()}
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
                    setDueDate(selectedDate);
                    setDatePickerMode('time');
                  } else {
                    setDueDate(selectedDate);
                    setDatePickerMode('date');
                    setShowDatePicker(false);
                  }
                } else {
                  setDueDate(selectedDate);
                }
              }}
            />
          )}

          <View style={styles.modalActions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t('modal.cancel')}</Text>
            </Pressable>
            <Pressable
              style={[
                styles.saveButton,
                { backgroundColor: color },
                !title.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!title.trim()}
              testID="save-button">
              <Text style={styles.saveButtonText}>
                {initialTask ? t('modal.save') : t('modal.add')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 44,
    height: 5,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: -0.4,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: theme.bg,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textMuted,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: theme.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.text,
    marginBottom: 18,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#FFF',
    transform: [{ scale: 1.12 }],
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.bg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    gap: 10,
  },
  datePickerText: {
    flex: 1,
    fontSize: 15,
    color: theme.text,
  },
  datePickerPlaceholder: {
    color: '#C7C7CC',
  },
  dateConfirmButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  dateConfirmText: {
    fontWeight: '700',
    fontSize: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textMuted,
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
