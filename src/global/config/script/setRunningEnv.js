import fs from 'fs-extra';

const filePath = process.argv[2];
const envValue = process.argv[3];

let envFile = fs.readFileSync(filePath, 'utf8');

envFile = envFile.replace(/^VITE_RUNNING=locally.*$/gm, '');
envFile = envFile.replace(/^VITE_RUNNING=deployed.*$/gm, '');
envFile = envFile.replace(/^\s*[\r\n]/gm, '');

envFile += `\nVITE_RUNNING=${envValue}`;
fs.writeFile(filePath, envFile, 'utf-8');
console.log('VITE_RUNNING env variable updated.');

fs.removeSync('./dev-dist');
console.log('old dev-dist folder removed.');
