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
import { chatData } from '@data/chat';
import useSocket from '@hooks/useSocket';

interface MessageModel {
    content: string;
    receiverId?: string;
    attachments?: string[];
    type: 'channel' | 'group' | 'dm';
}

function Chat() {

    const [users] = useState({ sender: '6703bdd588dff50af4b25e18', receiver: '66e2afe3a76d0d78d527f6eb' })
    const socket = useSocket();
    const colors = useThemeColor();
    const flatListRef = useRef(null);
    const { user: { avatar: userAvatar } } = useContext(userContext);
    const [expand, setExpand] = useState(false);
    const { id, user } = useLocalSearchParams<{ id: string, user: string }>();
    const { user: { avatar, name: { first, last } } } = JSON.parse(user);
    const [chat, setChat] = useState<{ id: string, msg: string, receiver?: boolean }[]>(chatData);
    const { control, handleSubmit, formState: { errors }, watch, reset } =
        useForm<{ msg: string }>({ defaultValues: { msg: "" }, });

    const sendMessage = useCallback(() => {
        console.log(watch('msg'));
        socket?.emit("sendMessage", {
            type: 'dm',
            content: watch('msg'),
            receiverId: users.receiver,
        });
        reset({ msg: '' });

        // sendMessageToSocket({
        //     type: 'dm',
        //     content: watch('msg'),
        //     receiverId: users.receiver,
        // })
        // setChat(prevChat => [...prevChat, { id: Date.now().toString(), msg: watch('msg'), receiver: false }]);
    }, [socket, watch, reset]);
    useEffect(() => {
        socket?.on("connect", () => {
            console.log("connected");
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

    }, [socket]);
    useEffect(() => setExpand(false), [watch('msg')]);

    return (
        <View style={{ flex: 1 }}>
            <AppBar
                leading='back'
                title={
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                        onPress={() => router.push({ pathname: '/chat/[id]/attachments', params: { id, user: JSON.stringify({ user: { avatar, name: { first, last } } }) } })}  >
                        <ImageAvatar type='avatar' url={avatar} />
                        <Text type='subtitle' title={`${first} ${last}`} />
                    </Pressable>
                }
                action={
                    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                        <Icon icon='call' onPress={() => alert('Voice Call')} />
                        <Icon icon='video' size={28} onPress={() => alert('Video Call')} />
                    </View>
                }
            />

            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <FlatList ref={flatListRef}
                    data={[...chat]} inverted
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, paddingHorizontal: 8 }}
                    contentContainerStyle={{ flexDirection: 'column-reverse' }}
                    renderItem={({ item, index }) => (
                        <MessageCard key={item.id} msg={item.msg}
                            isSameNextUser={item.receiver === chat[index + 1]?.receiver}
                            receiver={item.receiver} avatar={item.receiver ? avatar : userAvatar}
                        />
                    )}
                />

                <View style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 30, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        {!watch('msg') && <Icon icon='add' onPress={() => setExpand(true)} />}
                        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 12, justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background, borderRadius: 18, marginHorizontal: 12 }}>
                            <View style={{ flex: 1 }}>
                                <TextInputField noLabel noBorder name='msg' control={control} />
                            </View>
                            {!watch('msg') && <Icon icon='camera' onPress={() => alert('Camera')} />}
                        </View>
                        <Icon icon='send'
                            onPress={() => sendMessage()}
                            iconColor={watch('msg') && colors.white}
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