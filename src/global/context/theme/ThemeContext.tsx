import { createContext } from 'react';

interface IThemeContext {
   isDarkTheme: boolean;
   toggleTheme: () => void;
   isMobile: boolean;
}

export const ThemeContext = createContext<IThemeContext>({
   isDarkTheme: localStorage.getItem(`isDarkTheme`) === `true` || false,
   toggleTheme: () => {},
   isMobile: window.innerWidth < 768,
});
