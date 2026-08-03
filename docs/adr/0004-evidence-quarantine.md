# ADR 0004: evidencias privadas con cuarentena

- Estado: aceptada para el MVP
- Fecha: 2026-07-24
- Responsables: seguridad, privacidad y arquitectura

## Contexto

Las capturas y documentos pueden contener datos personales, metadatos de
localización, contenido activo o malware. El tipo declarado por el navegador y
la extensión del nombre no son confiables. A la vez, una evidencia debe mantener
integridad y cadena de custodia suficiente para un expediente generado por el
usuario, sin prometer valor probatorio legal.

## Decisión

El puerto de almacenamiento expondrá almacenamiento privado compatible con S3;
MinIO será su implementación local. Existirán al menos tres zonas lógicas:

- `quarantine`: originales inaccesibles para descarga normal;
- `private`: originales aprobados, si conservarlos es necesario y consentido;
- `derived`: vistas sanitizadas, miniaturas, texto OCR y exportaciones.

Los objetos usarán claves opacas generadas por el servidor. Ningún bucket será
público.

### Flujo

1. Un endpoint autorizado crea una intención con propietario, propósito, tipos
   admitidos, tamaño máximo y expiración.
2. El cliente sube a cuarentena mediante una operación firmada y restringida.
3. El cliente confirma la subida; el servidor comprueba existencia, tamaño,
   checksum y cabecera real antes de encolar el procesamiento.
4. Un worker aislado identifica el tipo por bytes, analiza malware mediante un
   puerto `MalwareScanner`, rechaza contenido no permitido y registra resultado.
5. Las imágenes se decodifican y recodifican para retirar metadatos; OCR trabaja
   sobre el derivado sanitizado. Los PDF no se representan inline en el MVP y
   requieren escaneo antes de quedar disponibles.
6. Solo un estado `AVAILABLE` permite obtener una URL de lectura firmada, corta
   y emitida después de volver a comprobar autorización.

Los tipos iniciales propuestos son JPEG, PNG y PDF. Otros formatos quedan fuera
hasta disponer de sanitización, escaneo y pruebas específicas. Una discrepancia
de MIME, un archivo poliglota no soportado, contenido cifrado o un fallo del
escáner produce cuarentena o rechazo; nunca aprobación por defecto.

La evidencia registra hash criptográfico, tamaño, tipo detectado, estado de
escaneo, versión del escáner, objeto original/derivado, propietario, fechas,
retención y eventos de acceso. Ni el hash ni el OCR se escriben en logs
técnicos.

El análisis de URLs no se ejecutará desde este pipeline de archivos. Tendrá un
worker con política de salida propia, bloqueo de direcciones internas y
revalidación de DNS e IP en cada redirección.

## Consecuencias

### Positivas

- Un archivo no confiable no se sirve antes de ser validado.
- MinIO y S3 implementan el mismo contrato de dominio.
- La separación original/derivado permite minimizar exposición y retirar EXIF.
- Los hashes ayudan a detectar alteración y deduplicar sin usar nombres reales.

### Negativas

- El análisis es asíncrono y añade estados visibles al usuario.
- PDF y formatos complejos mantienen riesgo residual aun después del escaneo.
- Conservar originales aumenta las obligaciones de retención y respuesta a
  derechos.

## Alternativas descartadas

- **Guardar binarios en PostgreSQL:** complica escalado, backup y entrega
  temporal.
- **Confiar en extensión o `Content-Type`:** ambos son controlados por el
  atacante.
- **Servir el original inmediatamente:** crea una vía de distribución de
  malware y fuga de metadatos.
- **URL S3 persistente guardada en base de datos:** dificulta revocación y puede
  filtrar estructura interna.

## Pendiente antes de Fase 4

- Elegir y validar el escáner, sandbox y proceso de actualización de firmas.
- Fijar límites, expiración de URLs y retención por propósito.
- Realizar una revisión específica de PDF, OCR y archivos con contenido activo.
- Validar legalmente la cadena de custodia y el texto del PDF exportado.

