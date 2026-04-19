'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Sparkles } from 'lucide-react';
import { useCartStore } from '@/hooks/useCartStore';
import { clsx } from 'clsx';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/tryon', label: 'Provador IA' },
  { href: '/shop', label: 'Loja' },
];

export function FloatingNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, openCart } = useCartStore();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'py-2 backdrop-blur-xl bg-white/80 border-b border-white/50 shadow-sm'
            : 'py-3 bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--ls-text)' }}
            >
              LIFE STYLE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-white'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-gray-100'
                )}
                style={
                  pathname === link.href
                    ? { background: 'var(--primary)', fontFamily: 'var(--font-manrope)' }
                    : { fontFamily: 'var(--font-manrope)' }
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link
              href="/search"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-gray-100 transition-all"
            >
              <Search size={20} />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-gray-100 transition-all"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ background: 'var(--accent-orange)', fontFamily: 'var(--font-manrope)' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Admin */}
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--accent-orange)', fontFamily: 'var(--font-manrope)' }}
            >
              Admin
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#475569] hover:bg-gray-100 transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-[72px]"
          style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)' }}
        >
          <div className="px-6 py-6 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'flex items-center px-5 py-4 rounded-xl text-base font-semibold transition-all',
                  pathname === link.href
                    ? 'text-white'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-gray-100'
                )}
                style={
                  pathname === link.href
                    ? { background: 'var(--primary)', fontFamily: 'var(--font-manrope)' }
                    : { fontFamily: 'var(--font-manrope)' }
                }
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="flex items-center px-5 py-4 rounded-xl text-base font-semibold text-white mt-2"
              style={{ background: 'var(--accent-orange)', fontFamily: 'var(--font-manrope)' }}
            >
              Área Admin
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
