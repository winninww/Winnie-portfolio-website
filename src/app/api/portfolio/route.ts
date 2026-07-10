import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import {
  normalizeContent,
} from "@/data/portfolioStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
};

const PORTFOLIO_FILE = "portfolio/portfolio-data.json";


async function getPortfolioBlob() {
  const blobs = await list({
    prefix: PORTFOLIO_FILE,
  });

  return blobs.blobs[0];
}


export async function GET() {
  try {

    const blob = await getPortfolioBlob();

    if (!blob) {
      return NextResponse.json(
        normalizeContent({
          projects: [],
          profile: {},
        }),
        {
          headers: noStoreHeaders,
        }
      );
    }


    const response = await fetch(blob.url, {
      cache: "no-store",
    });


    const data = await response.json();


    return NextResponse.json(
      normalizeContent(data),
      {
        headers: noStoreHeaders,
      }
    );


  } catch(error) {

    console.error(error);

    return NextResponse.json(
      {
        error:"Read failed",
      },
      {
        status:500,
      }
    );
  }
}



export async function PUT(request: Request) {
  try {

    const body = await request.json();

    const saved = normalizeContent(body);


    await put(
      PORTFOLIO_FILE,
      JSON.stringify(saved),
      {
        access: "public",
        contentType: "application/json",
        allowOverwrite: true,
      }
    );


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