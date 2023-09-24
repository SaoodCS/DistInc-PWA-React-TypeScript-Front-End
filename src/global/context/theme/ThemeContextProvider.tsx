import type { ReactNode } from 'react';
import { useEffect,  useMemo, useState } from 'react';
import ConditionalRender from '../../components/lib/renderModifiers/conditionalRender/ConditionalRender';
import SplashScreen from '../../components/lib/splashScreen/SplashScreen';
import useLocalStorage from '../../hooks/useLocalStorage';
import Color from '../../theme/colors';
import { GlobalTheme } from '../../theme/theme';
import { ThemeContext } from './ThemeContext';

interface IThemeContextProvider {
   children: ReactNode;
}

export const ThemeContextProvider = (props: IThemeContextProvider): JSX.Element => {
   const { children } = props;
   const [isDarkTheme, setIsDarkTheme] = useLocalStorage(
      `isDarkTheme`,
      window.matchMedia(`(prefers-color-scheme: dark)`).matches,
   );
   const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
   const [showSplashScreen, setShowSplashScreen] = useState(
      window.matchMedia(`(display-mode: standalone)`).matches,
   );

   useEffect(() => {
      let timer: NodeJS.Timeout | null = null;
      if (showSplashScreen) {
         timer = setTimeout(() => setShowSplashScreen(false), 1500);
      }
      const handleResize = (): void => setIsMobile(window.innerWidth < 768);
      window.addEventListener(`resize`, handleResize);
      return () => {
         timer && clearTimeout(timer);
         window.removeEventListener(`resize`, handleResize);
      };
   }, []);

   useEffect(() => {
      const metaThemeColor = document.querySelector(`meta[name=theme-color]`);
      if (metaThemeColor) {
         metaThemeColor.setAttribute(`content`, isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg);
      }
   }, [isDarkTheme]);

   const contextMemo = useMemo(
      () => ({
         isDarkTheme,
         toggleTheme: () => setIsDarkTheme(!isDarkTheme),
         isMobile,
      }),
      [isDarkTheme, isMobile],
   );

   return (
      <>
         <ThemeContext.Provider value={contextMemo}>
            <SplashScreen isDisplayed={showSplashScreen} />
            <GlobalTheme darkTheme={isDarkTheme} />
            <ConditionalRender condition={!showSplashScreen}>{children}</ConditionalRender>
         </ThemeContext.Provider>
      </>
   );
};
