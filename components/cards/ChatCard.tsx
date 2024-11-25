import Text from '@blocks/Text'
import ChatModal from '@model/chat'
import { router } from 'expo-router'
import ImageAvatar from '@blocks/ImageAvatar'
import React, { memo, useCallback, useContext } from 'react'
import { Pressable, StyleSheet, View, TextStyle } from 'react-native'
import { NotificationContext, NotificationContextType } from '@components/NotificationSystem'
import { UserBase, ChatType } from '@model/types'

interface ChatCardProps {
    _id: string;
    name: string;
    logo?: string | null;  // Made optional to match ChatModal
    photo?: string | null;  // Added to match ChatModal
    type: ChatType;
    receivers: UserBase[];
}


function ChatCard({ _id, name, logo, photo, type, receivers }: ChatCardProps) {
    const { lastNotificationSenderId, markConversationAsRead } = useContext<NotificationContextType>(NotificationContext);
    
    // Use photo as fallback for logo
    const avatarUrl = logo;
    
    // Check for new message based on chat type
    const hasNewMessage = Boolean(
        lastNotificationSenderId && lastNotificationSenderId?.includes(_id)
    );

    const onPress = useCallback(() => {
        // If this chat has the notification, clear it
        if (hasNewMessage) {
            markConversationAsRead(_id);
        }

        router.push({
            pathname: '/chat/[id]',
            params: { id: _id, chat: JSON.stringify({ logo, name, type, id: _id }) }
        })
    }, [hasNewMessage, _id, logo, name, type, markConversationAsRead]);
    return (
        <Pressable onPress={onPress}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
                <View style={{ position: 'relative' }}>
                    <ImageAvatar size={50} type='avatar' url={avatarUrl || null} />
                    {hasNewMessage && (
                        <View style={[
                            styles.notificationDot,
                            type === 'dm' ? styles.dmDot : styles.groupDot
                        ]} />
                    )}
                </View>
                <View style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E1E1E1' }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 8 }}>
                        <Text type='subtitle' title={name} />
                        {hasNewMessage && type === 'group' && (
                            <View>
                                <Text 
                                    type='body' 
                                    title='New message'
                                    style={styles.newMessageText as TextStyle}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

export default memo(ChatCard)

const styles = StyleSheet.create({
    notificationDot: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#fff'
    },
    dmDot: {
        backgroundColor: '#2196F3'  // Blue for direct messages
    },
    groupDot: {
        backgroundColor: '#4CAF50'  // Green for group messages
    },
    newMessageText: {
        fontSize: 12,
        color: '#4CAF50'  // Green text for group message indicator
    }
});
