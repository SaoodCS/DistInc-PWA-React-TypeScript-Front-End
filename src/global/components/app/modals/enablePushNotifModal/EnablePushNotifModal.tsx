// NOTE: To test on mobile, deploy the app to dev env and then open the dev web app on mobile (the domain 192.168.1.80:5173 will not work due to same origin policy)
import { useContext } from 'react';
import { ThemeContext } from '../../../../context/theme/ThemeContext';
import { getCloudMsgRegToken } from '../../../../firebase/config/config';
import NotifHelpers from '../../../../helpers/pwa/notifHelpers';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { TextBtn } from '../../../lib/button/textBtn/Style';
import Modal from '../../../lib/modal/Modal';
import { ModalFooterWrapper } from '../../../lib/modal/Style';

export default function EnablePushNotifModal(): JSX.Element {
   const { isDarkTheme } = useContext(ThemeContext);
   const [pushNotifPermissionRequested, setPushNotifPermissionRequested] = useLocalStorage(
      'pushNotifPermissionRequested',
      false,
   );
   const isIphone = /iphone|ipod|ipad/i.test(window.navigator.userAgent);
   const installedOnUserDevice = !window.matchMedia('(display-mode: browser)').matches;

   const pushNotifNotRequestedAndIsNotIphone = !pushNotifPermissionRequested && !isIphone;
   const pushNotifNotRequestedAndIsIphoneAndIsInstalled =
      !pushNotifPermissionRequested && isIphone && installedOnUserDevice;

   async function handleRequestPermissionBtn(): Promise<void> {
      setPushNotifPermissionRequested(true);
      await NotifHelpers.requestPermission();
      if (Notification.permission === 'granted') {
         await getCloudMsgRegToken();
      }
   }

   function handleCancelBtn(): void {
      setPushNotifPermissionRequested(true);
   }

   return (
      <Modal
         isOpen={
            pushNotifNotRequestedAndIsNotIphone || pushNotifNotRequestedAndIsIphoneAndIsInstalled
         }
         onClose={handleCancelBtn}
         header="Push Notification Request"
      >
         Allow push notifications to receive updates to your device
         <ModalFooterWrapper>
            <TextBtn onClick={handleRequestPermissionBtn} isDarkTheme={isDarkTheme}>
               OK
            </TextBtn>
            <TextBtn onClick={handleCancelBtn} isDarkTheme={isDarkTheme}>
               Cancel
            </TextBtn>
         </ModalFooterWrapper>
      </Modal>
   );
}
