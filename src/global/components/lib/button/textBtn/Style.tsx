import styled from 'styled-components';
import Clickables from '../../../../helpers/styledComponents/clickables';
import Color from '../../../../theme/colors';

interface ITextBtnAttrs {
   isDisabled?: boolean;
}

interface ITextBtn extends ITextBtnAttrs {
   isDarkTheme: boolean;
}

export const TextBtn = styled.button.attrs<ITextBtnAttrs>(({ isDisabled }) => ({
   disabled: isDisabled,
}))<ITextBtn>`
   ${Clickables.removeDefaultEffects};
   font-size: 0.95em;
   padding: 0.5em;
   border-radius: 10px;
   color: ${({ isDarkTheme, isDisabled }) =>
      isDisabled
         ? Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.5)
         : isDarkTheme
         ? Color.darkThm.accent
         : Color.lightThm.accent};
   backdrop-filter: blur(30px);

   :hover,
   :active {
      @media (min-width: 768px) {
         background-color: ${({ isDarkTheme, isDisabled }) =>
            !isDisabled &&
            Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.1)};
         transition: background-color 0.2s ease-out;
         cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
      }
   }

   :active {
      @media (max-width: 768px) {
         color: ${({ isDarkTheme, isDisabled }) =>
            !isDisabled &&
            Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.5)};
      }
   }
`;
