import { useContext } from 'react';
import { Calculator } from 'styled-icons/fluentui-system-filled';
import { DocumentDelete } from 'styled-icons/typicons';
import {
   CardListItem,
   ItemRightColWrapper,
   ItemTitleAndIconWrapper,
   ItemTitleAndSubTitleWrapper,
} from '../../../../../../global/components/lib/cardList/Style';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import { PMItemContainer, PMItemTitle, PMItemsListWrapper } from '../../../../../../global/components/lib/popupMenu/Style';
import { ThemeContext } from '../../../../../../global/context/theme/ThemeContext';
import { PopupMenuContext } from '../../../../../../global/context/widget/popupMenu/PopupMenuContext';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import { ICalcSchema } from '../../calculation/CalculateDist';

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
   const { isDarkTheme } = useContext(ThemeContext);

   function handleItemClick() {}

   function handleMenuDotsClick(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      analyticsItem: ICalcSchema['analytics'][0],
   ) {
      setPMIsOpen(true);
      setPMContent(
         <PMItemsListWrapper isDarkTheme={isDarkTheme}>
            <PMItemContainer
               onClick={() => {
                  // TODO: API POST Mutation to delete analytics history associated with the analyticsItem date called here
               }}
               isDarkTheme={isDarkTheme}
               dangerItem
            >
               <PMItemTitle>Delete This</PMItemTitle>
               <DocumentDelete />
            </PMItemContainer>
         </PMItemsListWrapper>,
      );
      setClickEvent(e);
      setPMHeightPx(30);
      setPMWidthPx(120);
      setCloseOnInnerClick(true);
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
