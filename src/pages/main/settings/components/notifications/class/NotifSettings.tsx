/* eslint-disable @typescript-eslint/no-floating-promises */
// TODO: organize / split this class
import type {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getToken, onMessage } from 'firebase/messaging';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import { messaging } from '../../../../../../global/firebase/config/config';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { InputArray } from '../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';

export type IRecurrenceOptions = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

export interface INotifScheduleFormInputs {
   nextDate: Date | string;
   recurrence: IRecurrenceOptions;
}

export interface INotifSettingFirestore {
   notifSchedule?: INotifScheduleFormInputs;
   fcmToken: string;
   badgeCount: number;
}

export default class NotifSettings {
   private static inputs: InputArray<INotifScheduleFormInputs> = [
      {
         name: 'nextDate',
         id: 'schedule-notif-next-date',
         placeholder: 'Date',
         type: 'date',
         isRequired: true,
         validator: (value: unknown): string | true => {
            if (value instanceof Date) {
               return true;
            }
            return 'Date is required';
         },
      },
      {
         name: 'recurrence',
         id: 'schedule-notif-recurrence',
         placeholder: 'Recurrence',
         type: 'string',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [
            { value: 'Daily', label: 'Daily' },
            { value: 'Weekly', label: 'Weekly' },
            { value: 'Monthly', label: 'Monthly' },
            { value: 'Yearly', label: 'Yearly' },
         ],
         validator: (value: unknown): string | true => {
            if (
               value === 'Daily' ||
               value === 'Weekly' ||
               value === 'Monthly' ||
               value === 'Yearly'
            ) {
               return true;
            }
            return 'Recurrence is required';
         },
      },
   ];

   private static setInitialState(
      notifScheduleData: INotifSettingFirestore | undefined,
   ): INotifScheduleFormInputs {
      if (
         MiscHelper.isNotFalsyOrEmpty(notifScheduleData) &&
         MiscHelper.isNotFalsyOrEmpty(notifScheduleData.notifSchedule)
      ) {
         return ObjectOfObjects.convertStrPropToDate(notifScheduleData.notifSchedule, 'nextDate');
      }
      return FormHelper.createInitialState(NotifSettings.inputs);
   }

   private static initialErrors = FormHelper.createInitialErrors(NotifSettings.inputs);

   private static validate(
      formValues: INotifScheduleFormInputs,
   ): Record<keyof INotifScheduleFormInputs, string> {
      const formValidation = FormHelper.validation(formValues, NotifSettings.inputs);
      return formValidation;
   }

   private static useNotifSettingsQuery(
      options: UseQueryOptions<INotifSettingFirestore> = {},
   ): UseQueryResult<INotifSettingFirestore, unknown> {
      return useQuery({
         queryKey: [microservices.getNotifSettings.name],
         queryFn: () =>
            APIHelper.gatewayCall<INotifSettingFirestore>(
               undefined,
               'GET',
               microservices.getNotifSettings.name,
            ),
         ...options,
      });
   }

   private static useSetNotifSettingsMutation(
      options: UseMutationOptions<void, unknown, INotifSettingFirestore>,
   ): UseMutationResult<void, unknown, INotifSettingFirestore, void> {
      return useCustomMutation(
         async (formDataFcmTokenBadgeCount: INotifSettingFirestore) => {
            const body = APIHelper.createBody(formDataFcmTokenBadgeCount);
            const method = 'POST';
            const microserviceName = microservices.setNotifSettings.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useDelNotifSettingsMutation(
      options: UseMutationOptions<void, unknown, INotifSettingFirestore>,
   ): UseMutationResult<void, unknown, INotifSettingFirestore, void> {
      return useCustomMutation(
         async (formDataAndFcmToken: INotifSettingFirestore) => {
            const body = APIHelper.createBody(formDataAndFcmToken);
            const method = 'POST';
            const microserviceName = microservices.delNotifSettings.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   static form = {
      inputs: NotifSettings.inputs,
      setInitialState: NotifSettings.setInitialState,
      initialErrors: NotifSettings.initialErrors,
      validate: NotifSettings.validate,
   };

   static useQuery = {
      getNotifSettings: NotifSettings.useNotifSettingsQuery,
   };

   static useMutation = {
      setNotifSettings: NotifSettings.useSetNotifSettingsMutation,
      delNotifSettings: NotifSettings.useDelNotifSettingsMutation,
   };

   static updateFcmToken(
      notifScheduleData: INotifSettingFirestore | undefined,
      setNotifScheduleInFirestore: UseMutationResult<void, unknown, INotifSettingFirestore, void>,
   ): void {
      NotifSettings.getFCMToken().then((token) => {
         if (token) {
            const storedFcmToken = notifScheduleData?.fcmToken;
            console.log('storedFcmToken', storedFcmToken);
            console.log('token', token);
            if (storedFcmToken !== token) {
               setNotifScheduleInFirestore.mutateAsync({
                  notifSchedule: notifScheduleData?.notifSchedule || undefined,
                  fcmToken: token,
                  badgeCount: notifScheduleData?.badgeCount || 0,
               });
            }
         }
      });
   }

   static updateBadgeCount(
      newBadgeCount: number,
      notifScheduleData: INotifSettingFirestore | undefined,
      setNotifScheduleInFirestore: UseMutationResult<void, unknown, INotifSettingFirestore, void>,
   ) {
      setNotifScheduleInFirestore.mutateAsync({
         notifSchedule: notifScheduleData?.notifSchedule || undefined,
         fcmToken: notifScheduleData?.fcmToken || '',
         badgeCount: newBadgeCount,
      });
      if ('setAppBadge' in navigator) {
         navigator.setAppBadge(newBadgeCount);
      }
   }

   private static async getFCMToken(): Promise<string | void> {
      try {
         return NotifSettings.getRegisteredFcmSw().then((serviceWorkerRegistration) => {
            return Promise.resolve(
               getToken(messaging, {
                  vapidKey: import.meta.env.VITE_VAPID_KEY,
                  serviceWorkerRegistration,
               }),
            );
         });
      } catch (error) {
         console.error(`Client/getFCMToken: An error occurred retrieving fcm token: ${error}`);
      }
   }

   static async getRegisteredFcmSw(): Promise<ServiceWorkerRegistration> {
      const registrations = await window.navigator.serviceWorker.getRegistrations();
      const firebaseMessagingSw = registrations.find(
         (registration) => registration.active?.scriptURL.includes('/firebase-messaging-sw.js'),
      );
      if (firebaseMessagingSw) {
         return Promise.resolve(firebaseMessagingSw);
      }
      return Promise.resolve(
         window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/firebase-push-notification-scope',
         }),
      );
   }

   static foregroundMessageHandler() {
      try {
         onMessage(messaging, (payload) => {
            new Notification(payload.notification?.title || '', {
               body: payload.notification?.body || '',
            });
         });
      } catch (error) {
         console.log(
            `Client/foregroundMessageHandler: An error occurred handling foreground message: ${error}`,
         );
      }
   }

   static async sendPushMobile(header: string, body: string) {
      if (!('serviceWorker' in navigator)) return;
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
         await registration.showNotification(header, {
            body,
         });
      }
   }
}
