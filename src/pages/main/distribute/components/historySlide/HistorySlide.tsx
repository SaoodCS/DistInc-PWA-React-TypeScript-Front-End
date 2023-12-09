import { useContext, useEffect, useState } from 'react';
import {
   CardListTitle,
   CardListWrapper,
} from '../../../../../global/components/lib/cardList/Style';
import CardListPlaceholder from '../../../../../global/components/lib/cardList/placeholder/CardListPlaceholder';
import { CarouselAndNavBarWrapper } from '../../../../../global/components/lib/carousel/NavBar';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { FlatListWrapper } from '../../../../../global/components/lib/flatList/Style';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FilterIcon } from '../../../../../global/components/lib/icons/filter/FilterIcon';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import Loader from '../../../../../global/components/lib/loader/fullScreen/Loader';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { LargeScrnResponsiveFlexWrap } from '../../../../../global/components/lib/positionModifiers/responsiveFlexWrap/LargeScrnResponsiveFlexWrap';
import PullToRefresh from '../../../../../global/components/lib/pullToRefresh/PullToRefresh';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { PopupMenuContext } from '../../../../../global/context/widget/popupMenu/PopupMenuContext';
import { ToastContext } from '../../../../../global/context/widget/toast/ToastContext';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import DateHelper from '../../../../../global/helpers/dataTypes/date/DateHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import Device from '../../../../../global/helpers/pwa/deviceHelper';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useURLState from '../../../../../global/hooks/useURLState';
import NDist from '../../namespace/NDist';
import AnalyticsItems from '../d-analytics/cardListItem/AnalyticsItem';
import DistStepsItems from '../d-distSteps/cardListItem/DistStepsItems';
import SavingsAccHistoryItems from '../d-savingsHist/cardListItems/SavingsAccHistoryItem';
import FilterHistoryPopupMenu from '../filterHistoryPopupMenu/FilterHistoryPopupMenu';
import MonthPopupMenu from '../monthPopupMenu/MonthPopupMenu';

export default function HistorySlide(): JSX.Element {
   const [filterOutState] = useURLState({ key: NDist.Filterer.key });
   const [sortedData, setSortedData] = useState<NDist.ISchemaByMonth[]>();
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const {
      containerRef: scrollSaverRef,
      handleOnScroll,
      scrollSaverStyle,
   } = useScrollSaver(NDist.Carousel.key.historySlideScrollSaver);

   const {
      setPMContent,
      setPMHeightPx,
      togglePM,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   const {
      setHorizontalPos,
      setToastMessage,
      setToastZIndex,
      setVerticalPos,
      setWidth,
      toggleToast,
   } = useContext(ToastContext);

   const {
      data: calcDistData,
      isLoading,
      isPaused,
      error,
      refetch,
   } = NDist.API.useQuery.getCalcDist();

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty<NDist.ISchema>(calcDistData)) {
         const groupedByMonth = NDist.Data.groupByMonth(calcDistData);
         groupedByMonth.reverse();
         setSortedData(groupedByMonth);
      }
   }, [calcDistData]);

   function handleMenuDotsClick(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      monthYear: string,
   ): void {
      togglePM(true);
      setPMContent(<MonthPopupMenu monthYear={monthYear} />);
      setClickEvent(e);
      setPMHeightPx(30);
      setPMWidthPx(200);
      setCloseOnInnerClick(true);
   }

   function handleFilterClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>): void {
      togglePM(true);
      setPMContent(<FilterHistoryPopupMenu />);
      setClickEvent(e);
      setPMHeightPx(100);
      setPMWidthPx(200);
      setCloseOnInnerClick(false);
   }

   async function handleOnRefresh(): Promise<void> {
      if (!Device.isOnline()) {
         setToastMessage('No network connection.');
         setWidth('auto');
         setVerticalPos('bottom');
         setHorizontalPos('center');
         setToastZIndex(1);
         toggleToast(true);
         return;
      }
      await refetch();
   }

   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <CardListPlaceholder repeatItemCount={7} />;
   }
   if (isPaused) return <OfflineFetch />;
   if (error || !calcDistData) return <FetchError />;

   return (
      <CarouselAndNavBarWrapper style={{ width: '100%' }}>
         <FlexRowWrapper>
            <TextColourizer fontSize="2em" bold padding="0.5em">
               History
            </TextColourizer>
            <FilterIcon
               height="2em"
               darktheme={BoolHelper.boolToStr(isDarkTheme)}
               onClick={(e) => handleFilterClick(e)}
            />
         </FlexRowWrapper>

         <PullToRefresh isDarkTheme={isDarkTheme} onRefresh={() => handleOnRefresh()}>
            <FlatListWrapper
               ref={scrollSaverRef}
               style={{ ...scrollSaverStyle, height: '100%' }}
               onScroll={handleOnScroll}
            >
               {sortedData?.map((monthObj) => (
                  <CardListWrapper key={monthObj.monthYear}>
                     <CardListTitle>
                        <TextColourizer padding={'0 0.5em 0 0'}>
                           {DateHelper.fromMMYYYYToWord(monthObj.monthYear)}
                        </TextColourizer>
                        <HorizontalMenuDots
                           darktheme={BoolHelper.boolToStr(isDarkTheme)}
                           onClick={(e) => handleMenuDotsClick(e, monthObj.monthYear)}
                        />
                     </CardListTitle>
                     <LargeScrnResponsiveFlexWrap childrenMargin="1em">
                        <ConditionalRender condition={!filterOutState.includes('distSteps')}>
                           {monthObj.distSteps && <DistStepsItems distSteps={monthObj.distSteps} />}
                        </ConditionalRender>
                        <ConditionalRender condition={!filterOutState.includes('analytics')}>
                           {monthObj.analytics && <AnalyticsItems analytics={monthObj.analytics} />}
                        </ConditionalRender>
                        <ConditionalRender
                           condition={!filterOutState.includes('savingsAccHistory')}
                        >
                           {monthObj.savingsAccHistory && (
                              <SavingsAccHistoryItems
                                 savingsAccHistory={monthObj.savingsAccHistory}
                              />
                           )}
                        </ConditionalRender>
                     </LargeScrnResponsiveFlexWrap>
                  </CardListWrapper>
               ))}
            </FlatListWrapper>
         </PullToRefresh>
      </CarouselAndNavBarWrapper>
   );
}
