/* eslint-disable @typescript-eslint/no-floating-promises */
import { Power } from '@styled-icons/fluentui-system-filled/Power';
import { useContext, useEffect, useState } from 'react';
import { Switcher } from '../../../../../global/components/lib/button/switch/Style';
import {
   IconAndNameWrapper,
   ItemContainer,
   ItemContentWrapper,
   ItemSubElement,
   MenuListWrapper,
} from '../../../../../global/components/lib/menuList/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { ModalContext } from '../../../../../global/context/widget/modal/ModalContext';
import { getCloudMsgRegToken } from '../../../../../global/firebase/config/config';
import useLocalStorage from '../../../../../global/hooks/useLocalStorage';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';

export default function NotificationsSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage(NSettings.key.currentSlide, 1);
   const { isDarkTheme } = useThemeContext();
   const { containerRef, handleOnScroll, scrollToTop, scrollSaverStyle } = useScrollSaver(
      NSettings.key.notifSlide,
   );
   const { setModalContent, setModalHeader, setModalZIndex, toggleModal } =
      useContext(ModalContext);
   const [notifPermission, setNotifPermission] = useState(Notification.permission);
   const [requestedNotifPermission, setRequestedNotifPermission] = useLocalStorage(
      'requestedNotifPermission',
      false,
   );

   useEffect(() => {
      if (settingsCarousel === 1) {
         scrollToTop();
      }
   }, []);

   useEffect(() => {
      Notification.requestPermission().then((permission) => {
         setNotifPermission(permission);
         //if (requestedNotifPermission === false) {
         setRequestedNotifPermission(true);
         // Run the cloud messaging function here that creates a token and stores it in firestore / deletes the old one if it exists and updates it to the new one in firestore
         if (permission === 'granted') {
            getCloudMsgRegToken();
            //}
         }
      });
   }, []);

   function toggleNotifPermission(): void {
      setModalHeader('Notification Settings');
      setModalContent(
         <>
            As you have already set your notification permissions, visit your device settings to
            change them.
         </>,
      );
      setModalZIndex(100);
      toggleModal(true);
   }

   return (
      <>
         <MenuListWrapper
            isDarkTheme={isDarkTheme}
            style={scrollSaverStyle}
            ref={containerRef}
            onScroll={handleOnScroll}
         >
            <ItemContainer
               isDarkTheme={isDarkTheme}
               onClick={toggleNotifPermission}
               spaceRow={true}
            >
               <ItemContentWrapper>
                  <IconAndNameWrapper>
                     <Power />
                     Enable Notifications
                  </IconAndNameWrapper>
               </ItemContentWrapper>
               <ItemSubElement>
                  <Switcher
                     isOn={notifPermission === 'granted'}
                     isDarkTheme={isDarkTheme}
                     size="1.5em"
                  />
               </ItemSubElement>
            </ItemContainer>
         </MenuListWrapper>
      </>
   );
}
