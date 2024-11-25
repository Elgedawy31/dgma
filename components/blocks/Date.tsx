import { StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Text from '@blocks/Text'
import { useThemeColor } from '@hooks/useThemeColor'

type DateProps = {
    icon?: boolean
    type: 'start' | 'end',
    size?: 24 | 20 | 18 | 16 | 12,
    date?: string | undefined,
}
function Date({ date, type, size = 16, icon = true }: DateProps) {
    const colors = useThemeColor();
    return (
        <View style={styles.conDate}>
            {icon && <Ionicons name="calendar-clear-outline" size={size} color={type === 'start' ? colors.primary : colors.cancel} />}
            <Text type='small' size={size > 24 ? 16 : size > 20 ? 16 : 12} color={type === 'start' ? colors.primary : colors.cancel} title={date || ''} />
        </View>
    )
}
export default memo(Date)

const styles = StyleSheet.create({
    conDate: {
        gap: 5,
        alignItems: 'center',
        flexDirection: 'row',
    },
})