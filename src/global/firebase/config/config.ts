import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
   apiKey: import.meta.env.VITE_APIKEY,
   authDomain: import.meta.env.VITE_AUTHDOMAIN,
   projectId: import.meta.env.VITE_PROJECTID,
   storageBucket: import.meta.env.VITE_STORAGEBUCKET,
   messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
   appId: import.meta.env.VITE_APPID,
   measurementId: import.meta.env.VITE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);
export const messaging = getMessaging(app);

// This function generates a token for the client to receive messages. Occasionally, the function may have to retry once to trigger the service worker to activate and retrieve the token.
export async function getCloudMsgRegToken(retryCount: number = 0): Promise<void> {
   if (!('serviceWorker' in navigator)) return;
   if (Notification.permission === 'granted') {
      try {
         const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID_KEY,
         });
         if (currentToken) {
            console.log('currentToken: ', currentToken);
            //TODO: Store Registration Token in firestore (through microservice) & Follow Registration token best practices + delete the console log when implemented
         } else {
            console.error(
               'Client/getCloudMsgRegToken: No registration token available. Request permission to generate one.',
            );
         }
      } catch (err) {
         const stringifiedErr = JSON.stringify(err);
         if (stringifiedErr.includes('no active Service Worker')) {
            if (retryCount <= 1) {
               console.log('Service worker is not yet active. Retrying getting token...');
               await getCloudMsgRegToken(retryCount + 1);
            }
         } else {
            console.error(
               `Client/getCloudMsgRegToken: An error occurred when requesting to receive the token: ${err}`,
            );
         }
      }
   } else {
      console.error('Client/getCloudMsgRegToken: User notification permission denied.');
   }
}
