# Investigación de fraude en España (2023–2026)

Fecha de revisión: 2 de octubre de 2026. La ventana de campañas del catálogo va
de noviembre de 2023 a mayo de 2026; es una selección documentada, no un censo ni
una lista de acusaciones. Las cifras nacionales se citan por separado y no se
atribuyen a estas fichas.

## Panorama y patrones

El balance 2025 de INCIBE (datos consolidados a 9 de febrero de 2026) registró
45.445 incidentes de fraude online, un 19% más que en 2024, y 25.133 incidentes
de phishing. En las consultas ciudadanas al 017, las categorías principales
fueron compras fraudulentas (17%), vishing (15%) y smishing (10%). El informe
también indica que 28% de las personas encuestadas había recibido un intento de
phishing, vishing o smishing. Estos datos dan contexto nacional, pero no miden la
prevalencia de cada ficha del catálogo.

Fuente: [Balance de ciberseguridad 2025 de INCIBE (PDF)](https://www.incibe.es/sites/default/files/2026-02/Balance%20de%20ciberseguridad%202025%20INCIBE/BalanceCiberseguridad2025_INCIBE.pdf).

El catálogo incluye 13 avisos de INCIBE y un caso de fraude empresarial
documentado por INCIBE-CERT/Guardia Civil. Cubre suplantación tributaria y de
tráfico, paquetería, banca y callback, fraude del familiar, y BEC/facturas
manipuladas. La ficha conserva fecha, canal, señuelo, acción solicitada, técnicas
y fuente primaria.

## Técnicas de URL y mensaje

- **Homógrafos Unicode:** letras cirílicas o griegas visualmente parecidas a
  latinas; se detectan mezclas de alfabetos y se calcula un esqueleto
  conservador inspirado en Unicode UTS #39, no una implementación completa.
- **Punycode, caracteres invisibles y controles bidireccionales:** pueden
  alterar la lectura o presentación de una dirección; no son prueba autónoma.
- **Typosquatting y subdominios señuelo:** inserciones/sustituciones o marcas
  situadas a la izquierda de un dominio registrable ajeno.
- **Userinfo (`marca.es@host`), texto visible distinto del destino, URL con IP,
  acortadores, HTTP, puertos extraños y rutas de credenciales/pago.** Son señales
  contextuales, no veredictos por sí solas.
- **Ingeniería social:** presión de tiempo, amenaza de bloqueo/multa, secreto,
  robo de OTP, pagos difíciles de revertir, falso soporte remoto, callback,
  falso familiar, devolución/premio y solicitudes de DNI.
- **BEC/fraude de factura:** cambio de cuenta bancaria o factura alterada durante
  una relación comercial legítima; requiere validar el cambio por un segundo
  canal conocido.

Referencias: [Unicode UTS #39](https://www.unicode.org/reports/tr39/),
[MITRE ATT&CK T1566.002](https://attack.mitre.org/techniques/T1566/002/) y
[guía de smishing de INCIBE](https://www.incibe.es/ciudadania/tematicas/ingenieria-social-fraudes-online/smishing).

## Fuentes de campañas documentadas

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
- [BEC: fraude de facturas en Segovia, 23/01/2024](https://www.incibe.es/incibe-cert/publicaciones/bitacora-de-seguridad/la-guardia-civil-de-segovia-desarticula-una-red-de-estafadores-por)
- [Correos, 10/11/2023](https://www.incibe.es/ciudadania/avisos/detectada-campana-de-suplantacion-correos-por-medio-de-phishing-cuidado)

## Registro de dominios y URLs

Lorica sincroniza los feeds activos de dominios y enlaces de
[Phishing.Database](https://github.com/Phishing-Database/Phishing.Database),
publicado bajo licencia MIT. En la sincronización del 2 de octubre de 2026 había
392.174 líneas de dominio y 789.055 líneas de URL en las fuentes; el filtro local
retuvo 2.397 dominios y 4.668 rutas URL con TLD `.es` o señales de marcas/servicios
españoles. Esto es una heurística de relevancia, no geolocalización confirmada.

La lista no se visita ni se considera exhaustiva. Al generar la instantánea se
eliminan query strings y fragmentos para no republicar valores únicos que pueden
contener correos, tokens o datos de seguimiento. La coincidencia de URLs se hace
por host y ruta; por tanto, una coincidencia no acredita que todos los parámetros
o variantes de esa ruta sean maliciosos. La interfaz muestra fecha, estado y
fallos de sincronización; un fallo conserva la última instantánea y hace fallar
el workflow para alertar al operador.

## Teléfonos y remitentes SMS

No se ha incorporado una lista de números acusados de fraude: las fuentes
comunitarias encontradas no tienen procedencia/calidad/licencia suficiente para
convertir sus entradas en un veredicto. El analizador acepta remitente/teléfono,
extrae teléfonos del mensaje y advierte de algunos prefijos de tarificación
especial; esto advierte del posible coste, no de fraude ni de titularidad. El
caller ID puede suplantarse y los números pueden reasignarse.

La [consulta pública del Registro de Alias de la CNMC](https://numeracionyoperadores.cnmc.es/alias)
permite verificar alias de remitentes SMS/MMS/RCS. La descarga automatizada de
ficheros de alias se ofrece mediante API autenticada para proveedores
registrados, según la [documentación de CNMC](https://sede.cnmc.gob.es/tramites/telecomunicaciones/gestion-del-registro-de-alias);
por eso el MVP enlaza a la consulta pero no replica el registro. La regulación
que combate la manipulación del identificador de llamada está en la
[Orden TDF/149/2025 (BOE)](https://www.boe.es/buscar/act.php?id=BOE-A-2025-2870),
pero una pantalla de caller ID no es por sí sola prueba de identidad.

## Límites de investigación

Las campañas seleccionadas no son un catálogo completo de timos españoles. Los
indicadores activos envejecen rápidamente, el filtrado puede excluir sitios
relevantes o incluir irrelevantes y los feeds comunitarios pueden contener
errores. No se incluye Safe Browsing ni URLhaus en la instantánea redistribuida:
requieren otra modalidad de consulta/licencia y revisión de privacidad antes de
integrarlos.
