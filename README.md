# Alke Wallet

Billetera digital desarrollada como proyecto del Módulo 2 (Fundamentos del desarrollo Front-end).

La app permite iniciar sesión, ver el saldo, hacer depósitos, enviar dinero a contactos y revisar el historial de movimientos. Es un proyecto solo de front-end: no hay servidor, los datos se guardan en el `localStorage` del navegador.

## Tecnologías

- HTML5 y CSS3
- JavaScript
- Bootstrap 5 (vía CDN)
- jQuery 3 (vía CDN)

Como Bootstrap y jQuery se cargan desde un CDN, no hay que instalar nada: basta con abrir la página.

## Cómo correrlo

Lo más simple es abrir `index.html` en el navegador.

Si prefieres usar un servidor local (recomendado para que el `localStorage` funcione bien), desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Y entrar a http://localhost:8000.

## Cuenta de prueba

La primera vez que se abre la app se crea un usuario de ejemplo:

- Correo: `demo@alkewallet.com`
- Contraseña: `alkemy123`

También se puede crear una cuenta nueva desde la pestaña "Crear cuenta" del login.

> Para reiniciar los datos, borra el localStorage del sitio desde las herramientas del navegador (Application → Local Storage).

## Páginas

- `index.html` – página de bienvenida
- `login.html` – inicio de sesión y registro
- `menu.html` – panel con el saldo y accesos rápidos
- `deposit.html` – depósito de fondos
- `sendmoney.html` – envío de dinero y agenda de contactos
- `transactions.html` – historial de movimientos

El resto del código está en `css/` (estilos) y `js/`. En `js/` la lógica de datos vive en `store.js` (todo lo de localStorage) y cada pantalla tiene su propio archivo.

## Flujo de trabajo en Git

Para el control de versiones se trabajó con una rama por funcionalidad y se integró a `main` mediante Pull Requests:

- `main` – versión estable
- `feature/login` – inicio de sesión
- `feature/depositos` – depósitos y saldo
- `feature/transacciones` – envío de dinero e historial

---

Proyecto educativo. Los datos y las transacciones son simulados.
