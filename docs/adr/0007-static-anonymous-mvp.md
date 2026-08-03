# ADR 0007: MVP anónimo y estático para GitHub Pages

## Estado

Aceptada para el MVP el 3 de agosto de 2026.

## Contexto

El primer entregable debe poder publicarse en GitHub Pages, funcionar sin inicio
de sesión y analizar contenido sin exponer mensajes sensibles a terceros. Pages
no ejecuta un backend ni puede custodiar secretos OAuth.

## Decisión

El recorrido anónimo se implementa como aplicación Vite/React estática. El motor
de detección es un paquete TypeScript puro que se ejecuta localmente y la base de
conocimiento se incorpora al artefacto durante el build. No se realizan peticiones
a las URLs analizadas.

La pantalla de cuenta solo habilita Google o Apple si existe `VITE_API_URL`. La
implementación completa de OAuth conservará la decisión del ADR 0002: intercambio
con el proveedor en el backend, sesión opaca en cookie segura y ningún secreto en
el navegador.

## Consecuencias

- El MVP anónimo puede desplegarse sin infraestructura ni datos personales.
- El análisis sigue disponible si la fuente de inteligencia está temporalmente
  caída, usando el último snapshot compilado.
- Historial sincronizado, grupos familiares, reportes privados y OAuth requieren
  desplegar la API descrita en la documentación de arquitectura.
- Una heurística local no sustituye servicios de reputación en tiempo real.

## Alternativas descartadas

- Incluir secretos OAuth en Pages: inseguro y técnicamente inadecuado.
- Exigir cuenta para analizar: contradice el requisito de acceso básico anónimo.
- Enviar todo el texto a un servicio externo: aumenta el riesgo de privacidad.
