import { Fragment, useContext, useEffect, useState } from 'react';
import { CardLoadingPlaceholder } from '../../../../../global/components/lib/dashboardCards/placeholder/CardLoadingPlaceholder';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { CurrencyOnCardTxt } from '../../../../../global/components/lib/font/currencyOnCardText/CurrencyOnCardTxt';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { TriangularArrowIcon } from '../../../../../global/components/lib/icons/arrows/TriangularArrow';
import { FilterIcon } from '../../../../../global/components/lib/icons/filter/FilterIcon';
import LineChart from '../../../../../global/components/lib/lineChart/LineChart';
import LineChartHelper from '../../../../../global/components/lib/lineChart/class/LineChartHelper';
import { FlexCenterer } from '../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { PopupMenuContext } from '../../../../../global/context/widget/popupMenu/PopupMenuContext';
import Color from '../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
import useURLState from '../../../../../global/hooks/useURLState';
import NDist from '../../../distribute/namespace/NDist';
import FilterSpendingsPopupMenu from './filterPopupMenu/FilterSpendingsPopupMenu';
import SpendingsChart from './namespace/SpendingsChart';

export default function SpendingsAnalytics(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { data: calcDistData, isLoading, isPaused, error } = NDist.API.useQuery.getCalcDist();
   const [xAxisLabels, setXAxisLabels] = useState<string[]>(['']);
   const [totalSpendingsValues, setTotalSpendingsValues] = useState<number[]>([0]);
   const [disposableSpendingsValues, setDisposableSpendingsValues] = useState<number[]>([0]);
   const [expensesSpendingsValues, setExpensesSpendingsValues] = useState<number[]>([0]);
   const [latestSpendingsPercChange, setLatestSpendingsPercChange] = useState<number>(0);
   const [filterOutState] = useURLState({ key: SpendingsChart.filtererKey });
   const {
      setPMContent,
      setPMHeightPx,
      togglePM,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   useEffect(() => {
      const analytics = calcDistData?.analytics;
      if (MiscHelper.isNotFalsyOrEmpty(analytics)) {
         setXAxisLabels(SpendingsChart.getXAxisLabels(analytics));
         setLatestSpendingsPercChange(calcLatestSpendingsPercChange(analytics));
         if (!filterOutState.includes('totalSpendings')) {
            setTotalSpendingsValues(SpendingsChart.getSpendingsValues('totalSpendings', analytics));
         } else {
            setTotalSpendingsValues([0]);
         }
         if (!filterOutState.includes('totalDisposableSpending')) {
            setDisposableSpendingsValues(
               SpendingsChart.getSpendingsValues('totalDisposableSpending', analytics),
            );
         } else {
            setDisposableSpendingsValues([0]);
         }
         if (!filterOutState.includes('totalExpensesSpending')) {
            setExpensesSpendingsValues(SpendingsChart.getExpenseSpendingsValues(analytics));
         } else {
            setExpensesSpendingsValues([0]);
         }
      }
   }, [calcDistData, filterOutState]);

   function calcLatestSpendingsPercChange(analytics: NDist.IAnalytics[]): number {
      const orderedAnalytics = ArrayOfObjects.sortByDateStr(analytics, 'timestamp', true);
      const totalSpendingsValues = SpendingsChart.getSpendingsValues(
         'totalSpendings',
         orderedAnalytics,
      );
      if (!totalSpendingsValues || totalSpendingsValues.length < 2) return 0;
      const prevMonthTotalSpendings = totalSpendingsValues[totalSpendingsValues.length - 2];
      const currentMonthTotalSpendings = totalSpendingsValues[totalSpendingsValues.length - 1];
      const percentageChange = NumberHelper.calcPercentageChange(
         prevMonthTotalSpendings,
         currentMonthTotalSpendings,
      );
      return percentageChange;
   }

   const options = LineChartHelper.constructOptions(SpendingsChart.config(isDarkTheme));
   const chartDataAndStyles = SpendingsChart.dataAndStyles(
      isDarkTheme,
      totalSpendingsValues,
      disposableSpendingsValues,
      expensesSpendingsValues,
   );
   const data = LineChartHelper.constructData(
      SpendingsChart.linePointStyles,
      chartDataAndStyles,
      xAxisLabels,
   );

   function handleFilterClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>): void {
      togglePM(true);
      setPMContent(<FilterSpendingsPopupMenu />);
      setClickEvent(e);
      setPMHeightPx(100);
      setPMWidthPx(200);
      setCloseOnInnerClick(false);
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
   if (error || !calcDistData) {
      return (
         <FlexCenterer height="90%" width="100%">
            <FetchError />
         </FlexCenterer>
      );
   }

   function handleShowPlaceholder(): boolean {
      const analyticsArr = calcDistData?.analytics
      if (!MiscHelper.isNotFalsyOrEmpty(analyticsArr)) return true;
      if (analyticsArr.length <= 1) return true;
      return false;
      
   }

   return (
      <>
         <LineChart
            title="Spendings"
            options={options}
            data={data}
            showPlaceholder={handleShowPlaceholder()}
            titleElement={
               <FilterIcon
                  height="1em"
                  darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  onClick={(e) => handleFilterClick(e)}
               />
            }
            infoComponentPlacemenet="right"
            infoComponent={
               <Fragment>
                  <FlexRowWrapper justifyContent="end" alignItems="end" padding="0em 0em 0.3em 0em">
                     <CurrencyOnCardTxt isDarkTheme={isDarkTheme}>
                        {NumberHelper.asCurrencyStr(
                           totalSpendingsValues[totalSpendingsValues.length - 1],
                        )}
                     </CurrencyOnCardTxt>
                  </FlexRowWrapper>
                  <FlexRowWrapper justifyContent="end" alignItems="center">
                     <TextColourizer
                        fontSize="0.9em"
                        color={Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.8)}
                     >
                        {xAxisLabels[xAxisLabels.length - 1]}&nbsp;&nbsp;
                     </TextColourizer>

                     <TriangularArrowIcon
                        size="0.9em"
                        darktheme={BoolHelper.boolToStr(isDarkTheme)}
                        type={latestSpendingsPercChange > 0 ? 'error' : 'success'}
                        direction={latestSpendingsPercChange > 0 ? 'up' : 'down'}
                     />
                     <TextColourizer
                        fontSize="0.9em"
                        color={
                           latestSpendingsPercChange < 0
                              ? Color.setRgbOpacity(Color.darkThm.success, 0.8)
                              : Color.setRgbOpacity(Color.darkThm.error, 0.8)
                        }
                        padding="0em 0em 0em 0.15em"
                     >
                        {latestSpendingsPercChange}%
                     </TextColourizer>
                  </FlexRowWrapper>
               </Fragment>
            }
         ></LineChart>
      </>
   );
}
