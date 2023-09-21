import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

interface IUseThemeContextReturn {
   isDarkTheme: boolean;
   toggleTheme: () => void;
   isMobile: boolean;
}

export default function useThemeContext(): IUseThemeContextReturn {
   const { isDarkTheme, toggleTheme, isMobile } = useContext(ThemeContext);

   return { isDarkTheme, toggleTheme, isMobile };
}
