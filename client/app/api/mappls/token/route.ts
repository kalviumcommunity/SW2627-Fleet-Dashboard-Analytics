import { NextResponse } from "next/server";
import { getMapplsAccessToken } from "@/lib/mapmyindia/intouch";

export async function GET() {
  try {
    const token = await getMapplsAccessToken();
    if (!token) {
      return NextResponse.json(
        { error: "Unable to generate Mappls access token" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
