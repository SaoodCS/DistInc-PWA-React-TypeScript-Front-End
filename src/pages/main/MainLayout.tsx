import { User } from '@styled-icons/boxicons-solid/User';
import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { Receipt } from '@styled-icons/material-sharp/Receipt';
import { AttachMoney } from '@styled-icons/material/AttachMoney';
import { Fragment, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BuildingBank } from 'styled-icons/fluentui-system-filled';
import { AccountCircle } from 'styled-icons/material';
import Logo from '../../global/components/app/logo/Logo';
import Footer from '../../global/components/lib/footer/Footer';
import { StyledLink } from '../../global/components/lib/footer/Style';
import { Body, Header } from '../../global/components/lib/layout/Style';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import Sidebar from '../../global/components/lib/sidebar/Sidebar';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import Color from '../../global/theme/colors';

const LogoWrapper = styled.div`
   padding-left: 1em;
   padding-right: 1em;
   display: flex;
   justify-content: center;
   align-items: center;
`;

const SidebarContainer = styled.div<{ isDarkTheme: boolean }>`
   border-right: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   position: fixed;
   width: 15%;
   top: 0;
   bottom: 0px;
   border-radius: 15px;
`;

const SidebarItem = styled.div<{ isActive: boolean; isDarkTheme: boolean }>`
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

const sidebarItems = [
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

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, toggleTheme, isMobile } = useThemeContext();
   const location = useLocation();

   return (
      <>
         <Header isDarkTheme={isDarkTheme}>Profile</Header>
         <Body isDarkTheme={isDarkTheme}>
            {/* <button onClick={toggleTheme}>Toggle Theme</button> */}
            <Outlet />
         </Body>
         <ConditionalRender condition={!isMobile}>
            <Sidebar />
         </ConditionalRender>
         <ConditionalRender condition={isMobile}>
            <Footer />
         </ConditionalRender>
      </>
   );
}
