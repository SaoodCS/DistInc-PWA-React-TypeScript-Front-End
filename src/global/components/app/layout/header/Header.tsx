import { ArrowIosBack } from '@styled-icons/evaicons-solid/ArrowIosBack';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';

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
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      left: 15%;
      width: 85dvw;
      border-bottom: none;
      justify-content: start;
      padding-left: 1.5em;
      font-size: 3em;
   }
   z-index: 1;
`;

export const StyledBackArr = styled(ArrowIosBack)<{ darktheme: string }>`
   height: 1.5em;
   position: fixed;
   left: 0;
   padding-left: 1em;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      left: 15%;
      padding-left: 0;
      height: 1.25em;
      &:hover {
         cursor: pointer;
         color: ${({ darktheme }) =>
            Color.setRgbOpacity(
               darktheme === 'true' ? Color.darkThm.txt : Color.lightThm.txt,
               0.5,
            )};
      }
   }
`;
