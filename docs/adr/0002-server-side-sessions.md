# ADR 0002: sesiones opacas en servidor y mismo origen

- Estado: aceptada para el MVP
- Fecha: 2026-07-24
- Responsables: arquitectura y seguridad

## Contexto

El cliente principal es un navegador/PWA que tratará datos especialmente
sensibles. El MVP necesita revocar accesos, suspender cuentas y evitar exponer
credenciales duraderas a JavaScript. No necesita autenticación federada ni que
terceros consuman la API.

## Decisión

La autenticación inicial usará correo y contraseña con hash Argon2id. Sus
parámetros se elegirán mediante benchmark en la infraestructura objetivo y se
revisarán frente a la guía de seguridad vigente; no se fijan cifras sin esa
validación.

Después del login, el servidor emitirá un identificador de sesión aleatorio,
opaco y de alta entropía. El navegador solo lo recibirá en una cookie con:

- nombre con prefijo `__Host-` en producción;
- `HttpOnly`, `Secure` en entornos TLS, `SameSite=Lax` y `Path=/`;
- sin atributo `Domain`;
- caducidad inactiva y absoluta configurables.

Redis almacenará las sesiones activas con TTL usando un derivado no reversible
del token como clave. Las sesiones rotarán después de autenticarse, cambiar
privilegios o completar una recuperación. Un cambio de contraseña, suspensión
o cierre global revocará todas las sesiones de la cuenta.

La web y la API operarán bajo el mismo origen. Las operaciones no seguras
exigirán validación de `Origin`/`Referer` y un token CSRF ligado a la sesión. La
cookie `SameSite` será una defensa adicional, no la única.

Los tokens de invitación, verificación de correo y recuperación:

- serán aleatorios, de un solo uso, con propósito y expiración explícitos;
- se guardarán solo mediante hash;
- producirán respuestas externas uniformes para reducir enumeración;
- se invalidarán de forma transaccional al consumirse.

No se almacenarán tokens de autenticación en `localStorage`, `sessionStorage`,
IndexedDB ni cachés del service worker.

## Autorización

Cada operación aplicará autorización en el servidor combinando:

1. identidad y estado de cuenta;
2. rol global, cuando corresponda;
3. pertenencia y rol en el grupo familiar;
4. propiedad o alcance explícito del recurso;
5. estado de la operación.

Los identificadores no se considerarán una barrera de acceso. Toda lectura y
mutación filtrará por el alcance autorizado para evitar IDOR.

## Consecuencias

### Positivas

- Revocación inmediata y menor exposición ante XSS que un bearer token legible
  por JavaScript.
- Modelo simple para una aplicación web de primer partido.
- El mismo origen reduce configuración CORS y superficie CSRF.

### Negativas

- Una indisponibilidad o pérdida de Redis cierra o interrumpe sesiones.
- El escalado exige un Redis compartido y una política de durabilidad adecuada.
- Clientes móviles o APIs de terceros necesitarían otra estrategia futura.

## Alternativas descartadas

- **JWT persistido en el navegador:** complica revocación y aumenta el impacto
  de XSS.
- **OAuth en el MVP:** añade proveedores, flujos y tratamiento de datos sin una
  necesidad validada.
- **Cookie sin defensa CSRF adicional:** insuficiente para acciones sensibles.

## Pendiente antes de Fase 2

- Definir tiempos de sesión, política de concurrencia y durabilidad de Redis.
- Validar parámetros de Argon2id y controles de contraseñas.
- Decidir si las acciones de moderación requieren reautenticación reforzada.

