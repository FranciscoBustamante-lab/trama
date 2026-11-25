# Estado de verificación

Revisión del 25 de noviembre de 2026.

## Comprobado

- Dependencias web instaladas y versiones registradas en `package-lock.json`.
- `npm test`: dos pruebas aprobadas. Comprueban agrupación y separación por talla, conservación del estado anterior, importes, límite de cantidad y rechazo de datos locales inválidos.
- `npm run build`: compilación de producción correcta con Vite 6.4.6.
- Renderizado del formulario en servidor mediante React y Vite: campos presentes y total correcto de dos unidades. Validación requerida rechaza un nombre vacío y acepta uno válido. Esta comprobación no sustituye la prueba en navegador.
- `npm run mobile:prepare`: recursos web copiados a Cordova e inclusión de política CSP y `cordova.js` comprobada durante la preparación.
- Navegador local: detalle de producto, selección de talla M, cantidad de dos unidades, total $65.980, validación de campos vacíos y consentimiento, pedido de demostración completado y búsqueda por categoría comprobados.
- `npm run test:firebase`: registro, cierre e inicio de sesión, subida de PNG, escritura y lectura de pedido con fecha de servidor comprobados en emuladores oficiales.
- Reglas en emuladores: acceso a pedidos denegado a otro usuario e invitado; suplantación de UID rechazada; Storage rechaza otro usuario, HTML y un archivo superior a 5 MB.
- Compilación Android debug correcta con Cordova Android 15.0.0, Gradle 8.14.2, JDK 21 y el SDK instalado.
- Compilación Android release correcta y APK de demostración firmado con una clave propia del proyecto. `apksigner verify` confirmó las firmas v2 y v3.
- Firebase cloud: el usuario confirmó mediante capturas el acceso con cuenta y un pedido guardado en la colección `orders` del proyecto `trama-967b7`.
- La configuración cloud se guardó en `.env` local, excluido del repositorio. El titular decidió conservar Spark y no vincular facturación; Storage cloud sigue pendiente. Las pruebas de Storage aprobadas son exclusivamente de emulador.

## Pendiente de verificar

- Subida a Storage con un proyecto Firebase real. Requiere facturación y no se activará sin decisión del titular. Consultar al profesor si acepta la demostración en emuladores.
- Repetir en el proyecto cloud las comprobaciones de reglas realizadas con dos cuentas de emulador.
- Publicación en GitHub y Netlify.
- Instalar y probar el APK en un dispositivo. No había un dispositivo accesible por ADB ni un emulador listo con aceleración disponible en la sesión de preparación.
- Grabación del video y carga de archivos en la plataforma académica.

La compilación genera una advertencia de tamaño del paquete JavaScript porque incluye Firebase. No impide producir los archivos web. Para una aplicación comercial conviene cargar las pantallas y servicios bajo demanda.
