import { UpArrow } from '@styled-icons/boxicons-solid/UpArrow';
import {
   CategoryScale,
   ChartData,
   Chart as ChartJS,
   ChartOptions,
   Filler,
   Legend,
   LineElement,
   LinearScale,
   PointElement,
   Title,
   Tooltip,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { ReactNode } from 'react';
import { Line } from 'react-chartjs-2';
import Color from '../../../css/colors';
import { TextColourizer } from '../font/textColorizer/TextColourizer';
import { FlexRowWrapper } from '../positionModifiers/flexRowWrapper/Style';
import { ChartInfo, ChartTitle, LineChartCardWrapper } from './Style';

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Filler,
   Legend,
);

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
