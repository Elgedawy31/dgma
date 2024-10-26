import { Colors } from '@colors';
import { useContext } from 'react';
import { ThemeContext } from '@ThemeContext';

export function useThemeColor() {
  const { theme } = useContext(ThemeContext);
  return Colors(theme);
}
