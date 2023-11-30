import { TextBtn } from '../../../../../../global/components/lib/button/textBtn/Style';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { VerticalSeperator } from '../../../../../../global/components/lib/positionModifiers/verticalSeperator/VerticalSeperator';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import NotifClass from '../class/NotifClass';

interface IUpdateNotifSettingsModal {
   setNotifPermission: React.Dispatch<React.SetStateAction<'default' | 'denied' | 'granted'>>;
}

export default function UpdateNotifSettingsModal(props: IUpdateNotifSettingsModal): JSX.Element {
   const { setNotifPermission } = props;
   const { isDarkTheme } = useThemeContext();
   const setFcmTokenInFirestore = NotifClass.useMutation.setFcmToken({});

   function handleUpdateNotifSettings(): void {
      Notification.requestPermission().then((permission) => {
         setNotifPermission(permission);
         if (permission === 'granted') {
            NotifClass.getFCMToken().then((token) => {
               if (token) {
                  console.log(token);
                  setFcmTokenInFirestore.mutateAsync(token);
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
