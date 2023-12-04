/* eslint-disable @typescript-eslint/no-floating-promises */
import type {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
} from '@tanstack/react-query';
import { useQuery as useReactQuery } from '@tanstack/react-query';
import { getToken as getFcmToken, onMessage } from 'firebase/messaging';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import { messaging } from '../../../../../../global/firebase/config/config';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { InputArray } from '../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';

export namespace Notif {
   export namespace Schedule {
      type IRecurrenceOptions = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

      export interface ISchedule {
         nextDate: Date | string;
         recurrence: IRecurrenceOptions;
      }

      const inputs: InputArray<ISchedule> = [
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

      // eslint-disable-next-line no-inner-declarations
      function setInitialState(
         notifScheduleData: Notif.DataStore.ISettings | undefined,
      ): ISchedule {
         if (
            MiscHelper.isNotFalsyOrEmpty(notifScheduleData) &&
            MiscHelper.isNotFalsyOrEmpty(notifScheduleData.notifSchedule)
         ) {
            return ObjectOfObjects.convertStrPropToDate(
               notifScheduleData.notifSchedule,
               'nextDate',
            );
         }
         return FormHelper.createInitialState(inputs);
      }

      const initialErrors = FormHelper.createInitialErrors(inputs);

      // eslint-disable-next-line no-inner-declarations
      function validate(formValues: ISchedule): Record<keyof ISchedule, string> {
         const formValidation = FormHelper.validation(formValues, inputs);
         return formValidation;
      }

      export const form = {
         inputs,
         setInitialState,
         initialErrors,
         validate,
      };
   }

   export namespace DataStore {
      export interface ISettings {
         notifSchedule?: Notif.Schedule.ISchedule;
         fcmToken: string;
         badgeCount: number;
      }

      export const useQuery = {
         getNotifSettings: (
            options: UseQueryOptions<ISettings> = {},
         ): UseQueryResult<ISettings, unknown> => {
            return useReactQuery({
               queryKey: [microservices.getNotifSettings.name],
               queryFn: () =>
                  APIHelper.gatewayCall<ISettings>(
                     undefined,
                     'GET',
                     microservices.getNotifSettings.name,
                  ),
               ...options,
            });
         },
      };

      export const useMutation = {
         setNotifSettings: (
            options: UseMutationOptions<void, unknown, ISettings>,
         ): UseMutationResult<void, unknown, ISettings, void> => {
            return useCustomMutation(
               async (formDataFcmTokenBadgeCount: ISettings) => {
                  const body = APIHelper.createBody(formDataFcmTokenBadgeCount);
                  const method = 'POST';
                  const microserviceName = microservices.setNotifSettings.name;
                  await APIHelper.gatewayCall(body, method, microserviceName);
               },
               {
                  ...options,
               },
            );
         },

         delNotifSettings: (
            options: UseMutationOptions<void, unknown, ISettings>,
         ): UseMutationResult<void, unknown, ISettings, void> => {
            return useCustomMutation(
               async (formDataAndFcmToken: ISettings) => {
                  const body = APIHelper.createBody(formDataAndFcmToken);
                  const method = 'POST';
                  const microserviceName = microservices.delNotifSettings.name;
                  await APIHelper.gatewayCall(body, method, microserviceName);
               },
               {
                  ...options,
               },
            );
         },
      };

      export function updateFcmToken(
         notifScheduleData: ISettings | undefined,
         setNotifScheduleInFirestore: UseMutationResult<void, unknown, ISettings, void>,
      ): void {
         Notif.FcmHelper.getToken().then((token) => {
            if (token) {
               const storedFcmToken = notifScheduleData?.fcmToken;
               // console.log('storedFcmToken', storedFcmToken);
               // console.log('token', token);
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

      export function updateBadgeCount(
         newBadgeCount: number,
         notifScheduleData: ISettings | undefined,
         setNotifScheduleInFirestore: UseMutationResult<void, unknown, ISettings, void>,
      ): void {
         setNotifScheduleInFirestore.mutateAsync({
            notifSchedule: notifScheduleData?.notifSchedule || undefined,
            fcmToken: notifScheduleData?.fcmToken || '',
            badgeCount: newBadgeCount,
         });
         if ('setAppBadge' in navigator) {
            navigator.setAppBadge(newBadgeCount);
         }
      }
   }

   export namespace FcmHelper {
      export function onForegroundListener(): void {
         try {
            onMessage(messaging, (payload) => {
               new Notification(payload.notification?.title || '', {
                  body: payload.notification?.body || '',
               });
            });
         } catch (error) {
            console.error(
               `Client/foregroundMessageHandler: An error occurred handling foreground message: ${error}`,
            );
         }
      }

      export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
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

      export async function getToken(): Promise<string | void> {
         try {
            return Notif.FcmHelper.registerServiceWorker().then((serviceWorkerRegistration) => {
               return Promise.resolve(
                  getFcmToken(messaging, {
                     vapidKey: import.meta.env.VITE_VAPID_KEY,
                     serviceWorkerRegistration,
                  }),
               );
            });
         } catch (error) {
            console.error(`Client/getFCMToken: An error occurred retrieving fcm token: ${error}`);
         }
      }

      export async function sendPushMobile(header: string, body: string): Promise<void> {
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
}

export default Notif;
