import useSecureStorage from "@hooks/useSecureStorage";
import useStorage from "@hooks/useStorage";
import { projectsContext } from "@ProjectsContext";
import { set } from "date-fns";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
type UserContextType = {
    user: UserType,
    logout: () => void
    userToken: string | null,
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
    const [userToken, setUserToken] = useState<string | null>(null);
    const { readStorage, writeStorage, removeStorage } = useStorage();
    const { writeStorage: storeToken, readStorage: readToken, removeStorage: removeToken } = useSecureStorage();
    const [user, setUser] = useState<UserType>({
        id: "",
        email: "",
        createdAt: "",
        updatedAt: "",
        notifications: [],
        role: null, avatar: null,
        name: { first: "", last: "" },
    })

    useEffect(() => { loadUserData(); }, [])

    const loadUserData = useCallback(async () => {
        await readStorage('user').then((user) => user && setUser((prev) => ({ ...prev, ...JSON.parse(user) })))
        await readToken<string>('token').then((token: string | null) => token && setUserToken(token));
    }, []);

    const logout = useCallback(async () => {
      
        await removeToken('token');
        await removeStorage('user');
    }, [])

    const setUserData = useCallback((token: string, user: UserType) => {
        setUserToken(token);
        setUser({ ...user });
        Promise.all([
            storeToken('token', token),
            writeStorage('user', JSON.stringify({
                name: { ...user.name },
                role: user?.role,
                email: user.email,
                avatar: user.avatar,
                id: user.id
            }))
        ]);
    }, [])

    const obj = useMemo(() => ({
        userToken, user, setUserData, logout
    }), [userToken, user, setUserData, logout])

    return (
        <userContext.Provider value={obj}>
            {children}
        </userContext.Provider>
    )
}
export default UserContextProvider