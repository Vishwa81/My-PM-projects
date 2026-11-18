"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { RestaurantHeader } from "./RestaurantHeader";
import { RatingOverview } from "./RatingOverview";
import { RatingDistribution } from "./RatingDistribution";
import { ReviewFilters } from "../reviews/ReviewFilters";
import { ReviewList } from "../reviews/ReviewList";
import { WriteReviewModal } from "../reviews/WriteReviewModal";
import { MessageSquarePlus, Sparkles } from "lucide-react";
import type { Restaurant } from "../../drizzle/schema";
import type { ReviewItem } from "../reviews/ReviewCard";

interface SummaryData {
  restaurantId: string;
  totalReviews: number;
  averageRating: number;
  distribution: { stars: number; count: number; percentage: number }[];
}

interface LudhianaBistroClientProps {
  restaurant: Restaurant;
  initialSummary: SummaryData;
  initialReviews: {
    reviews: ReviewItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
}

export function LudhianaBistroClient({
  restaurant,
  initialSummary,
  initialReviews,
}: LudhianaBistroClientProps) {
  const [summary, setSummary] = useState<SummaryData>(initialSummary);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews.reviews);
  const [pagination, setPagination] = useState(initialReviews.pagination);

  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch reviews based on active filters
  const fetchFilteredReviews = useCallback(
    async (pageToLoad: number, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const queryParams = new URLSearchParams();
        if (selectedRating !== undefined) queryParams.set("rating", String(selectedRating));
        if (debouncedSearch.trim() !== "") queryParams.set("search", debouncedSearch.trim());
        if (sortOrder) queryParams.set("sort", sortOrder);
        queryParams.set("page", String(pageToLoad));
        queryParams.set("limit", "10");

        const res = await fetch(`/api/restaurants/${restaurant.id}/reviews?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();

        if (append) {
          setReviews((prev) => [...prev, ...data.reviews]);
        } else {
          setReviews(data.reviews);
        }
        setPagination(data.pagination);
      } catch (err) {
        console.error("Error fetching filtered reviews:", err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [restaurant.id, selectedRating, debouncedSearch, sortOrder]
  );

  // Trigger refetch when filters change (ignoring the very first SSR mount if filters are untouched)
  const [isFirstMount, setIsFirstMount] = useState(true);
  useEffect(() => {
    if (isFirstMount) {
      setIsFirstMount(false);
      return;
    }
    fetchFilteredReviews(1, false);
  }, [selectedRating, debouncedSearch, sortOrder, fetchFilteredReviews, isFirstMount]);

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoadingMore) {
      fetchFilteredReviews(pagination.page + 1, true);
    }
  };

  const handleReviewSubmitted = (newReview: ReviewItem, updatedSummary: SummaryData) => {
    // Update summary immediately
    if (updatedSummary) {
      setSummary(updatedSummary);
    }
    // Prepend new review to the list
    setReviews((prev) => [newReview, ...prev]);
    setPagination((prev) => ({
      ...prev,
      total: prev.total + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#202124] flex flex-col font-sans selection:bg-[#E85D35] selection:text-white">
      {/* Navbar */}
      <Navbar onOpenWriteModal={() => setIsWriteModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-16">
        {/* Restaurant Header */}
        <RestaurantHeader
          restaurant={restaurant}
          averageRating={summary.averageRating}
          totalReviews={summary.totalReviews}
          onOpenWriteModal={() => setIsWriteModalOpen(true)}
        />

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: Filters & Reviews (8 Cols on Desktop) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
                  Customer Reviews
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Showing {reviews.length} of {pagination.total} matching opinions
                </p>
              </div>

              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E85D35] text-white shadow-sm cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                Write Review
              </button>
            </div>

            {/* Filter toolbar */}
            <ReviewFilters
              selectedRating={selectedRating}
              onRatingChange={(r) => setSelectedRating(r)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              sortOrder={sortOrder}
              onSortChange={(s) => setSortOrder(s)}
              totalFilteredCount={pagination.total}
            />

            {/* Reviews List */}
            <ReviewList
              reviews={reviews}
              isLoading={isLoading}
              hasMore={pagination.hasMore}
              onLoadMore={handleLoadMore}
              isLoadingMore={isLoadingMore}
              onOpenWriteModal={() => setIsWriteModalOpen(true)}
              activeFilterCount={
                (selectedRating !== undefined ? 1 : 0) +
                (debouncedSearch.trim() !== "" ? 1 : 0)
              }
            />
          </div>

          {/* Sidebar: Rating Overview, Distribution, & Sticky Write CTA (4 Cols on Desktop) */}
          <aside className="lg:col-span-4 order-1 lg:order-2 space-y-6 lg:sticky lg:top-24">
            {/* Overall Rating Card */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-2 px-1">
                Overall Rating
              </h3>
              <RatingOverview
                averageRating={summary.averageRating}
                totalReviews={summary.totalReviews}
              />
            </div>

            {/* Rating Distribution */}
            <div>
              <RatingDistribution
                distribution={summary.distribution}
                totalReviews={summary.totalReviews}
                activeRatingFilter={selectedRating}
                onSelectRating={(r) => setSelectedRating(r)}
              />
            </div>

            {/* Share Experience CTA Card */}
            <div className="bg-gradient-to-br from-[#202124] to-[#2c2d30] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E85D35]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E85D35] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Share your experience</span>
              </div>

              <h4 className="text-lg font-bold text-white mb-1.5 leading-snug">
                Have you visited Ludhiana Bistro?
              </h4>

              <p className="text-xs text-neutral-300 leading-relaxed mb-5">
                Tell others about your culinary journey, favorite tandoori specialties, and hospitality.
              </p>

              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#E85D35] hover:bg-[#d64f28] text-white shadow-md shadow-[#E85D35]/30 transition-all hover:scale-102 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Write a Review
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
