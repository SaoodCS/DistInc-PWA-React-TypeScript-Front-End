import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Carousel';
import {
   CarouselAndNavBarWrapper,
   NavBarContainer,
   NavBarHeading,
} from '../../../global/components/lib/carousel/NavBar';
import useCarousel from '../../../global/components/lib/carousel/hooks/useCarousel';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import Color from '../../../global/theme/colors';
import IncomeSlide from './components/Income/slide/IncomeSlide';
import AccountsSlide from './components/accounts/AccountsSlide';
import DetailsContextMenu from './components/contextMenu/DetailsContextMenu';
import ExpenseSlide from './components/expense/slide/ExpenseSlide';

export default function Details(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Details');
   const { setHeaderRightElement } = useHeaderContext();
   const identifier = 'dashboardCarousel.currentSlide';
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(1, identifier);
   const { isDarkTheme } = useThemeContext();
   const carouselBorderRight: CSSProperties = {
      borderRight: `1px solid ${isDarkTheme ? Color.darkThm.border : Color.lightThm.border}`,
   };

   useEffect(() => {
      setHeaderRightElement(<DetailsContextMenu />);
      return () => setHeaderRightElement(null);
   }, []);

   return (
      <CarouselAndNavBarWrapper>
         <NavBarContainer isDarkTheme={isDarkTheme}>
            <NavBarHeading
               onClick={() => scrollToSlide(1)}
               isDarkTheme={isDarkTheme}
               isActive={currentSlide === 1}
            >
               Income
            </NavBarHeading>
            <NavBarHeading
               onClick={() => scrollToSlide(2)}
               isDarkTheme={isDarkTheme}
               isActive={currentSlide === 2}
            >
               Expenses
            </NavBarHeading>
            <NavBarHeading
               onClick={() => scrollToSlide(3)}
               isDarkTheme={isDarkTheme}
               isActive={currentSlide === 3}
            >
               Accounts
            </NavBarHeading>
         </NavBarContainer>
         <CarouselContainer ref={containerRef}>
            <CarouselSlide height="auto" style={carouselBorderRight}>
               <IncomeSlide />
            </CarouselSlide>
            <CarouselSlide height="auto" style={carouselBorderRight}>
               <ExpenseSlide />
            </CarouselSlide>
            <CarouselSlide height="auto" style={carouselBorderRight}>
               <AccountsSlide />
            </CarouselSlide>
         </CarouselContainer>
      </CarouselAndNavBarWrapper>
   );
}
