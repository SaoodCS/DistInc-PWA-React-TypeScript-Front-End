import { QuestionMark as QMark } from '@styled-icons/boxicons-regular/QuestionMark';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { useContext, useEffect, useState } from 'react';
import { CardListTitle, CardListWrapper } from '../../../global/components/lib/cardList/Style';
import CardListPlaceholder from '../../../global/components/lib/cardList/placeholder/CardListPlaceholder';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Carousel';
import { CarouselAndNavBarWrapper } from '../../../global/components/lib/carousel/NavBar';
import useCarousel from '../../../global/components/lib/carousel/hooks/useCarousel';
import FetchError from '../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { FlatListWrapper } from '../../../global/components/lib/flatList/Style';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../global/components/lib/icons/menu/HorizontalMenuDots';
import Loader from '../../../global/components/lib/loader/Loader';
import PullToRefresh from '../../../global/components/lib/pullToRefresh/PullToRefresh';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import { PopupMenuContext } from '../../../global/context/widget/popupMenu/PopupMenuContext';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../global/helpers/dataTypes/date/DateHelper';
import useScrollSaver from '../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../global/hooks/useSessionStorage';
import IncomeClass from '../details/components/Income/class/Class';
import CurrentClass from '../details/components/accounts/current/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
import HelpRequirements from './components/calcPreReqList/HelpRequirements';
import AnalyticsItems from './components/d-analytics/cardListItem/AnalyticsItem';
import AnalyticsDetails from './components/d-analytics/detailsSlide/AnalyticsDetails';
import DistMsgsItems from './components/d-distMsgs/cardListItem/DistMsgsItems';
import DistMsgsDetails from './components/d-distMsgs/detailsSlide/DistMsgsDetails';
import SavingsAccHistoryItems from './components/d-savingsHist/cardListItems/SavingsAccHistoryItem';
import SavingsAccHistDetails from './components/d-savingsHist/detailsSlide/SavingsAccHistDetails';
import DistributeForm from './components/form/DistributerForm';
import MonthPopupMenu from './components/monthPopupMenu/MonthPopupMenu';
import NDist from './namespace/NDist';

export default function Distribute(): JSX.Element {
   // -- CONTEXTS -- //
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   HeaderHooks.useOnUnMount.hideAndResetBackBtn();
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { setHeaderRightElement, setHandleBackBtnClick, hideAndResetBackBtn, setHeaderTitle } =
      useHeaderContext();
   const {
      setPMContent,
      setPMHeightPx,
      setPMIsOpen,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);
   const { setIsModalOpen, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);

   // -- REACT-QUERY DATA -- //
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const {
      data: calcDistData,
      isLoading,
      isPaused,
      error,
      refetch,
   } = NDist.API.useQuery.getCalcDist({
      onSuccess: () => {
         setIsModalOpen(false);
      },
   });

   // -- STATE -- //
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(
      1,
      NDist.Carousel.key.currentSlideNo,
   );
   const [slideName, setSlideName] = useSessionStorage<
      NDist.Carousel.ISlide2NameOptions | NDist.Carousel.ISlide1Name
   >(NDist.Carousel.key.currentSlideName, 'history');
   const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
   const [detailsSlideData, setDetailsSlideData] = useState<
      NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist | undefined
   >(undefined);

   const {
      containerRef: scrollSaverRef,
      handleOnScroll,
      scrollSaverStyle,
   } = useScrollSaver(NDist.Carousel.key.historySlideScrollSaver);

   // -- USEEFFECTS -- //
   useEffect(() => {
      if (currentSlide === 1) {
         hideAndResetBackBtn();
         setHeaderTitle('Distribution History');
      } else {
         setHandleBackBtnClick(() => scrollToSlide(1));
         setHeaderTitle('Details');
      }
   }, [currentSlide]);

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
   function sortData(): NDist.ISchemaByMonth[] | undefined {
      if (!calcDistData) return;
      const groupedByMonth = NDist.Data.groupByMonth(calcDistData);
      groupedByMonth.reverse();
      return groupedByMonth;
   }

   function handleMenuDotsClick(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      monthYear: string,
   ): void {
      setPMIsOpen(true);
      setPMContent(<MonthPopupMenu monthYear={monthYear} />);
      setClickEvent(e);
      setPMHeightPx(30);
      setPMWidthPx(200);
      setCloseOnInnerClick(true);
   }

   async function handleOnRefresh(): Promise<void> {
      await refetch();
   }

   function handleScroll(): void {
      const currentLeftScroll = containerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevScrollPos && currentLeftScroll === 0) setSlideName('history');
      setPrevScrollPos(currentLeftScroll!);
   }

   function handleItemClick(
      item: NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist,
      itemType: NDist.Carousel.ISlide2NameOptions,
   ): void {
      setSlideName(itemType);
      scrollToSlide(2);
      setDetailsSlideData(item);
   }

   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <CardListPlaceholder repeatItemCount={7} />;
   }
   if (isPaused) return <OfflineFetch />;
   if (error || !calcDistData) return <FetchError />;

   return (
      <CarouselContainer ref={containerRef} onScroll={handleScroll} style={{ height: '100%' }}>
         <CarouselSlide height={'100%'}>
            <CarouselAndNavBarWrapper style={{ width: '100%' }}>
               <TextColourizer fontSize="2em" bold padding="0.5em">
                  History
               </TextColourizer>
               <PullToRefresh isDarkTheme={isDarkTheme} onRefresh={() => handleOnRefresh()}>
                  <FlatListWrapper
                     ref={scrollSaverRef}
                     style={{ ...scrollSaverStyle, height: '100%' }}
                     onScroll={handleOnScroll}
                  >
                     {sortData()?.map((monthObj) => (
                        <CardListWrapper key={monthObj.monthYear}>
                           <CardListTitle>
                              <TextColourizer padding={'0 0.5em 0 0'}>
                                 {DateHelper.fromMMYYYYToWord(monthObj.monthYear)}
                              </TextColourizer>
                              <HorizontalMenuDots
                                 darktheme={isDarkTheme.toString()}
                                 onClick={(e) => handleMenuDotsClick(e, monthObj.monthYear)}
                              />
                           </CardListTitle>
                           {monthObj.distributer && (
                              <DistMsgsItems
                                 distributer={monthObj.distributer}
                                 handleItemClick={handleItemClick}
                              />
                           )}
                           {monthObj.analytics && (
                              <AnalyticsItems
                                 analytics={monthObj.analytics}
                                 handleItemClick={handleItemClick}
                              />
                           )}
                           {monthObj.savingsAccHistory && (
                              <SavingsAccHistoryItems
                                 savingsAccHistory={monthObj.savingsAccHistory}
                                 handleItemClick={handleItemClick}
                              />
                           )}
                        </CardListWrapper>
                     ))}
                  </FlatListWrapper>
               </PullToRefresh>
            </CarouselAndNavBarWrapper>
         </CarouselSlide>
         <CarouselSlide height={'100%'}>
            <ConditionalRender condition={'analytics' === slideName}>
               <AnalyticsDetails analyticsItem={detailsSlideData as NDist.IAnalytics} />
            </ConditionalRender>
            <ConditionalRender condition={'distributer' === slideName}>
               <DistMsgsDetails distMsgsItem={detailsSlideData as NDist.IDistMsgs} />
            </ConditionalRender>
            <ConditionalRender condition={'savingsAccHistory' === slideName}>
               <SavingsAccHistDetails
                  savingsAccHistItem={detailsSlideData as NDist.ISavingsAccHist}
               />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
