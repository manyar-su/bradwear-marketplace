import { NextResponse } from "next/server";
import { getCurrentMarketplaceUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentMarketplaceUser();
  return NextResponse.json({ user });
}

