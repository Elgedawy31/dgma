import { memo, ReactNode, useCallback } from 'react'
import IconModel from '@model/icon'
import { Pressable, StyleSheet, View } from 'react-native'
import * as IconLibraries from '@expo/vector-icons'
import { useThemeColor } from '@hooks/useThemeColor'



type IconMapping = {
    [K in IconModel]: {
        library: keyof typeof IconLibraries;
        name: string;
    }
}

const iconMapping: IconMapping = {
    'add': { library: 'Ionicons', name: 'add' },
    'call': { library: 'Feather', name: 'phone' },
    'image': { library: 'Ionicons', name: 'image' },
    'close': { library: 'Ionicons', name: 'close' },
    'camera': { library: 'Feather', name: 'camera' },
    'search': { library: 'Ionicons', name: 'search' },
    'back': { library: 'Ionicons', name: 'chevron-back' },
    'show-password': { library: 'Ionicons', name: 'eye' },
    'seen': { library: 'Ionicons', name: 'checkmark-done' },
    'person': { library: 'Ionicons', name: 'person-sharp' },
    'hide-password': { library: 'Ionicons', name: 'eye-off' },
    'video': { library: 'Ionicons', name: 'videocam-outline' },
    'send': { library: 'MaterialCommunityIcons', name: 'send' },
    'share-screen': { library: 'Ionicons', name: 'share-outline' },
    'mic': { library: 'MaterialCommunityIcons', name: 'microphone' },
    'document': { library: 'Ionicons', name: 'document-text-outline' },
    'mic-off': { library: 'MaterialCommunityIcons', name: 'microphone-off' },
    'calendar-number': { library: 'Ionicons', name: 'calendar-number-outline' },
    'edit-img': { library: 'MaterialCommunityIcons', name: 'image-edit-outline' },

}

type IconProps = {
    style?: any,
    icon: IconModel;
    black?: boolean;
    bgColor?: string;
    gap?: number;
    iconColor?: string;
    onPress?: () => void;
    disabledPress?: boolean;
    type?: 'simple' | 'complex';
    size?: 18 | 24 | 26 | 28 | 30 | 32 | 34;
}

function Icon({
    iconColor, bgColor, style,
    icon, onPress, black, disabledPress,
    size = 24, type = 'simple', gap = 2,
}: IconProps) {
    const colors = useThemeColor();
    const iconConfig = iconMapping[icon];
    const IconComponent = IconLibraries[iconMapping[icon].library] as any;

    return (
        disabledPress ?
            <View style={[styles[type],
            type === 'complex' && { width: size * gap, borderRadius: (size * gap) / 2, backgroundColor: colors.secondary },
            bgColor && { backgroundColor: bgColor },
                style]}
            >
                <IconComponent
                    size={size} name={iconConfig.name}
                    color={iconColor || (black && 'black') || (type === 'simple' ? 'black' : colors.primary)}
                />
            </View>
            :
            <Pressable onPress={onPress} style={[styles[type],
            type === 'complex' && { width: size * gap, borderRadius: (size * gap) / 2, backgroundColor: colors.secondary },
            bgColor && { backgroundColor: bgColor }, style]}
            >
                <IconComponent
                    size={size} name={iconConfig.name}
                    color={iconColor || (black && 'black') || (type === 'simple' ? 'black' : colors.primary)}
                />
            </Pressable>
    )

}

export default memo(Icon)

const styles = StyleSheet.create({
    simple: {},
    complex: {
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
