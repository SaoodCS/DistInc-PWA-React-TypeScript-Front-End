import { useEffect, useState } from 'react';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Style';
import useCarousel from '../../../global/components/lib/carousel/hooks/useCarousel';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import { auth } from '../../../global/firebase/config/config';
import useScrollSaver from '../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../global/hooks/useSessionStorage';
import Color from '../../../global/theme/colors';
import AccountSlide from './components/accountSlide/AccountSlide';
import { ItemContainer, SettingsWrapper } from './style/Style';
const storageId = 'settingsCarousel';
const carouselId = `${storageId}.currentSlide`;
const nextSlideId = `${storageId}.nextSlide`;

export default function Settings(): JSX.Element {
   const { toggleTheme } = useThemeContext();
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(1, carouselId);
   const {
      containerRef: settingsRef,
      handleOnScroll,
      scrollSaverStyle,
   } = useScrollSaver(storageId);
   const [nextSlide, setNextSlide] = useSessionStorage(nextSlideId, '');
   const [prevCarouselScrollPos, setPrevCarouselScrollPos] = useState<number>(0);

   useEffect(() => {
      let timerId: NodeJS.Timeout | null = null;
      const container = containerRef.current;
      if (container) {
         timerId = setTimeout(() => {
            container.style.overflow = currentSlide === 1 ? 'hidden' : 'scroll';
         }, 1000);
      }
      return () => {
         if (timerId) {
            clearTimeout(timerId);
         }
      };
   }, [currentSlide]);

   function handleNextSlide(item: 'account' | 'notif') {
      setNextSlide(item);
      scrollToSlide(2);
   }

   function handleCarouselScroll() {
      const currentLeftScroll = containerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevCarouselScrollPos && currentLeftScroll === 0) {
         setNextSlide('');
      }
      setPrevCarouselScrollPos(currentLeftScroll!);
   }

   return (
      <CarouselContainer ref={containerRef} onScroll={handleCarouselScroll}>
         <CarouselSlide height={'80dvh'}>
            <SettingsWrapper ref={settingsRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
               <ItemContainer onClick={() => handleNextSlide('account')}>Account</ItemContainer>
               <ItemContainer onClick={() => handleNextSlide('notif')}>Notifications</ItemContainer>
               <ItemContainer onClick={() => toggleTheme()}>Toggle Theme</ItemContainer>
               <ItemContainer style={{ color: Color.darkThm.error }} onClick={() => auth.signOut()}>
                  Logout
               </ItemContainer>
            </SettingsWrapper>
         </CarouselSlide>
         <CarouselSlide height={'80dvh'}>
            <ConditionalRender condition={nextSlide === 'account'}>
               <AccountSlide />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
