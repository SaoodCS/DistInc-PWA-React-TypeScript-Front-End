import type { Keyframes } from 'styled-components';
import styled, { keyframes } from 'styled-components';
import Color from '../../../styles/colors';
import type { TButtonPos } from './ContextMenu';

const relativeExpander = (btnPosition: TButtonPos): Keyframes => keyframes`
   0% {
      transform: scale(0);
      transform-origin: ${btnPosition};
      opacity: 0;
   }
   100% {
      transform: scale(1);
      transform-origin: ${btnPosition};
      opacity: 1;
   }
`;

const relativeContractor = (btnPosition: TButtonPos): Keyframes => keyframes`
   0% {
      transform: scale(1);
      transform-origin: ${btnPosition};
      opacity: 1;
   }
   100% {
      transform: scale(0);
      transform-origin: ${btnPosition};
      opacity: 0;
   }
`;

export const ContextMenuWrapper = styled.div<{
   top: number | undefined;
   left: number | undefined;
   bottom: number | undefined;
   right: number | undefined;
   isDarkTheme: boolean;
   widthPx: number;
   isOpen: boolean;
   btnPosition: TButtonPos;
}>`
   position: absolute;
   top: ${({ top }) => top && `${top}px`};
   left: ${({ left }) => left && `${left}px`};
   bottom: ${({ bottom }) => bottom && `${bottom}px`};
   right: ${({ right }) => right && `${right}px`};
   border-radius: 10px;
   padding: 0.5em;
   z-index: 100;
   width: ${({ widthPx }) => widthPx}px;
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.dialog, 1)
         : Color.setRgbOpacity(Color.lightThm.dialog, 1)};
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
   box-shadow: ${({ isDarkTheme }) =>
      isDarkTheme ? Color.darkThm.boxShadow : Color.lightThm.boxShadow};
   border: 1px solid
      ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   backdrop-filter: blur(50px);
   animation: ${({ isOpen, btnPosition }) =>
         isOpen ? relativeExpander(btnPosition) : relativeContractor(btnPosition)}
      0.25s ease-in-out;
   animation-fill-mode: forwards;
`;
