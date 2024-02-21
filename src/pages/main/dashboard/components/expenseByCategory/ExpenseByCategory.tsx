import { useContext, useEffect, useState } from 'react';
import { CardLoadingPlaceholder } from '../../../../../global/components/lib/dashboardCards/placeholder/CardLoadingPlaceholder';
import DonutChart from '../../../../../global/components/lib/donutChart/DonutChart';
import DonutChartHelper from '../../../../../global/components/lib/donutChart/namespace/DonutChartHelper';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { SelectIcon } from '../../../../../global/components/lib/icons/select/SelectIcon';
import { FlexCenterer } from '../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { PopupMenuContext } from '../../../../../global/context/widget/popupMenu/PopupMenuContext';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useURLState from '../../../../../global/hooks/useURLState';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';
import ExpenseChart from './namespace/ExpenseChart';
import SelectExpenseByPopupMenu from './selectExpenseByPopupMenu/SelectExpenseByPopupMenu';

export default function ExpenseByCategory(): JSX.Element {
   const { data: expenseData, isLoading, isPaused, error } = ExpensesClass.useQuery.getExpenses();
   const [donutChartLabels, setDonutChartLabels] = useState<string[]>([]);
   const [donutChartData, setDonutChartData] = useState<number[]>([]);
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const [expenseBy] = useURLState<ExpenseChart.Selector.IExpenseBy>({
      key: ExpenseChart.Selector.key,
      defaultValue: 'expenseType',
   });
   const {
      setPMContent,
      setPMHeightPx,
      togglePM,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(expenseData)) {
         const expenseAsArr = ObjectOfObjects.convertToArrayOfObj(expenseData);
         const { expenseLabels, expenseValues } = ExpenseChart.Selector.getLabelsAndValues(
            expenseAsArr,
            expenseBy,
         );
         setDonutChartLabels(expenseLabels);
         setDonutChartData(expenseValues);
      }
   }, [expenseData, expenseBy]);

   const options = DonutChartHelper.constructOptions({ holeSizeAsPercentage: 70 });
   const data = DonutChartHelper.constructData({
      data: donutChartData,
      labels: donutChartLabels,
      backgroundColors: ExpenseChart.backgroundColors(isDarkTheme),
      borderColors: ExpenseChart.borderColors(isDarkTheme),
      borderWidth: ExpenseChart.borderWidth,
   });

   function handleSelectorClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>): void {
      togglePM(true);
      setPMContent(<SelectExpenseByPopupMenu />);
      setClickEvent(e);
      setPMHeightPx(5 * 35);
      setPMWidthPx(200);
      setCloseOnInnerClick(true);
   }

   if (isLoading && !isPaused && isPortableDevice) {
      return <CardLoadingPlaceholder isDarkTheme={isDarkTheme} />;
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

   function setTitle(): string {
      const expenseByStr = expenseBy.includes('expense') ? expenseBy.slice(7) : expenseBy;
      return `Expense: ${expenseByStr.charAt(0).toUpperCase()}${expenseByStr.slice(1)}`;
   }

   return (
      <>
         <DonutChart
            title={setTitle()}
            data={data}
            options={options}
            showPlaceholder={!MiscHelper.isNotFalsyOrEmpty(expenseData)}
            popupMenu={
               <SelectIcon
                  height={'1em'}
                  darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  onClick={handleSelectorClick}
                  zindex="1"
                  padding="0em 0em 0em 0.25em"
               />
            }
         />
      </>
   );
}
