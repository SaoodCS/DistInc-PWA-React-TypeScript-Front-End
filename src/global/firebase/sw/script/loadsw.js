import dotenv from 'dotenv';
import fs from 'fs-extra';

// Load environment variables from ".env.devdeployed"
dotenv.config({ path: '.env' });

// Delete the old config file from the public folder:
fs.removeSync('public/firebase-messaging-sw.js');

// Define the content of "config.js"
const config = fs.readFileSync('src/global/firebase/sw/fcmServiceWorker.js', 'utf8');

const newConfig = config
   .replace(/apiKey: .*,/, `apiKey: '${process.env.VITE_APIKEY}',`)
   .replace(/authDomain: .*,/, `authDomain: '${process.env.VITE_AUTHDOMAIN}',`)
   .replace(/projectId: .*,/, `projectId: '${process.env.VITE_PROJECTID}',`)
   .replace(/storageBucket: .*,/, `storageBucket: '${process.env.VITE_STORAGEBUCKET}',`)
   .replace(/messagingSenderId: .*,/, `messagingSenderId: '${process.env.VITE_MESSAGINGSENDERID}',`)
   .replace(/appId: .*,/, `appId: '${process.env.VITE_APPID}',`)
   .replace(/measurementId: .*,/, `measurementId: '${process.env.VITE_MEASUREMENTID}',`);

// Write the content to "config.js" in the root folder
fs.writeFileSync('public/firebase-messaging-sw.js', newConfig, 'utf8');

fs.removeSync('.env');

console.log('FCM service worker file loaded and copied successfully.');
