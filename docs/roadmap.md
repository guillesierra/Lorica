# Roadmap de Lorica

**Estado:** plan de Fase 1  
**Fecha:** 24 de julio de 2026  
**Estrategia:** monolito modular, cortes verticales pequeños y verificables, seguridad y privacidad desde el diseño

## 1. Cómo leer este roadmap

El roadmap diferencia:

- **aceptación de Fase 1**, que es exclusivamente documental;
- **primera iteración técnica (I1)**, una foundation vertical ejecutable;
- **aceptación del MVP completo**, definida en `docs/product-scope.md`; y
- **preparación para producción**, que exige verificaciones adicionales aunque el MVP local ya sea funcional.

No se avanza de fase con pruebas fallidas, contradicciones de diseño abiertas o controles de calidad desactivados. Las tareas se ejecutarán en cambios pequeños; cada cambio debe poder revisarse y revertirse de forma independiente.

## 2. Dependencias y puertas entre fases

```text
Fase 1: diseño aprobado
        ↓
Fase 2: base técnica + I1 vertical
        ↓
Fase 3: flujo principal completo
        ↓
Fase 4: reportes, reputación y expediente
        ↓
Fase 5: endurecimiento y puertas de salida
        ↓
Piloto controlado, solo si legal/seguridad/operación lo autorizan
```

Dependencias críticas:

- la reputación colectiva no se activa con datos reales sin base jurídica, moderación e impugnación definidas;
- las evidencias no se habilitan para usuarios reales sin validación, cuarentena, antimalware y retención;
- ningún proveedor externo se activa sin evaluar datos enviados, contrato, región, caducidad y comportamiento ante fallos;
- los umbrales de scoring no se presentan como calibrados sin un conjunto de evaluación y revisión de contenido;
- no hay despliegue de producción sin pruebas de aislamiento, revisión de permisos, respuesta a incidentes y restauración;
- las versiones de dependencias se eligen en Fase 2 tras verificar compatibilidad y mantenimiento; este roadmap no inventa versiones.

## 3. Fase 1 — Análisis y diseño

### Objetivo

Eliminar ambigüedades de producto y dejar decisiones trazables antes de escribir código.

### Tareas pequeñas y verificables

| ID | Tarea | Verificación |
|---|---|---|
| F1.1 | Inventariar el repositorio y registrar su estado inicial | El documento de alcance distingue hechos observados de supuestos |
| F1.2 | Fijar actores, casos de uso, límites y fuera de alcance | `docs/product-scope.md` cubre cada entrada, salida y rol solicitado |
| F1.3 | Definir arquitectura y estructura de carpetas | `docs/architecture.md` describe web, API, worker, módulos y dependencias |
| F1.4 | Fijar decisiones base: pnpm workspace, monolito modular, same-origin, sesión opaca y análisis determinista primero | Las decisiones aparecen en arquitectura y ADR, sin contradicciones |
| F1.5 | Modelar amenazas y controles | `docs/security-threat-model.md` cubre confianza, activos, amenazas y mitigaciones |
| F1.6 | Diseñar privacidad y RGPD | `docs/privacy-design.md` separa finalidades, bases pendientes, derechos, retención y consentimientos |
| F1.7 | Diseñar entidades y relaciones | `docs/data-model.md` define propiedad, cardinalidad, procedencia y ciclo de vida |
| F1.8 | Diseñar contratos REST y errores | `docs/api-design.md` cubre DTO, autorización, idempotencia, paginación y trabajos asíncronos |
| F1.9 | Registrar decisiones pendientes, riesgos y puertas | Alcance y roadmap asignan fase y condición de cierre |
| F1.10 | Crear ADR para decisiones relevantes | Cada ADR contiene contexto, decisión, alternativas y consecuencias |
| F1.11 | Revisar coherencia transversal | No hay diferencias no resueltas en nombres, permisos, estados o límites |
| F1.12 | Preparar trazabilidad de aceptación | Los criterios del MVP se pueden mapear a fases y pruebas previstas |

### Definition of Done de Fase 1

- Existen los siete documentos solicitados y los ADR necesarios.
- El estado inicial del repositorio está descrito con evidencia observada.
- El MVP y lo que queda fuera están definidos sin depender de supuestos ocultos.
- Actores, permisos, flujo, modelo, API, amenazas y privacidad usan terminología coherente.
- Cada decisión pendiente tiene una fase límite; las bloqueantes para datos reales están señaladas.
- Los riesgos técnicos, legales/de privacidad y de producto tienen mitigación o aceptación explícita.
- La primera iteración técnica y el MVP completo tienen criterios de aceptación distintos.
- Una revisión documental confirma que todavía no se ha iniciado implementación.

### Criterios de aceptación de Fase 1

1. Un revisor puede responder qué datos ve cada actor y en qué condiciones.
2. Un revisor puede identificar qué funcionalidad entra en el MVP y qué se difiere.
3. El flujo principal se puede recorrer desde la entrada hasta aprobación, reporte o expediente.
4. Se explica cómo seguirá funcionando el análisis sin IA ni proveedores externos.
5. Se identifica que un reporte aislado no determina una acusación y se describen invariantes antiabuso.
6. Las decisiones sobre sesión opaca, same-origin y separación web/API/worker son trazables.
7. Se conocen las cuestiones que impiden usar datos reales o abrir producción.
8. Cada fase posterior contiene tareas con una comprobación observable.

## 4. Fase 2 — Base técnica

### Objetivo

Crear una base local reproducible y segura. La primera iteración técnica es un corte vertical dentro de esta fase, no el MVP completo.

### Secuencia de tareas

#### F2.A. Workspace y calidad

| ID | Tarea | Verificación |
|---|---|---|
| F2.1 | Inicializar repositorio y workspace de pnpm | El gestor reconoce todos los paquetes desde la raíz |
| F2.2 | Crear `apps/web`, `apps/api` y `apps/worker` sin lógica de negocio | Cada aplicación compila y expone su punto de arranque |
| F2.3 | Crear `packages/backend`, `database`, `api-client`, `config` y `testkit`; `ui` solo si se justifica | Los módulos tienen propietario, el dominio no importa infraestructura y no hay ciclos |
| F2.4 | Configurar TypeScript estricto, lint y formato | Los tres comandos terminan correctamente sin excepciones globales |
| F2.5 | Añadir pruebas base y cobertura reportable | Una prueba mínima por aplicación se ejecuta en local |
| F2.6 | Añadir CI para instalación bloqueada, lint, tipos y pruebas | El pipeline falla ante una regresión intencional controlada |

#### F2.B. Infraestructura local

| ID | Tarea | Verificación |
|---|---|---|
| F2.7 | Definir Docker Compose para web, API, worker, PostgreSQL, Redis y MinIO | Un único comando documentado inicia todos los servicios |
| F2.8 | Añadir configuración validada y archivo de ejemplo sin secretos | La aplicación rechaza variables ausentes con error útil |
| F2.9 | Implementar health checks diferenciando vida y preparación | Se detecta una dependencia deliberadamente detenida |
| F2.10 | Configurar PostgreSQL y Prisma | La migración inicial se aplica a una base vacía |
| F2.11 | Configurar Redis y una cola BullMQ de prueba | El worker procesa un trabajo idempotente y trazable |
| F2.11a | Crear el esquema outbox y escribir `Analysis QUEUED` + evento en una transacción | Un rollback no deja análisis ni evento parciales |
| F2.11b | Implementar dispatcher y reconciliación de outbox | Un crash simulado entre commit, publicación y confirmación recupera el job sin duplicar efectos |
| F2.11c | Definir limpieza segura y retención configurable de outbox | Solo se purgan eventos publicados/procesados según política; una prueba de reloj evita borrado prematuro |
| F2.12 | Configurar bucket privado en MinIO | Una evidencia sintética solo se obtiene mediante URL temporal |
| F2.13 | Crear seed exclusivamente ficticio | Una comprobación documentada confirma que no contiene datos reales |

#### F2.C. Identidad, autorización y observabilidad

| ID | Tarea | Verificación |
|---|---|---|
| F2.14 | Implementar registro, atestación de elegibilidad de edad e inicio/cierre de sesión opaca | La cookie es `HttpOnly`, segura según entorno; la política de edad queda versionada sin recoger fecha de nacimiento |
| F2.15 | Aplicar política same-origin entre web y API | Una petición desde un origen no permitido es rechazada |
| F2.16 | Implementar revocación, expiración y protección CSRF | Una sesión revocada y una petición CSRF de prueba fallan |
| F2.17 | Crear usuario, grupo y membresía mínima | El propietario puede crear un grupo; otro usuario no puede leerlo |
| F2.18 | Añadir autorización por recurso y evento de auditoría | Las pruebas negativas cubren acceso entre dos familias |
| F2.19 | Añadir correlation ID y logs estructurados con allowlist | La prueba de logs no encuentra contraseña, token ni mensaje completo |
| F2.20 | Exponer métricas técnicas mínimas | Se observan tiempo de solicitud, error y trabajo sin PII |

#### F2.D. Corte vertical determinista

| ID | Tarea | Verificación |
|---|---|---|
| F2.21 | Crear formulario mínimo de texto y contexto | Valida entrada, error, envío y accesibilidad básica |
| F2.22 | Crear contrato de solicitud y resultado de análisis | OpenAPI y cliente comparten estados y errores acordados |
| F2.23 | Implementar extractor mínimo de URL y frases de urgencia | Fixtures sintéticos cubren detección y no detección |
| F2.24 | Implementar dos reglas configurables y versionadas | Cambiar configuración altera el hallazgo sin modificar lógica central |
| F2.25 | Calcular una puntuación determinista inicial con desglose | La misma entrada y versión producen el mismo resultado |
| F2.26 | Mostrar nivel, motivos y limitaciones | La interfaz no usa lenguaje acusatorio ni promete verificación externa |
| F2.27 | Persistir análisis con propietario y versión | Un usuario no puede consultar el análisis del otro |
| F2.28 | Añadir E2E del corte vertical | Registro → grupo → texto → resultado finaliza correctamente |

### Primera iteración técnica (I1)

I1 incluye F2.1–F2.12, F2.14–F2.19, F2.21–F2.28 y las subtareas
F2.11a–F2.11c. Redis, worker y MinIO deben arrancar y tener health checks. El
primer análisis usa outbox y cola y demuestra recuperación e idempotencia; el
pipeline funcional de evidencias y el seed completo pueden completarse después
de I1 mediante F2.13 y las tareas de Fase 3.

#### Criterios de aceptación de I1

1. Desde un checkout limpio, un único comando documentado inicia `web`, `api`, `worker`, PostgreSQL, Redis y MinIO.
2. El workspace de pnpm instala con lockfile y compila las tres aplicaciones.
3. Lint, formato, comprobación de tipos y pruebas finalizan correctamente.
4. Los health checks distinguen un proceso vivo de uno listo y reflejan por
   separado la caída de PostgreSQL, Redis y MinIO según la dependencia de cada
   proceso.
5. Un usuario creado con datos ficticios puede iniciar y cerrar una sesión opaca.
6. La web consume la API bajo same-origin; la sesión no se expone al JavaScript del navegador.
7. El usuario puede crear un grupo familiar mínimo.
8. Puede pegar un mensaje sintético, elegir contexto y solicitar análisis.
9. El análisis determinista se procesa mediante worker, extrae al menos URL y urgencia, ejecuta al menos dos reglas configurables y devuelve un resultado reproducible; repetir el job no duplica hallazgos.
10. La interfaz muestra puntuación, nivel, razones y la limitación de que no se han hecho verificaciones externas.
11. El análisis conserva propietario y versiones de extractor, reglas y scoring.
12. Un segundo usuario no puede consultar el grupo ni el análisis del primero; existen pruebas API negativas.
13. Un E2E recorre registro, grupo, verificación y resultado.
14. Logs y errores inspeccionados no contienen contraseña, cookie de sesión ni mensaje completo.
15. Todas las fixtures son sintéticas; por ejemplo, los dominios usan el TLD reservado `.example`.
16. Un crash simulado después del commit y antes de confirmar la publicación se
    recupera desde outbox sin perder ni duplicar el análisis.
17. MinIO no permite listing o lectura pública y una operación temporal expira
    según la configuración de prueba; todavía no se acepta contenido real.

I1 no incluye invitaciones completas, aprobación, reportes, reputación, expedientes, OCR real, PDF ni moderación.

### Salida de Fase 2

- La base local es reproducible desde cero.
- La sesión, el aislamiento inicial y la telemetría mínima están probados.
- Existe un primer valor observable: análisis determinista explicable de texto.
- La arquitectura permite continuar sin reestructurar hacia microservicios.
- Las dependencias nuevas tienen justificación y licencia revisadas.

## 5. Fase 3 — Flujo principal

### Objetivo

Completar la verificación explicable y la decisión de la red familiar.

### Tareas pequeñas y verificables

| ID | Tarea | Verificación |
|---|---|---|
| F3.1 | Completar normalización de URL y dominio | Casos Unicode, puertos, credenciales embebidas y redirecciones se prueban |
| F3.2 | Añadir extractores de dominio autónomo, correo, teléfono, IBAN, importe, wallet, empresa/marca y señales lingüísticas del catálogo | Corpus sintético cubre dominios sin URL, urgencia, secreto, amenaza, rentabilidad, OTP, software, pago irreversible, límites y falsos positivos |
| F3.3 | Añadir campos explícitos y múltiples URL al formulario | Los valores originales y normalizados permanecen trazables |
| F3.4 | Implementar carga de captura privada | MIME real, tamaño, metadatos y autorización tienen pruebas |
| F3.5 | Añadir interfaz OCR y proveedor simulado | La ausencia de OCR se muestra sin bloquear el análisis |
| F3.6 | Definir esquema versionado de reglas | Cada regla incluye ID, nombre, descripción, peso, categoría, evidencia y recomendación |
| F3.7 | Implementar el catálogo inicial trazado en `product-scope.md` | Cada regla aplicable tiene pruebas positivas, negativas, de frontera y falso positivo; las dependientes de datos ausentes declaran limitación |
| F3.8 | Implementar scoring desacoplado | Invariantes de límites, reproducibilidad y desglose se verifican |
| F3.9 | Ejecutar análisis costosos mediante trabajo idempotente | Reintento no duplica hallazgos y queda trazado |
| F3.10 | Añadir adaptadores externos simulados y respuesta normalizada | Timeout y fallo producen modo degradado explícito |
| F3.11 | Completar pantalla de resultado | Incluye indicadores, coincidencias, acciones seguras y limitaciones |
| F3.12 | Crear invitación temporal y membresías completas | Caducidad, revocación y reutilización tienen pruebas |
| F3.13 | Crear solicitud de aprobación con compartición mínima | El contacto solo ve el recurso compartido |
| F3.14 | Implementar aprobar, rechazar y pedir información | Transiciones inválidas se rechazan |
| F3.15 | Añadir comentarios y auditoría | Actor, fecha y decisión quedan registrados sin PII en logs |
| F3.16 | Completar PWA y revisión de caché | Es instalable y no conserva evidencia ni API autenticada |
| F3.17 | Ejecutar revisión de accesibilidad y confirmaciones del flujo | Teclado, foco, etiquetas, contraste, objetivos táctiles grandes y confirmación de acciones sensibles cumplen `product-scope.md` |
| F3.18 | Añadir E2E de usuario y contacto | Verificación → solicitud → decisión se completa con dos cuentas |

### Salida de Fase 3

- El flujo de prevención funciona de extremo a extremo.
- El resultado es explicable, reproducible y no depende de IA.
- La compartición familiar respeta el mínimo acceso.
- Los casos de falso positivo, entrada hostil y aislamiento están automatizados.

## 6. Fase 4 — Reportes, reputación y expediente

### Objetivo

Añadir memoria colectiva moderada y documentación posterior al incidente sin convertir la plataforma en un registro público de acusaciones.

### Tareas pequeñas y verificables

#### F4.A. Reportes y reputación

| ID | Tarea | Verificación |
|---|---|---|
| F4.1 | Crear reporte con todos los campos obligatorios | DTO, UI y persistencia comparten validaciones |
| F4.2 | Implementar ámbito privado/grupo y consentimiento colectivo como controles separados | Pruebas cubren lectura, valores por defecto y retirada de consentimiento |
| F4.3 | Detectar duplicados exactos/probables y ejecutar fusión lógica | El canónico conserva procedencia, autores, evidencias, consentimiento y auditoría |
| F4.4 | Modelar independencia de aportaciones | Varias cuentas del mismo origen lógico no simulan corroboración |
| F4.5 | Implementar agregación saturada y caducidad | Propiedades anti-linealidad y antigüedad se prueban |
| F4.6 | Integrar reputación en scoring con límite | Mientras no se alcance `k_report`, `R=0`; una sola fuente nunca aporta score colectivo |
| F4.7 | Recalcular de forma trazable tras moderación | El análisis conserva histórico y explica la nueva versión |
| F4.8 | Añadir rate limiting y señales de abuso | Ráfagas y brigading sintético se limitan sin bloquear el uso normal |

#### F4.B. Moderación

| ID | Tarea | Verificación |
|---|---|---|
| F4.9 | Crear acceso interno protegido | Un usuario normal no descubre ni invoca funciones internas |
| F4.10 | Implementar cola y estados de revisión | Solo transiciones válidas están permitidas |
| F4.11 | Implementar fusión de duplicados | No se pierde procedencia ni consentimiento |
| F4.12 | Gestionar reglas y marcas con versiones | Publicar una versión exige motivo y deja auditoría |
| F4.13 | Suspender cuenta abusiva y registrar causa | La suspensión revoca sesiones y admite el proceso definido |
| F4.14 | Mostrar auditoría separada de logs técnicos | El historial es inmutable desde la interfaz ordinaria |

#### F4.C. Expediente y exportación

| ID | Tarea | Verificación |
|---|---|---|
| F4.15 | Crear expediente privado | Solo el propietario y destinatarios autorizados acceden |
| F4.16 | Añadir eventos cronológicos | Orden, zona horaria y edición quedan trazables |
| F4.17 | Añadir importes, operaciones e indicadores | Formatos inválidos se rechazan sin convertir valores |
| F4.18 | Completar almacenamiento de evidencias | URL temporal, cuarentena, borrado y autorización se prueban |
| F4.19 | Generar acciones generales según contexto | Cada recomendación distingue orientación general de consejo legal |
| F4.20 | Crear resumen y PDF | Vista previa, enmascarado y caracteres hostiles se prueban |
| F4.21 | Añadir E2E de reporte y expediente | Reporte → moderación y expediente → PDF funcionan con datos sintéticos |

### Salida de Fase 4

- Los reportes influyen con límites, procedencia y moderación.
- No hay acceso público a evidencia ni acusaciones personales.
- El expediente y PDF separan aportaciones, hallazgos y recomendaciones.
- Los cambios de reputación y moderación son auditables.

## 7. Fase 5 — Endurecimiento y preparación de salida

### Objetivo

Validar que el MVP cumple sus límites de seguridad, privacidad, calidad y operación antes de considerar un piloto.

### Tareas pequeñas y verificables

| ID | Tarea | Verificación |
|---|---|---|
| F5.1 | Revisar permisos recurso por recurso | Matriz de autorización y pruebas negativas completas |
| F5.2 | Probar CSRF, XSS, inyección y enumeración | Suite adversaria reproduce y bloquea cada caso |
| F5.3 | Endurecer análisis de URL contra SSRF | DNS rebinding, rangos privados y redirecciones se prueban en entorno aislado |
| F5.4 | Integrar o simular contractualmente escaneo antimalware | Archivo limpio, sospechoso, timeout y fallo cerrado tienen prueba |
| F5.5 | Verificar política de archivos y EXIF | Tipos falsificados, exceso de tamaño y metadatos se manejan |
| F5.6 | Completar rate limiting por operación sensible | Límites no revelan existencia de cuenta ni facilitan bloqueo dirigido |
| F5.7 | Implementar retención y borrado | Un reloj controlado demuestra caducidad y supresión por clase |
| F5.8 | Completar exportación y derechos | Acceso, rectificación, supresión, portabilidad y oposición siguen el procedimiento aprobado |
| F5.9 | Auditar logs, métricas y trazas | Búsqueda automatizada no encuentra contenido sensible prohibido |
| F5.10 | Preparar OpenTelemetry y alertas | Un fallo sintético conserva correlation ID hasta el worker |
| F5.11 | Probar copias y restauración | Una restauración documentada recupera datos sintéticos coherentes |
| F5.12 | Ejecutar análisis de dependencias y licencias | No quedan vulnerabilidades críticas sin decisión registrada |
| F5.13 | Ejecutar pruebas de carga y abuso | Se documentan límites y degradación sin pérdida de aislamiento |
| F5.14 | Realizar revisión de accesibilidad y contenido | Se corrigen bloqueantes de WCAG 2.2 AA y lenguaje acusatorio |
| F5.15 | Revisar privacidad y evaluación de impacto | Las medidas acordadas están implementadas o bloquean la salida |
| F5.16 | Preparar respuesta a incidentes | Simulación cubre contención, notificación, recuperación y aprendizaje |
| F5.17 | Documentar despliegue, rollback y operación | Un operador distinto puede ejecutar el procedimiento |
| F5.18 | Ejecutar E2E completo del MVP | Todos los criterios de `product-scope.md` tienen evidencia |

### Puertas de salida antes de un piloto con usuarios reales

- Revisión jurídica aprobada para cada finalidad y tipo de dato.
- Política publicada de privacidad, retención, moderación, reclamación y uso aceptable.
- Evaluación de impacto cerrada o decisión documentada de que no aplica.
- Proveedores y transferencias internacionales evaluados.
- Revisión de seguridad independiente sin hallazgos críticos abiertos.
- Restauración, respuesta a incidentes y rotación de secretos ensayadas.
- Scoring y mensajes probados con usuarios; limitaciones comprendidas.
- Capacidad de moderación y atención a derechos demostrada.
- Responsable operativo y criterio de suspensión del piloto identificados.

Superar las pruebas locales sin estas puertas no autoriza un lanzamiento.

## 8. Definition of Done por cambio

Además de la Definition of Done de producto:

1. El cambio tiene un objetivo único y criterios observables.
2. No mezcla refactorizaciones no necesarias con funcionalidad.
3. Las dependencias nuevas incluyen necesidad, alternativas consideradas y licencia.
4. Los nombres técnicos, comentarios y logs están en inglés; la interfaz visible está en español.
5. Todo endpoint nuevo tiene DTO, validación, autorización, errores, OpenAPI y pruebas.
6. Toda entidad nueva define propietario, acceso, retención y auditoría.
7. Toda regla nueva incluye evidencia, recomendación, peso, versión y pruebas de falso positivo.
8. Todo trabajo asíncrono define idempotencia, reintento, timeout y fallo observable.
9. Toda integración externa tiene adaptador, respuesta normalizada, caducidad y doble simulado.
10. Todo TODO indica motivo, propietario o decisión pendiente y fase prevista.
11. Se ejecutan y registran los comandos aplicables de lint, formato, tipos, pruebas y migraciones.
12. La documentación cambia en el mismo incremento cuando cambia un contrato o una decisión.

## 9. Estrategia de verificación

### Pirámide mínima

- **Unidad:** normalizadores, extractores, reglas, scoring, permisos y transiciones de estado.
- **Propiedades:** idempotencia, límites de puntuación, saturación de reportes y normalización estable.
- **Integración:** PostgreSQL, Redis/BullMQ, MinIO, sesión, auditoría y adaptadores simulados.
- **API:** validación, autorización, errores, paginación e idempotencia.
- **E2E:** flujo principal, aprobación con dos usuarios, reporte/moderación y expediente/PDF.
- **Seguridad:** aislamiento, archivos, SSRF, CSRF, XSS, enumeración, rate limiting y exposición en logs.
- **Accesibilidad:** teclado, lector de pantalla, foco, contraste, errores y carga.

### Datos de prueba

- Todos los casos se etiquetan como sintéticos.
- Los dominios de ejemplo usan `.example`.
- Teléfonos, IBAN, personas, comercios y organismos se generan para pruebas, se
  etiquetan como sintéticos y no se copian de registros reales. Cuando un
  proveedor ofrezca datos oficiales de sandbox, se prefieren esos valores.
- El corpus incluye señales verdaderas, entradas neutras, falsos positivos, Unicode, duplicados, brigading y contenido hostil.
- Ningún fixture se copia de una víctima o denuncia real.

## 10. Matriz resumida de trazabilidad

| Capacidad del MVP | Fase principal | Evidencia de aceptación |
|---|---|---|
| Ejecución local | F2 | Arranque limpio y health checks |
| Cuenta y sesión | F2 | Integración de sesión y pruebas de enumeración |
| Grupo familiar | F2–F3 | Permisos e invitación temporal |
| Captura y análisis | F2–F3 | Unidad, API y E2E |
| Reglas y scoring | F2–F3 | Unidad, propiedades y desglose |
| Resultado explicable | F2–F3 | E2E y revisión de contenido |
| Aprobación | F3 | E2E con dos usuarios |
| Reportes y reputación | F4 | Casos de duplicado y abuso |
| Moderación | F4 | Autorización y auditoría |
| Expediente y PDF | F4 | E2E y prueba de contenido hostil |
| Derechos y retención | F5 | Integración con reloj controlado |
| Endurecimiento | F5 | Suite adversaria y revisión independiente |

## 11. Riesgos de planificación

| Riesgo | Señal temprana | Respuesta |
|---|---|---|
| Alcance crece hacia integraciones en tiempo real | Se propone conectar WhatsApp, banca o dispositivo en F2/F3 | Remitir a fuera de alcance y abrir una decisión posterior |
| Se pospone moderación mientras se activa reputación | Reportes afectan score sin cola ni política | Bloquear activación colectiva hasta F4 completa |
| Scoring se acopla a UI o proveedor | Pesos en componentes o salida de un LLM usada directamente | Detener el cambio y volver al módulo de dominio versionado |
| Evidencias se habilitan antes de controles | Se aceptan archivos sin cuarentena o retención | Mantener la función desactivada fuera de fixtures |
| Pruebas dependen de servicios de pago | CI requiere claves externas | Usar adaptadores simulados y contract tests |
| Documentos y código divergen | Contratos o estados no coinciden | Añadir comprobación de trazabilidad al mismo cambio |
| I1 intenta cubrir todo el MVP | Se añaden aprobación, reputación o PDF antes de validar la base | Mantener los límites explícitos de I1 |
| Una revisión legal tarda más que la implementación | Decisiones bloqueantes siguen abiertas al final de F4 | Trabajar solo con datos sintéticos y no abrir piloto |

## 12. Orden recomendado de entrega

1. Cerrar y revisar Fase 1.
2. Entregar I1 como primer corte vertical demostrable.
3. Completar la salida técnica de Fase 2.
4. Ampliar reglas, indicadores y explicaciones antes de añadir reputación.
5. Completar aprobación familiar y aislamiento.
6. Implementar reportes y moderación juntos.
7. Implementar expediente y PDF sobre la base de evidencias ya endurecida.
8. Ejecutar Fase 5 y resolver todas las puertas de salida.

El orden prioriza una señal determinista útil y verificable antes de cualquier IA, base colectiva o integración de pago.
