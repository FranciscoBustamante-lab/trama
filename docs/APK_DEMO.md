# APK de demostración

Se incluye `entregables/Trama-demo-firmada.apk`, compilado en modo release y firmado con una clave del proyecto académico Trama. Permite revisar catálogo, tallas, carrito y formulario de demostración en Android. Firebase cloud todavía no está configurado en este APK.

## Verificación realizada

- Cordova Android 15.0.0 y Gradle 8.14.2.
- Android SDK Platform 36 y Build Tools 36.1.0 instalados en el equipo de preparación.
- Compilación debug y release terminadas correctamente.
- Firma RSA de 2048 bits con alias `trama`.
- Verificación de APK Signature Scheme v2 y v3 correcta mediante `apksigner`.
- SHA256 del APK: `C76FA94DF959D8DBF524AB083D62E79C504832A5EF726CC40645A3496AB1D114`.

El APK no se ha instalado ni probado en un dispositivo. Android puede solicitar que habilites la instalación desde la aplicación usada para abrir el archivo. Revisa el origen y autorízalo solo si deseas instalar esta demostración. El requisito mínimo configurado es Android 7; la compatibilidad real debe comprobarse en el teléfono utilizado para presentar el trabajo.

## Completar la versión final

1. Configura Firebase real en la web y comprueba los servicios.
2. Ejecuta `npm run mobile:prepare` y vuelve a compilar Android siguiendo `ANDROID.md`.
3. Firma con la misma clave privada del proyecto, entregada por separado del ZIP. Conserva esa clave y su contraseña de forma privada.
4. Instala el APK en el teléfono y comprueba el recorrido completo con una cuenta ficticia.
5. Registra modelo, versión de Android, fecha y resultados en las evidencias de entrega.

La clave de firma y su contraseña no están incluidas en este ZIP ni deben subirse a GitHub o a la plataforma de la asignatura.
