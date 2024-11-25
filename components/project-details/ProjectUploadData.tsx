import { View, ActivityIndicator } from 'react-native'
import Text from '@blocks/Text'
import Dot from '@ui/dot'
import { useThemeColor } from '@hooks/useThemeColor'
import { memo } from 'react'

type UploadStep = {
    index: 0 | 1 | 2;
    msg: string;
}

type ProcessStep = {
    id: 0 | 1 | 2;
    label: string;
}

interface ProjectUploadDataProps {
    step: UploadStep | null;
    mode: 'create' | 'update';
}

const CREATE_PROCESS: ProcessStep[] = [
    { id: 0, label: 'Uploading Logo and Attachments' },
    { id: 1, label: 'Creating Project' },
    { id: 2, label: 'Validating Project' }
];

const UPDATE_PROCESS: ProcessStep[] = [
    { id: 0, label: 'Checking for Files Updates' },
    { id: 1, label: 'Updating Project' },
    { id: 2, label: 'Validating Project' }
];

const ProjectUploadData = ({ step, mode }: ProjectUploadDataProps) => {
    const colors = useThemeColor();
    const steps = mode === 'create' ? CREATE_PROCESS : UPDATE_PROCESS;

    return (
        <View style={{
            width: '100%',
            flex: .25,
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 16,
            paddingHorizontal: 20
        }}>
            {step && (
                <Text
                    type='subtitle'
                    color={colors.primary}
                    title={`Current Step: ${step.msg}`}
                />
            )}

            {steps.map(({ id, label }) => (
                <View key={id} style={{
                    flexDirection: 'row',
                    gap: 16,
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Dot selected={step ? step.index >= id : false} />
                    <Text
                        bold
                        type='subtitle'
                        title={step?.index === id ? step.msg : label}
                        color={step?.index === id ? colors.primary : colors.text}
                    />
                    {step?.index === id && (
                        <ActivityIndicator color={colors.primary} />
                    )}
                </View>
            ))}
        </View>
    );
};

export default memo(ProjectUploadData);