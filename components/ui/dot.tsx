import { useThemeColor } from '@hooks/useThemeColor';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Dot = ({ selected }: { selected: boolean }) => {
    const colors = useThemeColor();
    return (
        <View
            style={[
                styles.dot,
                selected && styles.selected,
                { backgroundColor: selected ? colors.primary : colors.gray },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 1,
        backgroundColor: 'gray',
    },
    selected: {
        width: 25,
        height: 10.5,
        marginHorizontal: .5,
        backgroundColor: '#002D75',
    }
});

export default Dot;
