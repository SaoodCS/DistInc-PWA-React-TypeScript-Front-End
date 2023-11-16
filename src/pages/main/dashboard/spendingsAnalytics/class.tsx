import LineChartHelper from '../../../../global/components/lib/lineChart/class/LineChartHelper';
import Color from '../../../../global/css/colors';
import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../../global/helpers/dataTypes/date/DateHelper';
import MiscHelper from '../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NDist from '../../distribute/namespace/NDist';

export default class SpendingsChart {
   static config(isDarkTheme: boolean): LineChartHelper.ILineChartConfig {
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

   static dataAndStyles(
      isDarkTheme: boolean,
      totalSpendingData: number[],
      disposableSpendingData: number[],
      expenseSpendingData: number[],
   ): LineChartHelper.ILineChartDataStyles[] {
      const accentColor = isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent;
      const warningColor = isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning;
      const errorColor = isDarkTheme ? Color.darkThm.error : Color.lightThm.error;

      return [
         {
            lineTitle: 'Total Spending',
            data: totalSpendingData,
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
            lineTitle: 'Disposable Spending',
            data: disposableSpendingData,
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
         {
            lineTitle: 'Expense Spending',
            data: expenseSpendingData,
            fillAreaBelow: true,
            lineSmoothness: 0.4,
            pointColor: errorColor,
            pointBgColor: errorColor,
            lineColor: LineChartHelper.setLineOrBgColor(undefined, {
               direction: 'horizontal',
               startColor: Color.setRgbOpacity(errorColor, 1),
               endColor: Color.setRgbOpacity(errorColor, 0.75),
            }),
            fillAreaBelowColor: LineChartHelper.setLineOrBgColor(undefined, {
               direction: 'vertical',
               startColor: Color.setRgbOpacity(errorColor, 0.8),
               endColor: Color.setRgbOpacity(errorColor, 0),
            }),
         },
      ];
   }

   static linePointStyles: LineChartHelper.ILineChartPointStyles = {
      pointInitialSize: 0,
      pointSizeOnHover: 5,
      pointDetectionRadius: 100,
      pointBorderWidth: 0,
      pointHoverBorderWidth: 0,
   };

   // ------ HELPERS FOR GETTING DATA FROM ANALYTICS ARRAY ------ //
   static getXAxisLabels(analytics: NDist.IAnalytics[]): string[] {
      const timestamps = ArrayOfObjects.getArrOfValuesFromKey(analytics, 'timestamp');
      const monthNames = timestamps.map((timestamp) => {
         const month = DateHelper.getPrevMonthName(timestamp);
         return month;
      });
      return monthNames;
   }

   static getSpendingsValues(
      type: 'totalSpendings' | 'totalDisposableSpending',
      analytics: NDist.IAnalytics[],
   ): number[] {
      const spendingsValues = ArrayOfObjects.getArrOfValuesFromNestedKey(
         analytics,
         'prevMonth',
         type,
      );
      return spendingsValues;
   }

   static getExpenseSpendingsValues(analytics: NDist.IAnalytics[]): number[] {
      const totalExpensesArr = ArrayOfObjects.getArrOfValuesFromKey(analytics, 'totalExpenses');
      if (!MiscHelper.isNotFalsyOrEmpty(totalExpensesArr)) return [0];
      const duplicatedItem = totalExpensesArr[0];
      const shiftedArr = totalExpensesArr.slice();
      for (let i = shiftedArr.length - 1; i >= 0; i--) {
         shiftedArr[i] = shiftedArr[i - 1];
      }
      shiftedArr[0] = duplicatedItem;
      return shiftedArr;
   }
}
