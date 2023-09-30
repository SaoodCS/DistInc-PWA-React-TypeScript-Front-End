import { useContext } from 'react';
import { IThemeContext, ThemeContext } from '../ThemeContext';

export default function useThemeContext(): IThemeContext {
   const { isDarkTheme, toggleTheme, isPortableDevice } = useContext(ThemeContext);

   return { isDarkTheme, toggleTheme, isPortableDevice };
}
