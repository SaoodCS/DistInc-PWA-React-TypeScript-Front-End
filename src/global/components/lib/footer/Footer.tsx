import { User } from '@styled-icons/boxicons-solid/User';
import { BuildingBank } from '@styled-icons/fluentui-system-filled/BuildingBank';
import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { Receipt } from '@styled-icons/material-sharp/Receipt';
import { AttachMoney } from '@styled-icons/material/AttachMoney';
import { useLocation } from 'react-router-dom';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { FooterContainer, FooterItem, StyledLink } from './Style';

export default function Footer(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const location = useLocation();

   function handleIsActive(name: string): boolean {
      return location.pathname.includes(name);
   }

   return (
      <FooterContainer>
         {footerItems.map((item) => (
            <StyledLink key={item.name} to={item.name} preventScrollReset>
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

const footerItems = [
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
