import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Text from "@blocks/Text";
import { Message, ChatInfo } from '../types';
import { MessageItem } from './MessageItem';
import { useThemeColor } from "@hooks/useThemeColor";

interface MessageListProps {
  messages: Message[];
  chatInfo: ChatInfo;
  signedUserID: string;
  formatMessageTime: (timestamp: string) => string;
  onLoadMore: () => void;
}

export const MessageList = React.memo(({
  messages,
  chatInfo,
  signedUserID,
  formatMessageTime,
  onLoadMore
}: MessageListProps) => {
  const colors = useThemeColor();
  const flatListRef = useRef<FlatList | null>(null);
  const isFirstLoadRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Scroll to bottom on initial load and new messages
  useEffect(() => {
    if (messages.length > 0) {
      console.log("Messages updated, scrolling to bottom", {
        messageCount: messages.length,
        isFirstLoad: isFirstLoadRef.current
      });

      const scrollTimeout = setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({
            animated: !isFirstLoadRef.current
          });
        }
        isFirstLoadRef.current = false;
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, [messages.length]);

  // Fade animation for scroll button
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showScrollButton ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showScrollButton, fadeAnim]);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    
    // Show button if user has scrolled up more than 100 pixels from bottom
    const distanceFromBottom = contentHeight - scrollViewHeight - offsetY;
    setShowScrollButton(distanceFromBottom > 100);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
      setShowScrollButton(false);
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: Message }) => (
    <MessageItem
      message={item}
      isCurrentUser={item.senderId._id === signedUserID}
      formatMessageTime={formatMessageTime}
    />
  ), [signedUserID, formatMessageTime]);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleEndReached = useCallback(() => {
    console.log("Reached end of list, loading more", {
      currentPage: chatInfo.lastLoadedPage,
      fullyLoaded: chatInfo.fullyLoaded
    });
    if (!chatInfo.fullyLoaded) {
      onLoadMore();
    }
  }, [chatInfo, onLoadMore]);

  const ListHeaderComponent = useCallback(() => {
    if (!chatInfo.fullyLoaded) {
      return (
        <View style={styles.headerContainer}>
          <Text type="body" title="Loading more messages..." />
        </View>
      );
    }
    if (messages.length > 0) {
      return (
        <View style={styles.headerContainer}>
          <Text type="body" title="Beginning of conversation" />
        </View>
      );
    }
    return null;
  }, [chatInfo.fullyLoaded, messages.length]);

  const ListEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text type="body" title="No messages yet" />
    </View>
  ), []);

  console.log("Rendering MessageList", {
    messageCount: messages.length,
    fullyLoaded: chatInfo.fullyLoaded,
    lastPage: chatInfo.lastLoadedPage
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        inverted={false}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        style={[styles.flatList, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
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
    justifyContent: 'flex-end',
    paddingVertical: 16,
  },
  headerContainer: {
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