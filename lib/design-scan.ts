import { CatalogColor, CatalogScanResult } from "@/lib/design-editor-types";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeColorCode(code: string) {
  const cleaned = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const match = cleaned.match(/^([A-Z]{1,4})(\d{2,5}[A-Z]?)$/);

  if (!match) {
    return code.toUpperCase().replace(/\s+/g, "").trim();
  }

  return `${match[1]}-${match[2]}`;
}

function extractColorCode(rawText: string) {
  const normalizedSource = rawText
    .replace(/[|]/g, "I")
    .replace(/[—–_:/]/g, "-")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  const patterns = [
    /\b([A-Z]{1,4}\s*-\s*\d{2,5}[A-Z]?)\b/i,
    /\b([A-Z]{1,4}\s*\d{2,5}[A-Z]?)\b/i,
    /\b(\d{3,6})\b/,
  ];

  for (const pattern of patterns) {
    const hit = normalizedSource.match(pattern);
    if (hit?.[1]) {
      return normalizeColorCode(hit[1]);
    }
  }

  return null;
}

export function parseScanText(rawText: string, colors: CatalogColor[]): CatalogScanResult {
  const normalized = normalizeText(rawText);
  let best: CatalogColor | null = null;
  let confidence = 0;
  const warnings: string[] = [];

  for (const color of colors) {
    const name = normalizeText(color.name);
    if (!name) continue;
    if (normalized.includes(name)) {
      const score = name.length / Math.max(normalized.length, 10);
      if (score > confidence) {
        best = color;
        confidence = score;
      }
    }
  }

  const colorCode = extractColorCode(rawText);
  if (!best) warnings.push("Warna tidak terdeteksi jelas dari hasil scan.");
  if (!colorCode) warnings.push("Kode warna tidak ditemukan, isi manual jika perlu.");

  return {
    rawText,
    normalizedColorName: best?.name || null,
    normalizedColorHex: best?.hex || null,
    colorCode,
    confidence: Number(confidence.toFixed(3)),
    warnings,
  };
}
