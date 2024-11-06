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
type TeamUserModel = {
    _id: string,
    avatar: string | null,
    name: { first: string, last: string }
}


type MembersModel = {
    _id: string,
    avatar: string
}

type FlatListComponentProps = {
    onScrollBegin: () => void;
    onScrollEnd: () => void;
};
const ProjectTeamMembers: FC<FlatListComponentProps> = ({ onScrollBegin, onScrollEnd }) => {
    const { get } = useAxios();
    const colors = useThemeColor();
    const [members, setMembers] = useState<MembersModel[]>([])
    const { project: { team } } = useContext(projectDetailsContext)
    const { control, watch, } = useForm<{ teamValue: string }>({});

    const removeMember =
        useCallback((id: string) => {
            console.log("id", id);
            setMembers(prevMembers => prevMembers
                .filter(member => member._id !== id)
            );
        }, [])

    const addNewMember = useCallback((member: MembersModel) => {
        !members.length && setMembers([member]);
        setMembers(prev =>
            prev.some(mem =>
                mem._id === member._id) ?
                [...prev, member] : prev);

    }, [])

    useEffect(() => {
        // const getUsers = async () => {
        //     await get({ endPoint: "users" }).then(res => {
        //         // res.map((user: any) => { setTeam(prev => [...prev, { _id: user.id, avatar: user.avatar, name: { ...user.name }, }]) })
        //     })
        // }
        // getUsers();
    }, [])

    return (
        <View style={{ gap: members.length ? 8 : 4 }}>
            <Text color={colors.primary} type='label' title='Project Members' />
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
                {!members.length ? <Text italic type='label' color={'red'} title='No Members Assigned to This Project' /> :
                    members.map((member) =>
                        <Pressable key={member._id} onPress={() => removeMember(member._id)}>
                            <StackUI
                                position={{ vertical: 'bottom', horizontal: 'right' }} value={{ vertical: 2, horizontal: -2 }}
                                sec={<Icon border iconColor='white' bgColor='red' type='complex' gap={1} icon='close' size={18} />}
                                base={<ImageAvatar type='avatar' url={member.avatar} size={50} />}
                            />
                        </Pressable>
                    )
                }
            </View>
            {members.length !== usersData.length && <TextInputField
                noLabel
                name='teamValue'
                control={control}
                placeholder='Search for Project Members By Name '
            />}
            {watch('teamValue') && <View style={{ gap: 8, marginVertical: 8 }}>
                <View style={{ height: 195 }}>
                    <FlatList
                        data={[...usersData]
                            .filter((user) => !members.some((mem) => mem._id === user._id))
                            .filter(({ name: { first, last } }) =>
                                first.toLowerCase().includes(watch('teamValue').toLowerCase()) ||
                                last.toLowerCase().includes(watch('teamValue').toLowerCase())
                            )}
                        onScrollBeginDrag={onScrollBegin}
                        onScrollEndDrag={onScrollEnd}
                        onMomentumScrollEnd={onScrollEnd}
                        renderItem={({ item: { avatar, name: { first, last }, _id } }) => (
                            <Pressable key={_id} style={{ marginVertical: 2 }}
                                onPress={() => addNewMember({ avatar: avatar || '', _id: _id || Date.now().toString() })}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} key={_id}>
                                    <ImageAvatar type='avatar' url={avatar} size={50} />
                                    <Text type='subtitle' title={`${first} ${last}`} />
                                </View>
                            </Pressable>
                        )}
                    />
                </View>
            </View>}
        </View>
    )
}

export default memo(ProjectTeamMembers)