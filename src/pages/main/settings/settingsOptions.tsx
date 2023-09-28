import { LogOut } from '@styled-icons/boxicons-solid/LogOut';
import { PersonSettings } from '@styled-icons/fluentui-system-filled/PersonSettings';
import { DarkTheme } from 'styled-icons/fluentui-system-regular';
import { EditNotifications } from 'styled-icons/material';
import { StyledIcon } from 'styled-icons/types';

export interface ISettingsOptions {
   title: string;
   icon: StyledIcon;
   hasSlide?: boolean;
   withToggle?: boolean;
   logout?: boolean;
}

export const settingsOptions = [
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


type Unionize<T> = T[keyof T];
type SlideTitles<T> = {
   [K in keyof T]: T[K] extends { hasSlide: true; title: infer U } ? U : never;
};
export type TSlides = string & Unionize<SlideTitles<typeof settingsOptions>>;
