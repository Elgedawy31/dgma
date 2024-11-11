import AppBar from "@blocks/AppBar";
import ImageAvatar from "@blocks/ImageAvatar";
import Text from "@blocks/Text";
import ChatCard from "@cards/ChatCard";
import { useThemeColor } from "@hooks/useThemeColor";
import Button from "@ui/Button";
import { Link, router } from "expo-router";
import { memo, useEffect, useState, useMemo, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text as TextR,
  Image,
} from "react-native";
import StackUI from "@blocks/StackUI";
import { Ionicons } from "@expo/vector-icons";
import useAxios from "@hooks/useAxios";
import GroupCard from "@cards/GroupCard";
import Icon from "@blocks/Icon";
import { userContext } from "@UserContext";
import UserModel from "@model/user";

type Channel = {
  _id: string;
  name: string;
};

type User = {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  role: string;
};

type Group = {
  _id: string;
  name: string;
};

const ChannelItem = memo(({ item }: { item: Channel }) => (
  <TouchableOpacity style={{ gap: 2, alignItems: "center", paddingLeft: 12 }}>
    <Image
      style={{ width: 60, height: 60, borderRadius: 30 }}
      source={require("@/assets/images/groups-no-img.png")}
    />
    <Text type="body" title={item.name} />
  </TouchableOpacity>
));

function Messaging() {
  const { user: { id } } = useContext(userContext)
  const colors = useThemeColor();
  const [activeTab, setActiveTab] = useState("Chats");
  const [channelsData, setChannelsData] = useState<Channel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { get } = useAxios();

  const tabs = ["Chats", "Groups"];

  // Get filtered data based on active tab
  const filteredData = useMemo(() => {
    console.log("filtered data");
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return activeTab === "Chats" ? users : groupData;
    }

    if (activeTab === "Chats") {
      return users
    } else {
      return groupData.filter((group) =>
        group.name.toLowerCase().includes(query)
      );
    }
  }, [activeTab, searchQuery, users, groupData]);

  useEffect(() => {
    const getChannelsFunction = async () => {
      try {
        const res = await get({ endPoint: "channels/all?type=channel" });
        if (res?.results) {
          setChannelsData(res.results);
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };

    getChannelsFunction();
  }, []);

  useEffect(() => {
    const getGroupsFunction = async () => {
      try {
        const res = await get({ endPoint: "channels/all?type=group" });
        if (res?.results) {
          setGroupData(res.results);
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };

    getGroupsFunction();
  }, []);

  useEffect(() => {
    const getUsersFunction = async () => {
      try {
        const res = await get({ endPoint: "users" });
        if (res) {
          setUsers(res.filter((user: UserModel) => { console.log(JSON.stringify(user.name)); return user.id !== id }));
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };

    getUsersFunction();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  console.log(channelsData)

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title={
          <View>
            <Text type="subtitle" title="Chats" />
          </View>
        }
        action={
          <TouchableOpacity
            onPress={() => router.push("/newGroup")}
            style={{ backgroundColor: "#F1F9FF", borderRadius: 50, padding: 8 }}
          >
            <Icon icon="add" type="simple" />
          </TouchableOpacity>
        }
      />
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          placeholderTextColor="#444"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => {
              setActiveTab(tab);
              setSearchQuery(""); // Clear search when switching tabs
            }}
          >
            <TextR
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </TextR>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) =>
            activeTab === "Chats" ? (
              <ChatCard msgID={`ChatID-${index}`} user={item} />
            ) : (
              <GroupCard msgID={`ChatID-${index}`} group={item} />
            )
          }
          keyExtractor={(item, index) => item._id + index.toString()}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text
                type="body"
                title={`No ${activeTab.toLowerCase()} found${searchQuery ? ' for your search' : ''
                  }`}
              />
            </View>
          )}
        />
      </View>

      <View style={styles.channelsSection}>
        <View style={styles.channelsHeader}>
          <Text type="title" title="Channels" />
        </View>
        {channelsData.length > 0 ? (
          <FlatList
            horizontal
            data={channelsData}
            renderItem={({ item }) => <ChannelItem item={item} />}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text type="body" title="No channels found" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    margin: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF1F3",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#444",
    fontWeight: "600",
    paddingVertical: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    padding: 8,
    gap: 8,
    justifyContent: "space-around",
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  activeTabButton: {
    backgroundColor: "#002B7F",
  },
  tabText: {
    color: "#666666",
    fontSize: 16,
  },
  activeTabText: {
    color: "white",
  },
  contentContainer: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  channelsSection: {
    marginVertical: 12,
  },
  channelsHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
});

export default memo(Messaging);