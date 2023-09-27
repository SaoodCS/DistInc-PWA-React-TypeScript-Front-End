import { useEffect } from 'react';
import { DummyData } from '../../../../../global/helpers/dummyContent/dummyData';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';

export default function AccountSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage('settingsCarousel.currentSlide', 1);
   const identifier = 'settings/account';
   const {
      containerRef: containerRef,
      handleOnScroll: handleOnScroll,
      scrollToTop: scrollToTop,
      scrollSaverStyle: scrollSaverStyle,
   } = useScrollSaver(identifier);

   useEffect(() => {
      if (settingsCarousel === 1) {
         scrollToTop();
      }
   }, [settingsCarousel]);

   return (
      <div ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
         <div>Account Settings</div>
         {DummyData.loremIpsum}
      </div>
   );
}
