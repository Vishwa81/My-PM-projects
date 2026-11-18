"useClient";
"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showValue = false,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-7 h-7",
  };

  const activeRating = interactive && hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rating: ${rating} out of ${maxStars} stars`}
      >
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = activeRating >= starValue;
          const isHalf = !isFilled && activeRating >= starValue - 0.5;

          if (interactive) {
            return (
              <button
                key={index}
                type="button"
                role="radio"
                aria-checked={rating === starValue}
                aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
                onClick={() => onRatingChange?.(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(null)}
                className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D35] rounded transition-transform hover:scale-110 cursor-pointer"
              >
                <Star
                  className={`${sizeClasses[size]} ${
                    isFilled
                      ? "fill-[#F5A623] text-[#F5A623]"
                      : "text-neutral-300 hover:text-neutral-400"
                  } transition-colors`}
                />
              </button>
            );
          }

          return (
            <div key={index} className="relative inline-block">
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? "fill-[#F5A623] text-[#F5A623]"
                    : "text-neutral-300 fill-transparent"
                }`}
              />
              {isHalf && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: "50%" }}
                >
                  <Star
                    className={`${sizeClasses[size]} fill-[#F5A623] text-[#F5A623]`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-neutral-800 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
