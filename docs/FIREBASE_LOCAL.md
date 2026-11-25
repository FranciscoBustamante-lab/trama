# Prueba completa con Firebase local

Los emuladores oficiales permiten probar Authentication, Firestore, Storage y las reglas sin una cuenta cloud ni facturación. Esto sirve para desarrollo; la entrega cloud requiere configurar un proyecto real y demostrarlo por separado.

Requiere Node.js 22.12 o superior y Java 21 o superior para los emuladores actuales.

## Ejecutar pruebas de integración

Desde la carpeta `trama`:

```powershell
npm ci
npm run test:firebase
```

El primer inicio descarga los emuladores oficiales. La prueba crea cuentas ficticias, inicia y cierra sesión, sube una imagen, guarda un pedido con fecha del servidor y comprueba que otro usuario no pueda acceder a sus datos. También comprueba que Storage rechace tipos de archivo no permitidos y archivos mayores a 5 MB. No usa servicios cloud.

## Probar la tienda con los emuladores

1. Copia `.env.emulator.example` a `.env.local`. Si ya tienes un `.env.local` con Firebase real, conserva una copia antes de sustituirlo.
2. En una terminal ejecuta `npm run emulators`.
3. En otra terminal ejecuta `npm run dev`.
4. Abre la dirección de Vite. La franja superior indicará Firebase local con emuladores.
5. Crea una cuenta con correo ficticio, agrega productos, completa un pedido y adjunta una imagen.
6. Revisa los datos en http://127.0.0.1:4000 . Las cuentas y datos son de prueba y se eliminan al reiniciar los emuladores, salvo que configures exportación explícita.

Para volver a Firebase cloud elimina o renombra `.env.local`, configura los valores reales en `.env` y reinicia Vite. Los emuladores están deshabilitados en compilaciones de producción y en el APK. Nunca publiques en Netlify los valores de ejemplo del proyecto demo.

## Firebase cloud y Storage

Cloud Storage for Firebase requiere el plan Blaze según los requisitos vigentes. Antes de vincular facturación revisa https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024 . La activación del plan y cualquier compromiso de pago deben ser realizados por el titular de la cuenta. La configuración de emuladores no sustituye ese requisito para Storage real.
