# Investigación de fraude en España (2023–2026)

Fecha de corte: 3 de agosto de 2026. Este documento resume campañas publicadas
por INCIBE; no afirma que sea una lista exhaustiva ni que una URL sea maliciosa
por aparecer en un mensaje aislado.

## Patrones observados

El registro incluido en `packages/knowledge/src/campaigns.ts` contiene catorce
avisos verificables de INCIBE entre septiembre de 2023 y mayo de 2026. Los temas
que se repiten son:

- DGT: multas urgentes, recargos y formularios que solicitan tarjeta o DNI.
- AEAT y DEHú: supuestos reembolsos o notificaciones pendientes.
- Correos y paquetería: incidencias de entrega y pequeños pagos.
- Bancos: bloqueo de cuenta, operación no autorizada y petición de llamar a un
  número controlado por el atacante.
- Familia: “soy tu hijo, tengo un número nuevo” y solicitud de dinero.

Cada ficha de la aplicación enlaza directamente al aviso oficial y distingue
fecha de publicación, canal, entidad suplantada y comportamiento solicitado.

## Técnicas de URL cubiertas

- **Homógrafos Unicode:** sustitución de letras latinas por caracteres visualmente
  parecidos de cirílico o griego. Lorica detecta mezcla de alfabetos y calcula un
  esqueleto conservador inspirado en Unicode UTS #39. No declara conformidad total
  con ese estándar.
- **Punycode:** etiquetas `xn--` que pueden representar nombres internacionalizados.
  Es una señal para revisar, no una prueba de fraude.
- **Caracteres invisibles y bidireccionales:** pueden ocultar o reordenar texto.
- **Subdominio señuelo:** la marca aparece a la izquierda, pero el dominio
  registrable pertenece a otra persona, por ejemplo `marca.es.ejemplo.test`.
- **Userinfo:** `marca.es@dominio.test` hace que la navegación real vaya al host
  situado después de `@`.
- **Typosquatting:** inserciones, omisiones o sustituciones cercanas al nombre de
  una marca; se mide con distancia de edición y se contrasta con dominios oficiales.
- **Acortadores, HTTP, IP literal, puertos no habituales y rutas de credenciales:**
  señales contextuales que aumentan el riesgo, sin decidirlo por separado.
- **Enlace con etiqueta engañosa:** el texto visible de Markdown parece oficial,
  pero el destino es otro dominio.

Referencias metodológicas: [Unicode UTS #39](https://www.unicode.org/reports/tr39/),
[MITRE ATT&CK T1566.002](https://attack.mitre.org/techniques/T1566/002/) y la guía
de [smishing de INCIBE](https://www.incibe.es/ciudadania/tematicas/ingenieria-social-fraudes-online/smishing).

## Fuentes de campañas

- [AEAT por SMS, 26/05/2026](https://www.incibe.es/ciudadania/avisos/la-agencia-tributaria-no-ha-emitido-ninguna-comunicacion-dirigida-usted)
- [AEAT y DEHú, 03/02/2026](https://www.incibe.es/ciudadania/avisos/notificaciones-falsas-que-suplantan-la-agencia-tributaria-aeat-y-la-direccion)
- [Paquetería, 19/12/2025](https://www.incibe.es/ciudadania/avisos/campana-de-smishing-que-suplanta-empresas-de-paqueteria-con-la-excusa-de-que)
- [Banca y callback, 30/09/2025](https://www.incibe.es/ciudadania/avisos/campana-de-smishing-que-suplanta-entidades-bancarias-solicitando-que-les-llames)
- [DGT, 16/09/2025](https://www.incibe.es/ciudadania/avisos/la-dgt-no-esta-enviando-correos-ni-sms-para-notificar-multas-de-trafico)
- [Falso hijo, 08/05/2025](https://www.incibe.es/ciudadania/avisos/has-recibido-un-mensaje-desde-un-numero-desconocido-que-dice-ser-tu-hijo)
- [DGT, 03/04/2025](https://www.incibe.es/ciudadania/avisos/distribucion-de-notificaciones-de-multas-falsas-por-correo-y-mensaje-suplantando)
- [DGT y DNI, 15/11/2024](https://www.incibe.es/ciudadania/avisos/la-dgt-no-esta-solicitando-traves-de-una-web-una-imagen-de-tu-dni-para-pagar-una)
- [DGT, 19/08/2024](https://www.incibe.es/ciudadania/avisos/varias-oleadas-de-sms-y-correos-fraudulentos-suplantando-la-dgt-inundan-las)
- [Correos, 11/06/2024](https://www.incibe.es/ciudadania/avisos/correos-no-esta-enviando-mensajes-para-comunicarte-que-existe-una-incidencia-con)
- [AEAT, 08/04/2024](https://www.incibe.es/ciudadania/avisos/suplantacion-de-la-agencia-tributaria-sms-durante-el-periodo-de-presentacion-de)
- [Banca, 31/01/2024](https://www.incibe.es/ciudadania/avisos/detectadas-campanas-que-suplantan-la-identidad-de-varias-entidades-bancarias)
- [Correos, 10/11/2023](https://www.incibe.es/ciudadania/avisos/detectada-campana-de-suplantacion-correos-por-medio-de-phishing-cuidado)
- [AEAT, 28/09/2023](https://www.incibe.es/ciudadania/avisos/detectada-campana-fraudulenta-haciendose-pasar-por-la-agencia-tributaria-para-el)

## Registro de URLs maliciosas

El MVP consume únicamente indicadores cuya redistribución es compatible con el
repositorio: [Phishing.Database](https://github.com/Phishing-Database/Phishing.Database)
(MIT). Se almacenan dominios normalizados, no se visitan, y el snapshot se genera
en `packages/knowledge/src/generated-threats.ts`. Si la fuente no responde o está
vacía, la automatización conserva el último snapshot verificado.

URLhaus y PhishTank quedan documentados como fuentes candidatas para el backend,
pero no se mezclan en este snapshot porque representan categorías o condiciones
de uso distintas. Google Safe Browsing tampoco se redistribuye: su API se usaría
como consulta en tiempo real respetando sus condiciones.
