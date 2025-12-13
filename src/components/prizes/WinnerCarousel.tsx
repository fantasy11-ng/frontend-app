"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";

interface WinnerPhoto {
  id: string;
  image: string;
  alt?: string;
}

interface WinnerCarouselProps {
  title: string;
  photos: WinnerPhoto[];
  year: string;
}

export default function WinnerCarousel({
  title,
  photos,
}: WinnerCarouselProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (photos.length === 0) {
    return null;
  }

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="h-full w-[280px] flex-shrink-0 snap-start rounded-[32px] border border-[#E5E7EB] bg-white px-3 py-3 shadow-[0px_24px_80px_rgba(7,10,17,0.06)] sm:w-full">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#FFF4EA]">
            <Trophy className="h-4 w-4 text-[#C27834]" />
          </div>
          <p className="text-sm text-[#070A11]">{title}</p>
        </div>
      </div>

      <div className="relative">
        <div className="relative min-h-[360px] w-full max-w-[416px] overflow-hidden rounded-[28px] bg-[#F7F8FB] sm:min-h-[424px] sm:max-w-full">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentPhotoIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {photo.image ? (
                <Image
                  src={photo.image}
                  alt={photo.alt || `${title} - Photo ${index + 1}`}
                  fill
                  className="object-cover object-[50%_25%]"
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority={index === 0}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl text-gray-300">
                  🏆
                </div>
              )}
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={handlePreviousPhoto}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-white/90"
            >
              <ChevronLeft className="h-5 w-5 text-[#070A11]" />
            </button>
            <button
              onClick={handleNextPhoto}
              aria-label="Next photo"
              className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-white/90"
            >
              <ChevronRight className="h-5 w-5 text-[#070A11]" />
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhotoIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentPhotoIndex
                  ? "w-6 bg-[#070A11]"
                  : "w-2 bg-[#C6CBD8]"
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
