"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, Image as ImageIcon, Sparkles, Box } from "lucide-react";
import { Badge, Button } from "@/components/ui";

export interface PropertyMediaItem {
  id: string;
  url: string;
  title: string;
  is3d?: boolean;
}

export interface Property3DCarouselProps {
  media?: PropertyMediaItem[];
  propertyName?: string;
  className?: string;
}

const DEFAULT_MEDIA: PropertyMediaItem[] = [
  {
    id: "1",
    url: "/images/properties/property-1.jpg",
    title: "Exterior Skyline View",
    is3d: false,
  },
  {
    id: "2",
    url: "/images/properties/property-2.jpg",
    title: "Interior Penthouse Lounge",
    is3d: false,
  },
  {
    id: "3",
    url: "/images/properties/property-3.jpg",
    title: "Panoramic Balcony",
    is3d: false,
  },
];

export function Property3DCarousel({
  media = DEFAULT_MEDIA,
  propertyName = "Featured Property",
  className = "",
}: Property3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const activeMedia = media[activeIndex] ?? media[0];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Showcase View */}
      <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
        <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 z-10" />

          {/* Fallback image / display placeholder */}
          <div className="text-center p-6 text-slate-500">
            <Box className="w-12 h-12 mx-auto mb-2 text-indigo-400/60" />
            <p className="text-sm font-semibold text-slate-300">{activeMedia.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{propertyName}</p>
          </div>

          {/* Top Overlays */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <Badge variant="outline" className="bg-black/60 backdrop-blur-sm border-slate-700 text-white text-xs">
              {activeIndex + 1} / {media.length}
            </Badge>
            {activeMedia.is3d && (
              <Badge variant="outline" className="bg-indigo-950/80 border-indigo-500 text-indigo-300 text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                3D Gaussian Splat
              </Badge>
            )}
          </div>

          {/* Nav Chevrons */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-slate-700 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
            aria-label="Previous Media"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-slate-700 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
            aria-label="Next Media"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {media.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(idx)}
            className={`h-14 w-20 rounded-lg border overflow-hidden shrink-0 transition-all ${
              activeIndex === idx
                ? "border-indigo-500 ring-2 ring-indigo-500/40"
                : "border-slate-800 opacity-60 hover:opacity-100"
            } bg-slate-950 flex flex-col items-center justify-center text-[10px] text-slate-400`}
          >
            <ImageIcon className="w-4 h-4 mb-0.5 text-slate-400" />
            <span className="truncate max-w-[60px]">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
