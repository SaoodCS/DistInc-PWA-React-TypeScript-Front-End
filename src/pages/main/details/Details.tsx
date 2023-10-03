import { useEffect } from 'react';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Style';
import useCarousel from '../../../global/components/lib/carousel/hooks/useCarousel';
import HeaderHooks from '../../../global/context/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/header/hooks/useHeaderContext';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import IncomeSlide from './components/Income/IncomeSlide';
import AccountsSlide from './components/accounts/AccountsSlide';
import DetailsContextMenu from './components/contextMenu/DetailsContextMenu';
import ExpenseSlide from './components/expense/ExpenseSlide';
import { Heading, SlideHeadings } from './style/Style';

export default function Details(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Details');
   const { setHeaderRightElement } = useHeaderContext();
   const identifier = 'dashboardCarousel.currentSlide';
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(1, identifier);
   const { isDarkTheme } = useThemeContext();

   useEffect(() => {
      setHeaderRightElement(<DetailsContextMenu />);
      return () => setHeaderRightElement(null);
   }, []);

   return (
      <>
         <SlideHeadings isDarkTheme={isDarkTheme}>
            <Heading
               onClick={() => scrollToSlide(1)}
               isDarkTheme={isDarkTheme}
               isActive={currentSlide === 1}
            >
               Income
            </Heading>
            <Heading
               onClick={() => scrollToSlide(2)}
               isDarkTheme={isDarkTheme}
               isActive={currentSlide === 2}
            >
               Expenses
            </Heading>
            <Heading
               onClick={() => scrollToSlide(3)}
               isDarkTheme={isDarkTheme}
               isActive={currentSlide === 3}
            >
               Accounts
            </Heading>
         </SlideHeadings>
         <CarouselContainer ref={containerRef} style={{ height: 'calc(100% - 2.5em)' }}>
            <CarouselSlide height="auto">
               <IncomeSlide />
            </CarouselSlide>
            <CarouselSlide height="auto">
               <ExpenseSlide />
            </CarouselSlide>
            <CarouselSlide height="auto">
               <AccountsSlide />
            </CarouselSlide>
         </CarouselContainer>
      </>
   );
}
