'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TryOnFAB() {
  const pathname = usePathname();
  
  // Don't show FAB on the try-on page itself
  if (pathname === '/tryon') return null;

  return (
    <Link
      href="/tryon"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 bg-[#C4622D] text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all group"
      style={{ boxShadow: '0 8px 32px rgba(196, 98, 45, 0.4)' }}
    >
      <Sparkles className="w-5 h-5 animate-pulse" />
      <span className="font-bold text-sm uppercase tracking-widest hidden md:block">
        Experimente com IA
      </span>
      <span className="font-bold text-xs uppercase tracking-widest md:hidden">
        IA
      </span>
    </Link>
  );
}
