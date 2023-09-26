import { createContext } from 'react';

interface IThemeContext {
   isDarkTheme: boolean;
   toggleTheme: () => void;
   isPortableDevice: boolean;
}

export const ThemeContext = createContext<IThemeContext>({
   isDarkTheme: localStorage.getItem(`isDarkTheme`) === `true` || false,
   toggleTheme: () => {},
   isPortableDevice: window.innerWidth < 850,
});
