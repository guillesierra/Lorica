# Diseño de privacidad y RGPD

**Producto:** Lorica  
**Fase:** 1 — análisis y diseño  
**Estado:** borrador sujeto a validación jurídica  
**Fecha:** 24 de julio de 2026  
**Ámbito jurídico inicial supuesto:** España y Espacio Económico Europeo  

> Este documento es una propuesta técnica y de producto, no asesoramiento jurídico. Los roles, bases jurídicas, textos informativos, plazos, edades, transferencias, excepciones a derechos y obligaciones regulatorias requieren validación por asesoría especializada antes de tratar datos reales.

## 1. Objetivo

Lorica tratará contenido que puede revelar identidad, relaciones familiares, intentos de fraude, credenciales, cuentas receptoras e importes. La privacidad no se limita a un aviso legal: condiciona los datos que se recogen, sus valores por defecto, quién puede verlos, cuánto tiempo permanecen, qué se comparte con proveedores y cómo se forma la reputación colectiva.

Este diseño aplica los principios de:

- licitud, lealtad y transparencia;
- limitación de finalidad;
- minimización;
- exactitud;
- limitación del plazo de conservación;
- integridad y confidencialidad;
- responsabilidad proactiva;
- protección de datos desde el diseño y por defecto.

El Comité Europeo de Protección de Datos describe la protección por diseño y por defecto como una obligación continua que debe incorporarse antes y durante el tratamiento, con valores iniciales que limiten cantidad, alcance, conservación y acceso a lo necesario ([EDPB, Guidelines 4/2019](https://www.edpb.europa.eu/documents/guideline/guidelines-42019-on-article-25-data-protection-by-design-and-by-default_en)).

## 2. Alcance, hechos y supuestos

### 2.1 Hechos definidos para el MVP

- No mueve dinero ni se conecta a cuentas bancarias.
- No intercepta mensajes, llamadas o comunicaciones.
- El usuario introduce voluntariamente texto, indicadores y evidencias.
- Los reportes brutos y sus evidencias son privados.
- La reputación colectiva usa señales agregadas y limitadas.
- No existe publicación pública de personas, reportantes ni evidencias.
- Las respuestas sensibles no se cachean offline en la PWA.
- La IA no toma por sí sola decisiones con efectos jurídicos ni genera la puntuación final.

### 2.2 Supuestos que necesitan confirmación

- La entidad operadora de Lorica se establecerá en España.
- El MVP se limitará a personas adultas.
- Infraestructura principal y backups estarán en el EEE.
- Los proveedores actuarán según instrucciones documentadas y no usarán el contenido para sus propios fines.
- No habrá publicidad comportamental ni venta de datos.
- No se reutilizarán mensajes, capturas o reportes para entrenar modelos.

Si un supuesto cambia, deberán revisarse este diseño, el Registro de Actividades de Tratamiento (RAT/ROPA), los contratos, la información al usuario y la necesidad de una EIPD.

## 3. Roles de protección de datos

Esta asignación es **provisional y pendiente de validación jurídica**.

| Participante | Rol propuesto | Motivo y límites |
|---|---|---|
| Entidad operadora de Lorica | Responsable del tratamiento | Determinaría fines y medios del servicio, seguridad, scoring, moderación y reputación |
| Hosting, almacenamiento, correo transaccional, observabilidad, OCR o LLM bajo instrucciones | Encargados o subencargados | Solo si contrato, configuración y práctica confirman que actúan bajo instrucciones |
| Proveedor de reputación o fuente que reutiliza datos para fines propios | Posible responsable independiente | Debe evaluarse proveedor por proveedor; no asumir que es encargado |
| Usuario que aporta datos de terceros en un ámbito puramente personal | Situación por validar | La excepción doméstica y las obligaciones de Lorica no deben darse por supuestas |
| Empresa u organización que use Lorica para su actividad | Posible responsable distinto y Lorica como encargado, o corresponsabilidad | Fuera del MVP de consumo; requiere contrato y análisis específico |
| Moderadores y personal de soporte | Personas autorizadas del rol de la entidad | Acceso mínimo, formación, confidencialidad y auditoría |

Antes del piloto se debe:

1. identificar la entidad jurídica y el establecimiento principal;
2. documentar cada actividad de tratamiento;
3. determinar responsable, encargado, subencargado o responsable independiente para cada flujo;
4. firmar acuerdos del artículo 28 cuando proceda;
5. decidir si es obligatorio o aconsejable designar DPD/DPO;
6. publicar los datos de contacto adecuados para privacidad.

## 4. Finalidades y bases jurídicas propuestas

Las siguientes bases son hipótesis de trabajo, **no una determinación legal**. Deben validarse actividad por actividad; no debe escogerse una base por conveniencia después de recoger los datos.

| Actividad | Finalidad estricta | Base propuesta a validar | Observaciones |
|---|---|---|---|
| Crear y administrar cuenta | Prestar el servicio solicitado | Ejecución de contrato, art. 6.1.b | Recoger solo lo necesario para la cuenta |
| Autenticar, recuperar acceso y prevenir abuso | Seguridad del servicio y usuarios | Contrato y/o interés legítimo, art. 6.1.f | Requiere evaluación de necesidad y, para interés legítimo, LIA |
| Analizar contenido solicitado | Entregar un informe de riesgo | Ejecución de contrato | El usuario debe elegir qué contenido aporta |
| Gestionar grupo e invitaciones | Prestar la red familiar | Ejecución de contrato; interés legítimo limitado para datos del invitado | Aviso temprano al invitado y eliminación si no acepta |
| Solicitudes y decisiones de aprobación | Facilitar verificación familiar | Ejecución de contrato | Compartición granular y revocable para el futuro |
| Expediente y exportación | Organizar información aportada por el usuario | Ejecución de contrato | No equivale a asesoramiento legal |
| Conservar un borrador privado | Prestar el espacio de reporte solicitado | Ejecución de contrato, por validar | No autoriza moderación ni uso colectivo |
| Moderar un reporte enviado y prevenir abuso | Revisar una alerta y proteger el servicio | Interés legítimo tras LIA y/o base aplicable, por validar | Acceso por finalidad; separado de la reputación |
| Generar reputación colectiva | Prevenir fraude mediante señales compartidas | Consentimiento explícito del contribuyente, propuesta a validar | Si no resulta una base suficiente para los datos de terceros, la función permanece desactivada o se rediseña; no cambia silenciosamente a interés legítimo |
| Moderación y defensa frente a reclamaciones | Evitar falsedad, acoso y uso ilícito | Interés legítimo y, cuando aplique, defensa de reclamaciones | Acceso restringido y retención justificada |
| Auditoría y logs de seguridad | Integridad, disponibilidad y respuesta a incidentes | Interés legítimo y posibles obligaciones legales | No registrar contenido sensible |
| Comunicaciones esenciales | Operar cuenta y avisar de seguridad | Contrato u obligación legal según el mensaje | Separar de marketing |
| Marketing | Fuera del MVP | No aplica | No se recogen preferencias ni se envían comunicaciones promocionales |
| Cumplir una obligación o requerimiento válido | Atender mandato aplicable | Obligación legal, art. 6.1.c | Verificar competencia, alcance y registro |

### 4.1 Categorías especiales y datos de condenas

Lorica no solicitará categorías especiales ni datos sobre condenas/infracciones como campos estructurados. Sin embargo, mensajes o evidencias podrían contenerlos incidentalmente. Se requiere:

- aviso para que el usuario recorte o redacte información innecesaria;
- detección/redacción cuando sea viable;
- acceso restringido;
- no usarlos para reputación ni finalidades secundarias;
- evaluación jurídica de artículos 9 y 10 si su tratamiento deja de ser meramente incidental.

### 4.2 Decisiones automatizadas

El score es una ayuda para decidir, no una decisión jurídica sobre la persona asociada a un indicador. Se debe:

- explicar factores, evidencias y limitaciones;
- permitir corrección, reporte de error y revisión humana;
- impedir lenguaje categórico;
- no denegar servicios esenciales ni producir efectos jurídicos basándose solo en el score;
- reevaluar el artículo 22 si el uso futuro cambia.

## 5. Inventario y clasificación de datos

Clasificación interna propuesta:

- **P0 Pública:** destinada expresamente a publicación; en el MVP casi no aplica.
- **P1 Interna:** operación sin datos personales directos.
- **P2 Confidencial:** dato personal o comercial con acceso limitado.
- **P3 Restringida:** contenido cuya fuga puede causar fraude, daño financiero, familiar, legal o grave reidentificación.

La clasificación no determina por sí sola si un dato es personal bajo el RGPD.

| Conjunto | Ejemplos | Personas afectadas | Fuente | Clase | Visibilidad por defecto |
|---|---|---|---|---|---|
| Cuenta | Correo, nombre opcional, idioma, estado | Usuario | Usuario | P2 | Solo usuario y operación mínima |
| Autenticación | Hash, sesión, reset, verificación | Usuario | Sistema/usuario | P3 | Servicio de identidad |
| Señales antiabuso | IP, timestamps, contadores, eventos | Usuario/visitante | Sistema | P2 | Seguridad |
| Familia | Nombre del grupo, membresía, roles | Usuarios e invitados | Usuario/sistema | P2 | Miembros autorizados |
| Invitación | Correo/teléfono si se usa, token hash, estado | Invitado | Usuario/sistema | P2/P3 | Emisor, destinatario y sistema |
| Verificación original | Mensaje, contexto, URL, teléfono, correo, IBAN, wallet | Usuario y terceros mencionados | Usuario | P3 | Propietario; compartición explícita |
| Evidencia | Captura, documento, EXIF original, OCR | Usuario y terceros | Usuario/archivo | P3 | Propietario; acceso granular |
| Análisis | Score, reglas, hallazgos, explicaciones | Usuario y posibles terceros | Sistema | P2/P3 | Mismo ámbito que la verificación |
| Solicitud de aprobación | Resumen, contenido elegido, estado | Usuario y contacto | Usuario/sistema | P3 | Participantes concretos |
| Decisión/comentario | Resultado, texto, actor, fecha | Miembros | Usuario/sistema | P3 | Participantes autorizados |
| Reporte bruto | Indicador, relato, fecha, país, importe | Reportante y terceros | Usuario | P3 | Reportante; grupo si se elige; moderación limitada |
| Evidencia de reporte | Capturas/documentos | Reportante y terceros | Usuario | P3 | Mismo ámbito explícito del reporte; nunca pública |
| Reputación derivada | Recuentos limitados, confianza, estado | Posibles titulares del indicador | Sistema | P2/P3 | Consulta autenticada y limitada |
| Relaciones de indicadores | Dominio–teléfono–IBAN–campaña | Posibles terceros | Sistema/reportes | P3 | Análisis/moderación |
| Expediente | Incidente, cronología, importes, operaciones | Usuario y terceros | Usuario | P3 | Propietario; compartición explícita |
| Exportación | PDF/archivo del expediente | Mismas personas | Sistema | P3 | Descarga temporal autorizada |
| Consentimiento | Finalidad, versión, acción, fecha | Usuario | Sistema | P2 | Privacidad/auditoría |
| Auditoría | Actor, acción, recurso, resultado | Usuarios/personal | Sistema | P2 | Seguridad y revisión autorizada |
| Log técnico | Evento, duración, correlation ID pseudónimo | Usuario/operador | Sistema | P1/P2 | Operaciones limitadas |
| Respuesta externa | Fuente, resultado normalizado, TTL | Titular de indicador | Proveedor | P2/P3 | Análisis autorizado |
| Soporte y DSAR | Solicitud, verificación, respuesta | Solicitante y terceros | Interesado/sistema | P3 | Equipo autorizado |

## 6. Minimización y limitación de finalidad

### 6.1 En la entrada

- Permitir pegar solo el fragmento relevante, no exigir la conversación completa.
- Ofrecer recorte y redacción antes de subir una captura.
- Advertir que se eliminen contraseñas, PIN, OTP, documentos de identidad, datos médicos y datos de menores.
- Si se detecta un secreto, ocultarlo en pantalla y evitar persistirlo cuando no sea imprescindible.
- Fuera del reporte formal, no pedir descripción, importe, país o fecha si no
  son necesarios. En un reporte, exigir el campo estructural pero permitir
  `UNKNOWN`/`NOT_APPLICABLE` para no inventar datos; la descripción sigue siendo
  breve y obligatoria según el alcance.
- Preferir fecha aproximada, país o región amplia e importes exactos solo cuando
  el usuario los conozca y cumplan la finalidad.
- Eliminar EXIF y geolocalización de derivados. Conservar el original solo cuando el usuario elija incorporarlo como evidencia y comprenda el alcance.
- No recoger agenda, contactos, SMS, ubicación, micrófono, cámara persistente ni identificadores publicitarios.
- No usar huella digital invasiva como control anti-Sybil sin evaluación específica.

### 6.2 En el procesamiento

- Extraer indicadores y separar original, normalizado, derivado y agregado.
- Compartir con cada proveedor únicamente el indicador o fragmento indispensable.
- No enviar capturas o mensajes completos a un servicio URL, RDAP, DNS o reputación.
- OCR local o en proveedor del EEE preferido; si el proveedor no cumple las condiciones, usar mock o mantener la función desactivada.
- Un LLM real permanece desactivado hasta completar evaluación de proveedor, EIPD, contrato, configuración de retención/no entrenamiento y pruebas.
- Los workers reciben IDs opacos y recuperan solo los datos imprescindibles.
- Logs, métricas y trazas usan un esquema allowlist sin contenido.

### 6.3 En la salida

- Mostrar al usuario solo los datos que ya introdujo o que está autorizado a conocer.
- No revelar identidad, relato, evidencia ni fecha exacta del reportante.
- Redactar indicadores cuando no sea necesaria su forma completa.
- Las exportaciones excluyen secretos detectados y datos no seleccionados; antes de generar se muestra el alcance.
- Analytics de producto usa eventos agregados y no captura DOM, texto, URLs ni identificadores.

### 6.4 Prohibiciones de reutilización

Sin una nueva evaluación y base válida, queda prohibido:

- vender o licenciar reportes;
- publicidad dirigida basada en incidentes;
- entrenar modelos con contenido privado;
- puntuar solvencia, empleabilidad o conducta general;
- vigilar comunicaciones;
- publicar listados de personas “fraudulentas”;
- enriquecer perfiles ajenos a la prevención de fraude solicitada.

## 7. Consentimiento y transparencia

### 7.1 Consentimiento para reputación colectiva

Debe ser:

- separado de la aceptación de términos y de la prestación principal;
- desactivado por defecto;
- granular por finalidad y tipo de dato;
- explicado con ejemplos de qué se deriva y qué nunca se publica;
- registrable por versión, texto mostrado, acción afirmativa, fecha y canal;
- revocable con la misma facilidad con la que se otorgó;
- sin perjuicio en el servicio básico si se rechaza.

Retirar el consentimiento detendrá nuevas contribuciones y activará retirada/reagregación cuando esa sea la base aplicable. No se prometerá borrar tratamientos que deban mantenerse por otra base válida; la interfaz explicará la excepción concreta.

El consentimiento del reportante es además una compuerta de producto obligatoria
para cualquier contribución colectiva. No resuelve los derechos ni proporciona
por sí solo base suficiente respecto del titular del teléfono, correo, IBAN o
perfil reportado. Este tratamiento de datos obtenidos indirectamente exige
análisis de transparencia, excepciones, proporcionalidad y base jurídica. Hasta
cerrarlo, la reputación con datos reales permanece desactivada.

### 7.2 Información por capas

1. **Just-in-time:** antes de pegar, subir, compartir, reportar o exportar.
2. **Resumen:** finalidades, destinatarios, retención, controles y riesgos principales.
3. **Política completa:** responsable, bases, derechos, transferencias, proveedores y contacto.
4. **Historial:** versiones y cambios materiales.

El lenguaje será claro, en español y adaptado a personas con baja alfabetización digital. No se usarán patrones oscuros, consentimiento agrupado, casillas premarcadas ni miedo para conseguir aceptación.

### 7.3 Datos obtenidos de terceros

Los indicadores y evidencias suelen referirse a personas que no usan Lorica. Antes del piloto se debe definir:

- si procede informar individualmente y en qué plazo;
- qué excepciones podrían aplicar y cómo documentarlas;
- canal para comprobar, rectificar, objetar o impugnar;
- cómo evitar que la notificación revele al reportante o agrave un fraude;
- criterios para impedir publicación o acceso desproporcionado.

## 8. Fronteras privadas y colectivas

| Elemento | Privado por defecto | Compartición permitida | Prohibido en MVP |
|---|---|---|---|
| Mensaje/captura original | Sí | Personas elegidas de la familia | Publicación, indexación, analytics |
| Verificación y score | Sí | Contacto concreto autorizado | Página pública |
| Solicitud/decisión | Sí | Participantes de la solicitud | Todo el grupo por defecto |
| Reporte bruto | Sí | Grupo elegido explícitamente y moderadores con necesidad | Otros reportantes o público |
| Evidencia de reporte | Sí | Moderación limitada | Descarga pública |
| Indicador exacto | Sí, tratado conservadoramente como personal | Resolución interna dentro de una verificación/recurso autorizado | Lookup independiente, directorio o búsqueda parcial |
| Reputación | Derivada | Señal coarse tras umbral y controles | Acusación categórica o recuento pequeño |
| Estadística | Agregada | Solo si supera umbral y revisión | Segmento reidentificable |
| Expediente/exportación | Sí | Enlace temporal tras autorización | URL permanente |
| Auditoría | Sí | Seguridad/privacidad autorizadas | Miembros no implicados o público |

Compartir dentro de una familia no convierte los datos en públicos. Cada solicitud debe enseñar qué contenido se compartirá, con quién y durante cuánto tiempo. La baja o expulsión revoca acceso futuro.

## 9. Pseudonimización, agregación y umbrales

### 9.1 Pseudonimización

- Separar identificadores de cuenta del contenido operativo.
- Para correlación, usar identificadores aleatorios o HMAC con clave gestionada y contexto por tipo/entorno.
- Cifrar el valor original cuando deba recuperarse; restringir la tabla de correspondencia.
- Rotar claves con estrategia de migración y acceso mínimo.
- No llamar “anónimo” a un hash de teléfono, correo o IBAN: su espacio es enumerable y puede revertirse por diccionario.
- No reutilizar un mismo pseudónimo entre analytics, reputación y proveedores.

### 9.2 Reputación colectiva

Las siguientes cifras son **propuestas provisionales pendientes de validación de producto, fraude, privacidad y legal**:

- Un indicador no recibe contribución colectiva hasta reunir aportes elegibles
  de al menos **3 clústeres de fuente independientes** (`k_report = 3`). Un
  clúster colapsa, como mínimo, la misma cuenta, grupos solapados, el mismo
  incidente/evidencia y señales coordinadas conocidas.
- Ninguna única familia o clúster correlacionado aporta más del **20 %** del componente colectivo.
- Los recuentos pequeños se muestran como “sin señales suficientes”, no con el número exacto.
- La contribución decae y se reevalúa, como máximo, cada **6 meses**.

`k_report` es un umbral antiabuso, no una garantía formal de k-anonimato.

### 9.3 Estadísticas agregadas

Para cualquier estadística que pueda salir del ámbito privado se propone provisionalmente:

- tamaño de clase de equivalencia mínimo **k = 10**;
- supresión de celdas por debajo del umbral y de celdas derivables por resta;
- tiempo, ubicación, importe y categoría agrupados;
- recuentos redondeados o con ruido calibrado cuando proceda;
- revisión adicional para categorías raras o poblaciones pequeñas;
- prohibición de cruces interactivos que reduzcan el grupo por debajo de `k`;
- pruebas de singling-out, linkability e inference antes de publicar.

Para conjuntos especialmente sensibles o poblaciones pequeñas se propone **k = 20** o no publicar. Ambos valores son provisionales.

K-anonimato por sí solo no evita homogeneidad, linkage ni inferencia; puede requerir diversidad, privacidad diferencial u otra técnica. Solo un análisis documentado puede concluir que un resultado es razonablemente anónimo. Mientras exista una posibilidad razonable de reidentificación, se tratará como dato personal.

### 9.4 Reagregación

Una retirada, rectificación, rechazo de moderación o expiración debe:

1. excluir el reporte de futuras ejecuciones;
2. recalcular la reputación afectada;
3. invalidar cachés y resultados derivados dentro del SLA;
4. registrar el cambio sin conservar el relato eliminado;
5. suprimir el agregado si deja de cumplir el umbral.

## 10. Conservación

Toda cifra de esta sección es **provisional** y requiere validación legal, de producto, seguridad y soporte. Los plazos se cuentan desde el evento indicado, no desde una fecha global ambigua.

| Dato | Evento inicial | Periodo propuesto provisional | Acción |
|---|---|---:|---|
| Registro no verificado | Alta | 7 días | Borrar cuenta y tokens |
| Token de verificación | Emisión | 24 horas | Invalidar y borrar valor utilizable |
| Token de recuperación | Emisión | 1 hora | Invalidar; conservar solo evento mínimo |
| Invitación no aceptada | Emisión | 7 días | Invalidar y borrar contacto salvo prevención justificada |
| Sesión | Último uso | 30 días, con máximo absoluto por definir | Revocar y borrar/rotar identificador |
| Cuenta activa | Última actividad | Mientras exista; revisión tras 24 meses de inactividad | Avisar y borrar si no se conserva |
| Verificación no guardada en expediente | Creación | 90 días | Borrar original, hallazgos y derivados |
| Carga fallida/cuarentena | Fallo o abandono | 24 horas | Borrado seguro y auditable |
| Evidencia de verificación no guardada | Creación | 30 días | Borrar original y derivados |
| Solicitud de aprobación y decisión | Cierre | 24 meses | Borrar contenido; mantener auditoría mínima si procede |
| Reporte bruto elegible | Última revisión | 24 meses | Revisar necesidad, vigencia y exactitud; borrar o renovar |
| Evidencia de reporte | Última revisión | 12 meses | Borrar antes salvo necesidad documentada |
| Reporte rechazado/sin evidencia | Decisión | 90 días | Borrar contenido; señal antiabuso mínima si procede |
| Contribución pseudonimizada | Última señal válida | 24 meses | Excluir y reagregar |
| Agregado de reputación | Última actualización | Ventana móvil de 24 meses | Recalcular o suprimir |
| Expediente y evidencias | Última actividad | Hasta borrado del usuario; revisión tras 24 meses | Avisar y borrar |
| Exportación generada | Creación | 24 horas | Borrar objeto y revocar firma |
| Logs técnicos | Creación | 30 días | Borrar/rotar |
| Auditoría de seguridad | Creación | 12 meses | Borrar o agregar |
| Auditoría administrativa de alto impacto | Acción | 24 meses | Revisar y borrar |
| Registro de consentimiento | Cierre de cuenta/retirada | 3 años | Borrar salvo plazo necesario validado |
| Expediente de DSAR/reclamación | Cierre | 3 años | Borrar salvo defensa/requisito validado |
| Backup cifrado | Creación | 90 días | Expirar automáticamente |
| Tombstone antiabuso pseudonimizado | Borrado/suspensión | 12 meses | Borrar/rotar; solo tras LIA |

### 10.1 Reglas transversales

- Una retención no se amplía “por si acaso”.
- Cada tabla y bucket tendrá propietario, evento de expiración y job verificable.
- Los backups no se restauran sobre producción sin reaplicar la lista de borrados.
- Una conservación por reclamación o mandato válido se registra como `legal hold`, con alcance, motivo, aprobador y fecha de revisión.
- Datos verdaderamente anonimizados podrían quedar fuera del RGPD, pero solo tras evaluación documentada; pseudonimizar no basta.
- El usuario verá la retención aplicable antes de guardar o reportar.

## 11. Borrado, cierre de cuenta y exportación

### 11.1 Borrado

Plazos técnicos propuestos, todos provisionales:

1. Revocar acceso y nuevas sesiones de inmediato.
2. Ocultar datos activos y encolar borrado en menos de **24 horas**.
3. Eliminar de bases activas, índices, Redis, objetos y derivados en un máximo de **30 días**.
4. Expirar backups en un máximo de **90 días** sin reintroducir datos borrados al restaurar.
5. Recalcular agregados y suprimir cohortes que dejen de cumplir umbral en un máximo de **7 días**.

El flujo debe ser idempotente, reanudable y observable. Un dashboard interno mostrará trabajos incompletos sin exponer contenido.

No todo dato de un grupo pertenece exclusivamente a quien borra su cuenta. Antes de eliminar:

- separar aportes propios de registros de otros miembros;
- proteger derechos de terceros;
- conservar solo lo estrictamente necesario para defensa o mandato válido;
- anonimizar actor en la vista familiar cuando sea posible;
- explicar al usuario cada excepción concreta.

### 11.2 Exportación y portabilidad

- Área autoservicio para datos del usuario y recursos de los que sea propietario.
- JSON o CSV estructurado para datos aportados y resultados portables; archivo separado para evidencias originales elegidas.
- PDF como formato legible complementario, no único.
- Manifiesto con categorías, fechas, origen y checksums.
- Autorización reforzada, trabajo temporal y URL firmada corta.
- No incluir secretos de autenticación, señales antifraude internas, datos de otros miembros no necesarios ni identidad de reportantes.
- Registro auditable de solicitud, generación y descarga.

## 12. Derechos de las personas

El flujo cubre información, acceso, rectificación, supresión, limitación, portabilidad, oposición y revisión de decisiones automatizadas. Su aplicabilidad y excepciones dependen de la base y el contexto. El EDPB resume estos derechos y advierte que una copia no debe perjudicar derechos y libertades de terceros ([guía del EDPB sobre derechos](https://www.edpb.europa.eu/sme/be-compliant/respect-individuals-rights_en)).

### 12.1 Procedimiento

1. Entrada accesible dentro y fuera de la cuenta.
2. Acuse y número de caso.
3. Verificación de identidad proporcional; no pedir más datos de los necesarios.
4. Descubrimiento en cuenta, contenido, objetos, colas, proveedores, logs, backups y agregados.
5. Evaluación de derechos de terceros, fraude activo, deberes y excepciones.
6. Respuesta clara y registro de la decisión.
7. Ejecución técnica y confirmación.
8. Notificación a destinatarios cuando proceda.

Objetivo operativo provisional: completar en **30 días** para respetar el plazo general de un mes, con escalado jurídico si se contempla una extensión o rechazo. La cifra y comunicaciones deben validarse legalmente.

### 12.2 Casos particulares

- **Rectificación de indicador:** preservar la alegación, marcar el valor impugnado, congelar aumento de impacto si es prudente, moderar y reagregar.
- **Oposición:** suspender el uso basado en interés legítimo mientras se evalúan motivos, salvo excepción válida.
- **Limitación:** conservar aislado sin usar para scoring, exportación colectiva o proveedores.
- **Acceso indirecto:** no revelar al solicitante quién reportó ni evidencia de otra persona sin base.
- **Supresión:** borrar o excluir aportes y derivados; documentar excepciones.
- **Portabilidad:** entregar lo aportado por el titular en formato estructurado cuando resulte aplicable.
- **Revisión humana:** disponible para score, moderación, suspensión y decisiones de alto impacto.

## 13. Menores, familias y personas vulnerables

### 13.1 Límite del MVP

Se propone que el MVP permita crear cuentas solo a mayores de **18 años**. Es una decisión de producto provisional, no el umbral general de consentimiento del RGPD.

La AEPD indica que, en España, el tratamiento fundado en consentimiento de menores de catorce años requiere consentimiento de quien ejerce patria potestad o tutela, con las precisiones legales aplicables ([AEPD, menores y consentimiento](https://www.aepd.es/preguntas-frecuentes/10-menores-y-educacion/FAQ-1001-cual-es-la-edad-para-que-los-menores-puedan-prestar-consentimiento-para-tratar-sus-datos-personales)). La edad, mecanismo y base deben volver a validarse antes de admitir cuentas de menores.

### 13.2 Datos incidentales de menores

- Avisar y facilitar recorte/redacción.
- No extraer ni puntuar características del menor.
- No incorporar su identidad a reputación colectiva.
- Acceso familiar por necesidad, no automáticamente para todos los adultos.
- Moderación prioritaria de acoso, explotación, violencia o exposición.
- Canal de supresión y ayuda comprensible.

### 13.3 Riesgo familiar

“Contacto de confianza” no significa relación segura. Puede haber coerción, control económico o violencia. Por ello:

- compartir es granular y visible antes de confirmar;
- no se revela ubicación, actividad general ni otras verificaciones;
- se puede revocar a un contacto sin notificarle detalles sensibles;
- las notificaciones tienen texto discreto y no incluyen el contenido;
- una aprobación no sustituye la decisión del usuario;
- soporte dispone de protocolo para abuso y acceso no autorizado;
- no existe panel de vigilancia de toda la actividad familiar.

Si se incorporan menores, tutelas o cuentas asistidas, se requiere una EIPD y diseño específico de edad, lenguaje, consentimiento y conflicto de intereses.

## 14. Proveedores y transferencias internacionales

### 14.1 Selección

Antes de enviar datos reales a hosting, correo, OCR, LLM, antivirus, analytics o reputación:

- documentar entidad, servicio, finalidad, datos y subencargados;
- preferir procesamiento y soporte en el EEE;
- verificar región real de datos, backups, telemetría y soporte;
- firmar DPA, confidencialidad, eliminación, retorno, asistencia en derechos y brechas;
- prohibir uso para publicidad o entrenamiento;
- configurar retención mínima y acceso de soporte;
- evaluar seguridad, historial, certificaciones y salida/migración;
- probar el payload real que sale del adaptador.

### 14.2 Transferencias

No se realizará una transferencia fuera del EEE por defecto. Si fuese necesaria:

1. identificar la transferencia y todas las transferencias ulteriores;
2. comprobar decisión de adecuación;
3. en su defecto, evaluar garantías apropiadas, como cláusulas contractuales tipo;
4. realizar Transfer Impact Assessment y medidas suplementarias cuando proceda;
5. informar al usuario y mantener registro;
6. bloquear el proveedor si no puede ofrecer protección esencialmente equivalente.

El EDPB explica que las transferencias fuera del EEE requieren adecuación o garantías y que las cláusulas tipo no eliminan la necesidad de base, minimización, contrato y evaluación del destino ([EDPB, transferencias internacionales](https://www.edpb.europa.eu/sme/be-compliant/international-data-transfers_en)).

### 14.3 Degradación segura

Una integración sin contrato, caída o no disponible produce “comprobación externa no disponible”. No se sustituye silenciosamente por otro proveedor ni se amplía el payload para obtener resultado.

## 15. EIPD, RAT y gobierno

### 15.1 Evaluación de impacto

La necesidad formal debe determinarla el futuro responsable. No obstante, se recomienda completar una EIPD **antes del piloto**, porque Lorica combina identificadores persistentes, datos financieros incidentales, evaluación/reputación, relaciones familiares, datos de terceros, personas potencialmente vulnerables y posibles efectos reputacionales.

La AEPD señala que la EIPD es obligatoria cuando el tratamiento implique alto riesgo y que sus listas son orientativas, no restrictivas ([AEPD, realización de EIPD](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/realizacion-de-evaluaciones-de)). Una EIPD debe describir el tratamiento, evaluar necesidad/proporcionalidad, riesgos y medidas, y revisarse ante cambios relevantes ([AEPD, contenido de una EIPD](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/10-evaluacion-de-impacto/FAQ-0229-que-debe-incluir-una-evaluacion-de-impacto-de-proteccion-de-datos)).

La EIPD deberá incluir como mínimo:

- mapa completo de datos y proveedores;
- necesidad y proporcionalidad por finalidad;
- riesgos para interesados, no solo para la empresa;
- especial atención a falsos positivos, represalias, fraude y conflicto familiar;
- medidas, riesgo residual, propietarios y fechas;
- consulta a interesados o justificación de no hacerlo;
- decisión sobre consulta previa si el alto riesgo residual no se reduce.

### 15.2 Gobierno

- RAT/ROPA versionado.
- Comité de cambios para finalidad, proveedor, nueva categoría o publicación.
- Privacy review en cada ADR y feature con datos.
- Inventario de consentimientos, proveedores, transferencias y legal holds.
- Métricas sin contenido: DSAR, borrado, accesos internos, retención vencida, errores de reagregación y brechas.
- Formación y compromiso de confidencialidad para soporte/moderación.
- Acceso interno temporal y auditable; revisión trimestral propuesta.

## 16. Brechas de datos personales

Toda brecha, incluso si no se notifica, se documenta con hechos, categorías, alcance, riesgo para personas, medidas y decisión.

Flujo:

1. Escalado inmediato a seguridad y privacidad.
2. Contención sin destruir evidencia.
3. Evaluación separada del riesgo para las personas.
4. Identificación del responsable y autoridad competente.
5. Decisión documentada sobre notificación y comunicación.
6. Información por fases si el alcance aún no es completo.
7. Remediación, seguimiento y actualización de EIPD/modelo.

La AEPD indica que, cuando sea probable un riesgo para derechos y libertades, el responsable debe notificar a la autoridad competente sin dilación indebida y, cuando sea posible, dentro de 72 horas desde que tiene constancia; si el riesgo es alto, puede ser necesaria la comunicación a afectados ([AEPD, notificación de brechas](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/brechas-de-datos-personales-notificacion)). La aplicación concreta debe validarse caso por caso.

## 17. Riesgos de privacidad y mitigación

| ID | Riesgo para las personas | Probabilidad inicial | Impacto | Mitigación |
|---|---|---|---|---|
| P-01 | Falsa asociación de teléfono/IBAN/persona con fraude | Alta | Alto | Reporte privado, caps, umbral, moderación, lenguaje no categórico, impugnación |
| P-02 | Exposición de mensaje o evidencia a otra familia | Media | Muy alto | Autorización por objeto/acción, tests tenant, storage privado |
| P-03 | Reidentificación desde agregados pequeños | Alta | Alto | Supresión, k provisional, redondeo, límites de cruce y revisión |
| P-04 | Proveedor utiliza contenido para fines propios | Media | Muy alto | Minimización, DPA, no training, región, auditoría y bloqueo |
| P-05 | Miembro familiar usa Lorica para control/coerción | Media | Muy alto | Compartición granular, revocación discreta, no vigilancia, protocolo de abuso |
| P-06 | EXIF revela ubicación o dispositivo | Media | Alto | Derivados sin metadatos, original restringido, aviso |
| P-07 | Conservación indefinida agrava una fuga | Alta | Alto | Matriz, TTL por evento, jobs y métricas de expiración |
| P-08 | Borrado no alcanza objetos, cachés o backups | Media | Alto | Orquestador idempotente, inventario, tombstones y restore con re-borrado |
| P-09 | Exportación revela datos de terceros | Media | Alto | Selección, redacción, revisión de scope, descarga reforzada |
| P-10 | Datos de menor tratados sin garantías | Media | Muy alto | MVP 18+, redacción, prohibición de reputación, revisión específica |
| P-11 | Inferir situación financiera o vulnerabilidad | Media | Alto | Campos opcionales, rangos, finalidad estricta, no perfilado secundario |
| P-12 | Analítica o logs capturan contenido | Media | Muy alto | Sin session replay, allowlist, canarios, acceso y retención limitados |
| P-13 | DSAR revela reportante o víctima | Media | Alto | Verificación, evaluación de terceros, redacción y revisión humana |
| P-14 | Cambio de finalidad o entrenamiento no informado | Media | Muy alto | Prohibición, comité de cambios, nueva base/EIPD y consentimiento si aplica |
| P-15 | Un atacante enumera indicadores exactos | Alta | Alto | Sin lookup independiente; resolución en verificación privada, rate limit y respuesta no reveladora |

## 18. Criterios de aceptación de privacidad

Antes de un piloto con datos reales:

- [ ] Entidad responsable, encargados y responsables independientes identificados y validados.
- [ ] RAT/ROPA aprobado y coherente con el mapa de datos.
- [ ] Base jurídica y prueba de necesidad/proporcionalidad documentadas por finalidad.
- [ ] LIA completada para cada interés legítimo propuesto.
- [ ] EIPD completada o decisión razonada de no realizarla; riesgos altos residuales escalados.
- [ ] Avisos por capas y textos just-in-time revisados en español claro.
- [ ] Consentimiento colectivo separado, apagado por defecto, versionado, revocable y probado.
- [ ] El servicio básico funciona sin aceptar la contribución colectiva.
- [ ] Reportes/evidencias brutos son privados y no indexables.
- [ ] Umbrales, caps y k están configurados, documentados como provisionales y cubiertos por tests.
- [ ] Celdas pequeñas y derivables por resta se suprimen.
- [ ] No se afirma anonimización basándose solo en hashing o k-anonimato.
- [ ] Cada endpoint, job, tabla, bucket, caché, log, exportación y backup tiene retención y propietario.
- [ ] Jobs de expiración, borrado y reagregación son idempotentes y se monitorizan.
- [ ] Una restauración de backup no resucita datos borrados.
- [ ] Exportación cubre formatos estructurado y legible sin exponer terceros.
- [ ] Acceso, rectificación, supresión, limitación, oposición y revisión humana tienen flujo probado con datos ficticios.
- [ ] Proveedores tienen evaluación, contrato, subencargados, región, retención y mecanismo de salida documentados.
- [ ] Payloads salientes se prueban y contienen solo datos mínimos.
- [ ] No existe LLM/OCR real habilitado sin evaluación y configuración de no entrenamiento/retención.
- [ ] PWA, CDN y navegador no cachean respuestas o archivos sensibles.
- [ ] Logs y analytics no contienen contenido, URL completa, IBAN, teléfono, correo, sesión o firma.
- [ ] El MVP aplica la restricción de edad acordada y ofrece protección a datos incidentales de menores.
- [ ] Existe canal de impugnación para personas o entidades asociadas a indicadores.
- [ ] Procedimiento de brechas incluye reloj, evaluación, documentación, contactos y simulacro.
- [ ] Todas las excepciones a borrado/DSAR requieren motivo, aprobador, alcance y revisión.

## 19. Decisiones pendientes

| Decisión | Validación necesaria | Bloquea |
|---|---|---|
| Entidad, país y rol jurídico de Lorica | Legal/privacidad | Aviso, contratos y RAT |
| Bases de reporte bruto y reputación | Legal + fraude + producto | Reportes reales |
| Deber de informar a terceros reportados | Legal/privacidad | Reputación |
| Periodos exactos de toda la matriz | Legal + producto + seguridad | Jobs de retención |
| `k_report`, k estadístico, caps y decaimiento | Privacidad + fraude + estadística | Scoring colectivo |
| Restricción 18+ y futura estrategia de menores | Legal + producto | Registro |
| Proveedores/regiones/subencargados | Procurement + seguridad + privacidad | Producción |
| Transferencias y medidas suplementarias | Legal/privacidad | Proveedor fuera del EEE |
| Campos cifrados y gestión de claves | Seguridad + privacidad | Datos reales |
| Circunstancias de legal hold | Legal | Borrado |
| Umbral para acceso interno JIT y doble control | Seguridad + operaciones | Moderación |
| Necesidad de DPO y consulta previa | Legal/privacidad | Piloto |

## 20. Riesgos residuales

Incluso aplicando este diseño:

- el contenido aportado por un usuario puede contener datos de terceros sin su conocimiento;
- un indicador exacto puede identificar a una persona aunque se muestre una respuesta mínima;
- el hash de un identificador de baja entropía sigue siendo reidentificable;
- la agregación puede permitir inferencias al combinarse con fuentes externas;
- un contacto familiar autorizado puede abusar de lo que ve;
- una obligación de preservar evidencia puede limitar temporalmente un borrado;
- proveedores y backups amplían la superficie y el tiempo de desaparición;
- un score explicable puede seguir siendo incorrecto o producir estigma.

Estos riesgos requieren valores privados por defecto, lenguaje prudente, revisión humana, impugnación efectiva y revisión periódica. Ningún riesgo alto residual se aceptará de forma tácita: tendrá propietario, justificación, controles compensatorios y fecha de reevaluación.

## 21. Fuentes oficiales de referencia

- [Reglamento (UE) 2016/679 — RGPD, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [EDPB — Guidelines 4/2019 sobre protección de datos desde el diseño y por defecto](https://www.edpb.europa.eu/documents/guideline/guidelines-42019-on-article-25-data-protection-by-design-and-by-default_en)
- [AEPD — Realización de evaluaciones de impacto](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/realizacion-de-evaluaciones-de)
- [AEPD — Contenido mínimo y revisión de una EIPD](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/10-evaluacion-de-impacto/FAQ-0229-que-debe-incluir-una-evaluacion-de-impacto-de-proteccion-de-datos)
- [AEPD — Consentimiento y menores](https://www.aepd.es/preguntas-frecuentes/10-menores-y-educacion/FAQ-1001-cual-es-la-edad-para-que-los-menores-puedan-prestar-consentimiento-para-tratar-sus-datos-personales)
- [EDPB — Derechos de las personas](https://www.edpb.europa.eu/sme/be-compliant/respect-individuals-rights_en)
- [EDPB — Transferencias internacionales](https://www.edpb.europa.eu/sme/be-compliant/international-data-transfers_en)
- [AEPD — Notificación de brechas de datos personales](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/brechas-de-datos-personales-notificacion)
