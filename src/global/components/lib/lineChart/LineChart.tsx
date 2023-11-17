import { ChartData, ChartOptions } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { ReactNode } from 'react';
import { Line } from 'react-chartjs-2';
import { TextColourizer } from '../font/textColorizer/TextColourizer';
import { ChartInfo, ChartTitle, LineChartCardWrapper } from './Style';

interface ILineChart {
   width: string;
   title: string;
   options: _DeepPartialObject<ChartOptions<'line'>>;
   data: () => ChartData<'line', number[], string>;
   infoComponent: ReactNode;
   titleElement?: ReactNode;
}

export default function LineChart(props: ILineChart) {
   const { width, title, options, data, infoComponent, titleElement } = props;
   return (
      <LineChartCardWrapper style={{ maxWidth: width }}>
         <ChartTitle>
            <TextColourizer fontSize="0.95em">{title}</TextColourizer>
            {titleElement && titleElement}
         </ChartTitle>
         <ChartInfo> {infoComponent}</ChartInfo>
         <Line options={options} data={data()} />
      </LineChartCardWrapper>
   );
}
