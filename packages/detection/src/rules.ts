import { isOfficialDomain, trustedBrands } from "./brands";
import { extractUrls, normalizeHostname } from "./extract";
import type { Finding } from "./types";
import { confusableSkeleton, hasInvisibleOrDirectionalCharacters, hasMixedRelevantScripts } from "./unicode";

const shorteners = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "cutt.ly",
  "rb.gy", "rebrand.ly", "shorturl.at", "tiny.cc", "buff.ly", "lnkd.in"
]);
const suspiciousTlds = new Set(["top", "xyz", "click", "live", "shop", "info", "icu", "buzz", "rest", "fit", "quest", "cam", "zip", "mov"]);

function finding(
  ruleId: string,
  title: string,
  detail: string,
  recommendation: string,
  severity: Finding["severity"],
  weight: number,
  evidence?: string
): Finding {
  return { ruleId, title, detail, recommendation, severity, weight, ...(evidence ? { evidence } : {}) };
}

function rawAuthority(value: string): string {
  return value.replace(/^[a-z][a-z0-9+.-]*:\/\//iu, "").split(/[/?#]/u)[0] ?? "";
}

function levenshtein(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        (current[j - 1] ?? 0) + 1,
        (previous[j] ?? 0) + 1,
        (previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[b.length] ?? Math.max(a.length, b.length);
}

function brandForSuspiciousHost(hostname: string, rawHost: string) {
  const normalized = confusableSkeleton(rawHost || hostname);
  const labels = hostname.split(".");
  const likelyName = confusableSkeleton(labels.at(-2) ?? labels[0] ?? hostname);

  return trustedBrands.find((brand) => {
    if (isOfficialDomain(hostname, brand.officialDomains)) return false;
    return brand.tokens.some((token) => {
      const skeleton = confusableSkeleton(token);
      const threshold = skeleton.length >= 8 ? 2 : 1;
      return normalized.includes(skeleton) || levenshtein(likelyName, skeleton) <= threshold;
    });
  });
}

export function inspectUrls(text: string, knownMaliciousDomains: readonly string[]): Finding[] {
  const findings: Finding[] = [];
  const emitted = new Set<string>();
  const add = (item: Finding) => {
    const key = `${item.ruleId}:${item.evidence ?? ""}`;
    if (!emitted.has(key)) {
      emitted.add(key);
      findings.push(item);
    }
  };

  for (const original of extractUrls(text)) {
    const candidate = original.startsWith("www.") ? `https://${original}` : original.includes("://") ? original : `https://${original}`;
    const hostname = normalizeHostname(candidate);
    if (!hostname) continue;
    const authority = rawAuthority(original);
    const rawHost = (authority.split("@").at(-1) ?? authority).replace(/:\d+$/u, "");
    const tld = hostname.split(".").at(-1) ?? "";
    let parsed: URL | null = null;
    try { parsed = new URL(candidate); } catch { parsed = null; }

    const matchedKnown = knownMaliciousDomains.find((domain) => {
      const normalized = domain.toLowerCase().replace(/^www\./, "").replace(/\.$/u, "");
      return hostname === normalized || hostname.endsWith(`.${normalized}`);
    });
    if (matchedKnown) {
      add(finding("REPUTATION_KNOWN_MALICIOUS", "Coincide con un dominio de phishing conocido", "El dominio figura en el registro local de inteligencia de amenazas. Las listas pueden contener errores o quedar desactualizadas.", "No abras el enlace. Contrasta la comunicación por un canal oficial y reporta un posible falso positivo si procede.", "critical", 55, hostname));
    }
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/u.test(hostname) || /^\[[0-9a-f:]+\]$/iu.test(hostname)) {
      add(finding("URL_IP_LITERAL", "La URL usa una dirección IP", "Los servicios de confianza normalmente usan un dominio reconocible, no una IP escrita directamente.", "No introduzcas datos; busca el sitio oficial por separado.", "high", 24, hostname));
    }
    if (shorteners.has(hostname)) {
      add(finding("URL_SHORTENER", "El destino está oculto por un acortador", "Un enlace corto impide saber a simple vista qué dominio se abrirá.", "No lo abras desde el mensaje; confirma el destino con quien dice enviarlo.", "medium", 12, hostname));
    }
    if (candidate.toLowerCase().startsWith("http://")) {
      add(finding("URL_NO_TLS", "La dirección no usa HTTPS", "La ausencia de HTTPS aumenta el riesgo, aunque HTTPS por sí solo tampoco demuestra legitimidad.", "Evita enviar credenciales o datos bancarios y usa la web oficial.", "medium", 10, hostname));
    }
    if (hostname.includes("xn--")) {
      add(finding("URL_PUNYCODE", "El dominio usa caracteres internacionalizados", "La codificación punycode puede ser legítima, pero también se utiliza para ocultar letras visualmente parecidas.", "Compara el dominio letra por letra y accede desde un marcador o buscador fiable.", "high", 18, hostname));
    }
    if (hasMixedRelevantScripts(rawHost)) {
      add(finding("SUSPICIOUS_UNICODE", "Mezcla alfabetos visualmente parecidos", "El dominio combina caracteres latinos, cirílicos o griegos que pueden verse iguales con ciertas tipografías.", "No pulses el enlace y escribe manualmente el dominio oficial.", "high", 24, rawHost));
    }
    if (hasInvisibleOrDirectionalCharacters(original)) {
      add(finding("URL_INVISIBLE_CHARACTERS", "Contiene caracteres invisibles o de dirección", "Estos caracteres pueden alterar cómo se muestra o copia una dirección.", "Trata el enlace como peligroso y no lo abras.", "critical", 28, hostname));
    }
    if (authority.includes("@")) {
      add(finding("URL_USERINFO_DECEPTION", "Oculta el dominio real después de @", "El texto situado antes de @ puede parecer una marca, pero el navegador conecta con el dominio posterior.", "Comprueba el dominio que aparece después de @ y evita el enlace.", "critical", 30, authority));
    }
    if (suspiciousTlds.has(tld)) {
      add(finding("URL_RISKY_TLD", "Extensión de dominio de riesgo elevado", "Esta extensión aparece con frecuencia en campañas abusivas, aunque también puede tener usos legítimos.", "Busca corroboración adicional antes de actuar.", "medium", 9, hostname));
    }
    if (hostname.split(".").length >= 5) {
      add(finding("URL_EXCESSIVE_SUBDOMAINS", "Dominio deliberadamente difícil de leer", "Muchos subdominios pueden colocar una marca al principio y esconder el dominio registrable al final.", "Lee el dominio de derecha a izquierda antes de la primera barra.", "medium", 10, hostname));
    }
    if (original.length > 140) {
      add(finding("URL_EXCESSIVE_LENGTH", "URL anormalmente larga", "Una ruta larga puede dificultar que se vea el dominio o esconder parámetros de seguimiento y redirección.", "No confíes en el texto visible; verifica el dominio real.", "low", 6, `${hostname} (${original.length} caracteres)`));
    }
    if (parsed?.port && !["80", "443"].includes(parsed.port)) {
      add(finding("URL_NON_STANDARD_PORT", "La URL usa un puerto poco habitual", "Los portales públicos y bancarios rara vez piden acceder mediante un puerto explícito distinto de HTTPS.", "No continúes sin confirmación técnica independiente.", "medium", 12, `${hostname}:${parsed.port}`));
    }
    const brand = brandForSuspiciousHost(hostname, rawHost);
    if (brand) {
      add(finding("DOMAIN_BRAND_LOOKALIKE", `El dominio se parece a ${brand.name}, pero no es oficial`, "La marca aparece dentro de otro dominio o con letras visualmente similares.", `Abre ${brand.name} desde su aplicación o escribe su dominio oficial manualmente.`, "critical", 30, hostname));
    }
    if (/\b(?:login|signin|verify|verification|secure|account|cuenta|acceso|clave|password|otp|pin|tarjeta|pago)\b/iu.test(parsed?.pathname ?? "")) {
      add(finding("URL_CREDENTIAL_PATH", "La ruta intenta llevar a identificación o pago", "El enlace combina una ruta sensible con un origen que debe verificarse cuidadosamente.", "No introduzcas credenciales desde un enlace recibido.", "medium", 10, hostname));
    }
  }

  const markdownLinks = text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/giu);
  for (const match of markdownLinks) {
    const displayed = normalizeHostname(match[1] ?? "");
    const target = normalizeHostname(match[2] ?? "");
    if (displayed && target && displayed !== target) {
      add(finding("DISPLAYED_TARGET_MISMATCH", "El texto del enlace no coincide con el destino", "El nombre visible parece legítimo, pero el enlace apunta a otro dominio.", "No abras el enlace; usa la web oficial escrita manualmente.", "critical", 32, `${displayed} → ${target}`));
    }
  }

  return findings;
}

interface TextRule {
  id: string;
  pattern: RegExp;
  title: string;
  detail: string;
  recommendation: string;
  severity: Finding["severity"];
  weight: number;
}

const textRules: readonly TextRule[] = [
  { id: "TIME_PRESSURE", pattern: /\b(?:urgente|inmediatamente|ahora|hoy|24\s?h|último aviso|ultimo aviso|evitar (?:un )?recargo|antes de que|caduca|plazo)\b/iu, title: "Presiona para actuar deprisa", detail: "La urgencia reduce el tiempo disponible para verificar el mensaje.", recommendation: "Detente y comprueba la situación desde un canal oficial.", severity: "medium", weight: 12 },
  { id: "CREDENTIAL_OR_OTP_REQUEST", pattern: /\b(?:contraseña|password|clave|pin|código sms|codigo sms|código de verificación|codigo de verificacion|otp|cvv|credenciales)\b/iu, title: "Solicita credenciales o códigos de un solo uso", detail: "Una clave, PIN, CVV u OTP permite autorizar accesos o pagos.", recommendation: "No compartas códigos ni credenciales. Tu banco no necesita que se los dictes.", severity: "critical", weight: 26 },
  { id: "SECRECY_REQUEST", pattern: /\b(?:no se lo digas|no avises|en secreto|confidencial|no contactes|no llames a)\b/iu, title: "Pide mantener la operación en secreto", detail: "Aislar a la persona de familiares o del banco es una técnica frecuente de manipulación.", recommendation: "Consulta con alguien de confianza antes de actuar.", severity: "high", weight: 18 },
  { id: "THREAT_LANGUAGE", pattern: /\b(?:bloquead[ao]|suspendid[ao]|embargo|demanda|denuncia|multa|sanción|sancion|penalización|penalizacion|cancelaremos)\b/iu, title: "Usa una amenaza o consecuencia negativa", detail: "El miedo a perder una cuenta, un envío o dinero puede forzar una decisión impulsiva.", recommendation: "Verifica la supuesta incidencia desde la app o sede oficial.", severity: "medium", weight: 13 },
  { id: "UNEXPECTED_ACCOUNT_CHANGE", pattern: /\b(?:nuevo dispositivo|acceso no autorizado|movimiento inusual|cargo no reconocido|cuenta suspendida|tarjeta bloqueada)\b/iu, title: "Avisa de un cambio inesperado en una cuenta", detail: "Este pretexto se usa para dirigir a falsas páginas bancarias.", recommendation: "Abre directamente la aplicación de tu entidad; no uses el enlace.", severity: "high", weight: 18 },
  { id: "IRREVERSIBLE_PAYMENT_METHOD", pattern: /\b(?:bizum|transferencia inmediata|criptomoneda|bitcoin|ethereum|tarjeta regalo|gift card|western union|moneygram|pago por adelantado)\b/iu, title: "Propone un pago difícil de recuperar", detail: "Los estafadores priorizan medios rápidos o con poca reversibilidad.", recommendation: "No pagues hasta verificar identidad, concepto y destinatario.", severity: "high", weight: 20 },
  { id: "SOFTWARE_INSTALL_REQUEST", pattern: /\b(?:instala|descarga|aplicación de seguridad|aplicacion de seguridad|anydesk|teamviewer|control remoto|soporte remoto|archivo apk|habilita macros)\b/iu, title: "Pide instalar software o dar control remoto", detail: "Una aplicación o sesión remota puede dar acceso total al dispositivo y a la banca.", recommendation: "No instales nada y corta la comunicación.", severity: "critical", weight: 28 },
  { id: "RETURN_PROMISE", pattern: /\b(?:rentabilidad garantizada|beneficio garantizado|duplica(?:r)? tu dinero|sin riesgo|ganancias? diarias?|forex|inversión exclusiva|inversion exclusiva)\b/iu, title: "Promete una inversión extraordinaria o sin riesgo", detail: "Las falsas inversiones usan rendimientos irreales y presión para aportar más dinero.", recommendation: "Comprueba la entidad en CNMV y desconfía de cualquier rentabilidad garantizada.", severity: "high", weight: 22 },
  { id: "FAMILY_IMPERSONATION", pattern: /\b(?:soy tu hijo|soy tu hija|mamá|mama|papá|papa).{0,80}\b(?:nuevo número|nuevo numero|móvil roto|movil roto|no puedo hablar|necesito dinero|hazme un bizum)\b/isu, title: "Podría suplantar a un familiar", detail: "El fraude del familiar con un número nuevo intenta provocar un pago antes de confirmar la identidad.", recommendation: "Llama al número habitual o formula una pregunta que solo la persona real conozca.", severity: "critical", weight: 28 },
  { id: "CALLBACK_PHISHING", pattern: /\b(?:llama|llámanos|llamanos|contacta).{0,50}\b(?:este número|este numero|teléfono|telefono|urgente)\b/isu, title: "Induce a llamar a un número incluido en el mensaje", detail: "El callback phishing sustituye el enlace por una llamada a un falso agente.", recommendation: "Usa únicamente el teléfono publicado en la web o app oficial.", severity: "high", weight: 18 },
  { id: "IDENTITY_DOCUMENT_REQUEST", pattern: /\b(?:foto|fotografía|fotografia|selfie|copia).{0,40}\b(?:dni|nie|pasaporte|nómina|nomina|tarjeta sanitaria)\b/isu, title: "Solicita documentos de identidad", detail: "DNI, selfies y nóminas pueden facilitar suplantaciones posteriores.", recommendation: "No los envíes desde un enlace o chat no verificado.", severity: "high", weight: 22 },
  { id: "UNEXPECTED_REWARD", pattern: /\b(?:premio|regalo|reembolso|devolución|devolucion|ayuda de \d+|artículo gratuito|articulo gratuito).{0,80}\b(?:enlace|datos|tarjeta|pago|confirm)\b/isu, title: "Ofrece un premio, devolución o ayuda inesperada", detail: "El incentivo económico se utiliza para obtener datos personales o cobrar una pequeña tasa.", recommendation: "Consulta la ayuda o devolución desde la sede oficial.", severity: "medium", weight: 15 }
] as const;

export function inspectText(text: string): Finding[] {
  return textRules.flatMap((rule) => rule.pattern.test(text)
    ? [finding(rule.id, rule.title, rule.detail, rule.recommendation, rule.severity, rule.weight)]
    : []);
}
