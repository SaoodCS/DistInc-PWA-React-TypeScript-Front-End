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
import DetailsContextMenu from './components/contextMenu/DetailsContextMenu';
import Filterer from './components/filterer/Filterer';
import NDetails from './namespace/NDetails';

export default function Details(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Details');
   const { setHeaderRightElement } = useHeaderContext();
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(1, NDetails.key.currentSlide);
   const { isDarkTheme } = useThemeContext();
   const carouselBorderRight: CSSProperties = {
      borderRight: `1px solid ${isDarkTheme ? Color.darkThm.border : Color.lightThm.border}`,
   };

   useEffect(() => {
      setHeaderRightElement(
         <>
            <Filterer  />
            <DetailsContextMenu />
         </>,
      );
      return () => setHeaderRightElement(null);
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
