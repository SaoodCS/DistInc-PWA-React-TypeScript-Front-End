import { Outlet } from 'react-router-dom';
import Footer from '../../global/components/lib/footer/Footer';
import { Body, Header } from '../../global/components/lib/layout/Style';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import Sidebar from '../../global/components/lib/sidebar/Sidebar';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, toggleTheme, isMobile } = useThemeContext();

   return (
      <>
         <Header isDarkTheme={isDarkTheme}>Profile</Header>
         <Body isDarkTheme={isDarkTheme}>
            {/* <button onClick={toggleTheme}>Toggle Theme</button> */}
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
