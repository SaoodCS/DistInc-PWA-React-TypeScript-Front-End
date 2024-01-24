/* eslint-disable @typescript-eslint/no-floating-promises */
import { Power } from '@styled-icons/fluentui-system-filled/Power';
import { Schedule } from '@styled-icons/material/Schedule';
import { useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { Switcher } from '../../../../../global/components/lib/button/switch/Style';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import Loader from '../../../../../global/components/lib/loader/fullScreen/Loader';
import {
   IconAndNameWrapper,
   ItemContainer,
   ItemContentWrapper,
   ItemSubElement,
   MenuListWrapper,
} from '../../../../../global/components/lib/menuList/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../global/context/widget/modal/ModalContext';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';
import Notif from './namespace/Notif';
import NotifScheduleForm from './notifScheduleForm/ScheduleNotifForm';
import UpdateNotifSettingsModal from './updateNotifSettings/UpdateNotifSettingsModal';

export default function NotificationsSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage(NSettings.key.currentSlide, 1);
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { containerRef, handleOnScroll, scrollToTop, scrollSaverStyle } = useScrollSaver(
      NSettings.key.notifSlide,
   );
   const { setModalContent, setModalHeader, setModalZIndex, toggleModal } =
      useContext(ModalContext);
   const { toggleBottomPanel, setBottomPanelContent, setBottomPanelHeading, setBottomPanelZIndex } =
      useContext(BottomPanelContext);
   const [notifPermission, setNotifPermission] = useState(Notification.permission);
   const {
      data: notifScheduleData,
      isLoading,
      isPaused,
   } = Notif.DataStore.useQuery.getNotifSettings();

   const queryClient = useQueryClient();

   const setNotifSettingsInFirestore = Notif.DataStore.useMutation.setNotifSettings({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getNotifSettings.name] });
      },
   });

   useEffect(() => {
      if (settingsCarousel === 1) {
         scrollToTop();
      }
   }, []);

   async function toggleNotifPermission(): Promise<void> {
      if (notifPermission === 'default') {
         const permission = await Notification.requestPermission();
         setNotifPermission(permission);
         if (permission === 'granted') {
            await Notif.DataStore.updateFcmToken(notifScheduleData, setNotifSettingsInFirestore);
         }
      } else {
         setModalHeader('Notification Settings');
         setModalContent(<UpdateNotifSettingsModal />);
         setModalZIndex(100);
         toggleModal(true);
      }
   }

   if (isLoading && !isPaused) {
      return <Loader isDisplayed />;
   }

   function handleScheduleNotifForm(): void {
      if (!notifScheduleData?.fcmToken || notifPermission !== 'granted') {
         setModalHeader('Notification Settings');
         setModalContent(<>Please enable notifications on your device first</>);
         setModalZIndex(100);
         toggleModal(true);
         return;
      }
      if (isPortableDevice) {
         toggleBottomPanel(true);
         setBottomPanelHeading('Set Reminder');
         setBottomPanelContent(<NotifScheduleForm />);
         setBottomPanelZIndex(100);
      } else {
         toggleModal(true);
         setModalHeader('Set Reminder');
         setModalContent(<NotifScheduleForm />);
         setModalZIndex(100);
      }
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
            <ItemContainer
               isDarkTheme={isDarkTheme}
               onClick={handleScheduleNotifForm}
               spaceRow={true}
            >
               <ItemContentWrapper>
                  <IconAndNameWrapper>
                     <Schedule />
                     Set Reminder
                  </IconAndNameWrapper>
               </ItemContentWrapper>
               <ItemSubElement>
                  <HorizontalMenuDots darktheme={BoolHelper.boolToStr(isDarkTheme)} />
               </ItemSubElement>
            </ItemContainer>
         </MenuListWrapper>
      </>
   );
}
