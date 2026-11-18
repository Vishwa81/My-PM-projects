import { NextResponse } from "next/server";
import { getDefaultRestaurant } from "@/lib/queries/reviews";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const restaurant = await getDefaultRestaurant();
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error("GET /api/restaurants error:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant details" },
      { status: 500 }
    );
  }
}
