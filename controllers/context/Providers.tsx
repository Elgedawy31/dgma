import { memo } from 'react'
import { View } from 'react-native'
import UserContextProvider from '@UserContext'
import ThemeContextProvider from '@ThemeContext'
import ProjectsContextProvider from '@ProjectsContext'
import { ToastProvider } from './ToastContext'

function Providers({ children }: any) {
    return (
        <ToastProvider>
            <UserContextProvider>
                <ProjectsContextProvider>
                    <ThemeContextProvider>
                        <View style={{ flex: 1 }}>
                            {children}
                        </View>
                    </ThemeContextProvider>
                </ProjectsContextProvider>
            </UserContextProvider>
        </ToastProvider>
    )
}
export default memo(Providers)
