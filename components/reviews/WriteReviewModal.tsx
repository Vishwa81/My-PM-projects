"use client";

import React, { useState } from "react";
import { X, Star, AlertCircle, CheckCircle, Lock, Loader2 } from "lucide-react";
import { StarRating } from "./StarRating";
import type { ReviewItem } from "./ReviewCard";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantName: string;
  onReviewSubmitted: (newReview: ReviewItem, updatedSummary: any) => void;
}

export function WriteReviewModal({
  isOpen,
  onClose,
  restaurantId,
  restaurantName,
  onReviewSubmitted,
}: WriteReviewModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const ratingDescriptions: Record<number, string> = {
    1: "Terrible - Disappointing experience",
    2: "Poor - Below expectations",
    3: "Average - Food or service was okay",
    4: "Very Good - Enjoyable dining",
    5: "Excellent - Outstanding food & hospitality!",
  };

  const validate = () => {
    const errors: Record<string, string[]> = {};
    if (!name.trim()) errors.name = ["Please enter your name"];
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.email = ["Please enter a valid email address"];
    }
    if (rating < 1 || rating > 5) {
      errors.rating = ["Please choose a star rating (1 to 5)"];
    }
    if (comment.trim().length < 10) {
      errors.comment = ["Review comment must be at least 10 characters"];
    }
    if (comment.trim().length > 1000) {
      errors.comment = ["Review cannot exceed 1,000 characters"];
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setFieldErrors({});

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        }
        throw new Error(data.error || "Failed to submit review");
      }

      // Success
      setShowSuccessToast(true);
      setTimeout(() => {
        onReviewSubmitted(data.review, data.summary);
        onClose();
        setShowSuccessToast(false);
        // Reset form
        setName("");
        setEmail("");
        setRating(0);
        setTitle("");
        setComment("");
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="write-review-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden transform transition-all my-8">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E85D35]">
              Share Feedback
            </span>
            <h3 id="write-review-title" className="text-xl font-bold text-[#202124]">
              Review {restaurantName}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast Overlay */}
        {showSuccessToast && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <CheckCircle className="w-16 h-16 text-[#198754] mb-3 animate-bounce" />
            <h4 className="text-xl font-bold text-neutral-900">
              Review Submitted!
            </h4>
            <p className="text-sm text-neutral-600 mt-1">
              Thank you for helping other food lovers discover authentic dining!
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Your Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <StarRating
                rating={rating}
                interactive
                size="xl"
                onRatingChange={(newRating) => {
                  setRating(newRating);
                  if (fieldErrors.rating) {
                    setFieldErrors((prev) => ({ ...prev, rating: [] }));
                  }
                }}
              />
              <span className="text-xs font-semibold text-[#E85D35]">
                {rating > 0 ? ratingDescriptions[rating] : "Click a star to rate"}
              </span>
            </div>
            {fieldErrors.rating && fieldErrors.rating[0] && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.rating[0]}</p>
            )}
          </div>

          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reviewer-name"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="reviewer-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: [] }));
                }}
                placeholder="e.g. Jasleen Kaur"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D35]/20 focus:border-[#E85D35]"
                disabled={isSubmitting}
              />
              {fieldErrors.name && fieldErrors.name[0] && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="reviewer-email"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="reviewer-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: [] }));
                }}
                placeholder="e.g. jasleen@example.com"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D35]/20 focus:border-[#E85D35]"
                disabled={isSubmitting}
              />
              <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3 text-neutral-400" />
                Never publicly displayed.
              </p>
              {fieldErrors.email && fieldErrors.email[0] && (
                <p className="text-xs text-red-600 mt-0.5">{fieldErrors.email[0]}</p>
              )}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label
              htmlFor="review-title"
              className="block text-xs font-semibold text-neutral-700 mb-1"
            >
              Review Title <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Incredible Butter Chicken and Dal Makhani!"
              maxLength={120}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D35]/20 focus:border-[#E85D35]"
              disabled={isSubmitting}
            />
          </div>

          {/* Review Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="review-comment"
                className="block text-xs font-semibold text-neutral-700"
              >
                Detailed Experience <span className="text-red-500">*</span>
              </label>
              <span
                className={`text-[11px] font-medium ${
                  comment.length > 900 ? "text-red-500" : "text-neutral-400"
                }`}
              >
                {comment.length} / 1,000
              </span>
            </div>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (fieldErrors.comment) setFieldErrors((prev) => ({ ...prev, comment: [] }));
              }}
              placeholder="Tell others about the food quality, service, must-try items, and ambiance (minimum 10 characters)..."
              maxLength={1000}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D35]/20 focus:border-[#E85D35] resize-y"
              disabled={isSubmitting}
            />
            {fieldErrors.comment && fieldErrors.comment[0] && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.comment[0]}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#E85D35] hover:bg-[#d64f28] disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-[#E85D35]/25 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
