import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, Platform } from 'react-native';
import { Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task } from '@/lib/api';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: { title: string; description: string; dueDate: string | null }) => Promise<void>;
  initialTask?: Task | null;
}

export const TaskModal = ({ visible, onClose, onSave, initialTask }: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description)
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
    } else {
      setTitle('');
      setDescription('')
      setDueDate(null);
    }
  }, [initialTask, visible]);

  const handleSave = async () => {
    if (!title.trim()) return;
    await onSave({
      title,
      description,
      dueDate: dueDate ? dueDate.toISOString() : null,
    });
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => { }}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{initialTask ? 'Modifier la tâche' : 'Nouvelle tâche'}</Text>

          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            placeholder="Que faut-il faire ?"
            placeholderTextColor="#C7C7CC"
            value={title}
            onChangeText={setTitle}
            testID="title-input"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Pouvez-vous détailler ?"
            placeholderTextColor="#C7C7CC"
            value={description}
            onChangeText={setDescription}
            testID="description-input"
          />

          <Text style={styles.label}>Date limite</Text>
          <Pressable
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
            testID="due-date-button">
            <Calendar size={16} color="#8E8E93" />
            <Text style={[styles.datePickerText, !dueDate && styles.datePickerPlaceholder]}>
              {dueDate ? formatDate(dueDate) : 'Choisir une date...'}
            </Text>
            {dueDate && (
              <Pressable onPress={() => setDueDate(null)}>
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
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!title.trim()}
              testID="save-button">
              <Text style={styles.saveButtonText}>{initialTask ? 'Enregistrer' : 'Ajouter'}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingTop: 12,
    minHeight: '50%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  datePickerText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
  },
  datePickerPlaceholder: {
    color: '#C7C7CC',
  },
  clearDateText: {
    fontSize: 18,
    color: '#8E8E93',
    paddingHorizontal: 8,
  },
  dateConfirmButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  dateConfirmText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 'auto',
    paddingTop: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#B0D4FF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
