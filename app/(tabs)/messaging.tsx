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
import { memo, useEffect, useState, useMemo, useContext, useCallback } from "react";
import ImageAvatar from "@blocks/ImageAvatar";


const ChannelItem = memo(({ item }: { item: ChatModal }) => (
  <TouchableOpacity style={{ gap: 2, alignItems: "center", paddingLeft: 12 }}>
    <ImageAvatar
      type="channel"
      url='1731026479790_zoeyshen_dashboard3_2x.png'
    // style={{ width: 60, height: 60, borderRadius: 30 }}
    // source={require("@assets/images/groups-no-img.png")}
    />
    <Text type="body" title={item.name} />
  </TouchableOpacity>
));

const tabs = [{ type: "dm", label: "Chats" }, { type: "group", label: "Groups" }];

function Messaging() {
  const { get } = useAxios();
  const colors = useThemeColor();
  const { user: { id: signedUserID } } = useContext(userContext)
  // const [users, setUsers] = useState<UserModel[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  // const [groupData, setGroupData] = useState<ChatModal[]>([]);
  const [chatData, setChatData] = useState<ChatModal[]>([]);
  const [channelsData, setChannelsData] = useState<ChatModal[]>([]);
  const { control, handleSubmit, watch, reset } =
    useForm<{ query: string }>({ defaultValues: { query: "" }, });

  // Get filtered data based on active tab
  // const filteredData = useMemo(() => {
  //   const query = searchQuery.toLowerCase().trim();

  //   groupData.filter((group) => group.name.toLowerCase().trim().includes(query));

  //   const dm = users
  //     .filter(({ name: { first, last } }) => `${first} ${last}`.toLowerCase().trim().includes(query))
  //     .map(({ id, name: { first, last }, avatar }) => (
  //       {
  //         id: `dm_${[signedUserID, id].sort().join("_")}`,
  //         name: `${first} ${last}`, logo: avatar, type: "dm"
  //       } as ChatModal)
  //     )
  //   return activeTab === tabs[0] ? dm : groupData;

  // }, [activeTab, searchQuery, users, groupData]);

  useEffect(() => {
    const getUsersFunction = async () => {
      try {
        const res = await get({ endPoint: "users" });
        if (res) {
          setChatData(res
            .filter((user: UserModel) => user.id !== signedUserID)
            .map(({ id, name: { first, last }, avatar }: UserModel) => (
              {
                id: `dm_${[signedUserID, id].sort().join("_")}`,
                name: `${first} ${last}`.toLowerCase().trim(), logo: avatar, type: "dm"
              } as ChatModal)
            ));
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };

    const getGroupsFunction = async () => {
      try {
        const res = await get({ endPoint: "channels/all?type=group" });
        if (res?.results) {
          // setGroupData(res.results);
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    };

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

    getUsersFunction();
    getGroupsFunction();
    getChannelsFunction();
  }, []);


  const toggleActiveTab = useCallback((idx: number) => {
    console.log("tab", idx);
    setActiveTab(idx);
    reset({ query: '' });
  }, []);

  const clearSearch = useCallback(() => reset({ query: '' }), []);

  // const handleSearch = useCallback((text: string) => setSearchQuery(text), []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title={<Text type="subtitle" title="Chats" />}
        action={<Icon icon="add" type="complex" onPress={() => router.push("/newGroup")} />}
      />

      <View style={[styles(colors).searchContainer , {backgroundColor:colors.card}, watch('query') ? { paddingLeft: 0, paddingRight: 5 } : { paddingLeft: 5, paddingRight: 0 }]}>
        {!watch('query') && <Icon iconColor={colors.text} icon="search" />}
        <View style={{ flex: 1 }}>
          <TextInputField
            noLabel noBorder
            name='query' control={control}
            placeholder={`Search ${tabs[activeTab].label}...`}
          />
        </View>
        {watch('query') && <Icon
          size={18} icon='close' type="complex"
          iconColor={colors.text} onPress={clearSearch} />
        }
      </View>

      {/* <View style={styles(colors).searchContainer}>
        <Icon icon="search" />
        <TextInput
          style={styles(colors).input}
          placeholder={`Search ...`}
          placeholderTextColor="#444"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View> */}





      <View style={styles(colors).tabsContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity key={tab.type}
            onPress={() => toggleActiveTab(index)}
            style={[styles(colors).tabButton, index === activeTab && styles(colors).activeTabButton,]}
          >
            <Text
              // style={[
              //   styles(colors).tabText,
              //   activeTab === tab && styles(colors).activeTabText,
              // ]}
              title={tab.label}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles(colors).contentContainer}>
        <FlatList
          data={[...chatData]
            .filter((chat) => activeTab === 0 ? chat.type === 'dm' : chat.type === 'group')
            .filter((chat) => !watch('query') ? true : chat.name.toLowerCase().includes(watch('query').toLowerCase()))
          }
          keyExtractor={({ id }) => id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ChatCard {...item} />}
          ListEmptyComponent={() => (
            <View style={styles(colors).emptyContainer}>
              <Text
                type="body"
                title={`No ${tabs[activeTab].label.toLowerCase()} found${watch('query') ? ' for your search' : ''
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
            renderItem={({ item }) => <ChannelItem item={item} />}
            keyExtractor={(item) => item?.id?.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View style={styles(colors).emptyContainer}>
            <Text type="body" title="No channels found" />
          </View>
        )}
      </View>
    </View >
  );
}

const styles =(colors:any) =>  StyleSheet.create({
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