'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Sparkles } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, openCart } = useCartStore();
  const itemCount = cart?.totalQuantity || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/catalogo?sort=CREATED_AT_DESC', label: 'Novidades' },
    { href: '/catalogo?sort=PRICE_ASC', label: 'Promoções' },
    { href: '/tryon', label: 'Experimentar ✦' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-black/5'
            : 'bg-transparent'
        )}
        style={{ height: 'var(--nav-h)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles
              size={18}
              className="text-gold-400 transition-transform group-hover:rotate-12 duration-300"
            />
            <span className="font-display text-xl tracking-tight text-charcoal-900">
              LIFE STYLE no BRÁS
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'font-body text-sm text-charcoal-700 hover:text-charcoal-900 transition-colors relative group',
                  label.includes('✦') && 'text-gold-500 hover:text-gold-400'
                )}
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-charcoal-900 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="w-10 h-10 flex items-center justify-center text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200 transition-all rounded-sm"
            >
              <Search size={18} />
            </Link>

            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200 transition-all rounded-sm"
              aria-label="Carrinho"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-mono font-medium text-cream-50 rounded-full"
                  style={{ background: 'var(--gold-400)' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-charcoal-700 hover:text-charcoal-900 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-cream-50 flex flex-col pt-[72px] transition-all duration-400 md:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col p-8 gap-2">
          {navLinks.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-3xl text-charcoal-900 py-3 border-b border-black/8 hover:text-gold-400 transition-colors"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-8 mt-auto">
          <p className="section-label">Provador Virtual por fashn.ai</p>
        </div>
      </div>
    </>
  );
}
