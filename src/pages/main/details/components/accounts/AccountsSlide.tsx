import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import {
   FirstRowWrapper,
   FlatListItem,
   FlatListWrapper,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../Style';

export default function AccountsSlide(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const identifier = 'dahsboardCarousel.accountsSlide';
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(identifier);

   return (
      <FlatListWrapper ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
         <FlatListItem isDarkTheme={isDarkTheme}>
            <FirstRowWrapper>
               <ItemTitleWrapper>
                  <ItemTitle>Lloyds Salary & Expenses</ItemTitle>
               </ItemTitleWrapper>
            </FirstRowWrapper>
            <SecondRowTagsWrapper>
               <Tag bgColor={'orange'}>Account</Tag>
               <Tag bgColor={'blue'}>Salary & Expenses</Tag>
               <Tag bgColor={'red'}>Min Cushion: £300.00</Tag>
            </SecondRowTagsWrapper>
         </FlatListItem>
      </FlatListWrapper>
   );
}
