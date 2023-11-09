import { useEffect } from 'react';
import useLocalStorage from '../../../../../global/hooks/useLocalStorage';
import { ICalcSchema } from '../calculation/CalculateDist';

interface IAnalyticsDetails {
   analyticsItem: ICalcSchema['analytics'][0];
}

export default function AnalyticsDetails(props: IAnalyticsDetails): JSX.Element {
   const { analyticsItem } = props;
   const [prevAnalyticsItem, setPrevAnalyticsItem] = useLocalStorage(
      'prevAnalyticsItem',
      analyticsItem,
   );

   useEffect(() => {
      if (analyticsItem) {
         setPrevAnalyticsItem(analyticsItem);
      }
   }, []);

   function analyticsToRender(): ICalcSchema['analytics'][0] {
      if (!analyticsItem) return prevAnalyticsItem;
      return analyticsItem;
   }

   return (
      <div>
         {analyticsToRender().timestamp}
         {analyticsToRender().prevMonth.totalDisposableSpending}
         {analyticsToRender().prevMonth.totalSpendings}
         {analyticsToRender().prevMonth.totalSavings}
         {analyticsToRender().totalExpenses}
         {analyticsToRender().totalIncomes}
      </div>
   );
}
