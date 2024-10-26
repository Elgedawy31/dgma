import ImageAvatar from '@blocks/ImageAvatar';
import Text from '@blocks/Text'
import ChatCard from '@cards/ChatCard';
import { usersData } from '@data/users';
import { useThemeColor } from '@hooks/useThemeColor'
import UserModel from '@model/user';
import Button  from '@ui/Button';
import { Link, router } from 'expo-router';
import { memo } from 'react'
import { FlatList, View } from 'react-native'

const ChannelItem = memo(({ item }: { item: string }) => (
  <View style={{ gap: 2, alignItems: 'center', paddingLeft: 12 }}>
    <ImageAvatar size={100} type='project' url='https://th.bing.com/th/id/OIP.JRrDtLz53jNL0MAtrOWRHwHaEK?w=321&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7' />
    <Text type='subtitle' title='Channel' />
  </View>
));



function Messaging() {
  const colors = useThemeColor();
  const channelData = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 8 }}>
      <View style={{ marginBottom: 20 }}>
        <View style={{ paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
          <Text type='title' title='Channels' />
          <Button type='text' label='see all' />
        </View>
        <FlatList
          horizontal
          data={channelData}
          renderItem={({ item }) => <ChannelItem item={item.id.toString()} />}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
          <Text type='title' title='Chat' />
          <Button type='text' label='see all' onPress={() => router.push('/chat/all-chats')} />
        </View>
        <FlatList
          data={[...usersData, ...usersData, ...usersData]} showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <ChatCard msgID={`ChatID-${index}`} user={item} />}
          keyExtractor={(item, index) => item._id! + index.toString()}
        />
      </View>
    </View>
  )
}

export default memo(Messaging)