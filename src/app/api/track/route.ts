import { NextRequest, NextResponse } from "next/server";
import { FedExProvider } from "@/providers/fedex-provider";

const fedex = new FedExProvider();

export async function POST(request: NextRequest) {
  try {
    const { trackingId } = await request.json();

    if (!trackingId || typeof trackingId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid trackingId" },
        { status: 400 }
      );
    }

    const data = await fedex.track(trackingId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json(
      { error: "Failed to track package" },
      { status: 500 }
    );
  }
}
