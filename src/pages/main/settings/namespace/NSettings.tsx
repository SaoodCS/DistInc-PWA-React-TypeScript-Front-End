import { LogOut } from '@styled-icons/boxicons-solid/LogOut';
import { PersonSettings } from '@styled-icons/fluentui-system-filled/PersonSettings';
import { DarkTheme } from 'styled-icons/fluentui-system-regular';
import { EditNotifications } from 'styled-icons/material';
import { StyledIcon } from 'styled-icons/types';

export namespace NSettings {
   export type ISettingsOptions = {
      title: string;
      icon: StyledIcon;
      hasSlide?: boolean;
      withToggle?: boolean;
      logout?: boolean;
   };

   export type TSlides = string &
      {
         [K in keyof typeof settingsOptionsConst]: (typeof settingsOptionsConst)[K] extends {
            hasSlide: true;
            title: infer U;
         }
            ? U
            : never;
      }[keyof typeof settingsOptionsConst];

   export const settingsOptionsConst = [
      {
         title: 'Account',
         icon: PersonSettings,
         hasSlide: true,
      },
      {
         title: 'Notifications',
         icon: EditNotifications,
         hasSlide: true,
      },
      {
         title: 'Toggle Theme',
         icon: DarkTheme,
         withToggle: true,
      },
      {
         title: 'Logout',
         icon: LogOut,
         logout: true,
      },
   ] as const;

   export const settingsOptions = settingsOptionsConst as unknown as ISettingsOptions[];

   const storageKeyPrefix = 'settingsCarousel';
   export const key = {
      currentSlide: `${storageKeyPrefix}.currentSlide`,
      nextSlide: `${storageKeyPrefix}.nextSlide`,
      accountSlide: `${storageKeyPrefix}.accountSlide`,
   };

   export const iconStyle = { height: '1.5em', paddingRight: '0.5em' };
}

export default NSettings;
