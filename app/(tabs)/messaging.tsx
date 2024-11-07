import AppBar from "@blocks/AppBar";
import ImageAvatar from "@blocks/ImageAvatar";
import Text from "@blocks/Text";
import ChatCard from "@cards/ChatCard";
import { usersData } from "@data/users";
import { useThemeColor } from "@hooks/useThemeColor";
import Button from "@ui/Button";
import { Link, router } from "expo-router";
import { memo, useEffect, useState } from "react";
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

type channel = {
  _id: string;
  name: string;
};

const ChannelItem = memo(({ item }: { item: channel }) => (
  <TouchableOpacity style={{ gap: 2, alignItems: "center", paddingLeft: 12 }}>
    <Image
      style={{ width: 60, height: 60, borderRadius: 30 }}
      source={require("@/assets/images/groups-no-img.png")}
    />
    <Text type="body" title={item.name} />
  </TouchableOpacity>
));

function Messaging() {
  const colors = useThemeColor();
  const [activeTab, setActiveTab] = useState("Chats");
  const [channelsData, setChannelsData] = useState<channel[]>([]);
  const [groupData, setGroupData] = useState<any>([]);
  const { get } = useAxios();

  const tabs = ["Chats", "Groups"];

  useEffect(() => {
    const getChannelsFunction = async () => {
      await get({ endPoint: "channels/all?type=channel" })
        .then((res) => {
          if (res?.results) {
            setChannelsData(res.results);
          }
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
        });
    };

    getChannelsFunction();
  }, []);
  useEffect(() => {
    const getChannelsFunction = async () => {
      await get({ endPoint: "channels/all?type=group" })
        .then((res) => {
          if (res?.results) {
            setGroupData(res.results);
          }
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
        });
    };

    getChannelsFunction(); 
  }, []);

  console.log(groupData)
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
            <StackUI
              value={{ vertical: -5, horizontal: -1.5 }}
              position={{ vertical: "bottom", horizontal: "right" }}
              // sec={<Octicons name="dot-fill" size={24} color="#09419A" />}
              base={<Ionicons name="add" size={24} color="#09419A" />}
            />
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
          placeholder="Search"
          placeholderTextColor="#444"
        />
      </View>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab)}
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
      <View style={{ flex: 1 }}>
        {activeTab === "Chats" && (
          <FlatList
            data={[...usersData, ...usersData, ...usersData]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ChatCard msgID={`ChatID-${index}`} user={item} />
            )}
            keyExtractor={(item, index) => item._id! + index.toString()}
          />
        )}
        {activeTab === "Groups" && (
          <FlatList
            data={groupData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ChatCard msgID={`ChatID-${index}`} user={item} />
            )}
            keyExtractor={(item, index) => item._id! + index.toString()}
          />
        )}
      </View>
      <View style={{ marginVertical: 12 }}>
        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text type="title" title="Channels" />
          <Button type="text" label="see all" />
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
          <View
            style={{
              paddingVertical: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
    backgroundColor: "#002B7F", // Dark blue color for active tab
  },
  tabText: {
    color: "#666666",
    fontSize: 16,
  },
  activeTabText: {
    color: "white",
  },
});

export default memo(Messaging);
