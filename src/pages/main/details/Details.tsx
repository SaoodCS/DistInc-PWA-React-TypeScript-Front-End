import type { CSSProperties } from 'react';
import { useContext, useEffect } from 'react';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Carousel';
import {
   CarouselAndNavBarWrapper,
   NavBarContainer,
   NavBarHeading,
} from '../../../global/components/lib/carousel/NavBar';
import useCarousel from '../../../global/components/lib/carousel/hooks/useCarousel';
import { AddIcon } from '../../../global/components/lib/icons/add/AddIcon';
import { FilterIcon } from '../../../global/components/lib/icons/filter/FilterIcon';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import FooterHooks from '../../../global/context/widget/footer/hooks/FooterHooks';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { PopupMenuContext } from '../../../global/context/widget/popupMenu/PopupMenuContext';
import Color from '../../../global/css/colors';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import BoolHelper from '../../../global/helpers/dataTypes/bool/BoolHelper';
import FiltererContextMenu from './components/contextMenu/FiltererContextMenu';
import NewFormContextMenu from './components/contextMenu/NewFormContextMenu';
import NDetails from './namespace/NDetails';

export default function Details(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Details');
   FooterHooks.useOnMount.setHandleFooterItemSecondClick(() => {});
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   FooterHooks.useOnUnMount.resetFooterItemSecondClick();

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
      togglePM,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   useEffect(() => {
      setHeaderRightElement(
         <>
            <AddIcon
               darktheme={BoolHelper.boolToStr(isDarkTheme)}
               onClick={(e) => {
                  togglePM(true);
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
                  togglePM(true);
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
