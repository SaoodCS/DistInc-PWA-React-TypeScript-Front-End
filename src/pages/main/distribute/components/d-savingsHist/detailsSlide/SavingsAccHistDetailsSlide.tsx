import { BuildingBank } from '@styled-icons/fluentui-system-regular/BuildingBank';
import { TargetArrow } from '@styled-icons/fluentui-system-regular/TargetArrow';
import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CardWidgetWrapper } from '../../../../../../global/components/lib/card/Card';
import { CarouselAndNavBarWrapper } from '../../../../../../global/components/lib/carousel/NavBar';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { TrashIcon } from '../../../../../../global/components/lib/icons/delete/TrashIcon';
import { FlexColumnWrapper } from '../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { LargeScrnResponsiveFlexWrap } from '../../../../../../global/components/lib/positionModifiers/responsiveFlexWrap/LargeScrnResponsiveFlexWrap';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../../global/css/colors';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import SavingsClass from '../../../../details/components/accounts/savings/class/Class';
import { DistributeContext } from '../../../context/DistributeContext';
import NDist from '../../../namespace/NDist';
import HeaderHooks from '../../../../../../global/context/widget/header/hooks/HeaderHooks';

export default function SavingsAccHistDetailsSlide(): JSX.Element {
   const { slide2Data } = useContext(DistributeContext);
   const savingsAccHistItem = slide2Data as NDist.ISavingsAccHist;
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { scrollToSlide } = useContext(DistributeContext);

   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();
   const queryClient = useQueryClient();
   const delCalcDistItemInFirestore = NDist.API.useMutation.delCalcDist({
      onSuccess: () => {
         // eslint-disable-next-line @typescript-eslint/no-floating-promises
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
         scrollToSlide(1);
      },
   });

   function savingsAccTargetToReach(): number {
      return (
         SavingsClass.getObjFromId(savingsAccHistItem.id, savingsAccounts || {})?.targetToReach || 0
      );
   }

   async function handleDelete(): Promise<void> {
      await delCalcDistItemInFirestore.mutateAsync({
         type: 'savingsAccHistoryItem',
         data: savingsAccHistItem,
      });
   }

   function calculatePercentage(): number {
      const savingsAccHistBalance = savingsAccHistItem.balance;
      const savingsAccTarget = savingsAccTargetToReach();
      if (savingsAccTarget === 0) return 0;
      const percentage = (savingsAccHistBalance / savingsAccTarget) * 100;
      return NumberHelper.roundTo(percentage, 2);
   }

   return (
      <CarouselAndNavBarWrapper style={{ width: '100%' }}>
         <FlexRowWrapper padding="2em">
            <TextColourizer fontSize="2em" bold padding="0em 0.25em 0em 0em">
               {DateHelper.fromDDMMYYYYToWord(savingsAccHistItem.timestamp)}
            </TextColourizer>
            <TrashIcon
               darktheme={BoolHelper.boolToStr(isDarkTheme)}
               height={'1.5em'}
               onClick={() => handleDelete()}
            />
         </FlexRowWrapper>

         <LargeScrnResponsiveFlexWrap childrenMargin="1em">
            <FlexColumnWrapper padding="0em 2em 1em 2em">
               <CardWidgetWrapper
                  bgColor={isDarkTheme ? Color.lightThm.accent : Color.darkThm.accent}
                  height="7em"
               >
                  <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 1em">
                     <TextColourizer fontSize="1.25em" bold padding={'0.25em 0em'}>
                        {SavingsClass.getNameFromId(savingsAccHistItem.id, savingsAccounts || {})}
                     </TextColourizer>
                     <TextColourizer fontSize="0.9em">
                        <TextColourizer fontSize="0.9em" bold>
                           Balance:&nbsp;
                        </TextColourizer>
                        {NumberHelper.asCurrencyStr(savingsAccHistItem.balance)}
                     </TextColourizer>
                  </FlexColumnWrapper>
                  <FlexColumnWrapper height={'100%'} justifyContent="center" padding={'0em 0.5em'}>
                     <BuildingBank height={'90%'} color={Color.lightThm.border} />
                  </FlexColumnWrapper>
               </CardWidgetWrapper>

               <ConditionalRender condition={savingsAccTargetToReach() > 0}>
                  <CardWidgetWrapper
                     bgColor={isDarkTheme ? Color.lightThm.warning : Color.darkThm.warning}
                     height="7em"
                  >
                     <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 1em">
                        <TextColourizer fontSize="1.25em" bold padding={'0.25em 0em'}>
                           Target
                        </TextColourizer>
                        <TextColourizer fontSize="0.9em">
                           {NumberHelper.asCurrencyStr(savingsAccTargetToReach())}
                        </TextColourizer>
                     </FlexColumnWrapper>
                     <FlexColumnWrapper
                        height={'100%'}
                        justifyContent="center"
                        padding={'0em 0.5em'}
                     >
                        <TargetArrow height={'90%'} color={Color.lightThm.border} />
                     </FlexColumnWrapper>
                  </CardWidgetWrapper>
               </ConditionalRender>
            </FlexColumnWrapper>

            <ConditionalRender condition={savingsAccTargetToReach() > 0}>
               <FlexColumnWrapper justifyContent={isPortableDevice ? 'center' : ''}>
                  <ConditionalRender condition={isPortableDevice}>
                     <TextColourizer fontSize="1.5em" bold padding="0.5em 0em 1em 1em">
                        Progress
                     </TextColourizer>
                  </ConditionalRender>
                  <FlexColumnWrapper width="100%" alignItems={isPortableDevice ? 'center' : 'left'}>
                     <FlexRowWrapper width={isPortableDevice ? '12.5em' : '14.5em'}>
                        <CircularProgressbar
                           value={calculatePercentage()}
                           text={`${calculatePercentage()}%`}
                           styles={buildStyles({
                              textColor: isDarkTheme ? Color.lightThm.accent : Color.darkThm.accent,
                              pathColor: isDarkTheme ? Color.lightThm.accent : Color.darkThm.accent,
                              trailColor: isDarkTheme
                                 ? Color.darkThm.inactive
                                 : Color.lightThm.inactive,
                           })}
                        />
                     </FlexRowWrapper>
                  </FlexColumnWrapper>
               </FlexColumnWrapper>
            </ConditionalRender>
         </LargeScrnResponsiveFlexWrap>
      </CarouselAndNavBarWrapper>
   );
}
