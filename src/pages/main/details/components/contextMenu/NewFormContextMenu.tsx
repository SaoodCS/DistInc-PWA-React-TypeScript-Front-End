import { CashStack as Dollar } from '@styled-icons/bootstrap/CashStack';
import { Receipt } from '@styled-icons/bootstrap/Receipt';
import { Savings } from '@styled-icons/fluentui-system-regular/Savings';
import { useContext } from 'react';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../global/components/lib/popupMenu/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../global/context/widget/modal/ModalContext';
import IncomeForm from '../Income/form/IncomeForm';
import SavingsForm from '../accounts/savings/form/SavingsForm';
import ExpenseForm from '../expense/form/ExpenseForm';

export default function NewFormContextMenu(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { toggleBottomPanel, setBottomPanelContent, setBottomPanelHeading, setBottomPanelZIndex } =
      useContext(BottomPanelContext);

   const { toggleModal, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);

   function handleClick(name: 'Savings' | 'Income' | 'Expense'): void {
      if (isPortableDevice) {
         toggleBottomPanel(true);
         setBottomPanelHeading(`New ${name}`);
         if (name === 'Savings') setBottomPanelContent(<SavingsForm />);
         if (name === 'Income') setBottomPanelContent(<IncomeForm />);
         if (name === 'Expense') setBottomPanelContent(<ExpenseForm />);
         setBottomPanelZIndex(2);
      } else {
         toggleModal(true);
         setModalHeader(`New ${name}`);
         if (name === 'Savings') setModalContent(<SavingsForm />);
         if (name === 'Income') setModalContent(<IncomeForm />);
         if (name === 'Expense') setModalContent(<ExpenseForm />);
         setModalZIndex(2);
      }
   }

   return (
      <>
         <PMItemsListWrapper isDarkTheme={isDarkTheme}>
            <PMItemContainer onClick={() => handleClick('Savings')} isDarkTheme={isDarkTheme}>
               <PMItemTitle> New Savings Account</PMItemTitle>
               <Savings />
            </PMItemContainer>
            <PMItemContainer onClick={() => handleClick('Income')} isDarkTheme={isDarkTheme}>
               <PMItemTitle> New Income</PMItemTitle>
               <Dollar />
            </PMItemContainer>
            <PMItemContainer onClick={() => handleClick('Expense')} isDarkTheme={isDarkTheme}>
               <PMItemTitle> New Expense</PMItemTitle>
               <Receipt />
            </PMItemContainer>
         </PMItemsListWrapper>
      </>
   );
}
