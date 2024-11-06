import { View } from 'react-native'
import { memo, ReactElement } from 'react'
type StackUIProps = {
    base: ReactElement,
    sec: ReactElement,
    position: {
        vertical: 'bottom' | 'top'
        horizontal: 'left' | 'right'
    },
    value: {
        vertical: number,
        horizontal: number
    }
}

function StackUI({ base, sec, position: { vertical, horizontal }, value: { vertical: v, horizontal: h } }: StackUIProps) {
    return (
        <View style={{ position: 'relative' }}>
            {base}
            <View style={{ position: 'absolute', [vertical]: v, [horizontal]: h }}>
                {sec}
            </View>
        </View>
    )
}
export default memo(StackUI)