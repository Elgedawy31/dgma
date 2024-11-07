import useSecureStorage from "@hooks/useSecureStorage";
import useStorage from "@hooks/useStorage";
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
type UserContextType = {
    user: UserType,
    resetUser: () => void
    setUserData: (token: string, user: UserType) => void
}
type UserType = {
    id: string,
    email: string,
    createdAt: string,
    updatedAt: string | null,
    role: 'admin' | 'user' | null,
    avatar: string | null,
    name: { first: string, last: string },
    notifications?: { type: string, data: any, isRead: boolean, createdAt: string }[]
}
export const userContext = createContext<UserContextType>({} as UserContextType)

function UserContextProvider({ children }: { children: ReactNode }) {
    const { readStorage, writeStorage } = useStorage();
    const { writeStorage: storeToken } = useSecureStorage();
    const [user, setUser] = useState<UserType>({
        id: "",
        email: "",
        role: null,
        createdAt: "",
        updatedAt: "",
        notifications: [],
        avatar: null,
        name: { first: "", last: "" },
    })

    useEffect(() => {
        loadUserData();
    }, [])

    const loadUserData = useCallback(async () => {
        await readStorage('user')
            .then(
                (user) =>
                    user && setUser(
                        (prev) => ({ ...prev, ...JSON.parse(user) })))
    }, []);

    const resetUser = useCallback(() => {
        setUser({
            id: "",
            email: "",
            role: null,
            createdAt: "",
            updatedAt: "",
            notifications: [],
            avatar: null,
            name: { first: "", last: "" },
        })
    }, [])
    
    const setUserData = useCallback(async (token: string, user: UserType) => {
        setUser({ ...user });
        await storeToken('token', token);
        await writeStorage('user', JSON.stringify({
            name: { ...user.name },
            role: user.role,
            email: user.email,
            avatar: user.avatar,
            id: user.id
        }));
    }, [])

    const obj = useMemo(() => ({
        user, setUserData, resetUser
    }), [user, setUserData, resetUser])

    return (
        <userContext.Provider value={obj}>
            {children}
        </userContext.Provider>
    )
}
export default UserContextProvider