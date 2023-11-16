import LineChartHelper from '../../../../global/components/lib/lineChart/LineChartHelper';
import Color from '../../../../global/css/colors';

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

   static dataAndStyles(isDarkTheme: boolean): LineChartHelper.ILineChartDataStyles[] {
      const accentColor = isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent;
      const warningColor = isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning;

      return [
         {
            lineTitle: 'Total Spending',
            data: [65, 59, 80, 81, 56, 55, 40],
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
            data: [10, 70, 90, 60, 40, 70, 50],
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

   static linePointStyles: LineChartHelper.ILineChartPointStyles = {
      pointInitialSize: 0,
      pointSizeOnHover: 5,
      pointDetectionRadius: 100,
      pointBorderWidth: 0,
      pointHoverBorderWidth: 0,
   };
}
