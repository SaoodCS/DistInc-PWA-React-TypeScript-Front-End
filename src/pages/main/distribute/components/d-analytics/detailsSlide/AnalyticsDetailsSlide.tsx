import { CashStack as Dollar } from '@styled-icons/bootstrap/CashStack';
import { Receipt } from '@styled-icons/bootstrap/Receipt';
import { DocumentTextClock } from '@styled-icons/fluentui-system-filled/DocumentTextClock';
import { useQueryClient } from '@tanstack/react-query';
import { Fragment, useContext, useEffect } from 'react';
import { CardWidgetWrapper } from '../../../../../../global/components/lib/card/Card';
import { CarouselAndNavBarWrapper } from '../../../../../../global/components/lib/carousel/NavBar';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { TrashIcon } from '../../../../../../global/components/lib/icons/delete/TrashIcon';
import { FlexColumnWrapper } from '../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../../global/css/colors';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import useSessionStorage from '../../../../../../global/hooks/useSessionStorage';
import { DistributeContext } from '../../../context/DistributeContext';
import NDist from '../../../namespace/NDist';

export default function AnalyticsDetailsSlide(): JSX.Element {
   const { slide2Data } = useContext(DistributeContext);
   const analyticsItem = slide2Data as NDist.IAnalytics;
   const [prevAnalyticsItem, setPrevAnalyticsItem] = useSessionStorage(
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
            {analyticsDetailsMapper(analyticsToRender()).map((item) => (
               <CardWidgetWrapper bgColor={item.color} height={item.cardHeight}>
                  <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 1em">
                     <TextColourizer fontSize="1.5em" bold padding={'0.25em 0em'}>
                        {item.title}
                     </TextColourizer>
                     {item.key !== 'prevMonth' && (
                        <TextColourizer fontSize="1em">
                           {NumberHelper.asCurrencyStr(item.data as number)}
                        </TextColourizer>
                     )}
                     {item.key === 'prevMonth' && (
                        <Fragment>
                           {(item.data as IPrevMonthData[]).map((data) => (
                              <TextColourizer fontSize="0.9em" padding="0.1em 0em">
                                 <TextColourizer bold>{data.title}</TextColourizer>
                                 {NumberHelper.asCurrencyStr(data.data)}
                              </TextColourizer>
                           ))}
                        </Fragment>
                     )}
                  </FlexColumnWrapper>
                  <FlexColumnWrapper
                     height={'100%'}
                     justifyContent="center"
                     padding={item.key === 'prevMonth' ? '0em 0em' : '0em 0.5em'}
                  >
                     {item.icon}
                  </FlexColumnWrapper>
               </CardWidgetWrapper>
            ))}
         </FlexColumnWrapper>
      </CarouselAndNavBarWrapper>
   );
}

// ------------------------------ UTILITIES ------------------------------ //

const analyticsDetailsMapper = (analyticsItem: NDist.IAnalytics) => [
   {
      key: 'totalIncomes',
      title: 'Total Income',
      icon: <Dollar height="90%" color={Color.lightThm.border} />,
      color: Color.lightThm.accent,
      data: analyticsItem.totalIncomes,
      cardHeight: '6em',
   },
   {
      key: 'totalExpenses',
      title: 'Total Expense',
      icon: <Receipt height="90%" color={Color.lightThm.border} />,
      color: Color.lightThm.warning,
      data: analyticsItem.totalExpenses,
      cardHeight: '6em',
   },
   {
      key: 'prevMonth',
      title: `Prev Month - ${DateHelper.getPrevMonthName(analyticsItem.timestamp)}`,
      icon: <DocumentTextClock height="80%" color={Color.lightThm.border} />,
      color: Color.lightThm.error,
      cardHeight: '8em',
      data: [
         {
            key: 'totalSpendings',
            data: analyticsItem.prevMonth.totalSpendings,
            title: 'Total Spent: ',
         },
         {
            key: 'totalDisposableSpending',
            data: analyticsItem.prevMonth.totalDisposableSpending,
            title: 'Disposable Spent: ',
         },
         {
            key: 'totalSavings',
            data: analyticsItem.prevMonth.totalSavings,
            title: 'Total Saved: ',
         },
      ],
   },
];

type IPrevMonthData = {
   key: string;
   data: number;
   title: string;
};
