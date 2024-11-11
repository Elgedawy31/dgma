import { FlatList, Pressable, View } from 'react-native'
import React, { FC, memo, useCallback, useContext, useEffect, useState } from 'react'
import Text from '@blocks/Text'
import StackUI from '@blocks/StackUI'
import Icon from '@blocks/Icon'
import ImageAvatar from '@blocks/ImageAvatar'
import TextInputField from '@ui/TextInputField'
import useAxios from '@hooks/useAxios'
import { projectDetailsContext } from '@ProjectDetailsContext'
import { useThemeColor } from '@hooks/useThemeColor'
import { usersData } from '@data/users'
import { useForm } from 'react-hook-form'
import UserModel from '@model/user'
type TeamUserModel = {
    id: string,
    avatar: string | null,
    name: { first: string, last: string }
}


type MembersModel = {
    id: string,
    avatar: string
}

type FlatListComponentProps = {
    onScrollBegin: () => void;
    onScrollEnd: () => void;
};

const ProjectTeamMembers: FC<FlatListComponentProps> = ({ onScrollBegin, onScrollEnd }) => {
    const { get } = useAxios();
    const colors = useThemeColor();
    const [users, setUsers] = useState<UserModel[]>([]);
    const { control, watch, } = useForm<{ teamValue: string }>({});
    const { members, addProjectMember, removeProjectMember } = useContext(projectDetailsContext)

    const removeMember =
        useCallback((id: string) => removeProjectMember(id), [removeProjectMember])

    const addNewMember = useCallback((member: MembersModel) => addProjectMember(member), [addProjectMember])

    useEffect(() => {
        const getUsers = async () => {
            await get({ endPoint: "users" }).then(res => {console.log(res); res && setUsers(res)})
        }
        getUsers();

    }, [])

    return (
        <View style={{ gap: members.length ? 8 : 4 }}>
            <Text color={colors.primary} type='label' title='Project Members' />
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
                {users.length > 0 && !members.length ? <Text italic type='error' title='No Members Assigned to This Project' /> :
                    members.map((member) =>
                        <Pressable key={member.id} onPress={() => removeMember(member.id)}>
                            <StackUI
                                position={{ vertical: 'bottom', horizontal: 'right' }} value={{ vertical: 2, horizontal: -2 }}
                                sec={<Icon border iconColor='white' bgColor='red' type='complex' gap={1} icon='close' size={18} />}
                                base={<ImageAvatar type='avatar' url={member.avatar} size={50} />}
                            />
                        </Pressable>
                    )
                }
            </View>
            {members.length !== users.length && <TextInputField
                noLabel
                name='teamValue'
                control={control}
                placeholder='Search for Project Members By Name '
            />}
            {users.length === 0 ?
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, }}>
                    <Text italic size={14} type='error' title='No Users Found' />
                    <Icon icon='back' iconColor={colors.primary} />
                </View>
                : <View style={{ gap: 8, marginVertical: 8 }}>
                    <View style={{ height: 220 }}>
                        <FlatList
                            data={[...users]
                                .filter((user) => !members.some((mem) => mem.id === user.id))
                                .filter(({ name: { first, last } }) =>
                                (!watch('teamValue') ? true
                                    : first.toLowerCase().includes(watch('teamValue').toLowerCase())
                                    || last.toLowerCase().includes(watch('teamValue').toLowerCase())
                                )
                                )}
                            onScrollBeginDrag={onScrollBegin}
                            onScrollEndDrag={onScrollEnd}
                            onMomentumScrollEnd={onScrollEnd}
                            keyExtractor={item => item.id}
                            renderItem={({ item: { avatar, name: { first, last }, id }, index }) => (
                                <Pressable style={{ marginVertical: 2 }}
                                    onPress={() => addNewMember({ avatar: avatar || '', id: id || Date.now().toString() })}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} key={id}>
                                        <ImageAvatar type='avatar' url={avatar} size={50} />
                                        <Text type='subtitle' title={`${first} ${last}`} />
                                    </View>
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            }
        </View >
    )
}

export default memo(ProjectTeamMembers)