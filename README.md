# Alke Wallet

Billetera digital de front-end hecha como proyecto del Módulo 2 del bootcamp. Para revisar un flujo de login, saldo, depósitos, retiros, envíos e historial sin backend.

## Qué hace

- Login y registro de usuarios.
- Saldo con totales de ingresos y egresos.
- Depósitos y retiros de fondos.
- Envío de dinero a contactos, con buscador que autocompleta.
- Historial de movimientos con filtros: todos, ingresos y egresos.

## Stack

- HTML, CSS y JavaScript.
- Bootstrap 5.3.3 y jQuery 3.7.1, cargados desde CDN.
- `localStorage` del navegador para usuarios, saldo y movimientos.

## Cómo correrlo en local

No requiere instalación. Abrir `index.html` en el navegador, o levantar un servidor local desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Luego entrar a `http://localhost:8000`.

Cuenta de demo: `demo@alkewallet.com` / `alkemy123`. También se puede crear una cuenta nueva desde la pestaña "Crear cuenta" del login. Para volver a los datos de ejemplo, borrar el `localStorage` del sitio desde las herramientas del navegador.

## Estructura

```text
index.html, login.html, menu.html, deposit.html, withdraw.html,
sendmoney.html, transactions.html   Una página por pantalla
css/styles.css                      Estilos
js/store.js                         Datos: usuarios, saldo y movimientos en localStorage
js/session.js                       Sesión del usuario
js/utils.js                         Funciones auxiliares
js/login.js, menu.js, deposit.js,
withdraw.js, sendmoney.js,
transactions.js                     Lógica de cada pantalla
```

## Estado

Proyecto educativo. Los datos y las transacciones son simulados.

## Licencia

MIT — ver LICENSE.

---
Hecho por Matías Moreno · github.com/MatiasJMB
