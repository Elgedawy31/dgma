import { View } from 'react-native'
import { memo } from 'react'
import Text from '@blocks/Text'
import Button from '@ui/Button'
import Icon from '@blocks/Icon'
import { useThemeColor } from '@hooks/useThemeColor'
import { usersData } from '@data/users'
import UserCard from '@cards/UserCard'
import { router } from 'expo-router'

const MeetingDetails = ({ onJoinPress }: { onJoinPress: () => void }) => {
    const colors = useThemeColor();
    return (
        <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 20, gap: 16 }}>
            <View style={{ gap: 24 }}>
                <View style={{ gap: 8, alignItems: 'center' }}>
                    <Text type='title' title='MeetingDetails' />
                    <Text align='justify' title='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis facere labore pariatur nulla error porro sit aspernatur! Hic quidem dolorum, exercitationem explicabo vero architecto laboriosam necessitatibus blanditiis sed veritatis. ' />
                </View>
                <View style={{ paddingHorizontal: 12, gap: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
                        <Icon icon='person' size={32} iconColor={colors.primary} />
                        <View style={{ alignItems: 'center' }}>
                            <Text type='label' title='Host' />
                            <Text type='subtitle' title='Mr. Dustin' />
                        </View>
                    </View>
                    <Button label='Join Meeting' type='primary' onPress={onJoinPress} />
                </View>
                <View style={{ gap: 8 }}>
                    <Text type='title' title='Guests' />
                    <View style={{ gap: 16 }}>
                        {usersData.map((user) => <UserCard key={user._id} user={user} />)}
                    </View>
                </View>
            </View>
        </View>
    )
}


export default memo(MeetingDetails)