'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShopifyProduct } from '@/types';

export function ProductGallery({ 
  product, 
  externalActiveIndex, 
  onIndexChange 
}: { 
  product: ShopifyProduct;
  externalActiveIndex?: number;
  onIndexChange?: (index: number) => void;
}) {
  const images = product.images.nodes.length > 0
    ? product.images.nodes
    : product.featuredImage ? [product.featuredImage] : [];

  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;
  const setActiveIndex = (updater: number | ((i: number) => number)) => {
    const newIndex = typeof updater === 'function' ? updater(activeIndex) : updater;
    if (onIndexChange) {
      onIndexChange(newIndex);
    } else {
      setInternalActiveIndex(newIndex);
    }
  };
  const activeImage = images[activeIndex];

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  if (!activeImage) {
    return (
      <div className="aspect-portrait bg-cream-200 flex items-center justify-center" style={{ borderRadius: '2px' }}>
        <p className="section-label">Sem imagem</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:sticky lg:top-28 self-start">
      {/* Main image */}
      <div className="relative aspect-portrait bg-cream-200 overflow-hidden group" style={{ borderRadius: '2px' }}>
        <Image
          src={activeImage.url}
          alt={activeImage.altText || product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-102"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream-50/90 backdrop-blur-sm flex items-center justify-center text-charcoal-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-cream-50"
              style={{ borderRadius: '2px' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream-50/90 backdrop-blur-sm flex items-center justify-center text-charcoal-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-cream-50"
              style={{ borderRadius: '2px' }}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-cream-50/90 backdrop-blur-sm px-2 py-1">
            <span className="font-mono text-xs text-charcoal-700">
              {activeIndex + 1}/{images.length}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative aspect-square overflow-hidden bg-cream-200 transition-all duration-200',
                i === activeIndex
                  ? 'ring-2 ring-charcoal-900 ring-offset-1'
                  : 'opacity-60 hover:opacity-100'
              )}
              style={{ borderRadius: '2px' }}
            >
              <Image
                src={img.url}
                alt={img.altText || `${product.title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
