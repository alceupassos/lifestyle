// ─────────────────────────────────────────────────────────────
// LIFE STYLE — Shop Page
// ─────────────────────────────────────────────────────────────

import { Suspense } from 'react';
import { getProducts, getCollections } from '@/lib/shopify';
import { ProductCard } from '@/components/shop/ProductCard';
import { ShopFilters } from '@/components/shop/ShopFilters';
import { ProductGridSkeleton } from '@/components/ui/Skeletons';
import type { SortOption } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo — LIFE STYLE no BRÁS',
  description: 'Explore a coleção LIFE STYLE no BRÁS com provador virtual por IA.',
};

interface ShopPageProps {
  searchParams: {
    sort?: string;
    collection?: string;
    q?: string;
    min?: string;
    max?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sortBy = (searchParams.sort as SortOption) || 'BEST_SELLING';
  const searchQuery = searchParams.q;

  const [products, collections] = await Promise.all([
    getProducts({
      first: 24,
      sortBy,
      query: searchQuery,
    }).catch(() => []),
    getCollections(8).catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Page header */}
      <div className="bg-cream-100 border-b border-black/6 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="section-label mb-3">Loja</p>
          <h1 className="font-display text-5xl text-charcoal-900">
            {searchQuery ? `"${searchQuery}"` : 'Catálogo completo'}
          </h1>
          <p className="text-charcoal-600 text-sm mt-3">
            {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            {searchQuery && ' para sua busca'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <ShopFilters
              collections={collections}
              currentSort={sortBy}
              currentCollection={searchParams.collection}
            />
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            <Suspense fallback={<ProductGridSkeleton count={12} />}>
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={i < 8}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <p className="font-display text-2xl text-charcoal-900 mb-3">
                    Nenhum produto encontrado
                  </p>
                  <p className="text-charcoal-600 text-sm">
                    Tente ajustar os filtros ou busque por outro termo.
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
