import { db } from "../db";
import { restaurants, customers, reviews } from "../../drizzle/schema";
import { eq, desc, asc, and, ilike, or, sql } from "drizzle-orm";
import type { CreateReviewInput } from "../validations";

export interface ReviewFilters {
  rating?: number;
  search?: string;
  sort?: "newest" | "oldest" | "highest" | "lowest";
  page?: number;
  limit?: number;
}

export async function getDefaultRestaurant() {
  const result = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.name, "Ludhiana Bistro"))
    .limit(1);

  if (result.length > 0) return result[0];

  // Fallback to first available restaurant
  const all = await db.select().from(restaurants).limit(1);
  return all[0] || null;
}

export async function getRestaurantById(id: string) {
  const result = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, id))
    .limit(1);

  return result[0] || null;
}

export async function getRatingSummary(restaurantId: string) {
  const summaryResult = await db
    .select({
      totalReviews: sql<number>`count(*)::int`,
      avgRating: sql<number>`coalesce(round(avg(${reviews.rating})::numeric, 1), 0)::float`,
      stars5: sql<number>`count(case when ${reviews.rating} = 5 then 1 end)::int`,
      stars4: sql<number>`count(case when ${reviews.rating} = 4 then 1 end)::int`,
      stars3: sql<number>`count(case when ${reviews.rating} = 3 then 1 end)::int`,
      stars2: sql<number>`count(case when ${reviews.rating} = 2 then 1 end)::int`,
      stars1: sql<number>`count(case when ${reviews.rating} = 1 then 1 end)::int`,
    })
    .from(reviews)
    .where(and(eq(reviews.restaurantId, restaurantId), eq(reviews.status, "published")));

  const summary = summaryResult[0] || {
    totalReviews: 0,
    avgRating: 0,
    stars5: 0,
    stars4: 0,
    stars3: 0,
    stars2: 0,
    stars1: 0,
  };

  const total = Number(summary.totalReviews);
  const distribution = [
    { stars: 5, count: Number(summary.stars5), percentage: total > 0 ? Math.round((Number(summary.stars5) / total) * 100) : 0 },
    { stars: 4, count: Number(summary.stars4), percentage: total > 0 ? Math.round((Number(summary.stars4) / total) * 100) : 0 },
    { stars: 3, count: Number(summary.stars3), percentage: total > 0 ? Math.round((Number(summary.stars3) / total) * 100) : 0 },
    { stars: 2, count: Number(summary.stars2), percentage: total > 0 ? Math.round((Number(summary.stars2) / total) * 100) : 0 },
    { stars: 1, count: Number(summary.stars1), percentage: total > 0 ? Math.round((Number(summary.stars1) / total) * 100) : 0 },
  ];

  return {
    restaurantId,
    totalReviews: total,
    averageRating: Number(summary.avgRating),
    distribution,
  };
}

export async function getReviews(restaurantId: string, filters: ReviewFilters = {}) {
  const { rating, search, sort = "newest", page = 1, limit = 10 } = filters;
  const offset = (Math.max(1, page) - 1) * limit;

  const conditions = [
    eq(reviews.restaurantId, restaurantId),
    eq(reviews.status, "published"),
  ];

  if (rating && rating >= 1 && rating <= 5) {
    conditions.push(eq(reviews.rating, rating));
  }

  if (search && search.trim() !== "") {
    const searchTerm = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(reviews.title, searchTerm),
        ilike(reviews.comment, searchTerm)
      )!
    );
  }

  let orderByClause;
  switch (sort) {
    case "oldest":
      orderByClause = [asc(reviews.createdAt)];
      break;
    case "highest":
      orderByClause = [desc(reviews.rating), desc(reviews.createdAt)];
      break;
    case "lowest":
      orderByClause = [asc(reviews.rating), desc(reviews.createdAt)];
      break;
    case "newest":
    default:
      orderByClause = [desc(reviews.createdAt)];
      break;
  }

  // Count total matching reviews
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reviews)
    .where(and(...conditions));

  const totalMatching = Number(totalCountResult[0]?.count || 0);

  // Fetch paginated reviews with customer details (WITHOUT exposing email)
  const items = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      comment: reviews.comment,
      helpfulCount: reviews.helpfulCount,
      createdAt: reviews.createdAt,
      customer: {
        id: customers.id,
        name: customers.name,
        avatarUrl: customers.avatarUrl,
      },
    })
    .from(reviews)
    .innerJoin(customers, eq(reviews.customerId, customers.id))
    .where(and(...conditions))
    .orderBy(...orderByClause)
    .limit(limit)
    .offset(offset);

  return {
    reviews: items,
    pagination: {
      page: Math.max(1, page),
      limit,
      total: totalMatching,
      totalPages: Math.ceil(totalMatching / limit),
      hasMore: offset + items.length < totalMatching,
    },
  };
}

export async function addReview(
  restaurantId: string,
  input: CreateReviewInput,
  clientIp?: string
) {
  // 1. Anti-spam / rate-limiting check
  // Check if same email posted in last 60 seconds
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const recentReview = await db
    .select({ id: reviews.id })
    .from(reviews)
    .innerJoin(customers, eq(reviews.customerId, customers.id))
    .where(
      and(
        eq(reviews.restaurantId, restaurantId),
        eq(customers.email, input.email.toLowerCase()),
        sql`${reviews.createdAt} > ${oneMinuteAgo}`
      )
    )
    .limit(1);

  if (recentReview.length > 0) {
    throw new Error("You have submitted a review recently. Please wait a moment before submitting another.");
  }

  // 2. Sanitize inputs
  const cleanName = input.name.trim();
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanTitle = input.title ? input.title.trim() : null;
  const cleanComment = input.comment.trim();

  // 3. Upsert customer
  const initials = cleanName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=E85D35&color=fff&size=150`;

  const customerResult = await db
    .insert(customers)
    .values({
      name: cleanName,
      email: cleanEmail,
      avatarUrl: defaultAvatar,
    })
    .onConflictDoUpdate({
      target: customers.email,
      set: {
        name: cleanName,
      },
    })
    .returning({
      id: customers.id,
      name: customers.name,
      avatarUrl: customers.avatarUrl,
    });

  const customer = customerResult[0];

  // 4. Insert review
  const reviewResult = await db
    .insert(reviews)
    .values({
      restaurantId,
      customerId: customer.id,
      rating: input.rating,
      title: cleanTitle,
      comment: cleanComment,
      status: "published",
      helpfulCount: 0,
    })
    .returning({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      comment: reviews.comment,
      helpfulCount: reviews.helpfulCount,
      createdAt: reviews.createdAt,
    });

  const newReview = {
    ...reviewResult[0],
    customer: {
      id: customer.id,
      name: customer.name,
      avatarUrl: customer.avatarUrl,
    },
  };

  // 5. Fetch updated rating summary
  const summary = await getRatingSummary(restaurantId);

  return {
    review: newReview,
    summary,
  };
}
