import { useQueryClient } from '@tanstack/react-query';
import { TextBtn } from '../../../../../../global/components/lib/button/textBtn/Style';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { VerticalSeperator } from '../../../../../../global/components/lib/positionModifiers/verticalSeperator/VerticalSeperator';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import NotifClass from '../class/NotifClass';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';

interface IUpdateNotifSettingsModal {
   setNotifPermission: React.Dispatch<React.SetStateAction<'default' | 'denied' | 'granted'>>;
}

export default function UpdateNotifSettingsModal(props: IUpdateNotifSettingsModal): JSX.Element {
   const { setNotifPermission } = props;
   const { isDarkTheme } = useThemeContext();
   const queryClient = useQueryClient();
   const setNotifScheduleInFirestore = NotifClass.useMutation.setNotifSchedule({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getNotifSchedule.name] });
      },
   });
   const { data: notifScheduleData } = NotifClass.useQuery.getNotifSchedule({});
   console.log(notifScheduleData);

   function handleUpdateNotifSettings(): void {
      Notification.requestPermission().then((permission) => {
         setNotifPermission(permission);
         if (permission === 'granted') {
            NotifClass.getFCMToken().then((token) => {
               if (token) {
                  const storedFcmToken = notifScheduleData?.fcmToken;
                  console.log('storedFcmToken', storedFcmToken);
                  console.log('token', token);
                  if (storedFcmToken !== token) {
                     setNotifScheduleInFirestore.mutateAsync({
                        notifSchedule: notifScheduleData?.notifSchedule || undefined,
                        fcmToken: token,
                     });
                  }
               }
            });
         }
      });
   }

   return (
      <FlexColumnWrapper>
         <TextColourizer>
            As you have already set your notification permissions, visit your device settings to
            change them.
         </TextColourizer>
         <VerticalSeperator />
         <TextColourizer>
            If you have changed notification permissions in your device settings, press the Update
            button below
         </TextColourizer>
         <VerticalSeperator />
         <FlexRowWrapper alignItems="end" justifyContent="end">
            <TextBtn isDarkTheme={isDarkTheme} onClick={() => handleUpdateNotifSettings()}>
               Update
            </TextBtn>
         </FlexRowWrapper>
      </FlexColumnWrapper>
   );
}
