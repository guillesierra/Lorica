export type CampaignChannel = "SMS" | "WhatsApp" | "Email" | "Llamada" | "Web" | "Redes sociales";

export interface ScamCampaign {
  id: string;
  publishedAt: string;
  title: string;
  impersonates: string;
  channels: readonly CampaignChannel[];
  techniques: readonly string[];
  requestedDataOrAction: string;
  severity: "media" | "alta" | "crítica";
  sourceTitle: string;
  sourceUrl: string;
}

export const scamCampaigns: readonly ScamCampaign[] = [
  {
    id: "incibe-aeat-sms-2026-05",
    publishedAt: "2026-05-26",
    title: "Comunicaciones falsas de la Agencia Tributaria",
    impersonates: "Agencia Tributaria",
    channels: ["SMS"],
    techniques: ["smishing", "suplantación institucional", "enlace fraudulento"],
    requestedDataOrAction: "Acceder a una falsa notificación tributaria",
    severity: "alta",
    sourceTitle: "La Agencia Tributaria NO ha emitido ninguna comunicación dirigida a usted",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/la-agencia-tributaria-no-ha-emitido-ninguna-comunicacion-dirigida-usted"
  },
  {
    id: "incibe-aeat-dehu-2026-02",
    publishedAt: "2026-02-03",
    title: "Notificaciones falsas de AEAT y DEHú",
    impersonates: "AEAT y DEHú",
    channels: ["SMS", "Email"],
    techniques: ["phishing", "smishing", "apariencia administrativa"],
    requestedDataOrAction: "Abrir una notificación falsa y facilitar información",
    severity: "alta",
    sourceTitle: "Notificaciones falsas que suplantan a la Agencia Tributaria (AEAT) y a la DEHú",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/notificaciones-falsas-que-suplantan-la-agencia-tributaria-aeat-y-la-direccion"
  },
  {
    id: "incibe-paquetes-2025-12",
    publishedAt: "2025-12-19",
    title: "Paquete retenido por falta del número de casa",
    impersonates: "Empresas de paquetería",
    channels: ["SMS"],
    techniques: ["smishing", "pago pequeño", "formulario clonado"],
    requestedDataOrAction: "Completar dirección y datos de tarjeta",
    severity: "alta",
    sourceTitle: "Campaña de smishing que suplanta a empresas de paquetería",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/campana-de-smishing-que-suplanta-empresas-de-paqueteria-con-la-excusa-de-que"
  },
  {
    id: "incibe-banco-callback-2025-09",
    publishedAt: "2025-09-30",
    title: "SMS bancario que induce a llamar a un falso agente",
    impersonates: "Entidades bancarias",
    channels: ["SMS", "Llamada"],
    techniques: ["callback phishing", "vishing", "spoofing del remitente"],
    requestedDataOrAction: "Llamar al teléfono del mensaje y revelar claves o autorizar operaciones",
    severity: "alta",
    sourceTitle: "Campaña de smishing que suplanta a entidades bancarias solicitando que les llames",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/campana-de-smishing-que-suplanta-entidades-bancarias-solicitando-que-les-llames"
  },
  {
    id: "incibe-banco-prestamo-2025-10",
    publishedAt: "2025-10-14",
    title: "Falso préstamo online en nombre de un banco",
    impersonates: "Entidad bancaria",
    channels: ["Web", "Email", "Llamada"],
    techniques: ["suplantación bancaria", "préstamo falso", "pago anticipado"],
    requestedDataOrAction: "Solicitar un préstamo en una web fraudulenta y seguir instrucciones de pago o entrega de datos",
    severity: "alta",
    sourceTitle: "Préstamo online fraudulento suplantando a una entidad bancaria (caso real 017)",
    sourceUrl: "https://www.incibe.es/linea-de-ayuda-en-ciberseguridad/casos-reales"
  },
  {
    id: "incibe-dgt-2025-09",
    publishedAt: "2025-09-16",
    title: "Falsas multas de tráfico por SMS y correo",
    impersonates: "DGT",
    channels: ["SMS", "Email"],
    techniques: ["urgencia", "descuento falso", "web clonada"],
    requestedDataOrAction: "Pagar una multa inexistente y facilitar tarjeta",
    severity: "alta",
    sourceTitle: "La DGT no está enviando correos ni SMS para notificar multas de tráfico",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/la-dgt-no-esta-enviando-correos-ni-sms-para-notificar-multas-de-trafico"
  },
  {
    id: "incibe-falso-hijo-2025-05",
    publishedAt: "2025-05-08",
    title: "Familiar con un número nuevo que necesita dinero",
    impersonates: "Hijo o hija",
    channels: ["SMS", "WhatsApp"],
    techniques: ["suplantación familiar", "urgencia", "aislamiento"],
    requestedDataOrAction: "Continuar por WhatsApp y realizar una transferencia o Bizum",
    severity: "alta",
    sourceTitle: "¿Has recibido un mensaje desde un número desconocido que dice ser tu hijo?",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/has-recibido-un-mensaje-desde-un-numero-desconocido-que-dice-ser-tu-hijo"
  },
  {
    id: "incibe-dgt-pago-2025-04",
    publishedAt: "2025-04-03",
    title: "Notificaciones de multas falsas con pago guiado",
    impersonates: "DGT",
    channels: ["SMS", "Email", "Web"],
    techniques: ["phishing", "smishing", "formularios por etapas", "petición de PIN"],
    requestedDataOrAction: "Introducir datos personales, tarjeta y PIN",
    severity: "alta",
    sourceTitle: "Distribución de notificaciones de multas falsas suplantando a la DGT",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/distribucion-de-notificaciones-de-multas-falsas-por-correo-y-mensaje-suplantando"
  },
  {
    id: "incibe-dgt-dni-2024-11",
    publishedAt: "2024-11-15",
    title: "Falsa multa que solicita una fotografía del DNI",
    impersonates: "DGT",
    channels: ["SMS", "Web"],
    techniques: ["robo documental", "web clonada", "smishing"],
    requestedDataOrAction: "Subir una imagen del DNI y pagar una multa",
    severity: "alta",
    sourceTitle: "La DGT no está solicitando una imagen de tu DNI para pagar una multa",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/la-dgt-no-esta-solicitando-traves-de-una-web-una-imagen-de-tu-dni-para-pagar-una"
  },
  {
    id: "incibe-dgt-oleadas-2024-08",
    publishedAt: "2024-08-19",
    title: "Oleadas de falsas multas DGT con plazo de 24 horas",
    impersonates: "DGT",
    channels: ["SMS", "Email"],
    techniques: ["urgencia de 24 horas", "recargo falso", "web clonada"],
    requestedDataOrAction: "Pagar antes de un supuesto incremento de la sanción",
    severity: "alta",
    sourceTitle: "Varias oleadas de SMS y correos fraudulentos suplantando a la DGT",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/varias-oleadas-de-sms-y-correos-fraudulentos-suplantando-la-dgt-inundan-las"
  },
  {
    id: "incibe-correos-2024-06",
    publishedAt: "2024-06-11",
    title: "Incidencia falsa con un paquete de Correos",
    impersonates: "Correos",
    channels: ["SMS", "Web"],
    techniques: ["pago pequeño", "falta de dirección", "doble formulario"],
    requestedDataOrAction: "Completar datos personales, tarjeta y supuesto código SMS",
    severity: "media",
    sourceTitle: "Correos no está enviando mensajes por una incidencia con tu paquete",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/correos-no-esta-enviando-mensajes-para-comunicarte-que-existe-una-incidencia-con"
  },
  {
    id: "incibe-aeat-renta-2024-04",
    publishedAt: "2024-04-08",
    title: "Devolución falsa de la Renta por SMS",
    impersonates: "Agencia Tributaria",
    channels: ["SMS", "Web"],
    techniques: ["reembolso inesperado", "faltas intencionadas", "URL no oficial"],
    requestedDataOrAction: "Introducir nombre, tarjeta, CVV y PIN",
    severity: "media",
    sourceTitle: "Suplantación de la Agencia Tributaria vía SMS durante la Renta 2023",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/suplantacion-de-la-agencia-tributaria-sms-durante-el-periodo-de-presentacion-de"
  },
  {
    id: "incibe-bancos-2024-01",
    publishedAt: "2024-01-31",
    title: "Movimientos inusuales y bloqueo de cuentas bancarias",
    impersonates: "Entidades bancarias españolas",
    channels: ["SMS", "Web"],
    techniques: ["alarma bancaria", "nuevo dispositivo", "robo de credenciales"],
    requestedDataOrAction: "Iniciar sesión en una falsa banca online",
    severity: "alta",
    sourceTitle: "Campañas que suplantan entidades bancarias a través de smishing",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/detectadas-campanas-que-suplantan-la-identidad-de-varias-entidades-bancarias"
  },
  {
    id: "incibe-banco-cargos-2023-06",
    publishedAt: "2023-06-28",
    title: "Falsos cargos y bloqueo de cuentas bancarias",
    impersonates: "Entidades bancarias",
    channels: ["SMS", "Web"],
    techniques: ["smishing", "falso cargo", "bloqueo de cuenta", "robo de credenciales"],
    requestedDataOrAction: "Abrir el enlace, iniciar sesión y facilitar claves bancarias ante un supuesto cargo",
    severity: "alta",
    sourceTitle: "Campañas de suplantación de entidades bancarias con falsos cargos y bloqueo de cuentas",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/campanas-de-suplantacion-de-entidades-bancarias-con-falsos-cargos-y-bloqueo-de"
  },
  {
    id: "incibe-correos-2023-11",
    publishedAt: "2023-11-10",
    title: "Actualización falsa de entrega de Correos",
    impersonates: "Correos",
    channels: ["SMS", "Email", "Web"],
    techniques: ["dominio casi idéntico", "phishing", "actualización de entrega"],
    requestedDataOrAction: "Actualizar información de entrega en una web falsa",
    severity: "media",
    sourceTitle: "Detectada campaña de suplantación a Correos por medio de phishing",
    sourceUrl: "https://www.incibe.es/ciudadania/avisos/detectada-campana-de-suplantacion-correos-por-medio-de-phishing-cuidado"
  },
  {
    id: "guardia-civil-bec-2024-01",
    publishedAt: "2024-01-23",
    title: "Fraude al proveedor mediante facturas y correo intervenido",
    impersonates: "Proveedor o interlocutor empresarial legítimo",
    channels: ["Email"],
    techniques: ["Business Email Compromise", "factura manipulada", "desvío de pagos", "mulas financieras"],
    requestedDataOrAction: "Pagar facturas alteradas a una cuenta controlada por los estafadores",
    severity: "crítica",
    sourceTitle: "La Guardia Civil desarticula una red que estafó más de 112.000 euros a una empresa segoviana",
    sourceUrl: "https://www.incibe.es/incibe-cert/publicaciones/bitacora-de-seguridad/la-guardia-civil-de-segovia-desarticula-una-red-de-estafadores-por"
  }
] as const;
