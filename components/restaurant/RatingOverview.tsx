"use client";

import React from "react";
import { StarRating } from "../reviews/StarRating";

interface RatingOverviewProps {
  averageRating: number;
  totalReviews: number;
}

export function RatingOverview({ averageRating, totalReviews }: RatingOverviewProps) {
  if (totalReviews === 0) {
    return (
      <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 text-center">
        <div className="text-4xl font-bold text-neutral-300 mb-2">--</div>
        <p className="text-sm font-medium text-neutral-600">No ratings yet</p>
        <p className="text-xs text-neutral-400 mt-1">
          Be the first customer to share your dining experience!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-extrabold text-[#202124] tracking-tight">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-lg font-medium text-neutral-400">/ 5</span>
        </div>

        <div className="mt-2">
          <StarRating rating={averageRating} size="lg" />
        </div>

        <p className="text-xs font-medium text-neutral-500 mt-2">
          Based on <strong className="text-neutral-900 font-semibold">{totalReviews.toLocaleString()}</strong> verified {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="hidden sm:block h-20 w-px bg-neutral-200 self-center" />

      <div className="flex-1 w-full text-xs text-neutral-500 flex flex-col justify-center space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#198754]"></span>
          <span className="font-medium text-neutral-700">100% Genuine reviews</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E85D35]"></span>
          <span>Calculated directly from customer ratings</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F5A623]"></span>
          <span>Updated in real-time on every submission</span>
        </div>
      </div>
    </div>
  );
}
