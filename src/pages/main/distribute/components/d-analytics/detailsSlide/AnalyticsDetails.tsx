import { useContext, useEffect } from 'react';
import useLocalStorage from '../../../../../../global/hooks/useLocalStorage';
import { DistributeContext } from '../../../context/DistributeContext';
import type NDist from '../../../namespace/NDist';

export default function AnalyticsDetails(): JSX.Element {
   const { slide2Data } = useContext(DistributeContext);
   const analyticsItem = slide2Data as NDist.IAnalytics;
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
