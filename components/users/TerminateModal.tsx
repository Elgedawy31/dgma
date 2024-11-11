import { useThemeColor } from '@hooks/useThemeColor';
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface TerminateModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const TerminateModal: React.FC<TerminateModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
}) => {
  const colors = useThemeColor()
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles(colors).modalOverlay}>
        <View style={styles(colors).modalContainer}>
          <View style={styles(colors).modalHeader}>
            <Text style={styles(colors).modalTitle}>{title}</Text>
          </View>

          <View style={styles(colors).modalFooter}>
            <TouchableOpacity
              style={[styles(colors).button, styles(colors).cancelButton]}
              onPress={onClose}
            >
              <Text style={styles(colors).cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles(colors).button, styles(colors).deleteButton]}
              onPress={onConfirm}
            >
              <Text style={styles(colors).deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles =(colors:any) =>  StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    
  },
  modalHeader: {
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign:'center'

  },
  modalBody: {
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.body,
    lineHeight: 22,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap:24
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  deleteButton: {
    backgroundColor: '#F22A2A',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TerminateModal;
