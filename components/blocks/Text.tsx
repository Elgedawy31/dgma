import { useThemeColor } from '@hooks/useThemeColor'
import { ThemeContext } from '@ThemeContext';
import { memo, useContext } from 'react';
import { ViewStyle, StyleSheet, Text as TextBase } from 'react-native'

type TextProps = {
    color?: any,
    title?: string |any,
    bold?: boolean,
    italic?: boolean,
    style?: ViewStyle,
    underline?: true | false,
    capitalized?: true | false,
    size?: 20 | 16 | 14 | 12 | 10,
    align?: 'start' | 'end' | 'center' | 'justify',
    type?: 'title' | 'subtitle' | 'body' | 'label' | 'details' | 'small' | 'x-small' | 'error' ,
    numberOfLines?:number | undefined
    
}

function Text({
    color, bold, size, italic = false,
    underline = false, capitalized = true,
    type = 'body', title = 'Text', align ,
    numberOfLines= undefined
}: TextProps) {
    const colors = useThemeColor();
    return (
        <TextBase
        
        numberOfLines={numberOfLines ? numberOfLines: undefined}
            style={[
                {
                    fontFamily: 'Inter',
                    fontStyle: italic ? 'italic' : 'normal',
                    color: type === 'body' ? colors.body : colors.text
                },
                styles[type],
                color && { color },
                size && { fontSize: size },
                { textAlign: align || 'left' },
                bold && { fontWeight: 700 },
                {
                    textTransform: capitalized ? 'capitalize' : 'none',
                    textDecorationLine: underline ? 'underline' : 'none',
                },
            ]}
        >
            {title}
        </TextBase >
    )
}
export default memo(Text)

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    details: {
        fontSize: 14,
        fontWeight: '400',
    },
    small: {
        fontSize: 12,
        fontWeight: '400',
    },
    'x-small': {
        fontSize: 10,
        fontWeight: '400',
    },
    error: {
        color: 'red',
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'italic',
    }
})