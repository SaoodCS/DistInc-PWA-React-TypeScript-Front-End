import styled from 'styled-components';
import Color from '../../../css/colors';

export const ChartInfo = styled.div`
   position: absolute;
   padding: 1em 1em 0em 0em;
   top: 0;
   right: 0;
   box-sizing: border-box;
`;

export const ChartTitle = styled.div`
   position: absolute;
   padding: 1em 0em 0em 1em;
   box-sizing: border-box;
   display: flex;
   justify-content: center;
   align-items: center;
   // add padding right to first child:
   & > :first-child {
      padding-right: 0.25em;
   }
  
  
`;

export const LineChartCardWrapper = styled.div`
   border-radius: 10px;
   overflow: hidden;
   display: flex;
   background-color: ${Color.setRgbOpacity(Color.lightThm.bg, 0.05)};
   border-radius: 10px;
   overflow: hidden;
   display: flex;
   position: relative;
`;
