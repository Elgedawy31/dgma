import React, { memo } from 'react'
import Text from '@blocks/Text'
import Container from '@container'
import { StyleSheet, View } from 'react-native'
type ProjectTaskProps = {
    title?: string,
    state?: 'progess' | 'completed' | 'overdue' | 'review' | 'pending' | 'cancelled',
    label?: string
}

const Priority = {
    review: '#2684FF',
    progess: '#FFC400',
    overdue: '#FF7452',
    pending: '#040A0F',
    cancelled: '#6A6363',
    completed: '#57D9A3',
}
function ProjectTask({
    title = 'Project Task',
    label = 'completed',
    state = 'completed' }: ProjectTaskProps) {
    return (
        <Container row radius={20} style={{ paddingVertical: 14, paddingHorizontal: 11 }}>
            <Text type='subtitle' title={title.slice(0, 20)} />
            <View style={{ backgroundColor: Priority[state], borderRadius: 8, padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                <Text bold type='x-small' title={label} />
            </View>
        </Container>
    )
}
export default memo(ProjectTask)
const styles = StyleSheet.create({})