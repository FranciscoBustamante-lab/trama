// Estas pruebas usan exclusivamente un proyecto demo y los emuladores locales.
import assert from 'node:assert/strict';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, addDoc, collection, getDoc, doc, serverTimestamp, terminate } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, ref, uploadBytes, getMetadata } from 'firebase/storage';
const projectId = 'demo-trama-local';
const apps = [];
function client(name) {
  const app = initializeApp({ projectId, apiKey: 'demo-trama-local-key', appId: 'local-test', storageBucket: `${projectId}.appspot.com` }, name);
  apps.push(app);
  const auth = getAuth(app); connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  const db = getFirestore(app); connectFirestoreEmulator(db, '127.0.0.1', 8080);
  const storage = getStorage(app); connectStorageEmulator(storage, '127.0.0.1', 9199);
  return { auth, db, storage };
}
const a = client('owner'); const b = client('other'); const guest = client('guest');
try {
  const suffix = Date.now();
  const email = `owner-${suffix}@example.com`; const password = 'PruebaLocal123!';
  await createUserWithEmailAndPassword(a.auth, email, password);
  const uid = a.auth.currentUser.uid;
  await signOut(a.auth); await signInWithEmailAndPassword(a.auth, email, password);
  assert.equal(a.auth.currentUser.uid, uid);
  console.log('OK registro, cierre e inicio de sesión con Firebase Auth.');
  const file = ref(a.storage, `attachments/${uid}/referencia.png`);
  // PNG de 1 por 1, exclusivamente para comprobar Storage y sus reglas.
  const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j0ioAAAAASUVORK5CYII=', 'base64');
  await uploadBytes(file, bytes, { contentType: 'image/png' });
  assert.equal((await getMetadata(file)).contentType, 'image/png');
  console.log('OK subida y lectura de archivo permitido en Firebase Storage.');
  const payload = { name: 'Persona de prueba', email, address: 'Dirección ficticia 123', notes: '', consent: true, userId: uid, attachmentPath: file.fullPath, attachmentUrl: null, items: [{ key: 'camisa-lino:M', productId: 'camisa-lino', name: 'Camisa de lino', size: 'M', quantity: 2, unitPrice: 32990 }], total: 65980, status: 'recibido', createdAt: serverTimestamp() };
  const order = await addDoc(collection(a.db, 'orders'), payload);
  const saved = await getDoc(order);
  assert.equal(saved.data().total, 65980); assert.ok(saved.data().createdAt.toDate());
  console.log('OK pedido guardado y leído en Firestore con fecha del servidor.');
  await createUserWithEmailAndPassword(b.auth, `other-${suffix}@example.com`, password);
  await assert.rejects(getDoc(doc(b.db, 'orders', order.id)), e => e.code === 'permission-denied');
  await assert.rejects(getDoc(doc(guest.db, 'orders', order.id)), e => e.code === 'permission-denied');
  await assert.rejects(addDoc(collection(b.db, 'orders'), payload), e => e.code === 'permission-denied');
  console.log('OK pedidos protegidos frente a otro usuario, invitado y suplantación de UID.');
  await assert.rejects(getMetadata(ref(b.storage, file.fullPath)), e => e.code === 'storage/unauthorized');
  await assert.rejects(uploadBytes(ref(a.storage, `attachments/${uid}/malicioso.html`), new Uint8Array([1]), { contentType: 'text/html' }), e => e.code === 'storage/unauthorized');
  await assert.rejects(uploadBytes(ref(a.storage, `attachments/${uid}/grande.png`), new Uint8Array(5242881), { contentType: 'image/png' }), e => e.code === 'storage/unauthorized');
  console.log('OK Storage bloquea otros usuarios, tipos no permitidos y archivos de más de 5 MB.');
  console.log('PRUEBAS FIREBASE APROBADAS EN EMULADORES; NO SE USÓ UN PROYECTO CLOUD.');
} finally {
  await Promise.all([a, b, guest].map(c => terminate(c.db)));
  await Promise.all(apps.map(app => deleteApp(app)));
}
