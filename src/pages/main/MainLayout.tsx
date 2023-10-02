import { Outlet } from 'react-router-dom';
import { Body } from '../../global/components/app/layout/body/Body';
import Footer from '../../global/components/app/layout/footer/Footer';
import { Header, StyledBackArr } from '../../global/components/app/layout/header/Header';
import Sidebar from '../../global/components/app/layout/sidebar/Sidebar';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useHeaderContext from '../../global/context/header/hooks/useHeaderContext';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { headerTitle, showBackBtn, handleBackBtnClick } = useHeaderContext();

   return (
      <>
         <Header isDarkTheme={isDarkTheme}>
            <ConditionalRender condition={showBackBtn}>
               <StyledBackArr onClick={handleBackBtnClick} darktheme={isDarkTheme} />
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
