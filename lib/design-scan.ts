import { CatalogColor, CatalogScanResult } from "@/lib/design-editor-types";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function extractColorCode(rawText: string) {
  const hit = rawText.match(/\b([a-z]{1,4}[- ]?\d{2,5}|[a-z]{2,6}\d{2,5}|\d{3,6})\b/i);
  return hit?.[1]?.toUpperCase() || null;
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
