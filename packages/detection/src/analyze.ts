import { extractIndicators } from "./extract";
import { inspectPhones, inspectSender, inspectText, inspectUrls } from "./rules";
import type { AnalysisOptions, AnalysisResult, Finding, RiskLevel } from "./types";
import { unicodeMethodologyNote } from "./unicode";

const severityOrder: Record<Finding["severity"], number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1
};

function riskLevelFor(score: number, findings: readonly Finding[]): RiskLevel {
  const highSignalFamilies = new Set(
    findings
      .filter((item) => item.severity === "critical" || item.severity === "high")
      .map((item) => item.ruleId.split("_")[0])
  );
  const verifiedThreatMatch = findings.some((item) => item.ruleId === "REPUTATION_KNOWN_MALICIOUS");
  const userReportedThreatMatch = findings.some((item) => item.ruleId.startsWith("USER_REPORTED_MALICIOUS_"));
  if (score >= 75 && (verifiedThreatMatch || userReportedThreatMatch || highSignalFamilies.size >= 2)) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function summaryFor(level: RiskLevel): string {
  switch (level) {
    case "critical": return "Hay varias señales fuertes compatibles con un fraude. No realices la acción solicitada.";
    case "high": return "El contenido presenta señales importantes de riesgo y necesita verificación independiente.";
    case "medium": return "Hay señales que justifican precaución. Comprueba remitente, dominio y petición.";
    default: return "No se han encontrado señales fuertes con las reglas disponibles, pero esto no demuestra que sea seguro.";
  }
}

function actionsFor(findings: readonly Finding[]): string[] {
  const recommendations = [...findings]
    .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity] || b.weight - a.weight)
    .map((item) => item.recommendation);
  return [...new Set([
    ...recommendations,
    "No uses enlaces o teléfonos del propio mensaje; busca el canal oficial por separado.",
    "Si ya facilitaste datos bancarios, llama inmediatamente a tu banco.",
    "Guarda capturas y reporta el incidente a INCIBE (017) o a las Fuerzas y Cuerpos de Seguridad."
  ])].slice(0, 6);
}

export function analyzeMessage(text: string, options: AnalysisOptions = {}): AnalysisResult {
  const normalizedText = text.trim();
  const findings = [
    ...inspectUrls(normalizedText, options.knownMaliciousDomains ?? [], options.knownMaliciousUrls ?? [], options.userReportedMaliciousDomains ?? []),
    ...inspectSender(options.sender, options.knownMaliciousPhones ?? [], options.userReportedMaliciousPhones ?? []),
    ...inspectPhones(normalizedText, options.knownMaliciousPhones ?? [], options.userReportedMaliciousPhones ?? []),
    ...inspectText(normalizedText)
  ].sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity] || b.weight - a.weight);

  const rawScore = findings.reduce((total, item) => total + item.weight, 0);
  const score = Math.min(100, rawScore);
  const riskLevel = riskLevelFor(score, findings);

  return {
    score,
    riskLevel,
    summary: summaryFor(riskLevel),
    findings,
    indicators: extractIndicators(normalizedText),
    actions: actionsFor([...findings]),
    coverage: [
      "URLs y dominios: estructura, punycode, alfabetos mezclados, caracteres invisibles y coincidencia exacta local",
      "Suplantación de marcas españolas y dominios conocidos",
      "Urgencia, amenazas, secreto, credenciales, pagos y control remoto",
      "Patrones recientes de smishing, phishing, vishing e inversión fraudulenta"
    ],
    limitations: [
      "El análisis es heurístico: puede equivocarse y no sustituye a INCIBE, tu banco ni las autoridades.",
      "La identificación del remitente telefónico puede suplantarse; la numeración o un reporte no prueban quién llamó ni que un titular sea fraudulento.",
      "No visita enlaces, resuelve DNS ni analiza el contenido remoto de una web.",
      unicodeMethodologyNote,
      "Una ausencia en el registro de amenazas no demuestra que un dominio sea seguro."
    ],
    ruleSetVersion: "lorica-es-2026.10.1"
  };
}
