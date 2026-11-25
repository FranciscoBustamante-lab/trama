# Guion para presentar Trama

Duración sugerida de 5 a 7 minutos. Ajustar al tiempo y formato que indique el profesor. Repartir los segmentos entre los integrantes y mostrar solo datos ficticios.

## Presentación

Presentar al equipo, la asignatura y la tienda de ropa y accesorios. Explicar que el proyecto permite explorar productos, elegir talla, preparar un carrito y enviar un pedido. Aclarar que no procesa pagos.

## Ejercicio 1

Mostrar el catálogo y sus filtros. Abrir un producto mediante `/producto/:id`, elegir talla y agregarlo. Agregar otra talla, modificar cantidades y eliminar un producto. Explicar que `App` conserva el estado, `ProductCard` recibe props y ejecuta `onAdd`, y el padre actualiza el carrito con `this.setState`. Mostrar brevemente el uso de `map` y los métodos de ciclo de vida.

## Ejercicio 2

Intentar enviar el formulario vacío y mostrar los errores de SimpleReactValidator. Completar nombre, correo y dirección con datos ficticios. Explicar la diferencia entre modo demostración y Firebase real. Para la entrega final, enviar con Firebase configurado y abrir Firestore para mostrar el documento creado y la fecha del servidor.

## Ejercicio 3

Mostrar el registro o inicio de sesión con Firebase Auth. Adjuntar una imagen pequeña y enviar el pedido. Mostrar el archivo en Storage y explicar que las reglas vinculan el acceso con el UID. Mostrar en el teléfono la versión APK, repetir una compra y enseñar la comprobación de la firma. Explicar que Cordova empaqueta los recursos compilados por Vite y usa Gradle para Android.

## Cierre

Abrir el repositorio de GitHub, el README y el sitio de Netlify. Mostrar cómo iniciar el proyecto y dónde está la guía Android. Indicar los enlaces reales y recordar la carga de los entregables en la plataforma.
