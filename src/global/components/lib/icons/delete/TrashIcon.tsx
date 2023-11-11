import { Trash } from '@styled-icons/bootstrap/Trash';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const TrashIcon = styled(Trash)<{ darktheme: 'true' | 'false' }>`
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.convert(darktheme) ? Color.darkThm.error : Color.lightThm.error,
         0.5,
      )};
   ${({ darktheme }) =>
      MyCSS.Clickables.addResponsiveHover(
         BoolHelper.convert(darktheme),
         Color.lightThm.error,
         Color.darkThm.error,
         1,
         'color',
      )};
`;
