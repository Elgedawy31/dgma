import Text from '@blocks/Text'
import { memo, useCallback } from 'react'
import ProjectLink from '@blocks/ProjectLink'
import { ScrollView, View } from 'react-native'

function ProjectLinks({ data }: { data: string[] }) {
    const handleLinkSource = useCallback((url: string) => {
        return (url.includes('figma.com') ? 'figma' : url.includes('github.com') ? 'github' : 'website')
    }, [])
    return (
        <View style={{ gap: 16 }}>
            <Text type='subtitle' title='Project Links' />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {data.map((url, index) =>
                        <ProjectLink key={url} type={`${handleLinkSource(url)}`} label={'Project ' + index * (Math.random() * 10)} />)
                    }
                </View>
            </ScrollView>
        </View>
    )
}
export default memo(ProjectLinks)
