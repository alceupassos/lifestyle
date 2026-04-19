'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Sparkles, ChevronLeft, Heart } from 'lucide-react';
import { clsx } from 'clsx';

const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

interface ProductProps {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  imageUrl: string;
  images?: string[];
  tags?: string[];
  productType?: string;
}

export function ProductDetail({ product }: { product: ProductProps }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const images = product.images?.length ? product.images : [product.imageUrl];

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: 'var(--ls-bg)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/catalogo"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            style={{ fontFamily: 'var(--font-manrope)' }}>
            <ChevronLeft size={16} />
            Catálogo
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-800 font-medium truncate" style={{ fontFamily: 'var(--font-manrope)' }}>
            {product.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Images ── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative bg-white rounded-2xl overflow-hidden aspect-[3/4]"
              style={{ boxShadow: 'var(--shadow-card)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.compareAtPrice && (
                <div className="absolute top-4 left-4 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                  SALE
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={clsx(
                      'w-16 h-20 rounded-xl overflow-hidden border-2 transition-all',
                      selectedImage === i ? 'border-purple-600' : 'border-transparent opacity-70 hover:opacity-100'
                    )}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl p-6 flex-1 flex flex-col gap-5"
              style={{ boxShadow: 'var(--shadow-card)' }}>

              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  {product.productType && (
                    <span className="text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-lg"
                      style={{ background: 'var(--primary-10)', color: 'var(--primary)', fontFamily: 'var(--font-manrope)' }}>
                      {product.productType}
                    </span>
                  )}
                  <h1 className="text-2xl font-bold text-[#0F172A] mt-2 leading-snug"
                    style={{ fontFamily: 'var(--font-syne)' }}>
                    {product.title}
                  </h1>
                </div>
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex-shrink-0">
                  <Heart size={18} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-syne)' }}>
                  {product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg text-gray-400 line-through" style={{ fontFamily: 'var(--font-manrope)' }}>
                    {product.compareAtPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'var(--font-manrope)' }}>
                  {product.description}
                </p>
              )}

              {/* Size selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#0F172A]" style={{ fontFamily: 'var(--font-manrope)' }}>
                    Tamanho
                  </p>
                  <button className="text-xs text-purple-600 underline" style={{ fontFamily: 'var(--font-manrope)' }}>
                    Guia de medidas
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={clsx(
                        'h-10 px-3 min-w-[44px] rounded-xl text-sm font-semibold border-[1.5px] transition-all',
                        selectedSize === size
                          ? 'text-white border-transparent'
                          : 'border-gray-200 text-gray-700 hover:border-purple-400'
                      )}
                      style={selectedSize === size ? { background: 'var(--primary)' } : {}}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {product.tags.map((tag) => (
                    <span key={tag}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                      style={{ fontFamily: 'var(--font-manrope)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3 mt-auto">
                <button
                  className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: 'var(--primary)', fontFamily: 'var(--font-manrope)' }}>
                  <ShoppingCart size={17} />
                  Adicionar ao Carrinho
                </button>

                <Link
                  href={`/tryon?produto=${product.handle}`}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 border-2"
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontFamily: 'var(--font-manrope)' }}>
                  <Sparkles size={17} />
                  Experimentar com IA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
