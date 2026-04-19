'use client';

import { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { clsx } from 'clsx';

interface Product {
  id: string;
  title: string;
  handle: string;
  price: string;
  imageUrl: string;
  category?: string;
}

interface TryOnStudioProps {
  products: Product[];
}

// ── Fallback mock products if Shopify is empty ────────────────
const MOCK_PRODUCTS: Product[] = [
  { id: '1', title: 'Organic Cotton Hoodie', handle: 'cotton-hoodie', price: 'R$ 85', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&q=80', category: 'Moletom' },
  { id: '2', title: 'Bamboo Tee', handle: 'bamboo-tee', price: 'R$ 43', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80', category: 'Camiseta' },
  { id: '3', title: 'Recycled Wool Sweater', handle: 'wool-sweater', price: 'R$ 120', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&q=80', category: 'Suéter' },
  { id: '4', title: 'Linen Blazer', handle: 'linen-blazer', price: 'R$ 249', imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80', category: 'Blazer' },
  { id: '5', title: 'Slim Jeans', handle: 'slim-jeans', price: 'R$ 189', imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80', category: 'Calça' },
  { id: '6', title: 'Floral Summer Dress', handle: 'floral-dress', price: 'R$ 159', imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80', category: 'Vestido' },
];

export function TryOnStudio({ products }: TryOnStudioProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS;

  const handlePhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setUserPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleTryOn = (product: Product) => {
    setSelectedProduct(product);
    if (!userPhoto) return;
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <section className="min-h-[calc(100vh-72px)] py-8 px-4" style={{ background: 'var(--ls-bg)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Page title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ background: 'var(--primary-10)', color: 'var(--primary)' }}>
            <Sparkles size={12} />
            Powered by IA
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'var(--font-syne)' }}>
            Life Style
          </h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'var(--font-manrope)' }}>
            Experimente nossas peças virtualmente antes de comprar
          </p>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6">

          {/* ── LEFT PANEL: User Photo ── */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>

            {/* Photo area */}
            <div
              className="relative flex items-center justify-center bg-[#F5F0EA]"
              style={{ minHeight: 320 }}>
              {userPhoto ? (
                <div className="relative w-full h-80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={userPhoto}
                    alt="Sua foto"
                    className="w-full h-full object-cover"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      <p className="text-white text-sm font-medium">Processando IA...</p>
                    </div>
                  )}
                  {selectedProduct && !isProcessing && (
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A1A1A] truncate">{selectedProduct.title}</p>
                        <p className="text-xs text-gray-500">{selectedProduct.price}</p>
                      </div>
                      <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                    </div>
                  )}
                </div>
              ) : (
                /* Silhouette placeholder */
                <div className="flex flex-col items-center justify-center py-12 px-8">
                  <div className="relative w-32 h-44 mb-4">
                    <svg viewBox="0 0 120 160" fill="none" className="w-full h-full">
                      <ellipse cx="60" cy="28" rx="20" ry="22" fill="#C8BFB4" />
                      <path d="M20 160 C20 100 30 85 60 82 C90 85 100 100 100 160Z" fill="#C8BFB4" />
                      <path d="M30 90 L5 140 M90 90 L115 140" stroke="#C8BFB4" strokeWidth="18" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-xs text-center text-[#9B8F85] leading-relaxed"
                    style={{ fontFamily: 'var(--font-manrope)' }}>
                    Experimente nossas peças virtualmente.<br />
                    Faça o upload de uma foto ou use sua câmera.
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="p-4 space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#2D5016', fontFamily: 'var(--font-manrope)' }}>
                Upload Sua Foto
              </button>

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#C4622D', fontFamily: 'var(--font-manrope)' }}>
                Use Sua Câmera
              </button>

              {userPhoto && (
                <button
                  onClick={() => { setUserPhoto(null); setSelectedProduct(null); }}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all"
                  style={{ fontFamily: 'var(--font-manrope)' }}>
                  Remover Foto
                </button>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(f); }} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(f); }} />
          </div>

          {/* ── RIGHT PANEL: Product Grid ── */}
          <div className="bg-white rounded-2xl" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="sticky top-0 bg-white rounded-t-2xl px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-syne)', fontSize: 16 }}>
                Selecione uma peça para experimentar
              </h2>
            </div>

            {/* Scrollable grid */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: 520 }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {displayProducts.map((product) => (
                  <div
                    key={product.id}
                    className={clsx(
                      'rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                      selectedProduct?.id === product.id
                        ? 'border-[#6B21A8] shadow-md'
                        : 'border-transparent hover:border-gray-200'
                    )}>
                    {/* Product image */}
                    <div className="relative bg-gray-50" style={{ aspectRatio: '3/4' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product info */}
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-[#1A1A1A] leading-tight mb-0.5 line-clamp-2"
                        style={{ fontFamily: 'var(--font-manrope)' }}>
                        {product.title}
                      </p>
                      <p className="text-xs font-bold mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-manrope)' }}>
                        {product.price}
                      </p>

                      {/* Try-on button */}
                      <button
                        onClick={() => handleTryOn(product)}
                        className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wide text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-1"
                        style={{ background: '#C4622D', fontFamily: 'var(--font-manrope)' }}>
                        <Sparkles size={10} />
                        Experimente Agora
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-gray-400 mt-6" style={{ fontFamily: 'var(--font-manrope)' }}>
          Resultados gerados por IA — podem não ser 100% precisos. Consulte as medidas antes de comprar.
        </p>
      </div>
    </section>
  );
}
