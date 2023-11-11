import { RefreshCircle } from '@styled-icons/ionicons-outline/RefreshCircle';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const RefreshCircleIcon = styled(RefreshCircle)<{ darktheme: 'true' | 'false' }>`
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.convert(darktheme) ? Color.darkThm.warning : Color.lightThm.warning,
         0.5,
      )};

   ${({ darktheme }) =>
      MyCSS.Clickables.addResponsiveHover(
         BoolHelper.convert(darktheme),
         Color.lightThm.warning,
         Color.darkThm.warning,
         1,
         'color',
      )};
`;
