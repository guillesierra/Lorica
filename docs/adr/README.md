# Registro de decisiones arquitectónicas

Los ADR documentan decisiones que afectan a más de un módulo o que serían
costosas de revertir. Una decisión aceptada para el MVP puede revisarse mediante
un ADR posterior que la sustituya; no se reescribe retrospectivamente.

| ADR | Decisión | Estado |
| --- | --- | --- |
| [0001](0001-modular-monolith-and-monorepo.md) | Monorepo con monolito modular | Aceptada para el MVP |
| [0002](0002-server-side-sessions.md) | Sesiones opacas en servidor y mismo origen | Aceptada para el MVP |
| [0003](0003-hybrid-analysis-and-scoring.md) | Análisis híbrido y scoring explicable | Aceptada para el MVP |
| [0004](0004-evidence-quarantine.md) | Evidencias privadas con cuarentena | Aceptada para el MVP |
| [0005](0005-collective-reputation-boundary.md) | Separación entre reportes y reputación | Aceptada para el MVP |
| [0006](0006-transactional-outbox-and-jobs.md) | Outbox transaccional y jobs idempotentes | Aceptada para el MVP |
| [0007](0007-static-anonymous-mvp.md) | MVP anónimo y estático en GitHub Pages | Aceptada para el MVP |

## Plantilla

Cada ADR debe incluir como mínimo:

1. contexto y fuerzas que condicionan la decisión;
2. decisión;
3. consecuencias positivas y negativas;
4. alternativas descartadas;
5. cuestiones pendientes que no resuelve.
