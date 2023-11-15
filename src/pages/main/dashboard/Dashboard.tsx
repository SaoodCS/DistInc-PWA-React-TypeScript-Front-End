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
import React from 'react';
import { Line } from 'react-chartjs-2';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import Color from '../../../global/css/colors';

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

export const options: _DeepPartialObject<ChartOptions<'line'>> = {
   responsive: true,
   maintainAspectRatio: true,
   layout: {
      padding: {
         left: -7,
         bottom: -7,
         top: 0,
         right: 0,
      },
   },

   plugins: {
      legend: {
         // this is the y axis and x axis title key
         display: false,
         position: 'top' as const,
      },
      title: {
         // this is the title of the chart
         display: true,
         text: 'Chart.js Line Chart',
         position: 'top' as const,
         align: 'center' as const,

         color: Color.darkThm.txt,
         font: {
            size: 11,
            //weight: 'bold',
         },
         padding: {
            top: 10,
            bottom: 20,
         },
      },
   },
   scales: {
      // make the
      x: {
         grid: {
            // this is the vertical grid lines
            color: 'rgba(255, 255, 255, 0.1)',
            display: false,
            //offset: false,
         },
         ticks: {
            // this is the x axis labels
            display: false,
            color: 'rgba(255, 255, 255, 0.551)',
            font: {
               size: 10,
            },
         },
      },
      y: {
         grid: {
            // this is the horizontal grid lines
            color: 'rgba(255, 255, 255, 0.1)',
            display: false,
         },
         ticks: {
            // this is the y axis labels
            display: false,
            color: 'rgba(255, 255, 255, 0.551)',
            font: {
               size: 10,
            },
         },
      },
   },
};

const labels = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'];

export const data: ChartData<'line', number[], string> = {
   labels,

   datasets: [
      {
         // This is the line that is displayed
         label: 'Dataset 1',
         data: [65, 59, 80, 81, 56, 55, 40],
         borderColor: Color.darkThm.accent, // this is the line color
         backgroundColor: Color.setRgbOpacity(Color.darkThm.accent, 0.5), // this is the fill color
         fill: true,
         tension: 0.4,
         pointRadius: 0,
         pointHoverRadius: 5,
         pointHitRadius: 100,
         pointBorderWidth: 0,
         pointHoverBorderWidth: 0,
         pointHoverBackgroundColor: Color.darkThm.accent,
      },
   ],
};

export default function Dashboard(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Dashboard');

   return (
      <div style={{ padding: '1em' }}>
         <div
            style={{
               backgroundColor: Color.setRgbOpacity(Color.lightThm.bg, 0.05),
               borderRadius: '10px',
               overflow: 'hidden',
               display: 'flex',
            }}
         >
            <Line options={options} data={data} />
         </div>
      </div>
   );
}
