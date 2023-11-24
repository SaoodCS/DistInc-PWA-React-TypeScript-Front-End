import { Fragment, useEffect, useState } from 'react';
import { CardLoadingPlaceholder } from '../../../../../global/components/lib/dashboardCards/placeholder/CardLoadingPlaceholder';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { CurrencyOnCardTxt } from '../../../../../global/components/lib/font/currencyOnCardText/CurrencyOnCardTxt';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { TriangularArrowIcon } from '../../../../../global/components/lib/icons/arrows/TriangularArrow';
import LineChart from '../../../../../global/components/lib/lineChart/LineChart';
import LineChartHelper from '../../../../../global/components/lib/lineChart/class/LineChartHelper';
import { FlexCenterer } from '../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
import NDist from '../../../distribute/namespace/NDist';
import SavingsChart from './namespace/SavingsChart';

export default function TotalSavings(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { data: calcDistData, isLoading, isPaused, error } = NDist.API.useQuery.getCalcDist();
   const [xAxisLabels, setXAxisLabels] = useState<string[]>(['']);
   const [totalSavingsValues, setTotalSavingsValues] = useState<number[]>([0]);
   const [latestSavingsPercChange, setLatestSavingsPercChange] = useState<number>(0);

   useEffect(() => {
      const analytics = calcDistData?.analytics;
      if (MiscHelper.isNotFalsyOrEmpty(analytics)) {
         setXAxisLabels(SavingsChart.getXAxisLabels(analytics));
         setLatestSavingsPercChange(calcLatestSavingsPercChange(analytics));
         setTotalSavingsValues(SavingsChart.getSavingsValues('totalSavings', analytics));
      }
   }, [calcDistData]);

   function calcLatestSavingsPercChange(analytics: NDist.IAnalytics[]): number {
      const orderedAnalytics = ArrayOfObjects.sortByDateStr(analytics, 'timestamp', true);
      const totalSavingsValues = SavingsChart.getSavingsValues('totalSavings', orderedAnalytics);
      if (!totalSavingsValues || totalSavingsValues.length < 2) return 0;
      const prevMonthTotalSavings = totalSavingsValues[totalSavingsValues.length - 2];
      const currentMonthTotalSavings = totalSavingsValues[totalSavingsValues.length - 1];
      const percentageChange = NumberHelper.calcPercentageChange(
         prevMonthTotalSavings,
         currentMonthTotalSavings,
      );
      return percentageChange;
   }

   const options = LineChartHelper.constructOptions(SavingsChart.config(isDarkTheme));
   const chartDataAndStyles = SavingsChart.dataAndStyles(isDarkTheme, totalSavingsValues);

   const data = LineChartHelper.constructData(
      SavingsChart.linePointStyles,
      chartDataAndStyles,
      xAxisLabels,
   );

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
      const analyticsArr = calcDistData?.analytics;
      if (!MiscHelper.isNotFalsyOrEmpty(analyticsArr)) return true;
      if (analyticsArr.length <= 1) return true;
      return false;
   }

   return (
      <>
         <LineChart
            title="Total Savings"
            options={options}
            data={data}
            showPlaceholder={handleShowPlaceholder()}
            infoComponentPlacemenet="belowTitle"
            infoComponent={
               <Fragment>
                  <FlexRowWrapper justifyContent="end" alignItems="end" padding="0em 0em 0.3em 0em">
                     <CurrencyOnCardTxt isDarkTheme={isDarkTheme}>
                        {NumberHelper.asCurrencyStr(
                           totalSavingsValues[totalSavingsValues.length - 1],
                           true,
                        )}
                     </CurrencyOnCardTxt>
                  </FlexRowWrapper>
                  <FlexRowWrapper justifyContent="start" alignItems="center">
                     <TextColourizer
                        fontSize="0.9em"
                        color={Color.setRgbOpacity(
                           isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
                           0.8,
                        )}
                     >
                        {xAxisLabels[xAxisLabels.length - 1]}&nbsp;&nbsp;
                     </TextColourizer>
                     <TriangularArrowIcon
                        size="0.9em"
                        darktheme={BoolHelper.boolToStr(isDarkTheme)}
                        type={latestSavingsPercChange > 0 ? 'success' : 'error'}
                        direction={latestSavingsPercChange > 0 ? 'up' : 'down'}
                     />
                     <TextColourizer
                        fontSize="0.9em"
                        color={
                           latestSavingsPercChange < 0
                              ? Color.setRgbOpacity(
                                   isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
                                   0.8,
                                )
                              : Color.setRgbOpacity(
                                   isDarkTheme ? Color.darkThm.success : Color.lightThm.success,
                                   0.8,
                                )
                        }
                        padding="0em 0em 0em 0.15em"
                     >
                        {latestSavingsPercChange}%
                     </TextColourizer>
                  </FlexRowWrapper>
               </Fragment>
            }
         />
      </>
   );
}
