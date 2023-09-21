export default class NotifHelpers {
   static async sendPush(header: string, body: string): Promise<void> {
      if (!('serviceWorker' in navigator)) return;
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
         await registration.showNotification(header, {
            body,
         });
      }
   }

   static async requestPermission(): Promise<void> {
      if (!('serviceWorker' in navigator)) return;
      await Notification.requestPermission();
   }
}
