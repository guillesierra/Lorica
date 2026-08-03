# Alcance de producto — Lorica MVP

**Estado:** borrador de Fase 1 para revisión  
**Fecha:** 24 de julio de 2026  
**Ámbito:** aplicación web responsive e instalable como PWA, inicialmente en español

## 1. Estado inicial observado

En el momento de iniciar la Fase 1, el directorio de trabajo no contenía archivos ni directorio `.git`. Por tanto:

- no existe código, configuración, infraestructura ni documentación previa que preservar;
- no hay versiones de dependencias verificadas;
- no hay pruebas, migraciones ni decisiones arquitectónicas implementadas;
- cualquier paso de implementación pertenece a la Fase 2 o posterior.

Este documento define el producto; no autoriza uso en producción ni sustituye la revisión jurídica, de seguridad o de accesibilidad.

## 2. Propósito y promesa del producto

Lorica ayuda a una persona y a su red de confianza a **detenerse, revisar señales y verificar por canales seguros antes de realizar una acción de riesgo**. El producto combina reglas deterministas, reputación colectiva moderada, comprobaciones externas desacopladas y explicaciones comprensibles.

Lorica no certifica que una comunicación sea legítima ni determina que una persona o entidad haya cometido un delito. Su salida es una evaluación de señales con alcance y limitaciones explícitos.

### Resultado esperado para el usuario

Ante un contenido sospechoso, el usuario debe poder:

1. aportar el contenido y su contexto;
2. entender qué señales se han detectado;
3. conocer qué acciones conviene evitar de momento;
4. comprobar la identidad del remitente por un canal independiente;
5. pedir una segunda opinión a un contacto de confianza;
6. reportar indicadores con el consentimiento adecuado; y
7. documentar lo ocurrido si ya se produjo una pérdida.

## 3. Definiciones de alcance

Para no confundir hitos, se emplean tres niveles distintos:

- **Fase 1 completada:** documentación de producto, arquitectura, seguridad, privacidad, datos, API, roadmap y decisiones arquitectónicas coherentes entre sí. No incluye código de aplicación.
- **Primera iteración técnica (I1):** base local ejecutable y un corte vertical mínimo de verificación determinista. Sus criterios están en `docs/roadmap.md`; no equivale al MVP completo.
- **MVP completo:** conjunto funcional descrito en las secciones 5 a 10 y en los criterios de aceptación de la sección 18.

El MVP es una versión validable en entorno controlado. La apertura a usuarios reales requiere, además, las puertas de salida legales, de seguridad y operativas indicadas en el roadmap.

## 4. Principios no negociables

1. **Explicabilidad:** toda puntuación debe descomponerse en hallazgos, evidencia, peso o contribución y recomendación.
2. **No acusación:** se describen señales y reportes; no se etiqueta a personas o entidades como delincuentes.
3. **Un reporte no constituye prueba:** una aportación aislada nunca convierte automáticamente un indicador en “fraudulento”.
4. **Privacidad por defecto:** análisis, expedientes y evidencias son privados salvo una acción explícita y autorizada.
5. **Separación de hechos e inferencias:** la interfaz y los datos conservan esa distinción.
6. **Decisión humana:** ni la IA ni la puntuación ejecutan pagos, bloqueos, denuncias o decisiones legales.
7. **Funcionamiento degradado:** la verificación determinista básica debe seguir disponible si fallan integraciones externas.
8. **Datos ficticios en desarrollo:** seeds, capturas, documentos y pruebas no contienen identidades, teléfonos, cuentas o casos reales.
9. **Sin vigilancia:** no se interceptan comunicaciones ni se monitoriza el dispositivo en segundo plano.
10. **Accesibilidad y calma:** las advertencias son claras, accionables y no emplean miedo innecesario ni patrones oscuros.

## 5. Actores y permisos de producto

| Actor | Capacidades dentro del MVP | Límites |
|---|---|---|
| Visitante | Consultar la presentación, limitaciones y avisos de privacidad | No analiza, reporta ni accede a datos |
| Usuario registrado | Gestionar su perfil; crear verificaciones, reportes y expedientes propios; ejercer opciones de privacidad | No accede a otros grupos ni a funciones internas |
| Administrador familiar | Crear un grupo, generar invitaciones temporales, gestionar membresías y compartir solicitudes con el grupo | No puede ver contenido privado de un miembro que no se haya compartido con el grupo |
| Miembro familiar | Crear verificaciones y expedientes; compartirlos de forma explícita; pedir aprobación | No administra miembros salvo que también sea administrador |
| Contacto verificador | Ver únicamente la solicitud y el contexto compartido; aprobar, rechazar o pedir información; comentar | No mueve dinero ni recibe acceso general al historial |
| Moderador interno | Revisar reportes, fusionar duplicados, clasificar evidencia, revisar abuso y suspender cuentas conforme a política | No modifica silenciosamente evidencias ni usa datos para fines ajenos |
| Administrador de reglas | Gestionar reglas y marcas conocidas con trazabilidad | Los cambios quedan versionados y auditados; no alteran resultados históricos sin dejar constancia |
| Sistema/worker | Extraer indicadores, aplicar reglas, calcular riesgo, generar exportaciones y ejecutar comprobaciones permitidas | Solo opera con la identidad técnica y el alcance mínimo necesarios |
| Proveedor externo | Responder a una comprobación mediante un adaptador | No recibe más datos de los necesarios; no es fuente única de una conclusión |

Una persona puede tener más de un rol, pero cada operación se autoriza por recurso y grupo, no solo por el nombre global del rol.

## 6. Casos de uso incluidos

### CU-01. Cuenta y sesión

- Registro con correo y contraseña.
- Atestación de cumplir la política de edad vigente, sin recoger fecha de
  nacimiento en el MVP.
- Contraseña almacenada con Argon2.
- Sesión opaca, segura y revocable mediante cookie protegida.
- Preparación de verificación de correo y recuperación de contraseña; en local, la entrega puede ser simulada.
- Cierre de sesión y revocación de sesiones.
- Protección frente a enumeración de cuentas.

El MVP no incluye OAuth, inicio de sesión social ni passkeys.

### CU-02. Grupo familiar

- Crear un grupo.
- Invitar mediante enlace temporal y de un solo uso.
- Asignar los roles administrador, miembro y contacto verificador.
- Aceptar, revocar o dejar caducar una invitación.
- Abandonar el grupo cuando la política de propiedad lo permita.

### CU-03. Verificación

El usuario autenticado puede:

- pegar un mensaje;
- añadir una o varias URL;
- añadir teléfono, correo e IBAN o cuenta receptora;
- subir una captura;
- seleccionar exactamente uno de estos contextos: banco, familiar, compraventa, alquiler, inversión, soporte técnico, factura, administración pública u otro;
- enviar el contenido a análisis; y
- consultar el resultado y su estado de procesamiento.

La verificación se crea en el espacio personal por defecto. Elegir un grupo
familiar como ámbito es una acción explícita y muestra quién podrá acceder. Una
solicitud a un verificador comparte siempre un snapshot mínimo confirmado, no
todo el historial ni acceso implícito al recurso original.

La captura se admite como evidencia privada. El OCR se integra mediante una abstracción, pero un proveedor OCR real no es requisito del MVP: si no está configurado, la interfaz lo indica y el análisis usa el texto y los indicadores introducidos por el usuario. La captura no se interpreta silenciosamente.

### CU-04. Resultado explicable

El resultado muestra:

- puntuación entera de 0 a 100;
- nivel de riesgo;
- reglas activadas y motivos concretos;
- indicadores extraídos o aportados;
- coincidencias agregadas con reportes anteriores;
- calidad y procedencia de las señales disponibles;
- acciones que conviene no realizar todavía;
- pasos de verificación por un canal independiente; y
- limitaciones del análisis.

La correspondencia inicial, configurable y versionada, es:

| Puntuación | Nivel |
|---:|---|
| 0–24 | Bajo |
| 25–49 | Medio |
| 50–74 | Alto |
| 75–100 | Crítico |

Estos intervalos no son probabilidades. Deben validarse antes de producción y cada resultado conserva la versión de reglas y de scoring utilizada.

### CU-05. Aprobación por un contacto de confianza

- Crear una solicitud vinculada a una verificación.
- Compartir solo los datos seleccionados y necesarios.
- Permitir al contacto aprobar, rechazar o solicitar más información.
- Añadir comentarios.
- Registrar actor, decisión, fecha y cambios en auditoría.
- Mostrar que una aprobación es una opinión humana y no una garantía.

Lorica no inicia ni autoriza la operación financiera objeto de la consulta.

### CU-06. Reporte colectivo

Un usuario autenticado puede reportar un teléfono, dominio, URL, correo, IBAN, comercio, anuncio o perfil de vendedor. El reporte incluye:

- categoría;
- descripción;
- fecha aproximada;
- evidencias;
- estado del importe (`KNOWN`, `UNKNOWN` o `NOT_APPLICABLE`) y, cuando sea
  conocido, importe solicitado y/o perdido con moneda;
- canal;
- país;
- estado de revisión;
- visibilidad; y
- consentimiento separado para uso agregado o pseudonimizado.

Las opciones de ámbito del reporte y contribución son controles separados:

- **Privado:** visible solo para el autor y moderadores autorizados cuando exista una causa de revisión.
- **Grupo:** visible para miembros autorizados del grupo elegido.
- **Contribución colectiva:** consentimiento independiente y desactivado por defecto; solo las señales necesarias y pseudonimizadas pueden alimentar reputación cuando sean elegibles. No hace pública la evidencia ni la identidad del reportante y no cambia por sí sola la visibilidad del reporte bruto.

No existe un buscador público de acusaciones ni se publica una ficha personal del titular de un indicador.

### CU-07. Reputación resistente a abuso

La reputación puede usar reportes solo bajo estas invariantes:

- una única aportación no clasifica por sí sola un indicador como fraude;
- duplicados y aportaciones del mismo origen lógico no cuentan como corroboraciones independientes;
- la contribución se satura y no crece linealmente sin límite;
- antigüedad, estado de revisión, calidad de evidencia e independencia afectan a la confianza;
- señales de brigading o automatización reducen o congelan su impacto;
- un reporte aislado o aún no elegible no aporta puntuación colectiva; el autor puede seguir viéndolo como antecedente privado;
- la interfaz distingue “existen reportes asociados” de “se ha verificado externamente”; y
- las decisiones de moderación y los cambios de reputación relevantes quedan auditados.

La fórmula, pesos y umbrales concretos pertenecen al diseño del scoring y deben probarse con fixtures sintéticos, incluidos falsos positivos y abuso coordinado.

### CU-08. Expediente posterior al incidente

- Crear un expediente privado.
- Añadir mensajes, capturas, documentos, teléfonos, cuentas y enlaces.
- Registrar eventos en una cronología.
- Registrar importes y operaciones aportados por el usuario.
- Generar una lista de acciones generales.
- Descargar un resumen y exportar un PDF.

El PDF identifica datos aportados por el usuario, hallazgos del sistema y limitaciones. No se presenta como denuncia oficial ni como asesoramiento jurídico, y el MVP no lo remite automáticamente a bancos, aseguradoras o autoridades.

### CU-09. Moderación y administración interna

- Revisar reportes y evidencia accesible conforme a permisos.
- Marcar un reporte como pendiente, verificado, rechazado o sin evidencia suficiente.
- Fusionar duplicados sin perder procedencia.
- detectar señales de abuso;
- revisar indicadores de alto impacto;
- gestionar reglas y marcas conocidas;
- consultar auditoría; y
- suspender cuentas abusivas con motivo registrado.

El panel es privado, exige autorización reforzada y no admite acciones de moderación anónimas.

### CU-10. Privacidad y control de datos

- Consultar y cambiar consentimientos.
- Exportar datos propios.
- Solicitar rectificación o supresión.
- Eliminar la cuenta siguiendo la política aplicable.
- Distinguir datos privados de contribuciones agregadas.

Los plazos concretos de retención y las excepciones justificadas deben aprobarse antes de usar datos reales.

## 7. Flujo principal del MVP

1. El visitante consulta el propósito y las limitaciones; se registra o inicia sesión.
2. El usuario elige **“Comprueba un mensaje antes de actuar”**.
3. Introduce texto y/o indicadores, adjunta opcionalmente una captura y elige el contexto.
4. La aplicación valida formatos, tamaño y consentimiento; nunca pide abrir el enlace sospechoso.
5. El sistema normaliza y extrae indicadores conservando el valor original de forma protegida.
6. El motor ejecuta reglas configurables y consulta reputación e integraciones disponibles.
7. El scoring combina las señales conforme a una versión registrada y produce hallazgos trazables.
8. La interfaz muestra nivel, puntuación, motivos, evidencias, acciones que evitar, pasos seguros y limitaciones.
9. El usuario puede pedir una opinión familiar, compartiendo explícitamente solo el contenido necesario.
10. Tras la decisión, el usuario puede cerrar la consulta, aportar un reporte o crear un expediente si ya hubo una pérdida.
11. Cada acción sensible queda registrada en auditoría sin copiar contenido confidencial a logs técnicos.

Los pasos 9 y 10 son opcionales; un fallo de una integración externa no impide obtener el análisis determinista básico.

## 8. Entradas, salidas y tratamiento exacto

### Entradas

- Texto en español en la primera versión; otros idiomas pueden conservarse, pero no se promete la misma cobertura de reglas.
- URL, dominio, correo, teléfono, IBAN, importe y, cuando sea posible de forma determinista, wallet.
- Capturas en los formatos y tamaños permitidos por la política de archivos.
- Documentos y evidencias solo en el expediente y bajo la política de tipos permitidos.

### Salidas

- Hallazgos verificables y fragmentos mínimos que los originaron.
- Inferencias claramente marcadas y con confianza cuando procedan de un analizador opcional.
- Respuesta externa normalizada con fuente, fecha, confianza, caducidad y versión del adaptador.
- Recomendaciones generales, no instrucciones jurídicas personalizadas.

### Lenguaje permitido

Ejemplos de formulación:

- “Indicador de riesgo”.
- “Existen reportes asociados”.
- “No se ha podido verificar”.
- “Hay señales compatibles con un posible fraude”.
- “La información disponible no permite confirmar la identidad”.

Se evita “es una estafa”, “es un delincuente” o cualquier acusación categórica.

### 8.1 Objetivos de extracción del MVP

El analizador determinista debe intentar extraer o señalar, con procedencia y
confianza:

| Clase | Objetivos |
|---|---|
| Indicadores estructurados | URL, dominio, correo, teléfono, IBAN, importe y wallet cuando la red/formato sea inequívoco |
| Entidades mencionadas | Nombres de empresas, organismos y marcas; una coincidencia con `KnownBrand` es un hecho léxico, no prueba de identidad |
| Presión y manipulación | Urgencia, secreto, amenazas y presión temporal |
| Credenciales | Petición de contraseña, PIN, código OTP u otro código de autenticación |
| Acción técnica | Petición de instalar software, permitir control remoto o desactivar una protección |
| Pago/inversión | Promesa de rentabilidad y petición de criptomoneda, tarjeta regalo, transferencia urgente u otro método difícil de recuperar |

Cada extracción conserva el fragmento mínimo y separa hecho de inferencia. La
ausencia de una detección no demuestra seguridad. Nombres ambiguos, teléfonos sin
país y wallets sin red se marcan con confianza limitada o no se normalizan.

### 8.2 Catálogo inicial de reglas configurables

Los pesos siguientes son una **línea base no calibrada** de la política inicial.
Se versionan, se someten a caps por familia y no se suman sin control. Cada
ejecución de regla debe producir ID/versión, nombre, descripción, peso efectivo,
categoría, evidencia exacta y recomendación.

| ID técnico | Nombre visible | Categoría | Peso base | Evidencia necesaria | Recomendación asociada |
|---|---|---|---:|---|---|
| `URL_IP_LITERAL` | Enlace con dirección IP | Engaño de enlace | 14 | Host de URL es una IP permitida por parser, no texto parecido | No abrir; verificar la dirección oficial por canal independiente |
| `URL_SHORTENER` | Enlace acortado | Engaño de enlace | 8 | Dominio en catálogo versionado de acortadores | No seguirlo; pedir la URL y origen verificables |
| `DOMAIN_BRAND_LOOKALIKE` | Dominio parecido a una marca | Suplantación | 22 | Distancia/confusables frente a alias curado, con explicación | Escribir manualmente la web oficial o usar la app conocida |
| `SUSPICIOUS_UNICODE` | Caracteres visualmente confusos | Engaño de enlace | 16 | Code points/confusables concretos en host o nombre | No copiar el enlace; comprobar dominio ASCII/IDNA mostrado |
| `NEW_DOMAIN` | Dominio de registro reciente | Reputación externa | 12 | RDAP vigente y fecha disponible | No actuar solo con ese dominio; verificar antigüedad e identidad |
| `DISPLAYED_TARGET_MISMATCH` | Destino mostrado distinto del real | Engaño de enlace | 24 | Texto/metadata estructurada contiene ambos destinos | No pulsar; usar un canal oficial conocido |
| `CREDENTIAL_OR_OTP_REQUEST` | Solicitud de credencial o código | Credenciales | 26 | Fragmento que pide contraseña, PIN u OTP | No compartir ningún código; contactar a la entidad |
| `TIME_PRESSURE` | Presión temporal | Ingeniería social | 10 | Frase de urgencia localizada | Detenerse y verificar sin responder a la presión |
| `SECRECY_REQUEST` | Petición de secreto | Ingeniería social | 14 | Fragmento que pide ocultar la operación | Consultar con un contacto o entidad por otro canal |
| `THREAT_LANGUAGE` | Amenaza o consecuencia inmediata | Ingeniería social | 12 | Amenaza concreta extraída | No actuar bajo amenaza; verificar con el organismo real |
| `UNEXPECTED_ACCOUNT_CHANGE` | Cambio inesperado de cuenta | Pago | 20 | Mensaje indica nueva cuenta/IBAN y el contexto lo marca inesperado | Confirmar el cambio usando un contacto previamente conocido |
| `IRREVERSIBLE_PAYMENT_METHOD` | Pago difícil de recuperar | Pago | 20 | Cripto, tarjeta regalo o transferencia urgente solicitada | No pagar hasta verificar identidad y protección de compra |
| `REPUTATION_CORROBORATION` | Coincidencias colectivas elegibles | Reputación | hasta 25 (`R`) | Teléfono, IBAN u otro indicador cumple `k_report` y política antiabuso | Revisar coincidencias y verificar por canal independiente |
| `FAMILY_UNKNOWN_NUMBER` | Familiar desde número desconocido | Suplantación | 16 | Contexto familiar, número no conocido y petición de acción | Llamar al número habitual del familiar |
| `PRICE_ANOMALY` | Precio anormalmente bajo | Contexto comercial | 12 | Referencia lícita/comparable disponible; no solo intuición | Comparar fuentes y no adelantar pagos |
| `OFF_PLATFORM_PAYMENT` | Evita la protección de la plataforma | Contexto comercial | 16 | Petición explícita de salir o pagar fuera | Mantener conversación y pago en la plataforma protegida |
| `SOFTWARE_INSTALL_REQUEST` | Petición de instalar o dar control | Soporte técnico | 22 | Fragmento de instalación/control remoto | No instalar ni conceder acceso; usar soporte oficial |
| `RETURN_PROMISE` | Promesa de rentabilidad | Inversión | 14 | Promesa concreta de retorno o garantía | Verificar autorización y no transferir por urgencia |

Reglas dependientes de datos no disponibles no se activan: `NEW_DOMAIN` requiere
RDAP, `PRICE_ANOMALY` una referencia válida,
`DISPLAYED_TARGET_MISMATCH` ambos destinos y `FAMILY_UNKNOWN_NUMBER` el contexto
aportado. La falta de esos datos aparece como limitación, no como señal de bajo
riesgo. `REPUTATION_CORROBORATION` consume el componente `R` y no duplica puntos
en `D`.

### 8.3 Requisitos verificables de experiencia

- La CTA principal es “Comprueba un mensaje antes de actuar”.
- Acciones primarias y destructivas usan objetivos táctiles de al menos
  44 × 44 CSS px salvo excepción documentada, con foco visible y uso por teclado.
- Carga, vacío, éxito parcial, dependencia no disponible y error recuperable
  tienen textos en español y siguiente paso.
- Antes de compartir un snapshot, enviar un reporte a moderación/contribución,
  emitir una decisión terminal de aprobación, descargar un original, exportar
  datos o borrar/cerrar una cuenta se muestra una confirmación que resume
  alcance, destinatarios y efecto.
- Fusión o reversión de reportes, publicación o retirada de reglas, suspensión o
  rehabilitación de cuentas y otras acciones internas de alto impacto requieren
  confirmación explícita, motivo y, cuando la política lo exija, reautenticación
  o doble control.
- Una confirmación no usa casillas premarcadas, urgencia artificial ni culpa.
- Riesgo bajo sigue mostrando limitaciones y pasos de verificación segura.

## 9. Alcance técnico funcional

El MVP contempla:

- monorepo modular con workspace de pnpm;
- aplicaciones separadas `web`, `api` y `worker`;
- Next.js, React y TypeScript para la web;
- NestJS y API REST documentada con OpenAPI;
- PostgreSQL y Prisma;
- Redis y BullMQ para trabajos, caché y límites donde aporten valor;
- almacenamiento compatible con S3 y MinIO en local;
- despliegue web/API con política same-origin;
- sesiones opacas, no tokens de acceso expuestos al JavaScript del navegador;
- PWA instalable, con análisis dependiente de conexión y sin cachear evidencia privada;
- reglas y scoring independientes de la interfaz y de proveedores;
- adaptadores para comprobaciones externas, con implementaciones simuladas cuando requieran claves o contratos; y
- logging estructurado, correlation ID, health checks, métricas básicas y preparación para OpenTelemetry.

Las versiones de paquetes no se fijan en Fase 1 sin comprobar compatibilidad, mantenimiento y alertas conocidas.

## 10. Fuera de alcance

Queda expresamente fuera del MVP:

- mover dinero, iniciar transferencias o conectarse a cuentas bancarias;
- aprobar una operación dentro del banco o custodiar credenciales financieras;
- integración automática con llamadas, SMS, WhatsApp, correo, banca o el sistema operativo;
- interceptación, grabación o monitorización oculta;
- extensiones de navegador, aplicación móvil nativa o bloqueo en tiempo real;
- funcionamiento completo sin conexión;
- garantía de legitimidad o detección infalible;
- publicación de datos personales, listados públicos de presuntos autores o buscadores públicos de IBAN/teléfonos;
- reconocimiento facial, identificación biométrica o investigación de identidad;
- scraping indiscriminado, vigilancia de redes sociales o acceso a fuentes no autorizado;
- denuncia, reclamación o contacto automático con un tercero;
- asesoramiento jurídico, financiero o policial personalizado;
- decisión final de riesgo producida directamente por un LLM;
- entrenamiento de modelos con evidencias privadas;
- integraciones de pago obligatorias para superar la aceptación local;
- soporte multilingüe validado, operación multinacional o reglas legales por país;
- uso por menores en la primera versión;
- OAuth, passkeys o inicio de sesión social;
- arquitectura de microservicios;
- análisis avanzado de campañas mediante grafos; y
- disponibilidad, soporte o SLA de producción.

## 11. Datos y visibilidad

| Dato | Visibilidad por defecto | Uso colectivo |
|---|---|---|
| Verificación y resultado | Autor | Grupo solo si se elige expresamente ese ámbito; el verificador recibe un snapshot concreto |
| Comentario de aprobación | Participantes de la solicitud | No |
| Evidencia | Autor; destinatarios expresamente autorizados | No se publica; su uso en moderación requiere permiso y finalidad |
| Expediente | Autor | No |
| Reporte | Privado | Solo con consentimiento separado |
| Indicador normalizado | Restringido | Puede contribuir de forma pseudonimizada y agregada |
| Auditoría | Titular autorizado y personal interno con necesidad | No |
| Log técnico | Operación autorizada | Nunca contiene mensajes completos, tokens, IBAN completos o evidencias |

El borrado, la agregación irreversible y las posibles obligaciones de conservación no deben confundirse. La política final debe documentar qué ocurre al retirar el consentimiento o eliminar una cuenta.

## 12. Supuestos de trabajo

1. La primera audiencia son personas adultas en España o bajo un marco operativo de la UE.
2. La interfaz inicial y las reglas de lenguaje se validan en español.
3. La aplicación proporciona apoyo preventivo y documental, no atención de emergencias.
4. El usuario tiene derecho a aportar el contenido y recibe avisos para minimizar datos de terceros.
5. Las invitaciones pueden compartirse manualmente en local; un proveedor real de correo no es requisito de aceptación.
6. Los proveedores externos pueden no estar disponibles y sus resultados tienen caducidad.
7. El almacenamiento local de desarrollo contiene exclusivamente datos sintéticos.
8. No se abre el servicio a usuarios reales hasta resolver las decisiones legales y operativas bloqueantes.
9. La puntuación inicial necesita calibración; no representa una probabilidad estadística.
10. Un contacto de confianza toma una decisión informada, pero no sustituye una verificación directa con la entidad por un canal independiente.

## 13. Decisiones pendientes

### Bloqueantes antes de iniciar datos reales

- Responsable del tratamiento, encargados y distribución contractual de responsabilidades.
- Base jurídica por finalidad: cuenta, análisis privado, grupo, moderación y reputación colectiva.
- Necesidad y alcance de una evaluación de impacto de protección de datos.
- Política de retención por clase de dato, copia de seguridad, litigio y retirada del consentimiento.
- Países de operación, transferencias internacionales y ubicación de proveedores.
- Procedimiento de rectificación, impugnación y recurso para indicadores que puedan afectar a terceros.
- Edad mínima, mecanismo para declararla y tratamiento de contenido relativo a menores.

### Bloqueantes antes de activar reputación colectiva

- Definición operativa de “clúster de fuente independiente” sin seguimiento
  invasivo, incluida la pertenencia de una cuenta a varios grupos.
- Umbrales de moderación, evidencia mínima y caducidad de reportes.
- Política ante brigading, conflictos de interés y falsos reportes.
- Datos exactos que pueden mostrarse como coincidencia y grado de enmascarado.
- Proceso de corrección y recálculo de análisis cuando un reporte se rechaza.

### Bloqueantes antes de producción

- Proveedores de correo, OCR, reputación, DNS/RDAP, malware y almacenamiento.
- Tipos MIME, límites de tamaño, cuarentena y plazo de descarga de evidencias.
- TTL de sesiones e invitaciones, política de dispositivos y autenticación reforzada de moderadores.
- Calibración de pesos, intervalos de riesgo y mensajes con usuarios representativos.
- Objetivos operativos, copias de seguridad, recuperación, alertas y respuesta a incidentes.
- Canal y plazo de moderación, reclamaciones y solicitudes de derechos.

### Decisiones que pueden validarse durante la implementación

- Si ofrecer un análisis anónimo sin persistencia en una versión posterior.
- Qué comprobaciones externas aportan valor suficiente frente a coste y datos compartidos.
- Si una notificación requiere correo real o basta el centro interno durante el piloto.
- Formato final del PDF y campos que deben enmascararse por defecto.

## 14. Riesgos y respuesta prevista

### Técnicos

| Riesgo | Impacto | Respuesta de diseño |
|---|---|---|
| SSRF al inspeccionar URL | Acceso a red interna o metadatos | Normalización estricta, resolución controlada, bloqueo de rangos privados, límites de redirección y adaptador aislado |
| Archivo malicioso o “bomba” de procesamiento | Compromiso o denegación de servicio | Lista permitida, MIME real, límites, cuarentena, interfaz antimalware y procesamiento asíncrono aislado |
| Fuga entre familias | Exposición de información sensible | Autorización por recurso, pruebas negativas de aislamiento y claves no enumerables |
| Normalización incorrecta | Colisiones, falsos positivos o evasión | Conservar original y normalizado, algoritmos versionados y corpus de pruebas |
| Scoring inestable | Falsa confianza o alarma | Invariantes, límites de contribución, versionado, fixtures adversarios y calibración |
| Dependencia externa no fiable | Bloqueo o señal errónea | Timeouts, circuit breaker, caché con caducidad, confianza por fuente y modo degradado |
| Inyección en PDF o interfaz | XSS, contenido engañoso o corrupción | Escape por contexto, sanitización, renderizado controlado y pruebas con entradas hostiles |
| Caché PWA de datos sensibles | Persistencia en dispositivo compartido | No cachear respuestas autenticadas ni evidencias; limpiar estado al cerrar sesión |
| Logs o telemetría con PII | Brecha indirecta | Allowlist de campos, redacción, pruebas de logging y auditoría separada |

### Legales y de privacidad

| Riesgo | Impacto | Respuesta de diseño |
|---|---|---|
| Acusaciones relativas a una persona | Daño reputacional y posible tratamiento de datos sobre infracciones | Lenguaje no categórico, acceso restringido, moderación, derecho de impugnación y revisión jurídica |
| Datos de terceros sin base suficiente | Incumplimiento de minimización o finalidad | Avisos, campos mínimos, enmascarado, consentimiento separado y política por finalidad |
| Conservación excesiva de evidencias | Mayor daño ante una brecha | Plazos por categoría, borrado verificable y retención configurable |
| Proveedor fuera del EEE | Transferencia internacional no evaluada | Inventario, evaluación contractual y regionalización antes de activarlo |
| Mezcla de datos privados y reputación | Uso secundario inesperado | Almacenes lógicos separados, consentimiento explícito y trazabilidad de procedencia |
| Exportación que expone datos innecesarios | Difusión accidental | Vista previa, enmascarado por defecto y advertencia antes de descargar |

La evaluación jurídica final corresponde a profesionales cualificados y a la entidad responsable del producto.

### De producto

| Riesgo | Impacto | Respuesta de diseño |
|---|---|---|
| Falso negativo | El usuario actúa confiado | Mostrar limitaciones y pasos de verificación incluso con riesgo bajo |
| Falso positivo | Se bloquea una operación legítima o se daña reputación | Motivos revisables, lenguaje prudente, impugnación y no publicación |
| Efecto “número mágico” | Sobreconfianza en 0–100 | Explicar que no es probabilidad y priorizar motivos y acciones |
| Base colectiva vacía | Poco valor inicial | Reglas deterministas útiles y fuentes externas desacopladas |
| Brigading | Manipulación del resultado | Independencia, saturación, moderación y detección de anomalías |
| Fricción de registro | Abandono antes de verificar | Medir el embudo; mantener formulario corto; evaluar modo invitado después |
| Sobrecarga del moderador | Reportes sin atender | Colas priorizadas, estados claros, límites y métricas operativas |
| Aprobación familiar como garantía | Decisión insegura compartida | Recordatorio de verificación independiente y limitación explícita |
| Lenguaje alarmista o inaccesible | Ansiedad y exclusión | Pruebas con usuarios, WCAG 2.2 AA como objetivo y contenido revisado |

## 15. Métricas de validación

Durante pruebas controladas se medirán, sin registrar contenido sensible:

- porcentaje de verificaciones que completan el flujo;
- tiempo hasta comprender la acción recomendada;
- porcentaje de usuarios que identifica correctamente el motivo principal;
- tasa de análisis que terminan en aprobación, reporte o expediente;
- falsos positivos y falsos negativos sobre un conjunto sintético etiquetado;
- reportes duplicados, rechazados y pendientes;
- tiempo de moderación;
- fallos y tiempo de análisis por etapa; y
- incidentes de autorización, que deben ser cero.

No se usará el aumento del número de reportes como métrica de éxito aislada.

## 16. Definition of Done común

Una tarea funcional solo se considera terminada cuando:

- tiene criterios de aceptación trazables y revisados;
- conserva los límites de este documento y no añade tratamiento de datos implícito;
- incluye validación, autorización y manejo de errores;
- incorpora pruebas proporcionales: unidad, integración y/o extremo a extremo;
- contempla al menos un caso adverso y un falso positivo relevante;
- usa fixtures inequívocamente ficticios;
- no registra secretos ni contenido sensible;
- actualiza OpenAPI, modelo, amenaza, privacidad y ADR cuando corresponda;
- cumple lint, formato, tipos y pruebas sin desactivar controles;
- presenta estados de carga, vacío y error útiles;
- cumple la revisión de accesibilidad aplicable;
- deja auditoría para las acciones sensibles;
- documenta cualquier limitación restante con motivo, propietario y fase; y
- ha sido verificada en el entorno local documentado.

## 17. Trazabilidad de documentación

Este alcance debe leerse junto con:

- `docs/architecture.md`;
- `docs/security-threat-model.md`;
- `docs/privacy-design.md`;
- `docs/data-model.md`;
- `docs/api-design.md`;
- `docs/roadmap.md`; y
- los ADR de decisiones arquitectónicas relevantes.

Si otro documento contradice los límites funcionales o de datos de este archivo, la contradicción debe resolverse de forma explícita antes de implementar.

## 18. Criterios de aceptación del MVP completo

El MVP completo se acepta únicamente cuando, en un entorno local limpio:

1. Un único comando documentado inicia web, API, worker, PostgreSQL, Redis y MinIO, y todos los health checks esperados resultan correctos.
2. Un usuario puede registrarse, iniciar y cerrar una sesión opaca, y no puede enumerar cuentas mediante las respuestas de autenticación.
3. Puede crear un grupo familiar, invitar mediante enlace temporal y aplicar los tres roles previstos.
4. Puede introducir texto, múltiples enlaces, teléfono, correo, IBAN, contexto y una captura conforme a la política de archivos.
5. El sistema extrae y normaliza indicadores con trazabilidad al contenido original.
6. Ejecuta reglas configurables y versionadas, sin depender de un LLM.
7. Produce puntuación, nivel, motivos, evidencia, acciones que evitar, pasos seguros y limitaciones.
8. Un fallo simulado de proveedores externos no impide obtener el resultado determinista y se comunica como limitación.
9. El usuario puede solicitar opinión a un contacto; este puede aprobar, rechazar o pedir información y comentar.
10. La decisión y los cambios relevantes quedan en auditoría con actor y fecha.
11. Puede registrarse un reporte con los campos, visibilidad y consentimiento definidos.
12. Duplicados y reportes coordinados no se contabilizan como corroboraciones independientes, y una única aportación no determina por sí sola una acusación.
13. Un moderador autorizado puede revisar, clasificar y fusionar reportes; cada acción queda auditada.
14. Puede crearse un expediente, añadir eventos y evidencias, y exportar un PDF claramente etiquetado.
15. El usuario puede consultar consentimientos, exportar datos y ejercer el flujo de supresión definido.
16. Una familia no puede acceder, por UI ni API, a verificaciones, solicitudes, evidencias o expedientes de otra.
17. Las subidas hostiles, entradas malformadas, intentos de SSRF y contenido inyectable tienen pruebas automatizadas.
18. Existen pruebas unitarias del motor de reglas, scoring y normalizadores; pruebas de API e integración; y un E2E del flujo principal.
19. La PWA es instalable, pero no cachea respuestas autenticadas ni evidencia privada.
20. Logs, métricas y trazas verificadas no contienen mensajes completos, credenciales, tokens, IBAN completos ni evidencia.
21. La documentación explica limitaciones, operación local, datos ficticios, seguridad, privacidad y decisiones aún no aptas para producción.
22. Lint, formato, comprobación de tipos, migraciones y todas las pruebas documentadas finalizan correctamente.

La aceptación local del MVP no autoriza producción. Para ello deben cerrarse también las puertas de salida de Fase 5 indicadas en `docs/roadmap.md`.
