export { analyzeMessage } from "./analyze";
export { extractIndicators, extractUrls, normalizeHostname } from "./extract";
export { trustedBrands, trustedBankBrands } from "./brands";
export { confusableSkeleton, hasInvisibleOrDirectionalCharacters, hasMixedRelevantScripts } from "./unicode";
export type { AnalysisOptions, AnalysisResult, ExtractedIndicator, Finding, RiskLevel, Severity } from "./types";
