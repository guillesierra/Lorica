import { describe, expect, it } from "vitest";
import { analyzeMessage, confusableSkeleton, extractIndicators } from "../src/index";

describe("analyzeMessage", () => {
  it("keeps a neutral message at low risk without claiming it is safe", () => {
    const result = analyzeMessage("Nos vemos mañana a las seis en casa.");
    expect(result.riskLevel).toBe("low");
    expect(result.score).toBe(0);
    expect(result.summary).toContain("no demuestra");
  });

  it("detects a brand placed inside a non-official domain", () => {
    const result = analyzeMessage("Actualiza el envío en https://correos-entrega-segura.example.com/pago");
    expect(result.findings.some((item) => item.ruleId === "DOMAIN_BRAND_LOOKALIKE")).toBe(true);
    expect(result.riskLevel).not.toBe("low");
  });

  it("detects URL userinfo deception", () => {
    const result = analyzeMessage("Entra en https://correos.es@malicioso.example/seguimiento");
    expect(result.findings.some((item) => item.ruleId === "URL_USERINFO_DECEPTION")).toBe(true);
  });

  it("detects mixed-script homographs", () => {
    const result = analyzeMessage("Accede a https://cоrreos.example/ ahora", { knownMaliciousDomains: [] });
    expect(result.findings.some((item) => item.ruleId === "SUSPICIOUS_UNICODE")).toBe(true);
  });

  it("detects punycode domains", () => {
    const result = analyzeMessage("Comprueba https://xn--correos-9za.example/login");
    expect(result.findings.some((item) => item.ruleId === "URL_PUNYCODE")).toBe(true);
  });

  it("detects credential pressure", () => {
    const result = analyzeMessage("URGENTE: tu cuenta será bloqueada hoy. Confirma contraseña, PIN y código SMS.");
    expect(result.findings.some((item) => item.ruleId === "CREDENTIAL_OR_OTP_REQUEST")).toBe(true);
    expect(result.findings.some((item) => item.ruleId === "TIME_PRESSURE")).toBe(true);
    expect(result.riskLevel).toBe("high");
  });

  it("detects family impersonation", () => {
    const result = analyzeMessage("Mamá, soy tu hijo. Este es mi nuevo número, se rompió mi móvil y necesito dinero. Hazme un Bizum urgente.");
    expect(result.findings.some((item) => item.ruleId === "FAMILY_IMPERSONATION")).toBe(true);
  });

  it("matches a known malicious domain and its subdomains", () => {
    const result = analyzeMessage("https://login.phish.example/", { knownMaliciousDomains: ["phish.example"] });
    expect(result.findings.some((item) => item.ruleId === "REPUTATION_KNOWN_MALICIOUS")).toBe(true);
    expect(result.riskLevel).toBe("high");
  });

  it("only raises critical when strong independent signals cross the gate", () => {
    const result = analyzeMessage("URGENTE: instala AnyDesk, confirma tu contraseña y código SMS y haz un Bizum en https://banco-seguro.example/login");
    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.riskLevel).toBe("critical");
  });

  it("detects displayed destination mismatch", () => {
    const result = analyzeMessage("[https://correos.es](https://evil.example/pago)");
    expect(result.findings.some((item) => item.ruleId === "DISPLAYED_TARGET_MISMATCH")).toBe(true);
  });
});

describe("indicator extraction", () => {
  it("extracts and masks sensitive indicators", () => {
    const indicators = extractIndicators("Escribe a fraude@example.com o paga al ES12 1234 1234 1234 1234 1234");
    expect(indicators.some((item) => item.type === "email")).toBe(true);
    expect(indicators.some((item) => item.type === "iban" && item.displayValue.includes("…"))).toBe(true);
  });

  it("creates comparable skeletons for common confusables", () => {
    expect(confusableSkeleton("cоrreos")).toBe("correos");
  });
});
