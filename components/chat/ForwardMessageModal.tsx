import React, { useCallback, useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Text from "@blocks/Text";
import ImageAvatar from "@blocks/ImageAvatar";
import { useThemeColor } from "@hooks/useThemeColor";
import { Message, ForwardDestination } from '@model/types';
import useAxios from '@hooks/useAxios';

interface ForwardMessageModalProps {
  visible: boolean;
  onClose: () => void;
  onForward: (destination: ForwardDestination) => void;
  message: Message;
}

export const ForwardMessageModal = React.memo(({ 
  visible, 
  onClose, 
  onForward,
  message 
}: ForwardMessageModalProps) => {
  const colors = useThemeColor();
  const { getRequest } = useAxios();
  const [destinations, setDestinations] = useState<ForwardDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'users' | 'channels' | 'groups'>('users');

  // Fetch destinations when modal opens or tab changes
  useEffect(() => {
    if (visible) {
      fetchDestinations();
    }
  }, [visible, selectedTab]);

  const fetchDestinations = async () => {
    setLoading(true);
    
    try {
      let data: ForwardDestination[] = [];
      
      switch (selectedTab) {
        case 'users':
          const usersResponse = await getRequest({ endPoint: 'users' });
          if (usersResponse) {
            data = usersResponse.map((user: any) => ({
              id: user.id,
              name: `${user.name.first} ${user.name.last}`,
              avatar: user.avatar,
              type: 'user' as const
            }));
          } 
          break;
          
        case 'channels':
          const channelsResponse = await getRequest({ endPoint: 'channels/all?type=channel' });
          if (channelsResponse?.results) {
            data = channelsResponse.results.map((channel: any) => ({
              id: channel._id,
              name: channel.name,
              avatar: channel.photo,
              type: 'channel' as const
            }));
          }
          break;
          
        case 'groups':
          const groupsResponse = await getRequest({ endPoint: 'channels/all?type=group' });
          if (groupsResponse?.results) {
            data = groupsResponse.results.map((group: any) => ({
              id: group._id,
              name: group.name,
              avatar: group.photo,
              type: 'group' as const
            }));
          }
          break;
      }

      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForward = (destination: ForwardDestination) => {
    onForward(destination);
    onClose();
  };

  const renderItem = ({ item }: { item: ForwardDestination }) => (
    <TouchableOpacity
      style={[styles.destinationItem, { backgroundColor: colors.card }]}
      onPress={() => handleForward(item)}
    >
      <View style={styles.avatarContainer}>
        <ImageAvatar type="avatar" url={item.avatar || ""} />
      </View>
      <View style={styles.destinationInfo}>
        <Text type="body" title={item?.name} />
      </View>
      <AntDesign name="right" size={20} color={colors.text} />
    </TouchableOpacity>
  );

  const renderTabs = () => (
    <View style={styles.tabs}>
      {(['users', 'channels', 'groups'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            { 
              backgroundColor: selectedTab === tab ? colors.primary : 'transparent',
              borderColor: colors.primary
            }
          ]}
          onPress={() => setSelectedTab(tab)}
        >
          <Text 
            type="body" 
            title={tab.charAt(0).toUpperCase() + tab.slice(1)}
            color={selectedTab === tab ? colors.white : colors.primary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text type="subtitle" title="Forward Message" />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.messagePreview}>
            <Text 
              type="small" 
              title={message.content}
              style={styles.messageText}
            />
          </View>

          {renderTabs()}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={destinations}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  messagePreview: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  messageText: {
    opacity: 0.7,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: 8,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  destinationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  typeText: {
    opacity: 0.7,
  },
});

ForwardMessageModal.displayName = 'ForwardMessageModal';
