import { useEffect, useState } from 'react';
import { Switcher } from '../../../global/components/lib/button/switch/Style';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Style';
import useCarousel from '../../../global/components/lib/carousel/hooks/useCarousel';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useHeaderContext from '../../../global/context/header/hooks/useHeaderContext';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import { auth } from '../../../global/firebase/config/config';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';
import useSessionStorage from '../../../global/hooks/useSessionStorage';
import AccountSlide from './components/accountSlide/AccountSlide';
import NSettings from './namespace/NSettings';
import { IconAndLabelWrapper, ItemContainer, SettingsWrapper } from './style/Style';

export default function Settings(): JSX.Element {
   const { toggleTheme, isDarkTheme } = useThemeContext();
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(1, NSettings.key.currentSlide);
   const [nextSlide, setNextSlide] = useSessionStorage<NSettings.TSlides | ''>(
      NSettings.key.nextSlide,
      '',
   );
   const [prevCarouselScrollPos, setPrevCarouselScrollPos] = useState<number>(0);
   const { setHeaderTitle, setShowBackBtn, setHandleBackBtnClick } = useHeaderContext();

   useEffect(() => {
      if (currentSlide === 1) {
         setShowBackBtn(false);
         setHandleBackBtnClick(() => null);
         setHeaderTitle('Settings');
      } else {
         setHandleBackBtnClick(() => scrollToSlide(1));
         setShowBackBtn(true);
         setHeaderTitle(StringHelper.firstLetterToUpper(nextSlide));
      }
      return () => {
         setShowBackBtn(false);
         setHandleBackBtnClick(() => null);
      };
   }, [currentSlide]);

   function handleScroll(): void {
      const currentLeftScroll = containerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevCarouselScrollPos && currentLeftScroll === 0) {
         setNextSlide('');
      }
      setPrevCarouselScrollPos(currentLeftScroll!);
   }

   function isNextSlide(slideName: NSettings.TSlides): boolean {
      return nextSlide === slideName;
   }

   function handleItemClick(item: NSettings.ISettingsOptions): void {
      if (item.hasSlide) {
         setNextSlide(item.title as NSettings.TSlides);
         scrollToSlide(2);
      } else if (item.logout) {
         auth.signOut();
      } else if (item.withToggle) {
         toggleTheme();
      }
   }

   return (
      <CarouselContainer ref={containerRef} onScroll={handleScroll} style={{ height: '100%' }}>
         <CarouselSlide height={'100%'}>
            <SettingsWrapper isDarkTheme={isDarkTheme}>
               {NSettings.settingsOptions.map((item) => (
                  <ItemContainer
                     key={item.title}
                     onClick={() => handleItemClick(item)}
                     withToggle={item.withToggle}
                     logoutItem={item.logout}
                     isDarkTheme={isDarkTheme}
                  >
                     <IconAndLabelWrapper>
                        <item.icon style={NSettings.iconStyle} />
                        {item.title}
                     </IconAndLabelWrapper>
                     <ConditionalRender condition={item.withToggle || false}>
                        <Switcher isOn={isDarkTheme} isDarkTheme={isDarkTheme} size={'1.5em'} />
                     </ConditionalRender>
                  </ItemContainer>
               ))}
            </SettingsWrapper>
         </CarouselSlide>
         <CarouselSlide height={'80dvh'}>
            <ConditionalRender condition={isNextSlide('Account')} children={<AccountSlide />} />
         </CarouselSlide>
      </CarouselContainer>
   );
}
