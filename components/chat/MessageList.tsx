import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import Text from "@blocks/Text";
import { Message, ChatInfo, ForwardDestination } from '@model/types';
import { MessageItem } from './MessageItem';
import { useThemeColor } from "@hooks/useThemeColor";
import Icon from '@blocks/Icon';

interface MessageListProps {
  messages: Message[];
  chatInfo: ChatInfo;
  signedUserID: string;
  formatMessageTime: (timestamp: string) => string;
  onLoadMore: () => void;
  onReply?: (message: Message) => void;
  onForward?: (message: Message, destination: ForwardDestination) => void;
}

export const MessageList = React.memo(({
  messages,
  chatInfo,
  signedUserID,
  formatMessageTime,
  onLoadMore,
  onReply,
  onForward
}: MessageListProps) => {
  const colors = useThemeColor();
  const flatListRef = useRef<FlatList | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showScrollButton ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showScrollButton, fadeAnim]);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Since the list is inverted, we show the button when offsetY is greater than 0
    setShowScrollButton(offsetY > 0);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: Message }) => (
    <MessageItem
      message={item}
      isCurrentUser={item.senderId._id === signedUserID}
      formatMessageTime={formatMessageTime}
      onReply={onReply}
      onForward={onForward}
    />
  ), [signedUserID, formatMessageTime, onReply, onForward]);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleEndReached = useCallback(() => {
    if (!chatInfo.fullyLoaded) {
      const nextPage = currentPage + 1;
      console.log("reached to top", { currentPage, nextPage });
      setCurrentPage(nextPage);
      onLoadMore(); 
    }
  }, [chatInfo.fullyLoaded, currentPage, onLoadMore]);

  const ListFooterComponent = useCallback(() => {
    if (!chatInfo.fullyLoaded && messages.length > 0) {
      return (
        <View style={styles.footerContainer}>
          {/* <ActivityIndicator size="small" color={colors.primary} /> */}
        </View>
      );
    }
    return null;
  }, [chatInfo.fullyLoaded, messages.length, colors.primary]);

  const ListEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="emoticon-happy-outline" size={100} color={colors.text} />
    </View>
  ), []);
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={[...messages].reverse()}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        inverted={true}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        style={[styles.flatList, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
      
      <Animated.View 
        style={[
          styles.scrollButtonContainer,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }
        ]}
        pointerEvents={showScrollButton ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={[styles.scrollButton, { backgroundColor: colors.primary }]}
          onPress={scrollToBottom}
          activeOpacity={0.8}
        >
          <AntDesign name="down" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  footerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollButtonContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    zIndex: 1000,
  },
  scrollButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

MessageList.displayName = 'MessageList';
