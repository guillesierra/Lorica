import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const feeds = [
  { name: "phishing-domains", url: "https://raw.githubusercontent.com/Phishing-Database/Phishing.Database/master/phishing-domains-ACTIVE.txt", kind: "domain" },
  { name: "phishing-urls", url: "https://raw.githubusercontent.com/Phishing-Database/Phishing.Database/master/phishing-links-ACTIVE.txt", kind: "url" }
];
const outputPath = resolve("packages/knowledge/src/generated-threats.ts");
const reportModulePath = resolve("packages/knowledge/src/generated-threat-report.ts");
const reportPath = resolve("data/threat-intel-report.json");
const spanishSignals = [
  "aeat", "agenciatributaria", "dgt", "trafico", "correos", "seur", "mrw", "gls",
  "bizum", "bbva", "caixa", "santander", "bankinter", "sabadell", "abanca", "unicaja",
  "kutxa", "openbank", "iberdrola", "endesa", "aemet", "seg-social", "seguridadsocial",
  "incibe", "clave", "dehu", "renfe", "movistar", "vodafone", "orange", "wallapop"
];
const now = new Date().toISOString();

function normalizeDomain(line) {
  const value = line.trim().toLowerCase().replace(/^\.+|\.+$/g, "");
  if (!value || value.startsWith("#") || value.length > 253) return null;
  if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9-]{2,63}$/.test(value)) return null;
  return value;
}

function normalizeUrl(line) {
  const value = line.trim();
  if (!value || value.startsWith("#") || value.length > 4_096) return null;
  try {
    const url = new URL(value);
    if (!(["http:", "https:"].includes(url.protocol)) || url.username || url.password) return null;
    url.hostname = url.hostname.toLowerCase().replace(/\.$/u, "");
    // Never republish query strings: feeds can contain unique emails, tokens or tracking values.
    url.search = "";
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function isRelevantToSpain(domain) {
  return domain.endsWith(".es") || spanishSignals.some((signal) => domain.includes(signal));
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Lorica-Threat-Intel/0.1 (+https://github.com/guillesierra/Lorica)" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

const results = {};
const errors = [];
for (const feed of feeds) {
  try {
    const sourceText = await fetchText(feed.url);
    if (!sourceText.trim()) throw new Error("feed vacío");
    results[feed.name] = { ok: true, url: feed.url, lines: sourceText.split(/\r?\n/) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results[feed.name] = { ok: false, url: feed.url, error: message };
    errors.push(`${feed.name}: ${message}`);
  }
}

let previous = null;
try {
  const previousText = await readFile(outputPath, "utf8");
  const serialized = previousText.match(/export const threatSnapshot = ([\s\S]*?) as const;\s*$/u)?.[1];
  if (serialized) previous = JSON.parse(serialized);
} catch {
  // The checked-in snapshot may not exist on the first run.
}
let allDomains = previous?.domains ? [...previous.domains] : [];
let domainsUpdated = false;
if (results["phishing-domains"].ok) {
  const all = [...new Set(results["phishing-domains"].lines.map(normalizeDomain).filter(Boolean))].sort();
  allDomains = all.filter(isRelevantToSpain).slice(0, 5_000);
  domainsUpdated = true;
}

let urls = previous?.urls ? [...previous.urls] : [];
let urlsUpdated = false;
if (results["phishing-urls"].ok) {
  const normalized = [...new Set(results["phishing-urls"].lines.map(normalizeUrl).filter(Boolean))];
  urls = normalized.filter((value) => {
    try { return isRelevantToSpain(new URL(value).hostname.toLowerCase()); } catch { return false; }
  }).slice(0, 10_000).sort();
  urlsUpdated = true;
}

const successCount = Number(domainsUpdated) + Number(urlsUpdated);
const status = successCount === feeds.length ? "synced-active-feed" : successCount ? "partial-feed" : "stale-feed";
const generatedAt = successCount ? now : (previous?.generatedAt ?? null);
const snapshot = {
  generatedAt,
  lastAttemptAt: now,
  source: "Phishing-Database/Phishing.Database",
  sourceUrl: "https://github.com/Phishing-Database/Phishing.Database",
  license: "MIT",
  status,
  domains: allDomains,
  urls
};
const report = {
  lastAttemptAt: now,
  lastSuccessfulAt: generatedAt,
  status,
  feeds: Object.fromEntries(Object.entries(results).map(([name, result]) => [name, {
    url: result.url,
    status: result.ok ? "ok" : "error",
    ...(result.ok ? { sourceLines: result.lines.length } : { error: result.error })
  }])),
  totalRelevantDomains: allDomains.length,
  totalRelevantUrls: urls.length,
  relevancePolicy: "TLD .es o token asociado a marcas/servicios españoles; no implica atribución geográfica confirmada",
  errors
};

await mkdir(dirname(outputPath), { recursive: true });
await mkdir(dirname(reportPath), { recursive: true });
await writeFile(outputPath, `// Generated by scripts/sync-threat-intel.mjs. Do not edit manually.\nexport const threatSnapshot = ${JSON.stringify(snapshot, null, 2)} as const;\n`, "utf8");
await writeFile(reportModulePath, `// Generated by scripts/sync-threat-intel.mjs. Do not edit manually.\nexport const threatIntelReport = ${JSON.stringify(report, null, 2)} as const;\n`, "utf8");
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(`Threat intelligence ${status}: ${allDomains.length} relevant domains, ${urls.length} relevant URLs.`);
if (successCount < feeds.length) {
  console.error("Some threat feeds failed; preserved their last successful indicator data and recorded feed health.");
  process.exitCode = 1;
}
