import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import APIHelper from '../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import Color from '../../../../../global/theme/colors';
import {
   FirstRowWrapper,
   FlatListItem,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../style/Style';
import { ISavingsFormInputs } from './form/Savings/Class';
import SavingsForm from './form/Savings/SavingsForm';
import { useSavingsAccounts } from './slide/AccountsSlide';

export default function SavingsAccountList() {
   const { isDarkTheme } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);
   const { data } = useSavingsAccounts();

   function handleSavingsClick(data: ISavingsFormInputs) {
      setIsBottomPanelOpen(true);
      setBottomPanelHeading(data.accountName);
      setBottomPanelContent(<SavingsForm inputValues={data} />);
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
