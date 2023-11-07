import { StopCircle } from '@styled-icons/ionicons-outline/StopCircle';
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
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../../global/components/lib/popupMenu/Style';
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
      setPMIsOpen(true);
      setPMContent(
         <PMItemsListWrapper isDarkTheme={isDarkTheme}>
            <PMItemContainer
               onClick={() => {
                  // TODO: API POST Mutation to delete history savingsAccHistory associated with savingsHistItem's date called here
               }}
               isDarkTheme={isDarkTheme}
               dangerItem
            >
               <PMItemTitle>Delete This</PMItemTitle>
               <DocumentDelete />
            </PMItemContainer>
            <PMItemContainer
               onClick={() => {
                  //TODO: API POST Mutation to delete all history savingsAccHistory associated with savingsHistItem's savingsAccId called here
               }}
               isDarkTheme={isDarkTheme}
               dangerItem
            >
               <PMItemTitle>{`Delete All History For ${savingsAccName} `}</PMItemTitle>
               <RepoDeleted />
            </PMItemContainer>
            <PMItemContainer
               onClick={() => {
                  //TODO: API POST Mutation which calls the setSavingsAcc and updates (only) the isTracked field to false
               }}
               isDarkTheme={isDarkTheme}
               warningItem
            >
               <PMItemTitle>Stop Tracking</PMItemTitle>
               <StopCircle />
            </PMItemContainer>
         </PMItemsListWrapper>,
      );
      setClickEvent(e);
      setPMHeightPx(113);
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
                  <HorizontalMenuDots
                     onClick={(e) => handleMenuDotsClick(e, savingsHistObj)}
                     darktheme={isDarkTheme.toString()}
                  />
                  <TextColourizer fontSize="0.8em">
                     {DateHelper.fromDDMMYYYYToWord(savingsHistObj.timestamp)}
                  </TextColourizer>
               </ItemRightColWrapper>
            </CardListItem>
         ))}
      </>
   );
}
