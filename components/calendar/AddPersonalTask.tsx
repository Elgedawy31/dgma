import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
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

interface User {
  id: string;
  name: {
    first: string;
    last: string;
  };
  role: string;
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
  { id: "review", label: "Review" },
  { id: "overdue", label: "Overdue" },
  { id: "progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
  { id: "cancelled", label: "Cancelled" },
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
  const [userSelectorVisible, setUserSelectorVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { post, get } = useAxios();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useContext(userContext);

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
      assignedTo: user?.role === "admin" ? [] : [user?.id],
      status: "pending",
    },
  });

  const startDate = watch("startDate");
  const deadline = watch("deadline");
  const selectedProjectId = watch("projectId");
  const selectedStatus = watch("status");

  const selectedProject = projects.find((p:any) => p.id === selectedProjectId);
  const selectedStatusLabel = TASK_STATUSES.find(
    (s) => s.id === selectedStatus
  )?.label;

  useEffect(() => {
    if (user?.role === "user") {
      setValue("assignedTo", [user?.id]);
    }
  }, [user]);

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

  const handleUserSelect = (userId: string) => {
    const currentAssigned = watch("assignedTo") || [];
    let newAssigned;

    if (currentAssigned.includes(userId)) {
      newAssigned = currentAssigned.filter((id) => id !== userId);
    } else {
      newAssigned = [...currentAssigned, userId];
    }

    setValue("assignedTo", newAssigned);
    setSelectedUsers(newAssigned);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Select date";
    return new Date(dateString).toLocaleDateString();
  };

  const onSubmitForm = handleSubmit(async (data: TaskData) => {
    const finalData = {
      ...data,
      assignedTo: user?.role === "admin" ? selectedUsers : [user?.id],
    };

    await post({ endPoint: "tasks/", body: finalData, hasToken: true })
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
            assignedTo: user?.role === "admin" ? [] : [user?.id],
            status: "pending",
          });
          setSelectedUsers([]);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await get({ endPoint: "users" });
        if (res) {
          setUsers(res);
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };
    fetchUsers();
  }, []);

  const renderAssignedToSection = () => {
    if (user?.role === "admin") {
      return (
        <>
          <Text style={styles.label}>Assign To</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setUserSelectorVisible(true)}
          >
            <Text>
              {selectedUsers.length > 0
                ? `${selectedUsers.length} users selected`
                : "Select Users"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#515151" />
          </TouchableOpacity>

         
        </>
      );
    }
    return null;
  };

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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <Text style={styles.title}>New personal task</Text>
            <IconWrapper
              onPress={onClose}
              size={36}
              Icon={<Ionicons name="close" size={24} color="#000" />}
            />
          </View>

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

          <Text style={styles.label}>Project</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setProjectSelectorVisible(true)}
          >
            <Text>{selectedProject?.name || "Select Project"}</Text>
            <Ionicons name="chevron-down" size={20} color="#515151" />
          </TouchableOpacity>

          {renderAssignedToSection()}

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
            onPress={() => handleSubmit(onSubmitForm)}
          >
            <Text style={styles.submitButtonText}>Add task</Text>
          </TouchableOpacity>
        </ScrollView>

        <CustomDatePicker
          isVisible={datePickerVisible}
          onClose={() => setDatePickerVisible(false)}
          onDateSelect={handleDateSelect}
          dateType={datePickerType}
          selectedStartDate={startDate}
          selectedDeadline={deadline}
        />

        <Modal
          isVisible={projectSelectorVisible}
          onBackdropPress={() => setProjectSelectorVisible(false)}
          style={styles.selectorModal}
        >
          <View style={styles.selectorContent}>
            <Text style={styles.selectorTitle}>Select Project</Text>
            {projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={[
                  styles.selectorOption,
                  selectedProjectId === project.id && styles.selectedOption,
                ]}
                onPress={() => handleProjectSelect(project.id)}
              >
                <Text
                  style={[
                    styles.selectorOptionText,
                    selectedProjectId === project.id &&
                      styles.selectedOptionText,
                  ]}
                >
                  {project.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        <Modal
          isVisible={userSelectorVisible}
          onBackdropPress={() => setUserSelectorVisible(false)}
          style={styles.selectorModal}
        >
          <View style={styles.selectorContent}>
            <Text style={styles.selectorTitle}>Select Users</Text>
            {users.map((user: User) => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.selectorOption,
                  selectedUsers.includes(user.id) && styles.selectedOption,
                ]}
                onPress={() => handleUserSelect(user.id)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.selectorOptionText,
                      selectedUsers.includes(user.id) &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {`${user.name.first} ${user.name.last}`}
                  </Text>
                  {selectedUsers.includes(user.id) && (
                    <Ionicons name="checkmark" size={24} color="#002B5B" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
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
