import styled from 'styled-components';
import Color from '../../../../styles/colors';

interface IStaticButtonAttrs {
   isDisabled?: boolean;
}

interface IStaticButton extends IStaticButtonAttrs {
   isDarkTheme: boolean;
   width?: string;
}

export const StaticButton = styled.button.attrs<IStaticButtonAttrs>(({ isDisabled }) => ({
   disabled: isDisabled,
}))<IStaticButton>`
   all: unset;
   background: none;
   border: none;
   user-select: none;
   text-decoration: none;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   font-size: 0.95em;
   padding: 0.5em;
   border-radius: 10px;
   color: ${({ isDarkTheme }) =>
      isDarkTheme ? Color.darkThm.txtOnAccent : Color.lightThm.txtOnAccent};
   font-size: 0.95em;
   width: ${({ width }) => width || 'auto'};
   background-color: ${({ isDarkTheme, isDisabled }) =>
      isDisabled
         ? Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.5)
         : isDarkTheme
         ? Color.darkThm.accent
         : Color.lightThm.accent};
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
