import { useContext, useEffect, useState } from 'react';
import { CardLoadingPlaceholder } from '../../../../../global/components/lib/dashboardCards/placeholder/CardLoadingPlaceholder';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { CurrencyOnCardTxt } from '../../../../../global/components/lib/font/currencyOnCardText/CurrencyOnCardTxt';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { SelectIcon } from '../../../../../global/components/lib/icons/select/SelectIcon';
import { FlexCenterer } from '../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { PopupMenuContext } from '../../../../../global/context/widget/popupMenu/PopupMenuContext';
import Color from '../../../../../global/css/colors';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useURLState from '../../../../../global/hooks/useURLState';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';
import ExcludePausedExpensePopupMenu from './excludePausedPopupMenu/ExcludePausedExpensePopupMenu';
import NTotalExpense from './namespace/NTotalExpense';

export default function TotalExpense(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { data: expenseData, isLoading, isPaused, error } = ExpensesClass.useQuery.getExpenses();
   const [totalExpense, setTotalExpense] = useState<number>(0);
   const [totalUnpausedExpense, setTotalUnpausedExpense] = useState<number>(0);
   const [isPausedExcluded] = useURLState<BoolHelper.IAsString>({
      key: NTotalExpense.key.isPausedExcluded,
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
         const expenseDataAsArr = ObjectOfObjects.convertToArrayOfObj(expenseData);
         setTotalExpense(NTotalExpense.getTotal.all(expenseDataAsArr));
         setTotalUnpausedExpense(NTotalExpense.getTotal.unpaused(expenseDataAsArr));
      }
   }, [expenseData]);

   function handleSelectorClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>): void {
      togglePM(true);
      setPMContent(<ExcludePausedExpensePopupMenu />);
      setClickEvent(e);
      setPMHeightPx(2 * 35);
      setPMWidthPx(200);
      setCloseOnInnerClick(true);
   }

   function displayExpenseAmount(): string {
      const amount = BoolHelper.strToBool(isPausedExcluded) ? totalUnpausedExpense : totalExpense;
      return NumberHelper.asCurrencyStr(amount, true);
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
         <FlexRowWrapper padding="0em 0em 1em 0em" alignItems="center">
            <TextColourizer
               color={Color.setRgbOpacity(
                  isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
                  0.9,
               )}
            >
               Total Expense
            </TextColourizer>
            <SelectIcon
               height={'1em'}
               darktheme={BoolHelper.boolToStr(isDarkTheme)}
               onClick={handleSelectorClick}
               zindex="1"
               padding="0em 0em 0em 0.25em"
            />
         </FlexRowWrapper>

         <TextColourizer padding="0em 0em 0em 0.2em">
            <ConditionalRender condition={totalExpense !== 0}>
               <CurrencyOnCardTxt
                  isDarkTheme={isDarkTheme}
                  color={Color.setRgbOpacity(
                     isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
                     0.8,
                  )}
               >
                  {displayExpenseAmount()}
               </CurrencyOnCardTxt>
            </ConditionalRender>
            <ConditionalRender condition={totalExpense === 0}>
               <TextColourizer color={'darkgrey'} fontSize="0.85em">
                  No Data to Display
               </TextColourizer>
            </ConditionalRender>
         </TextColourizer>
      </FlexColumnWrapper>
   );
}
