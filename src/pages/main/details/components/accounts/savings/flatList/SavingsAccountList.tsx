import { useContext } from 'react';
import {
   FirstRowWrapper,
   FlatListItem,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../../../../../../../global/components/lib/flatList/Style';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import Color from '../../../../../../../global/theme/colors';
import SavingsClass, { ISavingsFormInputs } from '../class/Class';
import SavingsForm from '../form/SavingsForm';

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

   function tagColor(tag: string): string {
      const mapper: { [key: string]: string } = {
         account: isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         type: isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
         target: isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
      };
      return Color.setRgbOpacity(mapper[tag], 0.4);
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
                     <Tag bgColor={tagColor('account')}>Account</Tag>
                     <Tag bgColor={tagColor('type')}>Savings</Tag>
                     <ConditionalRender condition={!!data[id].targetToReach}>
                        <Tag bgColor={tagColor('target')}>
                           {`Target: £${data[id].targetToReach}`}
                        </Tag>
                     </ConditionalRender>
                  </SecondRowTagsWrapper>
               </FlatListItem>
            ))}
      </>
   );
}
