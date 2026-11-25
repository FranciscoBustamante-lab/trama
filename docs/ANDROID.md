# Preparación de Android y APK firmado

Este proyecto contiene la configuración y los recursos para empaquetar la web con Cordova. El APK se obtiene después de instalar y verificar las herramientas Android. No se incluye una clave de firma compartida.

La entrega actual incluye un APK release de demostración ya firmado. Consulta `APK_DEMO.md` para su alcance, huella y verificaciones. La clave privada del proyecto se conserva por separado para volver a firmar la versión con Firebase real.

## Herramientas

La versión fijada es `cordova-android` 15.0.0. Su documentación indica JDK 17, Android SDK Platform 36, Build Tools 36.0.0 y Gradle Wrapper 8.14.2. Usa Node.js 22.12 o superior. La tabla oficial está en https://cordova.apache.org/docs/en/latest/guide/platforms/android/ .

1. Instala Android Studio y abre SDK Manager.
2. Instala Android SDK Platform 36, Android SDK Build Tools 36.0.0, Platform Tools y Command-line Tools.
3. Instala JDK 17 y Gradle. Agrega Gradle y `platform-tools` al PATH. Configura `ANDROID_HOME` con la ruta real del SDK y `CORDOVA_JAVA_HOME` con la ruta real del JDK 17. Abre otra terminal.
4. Acepta las licencias con `sdkmanager --licenses` desde la carpeta de herramientas del SDK o desde Android Studio.
5. Prepara un emulador en Device Manager o activa las opciones de desarrollador y depuración USB en un teléfono. Autoriza el equipo en el dispositivo.

## Construir y ejecutar

Desde la carpeta principal:

```powershell
npm ci
npm run mobile:prepare
cd mobile
npm install
npx cordova platform add android@15.0.0
npx cordova requirements android
npx cordova build android --debug
npx cordova run android --device
```

Agrega la plataforma una sola vez. Después de modificar React ejecuta `npm run mobile:prepare` desde la raíz y vuelve a compilar desde `mobile`. Cordova genera Gradle Wrapper dentro de `platforms/android`. No edites esa carpeta para cambiar la aplicación.

El APK debug se encontrará normalmente en `mobile/platforms/android/app/build/outputs/apk/debug/app-debug.apk`. Para Firebase incluye la configuración antes de compilar; autoriza `localhost` en Authentication. La aplicación usa email y contraseña y no requiere Google Sign-In ni `google-services.json` para su SDK web. Auth, Firestore y Storage deben verificarse en el dispositivo con conexión a internet.

## Firmar la versión release

Guarda la clave en una carpeta privada fuera del proyecto. Reemplaza la ruta de ejemplo por una que exista. El comando solicitará tus contraseñas de forma interactiva:

```powershell
keytool -genkeypair -v -keystore C:\RUTA_PRIVADA\trama-release.jks -alias trama -keyalg RSA -keysize 2048 -validity 10000
```

Desde `mobile` crea `build.json`, archivo que está excluido de Git. Usa la ruta real de tu clave:

```json
{
  "android": {
    "release": {
      "keystore": "C:/RUTA_PRIVADA/trama-release.jks",
      "alias": "trama",
      "keystoreType": "jks",
      "packageType": "apk"
    }
  }
}
```

```powershell
npx cordova build android --release --buildConfig=build.json -- --packageType=apk
```

Cordova/Gradle solicitará las contraseñas si no están en la configuración. Si tu terminal no admite esa interacción, configura temporalmente `storePassword` y `password` en tu `build.json` local; no lo compartas y elimina esos valores al terminar. Conserva una copia privada de la clave y sus contraseñas para poder actualizar la aplicación.

Localiza el APK release en `platforms/android/app/build/outputs/apk/release/`. Comprueba su firma usando `apksigner.bat` del SDK Build Tools:

```powershell
apksigner.bat verify --verbose --print-certs RUTA_REAL_DEL_APK
adb install -r RUTA_REAL_DEL_APK
```

Si existe una versión debug con otra firma, Android rechazará actualizarla. Desinstala esa versión desde el teléfono antes de instalar release; esto elimina los datos locales de la aplicación.

## Evidencia de prueba

Registra modelo del teléfono o emulador, versión Android, fecha, resultado de verificación de firma y resultado de estos pasos: abrir catálogo, elegir talla, cambiar cantidad, validar formulario, iniciar sesión, subir un archivo y verificar el pedido en Firestore. No declares que el APK fue probado sin ejecutar estas comprobaciones.
