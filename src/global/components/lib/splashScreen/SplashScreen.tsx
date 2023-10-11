import { useEffect, useState } from 'react';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Color from '../../../css/colors';
import Logo from '../../app/logo/Logo';
import Fader from '../animation/fader/Fader';
import { OpaqueOverlay } from '../overlay/opaqueOverlay/Style';
import { CenterWrapper } from '../positionModifiers/centerers/CenterWrapper';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { SplashScreenFooter } from './Style';

interface ISplashScreen {
   isDisplayed: boolean;
}

export default function SplashScreen(props: ISplashScreen): JSX.Element {
   const { isDisplayed } = props;
   const [renderSplashScreen, setRenderSplashScreen] = useState(isDisplayed);
   const { isDarkTheme } = useThemeContext();

   useEffect(() => {
      let timeoutId: NodeJS.Timeout | undefined = undefined;
      if (!isDisplayed) {
         timeoutId = setTimeout(() => {
            setRenderSplashScreen(false);
         }, 1750);
      } else {
         setRenderSplashScreen(true);
      }
      return () => {
         clearTimeout(timeoutId);
      };
   }, [isDisplayed]);

   return (
      <ConditionalRender condition={renderSplashScreen}>
         <Fader fadeInCondition={isDisplayed}>
            <OpaqueOverlay isDarkTheme={isDarkTheme}>
               <CenterWrapper centerOfScreen>
                  <Logo
                     size={'200px'}
                     bgColor={isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg}
                     cardColor={isDarkTheme ? Color.lightThm.inactive : Color.darkThm.inactive}
                     detailsColor={isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg}
                  />
               </CenterWrapper>
               <SplashScreenFooter>DistInc v0.1.0</SplashScreenFooter>
            </OpaqueOverlay>
         </Fader>
      </ConditionalRender>
   );
}
