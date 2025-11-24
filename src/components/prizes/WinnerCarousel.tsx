'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function WinnerCarousel({ title, photos }: WinnerCarouselProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg">
        {/* Show 1 image at a time */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentPhotoIndex * 100}%)` 
          }}
        >
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="min-w-full relative"
            >
              {/* Image Container */}
              <div className="relative h-96 w-full bg-gradient-to-br from-green-400 to-green-600 overflow-hidden">
                {/* Background Image Placeholder - Only show if no image */}
                {!photo.image && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                    <div className="text-white text-6xl opacity-20">🏆</div>
                  </div>
                )}
                
                {/* Actual Image - Display when available */}
                {photo.image && (
                  <Image
                    src={photo.image}
                    alt={photo.alt || `${title} - Photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                )}
                
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Trophy Icon and Title Overlay */}
                <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                  <Image src="/images/Gold.png" alt="Trophy" width={20} height={20} className="w-5 h-5 drop-shadow-lg" />
                  <span className="text-white font-semibold text-lg drop-shadow-lg">{title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={handlePreviousPhoto}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all z-20"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all z-20"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Carousel Indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentPhotoIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
