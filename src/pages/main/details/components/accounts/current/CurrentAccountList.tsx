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
import { useCurrentAccounts } from '../AccountsSlide';
import CurrentForm from './CurrentForm';
import { ICurrentFormInputs } from './class/Class';

export default function CurrentAccountList() {
   const { isDarkTheme } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   const { data } = useCurrentAccounts();

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
                  onClick={() => handleCurrentsClick(data[id])}
               >
                  <FirstRowWrapper>
                     <ItemTitleWrapper>
                        <ItemTitle>{data[id].accountName}</ItemTitle>
                     </ItemTitleWrapper>
                  </FirstRowWrapper>
                  <SecondRowTagsWrapper>
                     <Tag bgColor={handleTagColor('Account')}>Account</Tag>
                     <Tag bgColor={handleTagColor('Savings')}>{data[id].accountType}</Tag>
                     <Tag
                        bgColor={handleTagColor('Target')}
                     >{`Min Cushion: £${data[id].minCushion}`}</Tag>
                  </SecondRowTagsWrapper>
               </FlatListItem>
            ))}
      </>
   );
}
