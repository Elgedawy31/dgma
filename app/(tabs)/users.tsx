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
import { AntDesign } from "@expo/vector-icons";
import NewUser from "@components/users/AddNewUserModal";
import useAxios from "@hooks/useAxios";

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
  const [users, setUsers] = React.useState<User[]>([]);
  const { get } = useAxios();
  const handleTerminate = (userId: string) => {
    // Handle user termination logic here
    console.log(`Terminate user with ID: ${userId}`);
  };

  const renderUserItem = ({ item }: any) => (
    <View style={styles.userCard}>
      {item?.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, { backgroundColor: color.primary }]}>
          <Text style={styles.avatarTxt}>{item?.name?.first?.slice(0, 1)}</Text>
        </View>
      )}
      <View style={styles.userInfo}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={styles.username}>
            {item.name.first} {item.name.first}{" "}
          </Text>
          {/* <Text style={[styles.username , {color:item.role ==='admin' ? TaskColors.completed : TaskColors.review}]}> {item.role}</Text> */}
        </View>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => handleTerminate(item.id)}>
        <Text style={styles.terminateButtonText}>Terminate</Text>
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

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.headerView}>
        <Text style={styles.header}>Users List</Text>
        <TouchableOpacity>
          <IconWrapper
            size={48}
            onPress={() => setModalVisible(true)}
            Icon={<AntDesign name="plus" size={24} color={color.primary} />}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <NewUser
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        setTaskAdded={setUserAdded}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "white",
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
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
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
