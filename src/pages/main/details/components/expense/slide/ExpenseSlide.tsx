import { useContext } from 'react';
import {
   FirstRowWrapper,
   FlatListItem,
   FlatListWrapper,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../../../../../../global/components/lib/flatList/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useScrollSaver from '../../../../../../global/hooks/useScrollSaver';
import { BottomPanelContext } from '../../../../../../global/context/widget/bottomPanel/BottomPanelContext';

export default function ExpenseSlide(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const identifier = 'dahsboardCarousel.expensesSlide';
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(identifier);
   const { handleCloseBottomPanel } = useContext(BottomPanelContext);

   

   return (
      <FlatListWrapper ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
         <FlatListItem isDarkTheme={isDarkTheme}>
            <FirstRowWrapper>
               <ItemTitleWrapper>
                  <ItemTitle>Contact Lenses</ItemTitle>
               </ItemTitleWrapper>
               <ItemValue>£16.64</ItemValue>
            </FirstRowWrapper>
            <SecondRowTagsWrapper>
               <Tag bgColor={'red'}>Expense</Tag>
               <Tag bgColor={'blue'}>Subscription</Tag>
            </SecondRowTagsWrapper>
         </FlatListItem>
      </FlatListWrapper>
   );
}
