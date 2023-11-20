import { ChartData, ChartOptions } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { Doughnut } from 'react-chartjs-2';

interface IDonutChart {
   options: _DeepPartialObject<ChartOptions<'doughnut'>>;
   data: ChartData<'doughnut', number[], string>;
}

export default function DonutChart(props: IDonutChart) {
   const { options, data } = props;
   return <Doughnut data={data} options={options} />;
}
