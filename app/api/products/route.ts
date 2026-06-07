import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/catalog";

export async function GET() {
  try {
    const { items, source } = await getCatalogProducts();
    return NextResponse.json({ items, source });
  } catch {
    return NextResponse.json({ items: [], source: "fallback" });
  }
}
