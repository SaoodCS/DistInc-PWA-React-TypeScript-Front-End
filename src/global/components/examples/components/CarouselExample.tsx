// Note -> Scroll animations for this component may not work on desktop browser if animation effects are turned off in Windows settings.
import { useState } from 'react';
import { DummyData } from '../../../helpers/lib/dummyContent/dummyData';
import useCarousel from '../../../hooks/useCarousel';
import Carousel from '../../lib/carousel/Carousel';
import ConditionalRender from '../../lib/conditionalRender/ConditionalRender';

export default function CarouselExample(): JSX.Element {
   const [unmountComponent, setUnmountComponent] = useState(false);
   const { carouselRef, handleGoToSlide, handleNext, handlePrev, setCurrentSlide, currentSlide } =
      useCarousel(1);

   function handleUnmountComponent(): void {
      setUnmountComponent(true);
   }

   function remountComponent(): void {
      setUnmountComponent(false);
   }

   return (
      <>
         <button onClick={handleUnmountComponent}>Unmount Component</button>
         <button onClick={remountComponent}>Remount Component</button>

         <ConditionalRender condition={!unmountComponent}>
            <button onClick={() => handleGoToSlide(1)}>Go to Slide 1</button>
            <button onClick={() => handleGoToSlide(2)}>Go to Slide 2</button>
            <button onClick={handlePrev}>Prev</button>
            <button onClick={handleNext}>Next</button>

            <Carousel ref={carouselRef} width={'100%'} height={'90dvh'}>
               <div>Slide 1{DummyData.loremIpsum}</div>
               <div>Slide 2{DummyData.loremIpsum}</div>
               <div>Slide 3{DummyData.loremIpsum}</div>
            </Carousel>
         </ConditionalRender>
      </>
   );
}
