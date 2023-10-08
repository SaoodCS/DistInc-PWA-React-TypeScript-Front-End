import { useContext } from 'react';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import Color from '../../../../../../global/theme/colors';
import {
   FirstRowWrapper,
   FlatListItem,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../../style/Style';
import SavingsForm from './SavingsForm';
import SavingsClass, { ISavingsFormInputs } from './class/Class';

export default function SavingsAccountList() {
   const { isDarkTheme } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   const { data } = SavingsClass.useQuery.getSavingsAccounts();

   function handleSavingsClick(item: ISavingsFormInputs) {
      setIsBottomPanelOpen(true);
      setBottomPanelHeading(item.accountName);
      setBottomPanelContent(<SavingsForm inputValues={item} />);
      setBottomPanelZIndex(100);
   }

   function handleTagColor(tag: string): string {
      if (tag === 'Account') {
         return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.3);
      }
      if (tag === 'Savings') {
         return Color.setRgbOpacity(
            isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
            0.35,
         );
      }
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.error : Color.lightThm.error, 0.7);
   }

   return (
      <>
         {!!data &&
            Object.keys(data).map((id) => (
               <FlatListItem
                  key={id}
                  isDarkTheme={isDarkTheme}
                  onClick={() => handleSavingsClick(data[id])}
               >
                  <FirstRowWrapper>
                     <ItemTitleWrapper>
                        <ItemTitle>{data[id].accountName}</ItemTitle>
                     </ItemTitleWrapper>
                     <ConditionalRender condition={!!data[id].currentBalance}>
                        <ItemValue>£{data[id].currentBalance}</ItemValue>
                     </ConditionalRender>
                  </FirstRowWrapper>
                  <SecondRowTagsWrapper>
                     <Tag bgColor={handleTagColor('Account')}>Account</Tag>
                     <Tag bgColor={handleTagColor('Savings')}>Savings</Tag>
                     <ConditionalRender condition={!!data[id].targetToReach}>
                        <Tag
                           bgColor={handleTagColor('Target')}
                        >{`Target: £${data[id].targetToReach}`}</Tag>
                     </ConditionalRender>
                  </SecondRowTagsWrapper>
               </FlatListItem>
            ))}
      </>
   );
}
