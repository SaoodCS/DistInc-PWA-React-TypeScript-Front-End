import styled from 'styled-components';
import Color from '../../../theme/colors';
import { User } from '@styled-icons/boxicons-solid/User';
import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { Receipt } from '@styled-icons/material-sharp/Receipt';
import { AttachMoney } from '@styled-icons/material/AttachMoney';
import { BuildingBank } from 'styled-icons/fluentui-system-filled';

export const SidebarItem = styled.div<{ isActive: boolean; isDarkTheme: boolean }>`
   text-align: left;
   border: 1px solid ${Color.lightThm.border};
   padding: 1em;
   text-transform: capitalize;
   display: flex;
   align-items: center;
   background-color: ${({ isActive, isDarkTheme }) =>
      isActive ? Color.darkThm.inactive : 'transparent'};
   border-bottom: 1px solid ${Color.darkThm.border};
   border-bottom-left-radius: 1em;
   border-bottom-right-radius: 1em;

   // hover effect:
   :hover {
      background-color: ${({ isDarkTheme, isActive }) =>
         !isActive && Color.setRgbOpacity(Color.darkThm.inactive, 0.5)};
      cursor: pointer;
   }

   & > :first-child {
      height: 1.5em;
      padding-right: 0.5em;
   }
`;


export const SidebarContainer = styled.div<{ isDarkTheme: boolean }>`
   border-right: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   position: fixed;
   width: 15%;
   top: 0;
   bottom: 0px;
   border-radius: 15px;
`;

export const LogoWrapper = styled.div`
   padding-left: 1em;
   padding-right: 1em;
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const UserAccountWrapper = styled.div`
   display: flex;
   align-items: center;
   flex-direction: row;
   height: 3em;
   padding-bottom: 1em;
   user-select: none;
   & > :first-child {
      height: 3em;
      padding-right: 0.5em;
      padding-left: 1em;
      color: grey;
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