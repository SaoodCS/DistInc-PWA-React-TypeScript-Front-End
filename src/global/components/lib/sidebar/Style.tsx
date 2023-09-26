import { User } from '@styled-icons/boxicons-solid/User';
import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { Receipt } from '@styled-icons/material-sharp/Receipt';
import { AttachMoney } from '@styled-icons/material/AttachMoney';
import styled from 'styled-components';
import { BuildingBank } from 'styled-icons/fluentui-system-filled';
import Color from '../../../theme/colors';

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
   color: ${({ isActive, isDarkTheme }) =>
      isActive
         ? isDarkTheme
            ? Color.darkThm.accent
            : Color.lightThm.accent
         : Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.75)};

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
      display: none; // uncomment this for the tag to show
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

export const SidebarContainer = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 15%;
   top: 0;
   bottom: 0px;
   background-image: ${({ isDarkTheme }) => `radial-gradient(
      circle,
      ${Color.setRgbOpacity(isDarkTheme ? Color.lightThm.accent : Color.lightThm.accent, 0.7)} 0%,
      ${Color.setRgbOpacity(isDarkTheme ? Color.lightThm.accent : Color.lightThm.accent, 1)} 100%
   )`};
`;

export const LogoWrapper = styled.div`
   padding-left: 1em;
   padding-right: 1em;
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const UserAccountWrapper = styled.div<{ isDarkTheme: boolean }>`
   display: flex;
   align-items: center;
   flex-direction: row;
   height: 3em;
   padding-bottom: 1em;
   user-select: none;
   color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.75)};
   & > :first-child {
      height: 3em;
      padding-right: 0.5em;
      padding-left: 1em;
   }
`;

export const sidebarItems = [
   {
      name: 'profile',
      icon: <User />,
   },
   {
      name: 'bank',
      icon: <BuildingBank />,
   },
   {
      name: 'income',
      icon: <AttachMoney />,
   },
   {
      name: 'expense',
      icon: <Receipt />,
   },
   {
      name: 'settings',
      icon: <Settings />,
   },
];
