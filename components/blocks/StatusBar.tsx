import { memo, useContext } from 'react'
import { ThemeContext } from '@ThemeContext';
import { useThemeColor } from '@hooks/useThemeColor'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'

type StatusBarProps = {
    dark?: boolean,
    iconsColor?: any,
    hidden?: boolean,
}
function StatusBar({ hidden = false, dark, iconsColor, }: StatusBarProps) {
    const colors = useThemeColor();
    const { theme: themeContext } = useContext(ThemeContext);
    return (
        <ExpoStatusBar
            hidden={hidden}
            style={(dark && 'light') || (themeContext === 'light' ? 'dark' : 'light')}
            backgroundColor={iconsColor || (dark && colors.card) || colors.statusBar} />
    )
}
export default memo(StatusBar)