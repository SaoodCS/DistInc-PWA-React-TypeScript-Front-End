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
      clients.matchAll({ type: 'all', includeUncontrolled: true }).then(function (clientList) {
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

// clients.openWindow iOS Safari WebPush API Bugs:
// Bug 1: if there is already an instance of the PWA running in the background, after clicking the notif it sometimes opens a new instance of an installed PWA and navigates to the url instead of opening the current instance of the PWA and navigating to the url
// Bug 2: if there is alreadt an instance of the PWA running in the background, after clicking the notif it sometimes opens the current instance of the PWA but does not navigate to the url
// The only case where it works as expected is if there is no instance of the PWA running in the background
// Another bug found: when I install the PWA then run it in the background on Windows, after clicking the notif it opens a new instance of the PWA and navigates to the url instead of opening the current instance of the PWA and navigating to the url

// (Basically in short it always opens a new window with client.openWindow())

//Why does this always open a new window when i click the notif even when there is already one open?

// ChatGPT?:
// self.addEventListener('notificationclick', function (event) {
//    event.notification.close();
//    event.waitUntil(
//       clients.matchAll({ type: 'window' }).then(function (clientList) {
//          let foundFocusedClient = false;

//          for (let i = 0; i < clientList.length; i++) {
//             const client = clientList[i];
//             if ('focus' in client) {
//                client.focus();
//                foundFocusedClient = true;
//                break;  // Break the loop if a focused client is found
//             }
//          }

//          if (!foundFocusedClient) {
//             const isIphone = /iphone|ipod|ipad/i.test(navigator.userAgent);
//             if (!isIphone && clients.openWindow) {
//                return clients.openWindow(event.notification.data.url);
//             }
//          }
//       }),
//    );
// });
