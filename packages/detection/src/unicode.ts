const confusableMap: Readonly<Record<string, string>> = {
  "а": "a", "Α": "a", "ɑ": "a", "Ꭺ": "a",
  "Ь": "b", "В": "b", "Β": "b", "Ᏼ": "b",
  "с": "c", "С": "c", "ϲ": "c", "ⅽ": "c",
  "ԁ": "d", "ⅾ": "d",
  "е": "e", "Е": "e", "Ε": "e", "℮": "e",
  "ɡ": "g", "Ԍ": "g",
  "һ": "h", "Η": "h", "Н": "h",
  "і": "i", "І": "i", "Ι": "i", "ӏ": "i", "ⅼ": "l",
  "ј": "j", "Ј": "j",
  "κ": "k", "Κ": "k", "К": "k",
  "м": "m", "Μ": "m", "М": "m",
  "ո": "n", "Ν": "n", "Ｎ": "n",
  "о": "o", "О": "o", "Ο": "o", "Օ": "o", "0": "o",
  "р": "p", "Р": "p", "Ρ": "p",
  "ѕ": "s", "Ѕ": "s", "Տ": "s",
  "т": "t", "Τ": "t", "Т": "t",
  "υ": "u", "Ս": "u",
  "ν": "v", "ѵ": "v", "Ⅴ": "v",
  "ԝ": "w", "Ш": "w",
  "х": "x", "Х": "x", "Χ": "x", "ⅹ": "x",
  "у": "y", "У": "y", "Υ": "y", "ү": "y",
  "ᴢ": "z", "Ζ": "z", "Ꮓ": "z",
  "1": "l", "3": "e", "5": "s", "7": "t"
};

const invisibleOrDirectional = /[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/u;

export function hasInvisibleOrDirectionalCharacters(value: string): boolean {
  return invisibleOrDirectional.test(value);
}

export function scriptsIn(value: string): Set<"latin" | "cyrillic" | "greek" | "other"> {
  const scripts = new Set<"latin" | "cyrillic" | "greek" | "other">();
  for (const char of value) {
    if (!/\p{L}/u.test(char)) continue;
    if (/\p{Script=Latin}/u.test(char)) scripts.add("latin");
    else if (/\p{Script=Cyrillic}/u.test(char)) scripts.add("cyrillic");
    else if (/\p{Script=Greek}/u.test(char)) scripts.add("greek");
    else scripts.add("other");
  }
  return scripts;
}

export function hasMixedRelevantScripts(value: string): boolean {
  const scripts = scriptsIn(value);
  return scripts.size > 1 && (scripts.has("latin") || scripts.has("cyrillic") || scripts.has("greek"));
}

export function confusableSkeleton(value: string): string {
  return Array.from(value.normalize("NFKD"))
    .filter((char) => !/\p{M}/u.test(char))
    .map((char) => confusableMap[char] ?? char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export const unicodeMethodologyNote =
  "Heurística inspirada en Unicode UTS #39; no implementa toda la tabla oficial de confusables y puede producir falsos positivos o negativos.";
