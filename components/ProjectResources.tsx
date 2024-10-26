import File from '@blocks/File'
import Text from '@blocks/Text'
import { View } from 'react-native'
import Button  from '@ui/Button'
import { memo, useState } from 'react'
import { useThemeColor } from '@hooks/useThemeColor'
import { ProjectAttachmentModel } from '@model/project'

function ProjectResources({ data }: { data: ProjectAttachmentModel[] }) {
    const colors = useThemeColor();
    const [showMore, setShowMore] = useState(false);
    return (
        <View style={{ paddingVertical: 8, gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Text type="subtitle" title='Resources' />
                {data.length > 3 && <Button type='text' label={showMore ? 'Show Less' : `Show More (+${data.length - 3})`} onPress={() => setShowMore(!showMore)} />}
            </View>
            <View style={{ gap: 10, borderRadius: 10, backgroundColor: colors.card, paddingHorizontal: 8 }}>
                {data.length === 0 ?
                    <Text italic type='label' color={'red'} title='No Resources Added Yet' />
                    :
                    data.slice(0, showMore ? data.length : 3).map((item, index) =>
                        (<File key={item._id} type={item.type} title={item.name} fileSize={item.size} />))
                }
            </View>
        </View>)
}
export default memo(ProjectResources)