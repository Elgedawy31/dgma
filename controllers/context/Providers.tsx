import { memo } from 'react'
import { View } from 'react-native'
import UserContextProvider from '@UserContext'
import ThemeContextProvider from '@ThemeContext'
import ProjectsContextProvider from '@ProjectsContext'


function Providers({ children }: any) {
    return (
        <UserContextProvider>
            <ProjectsContextProvider>
                <ThemeContextProvider>
                    <View style={{ flex: 1 }}>
                        {children}
                    </View>
                </ThemeContextProvider>
            </ProjectsContextProvider>
        </UserContextProvider>
    )
}
export default memo(Providers)