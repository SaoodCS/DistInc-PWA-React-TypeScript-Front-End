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
import { PopupMenuContext } from '../../../../../../global/context/widget/popupMenu/PopupMenuContext';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import SavingsClass from '../../../../details/components/accounts/savings/class/Class';
import { ICalcSchema } from '../../calculation/CalculateDist';
import SavingsAccPopupMenu from '../../popupMenu/SavingsAccPopupMenu';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';

interface ISavingsAccHistoryItems {
   savingsAccHistory: ICalcSchema['savingsAccHistory'];
}

export default function SavingsAccHistoryItems(props: ISavingsAccHistoryItems): JSX.Element {
   const { savingsAccHistory } = props;
   const { isDarkTheme } = useThemeContext();
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
      savingsAccHistItem: ICalcSchema['savingsAccHistory'][0],
   ) {
      setPMIsOpen(true);
      setPMContent(<SavingsAccPopupMenu savingsAccHistItem={savingsAccHistItem} />);
      setClickEvent(e);
      setPMHeightPx(113);
      setPMWidthPx(200);
      setCloseOnInnerClick(true);
   }

   function handleItemClick() {
      //TODO: display savings account history item details in a modal here
   }

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
