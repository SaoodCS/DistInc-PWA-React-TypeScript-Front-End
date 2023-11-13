import type { CSSProperties } from 'react';
import { useContext, useEffect } from 'react';
import { Add } from 'styled-icons/fluentui-system-filled';
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
import { PopupMenuContext } from '../../../global/context/widget/popupMenu/PopupMenuContext';
import Color from '../../../global/css/colors';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import FiltererContextMenu from './components/contextMenu/FiltererContextMenu';
import NewFormContextMenu from './components/contextMenu/NewFormContextMenu';
import NDetails from './namespace/NDetails';
import { FilterIcon } from '../../../global/components/lib/icons/filter/FilterIcon';
import BoolHelper from '../../../global/helpers/dataTypes/bool/BoolHelper';

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
   const {
      setPMContent,
      setPMHeightPx,
      setPMIsOpen,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   useEffect(() => {
      setHeaderRightElement(
         <>
            <Add
               onClick={(e) => {
                  setPMIsOpen(true);
                  setPMContent(<NewFormContextMenu />);
                  setClickEvent(e);
                  setPMHeightPx(100);
                  setPMWidthPx(200);
                  setCloseOnInnerClick(true);
               }}
            />
            <FilterIcon
               darktheme={BoolHelper.boolToStr(isDarkTheme)}
               onClick={(e) => {
                  setPMIsOpen(true);
                  setPMContent(<FiltererContextMenu currentSlide={currentSlide} />);
                  setClickEvent(e);
                  setPMWidthPx(200);
                  setPMHeightPx(
                     ArrayOfObjects.getObjWithKeyValuePair(NDetails.slides, 'slideNo', currentSlide)
                        .sortDataOptions[0].menuHeight,
                  );
               }}
            />
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
