import React from "react";
import { UtensilsCrossed, Heart, Database, ShieldCheck, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E85D35] flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                zamato<span className="text-[#E85D35] font-light">lite</span>
              </span>
            </div>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
              Zamato Lite is a fast, clean restaurant discovery platform delivering verified dining experiences and genuine community reviews.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-neutral-400">
              <span className="inline-flex items-center gap-1 bg-neutral-800 px-2.5 py-1 rounded-md border border-neutral-700">
                <Database className="w-3 h-3 text-[#198754]" />
                Neon Lakebase PostgreSQL
              </span>
              <span className="inline-flex items-center gap-1 bg-neutral-800 px-2.5 py-1 rounded-md border border-neutral-700">
                <Zap className="w-3 h-3 text-[#F5A623]" />
                Next.js App Router
              </span>
              <span className="inline-flex items-center gap-1 bg-neutral-800 px-2.5 py-1 rounded-md border border-neutral-700">
                <ShieldCheck className="w-3 h-3 text-[#E85D35]" />
                Anti-Spam Protected
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              Ludhiana Bistro
            </h4>
            <ul className="space-y-2">
              <li>SCO 42-43, Feroze Gandhi Market</li>
              <li>Ludhiana, Punjab 141001</li>
              <li>Timings: 11:30 AM – 11:00 PM</li>
              <li className="text-emerald-400 font-medium">Table Reservations Open</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              About Reviews
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              All ratings are dynamically computed from verified customer submissions stored directly on PostgreSQL. Never fabricated or hardcoded.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} Zamato Lite · Ludhiana Bistro Review Portal. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-neutral-400">
            Crafted with <Heart className="w-3 h-3 text-[#E85D35] fill-[#E85D35]" /> for authentic food lovers.
          </div>
        </div>
      </div>
    </footer>
  );
}
