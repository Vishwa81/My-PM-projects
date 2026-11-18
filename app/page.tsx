import { getDefaultRestaurant, getRatingSummary, getReviews } from "@/lib/queries/reviews";
import { LudhianaBistroClient } from "@/components/restaurant/LudhianaBistroClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const restaurant = await getDefaultRestaurant();

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 max-w-md">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Restaurant Not Found</h2>
          <p className="text-sm text-neutral-600">
            Please run the database setup script to seed Ludhiana Bistro.
          </p>
        </div>
      </div>
    );
  }

  const [summary, initialReviews] = await Promise.all([
    getRatingSummary(restaurant.id),
    getReviews(restaurant.id, { page: 1, limit: 10, sort: "newest" }),
  ]);

  return (
    <LudhianaBistroClient
      restaurant={restaurant}
      initialSummary={summary}
      initialReviews={initialReviews}
    />
  );
}
