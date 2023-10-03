import { Bank } from '@styled-icons/bootstrap/Bank';
import { CashStack as Dollar } from '@styled-icons/bootstrap/CashStack';
import { Receipt } from '@styled-icons/bootstrap/Receipt';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { TextBtn } from '../../../../../global/components/lib/button/textBtn/Style';
import ContextMenu from '../../../../../global/components/lib/contextMenu/ContextMenu';
import useContextMenu from '../../../../../global/components/lib/contextMenu/hooks/useContextMenu';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { CMItemContainer, CMItemTitle, CMItemsListWrapper, DetailsCMOpenerWrapper } from './Style';

export default function DetailsContextMenu(): JSX.Element {
   const { showMenu, toggleMenu, buttonRef } = useContextMenu();
   const { isDarkTheme } = useThemeContext();
   return (
      <>
         <DetailsCMOpenerWrapper>
            <TextBtn
               onClick={() => toggleMenu()}
               isDarkTheme={isDarkTheme}
               ref={buttonRef}
               isDisabled={showMenu}
            >
               <Add height="1.5em" />
            </TextBtn>
         </DetailsCMOpenerWrapper>
         <ContextMenu
            ref={buttonRef}
            isOpen={showMenu}
            toggleClose={() => toggleMenu()}
            btnPosition="top right"
            widthPx={200}
         >
            <CMItemsListWrapper isDarkTheme={isDarkTheme}>
               <CMItemContainer>
                  <CMItemTitle> New Bank Account</CMItemTitle>
                  <Bank />
               </CMItemContainer>
               <CMItemContainer>
                  <CMItemTitle> New Income</CMItemTitle>
                  <Dollar />
               </CMItemContainer>
               <CMItemContainer>
                  <CMItemTitle> New Expense</CMItemTitle>
                  <Receipt />
               </CMItemContainer>
            </CMItemsListWrapper>
         </ContextMenu>
      </>
   );
}
