import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { GlobalTheme } from '../../theme/theme';
import { ThemeContext } from './ThemeContext';

interface IThemeContextProvider {
   children: ReactNode;
}

export const ThemeContextProvider = (props: IThemeContextProvider): JSX.Element => {
   const { children } = props;
   const [isDarkTheme, setIsDarkTheme] = useLocalStorage(`isDarkTheme`, false);
   const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
   const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

   useEffect(() => {
      const handleResize = (): void => setIsMobile(window.innerWidth < 768);
      window.addEventListener(`resize`, handleResize);
      setIsInitialRender(false);
      return () => window.removeEventListener(`resize`, handleResize);
   }, []);

   useEffect(() => {
      if (!isInitialRender) {
         localStorage.setItem(`isDarkTheme`, isDarkTheme.toString());
      }
   }, [isDarkTheme, isInitialRender]);

   const contextMemo = useMemo(
      () => ({
         isDarkTheme,
         toggleTheme: () => setIsDarkTheme(!isDarkTheme),
         isMobile,
      }),
      [isDarkTheme, isMobile],
   );

   return (
      <ThemeContext.Provider value={contextMemo}>
         <GlobalTheme darkTheme={isDarkTheme} />
         {children}
      </ThemeContext.Provider>
   );
};
