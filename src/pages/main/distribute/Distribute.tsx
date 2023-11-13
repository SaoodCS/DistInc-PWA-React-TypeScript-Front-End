import { QuestionOctagonFill as QMark } from '@styled-icons/bootstrap/QuestionOctagonFill';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { useContext, useEffect, useState } from 'react';
import CardListPlaceholder from '../../../global/components/lib/cardList/placeholder/CardListPlaceholder';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Carousel';
import FetchError from '../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import Loader from '../../../global/components/lib/loader/Loader';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../global/context/widget/bottomPanel/BottomPanelContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import IncomeClass from '../details/components/Income/class/Class';
import CurrentClass from '../details/components/accounts/current/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
import HelpRequirements from './components/calcPreReqList/HelpRequirements';
import AnalyticsDetailsSlide from './components/d-analytics/detailsSlide/AnalyticsDetailsSlide';
import DistMsgsDetailsSlide from './components/d-distMsgs/detailsSlide/DistMsgsDetailsSlide';
import SavingsAccHistDetailsSlide from './components/d-savingsHist/detailsSlide/SavingsAccHistDetailsSlide';
import DistributeForm from './components/form/DistributerForm';
import HistorySlide from './components/historySlide/HistorySlide';
import { DistributeContext } from './context/DistributeContext';
import DistributeContextProvider from './context/DistributeContextProvider';
import NDist from './namespace/NDist';

export default function Distribute(): JSX.Element {
   return (
      <DistributeContextProvider>
         <DistributePageTemplate />
      </DistributeContextProvider>
   );
}

function DistributePageTemplate(): JSX.Element {
   // -- CONTEXTS + STATES -- //
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   HeaderHooks.useOnUnMount.hideAndResetBackBtn();
   const { isPortableDevice } = useThemeContext();
   const { setHeaderRightElement } = useHeaderContext();
   const { setIsModalOpen, setModalContent, setModalZIndex, setModalHeader, isModalOpen } =
      useContext(ModalContext);
   const {
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
      setIsBottomPanelOpen,
   } = useContext(BottomPanelContext);
   const { carouselContainerRef, scrollToSlide, slideName, setSlideName, handleItemClick } =
      useContext(DistributeContext);
   const [prevScrollPos, setPrevScrollPos] = useState<number>(0);

   // -- REACT-QUERY DATA -- //
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const {
      data: calcDistData,
      isLoading,
      isPaused,
      error,
   } = NDist.API.useQuery.getCalcDist({
      onSuccess: () => {
         if (isModalOpen) {
            setIsModalOpen(false);
            const firstDistObj = calcDistData?.distributer[0];
            if (firstDistObj) handleItemClick(firstDistObj, 'distributer');
            scrollToSlide(2);
         }
      },
   });

   useEffect(() => {
      const reqCheck = NDist.Calc.checkPreReqsMet(
         currentAccounts || {},
         income || {},
         expenses || {},
      );
      const isAllReqValid = ArrayOfObjects.doAllObjectsHaveKeyValuePair(reqCheck, 'isValid', true);
      function handleModal(): void {
         if (!isPortableDevice) {
            setModalHeader(isAllReqValid ? 'Distribute' : 'Requirements');
            setModalContent(isAllReqValid ? <DistributeForm /> : <HelpRequirements />);
            setModalZIndex(100);
            setIsModalOpen(true);
            return;
         }
         setBottomPanelHeading(isAllReqValid ? 'Distribute' : 'Requirements');
         setBottomPanelContent(isAllReqValid ? <DistributeForm /> : <HelpRequirements />);
         setBottomPanelZIndex(100);
         setIsBottomPanelOpen(true);
      }
      setHeaderRightElement(
         isAllReqValid ? <Add onClick={handleModal} /> : <QMark onClick={handleModal} />,
      );
   }, [currentAccounts, income, expenses, isPortableDevice]);

   function handleScroll(): void {
      const currentLeftScroll = carouselContainerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevScrollPos && currentLeftScroll === 0) setSlideName('history');
      setPrevScrollPos(currentLeftScroll!);
   }

   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <CardListPlaceholder repeatItemCount={7} />;
   }
   if (isPaused) return <OfflineFetch />;
   if (error || !calcDistData) return <FetchError />;

   return (
      <CarouselContainer
         ref={carouselContainerRef}
         onScroll={handleScroll}
         style={{ height: '100%' }}
      >
         <CarouselSlide height={'100%'}>
            <HistorySlide />
         </CarouselSlide>
         <CarouselSlide height={'100%'}>
            <ConditionalRender condition={'analytics' === slideName}>
               <AnalyticsDetailsSlide />
            </ConditionalRender>
            <ConditionalRender condition={'distributer' === slideName}>
               <DistMsgsDetailsSlide />
            </ConditionalRender>
            <ConditionalRender condition={'savingsAccHistory' === slideName}>
               <SavingsAccHistDetailsSlide />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
