import type { BrandDefinition } from "./types";

export const trustedBrands: readonly BrandDefinition[] = [
  {
    name: "Agencia Tributaria",
    tokens: ["agenciatributaria", "aeat", "tributaria"],
    officialDomains: ["sede.agenciatributaria.gob.es", "agenciatributaria.gob.es"]
  },
  {
    name: "DGT",
    tokens: ["dgt", "trafico", "multadgt"],
    officialDomains: ["dgt.es", "sede.dgt.gob.es"]
  },
  {
    name: "Correos",
    tokens: ["correos", "correosexpress"],
    officialDomains: ["correos.es", "correosexpress.com"]
  },
  {
    name: "Seguridad Social",
    tokens: ["seguridadsocial", "segsocial", "tgss"],
    officialDomains: ["seg-social.es", "sede.seg-social.gob.es"]
  },
  {
    name: "INCIBE",
    tokens: ["incibe", "osi"],
    officialDomains: ["incibe.es"]
  },
  {
    name: "AEMET",
    tokens: ["aemet", "meteorologia"],
    officialDomains: ["aemet.es"]
  },
  {
    name: "Bizum",
    tokens: ["bizum"],
    officialDomains: ["bizum.es"]
  },
  {
    name: "BBVA",
    tokens: ["bbva"],
    officialDomains: ["bbva.es", "bbva.com"]
  },
  {
    name: "CaixaBank",
    tokens: ["caixabank", "lacaixa"],
    officialDomains: ["caixabank.es"]
  },
  {
    name: "Banco Santander",
    tokens: ["santander", "bancosantander"],
    officialDomains: ["bancosantander.es", "santander.com"]
  },
  {
    name: "Bankinter",
    tokens: ["bankinter"],
    officialDomains: ["bankinter.com"]
  },
  {
    name: "Banco Sabadell",
    tokens: ["sabadell", "bancsabadell"],
    officialDomains: ["bancsabadell.com"]
  },
  {
    name: "ING",
    tokens: ["ingdirect", "ingbank"],
    officialDomains: ["ing.es"]
  },
  {
    name: "ABANCA",
    tokens: ["abanca"],
    officialDomains: ["abanca.com"]
  },
  {
    name: "Iberdrola",
    tokens: ["iberdrola"],
    officialDomains: ["iberdrola.es"]
  },
  {
    name: "Endesa",
    tokens: ["endesa", "energiaxxi"],
    officialDomains: ["endesa.com", "energiaxxi.com"]
  }
] as const;

export function isOfficialDomain(hostname: string, officialDomains: readonly string[]): boolean {
  const host = hostname.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
  return officialDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}
