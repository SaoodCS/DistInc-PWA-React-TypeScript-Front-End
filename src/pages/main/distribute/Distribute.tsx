import { QuestionMark as QMark } from '@styled-icons/boxicons-regular/QuestionMark';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { useContext, useEffect, useState } from 'react';
import CardListPlaceholder from '../../../global/components/lib/cardList/placeholder/CardListPlaceholder';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Carousel';
import FetchError from '../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import Loader from '../../../global/components/lib/loader/Loader';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import IncomeClass from '../details/components/Income/class/Class';
import CurrentClass from '../details/components/accounts/current/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
import HelpRequirements from './components/calcPreReqList/HelpRequirements';
import AnalyticsDetails from './components/d-analytics/detailsSlide/AnalyticsDetails';
import DistMsgsDetails from './components/d-distMsgs/detailsSlide/DistMsgsDetails';
import SavingsAccHistDetails from './components/d-savingsHist/detailsSlide/SavingsAccHistDetails';
import DistributeForm from './components/form/DistributerForm';
import HistorySlide from './components/historySlide/HistorySlide';
import { DistributeContext } from './context/DistributeContext';
import NDist from './namespace/NDist';

export default function Distribute(): JSX.Element {
   // -- CONTEXTS + STATES -- //
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   HeaderHooks.useOnUnMount.hideAndResetBackBtn();
   const { isPortableDevice } = useThemeContext();
   const { setHeaderRightElement, setHandleBackBtnClick, hideAndResetBackBtn, setHeaderTitle } =
      useHeaderContext();
   const { setIsModalOpen, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);
   const {
      carouselContainerRef,
      scrollToSlide,
      currentSlide,
      slideName,
      setSlideName,
      handleItemClick,
   } = useContext(DistributeContext);
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
         setIsModalOpen(false);
         const firstDistObj = calcDistData?.distributer[0];
         if (firstDistObj) handleItemClick(firstDistObj, 'distributer');
         scrollToSlide(2);
      },
   });

   useEffect(() => {
      const slideTitle = ArrayOfObjects.getObjWithKeyValuePair(
         NDist.Carousel.slides,
         'name',
         slideName,
      ).title;
      setHeaderTitle(slideTitle);
      if (currentSlide === 1) {
         hideAndResetBackBtn();
      } else {
         setHandleBackBtnClick(() => scrollToSlide(1));
      }
   }, [currentSlide, slideName]);

   useEffect(() => {
      const reqCheck = NDist.Calc.checkPreReqsMet(
         currentAccounts || {},
         income || {},
         expenses || {},
      );
      const isAllReqValid = ArrayOfObjects.doAllObjectsHaveKeyValuePair(reqCheck, 'isValid', true);
      function handleModal(): void {
         setModalHeader(isAllReqValid ? 'Distribute' : 'Requirements');
         setModalContent(isAllReqValid ? <DistributeForm /> : <HelpRequirements />);
         setModalZIndex(100);
         setIsModalOpen(true);
      }
      setHeaderRightElement(
         isAllReqValid ? <Add onClick={handleModal} /> : <QMark onClick={handleModal} />,
      );
   }, [currentAccounts, income, expenses]);

   // -- FUNCTIONS -- //
   function handleScroll(): void {
      const currentLeftScroll = carouselContainerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevScrollPos && currentLeftScroll === 0) setSlideName('history');
      setPrevScrollPos(currentLeftScroll!);
   }

   // -- RENDER -- //
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
         <CarouselSlide height={'100%'} style={{}}>
            <HistorySlide />
         </CarouselSlide>
         <CarouselSlide height={'100%'}>
            <ConditionalRender condition={'analytics' === slideName}>
               <AnalyticsDetails />
            </ConditionalRender>
            <ConditionalRender condition={'distributer' === slideName}>
               <DistMsgsDetails />
            </ConditionalRender>
            <ConditionalRender condition={'savingsAccHistory' === slideName}>
               <SavingsAccHistDetails />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
