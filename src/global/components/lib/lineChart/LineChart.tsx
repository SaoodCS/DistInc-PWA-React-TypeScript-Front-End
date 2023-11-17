import { ChartData, ChartOptions } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { ReactNode } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartInfo, ChartTitle, LineChartCardWrapper } from './Style';

interface ILineChart {
   width: string;
   title: string;
   options: _DeepPartialObject<ChartOptions<'line'>>;
   data: () => ChartData<'line', number[], string>;
   infoComponent: ReactNode;
}

export default function LineChart(props: ILineChart) {
   const { width, title, options, data, infoComponent } = props;
   return (
      <LineChartCardWrapper style={{ maxWidth: width }}>
         <ChartTitle>{title}</ChartTitle>
         <ChartInfo> {infoComponent}</ChartInfo>
         <Line options={options} data={data()} />
      </LineChartCardWrapper>
   );
}
