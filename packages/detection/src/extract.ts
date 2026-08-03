import type { ExtractedIndicator } from "./types";

const urlPattern = /(?:https?:\/\/|www\.)[^\s<>{}\[\]"']+|\b(?:[a-z0-9\p{L}](?:[a-z0-9\p{L}-]{0,61}[a-z0-9\p{L}])?\.)+(?:[a-z\p{L}]{2,63})(?:\/[^\s<>{}\[\]"']*)?/giu;
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}\b/giu;
const phonePattern = /(?<!\d)(?:\+34[\s.-]?)?(?:[6789]\d{2})(?:[\s.-]?\d{3}){2}(?!\d)/g;
const ibanPattern = /\bES\d{2}(?:[\s-]?\d{4}){5}\b/giu;
const walletPattern = /\b(?:bc1[a-z0-9]{25,62}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|0x[a-fA-F0-9]{40})\b/g;

function trimUrl(value: string): string {
  return value.replace(/[),.;:!?]+$/u, "");
}

export function normalizeHostname(value: string): string | null {
  const candidate = value.startsWith("www.") ? `https://${value}` : value.includes("://") ? value : `https://${value}`;
  try {
    return new URL(candidate).hostname.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
  } catch {
    return null;
  }
}

function mask(value: string, visibleStart = 4, visibleEnd = 3): string {
  if (value.length <= visibleStart + visibleEnd + 2) return value;
  return `${value.slice(0, visibleStart)}…${value.slice(-visibleEnd)}`;
}

export function extractUrls(text: string): string[] {
  return [...new Set(Array.from(text.matchAll(urlPattern), (match) => trimUrl(match[0])))]
    .filter((value) => !value.includes("@") || value.includes("://"));
}

export function extractIndicators(text: string): ExtractedIndicator[] {
  const urls = extractUrls(text);
  const indicators: ExtractedIndicator[] = [];
  const seen = new Set<string>();

  const add = (indicator: ExtractedIndicator) => {
    const key = `${indicator.type}:${indicator.value.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      indicators.push(indicator);
    }
  };

  for (const url of urls) {
    add({ type: "url", value: url, displayValue: mask(url, 18, 8) });
    const hostname = normalizeHostname(url);
    if (hostname) add({ type: "domain", value: hostname, displayValue: hostname });
  }
  for (const match of text.matchAll(emailPattern)) {
    add({ type: "email", value: match[0], displayValue: mask(match[0], 2, 6) });
  }
  for (const match of text.matchAll(phonePattern)) {
    const value = match[0].replace(/[\s.-]/g, "");
    add({ type: "phone", value, displayValue: mask(value, 3, 3) });
  }
  for (const match of text.matchAll(ibanPattern)) {
    const value = match[0].replace(/[\s-]/g, "").toUpperCase();
    add({ type: "iban", value, displayValue: `${value.slice(0, 4)}…${value.slice(-4)}` });
  }
  for (const match of text.matchAll(walletPattern)) {
    add({ type: "wallet", value: match[0], displayValue: mask(match[0], 6, 6) });
  }

  return indicators;
}
