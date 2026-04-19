'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { ShopifyCollection, SortOption } from '@/types';

interface ShopFiltersProps {
  collections: ShopifyCollection[];
  currentSort: SortOption;
  currentCollection?: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'BEST_SELLING', label: 'Mais vendidos' },
  { value: 'CREATED_AT_DESC', label: 'Novidades' },
  { value: 'PRICE_ASC', label: 'Menor preço' },
  { value: 'PRICE_DESC', label: 'Maior preço' },
  { value: 'RELEVANCE', label: 'Relevância' },
];

export function ShopFilters({ collections, currentSort, currentCollection }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-8 sticky top-24">
      {/* Sort */}
      <div>
        <p className="section-label mb-4">Ordenar por</p>
        <ul className="space-y-1">
          {SORT_OPTIONS.map(({ value, label }) => (
            <li key={value}>
              <button
                onClick={() => updateParam('sort', value)}
                className={cn(
                  'w-full text-left font-body text-sm px-3 py-2 transition-all duration-150',
                  currentSort === value
                    ? 'bg-charcoal-900 text-cream-50'
                    : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200'
                )}
                style={{ borderRadius: '2px' }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Collections */}
      {collections.length > 0 && (
        <div>
          <p className="section-label mb-4">Coleções</p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => updateParam('collection', null)}
                className={cn(
                  'w-full text-left font-body text-sm px-3 py-2 transition-all duration-150',
                  !currentCollection
                    ? 'bg-charcoal-900 text-cream-50'
                    : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200'
                )}
                style={{ borderRadius: '2px' }}
              >
                Todos os produtos
              </button>
            </li>
            {collections.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => updateParam('collection', c.handle)}
                  className={cn(
                    'w-full text-left font-body text-sm px-3 py-2 transition-all duration-150',
                    currentCollection === c.handle
                      ? 'bg-charcoal-900 text-cream-50'
                      : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200'
                  )}
                  style={{ borderRadius: '2px' }}
                >
                  {c.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Try-on filter */}
      <div className="p-4 bg-cream-200" style={{ borderRadius: '2px', border: '1px solid rgba(212,168,67,0.3)' }}>
        <p className="section-label text-gold-500 mb-2">Try-On AI</p>
        <p className="font-body text-xs text-charcoal-700 leading-relaxed">
          Todos os produtos suportam virtual try-on com fashn.ai.
        </p>
      </div>
    </div>
  );
}
