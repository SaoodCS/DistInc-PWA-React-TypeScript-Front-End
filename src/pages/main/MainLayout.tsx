import { Bank } from '@styled-icons/bootstrap/Bank';
import { CashStack as Dollar } from '@styled-icons/bootstrap/CashStack';
import { Receipt } from '@styled-icons/bootstrap/Receipt';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { Outlet } from 'react-router-dom';
import { Body } from '../../global/components/app/layout/body/Body';
import Footer from '../../global/components/app/layout/footer/Footer';
import { Header, StyledBackArr } from '../../global/components/app/layout/header/Header';
import Sidebar from '../../global/components/app/layout/sidebar/Sidebar';
import { TextBtn } from '../../global/components/lib/button/textBtn/Style';
import ContextMenu from '../../global/components/lib/contextMenu/ContextMenu';
import useContextMenu from '../../global/components/lib/contextMenu/hooks/useContextMenu';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useHeaderContext from '../../global/context/header/hooks/useHeaderContext';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { headerTitle, showBackBtn, handleBackBtnClick } = useHeaderContext();
   const { showMenu, toggleMenu, buttonRef } = useContextMenu();

   return (
      <>
         <Header isDarkTheme={isDarkTheme}>
            <ConditionalRender condition={showBackBtn}>
               <StyledBackArr onClick={handleBackBtnClick} darktheme={isDarkTheme.toString()} />
            </ConditionalRender>
            {headerTitle}

            <div
               style={{
                  display: 'flex',
                  position: 'fixed',
                  alignItems: 'center',
                  right: 0,
                  top: 0,
                  height: '10%',
                  marginRight: '1em',
               }}
            >
               <TextBtn
                  onClick={() => toggleMenu()}
                  isDarkTheme={isDarkTheme}
                  ref={buttonRef}
                  isDisabled={showMenu}
                  style={{ margin: 0, padding: 0 }}
               >
                  <Add style={{ height: '1.5em' }} />
               </TextBtn>
            </div>
            <ContextMenu
               ref={buttonRef}
               isOpen={showMenu}
               toggleClose={() => toggleMenu()}
               btnPosition={'top right'}
               widthPx={200}
            >
               <div style={{ fontSize: '0.9em' }}>
                  <div
                     style={{
                        borderBottom: '1px solid grey',
                        padding: '0.5em',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                     }}
                  >
                     New Bank Account
                     <Bank style={{ height: '1.25em' }} />
                  </div>
                  <div
                     style={{
                        borderBottom: '1px solid grey',
                        padding: '0.5em',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                     }}
                  >
                     New Income
                     <Dollar style={{ height: '1.25em' }} />
                  </div>
                  <div
                     style={{
                        padding: '0.5em',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                     }}
                  >
                     New Expense
                     <Receipt style={{ height: '1.25em' }} />
                  </div>
               </div>
            </ContextMenu>
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
