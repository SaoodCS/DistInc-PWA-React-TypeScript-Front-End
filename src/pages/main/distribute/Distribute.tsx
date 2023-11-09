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
import useSessionStorage from '../../../global/hooks/useSessionStorage';
import IncomeClass from '../details/components/Income/class/Class';
import CurrentClass from '../details/components/accounts/current/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
import { ICalcSchema } from './components/calculation/CalculateDist';
import DistributeForm from './components/distributerForm/DistributerForm';
import type {
   IAnalyticsObj,
   ICalcSchemaGroupByMonth,
   ICarouselSlides,
   IDistMsgsObj,
   ISavingsAccHistoryObj,
} from './components/distributerForm/class/DistributerClass';
import DistributerClass from './components/distributerForm/class/DistributerClass';
import AnalyticsItems from './components/historyList/analyticsItem/AnalyticsItem';
import DistMsgsItems from './components/historyList/distMsgsItems/DistMsgsItems';
import SavingsAccHistoryItems from './components/historyList/savingsAccHistoryItem/SavingsAccHistoryItem';
import MonthPopupMenu from './components/popupMenu/MonthPopupMenu';
import HelpRequirements from './components/requirementsModal/HelpRequirements';
import AnalyticsDetails from './components/slideTwo/AnalyticsDetails';
import DistMsgsDetails from './components/slideTwo/DistMsgsDetails';
import SavingsAccHistDetails from './components/slideTwo/SavingsAccHistDetails';

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
   } = DistributerClass.useQuery.getCalcDist({
      onSuccess: () => {
         setIsModalOpen(false);
      },
   });
   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <CardListPlaceholder repeatItemCount={7} />;
   }
   if (isPaused) return <OfflineFetch />;
   if (error || !calcDistData) return <FetchError />;

   // -- STATE -- //
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(
      1,
      DistributerClass.key.currentSlide,
   );
   const [slide2, setSlide2] = useSessionStorage<ICarouselSlides | ''>(
      DistributerClass.key.slide2,
      '',
   );
   const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
   const [detailsSlideData, setDetailsSlideData] = useState<
      IAnalyticsObj | IDistMsgsObj | ISavingsAccHistoryObj | undefined
   >(undefined);

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
      const reqCheck = DistributerClass.checkCalcReq(
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
   function sortData(): ICalcSchemaGroupByMonth[] | undefined {
      if (!calcDistData) return;
      const groupedByMonth = DistributerClass.groupByMonth(calcDistData);
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
      if (currentLeftScroll! < prevScrollPos && currentLeftScroll === 0) setSlide2('');
      setPrevScrollPos(currentLeftScroll!);
   }

   function isSlide2(slideName: ICarouselSlides): boolean {
      return slide2 === slideName;
   }

   function handleItemClick(
      item: IAnalyticsObj | IDistMsgsObj | ISavingsAccHistoryObj,
      itemType: ICarouselSlides,
   ): void {
      setSlide2(itemType);
      scrollToSlide(2);
      setDetailsSlideData(item);
   }

   return (
      <CarouselContainer ref={containerRef} onScroll={handleScroll} style={{ height: '100%' }}>
         <CarouselSlide height={'100%'}>
            <CarouselAndNavBarWrapper style={{ width: '100%' }}>
               <TextColourizer fontSize="2em" bold padding="0.5em">
                  History
               </TextColourizer>
               <PullToRefresh isDarkTheme={isDarkTheme} onRefresh={() => handleOnRefresh()}>
                  <>
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
                  </>
               </PullToRefresh>
            </CarouselAndNavBarWrapper>
         </CarouselSlide>
         <CarouselSlide height={'100%'}>
            <ConditionalRender condition={isSlide2('analytics')}>
               <AnalyticsDetails analyticsItem={detailsSlideData as ICalcSchema['analytics'][0]} />
            </ConditionalRender>
            <ConditionalRender condition={isSlide2('distribute')}>
               <DistMsgsDetails distMsgsItem={detailsSlideData as ICalcSchema['distributer'][0]} />
            </ConditionalRender>
            <ConditionalRender condition={isSlide2('savingsAccHistory')}>
               <SavingsAccHistDetails
                  savingsAccHistItem={detailsSlideData as ICalcSchema['savingsAccHistory'][0]}
               />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
