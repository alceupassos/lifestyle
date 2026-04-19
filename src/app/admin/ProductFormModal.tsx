'use client';

import { useState, useRef } from 'react';
import { X, Camera, Upload, Plus, Trash2, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { CATEGORIAS } from '@/hooks/useFilters';

interface Variant {
  size: string;
  quantity: number;
  price: string;
  sku: string;
}

const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

interface ProductFormData {
  title: string;
  productType: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  status: 'active' | 'draft';
  tags: string[];
  imageUrl?: string;
}

interface ProductFormModalProps {
  product: { title: string; productType: string; price: number; compareAtPrice?: number; status: 'active' | 'draft' | 'archived'; imageUrl?: string; tags: string[] } | null;
  onClose: () => void;
  onSave: (data: ProductFormData & { variants: Variant[] }) => void;
}

export function ProductFormModal({ product, onClose, onSave }: ProductFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: product?.title ?? '',
    productType: product?.productType ?? '',
    description: '',
    price: String(product?.price ?? ''),
    compareAtPrice: String(product?.compareAtPrice ?? ''),
    status: (product?.status === 'archived' ? 'draft' : product?.status) ?? 'draft' as 'active' | 'draft',
    genero: 'unissex' as 'masculino' | 'feminino' | 'unissex',
    tag: '',
    tags: product?.tags ?? [] as string[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl ?? null);
  const [dragActive, setDragActive] = useState(false);

  const [variants, setVariants] = useState<Variant[]>(
    SIZES.slice(0, 3).map((size) => ({ size, quantity: 0, price: String(product?.price ?? ''), sku: '' }))
  );

  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'media'>('basic');

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleImage(file);
  };

  const toggleSize = (size: string) => {
    setVariants((prev) => {
      const existing = prev.find((v) => v.size === size);
      if (existing) return prev.filter((v) => v.size !== size);
      return [...prev, { size, quantity: 0, price: form.price, sku: '' }].sort(
        (a, b) => SIZES.indexOf(a.size) - SIZES.indexOf(b.size)
      );
    });
  };

  const updateVariant = (size: string, field: keyof Variant, value: string | number) => {
    setVariants((prev) => prev.map((v) => (v.size === size ? { ...v, [field]: value } : v)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: form.title,
      productType: form.productType,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      status: form.status as 'active' | 'draft',
      tags: [...form.tags, form.genero],
      imageUrl: imagePreview ?? undefined,
      variants,
    });
  };

  const tabs = [
    { id: 'basic', label: 'Dados Básicos' },
    { id: 'variants', label: 'Tamanhos' },
    { id: 'media', label: 'Imagens' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl" style={{ fontFamily: 'var(--font-manrope)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-[#0F172A]" style={{ fontFamily: 'var(--font-syne)' }}>
            {product ? 'Editar Produto' : 'Cadastrar Produto'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px',
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">

            {/* BASIC */}
            {activeTab === 'basic' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nome do Produto *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="Ex: Blazer Estruturado Premium"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Categoria *</label>
                    <select
                      value={form.productType}
                      onChange={(e) => setForm({ ...form, productType: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 bg-white"
                    >
                      <option value="">Selecionar...</option>
                      {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Gênero</label>
                    <div className="flex gap-2">
                      {(['masculino', 'feminino', 'unissex'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setForm({ ...form, genero: g })}
                          className={clsx('flex-1 py-2 rounded-xl text-xs font-semibold border-[1.5px] capitalize transition-all', form.genero === g ? 'text-white border-transparent' : 'border-gray-200 text-gray-600 hover:border-purple-300')}
                          style={form.genero === g ? { background: 'var(--primary)' } : {}}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    placeholder="Descreva o produto..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Preço *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Preço Original (opcional)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                      <input
                        type="number"
                        value={form.compareAtPrice}
                        onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Status de Publicação</label>
                  <div className="flex gap-3">
                    {(['active', 'draft'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, status: s })}
                        className={clsx('flex-1 py-2.5 rounded-xl text-sm font-semibold border-[1.5px] transition-all', form.status === s ? 'text-white border-transparent' : 'border-gray-200 text-gray-600')}
                        style={form.status === s ? { background: s === 'active' ? '#22C55E' : '#64748B' } : {}}
                      >
                        {s === 'active' ? '✓ Ativo' : '○ Rascunho'}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* VARIANTS */}
            {activeTab === 'variants' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Tamanhos Disponíveis</label>
                  <div className="flex gap-2 flex-wrap mb-5">
                    {SIZES.map((size) => {
                      const active = variants.some((v) => v.size === size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={clsx('h-10 w-14 rounded-xl text-sm font-bold border-[1.5px] transition-all', active ? 'text-white border-transparent' : 'border-gray-200 text-gray-700 hover:border-purple-400')}
                          style={active ? { background: 'var(--primary)' } : {}}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {variants.length > 0 && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Tamanho</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Qtd Estoque</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Preço</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">SKU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map((v, i) => (
                            <tr key={v.size} className={i < variants.length - 1 ? 'border-b border-gray-100' : ''}>
                              <td className="px-4 py-2.5">
                                <span className="font-bold text-purple-700 w-8 inline-block">{v.size}</span>
                              </td>
                              <td className="px-4 py-2.5">
                                <input
                                  type="number"
                                  min="0"
                                  value={v.quantity}
                                  onChange={(e) => updateVariant(v.size, 'quantity', Number(e.target.value))}
                                  className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                                />
                              </td>
                              <td className="px-4 py-2.5">
                                <div className="relative w-24">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">R$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={v.price}
                                    onChange={(e) => updateVariant(v.size, 'price', e.target.value)}
                                    className="w-full pl-7 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-2.5">
                                <input
                                  type="text"
                                  value={v.sku}
                                  onChange={(e) => updateVariant(v.size, 'sku', e.target.value)}
                                  placeholder="SKU-001"
                                  className="w-28 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {variants.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">Selecione os tamanhos disponíveis acima</p>
                  )}
                </div>
              </>
            )}

            {/* MEDIA */}
            {activeTab === 'media' && (
              <>
                {/* Image upload area */}
                <div
                  className={clsx(
                    'border-2 border-dashed rounded-2xl p-8 transition-all text-center',
                    dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  )}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="relative inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-40 h-52 object-cover rounded-xl shadow-md" />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary-10)' }}>
                        <Upload size={24} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0F172A] mb-1">Arraste a imagem aqui</p>
                        <p className="text-sm text-gray-400">ou use os botões abaixo</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-[1.5px] text-sm font-semibold transition-all hover:border-purple-400"
                    style={{ borderColor: 'var(--ls-border)', color: 'var(--ls-text)' }}
                  >
                    <Upload size={16} style={{ color: 'var(--primary)' }} />
                    Escolher Arquivo
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: 'var(--accent-orange)' }}
                  >
                    <Camera size={16} />
                    Usar Câmera
                  </button>
                </div>

                {/* Hidden inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }}
                />

                <p className="text-xs text-gray-400 text-center">
                  Suporta JPG, PNG, WEBP. Máx 8 imagens.
                </p>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all">
              Cancelar
            </button>
            <div className="flex gap-3">
              <button
                type="submit"
                onClick={() => setForm({ ...form, status: 'draft' })}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border-[1.5px] border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
              >
                Salvar Rascunho
              </button>
              <button
                type="submit"
                onClick={() => setForm({ ...form, status: 'active' })}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'var(--primary)' }}
              >
                Publicar no Shopify
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
