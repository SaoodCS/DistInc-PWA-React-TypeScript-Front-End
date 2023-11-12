import { useContext } from 'react';
import { Calculator } from 'styled-icons/fluentui-system-filled';
import {
   CardListItem,
   ItemRightColWrapper,
   ItemTitleAndIconWrapper,
   ItemTitleAndSubTitleWrapper,
} from '../../../../../../global/components/lib/cardList/Style';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import { PopupMenuContext } from '../../../../../../global/context/widget/popupMenu/PopupMenuContext';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import { DistributeContext } from '../../../context/DistributeContext';
import type NDist from '../../../namespace/NDist';
import AnalyticsPopupMenu from '../popupMenu/AnalyticsPopupMenu';

interface IAnalyticsItems {
   analytics: NDist.IAnalytics[];
}

export default function AnalyticsItems(props: IAnalyticsItems): JSX.Element {
   const { analytics } = props;
   const { handleItemClick } = useContext(DistributeContext);
   const {
      setPMContent,
      setPMHeightPx,
      setPMIsOpen,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);
   const { isDarkTheme } = useThemeContext();

   function handleMenuDotsClick(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      analyticsItem: NDist.IAnalytics,
   ): void {
      e.stopPropagation();
      setPMIsOpen(true);
      setPMContent(
         <AnalyticsPopupMenu analyticsItem={analyticsItem} handleItemClick={handleItemClick} />,
      );
      setClickEvent(e);
      setPMHeightPx(62);
      setPMWidthPx(120);
      setCloseOnInnerClick(true);
   }

   return (
      <>
         {analytics.map((analyticsObj) => (
            <CardListItem
               key={analyticsObj.timestamp}
               onClick={() => handleItemClick(analyticsObj, 'analytics')}
               isDarkTheme={isDarkTheme}
            >
               <ItemTitleAndIconWrapper>
                  <Calculator height={'2em'} style={{ paddingRight: '0.5em' }} />
                  <ItemTitleAndSubTitleWrapper>
                     <TextColourizer>Analytics</TextColourizer>
                  </ItemTitleAndSubTitleWrapper>
               </ItemTitleAndIconWrapper>
               <ItemRightColWrapper>
                  <HorizontalMenuDots
                     onClick={(e) => handleMenuDotsClick(e, analyticsObj)}
                     darktheme={isDarkTheme.toString()}
                  />
                  <TextColourizer fontSize="0.8em">
                     {DateHelper.fromDDMMYYYYToWord(analyticsObj.timestamp)}
                  </TextColourizer>
               </ItemRightColWrapper>
            </CardListItem>
         ))}
      </>
   );
}
