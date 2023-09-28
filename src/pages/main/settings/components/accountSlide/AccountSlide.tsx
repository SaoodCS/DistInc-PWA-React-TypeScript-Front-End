import { useEffect } from 'react';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';

export default function AccountSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage(NSettings.key.currentSlide, 1);
   const {
      containerRef: containerRef,
      handleOnScroll: handleOnScroll,
      scrollToTop: scrollToTop,
      scrollSaverStyle: scrollSaverStyle,
   } = useScrollSaver(NSettings.key.accountSlide);

   useEffect(() => {
      if (settingsCarousel === 1) {
         scrollToTop();
      }
   }, []);

   return (
      <div ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
         <div>Account Settings</div>
      </div>
   );
}
