import { memo } from 'react';
import ChatCard from '@cards/ChatCard';
import { usersData } from '@data/users';
import { FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

function AllChats() {
    return (
        <FlatList showsVerticalScrollIndicator={false}
            data={[...usersData, ...usersData, ...usersData]}
            renderItem={({ item, index }) => <ChatCard msgID={`ChatID-${index}`} user={item} />}
            keyExtractor={(item, index) => item._id! + index.toString()}
        />
    )
}
export default memo(AllChats)
const styles = StyleSheet.create({})