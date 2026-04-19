// ─────────────────────────────────────────────────────────────
// LIFE STYLE — useTryOn Hook
// ─────────────────────────────────────────────────────────────

'use client';

import { useState, useCallback } from 'react';
import { validateImageFile } from '@/lib/fashn';
import { compressImageFile } from '@/lib/imageUtils';
import type { TryOnStatus } from '@/types';

interface UseTryOnOptions {
  garmentImageUrl: string;
}

interface UseTryOnReturn {
  status: TryOnStatus;
  resultImageUrl: string | null;
  modelPreviewUrl: string | null;
  error: string | null;
  progress: string;
  startTryOn: (modelFile: File) => Promise<void>;
  reset: () => void;
}

const PROGRESS_MESSAGES: Record<string, string> = {
  uploading: 'Preparando sua foto...',
  starting: 'Iniciando análise de IA...',
  processing: 'Aplicando a peça em você...',
  completed: 'Pronto! Confira o resultado.',
  error: 'Ocorreu um erro.',
};

export function useTryOn({ garmentImageUrl }: UseTryOnOptions): UseTryOnReturn {
  const [status, setStatus] = useState<TryOnStatus>('idle');
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [modelPreviewUrl, setModelPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');

  const startTryOn = useCallback(
    async (modelFile: File) => {
      setError(null);
      setResultImageUrl(null);

      const validation = validateImageFile(modelFile);
      if (!validation.valid) {
        setError(validation.error || 'Arquivo inválido');
        return;
      }

      try {
        setStatus('uploading');
        setProgress(PROGRESS_MESSAGES.uploading);

        const base64 = await compressImageFile(modelFile, 1024);
        setModelPreviewUrl(base64);

        setStatus('processing');
        setProgress(PROGRESS_MESSAGES.starting);

        const submitResponse = await fetch('/api/tryon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modelImage: base64,
            garmentImage: garmentImageUrl
          }),
        });

        if (!submitResponse.ok) {
          const err = await submitResponse.json();
          throw new Error(err.error || 'Falha ao iniciar try-on');
        }

        const { predictionId } = await submitResponse.json();

        // Poll for result (inlined to satisfy exhaustive-deps)
        const MAX_POLLS = 40;
        const POLL_INTERVAL = 2000;
        for (let i = 0; i < MAX_POLLS; i++) {
          await new Promise((r) => setTimeout(r, POLL_INTERVAL));
          const statusResponse = await fetch(`/api/tryon/status?id=${predictionId}`);
          if (!statusResponse.ok) throw new Error('Falha ao verificar status');
          const data = await statusResponse.json();
          if (data.status === 'processing') {
            setProgress(PROGRESS_MESSAGES.processing);
          } else if (data.status === 'completed' && data.output?.[0]) {
            setResultImageUrl(data.output[0]);
            setStatus('completed');
            setProgress(PROGRESS_MESSAGES.completed);
            return;
          } else if (data.status === 'failed') {
            throw new Error(data.error || 'Try-on falhou');
          }
        }
        throw new Error('Tempo esgotado. Tente novamente.');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        setStatus('error');
        setProgress(PROGRESS_MESSAGES.error);
      }
    },
    [garmentImageUrl]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setResultImageUrl(null);
    setModelPreviewUrl(null);
    setError(null);
    setProgress('');
  }, []);

  return {
    status,
    resultImageUrl,
    modelPreviewUrl,
    error,
    progress,
    startTryOn,
    reset,
  };
}
