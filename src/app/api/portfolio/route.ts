import { NextResponse } from "next/server";
import portfolioData from "@/data/portfolio-data.json";
import { normalizeContent } from "@/data/portfolioStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
};

export async function GET() {
  return NextResponse.json(
    normalizeContent(portfolioData),
    {
      headers: noStoreHeaders,
    }
  );
}