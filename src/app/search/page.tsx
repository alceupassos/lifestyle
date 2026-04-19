'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    startTransition(() => {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    });
  };

  const suggestions = [
    'Vestidos', 'Camisetas', 'Calças', 'Blazers',
    'Saias', 'Jaquetas', 'Acessórios', 'Novidades'
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
      <p className="section-label mb-6">Buscar</p>
      <h1 className="font-display text-5xl text-charcoal-900 mb-12 text-center">
        O que você procura?
      </h1>

      <form onSubmit={handleSearch} className="w-full max-w-2xl">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-charcoal-600 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Vestido, blazer, calça..."
            className="input-field pl-12 pr-14 py-5 text-lg border border-black/12"
            style={{ borderRadius: '2px' }}
            autoFocus
          />
          <button
            type="submit"
            disabled={!query.trim() || isPending}
            className="absolute right-2 btn-primary py-2.5 px-4 text-xs"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      <div className="mt-12">
        <p className="section-label text-center mb-5">Sugestões</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-lg">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => router.push(`/shop?q=${encodeURIComponent(s)}`)}
              className="px-4 py-2 font-body text-sm bg-cream-100 text-charcoal-700 hover:bg-charcoal-900 hover:text-cream-50 transition-all duration-200 border border-black/8"
              style={{ borderRadius: '2px' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
