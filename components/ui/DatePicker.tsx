import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { memo, useCallback, useState } from 'react'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TextInputField from '@ui/TextInputField';
import Text from '@blocks/Text';
import { useThemeColor } from '@hooks/useThemeColor';
import Icon from '@blocks/Icon';

type DatePickerProps = {
    value?: string;
    label: string;
    display?: | 'spinner' | 'calendar' | 'clock';
    mode?: 'countdown' | 'date' | 'datetime' | 'time';
    onChange: (d?: Date) => void;
}
const DatePicker = ({
    label, onChange,
    value,
    mode = 'date', display = 'spinner',
}: DatePickerProps) => {
    const colors = useThemeColor()
    const [date, setDate] = useState<Date>(value ? new Date(value) : new Date());
    const [showPicker, setShowPicker] = useState(false);
    const onChangeText = useCallback((text: string) => {
        setDate(new Date(text));
    }, [])
    const onDateChange = useCallback((e: DateTimePickerEvent, d?: Date) => {
        const type = e.type;
        if (type === 'set') { setDate(d!); onChange(d); }
        setShowPicker(false);
    }, [])
    return (
        <View style={styles.container}>
            <Text color={colors.primary} type='label' title={label} />
            <Pressable onPress={() => { console.log("Press"); if (!showPicker) setShowPicker(true) }}>
                <TextInput
                    value={date.toDateString()}
                    editable={false}
                    style={[
                        styles.input,

                        { width: '100%', flex: 1, textTransform: 'capitalize', textAlign: 'left' },
                        { borderColor: colors.primary, backgroundColor: colors.card }
                    ]}
                    placeholder={`Enter ${label}`}
                    onChangeText={onChangeText}
                />
            </Pressable>


            {
                showPicker && <DateTimePicker
                    mode={mode}
                    value={date}
                    display={display}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                />
            }
        </View>
    )
}

export default memo(DatePicker)

const styles = StyleSheet.create({
    container: {
        gap: 8,
        flex: 1, display: "flex",
    },
    label: {
        margin: 0,
        padding: 0,
        fontSize: 14,
        lineHeight: 16,
        fontWeight: '500',
        fontStyle: 'normal',
    },
    input: {
        flex: 1,
        minHeight: 48,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
});