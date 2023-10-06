import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useScrollSaver from '../../../../../../global/hooks/useScrollSaver';
import {
   FirstRowWrapper,
   FlatListItem,
   FlatListWrapper,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../../style/Style';

export default function ExpenseSlide(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const identifier = 'dahsboardCarousel.expensesSlide';
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(identifier);

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