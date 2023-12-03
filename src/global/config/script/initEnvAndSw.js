import dotenv from 'dotenv';
import fs from 'fs-extra';

const envFileName = process.argv[2];
const runningEnvValue = process.argv[3];

// Load the .env variables and create the firebase-messaging-sw.js file:
dotenv.config({ path: envFileName });
fs.removeSync('public/firebase-messaging-sw.js');
console.log('Old firebase-messaging-sw.js file deleted...');
const config = fs.readFileSync('src/global/firebase/sw/fcmServiceWorker.js', 'utf8');
const newConfig = config
   .replace(/apiKey: .*,/, `apiKey: '${process.env.VITE_APIKEY}',`)
   .replace(/authDomain: .*,/, `authDomain: '${process.env.VITE_AUTHDOMAIN}',`)
   .replace(/projectId: .*,/, `projectId: '${process.env.VITE_PROJECTID}',`)
   .replace(/storageBucket: .*,/, `storageBucket: '${process.env.VITE_STORAGEBUCKET}',`)
   .replace(/messagingSenderId: .*,/, `messagingSenderId: '${process.env.VITE_MESSAGINGSENDERID}',`)
   .replace(/appId: .*,/, `appId: '${process.env.VITE_APPID}',`)
   .replace(/measurementId: .*,/, `measurementId: '${process.env.VITE_MEASUREMENTID}',`);
fs.writeFileSync('public/firebase-messaging-sw.js', newConfig, 'utf8');
console.log('New firebase-messaging-sw.js file created...');

// Set The VITE_RUNNING env variable to the runningEnvValue:
let envFile = fs.readFileSync(envFileName, 'utf8');
envFile = envFile.replace(/^VITE_RUNNING=locally.*$/gm, '');
envFile = envFile.replace(/^VITE_RUNNING=deployed.*$/gm, '');
envFile = envFile.replace(/^\s*[\r\n]/gm, '');
envFile += `\nVITE_RUNNING=${runningEnvValue}`;
fs.writeFile(envFileName, envFile, 'utf-8');
console.log('VITE_RUNNING env variable updated...');

// Remove the old "dev-dist" folder from the root folder:
fs.removeSync('./dev-dist');
console.log('Old dev-dist folder deleted...');
