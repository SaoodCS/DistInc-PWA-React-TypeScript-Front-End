import styled from 'styled-components';
import Clickables from '../../../../helpers/styledComponents/clickables';
import Color from '../../../../theme/colors';

export const InlineTxtBtn = styled.span<{
   isDarkTheme: boolean;
   isDisabled?: boolean;
   isDangerBtn?: boolean;
   isWarningBtn?: boolean;
}>`
   ${Clickables.removeDefaultEffects};
   cursor: pointer;
   color: ${({ isDarkTheme, isDisabled, isDangerBtn, isWarningBtn }) =>
      isDisabled
         ? Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.5)
         : isDangerBtn
         ? Color.setRgbOpacity(isDarkTheme ? Color.darkThm.error : Color.lightThm.error, 1)
         : isWarningBtn
         ? Color.setRgbOpacity(isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning, 1)
         : isDarkTheme
         ? Color.darkThm.accent
         : Color.lightThm.accent};
`;
