import { useContext } from 'react';
import {
   FirstRowWrapper,
   FlatListItem,
   ItemTitle,
   ItemTitleWrapper,
   SecondRowTagsWrapper,
   Tag,
} from '../../../../../../../global/components/lib/flatList/Style';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import Color from '../../../../../../../global/theme/colors';
import SavingsClass from '../../savings/class/Class';
import type { ICurrentFormInputs } from '../class/Class';
import CurrentClass from '../class/Class';
import CurrentForm from '../form/CurrentForm';

interface ICurrentAccountListItem {
   item: ICurrentFormInputs;
}

export default function CurrentAccountListItem(props: ICurrentAccountListItem): JSX.Element {
   const { item } = props;
   const { isDarkTheme } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   const { data: savingsData } = SavingsClass.useQuery.getSavingsAccounts();

   function handleClick(item: ICurrentFormInputs): void {
      setIsBottomPanelOpen(true);
      setBottomPanelHeading(item.accountName);
      setBottomPanelContent(<CurrentForm inputValues={item} />);
      setBottomPanelZIndex(100);
   }

   function tagColor(tag: string): string {
      const mapper: { [key: string]: string } = {
         account: isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         type: isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
         cushion: isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
         transfer: isDarkTheme ? Color.darkThm.success : Color.lightThm.success,
      };
      return Color.setRgbOpacity(mapper[tag], 0.4);
   }

   function leftoversTag(transferLeftoversId: string): string | undefined {
      const savingsAccount = savingsData?.[transferLeftoversId];
      if (!savingsAccount) return;
      return savingsAccount.accountName;
   }

   return (
      <>
         {CurrentClass.isType.currentItem(item) && (
            <FlatListItem key={item.id} isDarkTheme={isDarkTheme} onClick={() => handleClick(item)}>
               <FirstRowWrapper>
                  <ItemTitleWrapper>
                     <ItemTitle>{item.accountName}</ItemTitle>
                  </ItemTitleWrapper>
               </FirstRowWrapper>
               <SecondRowTagsWrapper>
                  <Tag bgColor={tagColor('account')}>Current Account</Tag>
                  <Tag bgColor={tagColor('type')}>{item.accountType}</Tag>
                  <Tag bgColor={tagColor('cushion')}>{`Cushion: £${item.minCushion}`}</Tag>
                  <Tag bgColor={tagColor('transfer')}>
                     {`Leftovers → ${leftoversTag(item.transferLeftoversTo)}`}
                  </Tag>
               </SecondRowTagsWrapper>
            </FlatListItem>
         )}
      </>
   );
}
