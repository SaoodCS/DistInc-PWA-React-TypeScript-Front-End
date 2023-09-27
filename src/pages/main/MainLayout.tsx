import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Body, Header, StyledBackArr } from '../../global/components/app/layout/Style';
import Footer from '../../global/components/app/layout/footer/Footer';
import Sidebar from '../../global/components/app/layout/sidebar/Sidebar';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import StringHelper from '../../global/helpers/dataTypes/string/StringHelper';
import useHeaderContext from './context/header/hook/useHeaderContext';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, toggleTheme, isPortableDevice } = useThemeContext();
   const location = useLocation();
   const { headerTitle, setHeaderTitle, showBackBtn, handleBackBtnClick } = useHeaderContext();

   useEffect(() => {
      const path = location.pathname.split('/').pop();
      if (path) {
         setHeaderTitle(StringHelper.firstLetterToUpper(path));
      }
   }, [location.pathname]);

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
