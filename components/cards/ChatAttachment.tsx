import Icon from '@blocks/Icon';
import Text from '@blocks/Text';
import IconModel from '@model/icon';
import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native'

type ChatAttachmentProps = {
    icon: IconModel
    title: string,
    onPress: () => void
}

const ChatAttachment = ({ icon, title, onPress }: ChatAttachmentProps) => {
    console.log("ChatAttachment");
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Icon  type='complex' icon={icon} />
            <Text type='small' title={title} />
        </Pressable>
    )
}
export default memo(ChatAttachment)

const styles = StyleSheet.create({
    container: { gap: 5, alignItems: 'center' }
})