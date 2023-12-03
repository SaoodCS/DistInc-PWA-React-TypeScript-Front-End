/* eslint-disable @typescript-eslint/no-floating-promises */
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
   startDate: Date | string;
   recurrence: IRecurrenceOptions;
}

export interface INotifSettingFirestore {
   notifSchedule?: INotifScheduleFormInputs;
   fcmToken: string;
}

export default class NotifClass {
   private static inputs: InputArray<INotifScheduleFormInputs> = [
      {
         name: 'startDate',
         id: 'schedule-notif-start-date',
         placeholder: 'Start Date',
         type: 'date',
         isRequired: true,
         validator: (value: unknown): string | true => {
            if (value instanceof Date) {
               return true;
            }
            return 'Start Date is required';
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
         return ObjectOfObjects.convertStrPropToDate(notifScheduleData.notifSchedule, 'startDate');
      }
      return FormHelper.createInitialState(NotifClass.inputs);
   }

   private static initialErrors = FormHelper.createInitialErrors(NotifClass.inputs);

   private static validate(
      formValues: INotifScheduleFormInputs,
   ): Record<keyof INotifScheduleFormInputs, string> {
      const formValidation = FormHelper.validation(formValues, NotifClass.inputs);
      return formValidation;
   }

   private static useNotifScheduleQuery(
      options: UseQueryOptions<INotifSettingFirestore> = {},
   ): UseQueryResult<INotifSettingFirestore, unknown> {
      return useQuery({
         queryKey: [microservices.getNotifSchedule.name],
         queryFn: () =>
            APIHelper.gatewayCall<INotifSettingFirestore>(
               undefined,
               'GET',
               microservices.getNotifSchedule.name,
            ),
         ...options,
      });
   }

   private static useSetNotifScheduleMutation(
      options: UseMutationOptions<void, unknown, INotifSettingFirestore>,
   ): UseMutationResult<void, unknown, INotifSettingFirestore, void> {
      return useCustomMutation(
         async (formDataAndFcmToken: INotifSettingFirestore) => {
            const body = APIHelper.createBody(formDataAndFcmToken);
            const method = 'POST';
            const microserviceName = microservices.setNotifSchedule.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useDelNotifScheduleMutation(
      options: UseMutationOptions<void, unknown, INotifSettingFirestore>,
   ): UseMutationResult<void, unknown, INotifSettingFirestore, void> {
      return useCustomMutation(
         async (formDataAndFcmToken: INotifSettingFirestore) => {
            const body = APIHelper.createBody(formDataAndFcmToken);
            const method = 'POST';
            const microserviceName = microservices.delNotifSchedule.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useSetFcmTokenMutation(
      options: UseMutationOptions<void, unknown, string>,
   ): UseMutationResult<void, unknown, string, void> {
      return useCustomMutation(
         async (fcmToken: string) => {
            const body = APIHelper.createBody({ fcmToken });
            const method = 'POST';
            const microserviceName = microservices.setFcmToken.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   static form = {
      inputs: NotifClass.inputs,
      setInitialState: NotifClass.setInitialState,
      initialErrors: NotifClass.initialErrors,
      validate: NotifClass.validate,
   };

   static useQuery = {
      getNotifSchedule: NotifClass.useNotifScheduleQuery,
   };

   static useMutation = {
      setFcmToken: NotifClass.useSetFcmTokenMutation,
      setNotifSchedule: NotifClass.useSetNotifScheduleMutation,
      delNotifSchedule: NotifClass.useDelNotifScheduleMutation,
   };

   static updateFcmToken(
      notifScheduleData: INotifSettingFirestore | undefined,
      setNotifScheduleInFirestore: UseMutationResult<void, unknown, INotifSettingFirestore, void>,
   ): void {
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

   private static async getFCMToken(): Promise<string | void> {
      try {
         return NotifClass.getRegisteredFcmSw().then((serviceWorkerRegistration) => {
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
}
