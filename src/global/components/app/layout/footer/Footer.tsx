import { useLocation } from 'react-router-dom';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { navItems } from '../navItems';
import { FooterContainer, FooterItem, StyledLink } from './Style';

export default function Footer(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const location = useLocation();

   function handleIsActive(name: string): boolean {
      return location.pathname.includes(name);
   }

   return (
      <FooterContainer isDarkTheme={isDarkTheme}>
         {navItems.map((item) => (
            <StyledLink key={item.name} to={item.name}>
               <FooterItem
                  key={item.name}
                  isActive={handleIsActive(item.name)}
                  isDarkTheme={isDarkTheme}
               >
                  {item.icon}
                  {item.name}
               </FooterItem>
            </StyledLink>
         ))}
      </FooterContainer>
   );
}
