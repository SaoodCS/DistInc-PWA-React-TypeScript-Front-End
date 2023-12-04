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
   const notificationTitle = payload.notification.title.split('badgeCount:')[0];
   const badgeCountNo = Number(payload.notification.title.split('badgeCount:')[1]);
   const notificationOptions = {
      body: payload.notification.body,
   };
   if ('setAppBadge' in navigator) {
      navigator.setAppBadge(badgeCountNo).catch((error) => {
         console.error(error);
      });
   }
   self.registration.showNotification(notificationTitle, notificationOptions);
});
