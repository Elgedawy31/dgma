import React, { useState } from 'react';
import { StyleSheet, View, TextInput, KeyboardTypeOptions } from 'react-native';



export const OTP = ({ }) => {
    const [code, setCode] = useState(['', '', '', ''])
    const [current, setCurrent] = useState(0)

    const handleOnTextChange = (text: string, index: number) => {
        console.log(text, index);
        setCode(code.map((_, i) => i === index ? text : _))
        setCurrent(current + 1)
    };

    return (
        <View style={styles.container}>
            {code.map((value, index) => (
                <TextInput
                    key={index}
                    maxLength={1}
                    selectTextOnFocus
                    contextMenuHidden
                    value={value || ''}
                    style={styles.input}
                    keyboardType='decimal-pad'
                    focusable={index === current}
                    onChangeText={text => handleOnTextChange(text, index)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    input: {
        width: 48,
        height: 48,
        margin: 10,
        borderWidth: 1,
        borderColor: '#002D75',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
    },
});

export default OTP;
