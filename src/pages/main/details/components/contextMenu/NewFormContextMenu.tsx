import { CashStack as Dollar } from '@styled-icons/bootstrap/CashStack';
import { Receipt } from '@styled-icons/bootstrap/Receipt';
import { Savings } from '@styled-icons/fluentui-system-regular/Savings';
import { useContext } from 'react';
import {
   CMItemContainer,
   CMItemTitle,
   CMItemsListWrapper,
} from '../../../../../global/components/lib/contextMenu/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../global/context/widget/modal/ModalContext';
import IncomeForm from '../Income/form/IncomeForm';
import SavingsForm from '../accounts/savings/form/SavingsForm';
import ExpenseForm from '../expense/form/ExpenseForm';

export default function NewFormContextMenu(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   const { setIsModalOpen, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);


   function handleClick(name: 'Savings' | 'Income' | 'Expense'): void {
      if (isPortableDevice) {
         setBottomPanelHeading(`New ${name}`);
         if (name === 'Savings') setBottomPanelContent(<SavingsForm />);
         if (name === 'Income') setBottomPanelContent(<IncomeForm />);
         if (name === 'Expense') setBottomPanelContent(<ExpenseForm />);
         setBottomPanelZIndex(2);
         setIsBottomPanelOpen(true);
      } else {
         setModalHeader(`New ${name}`);
         if (name === 'Savings') setModalContent(<SavingsForm />);
         if (name === 'Income') setModalContent(<IncomeForm />);
         if (name === 'Expense') setModalContent(<ExpenseForm />);
         setModalZIndex(2);
         setIsModalOpen(true);
      }
   }

   return (
      <>
      <CMItemsListWrapper isDarkTheme={isDarkTheme}>
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
   </>
   );
}
