"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Utensils, IndianRupee, Clock, Award, Star, MessageSquarePlus } from "lucide-react";
import type { Restaurant } from "../../drizzle/schema";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  averageRating: number;
  totalReviews: number;
  onOpenWriteModal: () => void;
}

export function RestaurantHeader({
  restaurant,
  averageRating,
  totalReviews,
  onOpenWriteModal,
}: RestaurantHeaderProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-sm mb-8">
      {/* Cover Image Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-neutral-900 overflow-hidden">
        <img
          src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-neutral-900 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#198754] animate-pulse"></span>
            Open Now · 11:30 AM – 11:00 PM
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md">
            Dine-in · Takeaway · Delivery
          </span>
        </div>

        {/* Bottom Banner Content */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#E85D35] text-white">
                Authentic Punjabi
              </span>
              <span className="text-xs text-white/80 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#F5A623]" />
                Top Rated Bistro
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {restaurant.name}
            </h1>

            <p className="text-sm sm:text-base text-neutral-200 mt-2 line-clamp-2 leading-relaxed">
              {restaurant.description}
            </p>
          </div>

          {/* Quick Rating Badge & Write CTA on Cover for Desktop */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <div className="bg-[#198754] text-white px-2.5 py-1 rounded-xl text-lg font-bold flex items-center gap-1 shadow-sm">
                <span>{averageRating > 0 ? averageRating.toFixed(1) : "New"}</span>
                <Star className="w-4 h-4 fill-white text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">
                  {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
                </div>
                <div className="text-[11px] text-white/70">Verified Dining</div>
              </div>
            </div>

            <button
              onClick={onOpenWriteModal}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm bg-[#E85D35] hover:bg-[#d64f28] text-white shadow-lg shadow-[#E85D35]/30 transition-all hover:scale-102 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* Meta Bar below cover */}
      <div className="px-6 py-4 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-600 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-[#E85D35] shrink-0" />
          <div>
            <span className="font-semibold text-neutral-800">Cuisine: </span>
            {restaurant.cuisine}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-[#E85D35] shrink-0" />
          <div>
            <span className="font-semibold text-neutral-800">Cost: </span>
            {restaurant.priceRange || "₹800 for two"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#E85D35] shrink-0" />
          <div className="truncate" title={restaurant.address || ""}>
            <span className="font-semibold text-neutral-800">Location: </span>
            {restaurant.address || "Feroze Gandhi Market, Ludhiana"}
          </div>
        </div>
      </div>
    </div>
  );
}
