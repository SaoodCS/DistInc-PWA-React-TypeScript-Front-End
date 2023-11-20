import { Fragment, useEffect, useState } from 'react';
import { CurrencyOnCardTxt } from '../../../../../global/components/lib/font/currencyOnCardText/CurrencyOnCardTxt';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { TriangularArrowIcon } from '../../../../../global/components/lib/icons/arrows/TriangularArrow';
import LineChart from '../../../../../global/components/lib/lineChart/LineChart';
import LineChartHelper from '../../../../../global/components/lib/lineChart/class/LineChartHelper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../global/css/colors';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
import NDist from '../../../distribute/namespace/NDist';
import SavingsChart from './namespace/SavingsChart';

export default function TotalSavings(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { data: calcDistData } = NDist.API.useQuery.getCalcDist();
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
      const totalSavingsValues = SavingsChart.getSavingsValues('totalSavings', analytics);
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

   return (
      <>
         <LineChart
            title="Total Savings"
            options={options}
            data={data}
            showPlaceholder={!MiscHelper.isNotFalsyOrEmpty(calcDistData?.analytics)}
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
                        color={Color.setRgbOpacity(Color.darkThm.txt, 0.7)}
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
                              ? Color.setRgbOpacity(Color.darkThm.error, 0.8)
                              : Color.setRgbOpacity(Color.darkThm.success, 0.8)
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
