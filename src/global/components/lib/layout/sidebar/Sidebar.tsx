import { useLocation } from 'react-router-dom';
import { AccountCircle } from 'styled-icons/material';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { auth } from '../../../../firebase/config/config';
import Color from '../../../../theme/colors';
import Logo from '../../../app/logo/Logo';
import { StyledLink } from '../footer/Style';
import { navItems } from '../navItems';
import { ActiveTag, LogoWrapper, SidebarContainer, SidebarItem, UserAccountWrapper } from './Style';

export default function Sidebar(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const location = useLocation();

   function handleLogoCardColor() {
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.8);
   }

   function handleLogoDetailsColor() {
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg, 0.8);
   }

   function handleGetEmail() {
      const email = auth.currentUser?.email;
      if (!email) return;
      return email;
   }

   return (
      <SidebarContainer isDarkTheme={isDarkTheme}>
         <LogoWrapper>
            <Logo
               size="8.5em"
               bgColor="transparent"
               cardColor={handleLogoCardColor()}
               detailsColor={handleLogoDetailsColor()}
            />
         </LogoWrapper>
         <UserAccountWrapper isDarkTheme={isDarkTheme}>
            <AccountCircle />
            {handleGetEmail()}
         </UserAccountWrapper>
         {navItems.map((item) => (
            <StyledLink key={item.name} to={item.name}>
               <SidebarItem
                  isActive={location.pathname.includes(item.name)}
                  isDarkTheme={isDarkTheme}
               >
                  <ActiveTag />
                  {item.icon}
                  {item.name}
               </SidebarItem>
            </StyledLink>
         ))}
      </SidebarContainer>
   );
}