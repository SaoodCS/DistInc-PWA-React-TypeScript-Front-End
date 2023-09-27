import { useEffect } from 'react';
import { DummyData } from '../../../../../global/helpers/dummyContent/dummyData';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';

interface ISettingsSlides {
   storageId: string;
   carouselId: string;
}

export default function AccountSlide(props: ISettingsSlides): JSX.Element {
   const { storageId, carouselId } = props;
   const [settingsCarousel] = useSessionStorage(carouselId, 1);
   const identifier = `${storageId}.accountSlide`;
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
   }, []);

   return (
      <div ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
         <div>Account Settings</div>
         
      </div>
   );
}
