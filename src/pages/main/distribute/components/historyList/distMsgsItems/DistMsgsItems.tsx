import { useContext } from 'react';
import { DocumentFlowchart } from 'styled-icons/fluentui-system-filled';
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
import type { ICalcSchema } from '../../calculation/CalculateDist';
import DistMsgsPopupMenu from '../../popupMenu/DistMsgsPopupMenu';

interface IDistributeMsgsItems {
   distributer: ICalcSchema['distributer'];
}

export default function DistMsgsItems(props: IDistributeMsgsItems): JSX.Element {
   const { distributer } = props;
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
      distMsgsItem: ICalcSchema['distributer'][0],
   ): void {
      e.stopPropagation();
      setPMIsOpen(true);
      setPMContent(<DistMsgsPopupMenu distributerItem={distMsgsItem} />);
      setClickEvent(e);
      setPMHeightPx(62);
      setPMWidthPx(120);
      setCloseOnInnerClick(true);
   }

   return (
      <>
         {distributer.map((distMsgsObj) => (
            <CardListItem key={distMsgsObj.timestamp}>
               <ItemTitleAndIconWrapper>
                  <DocumentFlowchart height={'2em'} style={{ paddingRight: '0.5em' }} />
                  <ItemTitleAndSubTitleWrapper>
                     <TextColourizer>Distribution Instructions</TextColourizer>
                  </ItemTitleAndSubTitleWrapper>
               </ItemTitleAndIconWrapper>
               <ItemRightColWrapper>
                  <HorizontalMenuDots
                     onClick={(e) => handleMenuDotsClick(e, distMsgsObj)}
                     darktheme={isDarkTheme.toString()}
                  />
                  <TextColourizer fontSize="0.8em">
                     {DateHelper.fromDDMMYYYYToWord(distMsgsObj.timestamp)}
                  </TextColourizer>
               </ItemRightColWrapper>
            </CardListItem>
         ))}
      </>
   );
}
