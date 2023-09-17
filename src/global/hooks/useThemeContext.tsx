import { useContext } from 'react';
import { ThemeContext } from '../context/theme/ThemeContext';

interface IUseThemeContextReturn {
   isDarkTheme: boolean;
   toggleTheme: () => void;
}

export default function useThemeContext(): IUseThemeContextReturn {
   const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

   return { isDarkTheme, toggleTheme };
}
