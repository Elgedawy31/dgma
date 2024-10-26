import Text from '@blocks/Text'
import TaskModel from '@model/task'
import { View } from 'react-native'
import Button  from '@ui/Button'
import React, { memo, useState } from 'react'
import ProjectTask from '@blocks/ProjectTask'


function ProjectTasks({ data }: { data: TaskModel[] }) {
    const [showMore, setShowMore] = useState(false);

    return (
        <View style={{ gap: 10, paddingVertical: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text type='subtitle' title='Project Tasks' />
                {data.length > 3 &&
                    <Button type='text' label={showMore ? 'Show Less' : `Show More (+${data.length - 3})`} onPress={() => setShowMore(!showMore)} />}
            </View>
            <View style={{ gap: 8 }}>
                {data.slice(0, showMore ? data.length : 3).map((item) =>
                    <ProjectTask key={item.id} label={item.note} title={item.title} state={item.state} />)
                }
            </View>
        </View>
    )
}
export default memo(ProjectTasks)

