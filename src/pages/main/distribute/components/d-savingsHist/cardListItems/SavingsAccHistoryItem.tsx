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
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import { PopupMenuContext } from '../../../../../../global/context/widget/popupMenu/PopupMenuContext';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import SavingsClass from '../../../../details/components/accounts/savings/class/Class';
import { DistributeContext } from '../../../context/DistributeContext';
import type NDist from '../../../namespace/NDist';
import SavingsAccPopupMenu from '../popupMenu/SavingsAccPopupMenu';

interface ISavingsAccHistoryItems {
   savingsAccHistory: NDist.ISavingsAccHist[];
}

export default function SavingsAccHistoryItems(props: ISavingsAccHistoryItems): JSX.Element {
   const { savingsAccHistory } = props;
   const { handleItemClick } = useContext(DistributeContext);
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();
   const {
      setPMContent,
      setPMHeightPx,
      setPMIsOpen,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   function handleMenuDotsClick(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      savingsAccHistItem: NDist.ISavingsAccHist,
   ): void {
      e.stopPropagation();
      setPMIsOpen(true);
      setPMContent(
         <SavingsAccPopupMenu
            savingsAccHistItem={savingsAccHistItem}
            handleItemClick={handleItemClick}
         />,
      );
      setClickEvent(e);
      setPMHeightPx(146);
      setPMWidthPx(200);
      setCloseOnInnerClick(true);
   }

   return (
      <>
         {savingsAccHistory.map((savingsHistObj) => (
            <CardListItem
               key={`${savingsHistObj.timestamp}.${savingsHistObj.id}`}
               onClick={() => handleItemClick(savingsHistObj, 'savingsAccHistory')}
               isDarkTheme={isDarkTheme}
               width={!isPortableDevice ? '20em' : undefined}
            >
               <ItemTitleAndIconWrapper style={{ position: 'relative' }}>
                  <Savings height={'2em'} style={{ paddingRight: '0.5em' }} />
                  <ItemTitleAndSubTitleWrapper>
                     <TextColourizer>
                        {SavingsClass.getNameFromId(savingsHistObj.id, savingsAccounts || {})}
                     </TextColourizer>
                     <TextColourizer fontSize="0.8em">
                        {`Balance Was: ${NumberHelper.asCurrencyStr(savingsHistObj.balance)}`}
                     </TextColourizer>
                  </ItemTitleAndSubTitleWrapper>
               </ItemTitleAndIconWrapper>
               <ItemRightColWrapper>
                  <HorizontalMenuDots
                     onClick={(e) => handleMenuDotsClick(e, savingsHistObj)}
                     darktheme={BoolHelper.boolToStr(isDarkTheme)}
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
