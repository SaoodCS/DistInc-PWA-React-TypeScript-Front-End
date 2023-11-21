import { ChartData, ChartOptions } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';

export namespace DonutChartHelper {
   export interface IDonutChartConfig {
      holeSizeAsPercentage: number;
   }

   export function constructOptions(
      chartConfig: IDonutChartConfig,
   ): _DeepPartialObject<ChartOptions<'doughnut'>> {
      return {
         responsive: true,
         maintainAspectRatio: false,
         cutout: `${chartConfig.holeSizeAsPercentage}%`,
         plugins: {
            legend: {
               display: false,
            },
         },
      };
   }

   export interface IDonutChartDataStyles {
      backgroundColors: string[];
      borderColors: string[];
      borderWidth: number;
      data: number[];
      labels: string[];
   }

   export function constructData(
      donutChartDataAndStyle: IDonutChartDataStyles,
   ): ChartData<'doughnut', number[], string> {
      return {
         labels: donutChartDataAndStyle.labels,
         datasets: [
            {
               label: 'Amount',
               data: donutChartDataAndStyle.data,
               backgroundColor: donutChartDataAndStyle.backgroundColors,
               borderColor: donutChartDataAndStyle.borderColors,
               borderWidth: donutChartDataAndStyle.borderWidth,
            },
         ],
      };
   }
}

export default DonutChartHelper;
