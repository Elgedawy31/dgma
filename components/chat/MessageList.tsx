import React, { useCallback, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
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
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      inverted={false}
      showsVerticalScrollIndicator={false}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
    />
  );
});

const styles = StyleSheet.create({
  container: {
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
});

MessageList.displayName = 'MessageList';
