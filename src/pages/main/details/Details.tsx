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
import Color from '../../../global/css/colors';
import FiltererContextMenu from './components/contextMenu/FiltererContextMenu';
import NewFormContextMenu from './components/contextMenu/NewFormContextMenu';
import NDetails from './namespace/NDetails';

export default function Details(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Details');
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   const { setHeaderRightElement } = useHeaderContext();
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(
      1,
      NDetails.keys.localStorage.currentSlide,
   );
   const { isDarkTheme } = useThemeContext();
   const carouselBorderRight: CSSProperties = {
      borderRight: `1px solid ${isDarkTheme ? Color.darkThm.border : Color.lightThm.border}`,
   };

   useEffect(() => {
      setHeaderRightElement(
         <>
            <FiltererContextMenu currentSlide={currentSlide} />
            <NewFormContextMenu />
         </>,
      );
   }, [currentSlide]);

   return (
      <CarouselAndNavBarWrapper>
         <NavBarContainer isDarkTheme={isDarkTheme}>
            {NDetails.slides.map((slide) => (
               <NavBarHeading
                  key={slide.slideNo}
                  onClick={() => scrollToSlide(slide.slideNo)}
                  isDarkTheme={isDarkTheme}
                  isActive={currentSlide === slide.slideNo}
               >
                  {slide.name}
               </NavBarHeading>
            ))}
         </NavBarContainer>
         <CarouselContainer ref={containerRef}>
            {NDetails.slides.map((slide) => (
               <CarouselSlide key={slide.slideNo} height="auto" style={carouselBorderRight}>
                  {slide.component}
               </CarouselSlide>
            ))}
         </CarouselContainer>
      </CarouselAndNavBarWrapper>
   );
}
