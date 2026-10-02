export type ReportedIndicatorType = "domain" | "phone";

export interface UserReportedIndicator {
  type: ReportedIndicatorType;
  value: string;
  brand: string;
  campaign: string;
  channel: "SMS";
  source: "user-provided screenshot";
}

// User-provided evidence. These indicators are not independently verified by Lorica.
export const userReportedIndicators: readonly UserReportedIndicator[] = [
  {
    type: "domain",
    value: "seg-pocpcxa-es.online",
    brand: "Seguridad Social (suplantación alegada en el mensaje)",
    campaign: "Falso aviso de actualización de datos",
    channel: "SMS",
    source: "user-provided screenshot"
  },
  {
    type: "domain",
    value: "santander-ayuda.com",
    brand: "Santander",
    campaign: "Falsa alerta de operación desde un dispositivo nuevo",
    channel: "SMS",
    source: "user-provided screenshot"
  },
  {
    type: "domain",
    value: "es.incidencia-santander.com",
    brand: "Santander",
    campaign: "Falsa transferencia no reconocida",
    channel: "SMS",
    source: "user-provided screenshot"
  },
  {
    type: "domain",
    value: "particulares-inicio.net",
    brand: "Entidad bancaria suplantada",
    campaign: "Falso acceso desde otro móvil",
    channel: "SMS",
    source: "user-provided screenshot"
  },
  {
    type: "phone",
    value: "+34919598345",
    brand: "Santander (suplantación alegada en el mensaje)",
    campaign: "Número de llamada incluido en un falso aviso de transferencia",
    channel: "SMS",
    source: "user-provided screenshot"
  }
] as const;

export const userReportedMaliciousDomains = userReportedIndicators
  .filter((indicator) => indicator.type === "domain")
  .map((indicator) => indicator.value);

export const userReportedMaliciousPhones = userReportedIndicators
  .filter((indicator) => indicator.type === "phone")
  .map((indicator) => indicator.value);
