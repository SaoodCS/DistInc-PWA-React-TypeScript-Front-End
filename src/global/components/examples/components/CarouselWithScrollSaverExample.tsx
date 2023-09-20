// Note -> Scroll animations for this component may not work on desktop browser if animation effects are turned off in Windows settings.
import { useState } from 'react';
import { DummyData } from '../../../helpers/lib/dummyContent/dummyData';
import useCarouselWithScrollSaver from '../../lib/carousel/hooks/useCarouselWithScrollSaver';
import { CarouselContainer, CarouselSlide } from '../../lib/carousel/Style';
import ConditionalRender from '../../lib/conditionalRender/ConditionalRender';

export default function CarouselWithScrollSaverExample(): JSX.Element {
   const [unmountComponent, setUnmountComponent] = useState(false);

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
            <CarouselPage />
         </ConditionalRender>
      </>
   );
}

function CarouselPage(): JSX.Element {
   const identifier = 'carouselExample';
   const { containerRef, scrollToSlide, handleSlideOnScroll } =
      useCarouselWithScrollSaver(identifier);

   return (
      <>
         <button onClick={() => scrollToSlide(1)}>Go to Slide 1</button>
         <button onClick={() => scrollToSlide(2)}>Go to Slide 2</button>
         <CarouselContainer ref={containerRef} style={{ width: '20em' }}>
            <CarouselSlide height={'90dvh'} onScroll={() => handleSlideOnScroll(1)}>
               SLIDE 1: {DummyData.loremIpsum}
            </CarouselSlide>
            <CarouselSlide height={'90dvh'} onScroll={() => handleSlideOnScroll(2)}>
               SLIDE 2: {DummyData.loremIpsum}
            </CarouselSlide>
         </CarouselContainer>
      </>
   );
}
