import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AccountCircle } from 'styled-icons/material';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Logo from '../../app/logo/Logo';
import { StyledLink } from '../footer/Style';
import {
   LogoWrapper,
   SidebarContainer,
   SidebarItem,
   UserAccountWrapper,
   sidebarItems,
} from './Style';

export default function Sidebar(): JSX.Element {
   const { isDarkTheme, toggleTheme, isMobile } = useThemeContext();
   const location = useLocation();
   return (
      <SidebarContainer isDarkTheme={isDarkTheme}>
         <LogoWrapper>
            <Logo size="8em" bgColor="transparent"/>
         </LogoWrapper>
         <UserAccountWrapper>
            <AccountCircle />
            saood.aslam@hotmail.com
         </UserAccountWrapper>
         {sidebarItems.map((item) => (
            <StyledLink key={item.name} to={item.name}>
               <SidebarItem
                  isActive={location.pathname.includes(item.name)}
                  isDarkTheme={isDarkTheme}
               >
                  <div />
                  {item.icon}
                  {item.name}
               </SidebarItem>
            </StyledLink>
         ))}
      </SidebarContainer>
   );
}
