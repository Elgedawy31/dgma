import PropTypes from 'prop-types';
import { createContext, useState, ReactNode, useMemo, memo } from "react";

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

function ThemeContextProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<string>('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }

    const value = useMemo(() => ({
        theme, toggleTheme
    }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
export default memo(ThemeContextProvider);

ThemeContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
