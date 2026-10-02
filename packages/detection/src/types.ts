export type RiskLevel = "low" | "medium" | "high" | "critical";
export type Severity = "info" | "low" | "medium" | "high" | "critical";
export type IndicatorType = "url" | "domain" | "email" | "phone" | "iban" | "wallet";

export interface ExtractedIndicator {
  type: IndicatorType;
  value: string;
  displayValue: string;
}

export interface Finding {
  ruleId: string;
  title: string;
  detail: string;
  recommendation: string;
  severity: Severity;
  weight: number;
  evidence?: string;
}

export interface AnalysisOptions {
  knownMaliciousDomains?: readonly string[];
  knownMaliciousUrls?: readonly string[];
  knownMaliciousPhones?: readonly string[];
  sender?: string;
  now?: Date;
}

export interface AnalysisResult {
  score: number;
  riskLevel: RiskLevel;
  summary: string;
  findings: Finding[];
  indicators: ExtractedIndicator[];
  actions: string[];
  coverage: string[];
  limitations: string[];
  ruleSetVersion: string;
}

export interface BrandDefinition {
  name: string;
  tokens: readonly string[];
  officialDomains: readonly string[];
}
