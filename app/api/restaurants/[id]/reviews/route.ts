import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview } from "@/lib/queries/reviews";
import { createReviewSchema } from "@/lib/validations";

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

    const { searchParams } = new URL(request.url);
    const ratingParam = searchParams.get("rating");
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const rating = ratingParam && !isNaN(Number(ratingParam)) ? Number(ratingParam) : undefined;
    const search = searchParam || undefined;
    const sort = (sortParam as "newest" | "oldest" | "highest" | "lowest") || "newest";
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam ? Math.min(50, Math.max(1, parseInt(limitParam, 10))) : 10;

    const data = await getReviews(id, {
      rating,
      search,
      sort,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/restaurants/[id]/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const body = await request.json();
    const parseResult = createReviewSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMap = parseResult.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errorMap },
        { status: 400 }
      );
    }

    // Client IP for rate-limiting context if available
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous";

    const result = await addReview(id, parseResult.data, clientIp);

    return NextResponse.json(
      {
        message: "Review submitted successfully",
        review: result.review,
        summary: result.summary,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/restaurants/[id]/reviews error:", error);
    const message = error.message || "Failed to submit review";
    const status = message.includes("recently") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
