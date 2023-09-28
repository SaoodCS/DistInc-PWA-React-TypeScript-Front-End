import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Body, Header, StyledBackArr } from '../../global/components/app/layout/Style';
import Footer from '../../global/components/app/layout/footer/Footer';
import Sidebar from '../../global/components/app/layout/sidebar/Sidebar';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import useHeaderContext from './context/header/hooks/useHeaderContext';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, toggleTheme, isPortableDevice } = useThemeContext();
   const { headerTitle, showBackBtn, handleBackBtnClick } = useHeaderContext();

   return (
      <>
         <Header isDarkTheme={isDarkTheme}>
            <ConditionalRender condition={showBackBtn}>
               <StyledBackArr onClick={handleBackBtnClick} />
            </ConditionalRender>
            {headerTitle}
         </Header>
         <Body isDarkTheme={isDarkTheme}>
            <Outlet />
         </Body>
         <ConditionalRender condition={!isPortableDevice}>
            <Sidebar />
         </ConditionalRender>
         <ConditionalRender condition={isPortableDevice}>
            <Footer />
         </ConditionalRender>
      </>
   );
}
