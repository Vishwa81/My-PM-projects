"use client";

import React from "react";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";

interface ReviewFiltersProps {
  selectedRating?: number;
  onRatingChange: (rating: number | undefined) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: "newest" | "oldest" | "highest" | "lowest";
  onSortChange: (sort: "newest" | "oldest" | "highest" | "lowest") => void;
  totalFilteredCount: number;
}

export function ReviewFilters({
  selectedRating,
  onRatingChange,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  totalFilteredCount,
}: ReviewFiltersProps) {
  const ratingOptions = [
    { label: "All Reviews", value: undefined },
    { label: "5 Stars", value: 5 },
    { label: "4 Stars", value: 4 },
    { label: "3 Stars", value: 3 },
    { label: "2 Stars", value: 2 },
    { label: "1 Star", value: 1 },
  ];

  const hasActiveFilters = selectedRating !== undefined || searchQuery.trim() !== "";

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-sm mb-6 space-y-4">
      {/* Top row: Search input + Sorting dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reviews by dish, service, or atmosphere..."
            className="w-full pl-10 pr-9 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-[#202124] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E85D35]/20 focus:border-[#E85D35] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="sort-select" className="text-xs font-semibold text-neutral-500 whitespace-nowrap hidden sm:inline">
            Sort by:
          </label>
          <div className="relative w-full sm:w-auto">
            <select
              id="sort-select"
              value={sortOrder}
              onChange={(e) =>
                onSortChange(
                  e.target.value as "newest" | "oldest" | "highest" | "lowest"
                )
              }
              className="w-full sm:w-auto appearance-none bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#E85D35]/20 focus:border-[#E85D35] cursor-pointer"
            >
              <option value="newest">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom row: Horizontal Star Rating Pills */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-neutral-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {ratingOptions.map((opt) => {
            const isSelected = selectedRating === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onRatingChange(opt.value)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#202124] text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                }`}
              >
                {opt.value !== undefined && (
                  <Star
                    className={`w-3 h-3 ${
                      isSelected
                        ? "fill-[#F5A623] text-[#F5A623]"
                        : "fill-neutral-400 text-neutral-400"
                    }`}
                  />
                )}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              onRatingChange(undefined);
              onSearchChange("");
            }}
            className="text-xs text-[#E85D35] hover:text-[#d64f28] font-medium whitespace-nowrap flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
