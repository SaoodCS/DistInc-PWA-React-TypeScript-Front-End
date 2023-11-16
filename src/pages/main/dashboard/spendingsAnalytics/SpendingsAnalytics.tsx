import { UpArrow } from '@styled-icons/boxicons-solid/UpArrow';
import {
   CategoryScale,
   Chart as ChartJS,
   Filler,
   Legend,
   LineElement,
   LinearScale,
   PointElement,
   Title,
   Tooltip,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { TextColourizer } from '../../../../global/components/lib/font/textColorizer/TextColourizer';
import LineChartHelper from '../../../../global/components/lib/lineChart/LineChartHelper';
import { FlexRowWrapper } from '../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../global/css/colors';
import SpendingsChart from './class';

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

// ------------------------------------------------------------------------------------- //

export default function SpendingsAnalytics() {
   const { isDarkTheme } = useThemeContext();

   const options = LineChartHelper.constructOptions(SpendingsChart.config(isDarkTheme));

   const xAxisLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
   const data = LineChartHelper.constructData(
      SpendingsChart.linePointStyles,
      SpendingsChart.dataAndStyles(isDarkTheme),
      xAxisLabels,
   );

   return (
      <LineChartCardWrapper style={{ maxWidth: '30em' }}>
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
               <TextColourizer fontSize="0.9em" color={Color.setRgbOpacity(Color.darkThm.txt, 0.7)}>
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
   );
}
