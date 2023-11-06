import type { Keyframes } from 'styled-components';
import styled, { keyframes } from 'styled-components';
import MyCSS from '../../../css/MyCSS';
import Color from '../../../css/colors';
import type { TButtonPos } from './ContextMenu';

//TODO: create an example ui component for the context menu using all the styles here

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

export const CMItemsListWrapper = styled.div<{ isDarkTheme: boolean }>`
   & > *:not(:last-child) {
      border-bottom: 1px solid
         ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   }
`;

export const CMListHeader = styled.div<{ isTopHeader?: boolean; isDarkTheme: boolean }>`
   font-size: 0.8em;
   padding-left: 0.5em;
   justify-content: center;
   display: flex;
   background-color: grey;
   background-color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.3)};
   align-items: center;
   border-top-left-radius: ${({ isTopHeader }) => (isTopHeader ? '10px' : '0px')};
   border-top-right-radius: ${({ isTopHeader }) => (isTopHeader ? '10px' : '0px')};
   padding-top: 0.5em;
   padding-bottom: 0.5em;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      font-size: 0.3em;
      padding-top: 0.3em;
      padding-bottom: 0.3em;
   }
`;

export const CMItemContainer = styled.div<{
   isDarkTheme: boolean;
   warningItem?: boolean;
   dangerItem?: boolean;
}>`
   padding: 0.5em;
   display: flex;
   justify-content: space-between;
   align-items: center;
   color: ${({ isDarkTheme, warningItem, dangerItem }) =>
      isDarkTheme
         ? warningItem
            ? Color.darkThm.warning
            : dangerItem
            ? Color.darkThm.error
            : Color.darkThm.txt
         : warningItem
         ? Color.lightThm.warning
         : dangerItem
         ? Color.lightThm.error
         : Color.lightThm.txt};
   & > *:nth-child(2) {
      height: 1em;
   }
   &:hover:active {
      background-color: ${({ isDarkTheme }) =>
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.1)};
   }
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      padding: 0.3em;
      &:hover {
         background-color: ${({ isDarkTheme }) =>
            Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.1)};
      }
      cursor: pointer;
      & > *:nth-child(2) {
         height: 0.3em;
      }
   }
`;

export const CMItemTitle = styled.div`
   font-size: 0.8em;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      font-size: 0.3em;
   }
`;
