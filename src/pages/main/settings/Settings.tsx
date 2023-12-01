import { useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import InstallAppSteps from '../../../global/components/app/modals/installAppModal/InstallAppSteps';
import { Switcher } from '../../../global/components/lib/button/switch/Style';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Carousel';
import useCarousel from '../../../global/components/lib/carousel/hooks/useCarousel';
import {
   IconAndNameWrapper,
   ItemContainer,
   ItemContentWrapper,
   ItemSubElement,
   MenuListWrapper,
} from '../../../global/components/lib/menuList/Style';
import { VerticalSeperator } from '../../../global/components/lib/positionModifiers/verticalSeperator/VerticalSeperator';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import FooterHooks from '../../../global/context/widget/footer/hooks/FooterHooks';
import useFooterContext from '../../../global/context/widget/footer/hooks/useFooterContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import { auth } from '../../../global/firebase/config/config';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';
import Device from '../../../global/helpers/pwa/deviceHelper';
import useSessionStorage from '../../../global/hooks/useSessionStorage';
import AccountSlide from './components/account/AccountSlide';
import NotificationsSlide from './components/notifications/NotificationsSlide';
import NSettings from './namespace/NSettings';

export default function Settings(): JSX.Element {
   const { toggleTheme, isDarkTheme } = useThemeContext();
   const { containerRef, scrollToSlide, currentSlide } = useCarousel(1, NSettings.key.currentSlide);
   const [slide2, setSlide2] = useSessionStorage<NSettings.TSlides | ''>(NSettings.key.slide2, '');
   const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
   const { setHeaderTitle, setHandleBackBtnClick, hideAndResetBackBtn } = useHeaderContext();
   const { setHandleFooterItemSecondClick, resetFooterItemSecondClick } = useFooterContext();
   const { setModalContent, setModalHeader, setModalZIndex, toggleModal } =
      useContext(ModalContext);
   HeaderHooks.useOnUnMount.hideAndResetBackBtn();
   FooterHooks.useOnUnMount.resetFooterItemSecondClick();
   const queryClient = useQueryClient();

   useEffect(() => {
      if (currentSlide === 1) {
         hideAndResetBackBtn();
         setHeaderTitle('Settings');
         resetFooterItemSecondClick();
      } else {
         setHandleBackBtnClick(() => scrollToSlide(1));
         setHeaderTitle(StringHelper.firstLetterToUpper(slide2));
         setHandleFooterItemSecondClick(() => scrollToSlide(1));
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
         const supportsFcm = await Device.hasFCMSupport();
         if (item.name === 'Notifications' && !supportsFcm) {
            setModalHeader('Notifications');
            setModalContent(
               <>
                  To Manage your notifications, please install the app:
                  <VerticalSeperator />
                  <InstallAppSteps />
               </>,
            );
            setModalZIndex(100);
            toggleModal(true);
            return;
         }
         setSlide2(item.name as NSettings.TSlides);
         scrollToSlide(2);
      } else if (item.name === 'Logout') {
         sessionStorage.clear();
         queryClient.clear();
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
                     key={item.name}
                     onClick={() => handleItemClick(item)}
                     spaceRow={item.withToggle}
                     dangerItem={item.dangerItem}
                     isDarkTheme={isDarkTheme}
                  >
                     <ItemContentWrapper>
                        <IconAndNameWrapper>
                           <item.icon />
                           {item.name}
                        </IconAndNameWrapper>
                     </ItemContentWrapper>
                     <ConditionalRender condition={item.withToggle || false}>
                        <ItemSubElement>
                           <Switcher isOn={isDarkTheme} isDarkTheme={isDarkTheme} size={'1.5em'} />
                        </ItemSubElement>
                     </ConditionalRender>
                  </ItemContainer>
               ))}
            </MenuListWrapper>
         </CarouselSlide>
         <CarouselSlide height={'100%'}>
            <ConditionalRender condition={isSlide2('Account')}>
               <AccountSlide />
            </ConditionalRender>
            <ConditionalRender condition={isSlide2('Notifications')}>
               <NotificationsSlide />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
