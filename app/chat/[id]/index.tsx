import Text from '@blocks/Text';
import Icon from '@blocks/Icon';
import AppBar from '@blocks/AppBar'
import ImageAvatar from '@blocks/ImageAvatar';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeColor } from '@hooks/useThemeColor';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ChatAttachment from '@cards/ChatAttachment';
import TextInputField from '@ui/TextInputField'
import { useForm } from 'react-hook-form';
import MessageCard from '@cards/MessageCard';
import { userContext } from '@UserContext';
import { SERVER_URL } from '@env';
// import { chatData } from '@data/chat';
import useSocket from '@hooks/useSocket';

interface MessageModel {
    content: string;
    receiverId?: string;
    attachments?: string[];
    type: 'channel' | 'group' | 'dm';
}

function Chat() {

    // const [users] = useState({ sender: '6703bdd588dff50af4b25e18', receiver: '66e2afe3a76d0d78d527f6eb' })
    const socket = useSocket();
    const colors = useThemeColor();
    const flatListRef = useRef(null);
    const { user: { id: signedUserID, avatar: userAvatar } } = useContext(userContext);
    const [expand, setExpand] = useState(false);
    const { id: conversationId, logo: conversationLogo, name: conversationName, type: conversationType }
        : { id: string, logo: string, name: string, type: string } = JSON.parse(useLocalSearchParams<{ id: string, chat: string }>().chat);
    const [messages, setMessages] = useState<{ id: string, msg: string, receiver?: boolean }[]>([]);
    const { control, handleSubmit, formState: { errors }, watch, reset } =
        useForm<{ msg: string }>({ defaultValues: { msg: "" }, });

    const sendMessage = useCallback(() => {
        console.log(watch('msg'));
        socket?.emit("sendMessage", {
            type: conversationType,
            content: watch('msg'),
            receiverId: conversationId.split('_').slice(1).filter((id: string) => id.toLowerCase() !== signedUserID.toLowerCase()).join(''),
        });
        setMessages(prevMessages => [...prevMessages, { id: Date.now().toString(), msg: watch('msg'), receiver: false }]);
        reset({ msg: '' });

        // sendMessageToSocket({
        //     type: 'dm',
        //     content: watch('msg'),
        //     receiverId: users.receiver,
        // })
        // setChat(prevChat => [...prevChat, { id: Date.now().toString(), msg: watch('msg'), receiver: false }]);
    }, [socket, watch, reset]);

    useEffect(() => {
        if (socket) {
            const opt = socket["_opts"];
            console.log(`Socket Connected on: http://${opt["hostname"]}${opt["path"]}:${opt["port"]}`);
        } else {
            console.log("Socket is not connected");
        }
    }, [socket]);


    useEffect(() => {
        socket?.on("connect", () => {
            const receiver = conversationId.split('_')
                .slice(1).filter((id: string) => id.toLowerCase() !== signedUserID.toLowerCase())
                .join('');
            console.log("\n\n\n\n\nconnected");
            console.log("SignedUser", signedUserID);
            console.log("ConversationId", conversationId);
            console.log("Receiver", receiver);
            console.log("is Conversation Has Receiver", conversationId.includes(receiver));
            console.log("is Conversation Has Signed", conversationId.includes(signedUserID));
        });

        // Handle the received message
        socket?.on("newMessage", (message) => {
            console.log('new message', message);
            // dispatch(addNewMessage(message));
        });

        // Handle messages received
        socket?.on("messages", (data) => {
            console.log('messages', data);
            // dispatch(addMessages
        });

        return () => {
            socket?.off("connect");
            socket?.off("newMessage");
            socket?.off("messages");
        };

    });


    useEffect(() => setExpand(false), [watch('msg')]);

    return (
        <View style={{ flex: 1 }}>
            <AppBar
                leading='back'
                title={
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {/* onPress={() => router.push({ pathname: '/chat/[id]/attachments', params: { id, user: JSON.stringify({ user: { avatar, name: { first, last } } }) } })}  > */}
                        <ImageAvatar type='avatar' url={conversationLogo} />
                        <Text type='subtitle' title={conversationName} />
                    </Pressable>
                }
                action={
                    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                        <Icon iconColor={colors.text} icon='call' onPress={() => alert('Voice Call')} />
                        <Icon iconColor={colors.text} icon='video' size={28} onPress={() => alert('Video Call')} />
                    </View>
                }
            />

            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <FlatList ref={flatListRef}
                    data={[...messages]} inverted
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, paddingHorizontal: 8 }}
                    contentContainerStyle={{ flexDirection: 'column-reverse' }}
                    renderItem={({ item, index }) => (
                        <MessageCard key={item.id} msg={item.msg}
                            isSameNextUser={item.receiver === messages[index + 1]?.receiver}
                            receiver={item.receiver} avatar={item.receiver ? conversationLogo : userAvatar || ''}
                        />
                    )}
                />

                <View style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 30, backgroundColor: colors.card }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        {!watch('msg') && <Icon icon='add' iconColor={colors.text} onPress={() => setExpand(true)} />}
                        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 12, justifyContent: 'space-between', alignItems: 'center', borderColor: colors.text, borderWidth: 1, borderRadius: 18, marginHorizontal: 12 }}>
                            <View style={{ flex: 1 }}>
                                <TextInputField noLabel noBorder name='msg' placeholder='write your message...' control={control} />
                            </View>
                            {!watch('msg') && <Icon iconColor={colors.text} icon='camera' onPress={() => alert('Camera')} />}
                        </View>
                        <Icon icon='send'
                            onPress={() => sendMessage()}
                            iconColor={watch('msg') ? colors.white : colors.text}
                            bgColor={watch('msg') && colors.primary}
                            type={watch('msg') ? 'complex' : 'simple'}
                        />
                    </View>
                    {!watch('msg') && expand && <View style={{ flexDirection: 'row', gap: 20 }}>
                        <ChatAttachment icon='camera' title='Camera' onPress={() => { alert('Camera'); setExpand(false) }} />
                        <ChatAttachment icon='document' title='Document' onPress={() => { alert('Document'); setExpand(false) }} />
                        <ChatAttachment icon='image' title='Image' onPress={() => { alert('Image'); setExpand(false) }} />
                    </View>}
                </View>
            </View>
        </View>
    )
}
export default memo(Chat)
const styles = StyleSheet.create({})