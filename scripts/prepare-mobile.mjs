import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const destination = new URL('mobile/www/', root);
await mkdir(destination, { recursive: true });
await cp(new URL('dist/', root), destination, { recursive: true });
const index = new URL('index.html', destination);
let html = await readFile(index, 'utf8');
// Cordova sirve los recursos en https://localhost. HashRouter mantiene las rutas en el APK.
html = html.replace('</head>', '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob: https:; connect-src \'self\' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.firebasestorage.app https://*.appspot.com https://*.firebaseapp.com; frame-src https://*.firebaseapp.com; object-src \'none\'; base-uri \'self\'" /></head>');
html = html.replace('</body>', '<script src="cordova.js"></script></body>');
await writeFile(index, html);
console.log(`Recursos preparados en ${fileURLToPath(destination)}`);
