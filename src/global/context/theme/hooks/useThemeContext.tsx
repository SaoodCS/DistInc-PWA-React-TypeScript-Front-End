import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

interface IUseThemeContextReturn {
   isDarkTheme: boolean;
   toggleTheme: () => void;
   isMobile: boolean;
}

export default function useThemeContext(): IUseThemeContextReturn {
   const { isDarkTheme, toggleTheme, isMobile } = useContext(ThemeContext);

   return { isDarkTheme, toggleTheme, isMobile };
}
