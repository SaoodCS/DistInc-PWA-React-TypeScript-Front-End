import { useContext } from 'react';
import { ThemeContext } from '../context/theme/ThemeContext';

export default function useThemeContext() {
    const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
    
    return { isDarkTheme, toggleTheme };
}
