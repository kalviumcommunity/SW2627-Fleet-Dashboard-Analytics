import { NextResponse } from "next/server";
import { getMapplsAccessToken } from "@/lib/mapmyindia/intouch";

export async function GET() {
  try {
    const token = await getMapplsAccessToken();

    if (token) {
      return NextResponse.json({
        success: true,
        mode: "oauth",
        token,
      });
    }

    const apiKey =
      process.env.NEXT_PUBLIC_MAPPLS_KEY ||
      process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY ||
      null;

    return NextResponse.json({
      success: true,
      mode: "apiKey",
      token: null,
      apiKey,
      message:
        "OAuth client credentials not configured. Map client can initialize directly using public API key.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
