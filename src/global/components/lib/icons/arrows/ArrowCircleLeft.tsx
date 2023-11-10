import styled from 'styled-components';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';
import { ArrowCircleLeftOutline } from '@styled-icons/evaicons-outline/ArrowCircleLeftOutline';

export const ArrowCircleLeftIcon = styled(ArrowCircleLeftOutline)<{ darktheme: 'true' | 'false' }>`
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.convert(darktheme) ? Color.darkThm.accent : Color.lightThm.accent,
         0.5,
      )};
   &:hover {
      color: ${({ darktheme }): string =>
         BoolHelper.convert(darktheme) ? Color.darkThm.accent : Color.lightThm.accent};
      transition: color 0.3s ease-in-out;
      cursor: pointer;
   }
`;