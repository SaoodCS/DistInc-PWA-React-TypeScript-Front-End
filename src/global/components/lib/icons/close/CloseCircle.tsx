import { CloseCircleOutline } from '@styled-icons/evaicons-outline/CloseCircleOutline';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const CloseCircleIcon = styled(CloseCircleOutline)<{ darktheme: 'true' | 'false' }>`
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
