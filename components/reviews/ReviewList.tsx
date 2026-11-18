"use client";

import React from "react";
import { ReviewCard, type ReviewItem } from "./ReviewCard";
import { MessageSquareDashed, Loader2 } from "lucide-react";

interface ReviewListProps {
  reviews: ReviewItem[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  onOpenWriteModal: () => void;
  activeFilterCount: number;
}

export function ReviewList({
  reviews,
  isLoading,
  hasMore,
  onLoadMore,
  isLoadingMore,
  onOpenWriteModal,
  activeFilterCount,
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-neutral-100 animate-pulse space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-neutral-200 rounded-full" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-neutral-200 rounded" />
                <div className="w-20 h-3 bg-neutral-100 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-neutral-100 rounded" />
              <div className="w-4/5 h-3 bg-neutral-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-neutral-200/80 shadow-sm my-6">
        <div className="w-14 h-14 bg-orange-50 text-[#E85D35] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquareDashed className="w-7 h-7" />
        </div>
        <h4 className="text-lg font-bold text-[#202124]">
          {activeFilterCount > 0 ? "No matching reviews found" : "No reviews yet"}
        </h4>
        <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
          {activeFilterCount > 0
            ? "Try resetting your search query or choosing a different star filter to view other customer experiences."
            : "Ludhiana Bistro is waiting for its first review! Be the trendsetter and share your authentic dining story."}
        </p>

        <button
          onClick={onOpenWriteModal}
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-[#E85D35] hover:bg-[#d64f28] text-white shadow-md shadow-[#E85D35]/25 transition-all cursor-pointer"
        >
          Write the First Review
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <ReviewCard key={rev.id} review={rev} />
      ))}

      {/* Pagination / Load More */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 text-sm font-semibold text-neutral-800 shadow-sm transition-all hover:scale-101 cursor-pointer"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E85D35]" />
                Loading reviews...
              </>
            ) : (
              "Load More Reviews"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
