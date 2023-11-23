import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { useEffect, useState } from 'react';
import DonutChart from '../../../../../global/components/lib/donutChart/DonutChart';
import DonutChartHelper from '../../../../../global/components/lib/donutChart/namespace/DonutChartHelper';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import RelativeLoader from '../../../../../global/components/lib/loader/RelativeLoader';
import { FlexCenterer } from '../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';
import ExpenseChart from './namespace/ExpenseChart';

export default function ExpenseByCategory() {
   const { data: expenseData, isLoading, isPaused, error } = ExpensesClass.useQuery.getExpenses();
   const [donutChartLabels, setDonutChartLabels] = useState<string[]>([]);
   const [donutChartData, setDonutChartData] = useState<number[]>([]);
   const { isDarkTheme, isPortableDevice } = useThemeContext();

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(expenseData)) {
         const expenseAsArr = ObjectOfObjects.convertToArrayOfObj(expenseData);
         const { expenseTypes: categories, expenseValues } =
            ExpenseChart.getTypesAndSumValues(expenseAsArr);
         setDonutChartLabels(categories);
         setDonutChartData(expenseValues);
      }
   }, [expenseData]);

   const options = DonutChartHelper.constructOptions({ holeSizeAsPercentage: 70 });
   const data = DonutChartHelper.constructData({
      data: donutChartData,
      labels: donutChartLabels,
      backgroundColors: ExpenseChart.backgroundColors(isDarkTheme),
      borderColors: ExpenseChart.borderColors(isDarkTheme),
      borderWidth: ExpenseChart.borderWidth,
   });

   if (isLoading && !isPaused && isPortableDevice) {
      return <RelativeLoader isDisplayed />;
   }
   if (isPaused) {
      return (
         <FlexCenterer height="100%" width="100%">
            <OfflineFetch />
         </FlexCenterer>
      );
   }
   if (error || !expenseData) {
      return (
         <FlexCenterer height="90%" width="100%">
            <FetchError />
         </FlexCenterer>
      );
   }

   return (
      <>
         <DonutChart title="Expense by category" data={data} options={options} />
      </>
   );
}
