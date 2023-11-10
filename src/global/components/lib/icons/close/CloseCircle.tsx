import { CloseCircleOutline } from '@styled-icons/evaicons-outline/CloseCircleOutline';
import styled from 'styled-components';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const CloseCircleIcon = styled(CloseCircleOutline)<{ darktheme: 'true' | 'false' }>`
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.convert(darktheme) ? Color.darkThm.error : Color.lightThm.error,
         0.5,
      )};

   &:hover {
      color: ${({ darktheme }): string =>
         BoolHelper.convert(darktheme) ? Color.darkThm.error : Color.lightThm.error};
      transition: color 0.3s ease-in-out;
      cursor: pointer;
   }
`;
