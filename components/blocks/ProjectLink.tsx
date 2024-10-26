import { StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import Text from './Text'
import Container from '@container';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';

type LinkType = {
    label: string,
    type: 'figma' | 'github' | 'website'
}

function ProjectLink({ label, type }: LinkType) {
    const colors = useThemeColor();
    const handleText =
        () =>
            label.length > 20 ?
                label.slice(0, 14) + '.....'
                : label;

    return (
        <Container row justify='center' gap={8} style={styles.container}>
            {type === 'figma' && <Feather name="figma" size={24} color={colors.primary} />}
            {type === 'github' && <AntDesign name="github" size={24} color={colors.primary} />}
            {type === 'website' && <AntDesign name="earth" size={24} color={colors.primary} />}
            <Text underline type='label' title={`${handleText()}`} />
        </Container>
    )
}
export default memo(ProjectLink)

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    }
})