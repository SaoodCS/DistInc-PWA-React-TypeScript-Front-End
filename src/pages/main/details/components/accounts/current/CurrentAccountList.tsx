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

   function handleCurrentsClick(data: ICurrentFormInputs) {
      setIsBottomPanelOpen(true);
      setBottomPanelHeading(data.accountName);
      setBottomPanelContent(<CurrentForm inputValues={data} />);
      setBottomPanelZIndex(100);
   }

   function handleTagColor(tag: string): string {
      if (tag === 'Account') {
         return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.3);
      }
      if (tag === 'Type') {
         return Color.setRgbOpacity(
            isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
            0.35,
         );
      }
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.error : Color.lightThm.error, 0.7);
   }

   // TODO: update the value of the types in the current form input to be "Salary & Expenses" and "Spendings" so i don't have to do this and so the values are consistent and match the labels
   function handleTypeLabel(type: string) {
      if (type === 'salaryexpenses') return 'Salary & Expenses';
      if (type === 'spendings') return 'Spendings';
   }

   //TODO: add a tag for the transferLeftoversTo value

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
                     <Tag bgColor={handleTagColor('Account')}>Account</Tag>
                     <Tag bgColor={handleTagColor('Type')}>
                        {handleTypeLabel(data[id].accountType)}
                     </Tag>
                     <Tag
                        bgColor={handleTagColor('Target')}
                     >{`Min Cushion: £${data[id].minCushion}`}</Tag>
                  </SecondRowTagsWrapper>
               </FlatListItem>
            ))}
      </>
   );
}
