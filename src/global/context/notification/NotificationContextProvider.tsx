import { useQueryClient } from '@tanstack/react-query';
import { ReactNode, useContext, useEffect } from 'react';
import Notif from '../../../pages/main/settings/components/notifications/namespace/Notif';
import microservices from '../../firebase/apis/microservices/microservices';
import { DeviceContext } from '../device/DeviceContext';
import { ModalContext } from '../widget/modal/ModalContext';
import { NotifContext } from './NotificationContext';
import NotificationReminderModal from './ReminderModal/NotificationReminderModal';

interface INotifContextProvider {
   children: ReactNode;
}

export default function NotifContextProvider(props: INotifContextProvider): JSX.Element {
   const { children } = props;
   const { isInForeground } = useContext(DeviceContext);
   const { refetch } = Notif.DataStore.useQuery.getNotifSettings();
   const { setModalContent, setModalHeader, setModalZIndex, toggleModal } =
      useContext(ModalContext);
   const queryClient = useQueryClient();
   const setNotifSettingsInFirestore = Notif.DataStore.useMutation.setNotifSettings({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getNotifSettings.name] });
      },
   });
   function handleBadgeAction() {
      refetch().then((res) => {
         if (res.data && res.data.badgeCount > 0) {
            setModalHeader('Reminder');
            setModalContent(<NotificationReminderModal toggleModal={toggleModal} />);
            setModalZIndex(100);
            toggleModal(true);
            Notif.DataStore.updateBadgeCount(0, res.data, setNotifSettingsInFirestore);
         }
      });
   }

   Notif.FcmHelper.onForegroundListener({
      postNotifFunc: handleBadgeAction,
   });

   useEffect(() => {
      if (isInForeground) {
         handleBadgeAction();
      }
   }, [isInForeground]);

   return <NotifContext.Provider value>{children}</NotifContext.Provider>;
}
