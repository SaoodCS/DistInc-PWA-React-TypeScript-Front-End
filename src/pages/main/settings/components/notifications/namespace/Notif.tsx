/* eslint-disable @typescript-eslint/no-floating-promises */
import type {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
} from '@tanstack/react-query';
import { useQuery as useReactQuery } from '@tanstack/react-query';
import {
   getToken as getFcmToken,
   isSupported as isFcmSupported,
   onMessage,
} from 'firebase/messaging';
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

      export async function updateFcmToken(
         notifSettingsData: ISettings,
         setNotifSettingsInFirestore: UseMutationResult<void, unknown, ISettings, void>,
      ): Promise<void> {
         const token = await Notif.FcmHelper.getToken();
         if (token) {
            const storedFcmToken = notifSettingsData.fcmToken;
            // console.log('storedFcmToken', storedFcmToken);
            // console.log('token', token);
            if (storedFcmToken !== token) {
               setNotifSettingsInFirestore.mutateAsync({
                  notifSchedule: notifSettingsData.notifSchedule,
                  fcmToken: token,
                  badgeCount: notifSettingsData.badgeCount || 0,
               });
            }
         }
      }

      export function updateBadgeCount(
         newBadgeCount: number,
         notifSettingsData: ISettings,
         setNotifSettingsInFirestore: UseMutationResult<void, unknown, ISettings, void>,
      ): void {
         if (notifSettingsData.badgeCount !== newBadgeCount) {
            setNotifSettingsInFirestore.mutateAsync({
               notifSchedule: notifSettingsData?.notifSchedule || undefined,
               fcmToken: notifSettingsData?.fcmToken || '',
               badgeCount: newBadgeCount,
            });
         }
         if ('setAppBadge' in navigator) {
            navigator.setAppBadge(newBadgeCount);
         }
      }

      export async function updateBadgeCountAndFcmToken(
         newBadgeCount: number,
         notifSettingsData: ISettings,
         setNotifSettingsInFirestore: UseMutationResult<void, unknown, ISettings, void>,
      ) {
         const token = await Notif.FcmHelper.getToken();
         if (token && notifSettingsData.fcmToken !== token) {
            setNotifSettingsInFirestore.mutateAsync({
               notifSchedule: notifSettingsData.notifSchedule,
               fcmToken: token,
               badgeCount: newBadgeCount,
            });
         } else if (notifSettingsData.badgeCount !== newBadgeCount) {
            setNotifSettingsInFirestore.mutateAsync({
               notifSchedule: notifSettingsData.notifSchedule,
               fcmToken: notifSettingsData.fcmToken,
               badgeCount: newBadgeCount,
            });
         }
         if ('setAppBadge' in navigator) {
            navigator.setAppBadge(newBadgeCount);
         }
      }
   }

   export namespace FcmHelper {
      export async function isSupported(): Promise<boolean> {
         try {
            const isSupportedResult = await isFcmSupported();
            return isSupportedResult;
         } catch (error) {
            console.error(`Client/FcmHelper.isSupported: An error occurred: ${error}`);
            return false;
         }
      }

      export function onForegroundListener(options?: {
         postNotifFunc?: () => Promise<void> | (() => void);
      }): void {
         try {
            // Note: this onMessage listener is not yet supported in iOS PWA
            onMessage(messaging, (payload) => {
               new Notification(payload.data?.title || 'New Notification', {
                  body: payload.data?.body || '',
               });
               if (options && options.postNotifFunc) {
                  options.postNotifFunc();
               }
            });
         } catch (error) {
            console.error(
               `Client/foregroundMessageHandler: An error occurred handling foreground message: ${error}`,
            );
         }
      }

      export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
         try {
            const registrations = await window.navigator.serviceWorker.getRegistrations();
            const fcmSwReg = registrations.find(
               (registration) =>
                  registration.active?.scriptURL.includes('/firebase-messaging-sw.js'),
            );
            if (fcmSwReg) {
               return fcmSwReg;
            }
            const newFcmSwReg = await window.navigator.serviceWorker.register(
               '/firebase-messaging-sw.js',
               {
                  scope: '/firebase-push-notification-scope',
               },
            );
            await newFcmSwReg.update();
            return newFcmSwReg;
         } catch (error) {
            console.error(
               `Client/registerServiceWorker: An error occurred registering service worker: ${error}`,
            );
            return Promise.reject(error);
         }
      }

      export async function getToken(): Promise<string | void> {
         try {
            const registeredWorker = await registerServiceWorker();
            const token = await getFcmToken(messaging, {
               vapidKey: import.meta.env.VITE_VAPID_KEY,
               serviceWorkerRegistration: registeredWorker,
            });
            return token;
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
