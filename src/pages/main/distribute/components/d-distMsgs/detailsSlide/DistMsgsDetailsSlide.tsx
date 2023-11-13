import { useQueryClient } from '@tanstack/react-query';
import { Stepper } from '@zendeskgarden/react-accordions';
import { useContext, useEffect, useLayoutEffect } from 'react';
import { CarouselAndNavBarWrapper } from '../../../../../../global/components/lib/carousel/NavBar';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { ArrowCircleLeftIcon } from '../../../../../../global/components/lib/icons/arrows/ArrowCircleLeft';
import { ArrowCircleRightIcon } from '../../../../../../global/components/lib/icons/arrows/ArrowCircleRight';
import { CloseCircleIcon } from '../../../../../../global/components/lib/icons/close/CloseCircle';
import { RefreshCircleIcon } from '../../../../../../global/components/lib/icons/refresh/RefreshCircle';
import { FlexRowWrapper } from '../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import {
   StyledStepper,
   StyledStepperLabel,
   StyledStepperLine,
} from '../../../../../../global/components/lib/stepper/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../../global/css/colors';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import useSessionStorage from '../../../../../../global/hooks/useSessionStorage';
import { DistributeContext } from '../../../context/DistributeContext';
import NDist from '../../../namespace/NDist';

export default function DistMsgsDetailsSlide(): JSX.Element {
   const { slide2Data, currentSlide, scrollToSlide } = useContext(DistributeContext);
   const { isDarkTheme } = useThemeContext();
   const distMsgsItem = slide2Data as NDist.IDistMsgs;
   const [prevDistMsgs, setPrevDistMsgs] = useSessionStorage('prevDistMsgItem', distMsgsItem);
   const [completedStepNo, setCompletedStepNo] = useSessionStorage(
      `distMsgItem.completedStepNo`,
      0,
   );
   const queryClient = useQueryClient();
   const delCalcDistItemInFirestore = NDist.API.useMutation.delCalcDist({
      onSuccess: () => {
         // eslint-disable-next-line @typescript-eslint/no-floating-promises
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
         scrollToSlide(1);
      },
   });

   useEffect(() => {
      if (distMsgsItem) {
         setPrevDistMsgs(distMsgsItem);
      }
   }, []);

   useLayoutEffect(() => {
      if (currentSlide === 1) {
         setCompletedStepNo(0);
      }
   }, [currentSlide]);

   function distMsgsToRender(): NDist.IDistMsgs {
      if (!distMsgsItem) return prevDistMsgs;
      return distMsgsItem;
   }

   function changeCompletedStep(stepNo: number): void {
      if (stepNo < 0 || stepNo > distMsgsToRender().msgs.length) return;
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

   async function handleDelete(): Promise<void> {
      await delCalcDistItemInFirestore.mutateAsync({
         type: 'distributerItem',
         data: distMsgsToRender(),
      });
   }

   return (
      <CarouselAndNavBarWrapper style={{ width: '100%' }}>
         <FlexRowWrapper justifyContent={'left'} padding="1em 0em 0em 1em">
            <TextColourizer fontSize="2em" bold>
               {DateHelper.fromDDMMYYYYToWord(distMsgsToRender().timestamp)}
            </TextColourizer>
            <FlexRowWrapper justifyContent="center" padding="1em 0em 1em 1em">
               <ArrowCircleLeftIcon
                  height={'2em'}
                  darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  onClick={() => changeCompletedStep(completedStepNo - 1)}
               />
               <ArrowCircleRightIcon
                  height={'2em'}
                  darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  onClick={() => changeCompletedStep(completedStepNo + 1)}
               />
               <RefreshCircleIcon
                  height={'2em'}
                  darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  onClick={() => changeCompletedStep(0)}
               />
               <CloseCircleIcon
                  height={'2em'}
                  darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  onClick={() => handleDelete()}
               />
            </FlexRowWrapper>
         </FlexRowWrapper>

         <StyledStepper activeIndex={completedStepNo}>
            {distMsgsToRender().msgs.map((msg, index) => (
               <Stepper.Step key={msg} onClick={() => changeCompletedStep(index + 1)}>
                  <StyledStepperLabel
                     completed={BoolHelper.boolToStr(isCompleted(index + 1))}
                     darktheme={BoolHelper.boolToStr(isDarkTheme)}
                     isnext={BoolHelper.boolToStr(isNextToComplete(index + 1))}
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
