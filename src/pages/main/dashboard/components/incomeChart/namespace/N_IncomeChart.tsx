import LineChartHelper from '../../../../../../global/components/lib/lineChart/class/LineChartHelper';
import Color from '../../../../../../global/css/colors';
import ArrayHelper from '../../../../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import _Date from '../../../../../../global/helpers/dataTypes/date/_Date';
import type NDist from '../../../../distribute/namespace/NDist';

export namespace N_IncomeChart {
   interface ITotalIncomesLine {
      name: 'totalIncomes';
      title: 'Total Income';
   }
   interface ITotalDisposableIncomeLine {
      name: 'totalDisposableIncome';
      title: 'Disposable Income';
   }

   export type ILineDetails = ITotalIncomesLine | ITotalDisposableIncomeLine;
   export const lineDetails: ILineDetails[] = [
      {
         name: 'totalIncomes',
         title: 'Total Income',
      },
      {
         name: 'totalDisposableIncome',
         title: 'Disposable Income',
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
      totalIncomeData: number[],
      disposableIncomeData: number[],
   ): LineChartHelper.ILineChartDataStyles[] {
      const accentColor = isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent;
      const warningColor = isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning;

      return [
         {
            lineTitle: 'Total Income',
            data: totalIncomeData,
            fillAreaBelow: true,
            lineSmoothness: 0.4,
            pointColor: accentColor,
            pointBgColor: accentColor,
            lineColor: LineChartHelper.setLineOrBgColor(undefined, {
               direction: 'horizontal',
               startColor: Color.setRgbOpacity(accentColor, 1),
               endColor: Color.setRgbOpacity(accentColor, 0.75),
            }),
            fillAreaBelowColor: LineChartHelper.setLineOrBgColor(undefined, {
               direction: 'vertical',
               startColor: Color.setRgbOpacity(accentColor, 0.8),
               endColor: Color.setRgbOpacity(accentColor, 0),
            }),
         },
         {
            lineTitle: 'Disposable Income',
            data: disposableIncomeData,
            fillAreaBelow: true,
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

   // ------ HELPERS FOR GETTING DATA FROM ANALYTICS ARRAY ------ //
   export function getXAxisLabels(analytics: NDist.IAnalytics[]): string[] {
      const orderedAnalytics = ArrayOfObjects.sortByDateStr(analytics, 'timestamp', true);
      const timestamps = ArrayOfObjects.getArrOfValuesFromKey(orderedAnalytics, 'timestamp');
      const monthNames = timestamps.map((timestamp) => {
         const month = _Date.DDMMYYYY.getMonthName(timestamp);
         return month;
      });
      const last12Months = ArrayHelper.trimLength(monthNames, 12, 'start');
      return last12Months;
   }

   export function getIncomesValues(
      type: ITotalIncomesLine['name'] | ITotalDisposableIncomeLine['name'],
      analytics: NDist.IAnalytics[],
   ): number[] {
      const orderedAnalytics = ArrayOfObjects.sortByDateStr(analytics, 'timestamp', true);
      const totalIncomesValues = ArrayOfObjects.getArrOfValuesFromKey(orderedAnalytics, type);
      const last12Incomes = ArrayHelper.trimLength(totalIncomesValues, 12, 'start');
      return last12Incomes;
   }

   export const filtererKey = 'incomeChart';
}

export default N_IncomeChart;
