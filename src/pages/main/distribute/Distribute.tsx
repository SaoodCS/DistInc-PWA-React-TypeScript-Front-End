import { QuestionMark as QMark } from '@styled-icons/boxicons-regular/QuestionMark';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { useContext, useEffect } from 'react';
import { HeaderRightElWrapper } from '../../../global/components/app/layout/header/Header';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import FetchError from '../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { FlatListWrapper } from '../../../global/components/lib/flatList/Style';
import DetailsPlaceholder from '../../../global/components/lib/flatList/placeholder/Placeholder';
import Loader from '../../../global/components/lib/loader/Loader';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import JSXHelper from '../../../global/helpers/dataTypes/jsx/jsxHelper';
import IncomeClass from '../details/components/Income/class/Class';
import CurrentClass from '../details/components/accounts/current/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
import HelpRequirements from './components/HelpRequirements';
import DistributeForm from './components/distributerForm/DistributerForm';
import DistributerClass from './components/distributerForm/class/DistributerClass';

export default function Distribute(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Distribute');
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   const { setHeaderRightElement } = useHeaderContext();
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { setIsModalOpen, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const {
      data: calcDistData,
      isLoading,
      isPaused,
      error,
   } = DistributerClass.useQuery.getCalcDist({
      onSuccess: () => {
         setIsModalOpen(false);
      },
   });

   useEffect(() => {
      const reqCheck = DistributerClass.checkCalcReq(
         currentAccounts || {},
         income || {},
         expenses || {},
      );
      const isAllReqValid = ArrayOfObjects.doAllObjectsHaveKeyValuePair(reqCheck, 'isValid', true);
      const iconHeight = isPortableDevice ? '1.5em' : '1em';
      setHeaderRightElement(
         <HeaderRightElWrapper>
            <TextBtn
               onClick={() => {
                  setModalHeader(isAllReqValid ? 'Distribute' : 'Requirements');
                  setModalContent(isAllReqValid ? <DistributeForm /> : <HelpRequirements />);
                  setModalZIndex(100);
                  setIsModalOpen(true);
               }}
               isDarkTheme={isDarkTheme}
            >
               {isAllReqValid ? <Add height={iconHeight} /> : <QMark height={iconHeight} />}
            </TextBtn>
         </HeaderRightElWrapper>,
      );
   }, [currentAccounts, income, expenses]);

   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <FlatListWrapper>{JSXHelper.repeatJSX(<DetailsPlaceholder />, 7)}</FlatListWrapper>;
   }
   if (isPaused) return <OfflineFetch />;
   if (error) return <FetchError />;

   return <>{JSON.stringify(calcDistData || '')}</>;
}
