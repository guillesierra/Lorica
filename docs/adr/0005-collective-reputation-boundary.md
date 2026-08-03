# ADR 0005: separación entre reportes y reputación colectiva

- Estado: aceptada para el MVP
- Fecha: 2026-07-24
- Responsables: producto, privacidad, moderación y dominio

## Contexto

Los reportes pueden ayudar a otras personas, pero también pueden ser erróneos,
duplicados, coordinados o maliciosos. Teléfonos, correos, IBAN y perfiles pueden
ser datos personales. Mostrar reportes sin controles expone a Lorica a daños,
acoso, reidentificación y decisiones injustas.

## Decisión

Se separarán tres capas:

1. **Reporte bruto privado:** relato, evidencias e identidad del remitente;
   accesible por su propietario, por el grupo elegido si activa expresamente
   ese ámbito y por moderadores autorizados tras el envío y con una finalidad
   registrada. Nunca es público.
2. **Señales de moderación:** duplicidad, independencia, calidad, abuso y estado
   de revisión; nunca públicas.
3. **Reputación agregada:** resumen derivado, limitado y versionado que puede
   consultar el motor.

No habrá un directorio público ni búsqueda abierta de personas o indicadores en
el MVP. Un usuario solo consulta indicadores presentes en un análisis o recurso
que ya puede ver.

Un reporte aislado no modificará la reputación colectiva ni su componente de
scoring. La propuesta inicial exige un umbral `k` de al menos tres clústeres de
fuente elegibles e independientes. Una comprobación oficial o externa se trata en su
componente propio, no como una denuncia adicional. Este valor es provisional y
requiere validación legal, de producto y antiabuso antes de producción.

La interfaz mostrará bandas como “sin coincidencias elegibles”, “pocas
coincidencias” o “varias coincidencias”, no identidades ni un contador exacto
que facilite inferencias. Incluso una coincidencia verificada se formulará como
señal de riesgo, no como atribución delictiva.

### Identificadores sensibles

La forma normalizada necesaria para coincidencia exacta producirá:

- `lookupHash`: HMAC con clave rotatoria, tipo y versión de normalización;
- `encryptedValue`: valor cifrado mediante un puerto de cifrado cuando un caso
  autorizado necesite recuperarlo;
- `maskedValue`: representación mínima segura para la interfaz.

Los dominios y URLs también se clasificarán por finalidad; no se asumirá que son
datos no personales. El HMAC es pseudonimización, no anonimización. Las claves
no residirán en la base de datos.

### Elegibilidad y antiabuso

El agregado considerará, con límites y saturación:

- clústeres de fuente independientes, nunca número bruto de filas; un clúster
  colapsa cuentas/grupos solapados, el mismo incidente o evidencia y señales
  coordinadas conocidas;
- duplicados por incidente, evidencia y relaciones conocidas;
- antigüedad y caducidad;
- calidad de evidencia;
- estado de moderación;
- señales de cuentas coordinadas o automatizadas;
- conflictos de interés y rectificaciones.

No se usarán características invasivas de huella digital de dispositivo como
requisito inicial. Las señales técnicas de abuso tendrán finalidad, retención y
acceso limitados.

Se conservarán la versión de la política y los insumos agregados usados por cada
análisis para poder explicar y rectificar resultados. Una corrección futura no
reescribirá silenciosamente el resultado histórico; generará una nueva
evaluación o una anotación.

## Consecuencias

### Positivas

- Reduce el efecto de una acusación individual y del brigading.
- Limita la exposición de datos personales y evidencias.
- Permite rectificación, auditoría y recalculo reproducible.

### Negativas

- Indicadores nuevos pueden no aportar reputación hasta ser corroborados.
- Moderar independencia y calidad requiere operaciones humanas.
- El cifrado recuperable y la rotación de HMAC añaden complejidad.

## Alternativas descartadas

- **Publicar reportes individuales:** riesgo desproporcionado de privacidad,
  difamación y represalias.
- **Contar filas:** premia duplicados, bots y coordinación.
- **Hash sin clave de espacios pequeños:** teléfonos e IBAN pueden enumerarse.
- **Anonimización declarativa:** la pseudonimización no elimina por sí sola el
  carácter personal del dato.

## Pendiente antes de Fase 4

- DPIA y revisión jurídica de finalidad, base legal, información al afectado,
  oposición, rectificación y posibles excepciones.
- Política de apelación, moderación y respuesta a abuso.
- Calibración de `k`, bandas, recencia y elegibilidad.
- Diseño y operación de claves de cifrado y HMAC.
