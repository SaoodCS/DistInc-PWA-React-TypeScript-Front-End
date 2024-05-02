import { useLayoutEffect } from 'react';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Color from '../../../css/colors';
import Logo from '../../app/logo/Logo';
import { SplashScreenFooter, SplashScreenWrapper } from './Style';
import NumberHelper from '../../../helpers/dataTypes/number/NumberHelper';
import ExitAnimatePresence from '../animation/exitAnimatePresence/ExitAnimatePresence';
import { SimpleAnimator } from '../animation/simpleAnimator/SimpleAnimator';
import { FlexColumnWrapper } from '../positionModifiers/flexColumnWrapper/FlexColumnWrapper';

interface ISplashScreen {
   durationSecs: number;
   isDisplayed: boolean;
   onClose: () => void;
}

export default function SplashScreen(props: ISplashScreen): JSX.Element {
   const { isDisplayed, durationSecs, onClose } = props;
   const { isDarkTheme } = useThemeContext();

   useLayoutEffect(() => {
      if (!isDisplayed) return;
      const timer = setTimeout(() => {
         onClose();
      }, NumberHelper.secsToMs(durationSecs));
      return () => clearTimeout(timer);
   }, [isDisplayed]);

   return (
      <ExitAnimatePresence exitWhen={!isDisplayed}>
         <SimpleAnimator key="splash-screen" animateType={['fade']} duration={0.3}>
            <SplashScreenWrapper color={isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg}>
               <FlexColumnWrapper
                  justifyContent="center"
                  alignItems="center"
                  height="100dvh"
                  width="100dvw"
               >
                  <Logo
                     size={'200px'}
                     bgColor={isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg}
                     cardColor={isDarkTheme ? Color.lightThm.inactive : Color.darkThm.inactive}
                     detailsColor={isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg}
                  />
               </FlexColumnWrapper>
               <SplashScreenFooter>DistInc v0.1.0</SplashScreenFooter>
            </SplashScreenWrapper>
         </SimpleAnimator>
      </ExitAnimatePresence>
   );
}
