/* eslint-disable @typescript-eslint/no-floating-promises */
import { Power } from '@styled-icons/fluentui-system-filled/Power';
import { Schedule } from '@styled-icons/material/Schedule';
import { useContext, useEffect, useState } from 'react';
import { Switcher } from '../../../../../global/components/lib/button/switch/Style';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
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
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useLocalStorage from '../../../../../global/hooks/useLocalStorage';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';
import NotifClass, { INotifScheduleFormInputs } from './class/NotifClass';
import NotifScheduleForm from './notifScheduleForm/ScheduleNotifForm';

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
   const [requestedNotifPermission, setRequestedNotifPermission] = useLocalStorage(
      'requestedNotifPermission',
      false,
   );

   const setFcmTokenInFirestore = NotifClass.useMutation.setFcmToken({});

   const {
      data: notifScheduleData,
      isLoading,
      isPaused,
      error,
   } = NotifClass.useQuery.getNotifSchedule({});

   useEffect(() => {
      if (settingsCarousel === 1) {
         scrollToTop();
      }
      Notification.requestPermission().then((permission) => {
         setNotifPermission(permission);
         if (requestedNotifPermission === false) {
            setRequestedNotifPermission(true);
            if (permission === 'granted') {
               NotifClass.getFCMToken().then((token) => {
                  if (token) {
                     console.log(token);
                     setFcmTokenInFirestore.mutateAsync(token);
                  }
               });
            }
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

   function handleScheduleNotif(): void {
      let inputValues: INotifScheduleFormInputs | undefined = undefined;
      if (MiscHelper.isNotFalsyOrEmpty(notifScheduleData)) {
         inputValues = ObjectOfObjects.convertStrPropToDate(notifScheduleData, 'startDate');
      } else {
         inputValues = undefined;
      }
      if (isPortableDevice) {
         toggleBottomPanel(true);
         setBottomPanelHeading('Schedule Notifications');
         setBottomPanelContent(<NotifScheduleForm inputValues={inputValues} />);
         setBottomPanelZIndex(100);
      } else {
         toggleModal(true);
         setModalHeader('Schedule Notification');
         setModalContent(<NotifScheduleForm inputValues={inputValues} />);
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
            <ItemContainer isDarkTheme={isDarkTheme} onClick={handleScheduleNotif} spaceRow={true}>
               <ItemContentWrapper>
                  <IconAndNameWrapper>
                     <Schedule />
                     Schedule Notification
                  </IconAndNameWrapper>
               </ItemContentWrapper>
               <ItemSubElement>
                  <HorizontalMenuDots
                     onClick={() => {}}
                     darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  />
               </ItemSubElement>
            </ItemContainer>
         </MenuListWrapper>
      </>
   );
}
