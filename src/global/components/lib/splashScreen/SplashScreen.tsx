import { useEffect, useState } from 'react';
import Color from '../../../theme/colors';
import Logo from '../../app/logo/Logo';
import Fader from '../animation/fader/Fader';
import { OpaqueOverlay } from '../overlay/opaqueOverlay/Style';
import { CenterWrapper } from '../positionModifiers/centerers/CenterWrapper';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';

interface ISplashScreen {
   isDisplayed: boolean;
}

export default function SplashScreen(props: ISplashScreen): JSX.Element {
   const { isDisplayed } = props;
   const [renderSplashScreen, setRenderSplashScreen] = useState(isDisplayed);

   useEffect(() => {
      let timeoutId: NodeJS.Timeout | undefined = undefined;
      if (!isDisplayed) {
         timeoutId = setTimeout(() => {
            setRenderSplashScreen(false);
         }, 1500);
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
            <OpaqueOverlay bgColor={Color.darkThm.bg}>
               <CenterWrapper centerOfScreen>
                  <Logo size={'120px'} />
               </CenterWrapper>
            </OpaqueOverlay>
         </Fader>
      </ConditionalRender>
   );
}
