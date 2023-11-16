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
   ScriptableContext,
   Title,
   Tooltip,
} from 'chart.js';
import { UpArrow } from '@styled-icons/boxicons-solid/UpArrow';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import Color from '../../../global/css/colors';

const ChartInfo = styled.div`
   position: absolute;
   padding: 1em 1em 0em 0em;
   top: 0;
   right: 0;
   box-sizing: border-box;
`;

const ChartTitle = styled.div`
   position: absolute;
   padding: 1em 0em 0em 1em;
   font-size: 0.9em;
   box-sizing: border-box;
`;

const LineChartCardWrapper = styled.div`
   border-radius: 10px;
   overflow: hidden;
   display: flex;
   background-color: ${Color.setRgbOpacity(Color.lightThm.bg, 0.05)};
   border-radius: 10px;
   overflow: hidden;
   display: flex;
   position: relative;
`;

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
         //text: 'Chart.js Line Chart',
         position: 'top' as const,
         align: 'center' as const,

         color: Color.darkThm.txt,
         font: {
            size: 11,
            //weight: 'bold',
         },
         padding: {
            top: 40,
            bottom: 20,
         },
      },
   },
   scales: {
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

export const data = (): ChartData<'line', number[], string> => {
   return {
      labels,

      datasets: [
         {
            // This is the line that is displayed
            label: 'Dataset 1',
            data: [65, 59, 80, 81, 56, 55, 40],
            // make the border color a gradient from left to right:
            borderColor: (context: ScriptableContext<'line'>) => {
               const ctx = context.chart.ctx;
               const gradient = ctx.createLinearGradient(0, 0, 200, 0);
               gradient.addColorStop(0, Color.setRgbOpacity(Color.darkThm.accent, 1));
               gradient.addColorStop(1, Color.setRgbOpacity(Color.darkThm.accent, 0.75));
               return gradient;
            },

            backgroundColor: (context: ScriptableContext<'line'>) => {
               const ctx = context.chart.ctx;
               const gradient = ctx.createLinearGradient(0, 0, 0, 200);
               gradient.addColorStop(0, Color.setRgbOpacity(Color.darkThm.accent, 0.8));
               gradient.addColorStop(1, Color.setRgbOpacity(Color.darkThm.accent, 0));
               return gradient;
            },
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
};

export default function Dashboard(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Dashboard');

   return (
      <div style={{ padding: '1em' }}>
         <LineChartCardWrapper>
            <ChartTitle>Expenses</ChartTitle>
            <ChartInfo>
               <FlexRowWrapper
                  justifyContent="end"
                  style={{ alignItems: 'end', marginBottom: '0.3em' }}
               >
                  <TextColourizer
                     fontSize="1.5em"
                     style={{
                        display: 'inline-block',
                        WebkitTransform: 'scale(1.05,0.95)',
                        fontSmooth: 'always',
                        //fontWeight: 600,
                        letterSpacing: '0.02em',
                        // make text thicker by adding a shadow
                        textShadow: `1px 1px 1px ${Color.setRgbOpacity(Color.darkThm.txt, 1)}`,
                     }}
                  >
                     25,000.00
                  </TextColourizer>
                  <TextColourizer fontSize="0.9em">&nbsp;&nbsp;GBP</TextColourizer>
               </FlexRowWrapper>
               <FlexRowWrapper justifyContent="end" style={{ alignItems: 'center', right: 0 }}>
                  <TextColourizer
                     fontSize="0.9em"
                     color={Color.setRgbOpacity(Color.darkThm.txt, 0.7)}
                  >
                     October&nbsp;&nbsp;
                  </TextColourizer>
                  <UpArrow
                     size="1em"
                     color={Color.setRgbOpacity(Color.darkThm.error, 0.8)}
                     style={{
                        transform: 'scale(0.8,1)',
                     }}
                  />
                  <TextColourizer
                     fontSize="0.9em"
                     color={Color.setRgbOpacity(Color.darkThm.error, 0.8)}
                     padding="0em 0em 0em 0.15em"
                  >
                     5.5%
                  </TextColourizer>
               </FlexRowWrapper>
            </ChartInfo>
            <Line options={options} data={data()} />
         </LineChartCardWrapper>
      </div>
   );
}
