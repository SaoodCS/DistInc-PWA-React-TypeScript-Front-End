import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { getToken } from 'firebase/messaging';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import { messaging } from '../../../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';

export default class NotifClass {
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

   static useMutation = {
      setFcmToken: NotifClass.useSetFcmTokenMutation,
   };
}
