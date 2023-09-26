import styled from 'styled-components';
import Color from '../../../../theme/colors';

export const SidebarContainer = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 15%;
   top: 0;
   bottom: 0px;
   background-image: ${({ isDarkTheme }) => `radial-gradient(
      circle,
      ${Color.setRgbOpacity(isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive, 1)} 0%,
      ${Color.setRgbOpacity(isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive, 1)} 100%
   )`};
`;

export const LogoWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const UserAccountWrapper = styled.div<{ isDarkTheme: boolean }>`
   display: flex;
   align-items: center;
   justify-content: left;
   flex-direction: row;
   height: 3em;
   padding-bottom: 1em;
   user-select: none;
   font-size: 0.9em;
   color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.75)};
   & > :first-child {
      height: 3em;
      padding-right: 0.5em;
      padding-left: 1em;
      @media (max-width: 1700px) {
         padding-bottom: 1em;
         height: 5em;
         padding-left: 0;
      }
      @media (max-width: 1300px) {
         height: 6em;
      }
   }
   @media (max-width: 1700px) {
      height: 7em;
      flex-direction: column;
      font-size: 0.85em;
   }
`;

export const StyledEmail = styled.div`
   @media (max-width: 1300px) {
      display: none;
   }
`;

export const SidebarItem = styled.div<{ isActive: boolean; isDarkTheme: boolean }>`
   position: relative;
   text-align: left;
   padding: 1em;
   text-transform: capitalize;
   display: flex;
   align-items: center;
   background-color: ${({ isActive, isDarkTheme }) =>
      isActive && isDarkTheme
         ? Color.darkThm.bg
         : isActive && !isDarkTheme
         ? Color.lightThm.bg
         : 'transparent'};
   /* color: ${({ isActive, isDarkTheme }) =>
      isActive
         ? isDarkTheme
            ? Color.darkThm.accent
            : Color.lightThm.accent
         : Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.75)}; */

   ::before {
      content: '';
      position: absolute;
      top: -40px;
      right: 0;
      height: 40px;
      width: 50px;
      border-bottom-left-radius: 50%;
      box-shadow: ${({ isActive, isDarkTheme }) =>
         isActive && isDarkTheme
            ? `-1px 20px 0 0 ${Color.darkThm.bg}`
            : isActive && !isDarkTheme
            ? `-1px 20px 0 0 ${Color.lightThm.bg}`
            : 'none'};
      transform: scaleX(-1);
   }

   ::after {
      content: '';
      position: absolute;
      right: 0px;
      height: 40px;
      width: 50px;
      border-bottom-right-radius: 50%;
      box-shadow: ${({ isActive, isDarkTheme }) =>
         isActive && isDarkTheme
            ? `0 20px 0 0 ${Color.darkThm.bg}`
            : isActive && !isDarkTheme
            ? `0 20px 0 0 ${Color.lightThm.bg}`
            : 'none'};
      transform: scaleY(-1);
      bottom: 0;
      top: 55px;
   }

   :hover {
      background-color: ${({ isDarkTheme, isActive }) =>
         !isActive && Color.setRgbOpacity(isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg, 0.5)};
      cursor: pointer;
   }
   & > :first-child {
      position: absolute;
      left: 0;
      height: 1.5em;
      padding-top: 1em;
      padding-bottom: 1em;
      display: ${({ isActive }) => (isActive ? 'block' : 'none')};
      width: 0.5em;
      background-color: ${Color.darkThm.accent};
      background-color: ${({ isDarkTheme }) =>
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.85)};
   }
   & > :nth-child(2) {
      height: 1.5em;
      padding-right: 0.5em;
   }
`;

export const ActiveTag = styled.div``;
