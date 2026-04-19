// ─────────────────────────────────────────────────────────────
// LIFE STYLE — Product Detail Page
// ─────────────────────────────────────────────────────────────

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { ProductInfo } from '@/components/shop/ProductInfo';
import { ProductCard } from '@/components/shop/ProductCard';

interface ProductPageProps {
  params: { handle: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductByHandle(params.handle).catch(() => null);
  if (!product) return { title: 'Produto não encontrado' };

  return {
    title: product.title,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, relatedProducts] = await Promise.all([
    getProductByHandle(params.handle).catch(() => null),
    getProducts({ first: 4, sortBy: 'BEST_SELLING' }).catch(() => []),
  ]);

  if (!product) notFound();

  const related = relatedProducts.filter((p) => p.handle !== params.handle).slice(0, 4);

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8">
        <nav className="flex items-center gap-2 font-mono text-xs text-charcoal-600">
          <a href="/" className="hover:text-charcoal-900 transition-colors">Início</a>
          <span>/</span>
          <a href="/shop" className="hover:text-charcoal-900 transition-colors">Catálogo</a>
          <span>/</span>
          <span className="text-charcoal-900 truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <ProductGallery product={product} />

          {/* Product info + actions */}
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-cream-100 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-10">
              <p className="section-label mb-3">Você também pode gostar</p>
              <h2 className="font-display text-3xl text-charcoal-900">
                Produtos relacionados
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 2} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
