'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// ── Filter Types ─────────────────────────────────────────────

export const CATEGORIAS = [
  'Bermuda', 'Bermuda Jeans', 'Blazer', 'Blusa', 'Boné', 'Calça',
  'Camisa', 'Camiseta', 'Conjunto', 'Corta Vento', 'Cueca', 'Feminino',
  'Macacão', 'Moletom', 'Polo', 'Short', 'Saia', 'Vestido',
] as const;

export const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', 'XGG', 'P/M', 'G/GG'] as const;

export const CORES = [
  { name: 'Preto', value: 'preto', hex: '#0F0F0F' },
  { name: 'Branco', value: 'branco', hex: '#FFFFFF' },
  { name: 'Cinza', value: 'cinza', hex: '#9CA3AF' },
  { name: 'Azul', value: 'azul', hex: '#3B82F6' },
  { name: 'Azul Marinho', value: 'azul-marinho', hex: '#1E3A5F' },
  { name: 'Verde', value: 'verde', hex: '#22C55E' },
  { name: 'Vermelho', value: 'vermelho', hex: '#EF4444' },
  { name: 'Rosa', value: 'rosa', hex: '#EC4899' },
  { name: 'Amarelo', value: 'amarelo', hex: '#EAB308' },
  { name: 'Bege', value: 'bege', hex: '#D4B896' },
  { name: 'Marrom', value: 'marrom', hex: '#92400E' },
  { name: 'Roxo', value: 'roxo', hex: '#7C3AED' },
];

export interface Filters {
  categorias: string[];
  tamanhos: string[];
  cores: string[];
  precoMin: number;
  precoMax: number;
  novidades: boolean;
  promocao: boolean;
  genero: 'todos' | 'masculino' | 'feminino' | 'unissex';
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'newest';
}

const DEFAULT_FILTERS: Filters = {
  categorias: [],
  tamanhos: [],
  cores: [],
  precoMin: 0,
  precoMax: 2000,
  novidades: false,
  promocao: false,
  genero: 'todos',
  sortBy: 'relevance',
};

// ── Hook ─────────────────────────────────────────────────────

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL params
  const [filters, setFilters] = useState<Filters>(() => {
    const categorias = searchParams.get('categorias')?.split(',').filter(Boolean) ?? [];
    const tamanhos = searchParams.get('tamanhos')?.split(',').filter(Boolean) ?? [];
    const cores = searchParams.get('cores')?.split(',').filter(Boolean) ?? [];
    const precoMin = Number(searchParams.get('precoMin')) || 0;
    const precoMax = Number(searchParams.get('precoMax')) || 2000;
    const novidades = searchParams.get('novidades') === 'true';
    const promocao = searchParams.get('promocao') === 'true';
    const genero = (searchParams.get('genero') as Filters['genero']) ?? 'todos';
    const sortBy = (searchParams.get('sortBy') as Filters['sortBy']) ?? 'relevance';

    return { categorias, tamanhos, cores, precoMin, precoMax, novidades, promocao, genero, sortBy };
  });

  // Sync to URL
  const syncToURL = useCallback(
    (f: Filters) => {
      const params = new URLSearchParams();
      if (f.categorias.length) params.set('categorias', f.categorias.join(','));
      if (f.tamanhos.length) params.set('tamanhos', f.tamanhos.join(','));
      if (f.cores.length) params.set('cores', f.cores.join(','));
      if (f.precoMin > 0) params.set('precoMin', String(f.precoMin));
      if (f.precoMax < 2000) params.set('precoMax', String(f.precoMax));
      if (f.novidades) params.set('novidades', 'true');
      if (f.promocao) params.set('promocao', 'true');
      if (f.genero !== 'todos') params.set('genero', f.genero);
      if (f.sortBy !== 'relevance') params.set('sortBy', f.sortBy);

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const updateFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        syncToURL(next);
        return next;
      });
    },
    [syncToURL]
  );

  const toggleMulti = useCallback(
    (key: 'categorias' | 'tamanhos' | 'cores', value: string) => {
      setFilters((prev) => {
        const arr = prev[key] as string[];
        const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
        const updated = { ...prev, [key]: next };
        syncToURL(updated);
        return updated;
      });
    },
    [syncToURL]
  );

  const clearAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const activeCount = [
    filters.categorias.length,
    filters.tamanhos.length,
    filters.cores.length,
    filters.novidades ? 1 : 0,
    filters.promocao ? 1 : 0,
    filters.genero !== 'todos' ? 1 : 0,
    filters.precoMax < 2000 || filters.precoMin > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return { filters, updateFilter, toggleMulti, clearAll, activeCount };
}
