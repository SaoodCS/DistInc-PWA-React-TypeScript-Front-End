import {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
   useQuery,
} from '@tanstack/react-query';
import { getToken } from 'firebase/messaging';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import { messaging } from '../../../../../../global/firebase/config/config';
import FormHelper, { InputArray } from '../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';

export type IRecurrenceOptions = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

export interface INotifScheduleFormInputs {
   startDate: Date;
   recurrence: IRecurrenceOptions;
}

export default class NotifClass {
   private static inputs: InputArray<INotifScheduleFormInputs> = [
      {
         name: 'startDate',
         id: 'schedule-notif-start-date',
         placeholder: 'Start Date',
         type: 'date',
         isRequired: true,
         validator: (value: Date): string | true => {
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
         validator: (value: string): string | true => {
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

   private static initialState: INotifScheduleFormInputs = FormHelper.createInitialState(
      NotifClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(NotifClass.inputs);

   private static validate(
      formValues: INotifScheduleFormInputs,
   ): Record<keyof INotifScheduleFormInputs, string> {
      const formValidation = FormHelper.validation(formValues, NotifClass.inputs);
      return formValidation;
   }

   private static useNotifScheduleQuery(
      options: UseQueryOptions<INotifScheduleFormInputs> = {},
   ): UseQueryResult<INotifScheduleFormInputs, unknown> {
      return useQuery({
         queryKey: [microservices.getNotifSchedule.name],
         queryFn: () =>
            APIHelper.gatewayCall<INotifScheduleFormInputs>(
               undefined,
               'GET',
               microservices.getNotifSchedule.name,
            ),
         ...options,
      });
   }

   private static useSetNotifScheduleMutation(
      options: UseMutationOptions<void, unknown, INotifScheduleFormInputs>,
   ): UseMutationResult<void, unknown, INotifScheduleFormInputs, void> {
      return useCustomMutation(
         async (formData: INotifScheduleFormInputs) => {
            const body = APIHelper.createBody(formData);
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
      options: UseMutationOptions<void, unknown, INotifScheduleFormInputs>,
   ): UseMutationResult<void, unknown, INotifScheduleFormInputs, void> {
      return useCustomMutation(
         async (formData: INotifScheduleFormInputs) => {
            const body = APIHelper.createBody(formData);
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
      initialState: NotifClass.initialState,
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

   static async getFCMToken(): Promise<string | void> {
      try {
         const fcmToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID_KEY,
            serviceWorkerRegistration: await navigator.serviceWorker.ready,
         });
         return fcmToken;
      } catch (error) {
         console.error(`Client/getFCMToken: An error occurred retrieving fcm token: ${error}`);
      }
   }
}
