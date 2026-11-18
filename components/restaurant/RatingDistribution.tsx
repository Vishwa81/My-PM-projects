"use client";

import React from "react";
import { Star } from "lucide-react";

interface DistributionItem {
  stars: number;
  count: number;
  percentage: number;
}

interface RatingDistributionProps {
  distribution: DistributionItem[];
  totalReviews: number;
  activeRatingFilter?: number;
  onSelectRating?: (rating: number | undefined) => void;
}

export function RatingDistribution({
  distribution,
  totalReviews,
  activeRatingFilter,
  onSelectRating,
}: RatingDistributionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#202124] uppercase tracking-wider">
          Rating Breakdown
        </h3>
        {activeRatingFilter && (
          <button
            onClick={() => onSelectRating?.(undefined)}
            className="text-xs text-[#E85D35] hover:underline font-medium cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="space-y-3">
        {distribution.map((item) => {
          const isSelected = activeRatingFilter === item.stars;

          return (
            <button
              key={item.stars}
              type="button"
              onClick={() =>
                onSelectRating?.(isSelected ? undefined : item.stars)
              }
              className={`w-full group flex items-center gap-3 text-left py-1 px-2 -mx-2 rounded-lg transition-colors cursor-pointer ${
                isSelected
                  ? "bg-orange-50 ring-1 ring-[#E85D35]/30"
                  : "hover:bg-neutral-50"
              }`}
            >
              {/* Star Label */}
              <div className="flex items-center gap-1 w-12 text-xs font-semibold text-neutral-700">
                <span>{item.stars}</span>
                <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSelected ? "bg-[#E85D35]" : "bg-[#F5A623] group-hover:bg-[#E85D35]"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              {/* Count & Percentage */}
              <div className="w-16 text-right flex items-center justify-end gap-1.5 text-xs">
                <span className="font-semibold text-neutral-800">
                  {item.count}
                </span>
                <span className="text-neutral-400 text-[11px]">
                  ({item.percentage}%)
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
