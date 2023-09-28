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
   const [slide2, setSlide2] = useSessionStorage<NSettings.TSlides | ''>(NSettings.key.slide2, '');
   const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
   const { setHeaderTitle, setHandleBackBtnClick, hideAndResetBackBtn } = useHeaderContext();
   
   useEffect(() => {
      if (currentSlide === 1) {
         hideAndResetBackBtn();
         setHeaderTitle('Settings');
      } else {
         setHandleBackBtnClick(() => scrollToSlide(1));
         setHeaderTitle(StringHelper.firstLetterToUpper(slide2));
      }
      return () => {
         hideAndResetBackBtn();
      };
   }, [currentSlide]);

   function handleScroll(): void {
      const currentLeftScroll = containerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevScrollPos && currentLeftScroll === 0) setSlide2('');
      setPrevScrollPos(currentLeftScroll!);
   }

   function isSlide2(slideName: NSettings.TSlides): boolean {
      return slide2 === slideName;
   }

   function handleItemClick(item: NSettings.ISettingsOptions): void {
      if (item.hasSlide) {
         setSlide2(item.title as NSettings.TSlides);
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
            <ConditionalRender condition={isSlide2('Account')} children={<AccountSlide />} />
         </CarouselSlide>
      </CarouselContainer>
   );
}
