# ADR 0001: monorepo con monolito modular

- Estado: aceptada para el MVP
- Fecha: 2026-07-24
- Responsables: arquitectura

## Contexto

Lorica necesita una web, una API y procesos asíncronos que comparten dominio,
contratos y persistencia. El equipo y la carga reales todavía son desconocidos.
Separar el sistema en microservicios añadiría despliegues, observabilidad,
consistencia distribuida y una superficie de ataque que no aportan valor al
MVP.

## Decisión

Se usará un monorepo TypeScript administrado con `pnpm workspaces`, inicialmente
sin un orquestador de builds adicional. Contendrá tres procesos desplegables:

- `apps/web`: Next.js, interfaz y PWA;
- `apps/api`: NestJS, API REST y composición de adaptadores;
- `apps/worker`: proceso NestJS sin servidor HTTP para tareas BullMQ.

El backend será un **monolito modular**. Los módulos se separarán por capacidad
de negocio y, dentro de cada uno, dirigirán las dependencias desde
infraestructura hacia aplicación y dominio:

- `packages/backend`: módulos verticales reutilizados por API y worker; sus
  carpetas de dominio no importan frameworks ni infraestructura;
- `packages/database`: esquema Prisma, migraciones y adaptadores de persistencia;
- `packages/api-client`: cliente web generado desde OpenAPI, sin entidades de
  persistencia;
- `packages/config`: configuración compartida y validada;
- `packages/testkit`: builders y datos enteramente ficticios;
- `packages/ui`: solo si aparecen componentes compartidos suficientes para
  justificarlo.

El dominio de `packages/backend` no importará NestJS, Prisma, Redis, S3 ni SDK de
proveedores. `web` no accederá a la base de datos. Las aplicaciones no se
importarán entre sí.

PostgreSQL será la fuente de verdad. Redis se usará para sesiones, colas, caché
y rate limiting, pero una pérdida de Redis no podrá crear una decisión de
dominio inexistente. MinIO implementará localmente el puerto de almacenamiento
compatible con S3.

La web y la API se expondrán bajo un mismo origen. En desarrollo podrán usar
puertos internos distintos, pero un proxy presentará una única procedencia al
navegador.

## Consecuencias

### Positivas

- Un cambio transversal puede probarse y versionarse de forma atómica.
- El dominio permanece extraíble si una capacidad requiere escalar de manera
  independiente más adelante.
- Se reduce la complejidad operativa y de autorización del MVP.
- API y worker pueden escalar como procesos separados sin convertirlos en
  servicios con dominios duplicados.

### Negativas

- Los límites modulares dependen de reglas de imports y revisiones automáticas.
- Un despliegue de API puede contener módulos que no hayan cambiado.
- `pnpm` y los proyectos TypeScript requieren una política uniforme de builds.

## Alternativas descartadas

- **Microservicios desde el inicio:** no existen datos de carga ni equipos
  autónomos que justifiquen su coste.
- **Repositorio por aplicación:** aumenta el riesgo de contratos divergentes y
  dificulta cambios atómicos.
- **Next.js como backend único:** no encaja con NestJS, OpenAPI, workers y los
  límites de dominio solicitados.
- **Turborepo en la primera iteración:** puede añadirse si el tiempo de build lo
  justifica; no se incorpora sin una necesidad medida.

## Pendiente antes de Fase 2

- Confirmar la versión activa de Node.js compatible con las versiones elegidas
  de Next.js, NestJS y Prisma y fijarla en el repositorio.
- Elegir el proxy local y de producción.
- Definir reglas automáticas de límites entre paquetes.
