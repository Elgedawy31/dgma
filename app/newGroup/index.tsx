import {
    Image,
    TouchableOpacity,
    View,
    Text as TextR,
    FlatList,
    StyleSheet,
    TextInput,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useThemeColor } from "@hooks/useThemeColor";
  import AppBar from "@blocks/AppBar";
  import Text from "@blocks/Text";
  import { router } from "expo-router";
  import StackUI from "@blocks/StackUI";
  import { AntDesign, Ionicons } from "@expo/vector-icons";
import useAxios from "@hooks/useAxios";
  
type MemberProps = {
  id: string;
  name: {
      first: string;
      last: string;
  };
  role: string;
  avatar: string;
};
  const index = () => {
    const colors = useThemeColor();
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const {get} = useAxios();
    const [members , setMembers]  =useState<MemberProps[]>([]);

    const [selectedMembers, setSelectedMembers] = useState(new Set());
  
    const filteredMembers = members.filter(
      (member) =>
          `${member.name.first} ${member.name.last}`.toLowerCase().includes(search.toLowerCase()) ||
          member.role.toLowerCase().includes(search.toLowerCase())
  );
  
    const toggleMember = (id: string) => {
      const newSelected = new Set(selectedMembers);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelectedMembers(newSelected);
    };
 
    useEffect(() => {
      get({ endPoint: "users" })
        .then((res) => {
          if (res) {
            setMembers(res); 
          }
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
        });
    } , [])
       
    const renderMember = ({ item }: { item: MemberProps }) => (
      <TouchableOpacity
        style={styles(colors).memberItem}
        onPress={() => toggleMember(item.id)}
      >
        <View style={styles(colors).memberInfo}>
          <Image source={{ uri: item.avatar }} style={styles(colors).avatar} />
          <View style={styles(colors).textContainer}>
            <TextR style={styles(colors).name}>{item.name.first} {item.name.last}</TextR>
            <TextR style={styles(colors).role}>{item.role}</TextR>
          </View>
        </View>
        <View
          style={[
            styles(colors).checkbox,
            selectedMembers.has(item.id) && styles(colors).checkboxSelected,
          ]}
        >
          {selectedMembers.has(item.id) && (
            <AntDesign name="check" size={16} color="#fff" />
          )} 
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar
          leading="back"
          title={
            <View>
              <Text type="subtitle" title="New Group" />
            </View>
          }
          action={
            !showSearch && (
              <TouchableOpacity
                onPress={() => setShowSearch(true)}
                style={{
                  backgroundColor: "#F1F9FF",
                  borderRadius: 50,
                  padding: 8,
                }}
              >
                <StackUI
                  value={{ vertical: -5, horizontal: -1.5 }}
                  position={{ vertical: "bottom", horizontal: "right" }}
                  base={<Ionicons name="search" size={24} color="#09419A" />}
                />
              </TouchableOpacity>
            )
          }
        />
        {showSearch && (
          <View style={styles(colors).searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#666"
              style={styles(colors).icon}
            />
            <TextInput
              style={styles(colors).input}
              placeholder="Search"
              placeholderTextColor="#444"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={styles(colors).container}>
          <TextR style={styles(colors).header}>Add members</TextR>
          <FlatList
            data={filteredMembers}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
  
        {selectedMembers.size > 0 && (
          <View style={styles(colors).bottomContainer}>
            <TouchableOpacity
              style={styles(colors).nextButton} 
              onPress={() => {
                const selectedMembersData = members.filter(member => 
                  selectedMembers.has(member.id)
                );
                
                router.push({
                  pathname: '/newGroup/confirm',
                  params: {
                    members: JSON.stringify(selectedMembersData),
                    totalNum: members?.length,
                  }
                });
              }}
            >
              <TextR style={styles(colors).nextButtonText}>
                Next ({selectedMembers.size})
              </TextR>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  const styles = (colors: any) =>
    StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
        paddingBottom: 80, // Add padding for the button
      },
      header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
      },
      memberItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
      },
      memberInfo: {
        flexDirection: "row",
        alignItems: "center",
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
      },
      textContainer: {
        justifyContent: "center",
      },
      name: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
      },
      role: {
        fontSize: 14,
        color: colors.body,
      },
      checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#DDDDDD",
        alignItems: "center",
        justifyContent: "center",
      },
      checkboxSelected: {
        backgroundColor: "#57D9A3",
        borderColor: "#57D9A3",
      },
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
      bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0, 
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      nextButton: {
        backgroundColor: colors.primary ,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
      },
      nextButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
      },
    });
  
  export default index;