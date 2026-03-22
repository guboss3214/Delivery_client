'use client';

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Store, Star } from "lucide-react";

interface ShopCardProps {
  id: string;
  name: string;
  rating: number;
  imageUrl?: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export default function ShopCard({ id, name, rating, imageUrl, isActive, onClick }: ShopCardProps) {
  return (
    <div 
      onClick={() => onClick(id)}
      className={twMerge(
        "group cursor-pointer p-3 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 w-full relative overflow-hidden",
        isActive 
          ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10" 
          : "border-gray-50 bg-white hover:border-emerald-200 hover:bg-gray-50/50"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
      )}

      <div className={clsx(
        "w-12 h-12 rounded-xl shrink-0 overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
        isActive ? "bg-emerald-100" : "bg-gray-100"
      )}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <Store className={clsx("w-6 h-6", isActive ? "text-emerald-600" : "text-gray-400")} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={clsx(
          "font-bold truncate transition-colors",
          isActive ? "text-emerald-900" : "text-gray-700"
        )}>
          {name}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Star className={clsx("w-3.5 h-3.5", rating > 0 ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
          <span className="text-xs font-bold text-gray-500">{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className={clsx(
        "transition-all duration-300 transform",
        isActive ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
      )}>
        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <svg className="w-3 h-3 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}