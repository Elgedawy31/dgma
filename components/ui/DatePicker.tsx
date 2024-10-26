import { StyleSheet, TextInput, View } from 'react-native'
import { memo, useCallback, useState } from 'react'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TextInputField from '@ui/TextInputField';
import Text from '@blocks/Text';
import { useThemeColor } from '@hooks/useThemeColor';
import Icon from '@blocks/Icon';

type DatePickerProps = {
    value?: Date;
    label: string;
    display?: | 'spinner' | 'calendar' | 'clock';
    mode?: 'countdown' | 'date' | 'datetime' | 'time';
    onChange: (d?: Date) => void;
}
const DatePicker = ({
    label, onChange,
    value = new Date(),
    mode = 'date', display = 'spinner',
}: DatePickerProps) => {
    const colors = useThemeColor()
    const [date, setDate] = useState(value);
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
            <Text type='label' title={label} />
            <View style={{ flexDirection: "row", position: "relative", alignItems: "center" }}>
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
                <Icon icon='calendar-number'
                    style={{ position: "absolute", right: 10 }}
                    onPress={() => { if (!showPicker) setShowPicker(true) }}
                />


            </View>
            {
                showPicker && <DateTimePicker
                    mode={mode}
                    value={value}
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