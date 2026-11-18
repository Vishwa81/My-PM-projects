"use client";

import React from "react";
import { UtensilsCrossed, MapPin, ChevronRight, MessageSquarePlus } from "lucide-react";

interface NavbarProps {
  onOpenWriteModal: () => void;
}

export function Navbar({ onOpenWriteModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Breadcrumbs */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E85D35] to-[#f87a55] flex items-center justify-center text-white shadow-md shadow-[#E85D35]/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-lg font-black tracking-tight text-[#202124]">
                zamato<span className="text-[#E85D35] font-light">lite</span>
              </span>
            </div>
          </div>

          {/* Breadcrumb (desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 truncate">
            <span>India</span>
            <ChevronRight className="w-3 h-3" />
            <span>Ludhiana</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-600 font-medium">Ludhiana Bistro</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#E85D35] font-semibold">Reviews</span>
          </nav>
        </div>

        {/* Right side: Location badge & CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-100 text-xs font-medium text-neutral-700">
            <MapPin className="w-3.5 h-3.5 text-[#E85D35]" />
            <span>Ludhiana, Punjab</span>
          </div>

          <button
            onClick={onOpenWriteModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#E85D35] hover:bg-[#d64f28] text-white shadow-sm shadow-[#E85D35]/30 transition-all hover:scale-102 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        </div>
      </div>
    </header>
  );
}
