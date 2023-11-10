import { Outlet } from 'react-router-dom';
import { Body } from '../../global/components/app/layout/body/Body';
import Footer from '../../global/components/app/layout/footer/Footer';
import {
   Header,
   HeaderRightElWrapper,
   StyledBackArr,
} from '../../global/components/app/layout/header/Header';
import Sidebar from '../../global/components/app/layout/sidebar/Sidebar';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import useHeaderContext from '../../global/context/widget/header/hooks/useHeaderContext';
import DistributeContextProvider from './distribute/context/DistributeContextProvider';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { headerTitle, showBackBtn, handleBackBtnClick, headerRightElement } = useHeaderContext();

   return (
      <>
         <Header isDarkTheme={isDarkTheme}>
            <ConditionalRender condition={showBackBtn}>
               <StyledBackArr onClick={handleBackBtnClick} darktheme={isDarkTheme.toString()} />
            </ConditionalRender>
            {headerTitle}
            <HeaderRightElWrapper isDarkTheme={isDarkTheme}>
               {headerRightElement}
            </HeaderRightElWrapper>
         </Header>
         <DistributeContextProvider>
            <Body isDarkTheme={isDarkTheme}>
               <Outlet />
            </Body>
         </DistributeContextProvider>
         <ConditionalRender condition={!isPortableDevice}>
            <Sidebar />
         </ConditionalRender>
         <ConditionalRender condition={isPortableDevice}>
            <Footer />
         </ConditionalRender>
      </>
   );
}
