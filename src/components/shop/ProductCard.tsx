'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Camera, ShoppingBag, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/shopify';
import { cn } from '@/lib/utils';
import type { ShopifyProduct } from '@/types';
import { TryOnModal } from '@/components/tryon/TryOnModal';

interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
  showTryOnBadge?: boolean;
}

export function ProductCard({ product, priority = false, showTryOnBadge = true }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);

  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  );

  const compareAtPrice = product.variants.nodes[0]?.compareAtPrice;
  const isOnSale = compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount);

  const secondImage = product.images.nodes[1];
  const mainImage = product.featuredImage || product.images.nodes[0];

  const garmentImageUrl = mainImage?.url || '';

  return (
    <>
      <div
        className="card-product group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <Link href={`/product/${product.handle}`} className="block relative aspect-portrait overflow-hidden bg-cream-200">
          {mainImage ? (
            <>
              <Image
                src={mainImage.url}
                alt={mainImage.altText || product.title}
                fill
                className={cn(
                  'object-cover card-product-image transition-opacity duration-500',
                  hovered && secondImage ? 'opacity-0' : 'opacity-100'
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
              />
              {secondImage && (
                <Image
                  src={secondImage.url}
                  alt={secondImage.altText || product.title}
                  fill
                  className={cn(
                    'object-cover card-product-image absolute inset-0 transition-opacity duration-500',
                    hovered ? 'opacity-100' : 'opacity-0'
                  )}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-200">
              <ShoppingBag size={32} className="text-charcoal-600 opacity-30" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOnSale && <span className="badge badge-sale">Sale</span>}
            {product.tags.includes('new') && <span className="badge badge-new">Novo</span>}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            className={cn(
              'absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-cream-50/90 backdrop-blur-sm transition-all duration-200',
              'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0',
              wishlisted && 'opacity-100'
            )}
            style={{ borderRadius: '2px' }}
          >
            <Heart
              size={14}
              className={cn(
                'transition-colors',
                wishlisted ? 'fill-terracotta-500 text-terracotta-500' : 'text-charcoal-700'
              )}
            />
          </button>

          {/* Try-on CTA on hover */}
          {showTryOnBadge && garmentImageUrl && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTryOnOpen(true);
              }}
              className={cn(
                'absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 py-3 bg-cream-50/95 backdrop-blur-sm',
                'transition-all duration-300 cursor-pointer',
                hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              )}
            >
              <Camera size={14} className="text-gold-500" />
              <span className="font-mono text-xs text-charcoal-800 tracking-wide">Experimentar</span>
            </button>
          )}
        </Link>

        {/* Info */}
        <div className="pt-4 pb-2">
          <p className="font-mono text-xs text-charcoal-600 mb-1 uppercase tracking-wider">
            {product.vendor || product.productType}
          </p>
          <Link href={`/product/${product.handle}`}>
            <h3 className="font-body text-sm font-medium text-charcoal-900 leading-snug hover:text-charcoal-600 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-body text-sm font-medium text-charcoal-900">{price}</span>
            {isOnSale && compareAtPrice && (
              <span className="font-body text-xs text-charcoal-600 line-through">
                {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
              </span>
            )}
          </div>

          {/* Color swatches */}
          {product.options.some(o => o.name.toLowerCase() === 'cor' || o.name.toLowerCase() === 'color') && (
            <div className="flex gap-1.5 mt-2">
              {product.options
                .find(o => o.name.toLowerCase() === 'cor' || o.name.toLowerCase() === 'color')
                ?.values.slice(0, 5)
                .map((color) => (
                  <div
                    key={color}
                    className="w-3 h-3 rounded-full border border-black/10"
                    title={color}
                    style={{ background: colorToHex(color) }}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Try-On Modal */}
      {tryOnOpen && garmentImageUrl && (
        <TryOnModal
          isOpen={tryOnOpen}
          onClose={() => setTryOnOpen(false)}
          garmentImageUrl={garmentImageUrl}
          garmentName={product.title}
        />
      )}
    </>
  );
}

function colorToHex(colorName: string): string {
  const map: Record<string, string> = {
    preto: '#0F0F0D', negro: '#0F0F0D', black: '#0F0F0D',
    branco: '#FAFAFA', white: '#FAFAFA',
    azul: '#3B6EA5', blue: '#3B6EA5',
    vermelho: '#C0392B', red: '#C0392B',
    verde: '#27AE60', green: '#27AE60',
    amarelo: '#F1C40F', yellow: '#F1C40F',
    rosa: '#E91E8C', pink: '#E91E8C',
    cinza: '#95A5A6', gray: '#95A5A6', grey: '#95A5A6',
    bege: '#D4B896', beige: '#D4B896',
    marrom: '#8B6347', brown: '#8B6347',
    caramelo: '#C17B5C',
  };
  return map[colorName.toLowerCase()] || '#C2B5A5';
}
