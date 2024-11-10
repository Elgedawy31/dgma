import { memo } from 'react'
import Text from '@blocks/Text'
import ImageAvatar from '@blocks/ImageAvatar'
import { StyleSheet, View } from 'react-native'
import { ProjectMemberModel } from '@model/project'
import UserModel from '@model/user'

type UserCardModel = {
    user: UserModel | ProjectMemberModel;
}

function UserCard({ user: { avatar, name: { first, last } } }: UserCardModel) {
    return (
        <View style={styles.container}>
            <ImageAvatar url={avatar || 'https://mir-s3-cdn-cf.behance.net/user/276/8051fa194165537.614d528de211b.jpg'} type="avatar" />
            <View style={{ justifyContent: 'space-between' }}>
                <Text type="subtitle" capitalized title={`${first} ${last}`} />
                {/* <Text type="details" title={specialty} /> */}
            </View>
        </View>
    )
}
export default memo(UserCard)
const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', gap: 8 }
})