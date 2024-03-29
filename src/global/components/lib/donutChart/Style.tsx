import styled from 'styled-components';
import Color from '../../../css/colors';
import MyCSS from '../../../css/MyCSS';

export const KeysWrapper = styled.div`
   max-height: 65%;
   overflow-y: scroll;
   border: 1px solid ${Color.darkThm.border};
   ${MyCSS.Scrollbar.solidStyle};
`;

export const KeyIndicator = styled.div<{ color: string }>`
   display: inline-block;
   width: 1em;
   height: 0.8em;
   background-color: red;
   background-color: ${({ color }) => color};
   border-radius: 5px;
   margin-right: 0.5em;
`;

export const KeyIndicatorAndTextWrapper = styled.div<{ noOfItems: number }>`
   padding-top: ${({ noOfItems }) => (noOfItems < 5 ? '0.25em' : '0.125em')};
   padding-bottom: ${({ noOfItems }) => (noOfItems < 5 ? '0.25em' : '0.125em')};
   & > * {
      font-size: ${({ noOfItems }) => (noOfItems < 5 ? '0.9em' : '0.8em')};
   }
`;

export const DonutChartTitle = styled.div`
   padding-bottom: 0.5em;
`;

export const DonutChartKeysWrapper = styled.div<{ isDarkTheme: boolean }>`
   display: flex;
   flex-direction: column;
   justify-content: center;
   padding-right: 1.5em;
   color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.9)};
`;

export const DonutChartWrapper = styled.div`
   box-sizing: border-box;
   width: 50%;
   padding-left: 1.5em;
   padding-right: 1.5em;
`;

export const DonutChartAndKeysWrapper = styled.div`
   width: 100%;
   height: 100%;
   position: relative;
   display: flex;
   flex-direction: row;
   justify-content: space-evenly;
`;
