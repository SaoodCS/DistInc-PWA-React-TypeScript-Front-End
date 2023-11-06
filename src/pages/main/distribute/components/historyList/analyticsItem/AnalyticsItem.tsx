import { useContext } from 'react';
import { Calculator } from 'styled-icons/fluentui-system-filled';
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

interface IAnalyticsItems {
   analytics: ICalcSchema['analytics'];
}

export default function AnalyticsItems(props: IAnalyticsItems): JSX.Element {
   const { analytics } = props;
   const { setPMContent, setPMHeightPx, setPMIsOpen, setPMWidthPx, setClickEvent } =
      useContext(PopupMenuContext);
   const { isDarkTheme } = useContext(ThemeContext);

   function handleItemClick() {}

   function handleMenuDotsClick(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      analyticsItem: ICalcSchema['analytics'][0],
   ) {
      const month = DateHelper.getMonthName(analyticsItem.timestamp);
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
                  <HorizontalMenuDots onClick={(e) => handleMenuDotsClick(e, analyticsObj)} />
                  <TextColourizer fontSize="0.8em">
                     {DateHelper.fromDDMMYYYYToWord(analyticsObj.timestamp)}
                  </TextColourizer>
               </ItemRightColWrapper>
            </CardListItem>
         ))}
      </>
   );
}
