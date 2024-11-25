import Text from "@blocks/Text";
import Icon from "@blocks/Icon";
import UserModel from "@model/user";
import ChatModal from "@model/chat";
import { router } from "expo-router";
import AppBar from "@blocks/AppBar";
import ChatCard from "@cards/ChatCard";
import useAxios from "@hooks/useAxios";
import { useForm } from "react-hook-form";
import { userContext } from "@UserContext";
import TextInputField from "@ui/TextInputField";
import { useThemeColor } from "@hooks/useThemeColor";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import {
  memo,
  useEffect,
  useState,
  useMemo,
  useContext,
  useCallback,
} from "react";
import ImageAvatar from "@blocks/ImageAvatar";
import ChannelModal from "@model/channel";
import { UserBase } from "@model/types";
import {
  NotificationContext,
  NotificationContextType,
} from "@components/NotificationSystem";

const ChannelItem = memo(({ _id, name, logo, type }: ChatModal) => {
  const { lastNotificationSenderId, markConversationAsRead } =
    useContext<NotificationContextType>(NotificationContext);

  // Check for new message based on chat type
  const hasNewMessage = Boolean(
    lastNotificationSenderId && lastNotificationSenderId?.includes(_id)
  );

  const handleName = useMemo(() => {
    const temp = name.split(" ");
    if (temp.length === 1) return temp[0];
    return temp[1].length > 10
      ? temp[1].slice(0, 10) + `...`
      : `${temp[0]} ${temp[1]}`;
  }, [name]);

  const handlePress = useCallback(() => {
    router.push({
      pathname: "/chat/[id]",
      params: { id: _id, chat: JSON.stringify({ logo, name, type, id: _id }) },
    });
    // Always mark conversation as read when clicking on a channel
    markConversationAsRead(_id);
  }, [_id, name, logo, type, markConversationAsRead]);
  
  const colors = useThemeColor();
  return (
    <TouchableOpacity
      style={{ gap: 2, alignItems: "center", paddingLeft: 12 }}
      onPress={handlePress}
    >
      <ImageAvatar type="channel" url={logo || null} />
      {hasNewMessage && (
        <View
          style={[
            styles(colors).notificationDot,
            type === "dm" ? styles(colors).dmDot : styles(colors).groupDot,
          ]}
        />
      )}
      
      <Text type="body" title={handleName} />
    </TouchableOpacity>
  );
});

const tabs = [
  { type: "dm", label: "Chats" },
  { type: "group", label: "Groups" },
];

function Messaging() {
  const { getRequest } = useAxios();
  const colors = useThemeColor(); 
  const { user } = useContext(userContext);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [chatData, setChatData] = useState<ChatModal[]>([]);
  const [groupData, setGroupData] = useState<ChatModal[]>([]);
  const [channelsData, setChannelsData] = useState<ChatModal[]>([]);

  const { control, handleSubmit, watch, reset } = useForm<{ query: string }>({
    defaultValues: { query: "" },
  });

  const searchQuery = watch("query");

  // Filter data based on active tab and search query
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const data = activeTab === 0 ? chatData : groupData;

    return data.filter(
      (item) =>
        item.name.toLowerCase()?.includes(query) &&
        item.type === (activeTab === 0 ? "dm" : "group")
    );
  }, [activeTab, searchQuery, chatData, groupData]);

  useEffect(() => {
    const getUsersFunction = async () => {
      try {
        const res = await getRequest({ endPoint: "users" });
        if (res) {
          setChatData(
            res
              .filter((u: UserModel) => u.id !== user.id)
              .map(
                ({ id, name: { first, last }, avatar }: UserModel) =>
                  ({
                    _id: `dm_${[user.id, id].sort().join("_")}`,
                    receivers: [
                      {
                        _id: id,
                        avatar: avatar,
                        name: { first, last },
                      },
                    ] as UserBase[],
                    name: `${first} ${last}`.toLowerCase().trim(),
                    logo: avatar,
                    type: "dm",
                  } as ChatModal)
              )
          );
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };

    const getGroupsFunction = async () => {
      try {
        const res = await getRequest({ endPoint: "channels/all?type=group" });
        if (res?.results) {
          setGroupData(
            res.results.map(
              (group: ChannelModal) =>
                ({
                  _id: group._id,
                  name: group.name,
                  logo: group.photo,
                  receivers: group.members
                    .filter((member) => member._id !== user.id)
                    .map((member) => ({
                      _id: member._id,
                      avatar: member.avatar,
                      name: {
                        first: member.name.first,
                        last: member.name.last,
                      },
                    })) as UserBase[],
                  type: "group",
                } as ChatModal)
            )
          );
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };

    const getChannelsFunction = async () => {
      try {
        const res = await getRequest({ endPoint: "channels/all?type=channel" });
        if (res?.results) {
          setChannelsData(
            res.results.map(
              ({ _id, name, photo, members }: ChannelModal) =>
                ({
                  _id: _id,
                  name: name,
                  logo: photo,
                  receivers: members
                    .filter((member) => member._id !== user.id)
                    .map((member) => ({
                      _id: member._id,
                      avatar: member.avatar,
                      name: {
                        first: member.name.first,
                        last: member.name.last,
                      },
                    })) as UserBase[],
                  type: "channel",
                } as ChatModal)
            )
          );
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };

    getUsersFunction();
    getGroupsFunction();
    getChannelsFunction();
  }, [getRequest, user.id]);

  const toggleActiveTab = useCallback(
    (idx: number) => {
      setActiveTab(idx);
      reset({ query: "" });
    },
    [reset]
  );

  const clearSearch = useCallback(() => reset({ query: "" }), [reset]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title={
          <Text type="subtitle" title={activeTab === 0 ? "Chats" : "Groups"} />
        }
        action={
        <>{ activeTab === 1 &&   <Icon
          icon="add"
          type="complex"
          onPress={() => router.push("/newGroup")}
        /> }</>
        }
      />

      <View
        style={[
          styles(colors).searchContainer,
          { backgroundColor: colors.card },
          searchQuery
            ? { paddingLeft: 0, paddingRight: 5 }
            : { paddingLeft: 5, paddingRight: 0 },
        ]}
      >
        {!searchQuery && <Icon iconColor={colors.text} icon="search" />}
        <View style={{ flex: 1 }}>
          <TextInputField
            noLabel
            noBorder
            name="query"
            control={control}
            placeholder={`Search ${tabs[activeTab].label}...`}
          />
        </View>
        {searchQuery && (
          <Icon
            size={18}
            icon="close"
            type="complex"
            iconColor={colors.text}
            onPress={clearSearch}
          />
        )}
      </View>

      <View style={styles(colors).tabsContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.type}
            onPress={() => toggleActiveTab(index)}
            style={[
              styles(colors).tabButton,
              index === activeTab && styles(colors).activeTabButton,
            ]}
          >
            <Text
              type="body"
              title={tab.label}
              color={index === activeTab ? "white" : undefined}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles(colors).contentContainer}>
        <FlatList
          data={filteredData}
          keyExtractor={({ _id }) => _id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ChatCard {...item} />}
          ListEmptyComponent={() => (
            <View style={styles(colors).emptyContainer}>
              <Text
                type="body"
                title={`No ${tabs[activeTab].label.toLowerCase()} found${
                  searchQuery ? " for your search" : ""
                }`}
              />
            </View>
          )}
        />
      </View>

      <View style={styles(colors).channelsSection}>
        <View style={styles(colors).channelsHeader}>
          <Text type="title" title="Channels" />
        </View>
        {channelsData.length > 0 ? (
          <FlatList
            horizontal
            data={channelsData}
            renderItem={({ item }) => <ChannelItem {...item} />}
            keyExtractor={({ _id }) => _id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View style={styles(colors).emptyContainer}>
            <Text type="body" title="No channels found" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    searchContainer: {
      margin: 12,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 8,
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
      backgroundColor: colors.card,
    },
    activeTabButton: {
      backgroundColor: colors.primary,
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
    notificationDot: {
      position: "absolute",
      right: 0,
      top: 3,
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: "#fff",
    },
    dmDot: {
      backgroundColor: "#2196F3", // Blue for direct messages
    },
    groupDot: {
      backgroundColor: "#4CAF50", // Green for group messages
    },
    newMessageText: {
      fontSize: 12,
      color: "#4CAF50", // Green text for group message indicator
    },
  });

export default memo(Messaging);
