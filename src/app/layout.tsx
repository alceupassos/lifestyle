// ─────────────────────────────────────────────────────────────
// LIFE STYLE 2.0 — Root Layout
// ─────────────────────────────────────────────────────────────

import type { Metadata, Viewport } from 'next';
import { Syne, Manrope } from 'next/font/google';
import './globals.css';
import { FloatingNavbar } from '@/components/layout/FloatingNavbar';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { Toaster } from '@/components/ui/Toaster';
import { TryOnFAB } from '@/components/tryon/TryOnFAB';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'LIFE STYLE no BRÁS — Moda com IA',
    template: '%s | LIFE STYLE no BRÁS',
  },
  description:
    'Moda do Brás com Inteligência Artificial. Provador Virtual, catálogo completo e o melhor do LIFE STYLE no BRÁS.',
  keywords: ['moda', 'roupas', 'provador virtual', 'IA', 'fashion', 'lifestyle', 'brás'],
  openGraph: {
    title: 'LIFE STYLE no BRÁS',
    description: 'Explore nossa coleção completa de moda com provador virtual por IA.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export const viewport: Viewport = {
  themeColor: '#7c3bed',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${syne.variable} ${manrope.variable}`}
    >
      <body className="bg-[#FAFAFA] text-[#0F172A] antialiased" style={{ fontFamily: 'var(--font-manrope), sans-serif' }}>
        <FloatingNavbar />
        <main className="min-h-screen pt-[72px]">{children}</main>
        <CartDrawer />
        <TryOnFAB />
        <Toaster />
      </body>
    </html>
  );
}
