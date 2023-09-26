import { Outlet, useLocation } from 'react-router-dom';
import { Body, Header } from '../../global/components/app/layout/Style';
import Footer from '../../global/components/app/layout/footer/Footer';
import Sidebar from '../../global/components/app/layout/sidebar/Sidebar';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, toggleTheme, isPortableDevice } = useThemeContext();
   const location = useLocation();

   function handleHeaderTitle(): string | undefined {
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
         <ConditionalRender condition={!isPortableDevice}>
            <Sidebar />
         </ConditionalRender>
         <ConditionalRender condition={isPortableDevice}>
            <Footer />
         </ConditionalRender>
      </>
   );
}
