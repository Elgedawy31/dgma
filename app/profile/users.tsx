import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { useThemeColor } from "@hooks/useThemeColor";
import { TaskColors } from "@colors";
import IconWrapper from "@components/IconWrapper";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import NewUser from "@components/users/AddNewUserModal";
import useAxios from "@hooks/useAxios";
import TerminateModal from "@components/users/TerminateModal";
import AppBar from "@blocks/AppBar";
import { router } from "expo-router";
import BlocksTxt from "@/components/blocks/Text";
type User = {
  id: string;
  user: { first: string; last: string };
  email: string;
  avatar: string;
  role: "admin" | "user";
};

const Users = () => {
  const color = useThemeColor();
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [userAdded, setUserAdded] = React.useState<boolean | any>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);
  const { get, deleteFunc } = useAxios();
  const handleTerminate = (userId: string) => {
    setSelectedId(userId);
    setOpenDeleteModal(true);
  };

  const renderUserItem = ({ item }: any) => (
    <View style={styles(color).userCard}>
      {item?.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles(color).avatar} />
      ) : (
        <View style={[styles(color).avatar, { backgroundColor: color.primary }]}>
          <Text style={styles(color).avatarTxt}>{item?.name?.first?.slice(0, 1)}</Text>
        </View>
      )}
      <View style={styles(color).userInfo}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={styles(color).username}>
            {item.name.first} {item.name.last}{" "}
          </Text>
          {/* <Text style={[styles(color).username , {color:item.role ==='admin' ? TaskColors.completed : TaskColors.review}]}> {item.role}</Text> */}
        </View>
        <Text style={styles(color).email}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => handleTerminate(item.id)}>
        <Text style={styles(color).terminateButtonText}>Terminate</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const handleSubmit = async () => {
      await get({ endPoint: "users/" })
        .then((res) => {
          if (res) {
            setUsers(res);
          }
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
        });
    };
    handleSubmit();
  }, [userAdded]);

  const handleDelete = async () => {
    await deleteFunc({ endPoint: `users/${selectedId}` })
      .then((res) => {
        if (res) {
          setUserAdded((prev: boolean) => !prev);
          setOpenDeleteModal(false);
          setSelectedId(null);
        }
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
      });
  };

  return (
    <View style={[styles(color).container, { backgroundColor: color.background }]}>
      <AppBar
        center
        title={<BlocksTxt type="subtitle" title="Users List" />}
        action={
          <IconWrapper
            size={36}
            onPress={() => setModalVisible(true)}
            Icon={<AntDesign name="plus" size={24} color={color.primary} />}
          />
        }
        leading={
          <Ionicons
            name="chevron-back"
            size={24}
            color={color.text}
            onPress={() => {
              router.back();
            }}
          />
        }
      />
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles(color).listContainer}
      />

      <NewUser
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        setTaskAdded={setUserAdded}
      />

      <TerminateModal
        visible={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="You want to terminate this user?"
      />
    </View>
  );
};

const styles =(colors:any) =>  StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "500",

    color: "#0F1010",
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#aaa",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.body,
    marginTop: 4,
  },
  terminateButtonText: {
    color: TaskColors.overdue,
    fontSize: 14,
    fontWeight: "500",
  },
  avatarTxt: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Users;
