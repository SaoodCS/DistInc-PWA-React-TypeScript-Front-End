import { Outlet, useLocation } from 'react-router-dom';
import { Body, Header } from '../../global/components/lib/layout/Style';
import Footer from '../../global/components/lib/layout/footer/Footer';
import Sidebar from '../../global/components/lib/layout/sidebar/Sidebar';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, toggleTheme, isMobile } = useThemeContext();
   const location = useLocation();

   function handleHeaderTitle() {
      const path = location.pathname.split('/').pop();
      if (!path) return;
      return path?.charAt(0).toUpperCase() + path?.slice(1);
   }

   return (
      <>
         <Header isDarkTheme={isDarkTheme}>{handleHeaderTitle()}</Header>
         <Body isDarkTheme={isDarkTheme}>
            <button onClick={toggleTheme}>Toggle Theme</button>
            <Outlet />
         </Body>
         <ConditionalRender condition={!isMobile}>
            <Sidebar />
         </ConditionalRender>
         <ConditionalRender condition={isMobile}>
            <Footer />
         </ConditionalRender>
      </>
   );
}
