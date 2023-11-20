import { AreaGraph } from '@styled-icons/entypo/AreaGraph';
import styled from 'styled-components';
import Color from '../../../css/colors';
import BoolHelper from '../../../helpers/dataTypes/bool/BoolHelper';

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
   & > :first-child {
      padding-right: 0.25em;
   }
`;

export const LineChartCardWrapper = styled.div`
   border-radius: 10px;
   overflow: hidden;
   display: flex;
   position: relative;
`;

export const LineChartPlaceholder = styled(AreaGraph)<{ darktheme: 'true' | 'false' }>`
   position: absolute;
   bottom: -10em;
   left: -3em;
   right: 0;
   margin: auto;
   transform: scaleY(0.5);
   color: ${({ darktheme }) =>
      BoolHelper.strToBool(darktheme) ? Color.darkThm.border : Color.lightThm.border};
`;
