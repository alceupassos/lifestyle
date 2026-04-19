'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { useCartStore } from '@/hooks/useCartStore';

export interface ProductCardData {
  id: string;
  handle: string;
  title: string;
  productType: string;
  tags: string[];
  priceMin: number;
  priceMax: number;
  compareAtPriceMin?: number;
  currencyCode: string;
  imageUrl?: string;
  imageAlt?: string;
  availableForSale: boolean;
  variantId?: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, openCart } = useCartStore();

  const discount =
    product.compareAtPriceMin && product.compareAtPriceMin > product.priceMin
      ? Math.round(((product.compareAtPriceMin - product.priceMin) / product.compareAtPriceMin) * 100)
      : null;

  const formatPrice = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: product.currencyCode || 'BRL' });

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.variantId) return;

    addItem({
      id: product.id,
      variantId: product.variantId,
      title: product.title,
      variantTitle: '',
      price: product.priceMin,
      currencyCode: product.currencyCode,
      image: product.imageUrl,
      quantity: 1,
      handle: product.handle,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
    openCart();
  };

  return (
    <Link href={`/catalogo/${product.handle}`} className={clsx('group block', className)}>
      <div className="ls-card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt || product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-4xl">👗</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="ls-badge-new text-[11px] px-2 py-0.5">NOVO</span>
            )}
            {discount && (
              <span className="ls-badge-sale text-[11px] px-2 py-0.5">-{discount}%</span>
            )}
            {!product.availableForSale && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-900 text-white" style={{ fontFamily: 'var(--font-manrope)' }}>
                ESGOTADO
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          >
            <Heart
              size={15}
              className={clsx('transition-colors', wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600')}
            />
          </button>

          {/* Quick Add overlay */}
          {product.availableForSale && product.variantId && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white transition-all"
                style={{
                  background: addedToCart ? '#22C55E' : 'var(--primary)',
                  fontFamily: 'var(--font-manrope)',
                }}
              >
                {addedToCart ? (
                  <>✓ Adicionado!</>
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {product.productType && (
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--primary)', fontFamily: 'var(--font-manrope)' }}>
              {product.productType}
            </p>
          )}
          <h3
            className="text-sm font-semibold text-[#0F172A] leading-snug mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold" style={{ color: discount ? 'var(--accent-orange)' : 'var(--ls-text)', fontFamily: 'var(--font-manrope)' }}>
              {formatPrice(product.priceMin)}
            </span>
            {product.compareAtPriceMin && product.compareAtPriceMin > product.priceMin && (
              <span className="text-sm text-gray-400 line-through" style={{ fontFamily: 'var(--font-manrope)' }}>
                {formatPrice(product.compareAtPriceMin)}
              </span>
            )}
          </div>

          {/* Try on hint */}
          <div className="flex items-center gap-1 mt-2">
            <Zap size={11} style={{ color: 'var(--accent-orange)' }} />
            <span className="text-[11px] text-gray-400" style={{ fontFamily: 'var(--font-manrope)' }}>
              Experimente virtualmente
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
