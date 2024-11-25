import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThemeColor } from "@hooks/useThemeColor";
import CalendarHeader from "@components/calendar/CalendarHeader";
import TaskDetailsCard from "./components/TaskDetailsCard";
import ResourcesList from "./components/TaskResources";
import { TaskColors2 } from "@colors";
import useAxios from "@hooks/useAxios";
import dayjs from "dayjs";
import TerminateModal from "@components/users/TerminateModal";
import Modal from "react-native-modal";
import { Toast } from "@components/ui/Toast";
import TaskModel from "@model/task";
import FileModel from "@model/file";
import { userContext } from "@UserContext";






const Task = () => {
  const color = useThemeColor();
  const { user: { role: userRole } } = useContext(userContext);
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<TaskModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [statusSelectorVisible, setStatusSelectorVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { getRequest, deleteRequest, patchRequest } = useAxios();
  const router = useRouter();

  const sampleHandlers = {
    handleDownload: (resource: FileModel) => {
      console.log(`Downloading ${resource.name}`);
      // Add your download logic here
    },
    handleSeeAll: () => {
      console.log("Viewing all resources");
      // Add your navigation logic here
    },

    handleTaskPress: (task: any) => {
      console.log(`Selected task: ${task.title}`);
      // Add your task selection logic here
    },
  };

  const handleDeleteTask = async () => {
    setIsDeleting(true);
    try {
      await deleteRequest({ endPoint: `tasks/${id}` });
      // Navigate back to calendar with the removed task id
      router.push({
        pathname: "/(tabs)/calendar",
        params: { chat: JSON.stringify({ removedId: id }) }
      });
    } catch (err) {
      console.error(`Error deleting task: ${err}`);
      setShowTerminateModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus || selectedStatus === task?.status) return;
    setIsSubmitting(true);
    try {
      await patchRequest({ endPoint: `tasks/${id}`, body: { status: selectedStatus } })
        .then((res) => console.log(res))
        .catch((err) => console.error(`Error: ${err}`));
      setShowToast(true);
      // Update local task state

      setTask((prev) => ({ ...prev, status: selectedStatus } as TaskModel));
    } catch (err) {
      console.error(`Error updating task: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(userRole)
    const handleSubmit = async () => {
      await getRequest({ endPoint: `tasks/${id}` })
        .then((res) => {
          if (res) {
            setTask(res);
            setSelectedStatus(res.status);
          }
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
        });
    };
    handleSubmit();
  }, [id]);

  if (!task) return null;

  const getStatusColor = (status: string) => {
    const statusKey = status.toLowerCase();
    return TaskColors2[statusKey as keyof typeof TaskColors2] || TaskColors2.Pending;
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ gap: 24 }}>
          <CalendarHeader
            fromCalenderTab={false}
            title="Task details"
          />

          <TaskDetailsCard
            title={task.title}
            description={task.description}
            startDate={dayjs(task.startData).format('DD MMM')}
            endDate={dayjs(task.deadline).format('DD MMM')}
            onDelete={() => setShowTerminateModal(true)}
          />

          <TouchableOpacity
            style={[styles.statusSelector, {backgroundColor:color.card}]}
            onPress={() => setStatusSelectorVisible(true)}
          >
            <Text style={[styles.statusLabel , {color:color.text}]}>Status</Text>
            <View style={[styles.statusBadge]}>
              <Text style={[styles.statusText , {color:TaskColors2[selectedStatus]}]}>{selectedStatus || "Select Status"}</Text>
            </View>
          </TouchableOpacity>

          <ResourcesList
            resources={task.attachments}
            onSeeAll={sampleHandlers.handleSeeAll}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}> 
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: color.primary },
            { opacity: isSubmitting ? 0.7 : 1 }
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !selectedStatus || selectedStatus === task.status}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={statusSelectorVisible}
        onBackdropPress={() => setStatusSelectorVisible(false)}
        style={styles.modal}
      >
        <View style={[styles.modalContent, { backgroundColor: color.card }]}>
          <Text style={[styles.modalTitle, { color: color.text }]}>Select Status</Text>
          {["Pending", "In Progress", "In Review"].concat(userRole === 'admin' ? ["Completed"] : []).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                selectedStatus === status && styles.selectedOption
              ]}
              onPress={() => {
                setSelectedStatus(status);
                setStatusSelectorVisible(false);
              }}
            >
              <Text style={[
                styles.statusOptionText,
                { color: color.text },
                selectedStatus === status && styles.selectedOptionText
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <TerminateModal
        visible={showTerminateModal}
        onClose={() => setShowTerminateModal(false)}
        onConfirm={handleDeleteTask}
        loading={isDeleting}
        title="Delete Task"
      />

      <Toast
        isVisible={showToast}
        message="Status updated successfully"
        onHide={() => setShowToast(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  statusOptionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor:'transparent',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Task;
