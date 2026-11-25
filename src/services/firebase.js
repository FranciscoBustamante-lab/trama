import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
const env = import.meta.env;
const config = { apiKey: env.VITE_FIREBASE_API_KEY, authDomain: env.VITE_FIREBASE_AUTH_DOMAIN, projectId: env.VITE_FIREBASE_PROJECT_ID, storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET, messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID, appId: env.VITE_FIREBASE_APP_ID };
export const firebaseEnabled = Object.values(config).every(Boolean) && (env.VITE_USE_FIREBASE_EMULATORS !== 'true' || env.DEV);
const app = firebaseEnabled ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;
// Los emuladores son exclusivamente locales y nunca se activan en un build público.
export const emulatorEnabled = firebaseEnabled && env.DEV && env.VITE_USE_FIREBASE_EMULATORS === 'true';
if (emulatorEnabled) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}
export const watchUser = callback => auth ? onAuthStateChanged(auth, callback) : (callback(null), () => {});
export async function authenticate(email, password, register) {
  if (!auth) throw new Error('Configura Firebase para crear una cuenta.');
  await setPersistence(auth, browserLocalPersistence);
  return register ? createUserWithEmailAndPassword(auth, email, password) : signInWithEmailAndPassword(auth, email, password);
}
export const logout = () => signOut(auth);
export async function saveOrder(data, file) {
  if (!auth?.currentUser) throw new Error('Inicia sesión antes de enviar tu pedido.');
  const userId = auth.currentUser.uid;
  let attachment = null;
  if (file) {
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Adjunta un JPG, PNG o PDF de hasta 5 MB.');
    const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'application/pdf': 'pdf' }[file.type];
    attachment = ref(storage, `attachments/${userId}/${crypto.randomUUID()}.${extension}`);
    await uploadBytes(attachment, file);
  }
  try {
    const attachmentUrl = attachment ? await getDownloadURL(attachment) : null;
    const order = await addDoc(collection(db, 'orders'), { ...data, userId, attachmentPath: attachment?.fullPath || null, attachmentUrl, createdAt: serverTimestamp(), status: 'recibido' });
    return order.id;
  } catch (error) {
    if (attachment) await deleteObject(attachment).catch(() => {});
    throw error;
  }
}
export function friendlyError(error) {
  if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/password-does-not-meet-requirements') {
    return error.code === 'auth/operation-not-allowed'
      ? 'El registro por correo está desactivado. En Firebase activa Authentication > Método de acceso > Correo electrónico/contraseña y guarda los cambios.'
      : 'La contraseña no cumple la política configurada en Firebase. Usa una contraseña más larga con mayúsculas, minúsculas, números y símbolos.';
  }
  if (error.code === 'auth/unauthorized-domain') return 'Este dominio no está autorizado en Firebase Authentication. Agrégalo en Configuración > Dominios autorizados.';
  if (error.code === 'auth/invalid-api-key' || error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') return 'La configuración web de Firebase no es válida. Revisa el archivo .env y reinicia la aplicación.';
  const messages = { 'auth/invalid-credential': 'Correo o contraseña incorrectos.', 'auth/email-already-in-use': 'Ese correo ya tiene una cuenta.', 'auth/weak-password': 'Usa una contraseña de al menos 6 caracteres.', 'auth/invalid-email': 'Revisa el correo electrónico.', 'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.', 'auth/network-request-failed': 'No se pudo conectar. Revisa tu conexión.', 'permission-denied': 'Firebase rechazó el acceso. Revisa las reglas y la sesión.', 'storage/unauthorized': 'No tienes permiso para subir este archivo.' };
  const code = /^auth\/[a-z0-9.-]+$/.test(error.code || '') ? ` Código: ${error.code}.` : '';
  return messages[error.code] || `No se pudo completar la operación. Revisa tu conexión y la configuración de Firebase.${code}`;
}
