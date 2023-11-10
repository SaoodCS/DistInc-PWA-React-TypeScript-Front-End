import { Stepper } from '@zendeskgarden/react-accordions';
import { useContext, useEffect } from 'react';
import { CarouselAndNavBarWrapper } from '../../../../../../global/components/lib/carousel/NavBar';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import {
   StyledStepper,
   StyledStepperLabel,
   StyledStepperLine,
} from '../../../../../../global/components/lib/stepper/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../../global/css/colors';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import useSessionStorage from '../../../../../../global/hooks/useSessionStorage';
import { DistributeContext } from '../../../context/DistributeContext';
import type NDist from '../../../namespace/NDist';

export default function DistMsgsDetails(): JSX.Element {
   const { slide2Data, currentSlide } = useContext(DistributeContext);
   const { isDarkTheme } = useThemeContext();
   const distMsgsItem = slide2Data as NDist.IDistMsgs;
   const [prevDistMsgs, setPrevDistMsgs] = useSessionStorage('prevDistMsgItem', distMsgsItem);
   const [completedStepNo, setCompletedStepNo] = useSessionStorage(
      `distMsgItem.${distMsgsItem?.timestamp}.completedStepNo`,
      0,
   );

   useEffect(() => {
      if (distMsgsItem) {
         setPrevDistMsgs(distMsgsItem);
      }
   }, []);

   useEffect(() => {
      if (currentSlide === 1) {
         setCompletedStepNo(0);
      }
   }, []);

   function distMsgsToRender(): NDist.IDistMsgs {
      if (!distMsgsItem) return prevDistMsgs;
      return distMsgsItem;
   }

   function changeCompletedStep(stepNo: number): void {
      setCompletedStepNo(stepNo);
   }

   function isCompleted(stepNo: number): boolean {
      return stepNo <= completedStepNo;
   }

   function isNextToComplete(stepNo: number): boolean {
      return stepNo === completedStepNo + 1;
   }

   function setBorderLeftCol(index: number): string {
      if (isCompleted(index + 2)) {
         return isDarkTheme ? Color.darkThm.success : Color.lightThm.success;
      }
      if (isCompleted(index + 1)) {
         return isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent;
      }
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.5);
   }

   return (
      <CarouselAndNavBarWrapper style={{ width: '100%' }}>
         <TextColourizer fontSize="2em" bold padding="0.5em">
            {distMsgsToRender().timestamp}
         </TextColourizer>
         <StyledStepper activeIndex={completedStepNo}>
            {distMsgsToRender().msgs.map((msg, index) => (
               <Stepper.Step key={msg} onClick={() => changeCompletedStep(index + 1)}>
                  <StyledStepperLabel
                     completed={BoolHelper.toString(isCompleted(index + 1))}
                     darktheme={BoolHelper.toString(isDarkTheme)}
                     isnext={BoolHelper.toString(isNextToComplete(index + 1))}
                  >
                     {msg}
                  </StyledStepperLabel>
                  <StyledStepperLine style={{ borderLeftColor: setBorderLeftCol(index) }} />
               </Stepper.Step>
            ))}
         </StyledStepper>
      </CarouselAndNavBarWrapper>
   );
}
