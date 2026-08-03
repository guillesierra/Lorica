# ADR 0003: análisis híbrido y scoring explicable

- Estado: aceptada para el MVP
- Fecha: 2026-07-24
- Responsables: producto, dominio, seguridad y moderación

## Contexto

Lorica debe combinar reglas, reputación y verificaciones externas sin convertir
una predicción opaca o una denuncia aislada en una acusación. El resultado debe
ser reproducible, resistente a señales correlacionadas y comprensible para una
persona no técnica.

## Decisión

Cada análisis conservará una instantánea inmutable de:

- entrada normalizada y su contexto;
- versiones de extractores, reglas y política de scoring;
- hallazgos con fragmento o evidencia de origen;
- reputación agregada consultada;
- comprobaciones externas, fecha, caducidad y confianza;
- limitaciones, señales ausentes y errores de proveedores.

### Reglas

Las reglas se almacenarán como registros versionados. Su condición utilizará un
lenguaje declarativo limitado a operadores registrados; no se evaluará código,
SQL ni expresiones arbitrarias guardadas en base de datos.

Cada regla declara identificador estable, versión, categoría, familia de
correlación, descripción, peso, severidad, recomendación y estado. Cada
hallazgo registra la evidencia concreta y la confianza de extracción.

Las señales correlacionadas se agruparán, por ejemplo: credenciales, urgencia,
engaño de enlace, suplantación, secreto, pago irreversible y anomalía
contextual. Dentro de una familia se toma la señal más fuerte y solo una
fracción configurable de las siguientes, con un límite por familia.

### Componentes de la puntuación

La política inicial tendrá cuatro componentes independientes y versionados:

| Componente | Límite inicial | Origen |
| --- | ---: | --- |
| `D` determinista | 70 | reglas y evidencia extraída |
| `R` reputación | 25 | agregado antiabuso de reportes elegibles |
| `X` externo | 25 | adaptadores normalizados con confianza vigente |
| `A` analizador opcional | 10 | salida JSON validada de IA u otro clasificador |

Los límites son configuración de la política, no constantes dispersas en el
código. Antes de producción deben calibrarse con un conjunto ficticio/sintético
y posteriormente con datos lícitos y representativos.

Los reportes no se sumarán linealmente. Para reportes elegibles se calcula una
fuerza:

`s = Σ(independencia × recencia × revisión × calidad_evidencia × antiabuso)`

y una contribución saturada:

`R = Rmax × (1 - exp(-s / τ))`

`Rmax` y `τ` pertenecen a la versión de política. Los duplicados de un mismo
incidente o actor se colapsan antes del cálculo. Solo entran en `s` señales que
han superado la política de elegibilidad y el umbral colectivo. Un único reporte
no revisado tiene contribución colectiva `R = 0`; puede mostrarse únicamente a
su autor como antecedente privado, sin modificar el score compartido.

La puntuación preliminar es:

`raw = clamp(D + R + X + A - mitigaciones, 0, 100)`

Las mitigaciones solo se aplican si proceden de una comprobación positiva y
vigente; la ausencia de una señal no resta riesgo. Los solapamientos entre
componentes deben declararse y limitarse para no contar dos veces la misma
fuente.

Umbrales iniciales:

- bajo: 0–24;
- medio: 25–49;
- alto: 50–74;
- crítico: 75–100.

El nivel crítico requiere además una puerta de evidencia: dos familias de
señales independientes de alta confianza, o una comprobación externa revisada de alta
confianza junto con una acción peligrosa detectada. Si no se cumple, el
resultado queda limitado a 74. La IA no satisface por sí sola esta puerta.

### Contrato del resultado

El resultado separará:

- hechos extraídos;
- inferencias y su confianza;
- coincidencias agregadas;
- motivos que aportan o reducen puntuación;
- acciones a evitar y formas seguras de verificar;
- limitaciones y comprobaciones no realizadas.

El texto usará lenguaje prudente: “indicador de riesgo”, “existen reportes
asociados”, “no se ha podido verificar” y “señales compatibles con un posible
fraude”.

## Consecuencias

### Positivas

- Resultado reproducible, auditable y explicable.
- Saturación, límites y puerta de crítico reducen brigading y doble conteo.
- Proveedores e IA pueden añadirse sin controlar la decisión final.

### Negativas

- Los pesos iniciales no equivalen a probabilidades estadísticas.
- La calibración y el seguimiento de falsos positivos son trabajo continuo.
- Versionar reglas y políticas aumenta el modelo y las pruebas requeridas.

## Alternativas descartadas

- **Suma lineal de denuncias:** favorece duplicados y ataques coordinados.
- **Puntuación directa de un LLM:** no es suficientemente reproducible ni
  verificable.
- **Clasificación binaria fraude/no fraude:** induce certeza injustificada.
- **Reglas hardcodeadas en casos de uso:** impiden gobernanza y reproducción.

## Pendiente antes de activar reputación real

- Aprobar pesos, familias, límites, `τ` y puerta de evidencia con producto,
  moderación, seguridad y asesoría legal.
- Definir el conjunto de calibración y métricas por contexto.
- Establecer revisión, rollback y firma de versiones de reglas.
