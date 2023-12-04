importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

firebase.initializeApp({
   apiKey: process.env.VITE_APIKEY,
   authDomain: process.env.VITE_AUTHDOMAIN,
   projectId: process.env.VITE_PROJECTID,
   storageBucket: process.env.VITE_STORAGEBUCKET,
   messagingSenderId: process.env.VITE_MESSAGINGSENDERID,
   appId: process.env.VITE_APPID,
   measurementId: process.env.VITE_MEASUREMENTID,
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
   console.log('Received background message ', payload);
   const notificationTitle = payload.data.title;
   const badgeCountNo = Number(payload.data.badgeCount);
   const notificationOptions = {
      body: payload.data.body,
      data: { url: payload.data.onClickLink },
   };
   if ('setAppBadge' in navigator) {
      navigator.setAppBadge(badgeCountNo).catch((error) => {
         console.error(error);
      });
   }
   self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
   event.notification.close();
   event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function (clientList) {
         for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if ('focus' in client) {
               return client.focus();
            }
         }
         if (clients.openWindow) {
            return clients.openWindow(event.notification.data.url);
         }
      }),
   );
});
