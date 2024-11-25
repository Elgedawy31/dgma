import { FlatList, View, } from 'react-native'
import { memo, useState } from 'react'
import AppBar from '@blocks/AppBar'
import Text from '@blocks/Text'
import { usersData } from '@data/users'
import CallCard from '@cards/CallCard'
import Icon from '@blocks/Icon'
import { useThemeColor } from '@hooks/useThemeColor'

const MeetingCallView = () => {
    const colors = useThemeColor();
    return (
        <View style={{ flex: 1 , backgroundColor:colors.background }}>
            <AppBar
                leading='back'
                title={<View>
                    <Text type='subtitle' title='Meeting' />
                    <Text type='small' title='Meeting Details' />
                </View>}
            />
            <View style={{ flex: 1, paddingLeft: 16 }}>
                <FlatList
                    numColumns={2}
                    data={[...usersData, ...usersData, ...usersData, ...usersData, ...usersData]}
                    renderItem={({ item, index }) => <CallCard user={{ name: { first: item.name.first, last: item.name.last }, avatar: item.avatar }} />}
                    keyExtractor={(item, index) => item._id! + index.toString()}
                    style={{ flex: 1, }}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.primary, height: 60, paddingHorizontal: 24, paddingVertical: 8 }}>
                <Icon size={28} icon='mic' iconColor='white' onPress={() => alert('Open Mic')} />
                <Icon size={28} icon='video' iconColor='white' onPress={() => alert('Open Camera')} />
                <Icon size={28} gap={1.75} type='complex' icon='call' bgColor='red' iconColor='white' onPress={() => alert('End Call')} />
                <Icon size={28} icon='share-screen' iconColor='white' onPress={() => alert('Share Screen')} />
                <Icon size={28} icon='send' iconColor='white' onPress={() => alert('Send Message')} />
            </View>
        </View>
    )
}

export default memo(MeetingCallView)