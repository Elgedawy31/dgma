import React, { useCallback, useContext, useEffect, useState } from "react";
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
import useFilePicker from "@hooks/useFile";
import { userContext } from "@UserContext";
import useAxios from "@hooks/useAxios";
import attachments from "@/app/chat/[id]/attachments";
import { useThemeColor } from "@hooks/useThemeColor";

interface Project {
  id: string;
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


interface UploadedFile {
  name: string;
  type: string;
  url: string;
}

// Update TaskData interface
interface TaskData {
  title: string;
  description: string;
  type: "personal";
  startDate: string | null;
  deadline: string | null;
  projectId: string | null;
  assignedTo: string[];
  status: string;
  attachments: UploadedFile[]; // Add this line
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

const FileItem = ({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) => {
  const colors = useThemeColor();
  return <View style={styles(colors).fileItem}>
    <View style={styles(colors).fileInfo}>
      <Ionicons 
        name={!file?.name.includes('pdf') ? "image" : "document"} 
        size={24} 
        color={colors.text} 
      />
      <Text style={styles(colors).fileName} numberOfLines={1}>
        {file.name}
      </Text>
    </View>
    <TouchableOpacity onPress={onRemove}>
      <Ionicons name="close-circle" size={20} color={colors.text} />
    </TouchableOpacity>
  </View>
};
const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isVisible,
  onClose,
  setTaskAdded,
}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const colors = useThemeColor();
  const [datePickerType, setDatePickerType] = useState<
    "startDate" | "deadline"
  >("startDate");
  const [projectSelectorVisible, setProjectSelectorVisible] = useState(false);
  const [statusSelectorVisible, setStatusSelectorVisible] = useState(false);
  const [userSelectorVisible, setUserSelectorVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
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
  const { documentPicker, uploadFiles } = useFilePicker();
  const [groupLogo, setGroupLogo] = useState<any>(null);
  const [groupUploadedImg, setGroupUploadedImg] = useState<any>(null);

  const selectedProject = projects?.length > 0? projects?.find((p:any) => p?.id === selectedProjectId) :{};
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
      attachments:data?.attachments.map(attachments => attachments.name)
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
        if (res?.project) {
          setProjects(res.project);
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
          <Text  style={[styles(colors).label, {color:colors.text}]}>Assign To</Text>
          <TouchableOpacity
            style={styles(colors).selectorButton}
            onPress={() => setUserSelectorVisible(true)}
          >
            <Text style={{color:colors.text}}>
              {selectedUsers.length > 0
                ? `${selectedUsers.length} users selected`
                : "Select Users"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          </TouchableOpacity>

         
        </>
      );
    }
    return null;
  };

  const handleFilePick = useCallback(async () => {
    try {
      const result = await documentPicker({ 
        multiple: true,
      });

      if (result) {
        const files = await uploadFiles(result);
        if (files?.length > 0) {
          const newFiles = files.map((file: any) => ({
            name: file.name,
            type: file.type,
            url: file.url
          }));
          setUploadedFiles(prev => [...prev, ...newFiles]);
          setValue('attachments', [...uploadedFiles, ...newFiles]);
        }
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  }, [uploadedFiles]);
  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setValue('attachments', newFiles);
  };
  const renderFileSection = () => (
    <View style={styles(colors).fileSection}>
      <View style={styles(colors).fileSectionHeader}>
        <Text style={styles(colors).label}>Attachments</Text>
        <TouchableOpacity
          style={styles(colors).addFileButton}
          onPress={handleFilePick}
        >
          <Ionicons name="attach" size={20} color={colors.primary} />
          <Text style={styles(colors).addFileText}>Add File</Text>
        </TouchableOpacity>
      </View>
      
      {uploadedFiles.length > 0 && (
        <View style={styles(colors).fileList}>
          {uploadedFiles.map((file, index) => (
            <FileItem
              key={index}
              file={file}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={styles(colors).modal}
      propagateSwipe
      avoidKeyboard
    >
      <View style={styles(colors).modalView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles(colors).handleBar} />
          <View style={styles(colors).header}>
            <Text style={styles(colors).title}>New personal task</Text>
            <IconWrapper
              onPress={onClose}
              size={36}
              Icon={<Ionicons name="close" size={24} color={colors.primary} />}
              />
          </View>

          <Text style={styles(colors).label}>Task title</Text>
          <Controller
            control={control}
            rules={{ required: "Title is required" }}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
              placeholderTextColor={colors.text}
                style={styles(colors).input}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Task Title"
              />
            )}
          />
          {errors.title && (
            <Text style={styles(colors).errorText}>{errors.title.message}</Text>
          )}

          <Text style={styles(colors).label}>Project</Text>
          <TouchableOpacity
            style={styles(colors).selectorButton}
            onPress={() => setProjectSelectorVisible(true)}
          >
            <Text style={{color:colors.text}}>{selectedProject?.name || "Select Project"}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          </TouchableOpacity>

          {renderAssignedToSection()}

          <Text style={styles(colors).label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
              placeholderTextColor={colors.text}
                style={[styles(colors).input, styles(colors).textArea]}
                onChangeText={onChange}
                value={value}
                placeholder="Enter description"
                multiline
                numberOfLines={4}
              />
            )}
          />

          <View style={styles(colors).dateContainer}>
            <View style={styles(colors).dateField}>
              <Text style={styles(colors).label}>Start Date</Text>
              <TouchableOpacity
                style={styles(colors).dateButton}
                onPress={() => openDatePicker("startDate")}
              >
                <Text style={{color:colors.text}}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles(colors).dateField}>
              <Text style={styles(colors).label}>Deadline</Text>
              <TouchableOpacity
                style={styles(colors).dateButton}
                onPress={() => openDatePicker("deadline")}
              >
                <Text style={{color:colors.text}}>{formatDate(deadline)}</Text>
              </TouchableOpacity>
            </View>

          </View>
            {renderFileSection()}

          <TouchableOpacity
            style={styles(colors).submitButton}
            onPress={ handleSubmit(onSubmitForm)}
          >
            <Text style={styles(colors).submitButtonText}>Add task</Text>
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
          style={[styles(colors).selectorModal]}
        >
          <View style={styles(colors).selectorContent}>
            <Text style={styles(colors).selectorTitle}>Select Project</Text>
            {projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={[
                  styles(colors).selectorOption,
                  selectedProjectId === project.id && styles(colors).selectedOption,
                ]}
                onPress={() => handleProjectSelect(project.id)}
              >
                <Text
                  style={[
                    styles(colors).selectorOptionText,
                    selectedProjectId === project.id &&
                      styles(colors).selectedOptionText,
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
          style={styles(colors).selectorModal}
        >
          <View style={styles(colors).selectorContent}>
            <Text style={styles(colors).selectorTitle}>Select Users</Text>
            {users.map((user: User) => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles(colors).selectorOption,
                  selectedUsers.includes(user.id) && styles(colors).selectedOption,
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
                      styles(colors).selectorOptionText,
                      selectedUsers.includes(user.id) &&
                        styles(colors).selectedOptionText,
                    ]}
                  >
                    {`${user.name.first} ${user.name.last}`}
                  </Text>
                  {selectedUsers.includes(user.id) && (
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
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
const styles =(colors:any) =>  StyleSheet.create({
  fileSection: {
    marginBottom: 15,
  },
  fileSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 8,
  },
  addFileText: {
    color: colors.primary,
    marginLeft: 5,
    fontWeight: '500',
  },
  fileList: {
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.text,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalView: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.background,
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
    color:colors.text
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: colors.background,
    color:colors.text,
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
  },
  selectorModal: {
    justifyContent: "center",
    margin: 20,
  },
  selectorContent: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color:colors.text
  },
  selectorOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: colors.card,
  },
  selectorOptionText: {
    fontSize: 16,
    color:colors.text
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default TaskFormModal;
