// LIFE STYLE — Homepage redesign com imagens do catálogo real
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, formatPrice } from '@/lib/shopify';
import { Instagram, MessageCircle, ChevronRight, Phone } from 'lucide-react';
import './home.css';

export const metadata = {
  title: 'Life Style — Moda Masculina | Shopping Stunt, Brás',
  description: 'Moda masculina de alta qualidade. Blazer, Camisa, Calça, Bermuda, Polo, Jaqueta. Atacado a partir de 10 peças. Shopping Stunt, Brás, São Paulo.',
};

const CDN = 'https://supliutech.nyc3.cdn.digitaloceanspaces.com/products2';

const CATEGORIES = [
  { label: 'Blazer',    img: '/images/cat-prod-blazer.jpg',   href: '/catalogo?cat=Blazer' },
  { label: 'Camisa',    img: '/images/cat-prod-camisa.jpg',   href: '/catalogo?cat=Camisa' },
  { label: 'Calça',     img: '/images/cat-prod-calca.jpg',    href: '/catalogo?cat=Calça' },
  { label: 'Bermuda',   img: '/images/cat-prod-bermuda.jpg',  href: '/catalogo?cat=Bermuda' },
  { label: 'Polo',      img: '/images/cat-prod-polo.jpg',     href: '/catalogo?cat=Polo' },
  { label: 'Camiseta',  img: '/images/cat-prod-camiseta.jpg', href: '/catalogo?cat=Camiseta' },
  { label: 'Jaqueta',   img: '/images/cat-prod-jaqueta.jpg',  href: '/catalogo?cat=Jaqueta' },
  { label: 'Ver Todos', img: null,                            href: '/catalogo' },
];

export default async function HomePage() {
  const [featured, bestSelling] = await Promise.all([
    getProducts({ first: 3, sortBy: 'RELEVANCE' }).catch(() => []),
    getProducts({ first: 8, sortBy: 'BEST_SELLING' }).catch(() => []),
  ]);

  return (
    <div className="ls-home">

      {/* TOP BAR */}
      <div className="ls-topbar">
        FRETE GRÁTIS ACIMA DE R$&nbsp;300 &nbsp;·&nbsp; ATACADO A PARTIR DE 10 PEÇAS &nbsp;·&nbsp; SHOPPING STUNT, BRÁS
      </div>

      {/* HERO — estende atrás da FloatingNavbar transparente */}
      <section className="ls-hero">
        <div className="ls-hero-bg">
          <Image
            src="/images/cat-prod-blazer.jpg"
            alt="Coleção Masculina Life Style"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            priority
          />
          <div className="ls-hero-overlay" />
        </div>
        <div className="ls-hero-content">
          <p className="ls-eyebrow">Nova Coleção 2025</p>
          <h1 className="ls-hero-title">COLEÇÃO<br />ESSENCIAL</h1>
          <p className="ls-hero-sub">Peças de alta qualidade para o homem moderno. Atacado &amp; varejo no Brás.</p>
          <div className="ls-hero-ctas">
            <Link href="/catalogo" className="ls-btn-primary">Ver Catálogo</Link>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="ls-btn-outline">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="ls-section ls-section--light">
        <div className="ls-container">
          <div className="ls-section-header">
            <div>
              <p className="ls-eyebrow ls-eyebrow--dark">Seleção</p>
              <h2 className="ls-section-title">Peças em Destaque</h2>
            </div>
            <Link href="/catalogo" className="ls-link-arrow">Ver tudo <ChevronRight size={14} /></Link>
          </div>

          <div className="ls-products-grid">
            {(featured.length > 0 ? featured.slice(0, 3) : [
              { id: '1', title: 'Bermuda de Sarja', productType: 'Bermuda', vendor: 'Life Style', handle: 'bermuda-sarja', priceRange: { minVariantPrice: { amount: '85.00', currencyCode: 'BRL' } }, featuredImage: { url: '/images/cat-prod-bermuda.jpg' }, variants: { nodes: [{ id: 'v1', availableForSale: true, compareAtPrice: null }] } },
              { id: '2', title: 'Camisa Premium', productType: 'Camisa', vendor: 'Life Style', handle: 'camisa-premium', priceRange: { minVariantPrice: { amount: '110.00', currencyCode: 'BRL' } }, featuredImage: { url: '/images/cat-prod-camisa.jpg' }, variants: { nodes: [{ id: 'v2', availableForSale: true, compareAtPrice: null }] } },
              { id: '3', title: 'Blazer Slim', productType: 'Blazer', vendor: 'Life Style', handle: 'blazer-slim', priceRange: { minVariantPrice: { amount: '220.00', currencyCode: 'BRL' } }, featuredImage: { url: '/images/cat-prod-blazer.jpg' }, variants: { nodes: [{ id: 'v3', availableForSale: true, compareAtPrice: null }] } },
            ]).map((product) => {
              const price = product.priceRange.minVariantPrice;
              const compareAt = product.variants?.nodes?.[0]?.compareAtPrice;
              return (
                <Link key={product.id} href={`/catalogo/${product.handle}`} className="ls-product-card">
                  <div className="ls-product-img-wrap">
                    {product.featuredImage ? (
                      <Image src={product.featuredImage.url} alt={product.title} fill style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }} className="ls-product-img" />
                    ) : (
                      <div className="ls-product-placeholder"><span>LS</span></div>
                    )}
                    {compareAt && <span className="ls-badge">PROMOÇÃO</span>}
                  </div>
                  <div className="ls-product-info">
                    <p className="ls-product-type">{product.productType || product.vendor || 'Life Style'}</p>
                    <h3 className="ls-product-name">{product.title}</h3>
                    <div className="ls-product-price-row">
                      <div>
                        <span className="ls-price">{formatPrice(price.amount, price.currencyCode)}</span>
                        {compareAt && <span className="ls-price-old">{formatPrice(compareAt.amount, compareAt.currencyCode)}</span>}
                      </div>
                      <span className="ls-avail">{product.variants?.nodes?.[0]?.availableForSale ? 'DISPONÍVEL' : 'ESGOTADO'}</span>
                    </div>
                  </div>
                  <div className="ls-product-footer">
                    <button className="ls-btn-add" type="button">Adicionar ao carrinho</button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* BANNER ATACADO */}
      <section className="ls-banner">
        <p className="ls-eyebrow ls-eyebrow--gold">Atacado &amp; Varejo · Brás, São Paulo</p>
        <h2 className="ls-banner-title">A partir de 10 peças variadas no atacado</h2>
        <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="ls-btn-whatsapp">
          <MessageCircle size={18} /> Fale pelo WhatsApp
        </a>
      </section>

      {/* CATEGORIAS */}
      <section className="ls-section ls-section--light">
        <div className="ls-container">
          <div className="ls-section-header ls-section-header--center">
            <p className="ls-eyebrow ls-eyebrow--dark">Encontre o seu estilo</p>
            <h2 className="ls-section-title">Categorias</h2>
          </div>
          <div className="ls-cat-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} href={cat.href} className="ls-cat-card">
                {cat.img ? (
                  <Image src={cat.img} alt={cat.label} fill style={{ objectFit: 'cover', objectPosition: 'center top' }} className="ls-cat-img" />
                ) : null}
                <div className={`ls-cat-overlay${!cat.img ? ' ls-cat-overlay--solid' : ''}`}>
                  {!cat.img && <span className="ls-cat-icon">✦</span>}
                  <span className="ls-cat-label">{cat.label}</span>
                  <span className="ls-cat-sub">Ver coleção →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MAIS VENDIDOS */}
      {bestSelling.length > 0 && (
        <section className="ls-section ls-section--beige">
          <div className="ls-container">
            <div className="ls-section-header">
              <div>
                <p className="ls-eyebrow ls-eyebrow--dark">Mais Pedidos</p>
                <h2 className="ls-section-title">Mais Vendidos</h2>
              </div>
              <Link href="/catalogo" className="ls-link-arrow">Ver catálogo <ChevronRight size={14} /></Link>
            </div>
          </div>
          <div className="ls-scroll-row">
            {bestSelling.map((product) => {
              const price = product.priceRange.minVariantPrice;
              return (
                <Link key={product.id} href={`/catalogo/${product.handle}`} className="ls-scroll-card">
                  <div className="ls-scroll-img-wrap">
                    {product.featuredImage && (
                      <Image src={product.featuredImage.url} alt={product.title} fill style={{ objectFit: 'cover' }} />
                    )}
                  </div>
                  <div className="ls-scroll-info">
                    <p className="ls-product-type">{product.productType || 'Life Style'}</p>
                    <h3 className="ls-scroll-name">{product.title}</h3>
                    <span className="ls-price">{formatPrice(price.amount, price.currencyCode)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="ls-footer">
        <div className="ls-container">
          <div className="ls-footer-grid">
            <div>
              <p className="ls-footer-brand">Life Style</p>
              <p className="ls-footer-text">Moda masculina e feminina de alta qualidade. Atacado a partir de 10 peças.</p>
              <div className="ls-footer-social">
                <a href="https://www.instagram.com/lojadolifestyle" target="_blank" rel="noopener noreferrer" className="ls-social-link" aria-label="Instagram"><Instagram size={20} /></a>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="ls-social-link" aria-label="WhatsApp"><MessageCircle size={20} /></a>
                <a href="tel:+5511999999999" className="ls-social-link" aria-label="Telefone"><Phone size={20} /></a>
              </div>
            </div>
            <div>
              <p className="ls-footer-heading">Links</p>
              {[
                { label: 'Catálogo', href: '/catalogo' },
                { label: 'Novidades', href: '/catalogo?sort=NEW' },
                { label: 'Promoções', href: '/catalogo?sale=true' },
                { label: 'Experimentar IA', href: '/tryon' },
              ].map(({ label, href }) => (
                <div key={label} className="ls-footer-item"><Link href={href} className="ls-footer-link">{label}</Link></div>
              ))}
            </div>
            <div>
              <p className="ls-footer-heading">Informações</p>
              {['Sobre Nós', 'Política de Trocas', 'Atacado', 'Contato'].map((info) => (
                <div key={info} className="ls-footer-item"><a href="#" className="ls-footer-link">{info}</a></div>
              ))}
            </div>
            <div>
              <p className="ls-footer-heading">Onde Estamos</p>
              <p className="ls-footer-text">
                R. Conselheiro Belísário, 41<br />
                Loja ST1 061<br />
                Shopping Stunt<br />
                Brás, São Paulo – SP
              </p>
            </div>
          </div>
          <div className="ls-footer-bottom">
            <p>© 2025 Life Style. Todos os direitos reservados.</p>
            <p>Compra 100% segura · Atacado &amp; Varejo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
