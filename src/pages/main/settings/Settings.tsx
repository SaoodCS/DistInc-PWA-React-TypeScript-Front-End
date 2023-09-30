import { useEffect, useState } from 'react';
import { Switcher } from '../../../global/components/lib/button/switch/Style';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Style';
import useCarousel from '../../../global/components/lib/carousel/hooks/useCarousel';
import {
   ItemContainer,
   ItemContentWrapper,
   MenuListWrapper,
} from '../../../global/components/lib/menuList/Style';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import HeaderHooks from '../../../global/context/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/header/hooks/useHeaderContext';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import { auth } from '../../../global/firebase/config/config';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';
import useSessionStorage from '../../../global/hooks/useSessionStorage';
import AccountSlide from './components/account/AccountSlide';
import NSettings from './namespace/NSettings';

export default function Settings(): JSX.Element {
   const { toggleTheme, isDarkTheme } = useThemeContext();
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(1, NSettings.key.currentSlide);
   const [slide2, setSlide2] = useSessionStorage<NSettings.TSlides | ''>(NSettings.key.slide2, '');
   const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
   const { setHeaderTitle, setHandleBackBtnClick, hideAndResetBackBtn, setShowBackBtn } = useHeaderContext();
   HeaderHooks.useOnUnMount.hideAndResetBackBtn();

   useEffect(() => {
      if (currentSlide === 1) {
         hideAndResetBackBtn();
         setHeaderTitle('Settings');
      } else {
         setShowBackBtn(true);
         setHandleBackBtnClick(() => scrollToSlide(1));
         setHeaderTitle(StringHelper.firstLetterToUpper(slide2));
      }
   }, [currentSlide]);

   function handleScroll(): void {
      const currentLeftScroll = containerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevScrollPos && currentLeftScroll === 0) setSlide2('');
      setPrevScrollPos(currentLeftScroll!);
   }

   function isSlide2(slideName: NSettings.TSlides): boolean {
      return slide2 === slideName;
   }

   async function handleItemClick(item: NSettings.ISettingsOptions): Promise<void> {
      if (item.hasSlide) {
         setSlide2(item.title as NSettings.TSlides);
         scrollToSlide(2);
      } else if (item.logout) {
         await auth.signOut();
      } else if (item.withToggle) {
         toggleTheme();
      }
   }

   return (
      <CarouselContainer ref={containerRef} onScroll={handleScroll} style={{ height: '100%' }}>
         <CarouselSlide height={'100%'}>
            <MenuListWrapper isDarkTheme={isDarkTheme}>
               {NSettings.settingsOptions.map((item) => (
                  <ItemContainer
                     key={item.title}
                     onClick={() => handleItemClick(item)}
                     spaceRow={item.withToggle}
                     logoutItem={item.logout}
                     isDarkTheme={isDarkTheme}
                  >
                     <ItemContentWrapper row>
                        <item.icon style={NSettings.iconStyle} />
                        {item.title}
                     </ItemContentWrapper>
                     <ConditionalRender condition={item.withToggle || false}>
                        <Switcher isOn={isDarkTheme} isDarkTheme={isDarkTheme} size={'1.5em'} />
                     </ConditionalRender>
                  </ItemContainer>
               ))}
            </MenuListWrapper>
         </CarouselSlide>
         <CarouselSlide height={'100%'}>
            <ConditionalRender condition={isSlide2('Account')}>
               <AccountSlide />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
