import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';

interface Resource {
  id: string;
  name: string;
  size: string;
}

interface ResourcesProps {
  resources: Resource[];
  onDownload?: (resource: Resource) => void;
  onSeeAll?: () => void;
}

const ResourcesList: React.FC<ResourcesProps> = ({
  resources,
  onDownload,
}) => {

  // Toggle between showing all resources and only 3
  const displayedResources = resources 


  const renderItem = ({ item }: { item: Resource }) => (
    <View style={styles.resourceItem}>
      <View style={styles.resourceInfo}>
        <View style={styles.pdfIconContainer}>
          <FontAwesome name="file-pdf-o" size={32} color="#002D75" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.resourceName}>{item.name}</Text>
          <Text style={styles.resourceSize}>{item.size}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => onDownload?.(item)}
      >
        <Feather name="download" size={20} color="#002D75" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ marginHorizontal: 16  , flex:1}}>
      <View style={styles.header}>
        <Text style={styles.title}>Resources</Text>
      
      </View>

      <View style={styles.container}>
        <FlatList
          data={displayedResources}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#0F1010',
    fontSize: 20,
    fontWeight: '500',
  },
  seeAllText: {
    fontSize: 12,
    color: '#002D75',
    fontWeight: '500',
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#2B2C2C',
    marginBottom: 2,
    fontWeight: '500',
  },
  resourceSize: {
    fontSize: 12,
    color: '#0F1010',
  },
  downloadButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E1E1E1',
    marginVertical: 4,
  },
});

export default ResourcesList;