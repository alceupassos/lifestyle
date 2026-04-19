// ─────────────────────────────────────────────────────────────
// LIFE STYLE — Página /tryon  (Server Component wrapper)
// ─────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { TryOnStudio } from '@/components/tryon/TryOnStudio';

export const metadata: Metadata = {
  title: 'IA Studio — LIFE STYLE no BRÁS',
  description: 'Experimente qualquer peça da LIFE STYLE no BRÁS virtualmente com IA. Veja como fica antes de comprar.',
};

export default async function TryOnPage() {
  const rawProducts = await getProducts({ first: 24, sortBy: 'BEST_SELLING' }).catch(() => []);

  // Map ShopifyProduct → flat Product shape that TryOnStudio expects
  const products = rawProducts.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    price: `R$ ${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2).replace('.', ',')}`,
    imageUrl: p.featuredImage?.url ?? '',
    category: p.productType || undefined,
  }));

  return (
    <div className="min-h-screen" style={{ background: 'var(--ls-bg)' }}>
      {/* Studio */}
      <TryOnStudio products={products} />
    </div>
  );
}
