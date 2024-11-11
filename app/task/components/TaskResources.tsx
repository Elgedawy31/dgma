import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useThemeColor } from "@hooks/useThemeColor";

interface ResourcesProps {
  resources: string[];
  onSeeAll?: () => void;
}

const ResourcesList: React.FC<ResourcesProps> = ({ resources }) => {
  // Toggle between showing all resources and only 3
  const displayedResources = resources;
  const colors = useThemeColor()

  const renderItem = ({ item }: { item: string }) => {
    const fileType = item.match(/\.(\w+)$/)?.[1];

    return (
      <View style={styles(colors).resourceItem}>
        <View style={styles(colors).resourceInfo}>
          <View style={styles(colors).pdfIconContainer}>
            <FontAwesome
              name={fileType === "pdf" ? "file-pdf-o" : "file-image-o"}
              size={32}
              color={colors.primary}
            />
          </View>
          <View style={styles(colors).textContainer}>
            <Text style={styles(colors).resourceName}>
              {item.match(/\.com\/(.+)\.\w+$/)?.[1] ?? item}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles(colors).downloadButton}
          onPress={() => Linking.openURL(item)}
        >
          <Feather name="download" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ marginHorizontal: 16, flex: 1 }}>
      <View style={styles(colors).header}>
        <Text style={styles(colors).title}>Resources</Text>
      </View>

      <View style={styles(colors).container}>
      {resources?.length > 0 ?   <FlatList
          data={displayedResources}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          ItemSeparatorComponent={() => <View style={styles(colors).separator} />}
          showsVerticalScrollIndicator={false}
        /> : <Text style={{textAlign:'center', color:colors.text  , fontSize:18}}>No Recources</Text>}
      </View>
    </View>
  );
};

const styles =(colors:any) =>  StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "500",
  },
  seeAllText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  resourceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  resourceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pdfIconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
    fontWeight: "500",
  },
  resourceSize: {
    fontSize: 12,
    color:colors.text,
  },
  downloadButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#E1E1E1",
    marginVertical: 4,
  },
});

export default ResourcesList;
