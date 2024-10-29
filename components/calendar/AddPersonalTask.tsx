import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm, Controller, useFormContext } from "react-hook-form";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import IconWrapper from "@components/IconWrapper";
import CustomDatePicker from "./CustomDatePicker";
import { userContext } from "@UserContext";
import useAxios from "@hooks/useAxios";

interface Project {
  _id: string;
  name: string;
}

interface TaskData {
  title: string;
  description: string;
  type: "personal";
  startDate: string | null;
  deadline: string | null;
  projectId: string | null;
  assignedTo: string[];
  status: string;
}

interface TaskFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  setTaskAdded: (val: (val: boolean) => void) => void;
}

const TASK_STATUSES = [
  { id: 'review', label: 'Review' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'pending', label: 'Pending' },
  { id: 'cancelled', label: 'Cancelled' }
];

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isVisible,
  onClose,
  setTaskAdded,
}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState<
    "startDate" | "deadline"
  >("startDate");
  const [projectSelectorVisible, setProjectSelectorVisible] = useState(false);
  const [statusSelectorVisible, setStatusSelectorVisible] = useState(false);
  const { post } = useAxios();
  const { get } = useAxios();
  const [projects, setProjects] = useState<Project[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TaskData>({
    defaultValues: {
      title: "",
      description: "",
      type: "personal",
      startDate: null,
      deadline: null,
      projectId: null,
      assignedTo: ['671fc07d94590411c0c34263'],
      status: "pending", // Set a default status
    },
  });

  const startDate = watch("startDate");
  const deadline = watch("deadline");
  const selectedProjectId = watch("projectId");
  const selectedStatus = watch("status");

  const selectedProject = projects.find((p) => p._id === selectedProjectId);
  const selectedStatusLabel = TASK_STATUSES.find(s => s.id === selectedStatus)?.label;

  const handleDateSelect = (
    date: string,
    fieldType: "startDate" | "deadline"
  ) => {
    setValue(fieldType, date);
    setDatePickerVisible(false);
  };

  const openDatePicker = (type: "startDate" | "deadline") => {
    setDatePickerType(type);
    setDatePickerVisible(true);
  };

  const handleProjectSelect = (projectId: string) => {
    setValue("projectId", projectId);
    setProjectSelectorVisible(false);
  };

  const handleStatusSelect = (statusId: string) => {
    setValue("status", statusId);
    setStatusSelectorVisible(false);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Select date";
    return new Date(dateString).toLocaleDateString();
  };

  const onSubmitForm = handleSubmit(async (data: TaskData) => {
    await post({ endPoint: "tasks/", body: data, hasToken: true })
      .then((res) => {
        if (res) {
          onClose();
          reset({
            title: "",
            description: "",
            type: "personal",
            startDate: null,
            deadline: null,
            projectId: null,
            assignedTo: [],
            status: "pending",
          });
          setTaskAdded((prev) => !prev);
        }
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
      });
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await get({ endPoint: "projects" });
        if (res) {
          setProjects(res);
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
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
            Icon={<Ionicons name="close" size={24} color="#000" />}
          />
        </View>

        {/* Task Title */}
        <Text style={styles.label}>Task title</Text>
        <Controller
          control={control}
          rules={{ required: "Title is required" }}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Task Title"
            />
          )}
        />
        {errors.title && (
          <Text style={styles.errorText}>{errors.title.message}</Text>
        )}

        {/* Project Selector */}
        <Text style={styles.label}>Project</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setProjectSelectorVisible(true)}
        >
          <Text>{selectedProject?.name || "Select Project"}</Text>
          <Ionicons name="chevron-down" size={20} color="#515151" />
        </TouchableOpacity>

        {/* Status Selector */}
        <Text style={styles.label}>Status</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setStatusSelectorVisible(true)}
        >
          <Text>{selectedStatusLabel || "Select Status"}</Text>
          <Ionicons name="chevron-down" size={20} color="#515151" />
        </TouchableOpacity>

        {/* Project Selection Modal */}
        <Modal
          isVisible={projectSelectorVisible}
          onBackdropPress={() => setProjectSelectorVisible(false)}
          style={styles.selectorModal}
        >
          <View style={styles.selectorContent}>
            <Text style={styles.selectorTitle}>Select Project</Text>
            {projects.map((project) => (
              <TouchableOpacity
                key={project._id}
                style={[
                  styles.selectorOption,
                  selectedProjectId === project._id &&
                    styles.selectedOption,
                ]}
                onPress={() => handleProjectSelect(project._id)}
              >
                <Text
                  style={[
                    styles.selectorOptionText,
                    selectedProjectId === project._id &&
                      styles.selectedOptionText,
                  ]}
                >
                  {project.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        {/* Status Selection Modal */}
        <Modal
          isVisible={statusSelectorVisible}
          onBackdropPress={() => setStatusSelectorVisible(false)}
          style={styles.selectorModal}
        >
          <View style={styles.selectorContent}>
            <Text style={styles.selectorTitle}>Select Status</Text>
            {TASK_STATUSES.map((status) => (
              <TouchableOpacity
                key={status.id}
                style={[
                  styles.selectorOption,
                  selectedStatus === status.id &&
                    styles.selectedOption,
                ]}
                onPress={() => handleStatusSelect(status.id)}
              >
                <Text
                  style={[
                    styles.selectorOptionText,
                    selectedStatus === status.id &&
                      styles.selectedOptionText,
                  ]}
                >
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

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
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => openDatePicker("startDate")}
            >
              <Text>{formatDate(startDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateField}>
            <Text style={styles.label}>Deadline</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => openDatePicker("deadline")}
            >
              <Text>{formatDate(deadline)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmitForm)}
        >
          <Text style={styles.submitButtonText}>Add task</Text>
        </TouchableOpacity>

        <CustomDatePicker
          isVisible={datePickerVisible}
          onClose={() => setDatePickerVisible(false)}
          onDateSelect={handleDateSelect}
          dateType={datePickerType}
          selectedStartDate={startDate}
          selectedDeadline={deadline}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#DEE2E6",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#515151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateField: {
    flex: 1,
    marginRight: 10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  selectorModal: {
    justifyContent: "center",
    margin: 20,
  },
  selectorContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  selectorOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#f0f0f0",
  },
  selectorOptionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: "#002B5B",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#002B5B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default TaskFormModal;