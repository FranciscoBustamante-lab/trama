# Trama

Tienda académica de ropa y accesorios para el examen de Programación de Componentes. Incluye catálogo, búsqueda, filtros, selección de tallas, carrito, formulario de pedido y una integración configurable con Firebase Authentication, Firestore y Storage.

## Inicio rápido

Requiere Node.js 22.12 o superior y npm.

```powershell
npm ci
npm run dev
```

Abre la dirección que indique Vite. Sin variables de Firebase, la aplicación funciona en modo demostración: permite probar catálogo, carrito y formulario, pero no crea cuentas ni envía datos. Un pedido de demostración no se guarda en ningún servidor. El carrito se conserva en el navegador sin datos personales.

```powershell
npm test
npm run build
npm run preview
```

## Configurar Firebase

1. Crea un proyecto en https://console.firebase.google.com y registra una aplicación web.
2. Copia `.env.example` a `.env` y completa sus seis valores con la configuración de la aplicación web. No uses una clave privada de cuenta de servicio.
3. En Authentication activa el proveedor Correo electrónico y contraseña.
4. Crea una base Cloud Firestore y copia `firestore.rules` en su pestaña Reglas. Publica las reglas.
5. Activa Cloud Storage y copia `storage.rules` en su pestaña Reglas. Publica las reglas. Confirma en la consola los requisitos de facturación vigentes de Storage antes de activar el servicio.
6. En Authentication > Settings > Authorized domains agrega `localhost` y, después de publicar, el dominio de Netlify.
7. Reinicia Vite después de cambiar `.env`. Para Netlify, configura las mismas variables y genera un nuevo despliegue.
8. Crea una cuenta desde Ingresar, agrega un producto y completa el pedido. Verifica el documento en `orders` y, si adjuntaste un archivo, su objeto en `attachments/{uid}`.

La configuración web `VITE_*` forma parte del código público compilado. La autorización depende de Firebase Authentication y de las reglas, no de ocultar estos valores. No incluyas cuentas de servicio, contraseñas ni claves de firma en GitHub.

El pedido registra nombre, correo de contacto, dirección, notas, consentimiento, productos, tallas, cantidades, precios de ejemplo, total, UID, fecha del servidor y referencia al archivo. El correo de contacto puede ser diferente del correo de la cuenta. Los archivos admitidos son JPG, PNG o PDF de hasta 5 MB. No existe pasarela de pago. El costo de entrega se coordina por separado.

## Verificar Firebase sin una cuenta cloud

La aplicación también permite usar los emuladores oficiales de Firebase. Consulta `docs/FIREBASE_LOCAL.md`. Con Java 21 instalado, `npm run test:firebase` comprueba registro, sesión, escritura de pedidos, subida de imágenes y aislamiento entre usuarios. Los emuladores se activan solo durante desarrollo; no se incluyen como backend del APK ni de Netlify.

Storage cloud requiere el plan Blaze según sus requisitos vigentes. El titular de la cuenta debe revisar y activar personalmente la facturación si decide utilizarlo. La alternativa local permite verificar el código sin ese compromiso, pero no sustituye la evidencia cloud exigida por el encargo.

**Alcance académico:** las reglas restringen el acceso por propietario y la estructura general del pedido. Los precios y el contenido de cada línea se calculan en el cliente; una tienda comercial debe validar catálogo, precios y existencias en un backend confiable. Las URL de descarga de Firebase tienen un token: quien reciba esa URL podrá abrir el archivo. No uses datos o comprobantes sensibles en esta demostración.

## Estructura

```text
src/
  App.jsx                 Padre de clase, rutas, catálogo, carrito y cuenta
  cart.js                 Operaciones puras del carrito
  cart.test.js            Pruebas de tallas, importes y datos locales
  components/
    ProductCard.jsx       Hijo con props y callback al padre
    ProductArt.jsx        Ilustraciones SVG locales sin descargas externas
    Checkout.jsx          Formulario de clase y simple-react-validator
  data/products.js        Catálogo y formato de moneda
  services/firebase.js    Auth, Firestore, Storage y errores
  styles.css              Diseño adaptable sobre Bootstrap
mobile/config.xml         Configuración Cordova
scripts/prepare-mobile.mjs Recursos web para Android
docs/                     Guías de entrega, Android y video
```

## Relación con los ejercicios

| Ejercicio | Implementación | Cómo demostrarlo |
| --- | --- | --- |
| 1 | JSX, componentes funcionales y de clase, `map`, props, callbacks, state y `this.setState` | Agregar productos de distintas tallas y modificar cantidades |
| 2 | Formulario, simple-react-validator y guardado en Firestore | Intentar envío vacío y luego guardar un pedido válido con sesión |
| 3 | Bootstrap, registro e inicio de sesión, Storage y configuración Cordova | Crear cuenta, adjuntar archivo y ejecutar el APK firmado |
| Contenidos | Rutas `/`, `/bolsa`, `/cuenta`, `/pedido` y `/producto/:id`; métodos de ciclo de vida | Abrir detalle, navegar y recargar conservando el carrito |

El documento menciona `react-simple-validator`; el paquete que implementa la clase `SimpleReactValidator` es **simple-react-validator**. Se usa ese nombre de paquete conforme a su documentación oficial: https://www.npmjs.com/package/simple-react-validator .

`componentDidMount` suscribe la sesión, `componentDidUpdate` conserva el carrito y `componentWillUnmount` elimina la suscripción y el temporizador. Las actualizaciones del carrito usan la forma funcional de `this.setState` para evitar estados obsoletos.

## GitHub y Netlify

1. Crea un repositorio vacío en tu cuenta de GitHub.
2. Desde esta carpeta ejecuta, reemplazando la URL de ejemplo:

```powershell
git init
git add .
git commit -m "Implementa tienda Trama en React"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/trama.git
git push -u origin main
```

3. En Netlify elige importar un proyecto desde GitHub y selecciona el repositorio.
4. Usa `npm run build` como comando de compilación y `dist` como carpeta pública. `netlify.toml` incluye estos valores.
5. Configura las variables `VITE_FIREBASE_*` antes de desplegar si usarás Firebase.
6. Verifica el sitio publicado y autoriza su dominio en Firebase Auth. Conserva el enlace real para la entrega.

Se utiliza HashRouter: por ejemplo `https://tu-sitio.netlify.app/#/producto/camisa-lino`. Esto permite compartir rutas y recargar tanto en Netlify como en Cordova sin reescrituras especiales.

## Android y entrega

Sigue `docs/ANDROID.md` para preparar SDK, Gradle, Cordova, generar el APK y firmarlo. Consulta `docs/ENTREGA.md` para reunir las evidencias y `docs/GUION_VIDEO.md` para la presentación. No incluyas `.env`, claves de firma, `node_modules` o carpetas de compilación Android en el repositorio.

## Fuentes técnicas

- React: https://react.dev/reference/react/Component
- Firebase web: https://firebase.google.com/docs/web/setup
- Firestore: https://firebase.google.com/docs/firestore/quickstart
- Storage: https://firebase.google.com/docs/storage/web/upload-files
- Validador: https://www.npmjs.com/package/simple-react-validator
- Cordova Android: https://cordova.apache.org/docs/en/latest/guide/platforms/android/
- Firma Android: https://developer.android.com/studio/publish/app-signing

## Créditos

Nombre, descripciones, catálogo e ilustraciones creados para este proyecto. Los productos y precios son ejemplos académicos; no representan inventario disponible. Completa los nombres del equipo y los enlaces de entrega en `docs/ENTREGA.md`.
