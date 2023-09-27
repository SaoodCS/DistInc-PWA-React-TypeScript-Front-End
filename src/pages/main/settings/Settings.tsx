import { LogOut as SignOut } from '@styled-icons/boxicons-solid/LogOut';
import { PersonSettings } from '@styled-icons/fluentui-system-filled/PersonSettings';
import { useEffect, useState } from 'react';
import { DarkTheme } from 'styled-icons/fluentui-system-regular';
import { EditNotifications } from 'styled-icons/material';
import { Switcher } from '../../../global/components/lib/button/switch/Style';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Style';
import useCarousel from '../../../global/components/lib/carousel/hooks/useCarousel';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import { auth } from '../../../global/firebase/config/config';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';
import useSessionStorage from '../../../global/hooks/useSessionStorage';
import Color from '../../../global/theme/colors';
import useHeaderContext from '../context/header/hook/useHeaderContext';
import AccountSlide from './components/accountSlide/AccountSlide';
import {
   IconAndLabelWrapper,
   ItemContainer,
   SettingsWrapper,
   ThemeToggleItem,
} from './style/Style';
const storageId = 'settingsCarousel';
const carouselId = `${storageId}.currentSlide`;
const nextSlideId = `${storageId}.nextSlide`;
type TSlides = 'account' | 'notifications';
const iconStyle = { height: '1.5em', paddingRight: '0.5em' };

export default function Settings(): JSX.Element {
   const { toggleTheme, isDarkTheme } = useThemeContext();
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(1, carouselId);
   const [nextSlide, setNextSlide] = useSessionStorage(nextSlideId, '');
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
      };
   }, [currentSlide]);

   function handleScroll(): void {
      const currentLeftScroll = containerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevCarouselScrollPos && currentLeftScroll === 0) {
         setNextSlide('');
      }
      setPrevCarouselScrollPos(currentLeftScroll!);
   }

   function handleNextSlide(item: TSlides): void {
      setNextSlide(item);
      scrollToSlide(2);
   }

   function isNextSlide(slideName: TSlides): boolean {
      return nextSlide === slideName;
   }

   function handleLogoutColor(): { color: string } {
      return { color: isDarkTheme ? Color.darkThm.error : Color.lightThm.error };
   }

   return (
      <CarouselContainer ref={containerRef} onScroll={handleScroll} style={{ height: '100%' }}>
         <CarouselSlide height={'100%'}>
            <SettingsWrapper isDarkTheme={isDarkTheme}>
               <ItemContainer onClick={() => handleNextSlide('account')}>
                  <PersonSettings style={iconStyle} /> Account
               </ItemContainer>
               <ItemContainer onClick={() => handleNextSlide('notifications')}>
                  <EditNotifications style={iconStyle} />
                  Notifications
               </ItemContainer>
               <ThemeToggleItem onClick={() => toggleTheme()}>
                  <IconAndLabelWrapper>
                     <DarkTheme style={iconStyle} />
                     Toggle Theme
                  </IconAndLabelWrapper>
                  <Switcher isOn={isDarkTheme} isDarkTheme={isDarkTheme} size={'1.5em'} />
               </ThemeToggleItem>
               <ItemContainer style={handleLogoutColor()} onClick={() => auth.signOut()}>
                  <SignOut style={iconStyle} />
                  Logout
               </ItemContainer>
            </SettingsWrapper>
         </CarouselSlide>
         <CarouselSlide height={'80dvh'}>
            <ConditionalRender condition={isNextSlide('account')}>
               <AccountSlide storageId={storageId} carouselId={carouselId} />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
