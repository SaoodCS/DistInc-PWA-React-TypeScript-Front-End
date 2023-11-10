import { useContext, useEffect } from 'react';
import useLocalStorage from '../../../../../../global/hooks/useLocalStorage';
import type NDist from '../../../namespace/NDist';
import { DistributeContext } from '../../../context/DistributeContext';

interface IAnalyticsDetails {
   analyticsItem: NDist.IAnalytics;
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

   function analyticsToRender(): NDist.IAnalytics {
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
