import styled from 'styled-components';
import Color from '../../../theme/colors';

export const Footer = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   bottom: 0;
   width: 100dvw;
   height: 10dvh;
   overflow: hidden;
`;

export const Body = styled.div<{ isDarkTheme: boolean }>`
   border-top: 1px solid
      ${(props) => (props.isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   border-bottom: 1px solid
      ${(props) => (props.isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   position: fixed;
   bottom: 10dvh;
   top: 10dvh;
   width: 100dvw;
   overflow: hidden;
`;

export const Header = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 100dvw;
   height: 10dvh;
   overflow: hidden;
`;
