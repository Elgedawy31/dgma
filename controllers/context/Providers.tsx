import { memo } from 'react'
import { View } from 'react-native'
import UserContextProvider from '@UserContext'
import ThemeContextProvider from '@ThemeContext'
import ProjectsContextProvider from '@ProjectsContext'
import { ToastProvider } from './ToastContext'
import ActiveProjectContextProvider from './ActiveProjectContextProvider'

function Providers({ children }: any) {
    return (
        <ToastProvider>
            <UserContextProvider>
                <ProjectsContextProvider>
                    <ActiveProjectContextProvider>
                        <ThemeContextProvider>
                            <View style={{ flex: 1 }}>
                                {children}
                            </View>
                        </ThemeContextProvider>
                    </ActiveProjectContextProvider>
                </ProjectsContextProvider>
            </UserContextProvider>
        </ToastProvider>
    )
}
export default memo(Providers)
