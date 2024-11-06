import Dot from '@ui/dot'
import { memo } from 'react'
import Text from '@blocks/Text'
import { useThemeColor } from '@hooks/useThemeColor'
import { ActivityIndicator, View } from 'react-native'

type ProjectUploadDataProps = {
    step: 0 | 1 | 2
}
const uploadProcess = [
    { id: "logo", label: 'Upload Logo ', success: 'Logo is Uploaded Successfully' },
    { id: "attachments", label: 'Uploading Attachments', success: 'Attachments is Uploaded Successfully' },
    { id: "project", label: 'Creating Project', success: 'Project is Created Successfully' }]

const ProjectUploadData = ({ step }: ProjectUploadDataProps) => {
    const colors = useThemeColor();
    return (
        <View style={{ width: '100%', flex: .25, justifyContent: 'center', alignItems: 'flex-start', gap: 16, paddingHorizontal: 20 }}>
            <Text title={`Current Step is: ${step}`} />
            {uploadProcess.map(({ id, label, }, index) => (
                <View key={id} style={{ flexDirection: 'row', gap: 16, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Dot selected={true} />
                    <Text bold type='subtitle' title={label} />
                    {step === index && <ActivityIndicator color={colors.primary} />}
                </View>
            ))}
        </View>
    )
}

export default memo(ProjectUploadData)