'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import {
  X, Camera, Upload, Sparkles, RefreshCw,
  Download, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { useTryOn } from '@/hooks/useTryOn';
import { cn } from '@/lib/utils';

interface TryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  garmentImageUrl: string;
  garmentName: string;
}

export function TryOnModal({
  isOpen, onClose, garmentImageUrl, garmentName
}: TryOnModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { status, resultImageUrl, modelPreviewUrl, error, progress, startTryOn, reset } = useTryOn({
    garmentImageUrl,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleStart = () => {
    if (selectedFile) startTryOn(selectedFile);
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
  };

  const handleDownload = () => {
    if (!resultImageUrl) return;
    const a = document.createElement('a');
    a.href = resultImageUrl;
    a.download = `lifestyle-tryon-${Date.now()}.png`;
    a.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl bg-cream-50 shadow-lg overflow-hidden"
        style={{ borderRadius: '2px', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{ background: 'var(--gold-400)', borderRadius: '2px' }}
            >
              <Camera size={16} className="text-charcoal-900" />
            </div>
            <div>
              <h2 className="font-display text-lg text-charcoal-900">Provador Virtual</h2>
              <p className="font-mono text-xs text-charcoal-600 truncate max-w-[200px]">
                {garmentName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200 transition-all rounded-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT: Garment preview */}
            <div>
              <p className="section-label mb-3">Peça selecionada</p>
              <div className="relative aspect-portrait bg-cream-200 overflow-hidden" style={{ borderRadius: '2px' }}>
                {garmentImageUrl && (
                  <Image src={garmentImageUrl} alt={garmentName} fill className="object-cover" />
                )}
                <div className="absolute top-3 left-3">
                  <span className="badge badge-featured">
                    <Sparkles size={10} className="mr-1" />
                    Try-On
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Upload + Result */}
            <div className="flex flex-col gap-4">
              <p className="section-label">Sua foto</p>

              {/* Result panel */}
              {status === 'completed' && resultImageUrl ? (
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-portrait bg-cream-200 overflow-hidden tryon-glow" style={{ borderRadius: '2px' }}>
                    <Image src={resultImageUrl} alt="Try-on resultado" fill className="object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="badge" style={{ background: 'var(--sage-400)', color: 'white' }}>
                        <CheckCircle2 size={10} className="mr-1" />
                        Resultado
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleDownload} className="btn-outline flex-1 text-xs py-2.5 px-4">
                      <Download size={14} />
                      Baixar
                    </button>
                    <button onClick={handleReset} className="btn-primary flex-1 text-xs py-2.5 px-4">
                      <RefreshCw size={14} />
                      Nova foto
                    </button>
                  </div>
                </div>
              ) : status === 'processing' || status === 'uploading' ? (
                /* Processing state */
                <div className="aspect-portrait bg-cream-200 flex flex-col items-center justify-center gap-4" style={{ borderRadius: '2px' }}>
                  <div className="relative">
                    <div className="tryon-spinner" />
                    <Sparkles size={20} className="absolute inset-0 m-auto text-gold-400" />
                  </div>
                  <div className="text-center px-6">
                    <p className="font-body text-sm font-medium text-charcoal-900 mb-1">{progress}</p>
                    <p className="font-mono text-xs text-charcoal-600">fashn.ai · tryon-v1.6</p>
                  </div>
                  <div className="w-32 h-1 bg-cream-300 rounded-full overflow-hidden">
                    <div className="shimmer h-full rounded-full" style={{ background: 'linear-gradient(90deg, var(--gold-400), var(--gold-500))' }} />
                  </div>
                </div>
              ) : (
                /* Upload state */
                <>
                  {selectedFile && modelPreviewUrl ? (
                    <div className="relative aspect-portrait bg-cream-200 overflow-hidden" style={{ borderRadius: '2px' }}>
                      <Image src={modelPreviewUrl} alt="Sua foto" fill className="object-cover" />
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="absolute top-2 right-2 w-7 h-7 bg-charcoal-900/70 flex items-center justify-center text-cream-50 rounded-sm"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      {...getRootProps()}
                      className={cn(
                        'aspect-portrait flex flex-col items-center justify-center gap-4 border-2 border-dashed cursor-pointer transition-all duration-200',
                        isDragActive
                          ? 'border-gold-400 bg-gold-300/10'
                          : 'border-charcoal-600/30 bg-cream-100 hover:border-charcoal-600/60 hover:bg-cream-200'
                      )}
                      style={{ borderRadius: '2px' }}
                    >
                      <input {...getInputProps()} />
                      <div
                        className="w-14 h-14 flex items-center justify-center"
                        style={{ background: 'rgba(212,168,67,0.15)', borderRadius: '2px' }}
                      >
                        <Upload size={24} className="text-gold-500" />
                      </div>
                      <div className="text-center px-4">
                        <p className="font-body text-sm font-medium text-charcoal-900 mb-1">
                          {isDragActive ? 'Solte a foto aqui' : 'Arraste ou clique para selecionar'}
                        </p>
                        <p className="font-mono text-xs text-charcoal-600">
                          JPG, PNG ou WebP · Máx. 10MB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="flex items-start gap-3 p-3 bg-terracotta-400/10 border border-terracotta-400/30" style={{ borderRadius: '2px' }}>
                      <AlertCircle size={16} className="text-terracotta-500 flex-shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-terracotta-600">{error}</p>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="bg-cream-100 p-4" style={{ borderRadius: '2px' }}>
                    <p className="section-label mb-2">Dicas para melhor resultado</p>
                    <ul className="space-y-1.5">
                      {[
                        'Use foto com boa iluminação',
                        'Corpo inteiro ou meio corpo (sem corte)',
                        'Posição ereta, de frente para a câmera',
                        'Roupa simples ou de cor neutra',
                      ].map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-xs text-charcoal-600">
                          <span className="text-gold-400 mt-0.5">·</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={handleStart}
                    disabled={!selectedFile || status !== 'idle'}
                    className={cn(
                      'btn-gold w-full',
                      (!selectedFile || status !== 'idle') && 'opacity-40 cursor-not-allowed pointer-events-none'
                    )}
                  >
                    <Sparkles size={16} />
                    Experimentar com IA
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 font-mono text-xs text-charcoal-600 text-center">
            Imagens processadas pela fashn.ai · Dados excluídos em 72h · Uso ético garantido
          </p>
        </div>
      </div>
    </div>
  );
}
