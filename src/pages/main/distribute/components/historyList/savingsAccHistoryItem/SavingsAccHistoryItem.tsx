import { StopCircle } from '@styled-icons/ionicons-outline/StopCircle';
import { AutoDelete } from '@styled-icons/material-outlined/AutoDelete';
import { RepoDeleted } from '@styled-icons/octicons/RepoDeleted';
import { DocumentDelete } from '@styled-icons/typicons/DocumentDelete';
import { useContext } from 'react';
import { Savings } from 'styled-icons/fluentui-system-filled';
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
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import SavingsClass from '../../../../details/components/accounts/savings/class/Class';
import { ICalcSchema } from '../../calculation/CalculateDist';

interface ISavingsAccHistoryItems {
   savingsAccHistory: ICalcSchema['savingsAccHistory'];
}

export default function SavingsAccHistoryItems(props: ISavingsAccHistoryItems): JSX.Element {
   const { savingsAccHistory } = props;
   const { isDarkTheme } = useContext(ThemeContext);
   const { data } = SavingsClass.useQuery.getSavingsAccounts();
   const {
      setPMContent,
      setPMHeightPx,
      setPMIsOpen,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   function getSavingsAccName(savingsAccId: number): string {
      if (!data) return '';
      const savingsAccObj = ObjectOfObjects.findObjFromUniqueVal(data, savingsAccId);
      return savingsAccObj?.accountName || '';
   }

   function handleMenuDotsClick(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      savingsHistItem: ICalcSchema['savingsAccHistory'][0],
   ) {
      const savingsAccName = getSavingsAccName(savingsHistItem.id);
      const month = DateHelper.getMonthName(savingsHistItem.timestamp);
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

            <CMItemContainer onClick={() => {}} isDarkTheme={isDarkTheme} dangerItem>
               <CMItemTitle>{`Delete All History For ${savingsAccName} `}</CMItemTitle>
               <RepoDeleted />
            </CMItemContainer>

            <CMItemContainer onClick={() => {}} isDarkTheme={isDarkTheme} warningItem>
               <CMItemTitle>Stop Tracking</CMItemTitle>
               <StopCircle />
            </CMItemContainer>
         </CMItemsListWrapper>,
      );
      setClickEvent(e);
      setPMHeightPx(145);
      setPMWidthPx(200);
      setCloseOnInnerClick(true);
   }

   function handleItemClick() {}

   return (
      <>
         {savingsAccHistory.map((savingsHistObj) => (
            <CardListItem key={savingsHistObj.timestamp} onClick={() => handleItemClick()}>
               <ItemTitleAndIconWrapper style={{ position: 'relative' }}>
                  <Savings height={'2em'} style={{ paddingRight: '0.5em' }} />
                  <ItemTitleAndSubTitleWrapper>
                     <TextColourizer>{getSavingsAccName(savingsHistObj.id)}</TextColourizer>
                     <TextColourizer fontSize="0.8em">
                        {`Balance Was: ${NumberHelper.asCurrencyStr(savingsHistObj.balance)}`}
                     </TextColourizer>
                  </ItemTitleAndSubTitleWrapper>
               </ItemTitleAndIconWrapper>
               <ItemRightColWrapper>
                  <HorizontalMenuDots onClick={(e) => handleMenuDotsClick(e, savingsHistObj)} />
                  <TextColourizer fontSize="0.8em">
                     {DateHelper.fromDDMMYYYYToWord(savingsHistObj.timestamp)}
                  </TextColourizer>
               </ItemRightColWrapper>
            </CardListItem>
         ))}
      </>
   );
}
