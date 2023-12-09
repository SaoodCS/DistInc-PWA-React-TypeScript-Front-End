import { useEffect, useState } from 'react';
import { CardLoadingPlaceholder } from '../../../../../global/components/lib/dashboardCards/placeholder/CardLoadingPlaceholder';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { CurrencyOnCardTxt } from '../../../../../global/components/lib/font/currencyOnCardText/CurrencyOnCardTxt';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexCenterer } from '../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';

export default function TotalExpense(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { data: expenseData, isLoading, isPaused, error } = ExpensesClass.useQuery.getExpenses();
   const [latestTotalExpense, setLatestTotalExpense] = useState<number>(0);

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(expenseData)) {
         const expenseDataAsArr = ObjectOfObjects.convertToArrayOfObj(expenseData);
         const total = ArrayOfObjects.calcSumOfKeyValue(expenseDataAsArr, 'expenseValue');
         setLatestTotalExpense(total);
      }
   }, [expenseData]);

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
            <FetchError iconHeightEm={2} />
         </FlexCenterer>
      );
   }

   return (
      <FlexColumnWrapper
         padding={'0em 1em 0em 1em'}
         height="100%"
         width="100%"
         justifyContent="center"
      >
         <TextColourizer
            padding="0em 0em 1em 0em"
            color={Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.9)}
         >
            Total Expense
         </TextColourizer>
         <TextColourizer padding="0em 0em 0em 0.2em">
            <ConditionalRender condition={latestTotalExpense !== 0}>
               <CurrencyOnCardTxt
                  isDarkTheme={isDarkTheme}
                  color={Color.setRgbOpacity(
                     isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
                     0.8,
                  )}
               >
                  -{NumberHelper.asCurrencyStr(latestTotalExpense, true)}
               </CurrencyOnCardTxt>
            </ConditionalRender>
            <ConditionalRender condition={latestTotalExpense === 0}>
               <TextColourizer color={'darkgrey'} fontSize="0.85em">
                  No Data to Display
               </TextColourizer>
            </ConditionalRender>
         </TextColourizer>
      </FlexColumnWrapper>
   );
}
