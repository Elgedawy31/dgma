import { useThemeColor } from '@hooks/useThemeColor';
import { memo, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type ContainerProps = {
    row?: boolean;
    style?: ViewStyle;
    children: ReactNode;
    gap?: 4 | 8 | 10 | 12 | 14 | 16;
    radius?: 4 | 8 | 10 | 12 | 14 | 16 | 20;
    align?: 'start' | 'end' | 'center' | 'stretch';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
}

const directionsMap = {
    start: 'flex-start', end: 'flex-end',
    stretch: 'stretch', center: 'center',
    between: 'space-between', around: 'space-around', evenly: 'space-evenly',
} as const;

function Container({
    style, children, align, justify,
    gap = 8, radius = 8, row = false
}: ContainerProps) {
    const colors = useThemeColor();
    return (
        <View style={[
            styles.container,
            { gap, borderRadius: radius,backgroundColor: colors.card },
            row ?
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
                : { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' },
            align && { alignItems: directionsMap[align] },
            justify && { justifyContent: directionsMap[justify] },
            style,
        ]}
        >
            {children}
        </View>
    );
}
export default memo(Container);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4, },
    },
});