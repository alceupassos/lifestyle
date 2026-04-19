'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import type { ShopifyProduct } from '@/types';
import { formatPrice } from '@/lib/shopify';

// Categorias mapeadas das tags/tipos do Shopify
const CATEGORIES = [
  'Todos',
  'Bermuda',
  'Blazer',
  'Blusa',
  'Calça',
  'Camisa',
  'Camiseta',
  'Conjunto',
  'Corta Vento',
  'Jaqueta',
  'Jeans',
  'Moletom',
  'Polo',
  'Saia',
  'Short',
  'Vestido',
];

const SORT_OPTIONS = [
  { value: 'RELEVANCE', label: 'Relevância' },
  { value: 'BEST_SELLING', label: 'Mais Vendidos' },
  { value: 'PRICE_ASC', label: 'Menor Preço' },
  { value: 'PRICE_DESC', label: 'Maior Preço' },
  { value: 'CREATED_AT_DESC', label: 'Novidades' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export function CatalogContent() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState<SortValue>('RELEVANCE');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Converte produto local para shape ShopifyProduct
  const toShopifyShape = (p: { id: string; code: string; name: string; category: string; gender: string; price: number; image: string | null }) => ({
    id: p.id,
    handle: p.code,
    title: p.name,
    productType: p.category,
    vendor: 'Life Style',
    tags: [p.category, p.gender === 'F' ? 'Feminino' : p.gender === 'M' ? 'Masculino' : 'Unissex'],
    priceRange: {
      minVariantPrice: { amount: p.price.toFixed(2), currencyCode: 'BRL' },
      maxVariantPrice: { amount: p.price.toFixed(2), currencyCode: 'BRL' },
    },
    featuredImage: p.image ? { url: p.image, altText: p.name } : null,
    images: { nodes: p.image ? [{ url: p.image, altText: p.name }] : [] },
    variants: { nodes: [{ id: `${p.id}-v1`, title: 'Padrão', availableForSale: true, compareAtPrice: null, price: { amount: p.price.toFixed(2), currencyCode: 'BRL' } }] },
  });

  // Busca produtos via API route (server-side Shopify) com fallback para catálogo local
  useEffect(() => {
    setLoading(true);
    fetch(`/api/shopify/products?first=50&sortBy=${sortBy}`)
      .then((r) => r.json())
      .then(async (d) => {
        const shopifyProducts: ShopifyProduct[] = d.products ?? [];
        if (shopifyProducts.length > 0) {
          setProducts(shopifyProducts);
        } else {
          const catalogData = await import('@/data/catalog.json');
          setProducts(catalogData.default.products.map(toShopifyShape) as unknown as ShopifyProduct[]);
        }
        setLoading(false);
      })
      .catch(async () => {
        const catalogData = await import('@/data/catalog.json');
        setProducts(catalogData.default.products.map(toShopifyShape) as unknown as ShopifyProduct[]);
        setLoading(false);
      });
  }, [sortBy]);

  // Filtra client-side por busca e categoria
  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.productType?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== 'Todos') {
      result = result.filter(
        (p) =>
          p.productType?.toLowerCase() === activeCategory.toLowerCase() ||
          p.tags?.some((t) => t.toLowerCase() === activeCategory.toLowerCase())
      );
    }

    return result;
  }, [products, search, activeCategory]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Ordenar';

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', fontFamily: 'var(--font-manrope, sans-serif)' }}>

      {/* ── TOP BAR ─────────────────────────────────── */}
      <div style={{ background: '#1A1A18', color: '#C9B99A', textAlign: 'center', padding: '8px 16px', fontSize: '12px', letterSpacing: '0.08em' }}>
        FRETE GRÁTIS ACIMA DE R$ 300 · ATACADO A PARTIR DE 10 PEÇAS · SHOPPING STUNT, BRÁS
      </div>

      {/* ── NAVBAR ──────────────────────────────────── */}
      <nav style={{ background: '#FAFAF8', borderBottom: '1px solid #E8E4DC', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', letterSpacing: '0.12em', color: '#9B9B8A', textTransform: 'uppercase' }}>← Início</span>
        </Link>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, letterSpacing: '0.18em', color: '#1A1A18', textTransform: 'uppercase' }}>
            Life Style
          </span>
        </Link>
        <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: '#9B9B8A' }}>
          {loading ? '…' : `${filtered.length} peças`}
        </span>
      </nav>

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px 0' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#9B9B8A', textTransform: 'uppercase', marginBottom: '8px' }}>Coleção Completa</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 400, color: '#1A1A18', marginBottom: '28px' }}>Catálogo</h1>

        {/* ── SEARCH + CONTROLS ───────────────────── */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9B9B8A' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar peças..."
              style={{
                width: '100%',
                paddingLeft: '42px',
                paddingRight: '16px',
                paddingTop: '11px',
                paddingBottom: '11px',
                border: '1px solid #E8E4DC',
                background: '#FFFFFF',
                fontSize: '14px',
                color: '#1A1A18',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSort(!showSort)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 16px', border: '1px solid #E8E4DC', background: '#FFFFFF', fontSize: '13px', color: '#1A1A18', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em' }}
            >
              {sortLabel}
              <ChevronDown size={14} />
            </button>
            {showSort && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: '#FFFFFF', border: '1px solid #E8E4DC', zIndex: 50, minWidth: '180px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { setSortBy(o.value); setShowSort(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', background: o.value === sortBy ? '#F4F1EA' : 'transparent', border: 'none', fontSize: '13px', color: '#1A1A18', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile filters */}
          <button
            onClick={() => setShowFilters(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 16px', border: '1px solid #E8E4DC', background: '#FFFFFF', fontSize: '13px', color: '#1A1A18', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <SlidersHorizontal size={15} />
            Filtros
          </button>
        </div>

        {/* ── CATEGORY PILLS ──────────────────────── */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '7px 16px',
                border: `1px solid ${activeCategory === cat ? '#1A1A18' : '#E8E4DC'}`,
                background: activeCategory === cat ? '#1A1A18' : '#FFFFFF',
                color: activeCategory === cat ? '#FAFAF8' : '#4A4A42',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: activeCategory === cat ? 600 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
          {activeCategory !== 'Todos' && (
            <button
              onClick={() => setActiveCategory('Todos')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 12px', border: '1px solid #E8E4DC', background: 'transparent', color: '#9B9B8A', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <X size={12} /> Limpar
            </button>
          )}
        </div>
      </div>

      {/* ── PRODUCT GRID ────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px 80px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: '3/4', background: '#F0EDE6', animation: 'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1A1A18', marginBottom: '12px' }}>Nenhuma peça encontrada</p>
            <p style={{ color: '#9B9B8A', fontSize: '14px', marginBottom: '24px' }}>Tente outro termo ou remova os filtros</p>
            <button
              onClick={() => { setActiveCategory('Todos'); setSearch(''); }}
              style={{ background: '#1A1A18', color: '#FAFAF8', border: 'none', padding: '12px 32px', fontSize: '13px', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase' }}
            >
              Ver Todos
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filtered.map((product) => {
              const price = product.priceRange.minVariantPrice;
              const compareAt = product.variants?.nodes?.[0]?.compareAtPrice;
              const available = product.variants?.nodes?.[0]?.availableForSale ?? true;
              return (
                <Link key={product.id} href={`/catalogo/${product.handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article style={{ background: '#FFFFFF', border: '1px solid #E8E4DC', transition: 'box-shadow 0.2s ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    {/* Image */}
                    <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden', background: '#F0EDE6' }}>
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.title}
                          fill
                          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                        />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: '48px', color: 'rgba(0,0,0,0.1)' }}>LS</span>
                        </div>
                      )}
                      {/* Badges */}
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {compareAt && (
                          <span style={{ background: '#D64F4F', color: '#fff', padding: '3px 8px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>PROMOÇÃO</span>
                        )}
                        {!available && (
                          <span style={{ background: '#9B9B8A', color: '#fff', padding: '3px 8px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>ESGOTADO</span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '16px' }}>
                      <p style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#9B9B8A', textTransform: 'uppercase', marginBottom: '6px' }}>
                        {product.productType || product.vendor || 'Life Style'}
                      </p>
                      <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A18', marginBottom: '10px', lineHeight: 1.3 }}>
                        {product.title}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A18' }}>
                          {formatPrice(price.amount, price.currencyCode)}
                        </span>
                        {compareAt && (
                          <span style={{ fontSize: '12px', color: '#9B9B8A', textDecoration: 'line-through' }}>
                            {formatPrice(compareAt.amount, compareAt.currencyCode)}
                          </span>
                        )}
                      </div>
                      {/* Sizes preview */}
                      {product.variants?.nodes && product.variants.nodes.length > 1 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
                          {product.variants.nodes.slice(0, 5).map((v) => (
                            <span key={v.id} style={{ padding: '2px 8px', border: '1px solid #E8E4DC', fontSize: '10px', color: v.availableForSale ? '#1A1A18' : '#C9C9C0', textDecoration: v.availableForSale ? 'none' : 'line-through' }}>
                              {v.title}
                            </span>
                          ))}
                          {product.variants.nodes.length > 5 && (
                            <span style={{ fontSize: '10px', color: '#9B9B8A', padding: '2px 4px' }}>+{product.variants.nodes.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div style={{ padding: '0 16px 16px' }}>
                      <button
                        style={{ width: '100%', background: '#1A1A18', color: '#FAFAF8', border: 'none', padding: '11px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'inherit', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#3D4A35'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1A1A18'; }}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MOBILE FILTER DRAWER ────────────────────── */}
      {showFilters && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowFilters(false)} />
          <div style={{ position: 'relative', marginLeft: 'auto', width: '300px', height: '100%', background: '#FAFAF8', overflowY: 'auto', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#1A1A18' }}>Filtros</h3>
              <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A4A42' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9B9B8A', marginBottom: '12px' }}>Categoria</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setShowFilters(false); }}
                  style={{ textAlign: 'left', padding: '10px 0', background: 'none', border: 'none', borderBottom: '1px solid #E8E4DC', fontSize: '14px', color: activeCategory === cat ? '#1A1A18' : '#4A4A42', fontWeight: activeCategory === cat ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer style={{ background: '#1A1A18', color: '#C9B99A', padding: '40px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#FAFAF8', marginBottom: '8px' }}>Life Style</p>
        <p style={{ fontSize: '13px', color: '#9B9B8A' }}>R. Conselheiro Belísário, 41 · ST1 061 · Shopping Stunt · Brás, São Paulo</p>
        <p style={{ fontSize: '12px', color: '#5A5A50', marginTop: '16px' }}>© 2025 Life Style. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
