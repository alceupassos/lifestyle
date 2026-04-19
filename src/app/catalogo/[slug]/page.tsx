// ─────────────────────────────────────────────────────────────
// LIFE STYLE — /catalogo/[slug] — Product Detail Page
// ─────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductByHandle } from '@/lib/shopify';
import { ProductDetail } from './ProductDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductByHandle(slug);
    if (!product) return { title: 'Produto não encontrado — LIFE STYLE' };
    return {
      title: `${product.title} — LIFE STYLE no BRÁS`,
      description: product.description?.slice(0, 155) || `Compre ${product.title} na LIFE STYLE no BRÁS.`,
    };
  } catch {
    return { title: 'LIFE STYLE no BRÁS' };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product = null;
  try {
    product = await getProductByHandle(slug);
  } catch {
    // Shopify not configured — use mock
  }

  // Mock fallback for development
  if (!product) {
    const MOCK: Record<string, {
      id: string; handle: string; title: string; description: string;
      price: string; compareAtPrice?: string; imageUrl: string;
      images: string[]; tags: string[]; productType: string;
    }> = {
      'blazer-estruturado': {
        id: '1', handle: 'blazer-estruturado', title: 'Blazer Estruturado Premium',
        description: 'Blazer sofisticado com corte estruturado, ideal para ocasiões formais e casuais. Confeccionado em tecido premium com forro respirável.',
        price: 'R$ 489', compareAtPrice: undefined, productType: 'Blazer',
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
        ],
        tags: ['masculino', 'novidade'],
      },
    };
    product = MOCK[slug] ?? null;
  }

  if (!product) notFound();

  // Map ShopifyProduct → ProductProps (flat shape that ProductDetail expects)
  const productProps = 'priceRange' in product
    ? {
        id: product.id,
        handle: product.handle,
        title: product.title,
        description: product.description,
        price: `R$ ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2).replace('.', ',')}`,
        compareAtPrice: undefined,
        imageUrl: product.featuredImage?.url ?? '',
        images: product.images.nodes.map((img) => img.url),
        tags: product.tags,
        productType: product.productType,
      }
    : product;

  return <ProductDetail product={productProps} />;
}
