import styled from 'styled-components';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';
import { RefreshCircle } from '@styled-icons/ionicons-outline/RefreshCircle';

export const RefreshCircleIcon = styled(RefreshCircle)<{ darktheme: 'true' | 'false' }>`
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.convert(darktheme) ? Color.darkThm.warning : Color.lightThm.warning,
         0.5,
      )};

   &:hover {
      color: ${({ darktheme }): string =>
         BoolHelper.convert(darktheme) ? Color.darkThm.warning : Color.lightThm.warning};
      transition: color 0.3s ease-in-out;
      cursor: pointer;
   }
`;
