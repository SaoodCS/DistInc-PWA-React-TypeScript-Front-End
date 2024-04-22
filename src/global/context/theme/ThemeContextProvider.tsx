import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import SplashScreen from '../../components/lib/splashScreen/SplashScreen';
import MyCSS from '../../css/MyCSS';
import Color from '../../css/colors';
import { GlobalTheme } from '../../css/theme';
import Device from '../../helpers/pwa/deviceHelper';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ThemeContext } from './ThemeContext';
import { SplashToAppTransitioner } from '../../components/lib/splashToAppTransitioner/SplashToAppTransitioner';

interface IThemeContextProvider {
   children: ReactNode;
}

export default function ThemeContextProvider(props: IThemeContextProvider): JSX.Element {
   const { children } = props;
   const [isDarkTheme, setIsDarkTheme] = useLocalStorage(`isDarkTheme`, Device.isSystemDarkTheme());
   const [isPortableDevice, setIsPortableDevice] = useState<boolean>(
      window.innerWidth < MyCSS.PortableBp.asNum,
   );
   const [showSplashScreen, setShowSplashScreen] = useState(Device.isPwa());

   useEffect(() => {
      let timer: NodeJS.Timeout | null = null;
      if (showSplashScreen) {
         timer = setTimeout(() => setShowSplashScreen(false), 2000);
      }
      const handleResize = (): void =>
         setIsPortableDevice(window.innerWidth < MyCSS.PortableBp.asNum);
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
            <SplashToAppTransitioner isSplashScreenDisplayed={showSplashScreen}>
               <GlobalTheme darkTheme={isDarkTheme} />
               {children}
            </SplashToAppTransitioner>
         </ThemeContext.Provider>
      </>
   );
}
