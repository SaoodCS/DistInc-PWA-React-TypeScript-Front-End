import LineChartHelper from '../../../../../../global/components/lib/lineChart/class/LineChartHelper';
import Color from '../../../../../../global/css/colors';
import ArrayHelper from '../../../../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import NDist from '../../../../distribute/namespace/NDist';

export namespace SavingsChart {
   interface ITotalSavingsLine {
      name: 'totalSavings';
      title: 'Total Savings';
   }

   export type ILineDetails = ITotalSavingsLine;

   export const lineDetails: ILineDetails[] = [
      {
         name: 'totalSavings',
         title: 'Total Savings',
      },
   ];

   export function config(isDarkTheme: boolean): LineChartHelper.ILineChartConfig {
      const textColor = isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt;
      return {
         layout: {
            containerPadding: {
               left: -7,
               bottom: -7,
               top: 0,
               right: 0,
            },
            reduceLinesHeightBy: 70,
         },

         key: {
            display: false,
            position: 'top' as const,
            align: 'center' as const,
            labels: {
               color: textColor,
               padding: 10,
               font: {
                  size: 11,
               },
            },
         },
         yAxis: {
            gridLines: {
               color: 'rgba(255, 255, 255, 0.1)',
               display: false,
            },
            labels: {
               display: false,
               color: 'rgba(255, 255, 255, 0.551)',
               font: {
                  size: 10,
               },
            },
         },
         xAxis: {
            gridLines: {
               color: 'rgba(255, 255, 255, 0.1)',
               display: false,
            },
            labels: {
               display: false,
               color: 'rgba(255, 255, 255, 0.551)',
               font: {
                  size: 10,
               },
            },
         },
      };
   }

   export function dataAndStyles(
      isDarkTheme: boolean,
      totalSavingsData: number[],
   ): LineChartHelper.ILineChartDataStyles[] {
      const warningColor = isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning;
      return [
         {
            lineTitle: 'Total Savings',
            data: totalSavingsData,
            fillAreaBelow: false,
            lineSmoothness: 0.4,
            pointColor: warningColor,
            pointBgColor: warningColor,
            lineColor: LineChartHelper.setLineOrBgColor(undefined, {
               direction: 'horizontal',
               startColor: Color.setRgbOpacity(warningColor, 1),
               endColor: Color.setRgbOpacity(warningColor, 0.75),
            }),
            fillAreaBelowColor: LineChartHelper.setLineOrBgColor(undefined, {
               direction: 'vertical',
               startColor: Color.setRgbOpacity(warningColor, 0.8),
               endColor: Color.setRgbOpacity(warningColor, 0),
            }),
         },
      ];
   }

   export const linePointStyles: LineChartHelper.ILineChartPointStyles = {
      pointInitialSize: 0,
      pointSizeOnHover: 5,
      pointDetectionRadius: 100,
      pointBorderWidth: 0,
      pointHoverBorderWidth: 0,
   };

   export function getXAxisLabels(analytics: NDist.IAnalytics[]): string[] {
      const orderedAnalytics = ArrayOfObjects.sortByDateStr(analytics, 'timestamp', true);
      const timestamps = ArrayOfObjects.getArrOfValuesFromKey(orderedAnalytics, 'timestamp');
      const monthNames = timestamps.map((timestamp) => {
         const month = DateHelper.getPrevMonthName(timestamp);
         return month;
      });
      const last12Months = ArrayHelper.trimLength(monthNames, 12, 'start');
      return last12Months;
   }

   export function getSavingsValues(
      type: ITotalSavingsLine['name'],
      analytics: NDist.IAnalytics[],
   ): number[] {
      const orderedAnalytics = ArrayOfObjects.sortByDateStr(analytics, 'timestamp', true);
      const savingsValues = ArrayOfObjects.getArrOfValuesFromNestedKey(
         orderedAnalytics,
         'prevMonth',
         type,
      );
      const last12Savings = ArrayHelper.trimLength(savingsValues, 12, 'start');
      return last12Savings;
   }
}

export default SavingsChart;
