import { useLocation } from 'react-router-dom';
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
   const { isDarkTheme } = useThemeContext();
   const location = useLocation();

   function handleLogoCardColor() {
      if (isDarkTheme) return Color.setRgbOpacity(Color.darkThm.txt, 0.8);
      if (!isDarkTheme) return Color.setRgbOpacity(Color.lightThm.txt, 0.8);
   }

   function handleLogoDetailsColor() {
      if (isDarkTheme) return Color.setRgbOpacity(Color.lightThm.txt, 0.8);
      if (!isDarkTheme) return Color.setRgbOpacity(Color.darkThm.txt, 0.8);
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
