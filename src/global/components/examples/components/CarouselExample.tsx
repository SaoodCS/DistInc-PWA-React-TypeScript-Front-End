// Note -> Scroll animations for this component may not work on desktop browser if animation effects are turned off in Windows settings.
import { useState } from 'react';
import { DummyData } from '../../../helpers/lib/dummyContent/dummyData';
import ConditionalRender from '../../lib/conditionalRender/ConditionalRender';
import { CarouselContainer, CarouselSlide } from '../../lib/newCarousel/Style';
import useCarousel from '../../lib/newCarousel/useCarousel';

export default function CarouselExample(): JSX.Element {
   const [unmountComponent, setUnmountComponent] = useState(false);
   const { containerRef, currentSlide, scrollToSlide } = useCarousel(1);

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
            <button onClick={() => scrollToSlide(1)}>Go to Slide 1</button>
            <button onClick={() => scrollToSlide(2)}>Go to Slide 2</button>
               <CarouselContainer ref={containerRef} style={{ width: '20em' }}>
                  <CarouselSlide height={'90dvh'}>{DummyData.loremIpsum}</CarouselSlide>
                  <CarouselSlide height={'90dvh'}>{DummyData.loremIpsum}</CarouselSlide>
               </CarouselContainer>
         </ConditionalRender>
      </>
   );
}
