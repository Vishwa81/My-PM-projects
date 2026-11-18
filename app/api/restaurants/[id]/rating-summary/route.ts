import { NextRequest, NextResponse } from "next/server";
import { getRatingSummary } from "@/lib/queries/reviews";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Restaurant ID is required" },
        { status: 400 }
      );
    }

    const summary = await getRatingSummary(id);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET /api/restaurants/[id]/rating-summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rating summary" },
      { status: 500 }
    );
  }
}
