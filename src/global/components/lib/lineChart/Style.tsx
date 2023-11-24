import styled from 'styled-components';

export const ChartInfoRight = styled.div`
   position: absolute;
   padding: 1em 1em 0em 0em;
   top: 0;
   right: 0;
   box-sizing: border-box;
`;

export const ChartInfoBelowTitle = styled.div`
   position: absolute;
   padding: 2.5em 0em 0em 1em;
   top: 0;
   box-sizing: border-box;
`;

export const ChartTitle = styled.div`
   position: absolute;
   padding: 1em 0em 0em 1em;
   box-sizing: border-box;
   display: flex;
   justify-content: center;
   align-items: center;
   & > :first-child {
      padding-right: 0.25em;
   }
`;

export const LineChartCardWrapper = styled.div`
   border-radius: 10px;
   overflow: hidden;
   display: flex;
   position: relative;
   flex-direction: column;
   height: 100%;
   width: 100%;
   justify-content: space-between;
`;
