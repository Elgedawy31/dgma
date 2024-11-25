import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
} from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Vibration,
  Dimensions,
  Image,
} from "react-native";
import { userContext } from "@UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import { useSocket } from "@hooks/useSocket";
import {
  RawMessage,
  UserBase,
  NotificationType,
  MessageNotification,
} from "../models/types";
import { useThemeColor } from "@hooks/useThemeColor";
import Text from "@blocks/Text";

// Types
export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  sender?: UserBase;
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

// Create context for notifications
export interface NotificationContextType {
  unreadMessages: { [conversationId: string]: number };
  hasUnreadMessages: boolean;
  markConversationAsRead: (conversationId: string) => void;
  lastNotificationSenderId: string[]; // Changed to string array
}

export const NotificationContext = createContext<NotificationContextType>({
  unreadMessages: {},
  hasUnreadMessages: false,
  markConversationAsRead: () => { },
  lastNotificationSenderId: [], // Changed default to empty array
});

interface NotificationSystemProps {
  children: React.ReactNode;
}

// Helper function to process avatar URL
const processAvatarUrl = (avatarUrl: string | undefined | null): any => {
  if (!avatarUrl) {
    return require('../assets/images/user.png');
  }
  //http://teamapp2024.s3.amazonaws.com/http://teamapp2024.s3.amazonaws.com/1731294617646_images.jpeg


  // Check for duplicate S3 URL pattern
  if (avatarUrl.includes('https://teamapp2024.s3.amazonaws.com/http://')) {


    const parts = avatarUrl.split('http');
    console.log('parts' , parts)
    return { uri:`http${parts[2]}` };
  }

  return { uri: avatarUrl };
};

const Toast = memo<ToastProps>(({ notification, onHide, onPress, visible }) => {
  const animation = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get("window");
  const colors = useThemeColor();

  useEffect(() => {
    if (visible) {
      if (Platform.OS === "android") {
        Vibration.vibrate(200);
      }

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
      case "message":
        return colors.primary;
      case "mention":
        return colors.notifyMention;
      case "reaction":
        return colors.notifyReaction;
      default:
        return "#333";
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
        <Image
          source={processAvatarUrl(notification?.sender?.avatar)}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text bold type="subtitle" title={`${notification.sender?.name.first} ${notification.sender?.name.last}` || "Notification"} />
          <Text size={14} title={notification?.content !== ' ' ? notification.content?.substring(0, 100) : 'file'} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Main Notification System Component
const NotificationSystem = ({
  children,
}: NotificationSystemProps): JSX.Element => {
  const { user } = useContext(userContext);
  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<{
    [conversationId: string]: number;
  }>({});
  const [lastNotificationSenderId, setLastNotificationSenderId] = useState<
    string[]
  >([]); // Changed to string array
  const notificationQueueRef = useRef<Notification[]>([]);
  const isProcessingRef = useRef(false);
  const maxStoredNotifications = 100;
  const storageKey = "app_notifications";
  const unreadMessagesKey = "unread_messages";
  const pathName = usePathname();
  const pathNameRef = useRef(pathName);

  // Update pathNameRef whenever pathName changes
  useEffect(() => {
    pathNameRef.current = pathName;
  }, [pathName]);

  // Get user ID safely
  const getUserId = useCallback((): string => {
    if (!user || typeof user !== "object") return "";
    const userId = "_id" in user ? user._id : null;
    return typeof userId === "string" ? userId : "";
  }, [user]);

  // Load unread messages from storage
  useEffect(() => {
    const loadUnreadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(unreadMessagesKey);
        if (stored) {
          setUnreadMessages(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading unread messages:", error);
      }
    };
    loadUnreadMessages();
  }, []);

  // Save unread messages to storage whenever they change
  useEffect(() => {
    const saveUnreadMessages = async () => {
      try {
        await AsyncStorage.setItem(
          unreadMessagesKey,
          JSON.stringify(unreadMessages)
        );
      } catch (error) {
        console.error("Error saving unread messages:", error);
      }
    };
    saveUnreadMessages();
  }, [unreadMessages]);

  const markConversationAsRead = useCallback((conversationId: string) => {
    setUnreadMessages((prev) => {
      const newState = { ...prev };
      delete newState[conversationId];
      return newState;
    });
    // Remove the conversationId from lastNotificationSenderId array
    setLastNotificationSenderId((prev) =>
      prev.filter((id) => id !== conversationId)
    );
  }, []);

  // Handle new notification
  const handleNotification = useCallback(async (notification: Notification) => {
    try {
      const currentPathName = pathNameRef.current;
      // Check if we should skip showing toast and adding to lastNotificationSenderId
      const shouldSkipNotification = notification?.conversationId && 
        currentPathName?.split('/')[2] === notification?.conversationId;

      // Store notification in AsyncStorage regardless
      const storedNotifications = await AsyncStorage.getItem(storageKey);
      const notifications = storedNotifications
        ? JSON.parse(storedNotifications)
        : [];

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify([
          notification,
          ...notifications.slice(0, maxStoredNotifications - 1),
        ])
      );

      if (!shouldSkipNotification) {
        // Only update lastNotificationSenderId if we're not skipping
        if (notification?.conversationId) {
          setLastNotificationSenderId((prev) => {
            if (!prev?.includes(notification.conversationId!)) {
              return [...prev, notification.conversationId!];
            }
            return prev;
          });
        }

        // Update unread messages count if it's a message notification
        if (notification.type === "message" && notification.conversationId) {
          const convId = notification.conversationId;
          setUnreadMessages((prev) => ({
            ...prev,
            [convId]: (prev[convId] || 0) + 1,
          }));
        }

        // Only add to queue if we're not skipping
        notificationQueueRef.current.push(notification);
        processNextNotification();
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  }, []);

  // Process notification queue
  const processNextNotification = useCallback(() => {
    if (isProcessingRef.current || notificationQueueRef.current.length === 0)
      return;

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
    setTimeout(processNextNotification, 300);
  }, [processNextNotification]);

  // Handle notification press
  const handleNotificationPress = useCallback((notification: Notification) => {
    if (!notification.conversationId) return; 

    // Remove the conversationId from lastNotificationSenderId
    setLastNotificationSenderId(prev => 
      prev.filter(id => id !== notification.conversationId)
    );
    
    if(notification?.conversationType ==='dm'){
      router.push({
        pathname: "/chat/[id]",
        params: {
          id: notification.conversationId,
          chat: JSON.stringify({
            logo: notification.sender?.avatar || '',
            name: `${notification.sender?.name?.first || ''} ${notification.sender?.name?.last || ''}`,
            type: notification.conversationType || '',
            id: notification.conversationId,
          }),
        },
      });
    }
  }, []);

  // Handle message notification from socket
  const onMessageNotification = useCallback(
    ({
      message,
      conversationType,
      conversationId,
      sender,
    }: MessageNotification) => {
      const notification: Notification = {
        id: String(message.id || message._id || `msg_${Date.now()}_${Math.random()}`),
        type: "message",
        content: message.content || "",
        sender,
        conversationId,
        conversationType,
        timestamp:
          message.timestamp || message.createdAt || new Date().toISOString(),
        read: false,
      };
      handleNotification(notification);
    },
    [handleNotification]
  );

  // Initialize socket connection for notifications
  const { isSocketConnected } = useSocket(
    "notifications",
    "global",
    getUserId(),
    () => { }, // onNewMessage
    () => { }, // onMessagesReceived
    () => { }, // onMessagesSeen
    () => { }, // onJoinSuccess
    onMessageNotification // Pass the notification handler
  );

  useEffect(() => {
    const loadSavedNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem(storageKey);
        if (storedNotifications) {
          const notifications = JSON.parse(storedNotifications);
          // Process unread notifications
          notifications.forEach((notification: Notification) => {
            if (
              !notification.read &&
              notification.type === "message" &&
              notification.conversationId
            ) {
              const convId = notification.conversationId;
              setUnreadMessages((prev) => ({
                ...prev,
                [convId]: (prev[convId] || 0) + 1, 
              }));

              setLastNotificationSenderId((prev) => {
                if (!prev?.includes(convId)) {
                  return [...prev, convId];
                }
                return prev;
              });
            }
          });
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    const userId = getUserId();
    if (userId) {
      loadSavedNotifications();
    }
  }, [getUserId]);

  const contextValue = {
    unreadMessages,
    hasUnreadMessages: Object.keys(unreadMessages).length > 0,
    markConversationAsRead,
    lastNotificationSenderId,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Toast
        notification={activeNotification}
        visible={isVisible}
        onHide={hideToast}
        onPress={handleNotificationPress}
      />
    </NotificationContext.Provider>
  );
};

// Styles
const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 25,
    left: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  message: {
    color: "#fff",
    fontSize: 14,
  },
});

export default memo(NotificationSystem);
