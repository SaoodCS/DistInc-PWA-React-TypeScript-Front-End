import styled, { Keyframes, keyframes } from 'styled-components';
import Color from '../../../css/colors';
import { TButtonPos } from '../contextMenu/ContextMenu';

const relativeExpander = (clickPos: TButtonPos): Keyframes => keyframes`
   0% {
      transform: scale(0);
      transform-origin: ${clickPos};
      opacity: 0;
   }
   100% {
      transform: scale(1);
      transform-origin: ${clickPos};
      opacity: 1;
   }
`;

const relativeContractor = (clickPos: TButtonPos): Keyframes => keyframes`
   0% {
      transform: scale(1);
      transform-origin: ${clickPos};
      opacity: 1;
   }
   100% {
      transform: scale(0);
      transform-origin: ${clickPos};
      opacity: 0;
   }
`;

export const PopupMenuWrapper = styled.div<{
   topPx: number;
   leftPx: number;
   isOpen: boolean;
   clickPos: TButtonPos;
   widthPx: number;
   heightPx: number;
   isDarkTheme: boolean;
}>`
   position: fixed;
   top: ${({ topPx }) => topPx}px;
   left: ${({ leftPx }) => leftPx}px;
   height: ${({ heightPx }) => heightPx}px;
   width: ${({ widthPx }) => widthPx}px;
   z-index: 100;
   border-radius: 10px;
   backdrop-filter: blur(5px);
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.dialog, 1)
         : Color.setRgbOpacity(Color.lightThm.dialog, 1)};
   box-shadow: ${({ isDarkTheme }) =>
      isDarkTheme ? Color.darkThm.boxShadow : Color.lightThm.boxShadow};
   border: 1px solid
      ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   animation: ${({ isOpen, clickPos }) =>
         isOpen ? relativeExpander(clickPos) : relativeContractor(clickPos)}
      0.25s ease-in-out;
   animation-fill-mode: forwards;
`;
