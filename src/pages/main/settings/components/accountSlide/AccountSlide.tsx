import { useEffect } from 'react';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import useHeaderContext from '../../../context/header/hook/useHeaderContext';

interface ISettingsSlides {
   storageId: string;
   carouselId: string;
}

export default function AccountSlide(props: ISettingsSlides): JSX.Element {
   const { storageId, carouselId } = props;
   const [settingsCarousel] = useSessionStorage(carouselId, 1);
   const identifier = `${storageId}.accountSlide`;
   const {headerTitle, setHeaderTitle} = useHeaderContext();
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
