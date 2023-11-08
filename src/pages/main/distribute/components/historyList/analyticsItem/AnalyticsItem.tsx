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
import { PopupMenuContext } from '../../../../../../global/context/widget/popupMenu/PopupMenuContext';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import type { ICalcSchema } from '../../calculation/CalculateDist';
import AnalyticsPopupMenu from '../../popupMenu/AnalyticsPopupMenu';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';

interface IAnalyticsItems {
   analytics: ICalcSchema['analytics'];
}

export default function AnalyticsItems(props: IAnalyticsItems): JSX.Element {
   const { analytics } = props;
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
      analyticsItem: ICalcSchema['analytics'][0],
   ): void {
      setPMIsOpen(true);
      setPMContent(<AnalyticsPopupMenu analyticsItem={analyticsItem} type={'analyticsItem'} />);
      setClickEvent(e);
      setPMHeightPx(30);
      setPMWidthPx(120);
      setCloseOnInnerClick(true);
   }

   function handleItemClick(): void {
      //TODO: display savings account history item details in a modal here
   }

   return (
      <>
         {analytics.map((analyticsObj) => (
            <CardListItem key={analyticsObj.timestamp} onClick={() => handleItemClick()}>
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
