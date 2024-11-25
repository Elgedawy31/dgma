import File from '@blocks/File'
import Text from '@blocks/Text'
import { View } from 'react-native'
import Button from '@ui/Button'
import { memo, useState } from 'react'
import { useThemeColor } from '@hooks/useThemeColor'
import useFile from '@hooks/useFile'

function ProjectResources({ resources, projectName }: { projectName: string, resources: string[] }) {

    const { decodeFile } = useFile();
    const colors = useThemeColor();
    const [showMore, setShowMore] = useState(false);

    return (
        <View style={{ paddingVertical: 8, gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="subtitle" title='Resources' />
                {resources.length > 3 && <Button type='text' label={showMore ? 'Show Less' : `Show More (+${resources.length - 3})`} onPress={() => setShowMore(!showMore)} />}
            </View>
            <View style={{ gap: 10, borderRadius: 10, backgroundColor: colors.card, paddingHorizontal: 8 }}>
                {resources.length === 0 ?
                    <Text italic type='label' align='center' color={'red'} title='No Resources Added Yet' />
                    :
                    resources.slice(0, showMore ? resources.length : 3).map((item, index) =>
                        (<File type='view' key={item} src={decodeFile(item)} onPress={() => { }} />))
                }
            </View>
        </View>)
}
export default memo(ProjectResources)