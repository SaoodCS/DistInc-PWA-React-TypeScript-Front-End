import { BuildingBank } from '@styled-icons/fluentui-system-regular/BuildingBank';
import { TargetArrow } from '@styled-icons/fluentui-system-regular/TargetArrow';
import { useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CardWidgetWrapper } from '../../../../../../global/components/lib/card/Card';
import { CarouselAndNavBarWrapper } from '../../../../../../global/components/lib/carousel/NavBar';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { TrashIcon } from '../../../../../../global/components/lib/icons/delete/TrashIcon';
import { FlexColumnWrapper } from '../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../../global/css/colors';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import useSessionStorage from '../../../../../../global/hooks/useSessionStorage';
import SavingsClass from '../../../../details/components/accounts/savings/class/Class';
import { DistributeContext } from '../../../context/DistributeContext';
import NDist from '../../../namespace/NDist';

export default function SavingsAccHistDetailsSlide(): JSX.Element {
   const { slide2Data } = useContext(DistributeContext);
   const savingsAccHistItem = slide2Data as NDist.ISavingsAccHist;
   const [prevSavingsAccHistItem, setPrevSavingsAccHistItem] = useSessionStorage(
      'prevSavingsAccHisItem',
      savingsAccHistItem,
   );
   const { isDarkTheme } = useThemeContext();
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

   useEffect(() => {
      if (savingsAccHistItem) {
         setPrevSavingsAccHistItem(savingsAccHistItem);
      }
   }, []);

   function savingsAccTargetToReach(): number {
      return (
         SavingsClass.getObjFromId(savingsAccHistToRender().id, savingsAccounts || {})
            ?.targetToReach || 0
      );
   }

   function savingsAccHistToRender(): NDist.ISavingsAccHist {
      if (!savingsAccHistItem) return prevSavingsAccHistItem;
      return savingsAccHistItem;
   }

   async function handleDelete(): Promise<void> {
      await delCalcDistItemInFirestore.mutateAsync({
         type: 'savingsAccHistoryItem',
         data: savingsAccHistToRender(),
      });
   }

   function calculatePercentage(): number {
      const savingsAccHistBalance = savingsAccHistToRender().balance;
      const savingsAccTarget = savingsAccTargetToReach();
      if (savingsAccTarget === 0) return 0;
      const percentage = (savingsAccHistBalance / savingsAccTarget) * 100;
      return NumberHelper.roundTo(percentage, 2);
   }

   return (
      <CarouselAndNavBarWrapper style={{ width: '100%' }}>
         <FlexRowWrapper padding="2em">
            <TextColourizer fontSize="2em" bold padding="0em 0.25em 0em 0em">
               {DateHelper.fromDDMMYYYYToWord(savingsAccHistToRender().timestamp)}
            </TextColourizer>
            <TrashIcon
               darktheme={BoolHelper.toString(isDarkTheme)}
               height={'2em'}
               onClick={() => handleDelete()}
            />
         </FlexRowWrapper>

         <FlexColumnWrapper padding="0em 2em 1em 2em">
            <CardWidgetWrapper bgColor={Color.lightThm.accent} height="7em">
               <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 1em">
                  <TextColourizer fontSize="1.25em" bold padding={'0.25em 0em'}>
                     {SavingsClass.getNameFromId(
                        savingsAccHistToRender().id,
                        savingsAccounts || {},
                     )}
                  </TextColourizer>
                  <TextColourizer fontSize="0.9em">
                     <TextColourizer fontSize="0.9em" bold>
                        Balance:&nbsp;
                     </TextColourizer>
                     {NumberHelper.asCurrencyStr(savingsAccHistToRender().balance)}
                  </TextColourizer>
               </FlexColumnWrapper>
               <FlexColumnWrapper height={'100%'} justifyContent="center" padding={'0em 0.5em'}>
                  <BuildingBank height={'90%'} color={Color.lightThm.border} />
               </FlexColumnWrapper>
            </CardWidgetWrapper>

            <ConditionalRender condition={savingsAccTargetToReach() > 0}>
               <CardWidgetWrapper bgColor={Color.lightThm.warning} height="7em">
                  <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 1em">
                     <TextColourizer fontSize="1.25em" bold padding={'0.25em 0em'}>
                        Target
                     </TextColourizer>
                     <TextColourizer fontSize="0.9em">
                        {NumberHelper.asCurrencyStr(savingsAccTargetToReach())}
                     </TextColourizer>
                  </FlexColumnWrapper>
                  <FlexColumnWrapper height={'100%'} justifyContent="center" padding={'0em 0.5em'}>
                     <TargetArrow height={'90%'} color={Color.lightThm.border} />
                  </FlexColumnWrapper>
               </CardWidgetWrapper>

               <FlexColumnWrapper>
                  <TextColourizer fontSize="1.5em" bold padding="0.5em 0em 0em 0em">
                     Progress
                  </TextColourizer>
                  <FlexRowWrapper justifyContent="center" padding={'1em 5em 5em 5em'}>
                     <CircularProgressbar
                        value={calculatePercentage()}
                        text={`${calculatePercentage()}%`}
                        styles={buildStyles({
                           textColor: Color.lightThm.accent,
                           pathColor: Color.lightThm.accent,
                           trailColor: Color.darkThm.inactive,
                        })}
                     />
                  </FlexRowWrapper>
               </FlexColumnWrapper>
            </ConditionalRender>
         </FlexColumnWrapper>
      </CarouselAndNavBarWrapper>
   );
}
