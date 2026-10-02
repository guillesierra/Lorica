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

  it("flags user-reported banking fraud domains with explicit provenance", () => {
    const result = analyzeMessage("Verifica tu acceso en https://www.santander-ayuda.com/es", {
      userReportedMaliciousDomains: ["santander-ayuda.com"]
    });
    const report = result.findings.find((item) => item.ruleId === "USER_REPORTED_MALICIOUS_DOMAIN");
    expect(report?.severity).toBe("critical");
    expect(report?.detail).toContain("reporte aportado por el usuario");
    expect(result.riskLevel).toBe("critical");
  });

  it("flags each screenshot-reported URL even when its brand is not recognizable", () => {
    for (const domain of ["es.incidencia-santander.com", "particulares-inicio.net"]) {
      const result = analyzeMessage(`Consulta tu cuenta: https://${domain}/`, {
        userReportedMaliciousDomains: [domain]
      });
      expect(result.riskLevel).toBe("critical");
      expect(result.findings.some((item) => item.ruleId === "USER_REPORTED_MALICIOUS_DOMAIN")).toBe(true);
    }
  });

  it("flags a user-reported phone found in an SMS without treating it as caller-ID proof", () => {
    const result = analyzeMessage("Si no reconoces la operación llama al 919598345.", {
      userReportedMaliciousPhones: ["+34919598345"]
    });
    const report = result.findings.find((item) => item.ruleId === "USER_REPORTED_MALICIOUS_PHONE");
    expect(report?.severity).toBe("critical");
    expect(report?.detail).toContain("identificador de llamada puede suplantarse");
    expect(result.riskLevel).toBe("critical");
  });

  it("flags money-related messages that ask the user to call a number", () => {
    const result = analyzeMessage("Para una transferencia bancaria utiliza el código de seguridad. Si no la reconoces, llama al 667751941.", {
      userReportedMaliciousPhones: ["+34667751941"]
    });
    expect(result.findings.some((item) => item.ruleId === "MONEY_WITH_CALL_OR_DATA_REQUEST")).toBe(true);
    expect(result.findings.some((item) => item.ruleId === "USER_REPORTED_MALICIOUS_PHONE")).toBe(true);
  });

  it("flags money-related messages that request sensitive data", () => {
    const result = analyzeMessage("Hay una transferencia pendiente. Confirma tus datos bancarios para continuar.");
    expect(result.findings.some((item) => item.ruleId === "MONEY_WITH_CALL_OR_DATA_REQUEST")).toBe(true);
  });

  it("raises customs parcel messages asking for a Bizum payment to at least medium risk", () => {
    const result = analyzeMessage("para liberar su paquete en la aduana tiene que pagar 100 eur a este numero por bizum, 682828929");
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.riskLevel).toBe("high");
    expect(result.findings.some((item) => item.ruleId === "DELIVERY_CUSTOMS_PAYMENT_REQUEST")).toBe(true);
    expect(result.findings.some((item) => item.ruleId === "MONEY_REQUESTED_VIA_BIZUM_PHONE")).toBe(true);
  });

  it("doubles the score contribution of low and informational findings", () => {
    const result = analyzeMessage(`Revisa esta ruta ${"x".repeat(145)} en https://example.org/${"x".repeat(145)}`);
    expect(result.findings.some((item) => item.severity === "low" || item.severity === "info")).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(result.findings.reduce((sum, item) => sum + item.weight, 0));
  });

  it("flags bank-branded links outside the bank domain list", () => {
    const suspicious = analyzeMessage("BBVA: confirma tu cuenta en https://cuenta-segura.example/login");
    expect(suspicious.findings.some((item) => item.ruleId === "BANK_LINK_DOMAIN_MISMATCH")).toBe(true);

    const official = analyzeMessage("BBVA: consulta tu cuenta en https://www.bbva.es/");
    expect(official.findings.some((item) => item.ruleId === "BANK_LINK_DOMAIN_MISMATCH")).toBe(false);

    const ruralvia = analyzeMessage("Ruralvía: consulta tu cuenta en https://cajarural.ruralvia.com/");
    expect(ruralvia.findings.some((item) => item.ruleId === "BANK_LINK_DOMAIN_MISMATCH")).toBe(false);
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
