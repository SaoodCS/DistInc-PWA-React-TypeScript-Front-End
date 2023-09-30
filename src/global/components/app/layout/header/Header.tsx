import styled from 'styled-components';
import { ArrowIosBack } from 'styled-icons/evaicons-solid';
import Color from '../../../../theme/colors';

export const Header = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   top: 0;
   height: 10%;
   width: 100dvw;
   border-bottom: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   border-bottom-left-radius: 10px;
   border-bottom-right-radius: 10px;
   display: flex;
   justify-content: space-evenly;
   align-items: center;
   font-size: 1.1em;
   @media (min-width: 850px) {
      left: 15%;
      width: 85dvw;
      border-bottom: none;
      justify-content: start;
      padding-left: 1.5em;
      font-size: 3em;
   }
`;

export const StyledBackArr = styled(ArrowIosBack)<{ darktheme: boolean }>`
   height: 1.5em;
   position: fixed;
   left: 0;
   padding-left: 1em;
   @media (min-width: 850px) {
      left: 15%;
      padding-left: 0;
      height: 1.25em;
      &:hover {
         cursor: pointer;
         color: ${({ darktheme }) =>
            Color.setRgbOpacity(darktheme ? Color.darkThm.txt : Color.lightThm.txt, 0.5)};
      }
   }
`;
