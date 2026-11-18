"use client";

import React, { useState } from "react";
import { StarRating } from "./StarRating";
import { ThumbsUp, CheckCircle2 } from "lucide-react";

export interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  helpfulCount: number;
  createdAt: string | Date;
  customer: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

interface ReviewCardProps {
  review: ReviewItem;
}

function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [isHelpfulClicked, setIsHelpfulClicked] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleHelpfulClick = () => {
    if (!isHelpfulClicked) {
      setIsHelpfulClicked(true);
      setHelpfulCount((prev) => prev + 1);
    } else {
      setIsHelpfulClicked(false);
      setHelpfulCount((prev) => Math.max(0, prev - 1));
    }
  };

  const isLongComment = review.comment.length > 280;
  const displayedComment = isLongComment && !isExpanded
    ? `${review.comment.slice(0, 280)}...`
    : review.comment;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    review.customer.name
  )}&background=F8F8F8&color=202124&bold=true`;

  return (
    <article className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-sm transition-all hover:border-neutral-300">
      {/* Header: Customer avatar, name, badges, and rating */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={review.customer.avatarUrl || defaultAvatar}
            alt={review.customer.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-100 bg-neutral-100 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultAvatar;
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-[#202124]">
                {review.customer.name}
              </h4>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#198754] bg-emerald-50 px-1.5 py-0.2 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Verified Diner
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">
              {formatRelativeTime(review.createdAt)}
            </div>
          </div>
        </div>

        {/* Rating badge */}
        <div className="shrink-0 flex flex-col items-end">
          <StarRating rating={review.rating} size="sm" />
          <span className="text-[11px] font-semibold text-neutral-500 mt-1">
            {review.rating} / 5
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="mt-4">
        {review.title && (
          <h5 className="text-sm font-bold text-neutral-900 mb-1.5">
            {review.title}
          </h5>
        )}
        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
          {displayedComment}
        </p>

        {isLongComment && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-[#E85D35] hover:underline mt-2 inline-block cursor-pointer"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      {/* Card Footer: Helpful button & counter */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <button
          onClick={handleHelpfulClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            isHelpfulClicked
              ? "bg-orange-50 border-[#E85D35]/30 text-[#E85D35]"
              : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
          }`}
          aria-label="Mark review as helpful"
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${isHelpfulClicked ? "fill-[#E85D35]" : ""}`} />
          <span>Helpful</span>
          {helpfulCount > 0 && (
            <span className="ml-1 font-semibold">({helpfulCount})</span>
          )}
        </button>

        <span className="text-[11px] text-neutral-400">
          Reviewed on Zamato Lite
        </span>
      </div>
    </article>
  );
}
