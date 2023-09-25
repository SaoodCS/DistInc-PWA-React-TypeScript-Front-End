import { User } from '@styled-icons/boxicons-solid/User';
import { BuildingBank } from '@styled-icons/fluentui-system-filled/BuildingBank';
import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { Receipt } from '@styled-icons/material-sharp/Receipt';
import { AttachMoney } from '@styled-icons/material/AttachMoney';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Color from '../../../theme/colors';
import { FooterContainer, FooterItem } from './Style';

export default function Footer(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      console.log(location.pathname);
      const footer = document.getElementById('footer');
      const children = footer?.children;
      if (children) {
         for (let i = 0; i < children?.length; i++) {
            const child = children[i];
            if (child.id === location.pathname.slice(1)) {
               (child as HTMLElement).style.color = isDarkTheme
                  ? Color.darkThm.txt
                  : Color.lightThm.txt;
            } else {
               (child as HTMLElement).style.color = Color.setRgbOpacity(
                  isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
                  0.6,
               );
            }
         }
      }
   }, [location.pathname]);
   return (
      <FooterContainer id="footer">
         <FooterItem id="main">
            <User />
         </FooterItem>
         <FooterItem id="bank">
            <BuildingBank />
         </FooterItem>
         <FooterItem id="expense">
            <Receipt />
         </FooterItem>
         <FooterItem id="Income">
            <AttachMoney />
         </FooterItem>
         <FooterItem id="settings">
            <Settings />
         </FooterItem>
      </FooterContainer>
   );
}
