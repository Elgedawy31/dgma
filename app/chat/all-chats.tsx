import { memo } from 'react';
import ChatCard from '@cards/ChatCard';
import { FlatList, StyleSheet } from 'react-native';
import { useChatContext } from '@context/ChatContext';

function AllChats() {
    const { chats } = useChatContext();

    return (
        <FlatList 
            showsVerticalScrollIndicator={false}
            data={chats}
            renderItem={({ item }) => (
                <ChatCard 
                    _id={item._id}
                    name={item.name}
                    logo={item.logo}
                    type={item.type}
                    receivers={item.receivers}
                />
            )}
            keyExtractor={(item) => item._id}
        />
    )
}

export default memo(AllChats);

const styles = StyleSheet.create({});
