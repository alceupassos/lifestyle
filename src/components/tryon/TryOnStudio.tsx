// ─────────────────────────────────────────────────────────────
// LIFE STYLE — TryOnStudio (Life Style 2.0 Style)
// ─────────────────────────────────────────────────────────────

'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  X,
  RefreshCw,
  Info
} from 'lucide-react';
import Image from 'next/image';
import { useTryOn } from '@/hooks/useTryOn';

interface Product {
  id: string;
  title: string;
  handle: string;
  price: string;
  imageUrl: string;
  category?: string;
}

interface TryOnStudioProps {
  products: Product[];
}

export function TryOnStudio({ products }: TryOnStudioProps) {
  const [userFile, setUserFile] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    status,
    resultImageUrl,
    modelPreviewUrl,
    error,
    progress,
    startTryOn,
    reset: resetTryOn,
    setModelPreviewUrl
  } = useTryOn({ 
    garmentImageUrl: selectedProduct?.imageUrl || '' 
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserFile(file);
      resetTryOn();
      
      // Create immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setModelPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = () => {
    if (!userFile || !selectedProduct) return;
    startTryOn(userFile);
  };

  const isProcessing = status === 'processing' || status === 'uploading';

  return (
    <div className="min-h-screen pt-4 pb-20 px-4 md:px-8" style={{ background: 'var(--ls-bg-cream)' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="ls-heading text-4xl md:text-5xl mb-2">IA STUDIO</h1>
            <p className="ls-muted max-w-md">
              Nossa Inteligência Artificial permite que você experimente qualquer peça instantaneamente com sua própria foto.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-black/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Servidor IA: Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Studio Area (Left/Center) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="relative aspect-[3/4] md:aspect-auto md:h-[700px] w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-black/5 flex items-center justify-center group">
              
              {!modelPreviewUrl && !resultImageUrl && !selectedProduct ? (
                <div className="flex flex-col items-center text-center p-12 max-w-sm">
                  {/* Silhouette Placeholder */}
                  <div className="mb-8 relative w-48 h-64 opacity-20 grayscale transition-all group-hover:opacity-30 group-hover:scale-105 duration-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-slate-800">
                      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
                      <path d="M18 21v-2a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v2" />
                    </svg>
                  </div>
                  <h3 className="ls-heading text-xl mb-4">COMECE AQUI</h3>
                  <p className="ls-muted text-sm mb-8">
                    Faça upload de uma foto sua (corpo inteiro ou meio corpo) para ver as peças em você.
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full animate-in fade-in duration-500">
                  <Image 
                    src={resultImageUrl || modelPreviewUrl || selectedProduct?.imageUrl || ''} 
                    alt="Preview" 
                    fill 
                    className={`object-cover ${isProcessing ? 'blur-md' : ''} transition-all duration-700`}
                    priority
                  />
                  
                  {/* Overlay for selected product if showing user photo but not result */}
                  {!resultImageUrl && modelPreviewUrl && selectedProduct && (
                    <div className="absolute bottom-4 right-4 w-24 h-32 border-2 border-white shadow-xl rounded-sm overflow-hidden z-20 animate-in slide-in-from-bottom-4 duration-500">
                      <Image 
                        src={selectedProduct.imageUrl} 
                        alt="Peça selecionada"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-500">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
                      </div>
                      <span className="text-white font-bold tracking-widest uppercase text-sm">{progress || 'IA Processando Look...'}</span>
                    </div>
                  )}

                  {!isProcessing && resultImageUrl && (
                    <div className="absolute top-6 left-6 animate-in slide-in-from-left duration-500">
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Look Gerado com IA</span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="absolute top-6 left-6 right-6 animate-in slide-in-from-top duration-500">
                      <div className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-2xl shadow-lg">
                        <X className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-bold uppercase">{error}</span>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => { setUserFile(null); setSelectedProduct(null); resetTryOn(); }}
                    className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Upload Overlay (Floating at bottom) */}
              {!isProcessing && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-black/5 flex gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2D5016] text-white rounded-2xl cursor-pointer hover:bg-[#1f380f] transition-all font-bold text-xs uppercase tracking-wider text-center">
                      <Upload className="w-4 h-4" />
                      Upload sua Foto
                      <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                    </label>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#C4622D] text-white rounded-2xl hover:bg-[#a65326] transition-all font-bold text-xs uppercase tracking-wider">
                      <Camera className="w-4 h-4" />
                      Use sua Câmera
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Instruction / Tips */}
            <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between text-slate-500 px-4">
              <div className="flex items-center gap-2 text-sm italic">
                <Info className="w-4 h-4" />
                Dica: Use fotos com fundo neutro e boa iluminação para melhores resultados.
              </div>
              <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Processamento Instantâneo</span>
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Life Style AI v2.4</span>
              </div>
            </div>
          </div>

          {/* Product Catalog (Right) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full lg:max-h-[700px]">
            <div className="mb-6 flex items-center justify-between px-2">
              <h2 className="ls-heading text-2xl uppercase">Catálogo IA</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{products.length} itens</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    className={`relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${selectedProduct?.id === product.id ? 'border-[#C4622D] shadow-lg scale-[1.02]' : 'border-transparent hover:border-slate-200'}`}
                    onClick={() => {
                      setSelectedProduct(product);
                      resetTryOn();
                    }}
                  >
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <Image 
                        src={product.imageUrl} 
                        alt={product.title} 
                        fill 
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                      {selectedProduct?.id === product.id && (
                        <div className="absolute top-2 right-2 bg-[#C4622D] text-white p-1 rounded-full animate-in zoom-in duration-300">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="ls-heading text-[10px] md:text-xs uppercase tracking-tight line-clamp-1 mb-1 text-slate-800">{product.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C4622D]">{product.price}</span>
                        <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">{product.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-black/5">
              <button
                disabled={!userFile || !selectedProduct || isProcessing}
                onClick={handleTryOn}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-xl
                  ${!userFile || !selectedProduct || isProcessing
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale' 
                    : 'bg-black text-white hover:bg-slate-900 active:scale-95 hover:shadow-2xl'
                  }`}
              >
                <Sparkles className={`w-5 h-5 ${!isProcessing && userFile && selectedProduct ? 'animate-pulse text-yellow-400' : ''}`} />
                {isProcessing ? 'Processando...' : 'Experimente Agora'}
              </button>
              {!userFile && (
                <p className="text-center text-[10px] uppercase font-bold tracking-wider text-[#C4622D] mt-3 animate-bounce">
                  ↑ Primeiro, envie sua foto
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
