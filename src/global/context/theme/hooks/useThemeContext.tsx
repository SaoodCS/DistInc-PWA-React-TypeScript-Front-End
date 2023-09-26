import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

interface IUseThemeContextReturn {
   isDarkTheme: boolean;
   toggleTheme: () => void;
   isPortableDevice: boolean;
}

export default function useThemeContext(): IUseThemeContextReturn {
   const { isDarkTheme, toggleTheme, isPortableDevice } = useContext(ThemeContext);

   return { isDarkTheme, toggleTheme, isPortableDevice };
}
