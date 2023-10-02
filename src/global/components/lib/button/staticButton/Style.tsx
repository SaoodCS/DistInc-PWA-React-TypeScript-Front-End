import styled from 'styled-components';
import Clickables from '../../../../helpers/styledComponents/clickables';
import Color from '../../../../theme/colors';

interface IStaticButtonAttrs {
   isDisabled?: boolean;
}

interface IStaticButton extends IStaticButtonAttrs {
   isDarkTheme: boolean;
   width?: string;
   isDangerBtn?: boolean;
   isWarningBtn?: boolean;
}

export const StaticButton = styled.button.attrs<IStaticButtonAttrs>(({ isDisabled }) => ({
   disabled: isDisabled,
}))<IStaticButton>`
   ${Clickables.removeDefaultEffects};
   padding: 0.65em;
   text-align: center;
   border-radius: 10px;
   margin-top: 0.5em;
   color: ${({ isDarkTheme }) =>
      isDarkTheme ? Color.darkThm.txtOnAccent : Color.lightThm.txtOnAccent};
   font-size: 0.95em;
   width: ${({ width }) => width || 'auto'};
   background-color: ${({ isDarkTheme, isDisabled, isDangerBtn, isWarningBtn }) =>
      isDangerBtn
         ? Color.setRgbOpacity(
              isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
              isDisabled ? 0.5 : 1,
           )
         : isWarningBtn
         ? Color.setRgbOpacity(
              isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning,
              isDisabled ? 0.5 : 1,
           )
         : Color.setRgbOpacity(
              isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
              isDisabled ? 0.5 : 1,
           )};
   transition: background-color 0.3s ease-out;
   backdrop-filter: blur(30px);

   @media (min-width: 768px) {
      :hover {
         background-color: ${({ isDarkTheme, isDisabled }) =>
            !isDisabled &&
            Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.8)};
         transition: background-color 0.3s ease-out;
         cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
      }
   }

   :active {
      background-color: ${({ isDarkTheme, isDisabled }) =>
         !isDisabled &&
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.8)};
      transition: background-color 0.3s ease-out;
   }
`;
