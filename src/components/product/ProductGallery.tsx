import React, { useState } from 'react';
import { IProductImage } from '../../types/store';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: IProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 text-sm">
        No images available
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id="product-gallery-root" className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails (Desktop: left vertical stack, Mobile: horizontal scroll) */}
      {images.length > 1 && (
        <div
          id="product-thumbnails"
          className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:max-h-[550px] shrink-0 scrollbar-none"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              id={`thumbnail-btn-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedIndex === idx
                  ? 'border-[#8b3a42] ring-2 ring-[#8b3a42]/30 scale-95'
                  : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
              }`}
              aria-label={`View photo ${idx + 1} of ${productName}`}
            >
              <img
                src={img.url}
                alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Feature Image Stage */}
      <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm group">
        <img
          id="main-product-image"
          src={currentImage.url}
          alt={currentImage.alt || productName}
          className={`w-full h-full object-cover object-top transition-transform duration-500 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          loading="eager"
        />

        {/* Zoom icon hint */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-stone-700 hover:bg-white shadow-sm transition"
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Carousel arrows */}
        {images.length > 1 && (
          <>
            <button
              id="gallery-prev-btn"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md text-stone-700 hover:bg-white shadow transition hover:scale-105"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="gallery-next-btn"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-md text-stone-700 hover:bg-white shadow transition hover:scale-105"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots indicators on mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 md:hidden">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  selectedIndex === i ? 'w-5 bg-[#8b3a42]' : 'w-1.5 bg-stone-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
