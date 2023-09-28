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
import { ISettingsOptions, TSlides, settingsOptions } from './settingsOptions';
import { IconAndLabelWrapper, ItemContainer, SettingsWrapper } from './style/Style';
const storageId = 'settingsCarousel';
const carouselId = `${storageId}.currentSlide`;
const nextSlideId = `${storageId}.nextSlide`;
const iconStyle = { height: '1.5em', paddingRight: '0.5em' };

export default function Settings(): JSX.Element {
   const { toggleTheme, isDarkTheme } = useThemeContext();
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(1, carouselId);
   const [nextSlide, setNextSlide] = useSessionStorage<TSlides | ''>(nextSlideId, '');
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

   function isNextSlide(slideName: TSlides): boolean {
      return nextSlide === slideName;
   }

   function handleItemClick(item: ISettingsOptions): void {
      if (item.hasSlide) {
         setNextSlide(item.title as TSlides);
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
               {(settingsOptions as unknown as ISettingsOptions[]).map((item, index) => (
                  <ItemContainer
                     key={item.title}
                     onClick={() => handleItemClick(item)}
                     withToggle={item.withToggle}
                     logoutItem={item.logout}
                     isDarkTheme={isDarkTheme}
                  >
                     <IconAndLabelWrapper>
                        <item.icon style={iconStyle} />
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
            <ConditionalRender condition={isNextSlide('Account')}>
               <AccountSlide storageId={storageId} carouselId={carouselId} />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
