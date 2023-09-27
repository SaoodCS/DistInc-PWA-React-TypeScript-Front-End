import styled from 'styled-components';
import Scrollbar from '../../../helpers/styledComponents/scrollbars';
import Color from '../../../theme/colors';

export const Body = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 100dvw;
   top: 10%;
   bottom: 10%;
   @media (min-width: 850px) {
      left: 15%;
      width: 85dvw;
      bottom: 0;
   }
`;

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
