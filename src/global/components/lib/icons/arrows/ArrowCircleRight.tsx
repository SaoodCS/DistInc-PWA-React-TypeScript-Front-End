import { ArrowCircleRightOutline } from '@styled-icons/evaicons-outline/ArrowCircleRightOutline';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const ArrowCircleRightIcon = styled(ArrowCircleRightOutline)<{
   darktheme: 'true' | 'false';
}>`
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.convert(darktheme) ? Color.darkThm.accent : Color.lightThm.accent,
         0.5,
      )};

   ${({ darktheme }) =>
      MyCSS.Clickables.addResponsiveHover(
         BoolHelper.convert(darktheme),
         Color.lightThm.accent,
         Color.darkThm.accent,
         1,
         'color',
      )};
`;
