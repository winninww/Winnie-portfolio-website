import { NextResponse } from "next/server";
import portfolioData from "@/data/portfolio-data.json";
import {
  normalizeContent,
  writePortfolioContent,
} from "@/data/portfolioStorage";

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


export async function PUT(request: Request) {
  try {

    const body = await request.json();

    const saved = normalizeContent(body);


    return NextResponse.json(
      {
        success: true,
        data: saved,
      },
      {
        headers: noStoreHeaders,
      }
    );


  } catch(error) {

    console.error(error);

    return NextResponse.json(
      {
        success:false,
        error:"Save failed",
      },
      {
        status:500,
      }
    );

  }
}