import type {
   CartesianScaleTypeRegistry,
   ChartData,
   ChartOptions,
   LegendOptions,
   ScaleOptionsByType,
   Scriptable,
   ScriptableContext,
} from 'chart.js';
import type { Padding } from 'chart.js/dist/types/geometric';
import type { _DeepPartialObject } from 'chart.js/dist/types/utils';
import Color from '../../../../css/colors';

export namespace LineChartHelper {
   export type ILineChartPointStyles = {
      pointInitialSize: number;
      pointSizeOnHover: number;
      pointDetectionRadius: number;
      pointBorderWidth: number;
      pointHoverBorderWidth: number;
   };

   export type ILineChartDataStyles = {
      lineTitle: string;
      data: number[];
      fillAreaBelow: boolean;
      lineSmoothness: number;
      pointColor: string;
      pointBgColor: string;
      lineColor: string | ((context: ScriptableContext<'line'>) => CanvasGradient);
      fillAreaBelowColor: string | ((context: ScriptableContext<'line'>) => CanvasGradient);
   };

   interface IColorGradientParams {
      direction: 'horizontal' | 'vertical';
      startColor: string;
      endColor: string;
   }

   export interface ILineChartConfig {
      layout: {
         containerPadding: Scriptable<Padding, ScriptableContext<'line'>>;
         reduceLinesHeightBy: number;
      };
      key: _DeepPartialObject<_DeepPartialObject<LegendOptions<'line'>>>;
      yAxis: {
         gridLines: _DeepPartialObject<
            _DeepPartialObject<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>['grid']>
         >;
         labels: _DeepPartialObject<
            _DeepPartialObject<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>['ticks']>
         >;
      };
      xAxis: {
         gridLines: _DeepPartialObject<
            _DeepPartialObject<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>['grid']>
         >;
         labels: _DeepPartialObject<
            _DeepPartialObject<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>['ticks']>
         >;
      };
   }

   export function constructOptions(
      chartConfig: ILineChartConfig,
   ): _DeepPartialObject<ChartOptions<'line'>> {
      return {
         responsive: true,
         maintainAspectRatio: true,
         layout: {
            padding: chartConfig.layout.containerPadding,
         },
         plugins: {
            legend: chartConfig.key,
            title: {
               display: true,
               padding: {
                  top: chartConfig.layout.reduceLinesHeightBy,
               },
            },
         },
         scales: {
            x: {
               grid: chartConfig.xAxis.gridLines,
               ticks: chartConfig.xAxis.labels,
            },

            y: {
               grid: chartConfig.yAxis.gridLines,
               ticks: chartConfig.yAxis.labels,
            },
         },
      };
   }

   export function constructData(
      linePointStyles: ILineChartPointStyles,
      lineChartDataAndStyles: ILineChartDataStyles[],
      xAxisLabels: string[],
   ): () => ChartData<'line', number[], string> {
      const datasets = mapLineChartDataAndStyles(lineChartDataAndStyles, linePointStyles);
      const labels = xAxisLabels;
      return () => {
         return {
            labels,
            datasets,
         };
      };
   }

   // ------------------ //
   export function setLineOrBgColor(
      solidColor: undefined | string,
      gradientColor: undefined | IColorGradientParams,
   ): string | ((context: ScriptableContext<'line'>) => CanvasGradient) {
      if (solidColor) {
         return solidColor;
      } else if (gradientColor) {
         const { direction, startColor, endColor } = gradientColor;
         return (context: ScriptableContext<'line'>) => {
            const ctx = context.chart.ctx;
            const x0 = 0;
            const y0 = 0;
            const x1 = direction === 'horizontal' ? context.chart.width : 0;
            const y1 = direction === 'horizontal' ? 0 : context.chart.height;
            const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, endColor);
            return gradient;
         };
      }
      return Color.darkThm.accent;
   }

   // eslint-disable-next-line no-inner-declarations
   function mapLineChartDataAndStyles(
      lineChartDataAndStyles: ILineChartDataStyles[],
      linePointStyles: ILineChartPointStyles,
   ): ChartData<'line', number[], string>['datasets'] {
      const mappedLineCharts: ChartData<'line', number[], string>['datasets'] = [];
      for (let i = 0; i < lineChartDataAndStyles.length; i++) {
         const lineChart = lineChartDataAndStyles[i];
         mappedLineCharts.push({
            label: lineChart.lineTitle,
            data: lineChart.data,
            fill: lineChart.fillAreaBelow,
            tension: lineChart.lineSmoothness,
            borderColor: lineChart.lineColor,
            backgroundColor: lineChart.fillAreaBelowColor,
            pointBackgroundColor: lineChart.pointBgColor,
            pointBorderColor: lineChart.pointColor,
            pointRadius: linePointStyles.pointInitialSize,
            pointHoverRadius: linePointStyles.pointSizeOnHover,
            pointHitRadius: linePointStyles.pointDetectionRadius,
            pointBorderWidth: linePointStyles.pointBorderWidth,
            pointHoverBorderWidth: linePointStyles.pointHoverBorderWidth,
         });
      }
      return mappedLineCharts;
   }
}

export default LineChartHelper;
