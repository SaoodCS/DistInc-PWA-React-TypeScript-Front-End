import { useContext } from 'react';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import Color from '../../../../../../global/theme/colors';
import {
   FirstRowWrapper,
   FlatListItem,
   ItemTitle,
   ItemTitleWrapper,
   SecondRowTagsWrapper,
   Tag,
} from '../../style/Style';
import SavingsClass from '../savings/class/Class';
import CurrentForm from './CurrentForm';
import CurrentClass, { ICurrentFormInputs } from './class/Class';

export default function CurrentAccountList() {
   const { isDarkTheme } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   const { data } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: savingsData } = SavingsClass.useQuery.getSavingsAccounts();

   function handleCurrentsClick(data: ICurrentFormInputs) {
      setIsBottomPanelOpen(true);
      setBottomPanelHeading(data.accountName);
      setBottomPanelContent(<CurrentForm inputValues={data} />);
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

   function leftoversTag(transferLeftoversId: string) {
      const savingsAccount = savingsData?.[transferLeftoversId];
      if (!savingsAccount) return;
      return savingsAccount.accountName;
   }

   return (
      <>
         {!!data &&
            Object.keys(data).map((id) => (
               <FlatListItem
                  key={id}
                  isDarkTheme={isDarkTheme}
                  onClick={() => handleCurrentsClick(data[id])}
               >
                  <FirstRowWrapper>
                     <ItemTitleWrapper>
                        <ItemTitle>{data[id].accountName}</ItemTitle>
                     </ItemTitleWrapper>
                  </FirstRowWrapper>
                  <SecondRowTagsWrapper>
                     <Tag bgColor={tagColor('account')}>Account</Tag>
                     <Tag bgColor={tagColor('type')}>{data[id].accountType}</Tag>
                     <Tag bgColor={tagColor('cushion')}>{`Cushion: £${data[id].minCushion}`}</Tag>
                     <Tag bgColor={tagColor('transfer')}>
                        {`Leftovers → ${leftoversTag(data[id].transferLeftoversTo,)}`}
                     </Tag>
                  </SecondRowTagsWrapper>
               </FlatListItem>
            ))}
      </>
   );
}
