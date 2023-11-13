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
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import { DistributeContext } from '../../../context/DistributeContext';
import type NDist from '../../../namespace/NDist';
import DistMsgsPopupMenu from '../popupMenu/DistMsgsPopupMenu';

interface IDistributeMsgsItems {
   distributer: NDist.IDistMsgs[];
}

export default function DistMsgsItems(props: IDistributeMsgsItems): JSX.Element {
   const { distributer } = props;
   const { handleItemClick } = useContext(DistributeContext);
   const {
      setPMContent,
      setPMHeightPx,
      togglePM,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);
   const { isDarkTheme, isPortableDevice } = useThemeContext();

   function handleMenuDotsClick(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      distMsgsItem: NDist.IDistMsgs,
   ): void {
      e.stopPropagation();
      togglePM();
      setPMContent(
         <DistMsgsPopupMenu distributerItem={distMsgsItem} handleItemClick={handleItemClick} />,
      );
      setClickEvent(e);
      setPMHeightPx(62);
      setPMWidthPx(120);
      setCloseOnInnerClick(true);
   }

   return (
      <>
         {distributer.map((distMsgsObj) => (
            <CardListItem
               key={distMsgsObj.timestamp}
               onClick={() => handleItemClick(distMsgsObj, 'distributer')}
               isDarkTheme={isDarkTheme}
               width={!isPortableDevice ? '20em' : undefined}
            >
               <ItemTitleAndIconWrapper>
                  <DocumentFlowchart height={'2em'} style={{ paddingRight: '0.5em' }} />
                  <ItemTitleAndSubTitleWrapper>
                     <TextColourizer>Distribution Instructions</TextColourizer>
                  </ItemTitleAndSubTitleWrapper>
               </ItemTitleAndIconWrapper>
               <ItemRightColWrapper>
                  <HorizontalMenuDots
                     onClick={(e) => handleMenuDotsClick(e, distMsgsObj)}
                     darktheme={BoolHelper.boolToStr(isDarkTheme)}
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
