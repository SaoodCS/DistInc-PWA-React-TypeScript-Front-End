import { LogOut } from '@styled-icons/boxicons-solid/LogOut';
import { PersonSettings } from '@styled-icons/fluentui-system-filled/PersonSettings';
import { DarkTheme } from 'styled-icons/fluentui-system-regular';
import { EditNotifications } from 'styled-icons/material';
import type { StyledIcon } from 'styled-icons/types';

export namespace NSettings {
   export type ISettingsOptions = {
      name: string;
      icon: StyledIcon;
      hasSlide?: boolean;
      withToggle?: boolean;
      dangerItem?: boolean;
   };

   export type TSlides = string &
      {
         [K in keyof typeof settingsOptionsConst]: (typeof settingsOptionsConst)[K] extends {
            hasSlide: true;
            name: infer U;
         }
            ? U
            : never;
      }[keyof typeof settingsOptionsConst];

   export const settingsOptionsConst = [
      {
         name: 'Account',
         icon: PersonSettings,
         hasSlide: true,
      },
      {
         name: 'Notifications',
         icon: EditNotifications,
         hasSlide: true,
      },
      {
         name: 'Toggle Theme',
         icon: DarkTheme,
         withToggle: true,
      },
      {
         name: 'Logout',
         icon: LogOut,
         dangerItem: true,
      },
   ] as const;

   export const settingsOptions = settingsOptionsConst as unknown as ISettingsOptions[];

   const storageKeyPrefix = 'settingsCarousel';
   export const key = {
      currentSlide: `${storageKeyPrefix}.currentSlide`,
      slide2: `${storageKeyPrefix}.slide2`,
      accountSlide: `${storageKeyPrefix}.accountSlide`,
   };

   export const iconStyle = { height: '1.5em', paddingRight: '0.5em' };
}

export default NSettings;
