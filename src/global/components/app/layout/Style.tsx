import styled from 'styled-components';
import Color from '../../../theme/colors';

export const Body = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 100dvw;
   top: 10%;
   bottom: 10%;
   overflow: scroll;
   @media (min-width: 768px) {
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
   @media (min-width: 768px) {
      left: 15%;
      width: 85dvw;
      border-bottom: none;
      justify-content: start;
      padding-left: 1.5em;
      font-size: 3em;
   }
`;
