'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TryOnFAB() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 1s delay on every page except /tryon
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Hide on tryon page itself and admin
  if (pathname.startsWith('/tryon') || pathname.startsWith('/admin')) return null;

  return (
    <Link
      href="/tryon"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full text-white text-sm font-bold shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #9333EA 100%)',
        fontFamily: 'var(--font-manrope)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        boxShadow: '0 8px 32px rgba(107, 33, 168, 0.4)',
      }}>
      <Sparkles size={16} />
      Experimentar
    </Link>
  );
}
