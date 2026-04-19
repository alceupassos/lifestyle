'use client';

import { useState } from 'react';
import { ChevronDown, X, SlidersHorizontal, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { useFilters, CATEGORIAS, TAMANHOS, CORES } from '@/hooks/useFilters';
import * as Slider from '@radix-ui/react-slider';

interface FilterPanelProps {
  className?: string;
  onClose?: () => void;
  mobile?: boolean;
}

// ── Dropdown section ─────────────────────────────────────────

function FilterSection({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]" style={{ fontFamily: 'var(--font-manrope)' }}>
          {title}
          {count != null && count > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white" style={{ background: 'var(--primary)' }}>
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={clsx('text-gray-400 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// ── Main FilterPanel ──────────────────────────────────────────

export function FilterPanel({ className, onClose, mobile }: FilterPanelProps) {
  const { filters, toggleMulti, updateFilter, clearAll, activeCount } = useFilters();

  return (
    <aside
      className={clsx(
        'bg-white rounded-2xl overflow-hidden flex flex-col',
        !mobile && 'sticky top-[88px]',
        className
      )}
      style={{ boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} />
          <span className="font-bold text-sm text-[#0F172A]" style={{ fontFamily: 'var(--font-syne)' }}>
            Filtros
          </span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white" style={{ background: 'var(--primary)' }}>
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-medium text-gray-500 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              Limpar tudo
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
              <X size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="overflow-y-auto flex-1">

        {/* Gênero */}
        <FilterSection title="Gênero" defaultOpen count={filters.genero !== 'todos' ? 1 : 0}>
          <div className="flex gap-2 flex-wrap">
            {(['todos', 'feminino', 'masculino', 'unissex'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => updateFilter('genero', g)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-xs font-semibold border-[1.5px] transition-all capitalize',
                  filters.genero === g
                    ? 'text-white border-transparent'
                    : 'text-gray-500 border-gray-200 hover:border-purple-400'
                )}
                style={filters.genero === g ? { background: 'var(--primary)', borderColor: 'var(--primary)', fontFamily: 'var(--font-manrope)' } : { fontFamily: 'var(--font-manrope)' }}
              >
                {g === 'todos' ? 'Todos' : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Categorias */}
        <FilterSection title="Categorias" count={filters.categorias.length} defaultOpen>
          <div className="grid grid-cols-2 gap-1">
            {CATEGORIAS.map((cat) => {
              const active = filters.categorias.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleMulti('categorias', cat)}
                  className={clsx(
                    'flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-left transition-all',
                    active ? 'font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  )}
                  style={active ? { color: 'var(--primary)', background: 'var(--primary-10)', fontFamily: 'var(--font-manrope)' } : { fontFamily: 'var(--font-manrope)' }}
                >
                  <span
                    className={clsx(
                      'w-4 h-4 rounded flex items-center justify-center border flex-shrink-0',
                      active ? 'border-transparent' : 'border-gray-300'
                    )}
                    style={active ? { background: 'var(--primary)' } : {}}
                  >
                    {active && <Check size={10} className="text-white" strokeWidth={3} />}
                  </span>
                  {cat}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Tamanhos */}
        <FilterSection title="Tamanhos" count={filters.tamanhos.length}>
          <div className="flex flex-wrap gap-2">
            {TAMANHOS.map((tam) => {
              const active = filters.tamanhos.includes(tam);
              return (
                <button
                  key={tam}
                  type="button"
                  onClick={() => toggleMulti('tamanhos', tam)}
                  className={clsx(
                    'h-9 px-3 rounded-lg text-xs font-bold border-[1.5px] transition-all',
                    active ? 'text-white border-transparent' : 'border-gray-200 text-gray-700 hover:border-purple-400'
                  )}
                  style={active ? { background: 'var(--primary)', fontFamily: 'var(--font-manrope)' } : { fontFamily: 'var(--font-manrope)' }}
                >
                  {tam}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Cores */}
        <FilterSection title="Cores" count={filters.cores.length}>
          <div className="flex flex-wrap gap-2">
            {CORES.map((cor) => {
              const active = filters.cores.includes(cor.value);
              return (
                <button
                  key={cor.value}
                  type="button"
                  onClick={() => toggleMulti('cores', cor.value)}
                  title={cor.name}
                  className={clsx(
                    'flex flex-col items-center gap-1 group',
                  )}
                >
                  <span
                    className={clsx(
                      'w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center',
                      active ? 'scale-110' : 'border-gray-200 hover:scale-105',
                      cor.value === 'branco' && 'border-gray-300'
                    )}
                    style={active ? { borderColor: 'var(--primary)', background: cor.hex } : { background: cor.hex }}
                  >
                    {active && <Check size={10} className={cor.value === 'branco' ? 'text-gray-700' : 'text-white'} strokeWidth={3} />}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-none" style={{ fontFamily: 'var(--font-manrope)' }}>
                    {cor.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Preço */}
        <FilterSection title="Preço" count={filters.precoMax < 2000 || filters.precoMin > 0 ? 1 : 0}>
          <div className="px-1">
            <div className="flex justify-between text-xs text-gray-500 mb-3" style={{ fontFamily: 'var(--font-manrope)' }}>
              <span>R$ {filters.precoMin.toLocaleString('pt-BR')}</span>
              <span>R$ {filters.precoMax.toLocaleString('pt-BR')}</span>
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[filters.precoMin, filters.precoMax]}
              min={0}
              max={2000}
              step={50}
              onValueChange={([min, max]) => {
                updateFilter('precoMin', min);
                updateFilter('precoMax', max);
              }}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-1.5">
                <Slider.Range
                  className="absolute rounded-full h-full"
                  style={{ background: 'var(--primary)' }}
                />
              </Slider.Track>
              {[0, 1].map((i) => (
                <Slider.Thumb
                  key={i}
                  className="block w-4 h-4 rounded-full shadow-md focus:outline-none cursor-grab active:cursor-grabbing"
                  style={{ background: 'var(--primary)', border: '2px solid white' }}
                />
              ))}
            </Slider.Root>
          </div>
        </FilterSection>

        {/* Toggles */}
        <FilterSection title="Destaques">
          <div className="flex flex-col gap-3">
            {[
              { key: 'novidades' as const, label: 'Novidades', emoji: '✨' },
              { key: 'promocao' as const, label: 'Em Promoção', emoji: '🔥' },
            ].map(({ key, label, emoji }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 flex items-center gap-1.5" style={{ fontFamily: 'var(--font-manrope)' }}>
                  {emoji} {label}
                </span>
                <button
                  type="button"
                  onClick={() => updateFilter(key, !filters[key])}
                  className={clsx(
                    'relative w-10 h-5 rounded-full transition-all duration-200',
                    filters[key] ? 'bg-opacity-100' : 'bg-gray-200'
                  )}
                  style={filters[key] ? { background: 'var(--primary)' } : {}}
                >
                  <span
                    className={clsx(
                      'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                      filters[key] ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}
