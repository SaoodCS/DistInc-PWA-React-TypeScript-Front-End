import { CashStack as Dollar } from '@styled-icons/bootstrap/CashStack';
import { Receipt } from '@styled-icons/bootstrap/Receipt';
import { DocumentTextClock } from '@styled-icons/fluentui-system-filled/DocumentTextClock';
import { useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { CarouselAndNavBarWrapper } from '../../../../../../global/components/lib/carousel/NavBar';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { TrashIcon } from '../../../../../../global/components/lib/icons/delete/TrashIcon';
import { FlexRowWrapper } from '../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../../global/css/colors';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import useLocalStorage from '../../../../../../global/hooks/useLocalStorage';
import { DistributeContext } from '../../../context/DistributeContext';
import NDist from '../../../namespace/NDist';

const CardWidgetWrapper = styled.div<{ bgColor: string; height?: string }>`
   height: ${({ height }) => height || '6em'};
   margin-bottom: 1em;
   width: 100%;
   border-radius: 10px;
   background-color: ${({ bgColor }) => bgColor};
   display: flex;
   flex-direction: row;
   justify-content: space-between;
`;

export const FlexColumnWrapper = styled.div<{
   justifyContent?: string;
   padding?: string;
   height?: string;
   width?: string;
}>`
   display: flex;
   flex-direction: column;
   justify-content: ${({ justifyContent }): string =>
      justifyContent ? justifyContent : 'flex-start'};
   padding: ${({ padding }): string => (padding ? padding : '0')};
   height: ${({ height }) => height};
`;

export default function AnalyticsDetails(): JSX.Element {
   const { slide2Data } = useContext(DistributeContext);
   const analyticsItem = slide2Data as NDist.IAnalytics;
   const [prevAnalyticsItem, setPrevAnalyticsItem] = useLocalStorage(
      'prevAnalyticsItem',
      analyticsItem,
   );
   const { isDarkTheme } = useThemeContext();
   const { scrollToSlide } = useContext(DistributeContext);

   const queryClient = useQueryClient();
   const delCalcDistItemInFirestore = NDist.API.useMutation.delCalcDist({
      onSuccess: () => {
         // eslint-disable-next-line @typescript-eslint/no-floating-promises
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
         scrollToSlide(1);
      },
   });

   useEffect(() => {
      if (analyticsItem) {
         setPrevAnalyticsItem(analyticsItem);
      }
   }, []);

   function analyticsToRender(): NDist.IAnalytics {
      if (!analyticsItem) return prevAnalyticsItem;
      return analyticsItem;
   }

   async function handleDelete(): Promise<void> {
      await delCalcDistItemInFirestore.mutateAsync({
         type: 'analyticsItem',
         data: analyticsToRender(),
      });
   }

   return (
      <CarouselAndNavBarWrapper style={{ width: '100%' }}>
         <FlexRowWrapper padding="2em">
            <TextColourizer fontSize="2em" bold padding="0em 0.25em 0em 0em">
               {analyticsToRender().timestamp}
            </TextColourizer>
            <TrashIcon
               darktheme={BoolHelper.toString(isDarkTheme)}
               height={'2em'}
               onClick={() => handleDelete()}
            />
         </FlexRowWrapper>

         <FlexColumnWrapper padding="0em 2em 1em 2em">
            <CardWidgetWrapper bgColor={Color.lightThm.accent}>
               <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 1em">
                  <TextColourizer fontSize="1.5em" bold padding={'0.25em 0em'}>
                     Total Income
                  </TextColourizer>
                  <TextColourizer fontSize="1em">
                     {NumberHelper.asCurrencyStr(analyticsToRender().totalIncomes)}
                  </TextColourizer>
               </FlexColumnWrapper>
               <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 0.5em">
                  <Dollar height="90%" color={Color.lightThm.border} />
               </FlexColumnWrapper>
            </CardWidgetWrapper>

            <CardWidgetWrapper bgColor={Color.lightThm.warning}>
               <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 1em">
                  <TextColourizer fontSize="1.5em" bold padding={'0.25em 0em'}>
                     Total Expense
                  </TextColourizer>
                  <TextColourizer fontSize="1em">
                     {NumberHelper.asCurrencyStr(analyticsToRender().totalExpenses)}
                  </TextColourizer>
               </FlexColumnWrapper>
               <FlexColumnWrapper height={'100%'} justifyContent="center">
                  <Receipt height="90%" color={Color.lightThm.border} />
               </FlexColumnWrapper>
            </CardWidgetWrapper>

            <CardWidgetWrapper bgColor={Color.lightThm.error} height={'8em'}>
               <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 1em">
                  <TextColourizer fontSize="1.5em" bold padding={'0.25em 0em'}>
                     Prev Month - {DateHelper.getPrevMonthName(analyticsToRender().timestamp)}
                  </TextColourizer>
                  <TextColourizer fontSize="0.9em" padding={'0.1em 0em'}>
                     <TextColourizer bold>{`Total Spent: `}</TextColourizer>
                     {NumberHelper.asCurrencyStr(analyticsToRender().prevMonth.totalSpendings)}
                  </TextColourizer>
                  <TextColourizer fontSize="0.9em" padding={'0.1em 0em'}>
                     <TextColourizer bold>{`Disposable: `}</TextColourizer>
                     {NumberHelper.asCurrencyStr(
                        analyticsToRender().prevMonth.totalDisposableSpending,
                     )}
                  </TextColourizer>
                  <TextColourizer fontSize="0.9em" padding={'0.1em 0em'}>
                     <TextColourizer bold>{`Total Saved: `}</TextColourizer>
                     {NumberHelper.asCurrencyStr(analyticsToRender().prevMonth.totalSavings)}
                  </TextColourizer>
               </FlexColumnWrapper>
               <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 0em">
                  <DocumentTextClock height="80%" color={Color.lightThm.border} />
               </FlexColumnWrapper>
            </CardWidgetWrapper>
         </FlexColumnWrapper>
      </CarouselAndNavBarWrapper>
   );
}
