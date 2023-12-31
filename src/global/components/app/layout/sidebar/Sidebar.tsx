import { AccountCircle } from '@styled-icons/material/AccountCircle';
import { useQueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import Color from '../../../../css/colors';
import { auth } from '../../../../firebase/config/config';
import Logo from '../../../app/logo/Logo';
import { StyledLink } from '../footer/Style';
import NavItems from '../utils/navItems';
import {
   ActiveTag,
   CompanyTag,
   LogoWrapper,
   SidebarContainer,
   SidebarItem,
   StyledEmail,
   UserAccountWrapper,
} from './Style';

export default function Sidebar(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const location = useLocation();
   const queryClient = useQueryClient();

   function handleLogoCardColor(): string {
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.8);
   }

   function handleLogoDetailsColor(): string {
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg, 0.8);
   }

   function handleGetEmail(): string | undefined {
      const email = auth.currentUser?.email;
      if (!email) return;
      return email;
   }

   async function handleSignOut(): Promise<void> {
      sessionStorage.clear();
      queryClient.clear();
      await auth.signOut();
   }

   return (
      <SidebarContainer isDarkTheme={isDarkTheme}>
         <LogoWrapper>
            <Logo
               size="8em"
               bgColor="transparent"
               cardColor={handleLogoCardColor()}
               detailsColor={handleLogoDetailsColor()}
            />
         </LogoWrapper>
         <UserAccountWrapper isDarkTheme={isDarkTheme}>
            <AccountCircle />
            <StyledEmail> {handleGetEmail()}</StyledEmail>
         </UserAccountWrapper>
         {NavItems.sidebar.map((item) => (
            <Fragment key={item.name}>
               <StyledLink to={item.name !== 'signout' ? item.name : '#'}>
                  <SidebarItem
                     isActive={location.pathname.includes(item.name)}
                     isDarkTheme={isDarkTheme}
                     onClick={item.name === 'signout' ? () => handleSignOut() : undefined}
                  >
                     <ActiveTag />
                     {item.icon}
                     {item.name}
                  </SidebarItem>
               </StyledLink>
            </Fragment>
         ))}
         <CompanyTag isDarkTheme={isDarkTheme}>DistInc 2023 &copy; All rights reserved.</CompanyTag>
      </SidebarContainer>
   );
}
