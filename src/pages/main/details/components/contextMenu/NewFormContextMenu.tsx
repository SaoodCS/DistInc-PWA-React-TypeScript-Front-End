import { Bank } from '@styled-icons/bootstrap/Bank';
import { CashStack as Dollar } from '@styled-icons/bootstrap/CashStack';
import { Receipt } from '@styled-icons/bootstrap/Receipt';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { Savings } from '@styled-icons/fluentui-system-regular/Savings';
import { useContext } from 'react';
import { TextBtn } from '../../../../../global/components/lib/button/textBtn/Style';
import ContextMenu from '../../../../../global/components/lib/contextMenu/ContextMenu';
import {
   CMItemContainer,
   CMItemTitle,
   CMItemsListWrapper,
} from '../../../../../global/components/lib/contextMenu/Style';
import useContextMenu from '../../../../../global/components/lib/contextMenu/hooks/useContextMenu';
import { TransparentOverlay } from '../../../../../global/components/lib/overlay/transparentOverlay/TransparentOverlay';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../global/context/widget/modal/ModalContext';
import IncomeForm from '../Income/form/IncomeForm';
import { default as CurrentForm } from '../accounts/current/form/CurrentForm';
import SavingsForm from '../accounts/savings/form/SavingsForm';
import ExpenseForm from '../expense/form/ExpenseForm';
import { DetailsCMOpenerWrapper } from './Style';

export default function NewFormContextMenu(): JSX.Element {
   const { showMenu, toggleMenu, buttonRef } = useContextMenu();
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   const { setIsModalOpen, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);

   function handleClick(name: string): void {
      if (isPortableDevice) {
         setBottomPanelHeading(`New ${name}`);
         if (name === 'Current') setBottomPanelContent(<CurrentForm />);
         if (name === 'Savings') setBottomPanelContent(<SavingsForm />);
         if (name === 'Income') setBottomPanelContent(<IncomeForm />);
         if (name === 'Expense') setBottomPanelContent(<ExpenseForm />);
         setBottomPanelZIndex(2);
         setIsBottomPanelOpen(true);
      } else {
         setModalHeader(`New ${name}`);
         if (name === 'Current') setModalContent(<CurrentForm />);
         if (name === 'Savings') setModalContent(<SavingsForm />);
         if (name === 'Income') setModalContent(<IncomeForm />);
         if (name === 'Expense') setModalContent(<ExpenseForm />);
         // TODO: add a JSX Success message to each of these forms if successfully updated if portable device 
         setModalZIndex(2);
         setIsModalOpen(true);
      }
      toggleMenu();
   }

   return (
      <>
         <DetailsCMOpenerWrapper>
            <TextBtn
               onClick={() => toggleMenu()}
               isDarkTheme={isDarkTheme}
               ref={buttonRef}
               isDisabled={showMenu}
            >
               <Add height={isPortableDevice ? '1.5em' : '1em'} />
            </TextBtn>
         </DetailsCMOpenerWrapper>
         <ConditionalRender condition={showMenu}>
            <TransparentOverlay />
         </ConditionalRender>
         <ContextMenu
            ref={buttonRef}
            isOpen={showMenu}
            toggleClose={() => toggleMenu()}
            btnPosition="top right"
            widthPx={200}
         >
            <CMItemsListWrapper isDarkTheme={isDarkTheme}>
               <CMItemContainer onClick={() => handleClick('Current')} isDarkTheme={isDarkTheme}>
                  <CMItemTitle> New Current Account</CMItemTitle>
                  <Bank />
               </CMItemContainer>
               <CMItemContainer onClick={() => handleClick('Savings')} isDarkTheme={isDarkTheme}>
                  <CMItemTitle> New Savings Account</CMItemTitle>
                  <Savings />
               </CMItemContainer>
               <CMItemContainer onClick={() => handleClick('Income')} isDarkTheme={isDarkTheme}>
                  <CMItemTitle> New Income</CMItemTitle>
                  <Dollar />
               </CMItemContainer>
               <CMItemContainer onClick={() => handleClick('Expense')} isDarkTheme={isDarkTheme}>
                  <CMItemTitle> New Expense</CMItemTitle>
                  <Receipt />
               </CMItemContainer>
            </CMItemsListWrapper>
         </ContextMenu>
      </>
   );
}
