import { useEffect } from 'react';
import useCarousel from './useCarousel';

export default function useCarouselWithScrollSaver(storageId: string) {
   const { containerRef, currentSlide, scrollToSlide, setCurrentSlide, numberOfSlides } =
      useCarousel(1, `${storageId}.currentSlide`);

   useEffect(() => {
      if (containerRef.current) {
         containerRef.current.scrollTo({
            left: (currentSlide - 1) * containerRef.current.offsetWidth,
            behavior: 'auto',
         });
         for (let i = 0; i < containerRef.current.children.length; i++) {
            const slide = containerRef.current.children[i];
            const slideNo = i + 1;
            const scrollPos = sessionStorage.getItem(`${storageId}.slideNo-${slideNo}.scrollPos`);
            if (scrollPos) {
               slide.scrollTo(0, parseInt(scrollPos));
            }
         }
      }
   }, []);

   function handleSlideOnScroll(slideNo: number): void {
      const slideIndex = slideNo - 1;
      const scrollPos = containerRef.current?.children[slideIndex].scrollTop;
      sessionStorage.setItem(
         `${storageId}.slideNo-${slideNo}.scrollPos`,
         scrollPos?.toString() || '0',
      );
   }

   return {
      containerRef,
      currentSlide,
      setCurrentSlide,
      scrollToSlide,
      numberOfSlides,
      handleSlideOnScroll,
   };
}
