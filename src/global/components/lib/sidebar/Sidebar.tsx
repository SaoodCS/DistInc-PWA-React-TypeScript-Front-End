import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AccountCircle } from 'styled-icons/material';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Color from '../../../theme/colors';
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
            <Logo
               size="8em"
               bgColor="transparent"
               cardColor={Color.setRgbOpacity(Color.darkThm.txt, 0.8)}
               detailsColor={Color.lightThm.txt}
            />
         </LogoWrapper>
         <UserAccountWrapper isDarkTheme = {isDarkTheme}>
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
