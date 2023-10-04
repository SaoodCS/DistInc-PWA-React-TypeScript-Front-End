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

export default function IncomeSlide(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const identifier = 'dahsboardCarousel.incomeSlide';
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(identifier);

   return (
      <FlatListWrapper ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
         <FlatListItem isDarkTheme={isDarkTheme}>
            <FirstRowWrapper>
               <ItemTitleWrapper>
                  <ItemTitle>Wages</ItemTitle>
               </ItemTitleWrapper>
               <ItemValue>£2094.00</ItemValue>
            </FirstRowWrapper>
            <SecondRowTagsWrapper>
               <Tag bgColor={'green'}>Income</Tag>
               <Tag bgColor={'blue'}>Wages</Tag>
            </SecondRowTagsWrapper>
         </FlatListItem>
      </FlatListWrapper>
   );
}
