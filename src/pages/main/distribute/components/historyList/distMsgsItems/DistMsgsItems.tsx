import { useContext } from 'react';
import { DocumentFlowchart } from 'styled-icons/fluentui-system-filled';
import { AutoDelete } from 'styled-icons/material';
import { DocumentDelete } from 'styled-icons/typicons';
import {
   CardListItem,
   ItemRightColWrapper,
   ItemTitleAndIconWrapper,
   ItemTitleAndSubTitleWrapper,
} from '../../../../../../global/components/lib/cardList/Style';
import {
   CMItemContainer,
   CMItemTitle,
   CMItemsListWrapper,
} from '../../../../../../global/components/lib/contextMenu/Style';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import { ThemeContext } from '../../../../../../global/context/theme/ThemeContext';
import { PopupMenuContext } from '../../../../../../global/context/widget/popupMenu/PopupMenuContext';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import { ICalcSchema } from '../../calculation/CalculateDist';

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
   const { isDarkTheme } = useContext(ThemeContext);

   function handleItemClick() {}

   function handleMenuDotsClick(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      distMsgsItem: ICalcSchema['distributer'][0],
   ) {
      const month = DateHelper.getMonthName(distMsgsItem.timestamp);
      setPMIsOpen(true);
      setPMContent(
         <CMItemsListWrapper isDarkTheme={isDarkTheme}>
            <CMItemContainer onClick={() => {}} isDarkTheme={isDarkTheme} dangerItem>
               <CMItemTitle>Delete This</CMItemTitle>
               <DocumentDelete />
            </CMItemContainer>

            <CMItemContainer onClick={() => {}} isDarkTheme={isDarkTheme} dangerItem>
               <CMItemTitle>{`Delete All History for ${month}`}</CMItemTitle>
               <AutoDelete />
            </CMItemContainer>
         </CMItemsListWrapper>,
      );
      setClickEvent(e);
      setPMHeightPx(65);
      setPMWidthPx(200);
      setCloseOnInnerClick(true);
   }

   return (
      <>
         {distributer.map((distMsgsObj) => (
            <CardListItem key={distMsgsObj.timestamp} onClick={() => handleItemClick()}>
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
