import type { RefObject } from 'react';
import { forwardRef, useEffect, useLayoutEffect } from 'react';
import useSessionStorage from '../../../hooks/useSessionStorage';
import ConditionalRender from '../conditionalRender/ConditionalRender';
import ScrollSaver from '../scrollSaver/ScrollSaver';
import { CarouselContainer, Slide } from './Style';

interface ICarousel {
   children: React.ReactNode[];
   width?: string;
   height?: string;
   useScrollSaver?: {
      path: string;
      identifier: string;
      currentSlide: number;
      handleGoToSlide: (slideNo: number) => void;
   };
}

const Carousel = forwardRef<HTMLDivElement, ICarousel>((props, ref) => {
   const { children, width, height, useScrollSaver } = props;

   const [currentSlideSaved, setCurrentSlideSaved] = useSessionStorage(
      `${useScrollSaver?.path || ''}.${useScrollSaver?.identifier}.currentSlide`,
      useScrollSaver?.currentSlide || 1,
   );

   useLayoutEffect(() => {
      if (useScrollSaver) {
         (ref as RefObject<HTMLDivElement>).current!.style.scrollBehavior = 'auto';
         useScrollSaver.handleGoToSlide(currentSlideSaved);
         (ref as RefObject<HTMLDivElement>).current!.style.scrollBehavior = 'smooth';
      }
   }, []);

   useEffect(() => {
      // Could put this in a return function so that it only saves the current slide to session storage when the component unmounts/user leaves the page
      if (useScrollSaver) {
         setCurrentSlideSaved(useScrollSaver.currentSlide);
      }
   }, [useScrollSaver?.currentSlide]);

   return (
      <CarouselContainer ref={ref} height={height || '90dvh'}>
         {children.map((child, index) => (
            <Slide key={index} width={width || '100dvw'}>
               <ConditionalRender condition={useScrollSaver !== undefined}>
                  <ScrollSaver
                     childHeight={height || '90dvh'}
                     path={useScrollSaver?.path || ''}
                     identifier={`${useScrollSaver?.identifier}.Slide:${index + 1}`}
                  >
                     {child}
                  </ScrollSaver>
               </ConditionalRender>
               <ConditionalRender condition={useScrollSaver === undefined}>
                  {child}
               </ConditionalRender>
            </Slide>
         ))}
      </CarouselContainer>
   );
});

Carousel.displayName = 'Carousel';

export default Carousel;

Carousel.defaultProps = {
   width: '100dvw',
   height: '100dvh',
   useScrollSaver: undefined,
};
