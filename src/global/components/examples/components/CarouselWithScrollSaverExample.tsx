// Note -> Scroll animations for this component may not work on desktop browser if animation effects are turned off in Windows settings.
import { useRef } from 'react';
import { DummyData } from '../../../helpers/lib/dummyContent/dummyData';
import useCarousel from '../../../hooks/useCarousel';
import Carousel from '../../lib/carousel/Carousel';

export default function CarouselWithScrollSaverExample(): JSX.Element {
   const path = 'home';
   const identifier = 'carousel';
   const savedSlide = sessionStorage.getItem(`${path}.${identifier}.currentSlide`);
   const { carouselRef, handleGoToSlide, handleNext, handlePrev, setCurrentSlide, currentSlide } =
      useCarousel(savedSlide ? parseInt(savedSlide) : 1);

   const unmountRef = useRef<HTMLDivElement>(null); // this and the handleUnmount functions are just for this example to show that the scroll saver works even when the component is unmounted and remounted

   function handleUnmountComponent(): void {
      if (unmountRef.current) {
         unmountRef.current.style.display = 'none';
         unmountRef.current.setAttribute('aria-hidden', 'true');
      }
   }

   function remountComponent(): void {
      if (unmountRef.current) {
         unmountRef.current.style.display = 'block';
         unmountRef.current.removeAttribute('aria-hidden');
      }
   }
   return (
      <>
         <button onClick={handleUnmountComponent}>Unmount Component</button>
         <button onClick={remountComponent}>Remount Component</button>
         <div ref={unmountRef}>
            <button onClick={() => handleGoToSlide(1)}>Go to Slide 1</button>
            <button onClick={() => handleGoToSlide(2)}>Go to Slide 2</button>
            <button onClick={handlePrev}>Prev</button>
            <button onClick={handleNext}>Next</button>

            <Carousel
               ref={carouselRef}
               width={'100%'}
               height={'90dvh'}
               useScrollSaver={{
                  path,
                  identifier,
                  currentSlide,
                  handleGoToSlide,
               }}
            >
               <div>Slide 1 content: {DummyData.loremIpsum}</div>
               <div>Slide 2 content: {DummyData.loremIpsum}</div>
               <div>Slide 3 content: {DummyData.loremIpsum}</div>
            </Carousel>
         </div>
      </>
   );
}
