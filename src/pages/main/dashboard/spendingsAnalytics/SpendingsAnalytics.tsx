import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { Fragment, useEffect, useState } from 'react';
import CardListPlaceholder from '../../../../global/components/lib/cardList/placeholder/CardListPlaceholder';
import FetchError from '../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { CurrencyOnCardTxt } from '../../../../global/components/lib/font/currencyOnCardText/CurrencyOnCardTxt';
import { TextColourizer } from '../../../../global/components/lib/font/textColorizer/TextColourizer';
import { TriangularArrowIcon } from '../../../../global/components/lib/icons/arrows/TriangularArrow';
import LineChart from '../../../../global/components/lib/lineChart/LineChart';
import LineChartHelper from '../../../../global/components/lib/lineChart/class/LineChartHelper';
import Loader from '../../../../global/components/lib/loader/Loader';
import { FlexRowWrapper } from '../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../global/css/colors';
import BoolHelper from '../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NumberHelper from '../../../../global/helpers/dataTypes/number/NumberHelper';
import NDist from '../../distribute/namespace/NDist';
import SpendingsChart from './class';

//TODO: NEXT: Add a filterer next to the title of the chart to filter out disposable spendings / expenses spendings / total spendings
//TODO: NEXT: Create a Placeholder for this component if the data is empty / or set some default dummy data if the data is empty

export default function SpendingsAnalytics() {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { data: calcDistData, isLoading, isPaused, error } = NDist.API.useQuery.getCalcDist();
   const [xAxisLabels, setXAxisLabels] = useState<string[]>(['']);
   const [totalSpendingsValues, setTotalSpendingsValues] = useState<number[]>([0]);
   const [disposableSpendingsValues, setDisposableSpendingsValues] = useState<number[]>([0]);
   const [expensesSpendingsValues, setExpensesSpendingsValues] = useState<number[]>([0]);
   const [latestSpendingsPercChange, setLatestSpendingsPercChange] = useState<number>(0);

   useEffect(() => {
      const analytics = calcDistData?.analytics;
      if (MiscHelper.isNotFalsyOrEmpty(analytics)) {
         setXAxisLabels(SpendingsChart.getXAxisLabels(analytics));
         setTotalSpendingsValues(SpendingsChart.getSpendingsValues('totalSpendings', analytics));
         setDisposableSpendingsValues(
            SpendingsChart.getSpendingsValues('totalDisposableSpending', analytics),
         );
         setExpensesSpendingsValues(SpendingsChart.getExpenseSpendingsValues(analytics));
         setLatestSpendingsPercChange(calcLatestSpendingsPercChange(analytics));
      }
   }, [calcDistData]);

   function calcLatestSpendingsPercChange(analytics: NDist.IAnalytics[]): number {
      const totalSpendingsValues = SpendingsChart.getSpendingsValues('totalSpendings', analytics);
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

   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <CardListPlaceholder repeatItemCount={7} />;
   }
   if (isPaused) return <OfflineFetch />;
   if (error || !calcDistData) return <FetchError />;
   return (
      <>
         <LineChart
            width="30em"
            title="Spendings"
            options={options}
            data={data}
            infoComponent={
               <Fragment>
                  <FlexRowWrapper justifyContent="end" alignItems="end" padding="0em 0em 0.3em 0em">
                     <CurrencyOnCardTxt isDarkTheme={isDarkTheme}>
                        {NumberHelper.asCurrencyStr(
                           totalSpendingsValues[totalSpendingsValues.length - 1],
                        )}
                     </CurrencyOnCardTxt>
                     <TextColourizer fontSize="0.9em">&nbsp;&nbsp;GBP</TextColourizer>
                  </FlexRowWrapper>
                  <FlexRowWrapper justifyContent="end" alignItems="center">
                     <TextColourizer
                        fontSize="0.9em"
                        color={Color.setRgbOpacity(Color.darkThm.txt, 0.7)}
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
