# ADR 0006: outbox transaccional y jobs idempotentes

- Estado: aceptada para el MVP
- Fecha: 2026-07-24
- Responsables: arquitectura y operaciones

## Contexto

El análisis, escaneo, OCR, notificaciones y exportación pueden superar el tiempo
razonable de una petición HTTP o depender de terceros. Guardar un registro en
PostgreSQL y después encolar un job crea una ventana de fallo: la transacción
puede confirmar y el job perderse. BullMQ puede reintentar y, en el peor caso,
entregar más de una vez.

## Decisión

PostgreSQL será la fuente de verdad de cada transición. Cuando una operación
requiera trabajo asíncrono, la misma transacción escribirá:

- el agregado o cambio de estado;
- su `AuditEvent`, cuando sea una acción auditable;
- un evento `OutboxEvent` con identificador, tipo, versión y payload mínimo.

Un dispatcher publicará eventos pendientes en BullMQ. Usará el identificador del
evento como clave estable del job y marcará la publicación de forma recuperable.
Un reconciliador volverá a intentar eventos pendientes o de publicación
incierta.

Los workers asumirán entrega **al menos una vez**:

- cada handler tendrá clave de idempotencia;
- las escrituras finales usarán constraints y transacciones;
- un reintento no duplicará hallazgos, decisiones, evidencias ni notificaciones;
- las llamadas externas no mantendrán abierta una transacción de base de datos;
- los errores transitorios usarán reintentos limitados con backoff y jitter;
- los errores permanentes terminarán en estado fallido visible y revisable;
- los payloads de cola contendrán identificadores, no mensajes ni evidencias.

Los estados del recurso serán consultables por polling en el MVP. WebSockets y
Server-Sent Events quedan fuera hasta medir su necesidad.

La caída de Redis no descartará la intención registrada: la API devolverá un
estado pendiente/degradado y el dispatcher continuará cuando se recupere. Redis
no contendrá la única copia de una decisión, consentimiento o evento de
auditoría.

## Consecuencias

### Positivas

- Evita el doble write no coordinado entre PostgreSQL y Redis.
- Los trabajos son recuperables y trazables.
- API y worker pueden escalar por separado sin crear microservicios.

### Negativas

- Añade tabla, dispatcher, reconciliación y estados intermedios.
- Existe latencia entre el commit y la publicación.
- La idempotencia debe diseñarse por job; BullMQ no la garantiza por el dominio.

## Alternativas descartadas

- **Encolar después del commit sin outbox:** puede perder trabajos.
- **Redis como fuente de verdad:** no cumple durabilidad ni auditoría del
  dominio.
- **Procesar todo dentro de HTTP:** empeora timeouts, reintentos y aislamiento.
- **Transacción distribuida:** no está justificada ni soportada de forma simple.

## Pendiente antes de Fase 2

- Definir esquema de outbox, lock del dispatcher y política de limpieza.
- Fijar colas, timeouts, concurrencia, reintentos y alertas por tipo de job.
- Diseñar pruebas de crash entre commit, publicación y confirmación.

