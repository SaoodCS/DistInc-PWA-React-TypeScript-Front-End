import { AreaGraph } from '@styled-icons/entypo/AreaGraph';
import styled from 'styled-components';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const LineChartNoDataPlaceholder = styled(AreaGraph)<{ darktheme: 'true' | 'false' }>`
   position: absolute;
   bottom: -10em;
   left: -3em;
   right: 0;
   margin: auto;
   transform: scaleY(0.5);
   color: ${({ darktheme }) =>
      BoolHelper.strToBool(darktheme) ? Color.darkThm.border : Color.lightThm.border};
`;
