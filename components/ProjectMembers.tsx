import Text from '@blocks/Text'
import { View } from 'react-native'
import Button  from '@ui/Button'
import { memo, useState } from 'react'
import UserCard from '@cards/UserCard'
import { ProjectMemberModel } from '@model/project'


function ProjectMembers({ data }: { data: ProjectMemberModel[] }) {
    const [showMore, setShowMore] = useState(false);

    return (
        <View style={{ gap: 10, paddingVertical: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type='subtitle' title='Project Members' />
                {data.length > 3 &&
                    <Button type='text' label={showMore ? 'Show Less' : `Show More (+${data.length - 3})`} onPress={() => setShowMore(!showMore)} />}
            </View>
            <View style={{ gap: 8 }}>
                {data.length === 0 ?
                    <Text italic type='label' color={'red'} title='No Members Assigned to This Project' />
                    :
                    data.slice(0, showMore ? data.length : 3).map((member) =>
                        <UserCard key={member._id} user={member} />)
                }
            </View>
        </View>
    )
}
export default memo(ProjectMembers)

