import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
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
   const [isPortableDevice, setIsPortableDevice] = useState<boolean>(window.innerWidth < 850);
   const [showSplashScreen, setShowSplashScreen] = useState(
      window.matchMedia(`(display-mode: standalone)`).matches,
   );

   useEffect(() => {
      let timer: NodeJS.Timeout | null = null;
      if (showSplashScreen) {
         timer = setTimeout(() => setShowSplashScreen(false), 1750);
      }
      const handleResize = (): void => setIsPortableDevice(window.innerWidth < 850);
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
         isPortableDevice,
      }),
      [isDarkTheme, isPortableDevice],
   );

   return (
      <>
         <ThemeContext.Provider value={contextMemo}>
            <SplashScreen isDisplayed={showSplashScreen} />
            <ConditionalRender condition={!showSplashScreen}>
               <GlobalTheme darkTheme={isDarkTheme} />
               {children}
            </ConditionalRender>
         </ThemeContext.Provider>
      </>
   );
};
