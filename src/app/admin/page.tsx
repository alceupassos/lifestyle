'use client';

import { useState } from 'react';
import {
  Plus, Search, Edit, Trash2, Package, BarChart2,
  Camera, Upload, ArrowUpDown, CheckCircle, XCircle,
  Eye, RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import { ProductFormModal } from './ProductFormModal';

// ── Types ────────────────────────────────────────────────────

interface AdminProduct {
  id: string;
  handle: string;
  title: string;
  productType: string;
  description?: string;
  status: 'active' | 'draft' | 'archived';
  price: number;
  compareAtPrice?: number;
  inventory: number;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
}

// ── Mock Data ────────────────────────────────────────────────

const MOCK_ADMIN_PRODUCTS: AdminProduct[] = [
  { id: '1', handle: 'blazer-estruturado', title: 'Blazer Estruturado Premium', productType: 'Blazer', status: 'active', price: 489, inventory: 23, imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=80&q=80', tags: ['masculino', 'novidade'], createdAt: '2025-04-15' },
  { id: '2', handle: 'camiseta-premium', title: 'Camiseta Básica Premium', productType: 'Camiseta', status: 'active', price: 89, compareAtPrice: 129, inventory: 87, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&q=80', tags: ['unissex'], createdAt: '2025-04-12' },
  { id: '3', handle: 'calca-jeans-slim', title: 'Calça Jeans Slim Fit', productType: 'Calça', status: 'draft', price: 219, inventory: 0, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&q=80', tags: ['masculino'], createdAt: '2025-04-10' },
  { id: '4', handle: 'vestido-floral', title: 'Vestido Floral Verão', productType: 'Vestido', status: 'active', price: 199, inventory: 14, imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=80&q=80', tags: ['feminino', 'novidade'], createdAt: '2025-04-08' },
  { id: '5', handle: 'moletom-oversized', title: 'Moletom Oversized Lifestyle', productType: 'Moletom', status: 'active', price: 159, compareAtPrice: 199, inventory: 31, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&q=80', tags: ['unissex'], createdAt: '2025-04-05' },
];

// ── Stats Card ────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-start gap-4" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-0.5" style={{ fontFamily: 'var(--font-manrope)' }}>{label}</p>
        <p className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-syne)' }}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'var(--font-manrope)' }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────

export default function AdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>(MOCK_ADMIN_PRODUCTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.productType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalActive = products.filter((p) => p.status === 'active').length;
  const totalInventory = products.reduce((sum, p) => sum + p.inventory, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.inventory, 0);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que quer excluir este produto?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'draft' : 'active' } : p
      )
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--ls-bg-2)' }}>
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-100 sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-syne)' }}>
              Gerenciar Produtos
            </h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-manrope)' }}>
              Sincronizado com Shopify
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all" style={{ fontFamily: 'var(--font-manrope)' }}>
              <RefreshCw size={15} />
              Sincronizar
            </button>
            <button
              onClick={() => { setEditProduct(null); setShowModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--primary)', fontFamily: 'var(--font-manrope)' }}
            >
              <Plus size={16} />
              Novo Produto
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Package} label="Produtos Ativos" value={totalActive} sub="no Shopify" color="var(--primary)" />
          <StatCard icon={BarChart2} label="Estoque Total" value={totalInventory} sub="unidades" color="var(--accent-orange)" />
          <StatCard icon={CheckCircle} label="Valor em Estoque" value={`R$ ${(totalValue / 1000).toFixed(1)}k`} color="#22C55E" />
          <StatCard icon={Upload} label="Rascunhos" value={products.filter((p) => p.status === 'draft').length} sub="aguardando publicação" color="#94A3B8" />
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-2xl p-4 mb-4 flex flex-col sm:flex-row gap-3" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
              style={{ fontFamily: 'var(--font-manrope)' }}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'draft'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  statusFilter === s ? 'text-white' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                )}
                style={statusFilter === s ? { background: 'var(--primary)', fontFamily: 'var(--font-manrope)' } : { fontFamily: 'var(--font-manrope)' }}
              >
                {s === 'all' ? 'Todos' : s === 'active' ? 'Ativos' : 'Rascunhos'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-manrope)' }}>
                    Produto
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Categoria
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Estoque
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <tr
                    key={product.id}
                    className={clsx('transition-colors hover:bg-gray-50', i < filtered.length - 1 && 'border-b border-gray-100')}
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">👗</div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0F172A] line-clamp-1" style={{ fontFamily: 'var(--font-manrope)' }}>
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-manrope)' }}>
                            {product.tags.join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ background: 'var(--primary-10)', color: 'var(--primary)', fontFamily: 'var(--font-manrope)' }}>
                        {product.productType}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-[#0F172A]" style={{ fontFamily: 'var(--font-manrope)' }}>
                          R$ {product.price}
                        </p>
                        {product.compareAtPrice && (
                          <p className="text-xs text-gray-400 line-through" style={{ fontFamily: 'var(--font-manrope)' }}>
                            R$ {product.compareAtPrice}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Inventory */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={clsx('px-2 py-1 rounded-lg text-xs font-semibold', product.inventory === 0 ? 'bg-red-50 text-red-600' : product.inventory < 10 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600')}
                        style={{ fontFamily: 'var(--font-manrope)' }}
                      >
                        {product.inventory} un
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={clsx(
                          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all',
                          product.status === 'active' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        )}
                        style={{ fontFamily: 'var(--font-manrope)' }}
                      >
                        {product.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {product.status === 'active' ? 'Ativo' : 'Rascunho'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/catalogo/${product.handle}`}
                          target="_blank"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                        >
                          <Eye size={15} />
                        </a>
                        <button
                          onClick={() => { setEditProduct(product); setShowModal(true); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <span className="text-4xl">📦</span>
                <p className="mt-4 text-gray-500 font-medium" style={{ fontFamily: 'var(--font-manrope)' }}>
                  Nenhum produto encontrado
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductFormModal
          product={editProduct}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (editProduct) {
              setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? { ...p, ...data } as AdminProduct : p)));
            } else {
              const inv = data.variants ? data.variants.reduce((s, v) => s + (v.quantity ?? 0), 0) : 0;
              const newProd: AdminProduct = {
                ...data,
                id: Date.now().toString(),
                handle: data.title.toLowerCase().replace(/\s+/g, '-'),
                createdAt: new Date().toISOString().split('T')[0],
                tags: data.tags || [],
                inventory: inv,
                status: data.status as 'active' | 'draft',
              };
              setProducts((prev) => [newProd, ...prev]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
