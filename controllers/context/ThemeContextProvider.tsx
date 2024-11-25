import { createContext, useState, useCallback, useMemo, memo, useEffect, type ReactNode } from "react";
import useStorage from '@hooks/useStorage';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const { readStorage, writeStorage } = useStorage();
  
  // Load initial theme
  useEffect(() => {
    const loadInitialTheme = async () => {
      const savedTheme = await readStorage('theme') as ThemeType;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme);
      }
    };
    
    loadInitialTheme();
  }, []); 
  
  // Save theme whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      await writeStorage('theme', theme);
    };
    
    saveTheme();
  }, [theme, writeStorage]);
  
  // Memoized toggle function
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);
  
  // Memoized context value - now including setTheme
  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme
  }), [theme, toggleTheme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeContextProvider.displayName = 'ThemeContextProvider';

export default memo(ThemeContextProvider);