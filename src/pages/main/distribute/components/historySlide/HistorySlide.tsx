import { Filter } from '@styled-icons/fluentui-system-filled/Filter';
import { useContext } from 'react';
import styled from 'styled-components';
import {
   CardListTitle,
   CardListWrapper,
} from '../../../../../global/components/lib/cardList/Style';
import { CarouselAndNavBarWrapper } from '../../../../../global/components/lib/carousel/NavBar';
import { FlatListWrapper } from '../../../../../global/components/lib/flatList/Style';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import PullToRefresh from '../../../../../global/components/lib/pullToRefresh/PullToRefresh';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { ModalContext } from '../../../../../global/context/widget/modal/ModalContext';
import { PopupMenuContext } from '../../../../../global/context/widget/popupMenu/PopupMenuContext';
import Color from '../../../../../global/css/colors';
import DateHelper from '../../../../../global/helpers/dataTypes/date/DateHelper';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import NDist from '../../namespace/NDist';
import AnalyticsItems from '../d-analytics/cardListItem/AnalyticsItem';
import DistMsgsItems from '../d-distMsgs/cardListItem/DistMsgsItems';
import SavingsAccHistoryItems from '../d-savingsHist/cardListItems/SavingsAccHistoryItem';
import MonthPopupMenu from '../monthPopupMenu/MonthPopupMenu';

export default function HistorySlide() {
   const { isDarkTheme } = useThemeContext();
   const {
      containerRef: scrollSaverRef,
      handleOnScroll,
      scrollSaverStyle,
   } = useScrollSaver(NDist.Carousel.key.historySlideScrollSaver);

   const { setIsModalOpen } = useContext(ModalContext);
   const {
      setPMContent,
      setPMHeightPx,
      setPMIsOpen,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   const { data: calcDistData, refetch } = NDist.API.useQuery.getCalcDist({
      onSuccess: () => {
         setIsModalOpen(false);
      },
   });

   async function handleOnRefresh(): Promise<void> {
      await refetch();
   }

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

   return (
      <CarouselAndNavBarWrapper style={{ width: '100%' }}>
         <FlexRowWrapper>
            <TextColourizer fontSize="2em" bold padding="0.5em">
               History
            </TextColourizer>
            <Filter
               height="2em"
               color={isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent}
            />
         </FlexRowWrapper>

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
                     {monthObj.distributer && <DistMsgsItems distributer={monthObj.distributer} />}
                     {monthObj.analytics && <AnalyticsItems analytics={monthObj.analytics} />}
                     {monthObj.savingsAccHistory && (
                        <SavingsAccHistoryItems savingsAccHistory={monthObj.savingsAccHistory} />
                     )}
                  </CardListWrapper>
               ))}
            </FlatListWrapper>
         </PullToRefresh>
      </CarouselAndNavBarWrapper>
   );
}
