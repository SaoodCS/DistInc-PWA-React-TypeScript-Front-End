import { QuestionMark as QMark } from '@styled-icons/boxicons-regular/QuestionMark';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { useContext, useEffect } from 'react';
import { HeaderRightElWrapper } from '../../../global/components/app/layout/header/Header';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import { CardListTitle, CardListWrapper } from '../../../global/components/lib/cardList/Style';
import CardListPlaceholder from '../../../global/components/lib/cardList/placeholder/CardListPlaceholder';
import { CarouselAndNavBarWrapper } from '../../../global/components/lib/carousel/NavBar';
import FetchError from '../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import Loader from '../../../global/components/lib/loader/Loader';
import PullToRefresh from '../../../global/components/lib/pullToRefresh/PullToRefresh';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../global/helpers/dataTypes/date/DateHelper';
import IncomeClass from '../details/components/Income/class/Class';
import CurrentClass from '../details/components/accounts/current/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
import DistributeForm from './components/distributerForm/DistributerForm';
import type { ICalcSchemaGroupByMonth } from './components/distributerForm/class/DistributerClass';
import DistributerClass from './components/distributerForm/class/DistributerClass';
import AnalyticsItems from './components/historyList/analyticsItem/AnalyticsItem';
import DistMsgsItems from './components/historyList/distMsgsItems/DistMsgsItems';
import SavingsAccHistoryItems from './components/historyList/savingsAccHistoryItem/SavingsAccHistoryItem';
import HelpRequirements from './components/requirementsModal/HelpRequirements';

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
      refetch,
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
      return <CardListPlaceholder repeatItemCount={7} />;
   }
   if (isPaused) return <OfflineFetch />;
   if (error || !calcDistData) return <FetchError />;

   async function handleOnRefresh(): Promise<void> {
      await refetch();
   }

   function sortData(): ICalcSchemaGroupByMonth[] | undefined {
      if (!calcDistData) return;
      const groupedByMonth = DistributerClass.groupByMonth(calcDistData);
      groupedByMonth.reverse();
      return groupedByMonth;
   }

   return (
      <CarouselAndNavBarWrapper>
         <TextColourizer fontSize="2em" bold padding="0.5em">
            History
         </TextColourizer>
         <PullToRefresh isDarkTheme={isDarkTheme} onRefresh={() => handleOnRefresh()}>
            <>
               {sortData()?.map((monthObj) => (
                  <CardListWrapper key={monthObj.monthYear}>
                     <CardListTitle>
                        {DateHelper.fromMMYYYYToWord(monthObj.monthYear)}
                     </CardListTitle>
                     {monthObj.distributer && <DistMsgsItems distributer={monthObj.distributer} />}
                     {monthObj.analytics && <AnalyticsItems analytics={monthObj.analytics} />}
                     {monthObj.savingsAccHistory && (
                        <SavingsAccHistoryItems savingsAccHistory={monthObj.savingsAccHistory} />
                     )}
                  </CardListWrapper>
               ))}
            </>
         </PullToRefresh>
      </CarouselAndNavBarWrapper>
   );
}
