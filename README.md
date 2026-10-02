# Lorica

Lorica es un MVP web privado y explicable para revisar URLs, SMS, correos y
mensajes sospechosos antes de actuar. Está orientado a campañas observadas en
España y funciona sin registro: el análisis básico se ejecuta íntegramente en el
navegador y no abre las URLs introducidas.

## MVP disponible

- Analizador local de texto y URLs con puntuación explicable.
- Detección heurística de punycode, mezcla de alfabetos, caracteres invisibles,
  subdominios engañosos, `@` en URLs, acortadores y parecidos con marcas.
- Señales de ingeniería social: urgencia, credenciales, pagos irreversibles,
  falsa inversión, suplantación familiar, callback y documentos de identidad.
- Registro editorial de campañas españolas de 2023 a 2026 con fuentes oficiales.
- Registro sincronizado de dominios y rutas URL activas, con health/freshness
  visible y procedencia MIT; se eliminan query strings para no republicar tokens.
- Análisis local de remitentes y teléfonos; avisa de numeración de posible coste
  especial, sin convertir un caller ID ni reportes comunitarios en acusaciones.
- Acceso directo a la consulta oficial del Registro de Alias SMS/MMS/RCS de CNMC.
- PWA instalable, responsive y desplegable en GitHub Pages.
- Pantalla de cuenta preparada para conectar OAuth Google/Apple a una API futura;
  ningún secreto se incluye en el frontend estático.

El resultado es una ayuda preventiva, no una garantía ni una acusación. Ante una
duda real se debe verificar por un canal oficial independiente y contactar con
INCIBE en el 017.

## Ejecución

Requiere Node.js 22 o una versión compatible con Vite 8.

```powershell
npm ci
npm run dev
```

Validación completa y compilación:

```powershell
npm run check
```

La salida estática se genera en `apps/web/out`. Para probar la ruta de GitHub
Pages localmente:

```powershell
$env:GITHUB_PAGES='true'; npm run build
```

## Inteligencia de amenazas

```powershell
npm run sync:threats
```

El sincronizador obtiene por separado los feeds activos de dominios y URLs de
Phishing.Database, conserva la instantánea anterior si falla un feed, y registra
el estado de cada fuente en `data/threat-intel-report.json` y en la página
Inteligencia. Un fallo queda visible y marca el workflow como fallido. El filtro
`.es`/marcas españolas indica relevancia potencial, no atribución geográfica. En
las URLs se quitan parámetros y fragmentos para no publicar valores únicos;
coincide por host y ruta, no certifica cada variante.

No hay base pública fiable y abierta de teléfonos fraudulentos integrada. Para
evitar falsos señalamientos, solo se muestra un aviso de coste para ciertos
prefijos. El alias de remitente SMS se puede contrastar en la
[consulta pública de CNMC](https://numeracionyoperadores.cnmc.es/alias); la
descarga masiva de la CNMC requiere acceso autenticado registrado.

## Despliegue

- `.github/workflows/ci.yml`: lint, tipos, tests y build en cada cambio.
- `.github/workflows/pages.yml`: publicación del artefacto estático en Pages.
- `.github/workflows/threat-intel.yml`: actualización programada de indicadores.

En GitHub hay que seleccionar **Settings → Pages → Source → GitHub Actions** una
sola vez. OAuth completo requiere desplegar una API con sesiones seguras y
configurar `VITE_API_URL`; GitHub Pages por sí solo no puede custodiar secretos.

## Documentación

- [Investigación 2023–2026](docs/research-spain-2023-2026.md)
- [Alcance del producto](docs/product-scope.md)
- [Arquitectura](docs/architecture.md)
- [Modelo de datos](docs/data-model.md)
- [Diseño de la API](docs/api-design.md)
- [Modelo de amenazas](docs/security-threat-model.md)
- [Diseño de privacidad](docs/privacy-design.md)
- [Roadmap](docs/roadmap.md)
- [Decisiones arquitectónicas](docs/adr/README.md)

## Licencia

AGPL-3.0-or-later. La instantánea derivada de Phishing.Database conserva su
atribución MIT en sus metadatos.
