// NotificationSystem.tsx
import React, { memo, useCallback, useEffect, useRef, useState, useContext } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Vibration,
  Dimensions,
  Image
} from 'react-native';
import { userContext } from '@UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useSocket } from '@hooks/useSocket';

// Types
export interface Notification {
  id: string;
  type: 'message' | 'unread_message' | 'mention' | 'reaction' | 'system';
  content: string;
  sender?: {
    _id: string;
    name: {
      first: string;
      last: string;
    };
    avatar?: string;
  };
  conversationId?: string;
  conversationType?: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

interface ToastProps {
  notification: Notification | null;
  onHide: () => void;
  onPress: (notification: Notification) => void;
  visible: boolean;
}

// Custom Toast Component
const Toast = memo<ToastProps>(({ notification, onHide, onPress, visible }) => {
  const animation = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (visible) {
      // Simple vibration that works in Expo Go
      if (Platform.OS === 'android') {
        Vibration.vibrate(200);
      }

      // Animate toast
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(4000),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible || !notification) return null;

  const handlePress = () => {
    onHide();
    onPress(notification);
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'message':
        return '#2196F3';
      case 'mention':
        return '#4CAF50';
      case 'reaction':
        return '#FF9800';
      default:
        return '#333';
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
          opacity: animation,
          width: width - 32,
          backgroundColor: getNotificationColor(),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toastContent}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {notification.sender?.avatar && (
          <Image
            source={{ uri: notification.sender.avatar }}
            style={styles.avatar}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {notification.sender?.name.first || 'Notification'}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {notification.content}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Main Notification System Component
const NotificationSystem = () => {
  const { user } = useContext(userContext);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const notificationQueueRef = useRef<Notification[]>([]);
  const isProcessingRef = useRef(false);
  const maxStoredNotifications = 100;
  const storageKey = 'app_notifications';

  // Handle new notification
  const handleNotification = useCallback(async (notification: Notification) => {
    try {
      // Save notification to storage
      const storedNotifications = await AsyncStorage.getItem(storageKey);
      const notifications = storedNotifications 
        ? JSON.parse(storedNotifications) 
        : [];
      
      await AsyncStorage.setItem(storageKey, JSON.stringify([
        notification,
        ...notifications.slice(0, maxStoredNotifications - 1)
      ]));

      // Add to queue
      notificationQueueRef.current.push(notification);
      processNextNotification();
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  }, []);

  // Process notification queue
  const processNextNotification = useCallback(() => {
    if (isProcessingRef.current || notificationQueueRef.current.length === 0) return;

    isProcessingRef.current = true;
    const nextNotification = notificationQueueRef.current.shift();
    
    if (nextNotification) {
      setActiveNotification(nextNotification);
      setIsVisible(true);
    }
  }, []);

  // Hide current toast
  const hideToast = useCallback(() => {
    setIsVisible(false);
    isProcessingRef.current = false;
    setActiveNotification(null);
    // Process next notification after a short delay
    setTimeout(processNextNotification, 300);
  }, [processNextNotification]);

  // Handle notification press
  const handleNotificationPress = useCallback((notification: Notification) => {
    switch (notification.type) {
      case 'message':
      case 'unread_message':
        if (notification.conversationId) {
          router.push(`/chat/${notification.conversationId}`);
        }
        break;
      case 'mention':
        if (notification.data?.screenName) {
          router.push(notification.data.screenName);
        }
        break;
      case 'reaction':
        if (notification.data?.messageId) {
        //   router.push(`/chat/${notification.conversationId}?messageId=${notification.data.messageId}`);
        console.log('go to chat' , notification);
        }
        break;
      default:
        if (notification.data?.route) {
          router.push(notification.data.route);
        }
    }
  }, []);

  // Initialize socket connection for notifications
  const { isSocketConnected } = useSocket(
    'notifications',
    'global',
    user?.id || '',
    () => {}, // onNewMessage
    () => {}, // onMessagesReceived
    () => {}, // onMessagesSeen
    handleNotification // notification handler
  );

  // Load saved notifications on mount
  useEffect(() => {
    const loadSavedNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem(storageKey);
        if (storedNotifications) {
          const notifications = JSON.parse(storedNotifications);
          // You could process unread notifications here if needed
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    if (user?.id) {
      loadSavedNotifications();
    }
  }, [user?.id]);

  return (
    <Toast
      notification={activeNotification}
      visible={isVisible}
      onHide={hideToast}
      onPress={handleNotificationPress}
    />
  );
};

// Styles
const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
});

export default memo(NotificationSystem);