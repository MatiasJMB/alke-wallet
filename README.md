# Alke Wallet

Alke Wallet es una billetera digital que hice como proyecto del Módulo 2 del bootcamp (Front-end). La idea era simular la app de una fintech: entrar con tu cuenta, ver el saldo, depositar y retirar plata, enviarle dinero a un contacto y revisar tus movimientos.

Está hecho todo en el front, sin servidor detrás. Los datos se guardan en el `localStorage` del navegador, así que se prueba abriendo la página y listo, sin instalar nada. Dejé una cuenta de prueba para revisarlo al tiro:

- **Correo:** demo@alkewallet.com
- **Contraseña:** alkemy123

También puedes crear una cuenta nueva desde la pestaña "Crear cuenta" del login.

## Qué hace

- Login y registro de usuarios.
- Saldo a la vista, con totales de ingresos y egresos.
- Depósitos y retiros de fondos.
- Envío de dinero a contactos, con un buscador que autocompleta mientras escribes.
- Historial de movimientos con filtros (todos / ingresos / egresos).

## Cómo está armado

HTML, CSS y JavaScript, con Bootstrap para que se vea bien tanto en celular como en escritorio, y jQuery para lo interactivo (las animaciones, el autocompletar y actualizar el saldo después de cada operación). Para no terminar con un desorden, dejé toda la lógica de datos en un solo archivo (`store.js`) y separé el resto del código por pantalla.

Bootstrap y jQuery se cargan desde un CDN, así que no hay que instalar nada.

## Cómo probarlo

Lo más simple es abrir `index.html` en el navegador. Si prefieres un servidor local (mejor para que el `localStorage` se comporte bien), desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Y entras a http://localhost:8000.

> Para volver a los datos de ejemplo, borra el `localStorage` del sitio desde las herramientas del navegador (Application → Local Storage).

## Páginas

- `index.html` – bienvenida
- `login.html` – inicio de sesión y registro
- `menu.html` – panel con el saldo y accesos rápidos
- `deposit.html` – depósito de fondos
- `withdraw.html` – retiro de fondos
- `sendmoney.html` – envío de dinero y agenda de contactos
- `transactions.html` – historial de movimientos

Los estilos están en `css/` y la lógica en `js/` (un archivo por pantalla, más `store.js` para los datos).

## Cómo trabajé con Git

Usé una rama por funcionalidad y las fui integrando a `main` con merges y un Pull Request:

- `main` – versión estable
- `feature/login` – inicio de sesión
- `feature/depositos` – depósitos, retiros y saldo
- `feature/transacciones` – envío de dinero e historial

## Lo que aprendí

Fue de los primeros proyectos donde tuve que pensar en cómo se conectan varias pantallas entre sí, mantener la sesión del usuario y reutilizar código en vez de andar copiando y pegando. Lo siguiente sería conectarlo a un backend de verdad para que los datos no vivan solo en el navegador.

---

Proyecto educativo. Los datos y las transacciones son simulados.
