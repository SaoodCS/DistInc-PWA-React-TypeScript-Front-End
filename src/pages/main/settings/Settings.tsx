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

export default function Settings(): JSX.Element {
   const { toggleTheme } = useThemeContext();
   const identifier = 'settingsCarousel';
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(
      1,
      `${identifier}.currentSlide`,
   );
   const {
      containerRef: slide1containerRef,
      handleOnScroll,
      scrollSaverStyle,
   } = useScrollSaver(identifier);
   const [slide2, setSlide2] = useSessionStorage('settings/slide2', '');
   const [prevCarouselScrollPos, setPrevCarouselScrollPos] = useState<number>(0);

   useEffect(() => {
      let timerId: NodeJS.Timeout | null = null;
      const container = containerRef.current;
      if (container) {
         timerId = setTimeout(() => {
            container.style.overflow = currentSlide === 1 ? 'hidden' : 'scroll';
         }, 300);
      }
      return () => {
         if (timerId) {
            clearTimeout(timerId);
         }
      };
   }, [currentSlide]);

   function handleSetSecondSlide(item: string) {
      if (item === 'account') {
         setSlide2('settings/account');
         scrollToSlide(2);
      }
   }

   function handleCarouselScroll() {
      const currentLeftScroll = containerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevCarouselScrollPos && currentLeftScroll === 0) {
         setSlide2('');
      }
      setPrevCarouselScrollPos(currentLeftScroll!);
   }

   return (
      <CarouselContainer
         ref={containerRef}
         onScroll={handleCarouselScroll}
         style={{ border: '1px solid red' }}
      >
         <CarouselSlide height={'80dvh'}>
            <SettingsWrapper
               ref={slide1containerRef}
               onScroll={handleOnScroll}
               style={scrollSaverStyle}
            >
               <ItemContainer onClick={() => handleSetSecondSlide('account')}>
                  Account
               </ItemContainer>
               <ItemContainer>Notifications</ItemContainer>
               <ItemContainer onClick={() => toggleTheme()}>Toggle Theme</ItemContainer>
               <ItemContainer style={{ color: Color.darkThm.error }} onClick={() => auth.signOut()}>
                  Logout
               </ItemContainer>
            </SettingsWrapper>
         </CarouselSlide>
         <CarouselSlide height={'80dvh'}>
            <ConditionalRender condition={slide2 === 'settings/account'}>
               <AccountSlide />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
