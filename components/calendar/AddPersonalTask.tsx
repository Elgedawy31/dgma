import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import IconWrapper from '@components/IconWrapper';
import { Ionicons } from '@expo/vector-icons';

interface TaskFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
}

interface TaskFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isVisible, onClose, onSubmit }) => {
  // States for date/time picker visibility
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
    }
  });

  const onSubmitForm = (data: TaskFormData): void => {
    onSubmit(data);
    onClose();
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      propagateSwipe
      avoidKeyboard
    >
      <View style={styles.modalView}>
        <View style={styles.handleBar} />
        
        <View style={styles.header}>
          <Text style={styles.title}>New personal task</Text>
       <IconWrapper 
          onPress={onClose}
          size={36}
          Icon={<Ionicons name="close" size={24} color="#000" />} />
        </View>

        {/* Task Title */}
        <Text style={styles.label}>Task title</Text>
        <Controller
          control={control}
          rules={{ required: 'Title is required' }}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Project Name"
            />
          )}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              onChangeText={onChange}
              value={value}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />
          )}
        />

        {/* Date Selection */}
        <View style={styles.dateContainer}>
          <View style={styles.dateField}>
            <Text style={styles.label}>Start Date</Text>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowStartDate(true)}
                  >
                    <Text>{formatDate(value)}</Text>
                  </TouchableOpacity>
                  {showStartDate && (
                    <DateTimePicker
                
                      value={value}
                      mode="date"
                      display='spinner'
                      onChange={(event, selectedDate) => {
                        setShowStartDate(false);
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.dateField}>
            <Text style={styles.label}>End Date</Text>
            <Controller
              control={control}
              name="endDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowEndDate(true)}
                  >
                    <Text>{formatDate(value)}</Text>
                  </TouchableOpacity>
                  {showEndDate && (
                    <DateTimePicker
                
                      value={value}
                      mode="date"
                      display='spinner'
                      onChange={(event, selectedDate) => {
                        setShowEndDate(false);
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.dateContainer}>
          <View style={styles.dateField}>
            <Text style={styles.label}>Start Time</Text>
            <Controller
              control={control}
              name="startTime"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowStartTime(true)}
                  >
                    <Text>{formatTime(value)}</Text>
                  </TouchableOpacity>
                  {showStartTime && (
                    <DateTimePicker
                
                      value={value}
                      mode="time"
                      display='spinner'
                      onChange={(event, selectedDate) => {
                        setShowStartTime(false);
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.dateField}>
            <Text style={styles.label}>End Time</Text>
            <Controller
              control={control}
              name="endTime"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowEndTime(true)}
                  >
                    <Text>{formatTime(value)}</Text>
                  </TouchableOpacity>
                  {showEndTime && (
                    <DateTimePicker
                
                      value={value}
                      mode="time"
                      display='spinner'
                      onChange={(event, selectedDate) => {
                        setShowEndTime(false);
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmitForm)}
        >
          <Text style={styles.submitButtonText}>Add task</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#DEE2E6',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateField: {
    flex: 1,
    marginRight: 10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#002B5B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default TaskFormModal;