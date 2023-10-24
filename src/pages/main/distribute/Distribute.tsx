import { Question } from '@styled-icons/bootstrap/Question';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { useContext, useEffect } from 'react';
import { HeaderRightElWrapper } from '../../../global/components/app/layout/header/Header';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../global/context/widget/bottomPanel/BottomPanelContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import ObjectOfObjects from '../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import IncomeClass from '../details/components/Income/class/Class';
import CurrentClass from '../details/components/accounts/current/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
import HelpRequirements from './components/HelpRequirements';
import DistributeForm from './components/distributerForm/DistributerForm';

export default function Distribute(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Distribute');
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   const { setHeaderRightElement } = useHeaderContext();
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);
   const { setIsModalOpen, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();

   useEffect(() => {
      if (
         ObjectOfObjects.findObjFromUniqueVal(currentAccounts || {}, 'Salary & Expenses') &&
         ObjectOfObjects.findObjFromUniqueVal(currentAccounts || {}, 'Spending') &&
         !ObjectOfObjects.isEmpty(income || {}) &&
         !ObjectOfObjects.isEmpty(expenses || {})
      ) {
         setHeaderRightElement(
            <HeaderRightElWrapper>
               <TextBtn
                  onClick={() => {
                     setBottomPanelHeading('Distribute');
                     setBottomPanelContent(<DistributeForm />);
                     setBottomPanelZIndex(100);
                     setIsBottomPanelOpen(true);
                  }}
                  isDarkTheme={isDarkTheme}
               >
                  <Add height={isPortableDevice ? '1.5em' : '1em'} />
               </TextBtn>
            </HeaderRightElWrapper>,
         );
      } else {
         setHeaderRightElement(
            <HeaderRightElWrapper>
               <TextBtn
                  onClick={() => {
                     setModalHeader('Requirements');
                     setModalContent(<HelpRequirements />);
                     setModalZIndex(100);
                     setIsModalOpen(true);
                  }}
                  isDarkTheme={isDarkTheme}
               >
                  <Question height={isPortableDevice ? '1.5em' : '1em'} />
               </TextBtn>
            </HeaderRightElWrapper>,
         );
      }
   }, [currentAccounts, income, expenses]);

   return <>History of Distributed Incomes Goes Here</>;
}
