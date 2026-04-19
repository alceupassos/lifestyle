// ─────────────────────────────────────────────────────────────
// LIFE STYLE — fashn.ai Client
// ─────────────────────────────────────────────────────────────

import type {
  FashnRunRequest,
  FashnRunResponse,
  FashnStatusResponse,
  FashnTryOnInput,
  FashnModelName,
} from '@/types';

const FASHN_BASE_URL = 'https://api.fashn.ai/v1';
const FASHN_API_KEY = process.env.FASHN_API_KEY!;

// ── Core API Functions ────────────────────────────────────────

/**
 * Submete um job para a fashn.ai
 * Retorna o prediction ID para polling
 */
export async function submitFashnJob(request: FashnRunRequest): Promise<FashnRunResponse> {
  const response = await fetch(`${FASHN_BASE_URL}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${FASHN_API_KEY}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error(`[fashn.ai] API Error (${response.status}):`, JSON.stringify(errorBody, null, 2));

    // Melhorar parse do erro da FastAPI (fashn) - pode vir como string, message, detail ou JSON.
    let errorDetail = errorBody.message || errorBody.error || errorBody.detail;
    if (typeof errorDetail === 'object') {
       errorDetail = JSON.stringify(errorDetail);
    }
    
    throw new Error(errorDetail || `fashn.ai error: ${response.status}`);
  }

  return response.json();
}

/**
 * Consulta o status de um job
 */
export async function getFashnJobStatus(predictionId: string): Promise<FashnStatusResponse> {
  const response = await fetch(`${FASHN_BASE_URL}/status/${predictionId}`, {
    headers: {
      Authorization: `Bearer ${FASHN_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Status check failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Consulta o saldo de créditos
 */
export async function getFashnCredits(): Promise<{ credits: number }> {
  const response = await fetch(`${FASHN_BASE_URL}/credits`, {
    headers: {
      Authorization: `Bearer ${FASHN_API_KEY}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch credits');
  return response.json();
}

// ── Polling helper ─────────────────────────────────────────────

/**
 * Poll até o job completar ou falhar
 * Máximo de 60 tentativas (2 min com intervalo de 2s)
 */
export async function pollFashnJob(
  predictionId: string,
  options: {
    interval?: number;
    maxAttempts?: number;
    onProgress?: (status: string) => void;
  } = {}
): Promise<FashnStatusResponse> {
  const { interval = 2000, maxAttempts = 60, onProgress } = options;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getFashnJobStatus(predictionId);

    onProgress?.(status.status);

    if (status.status === 'completed') return status;
    if (status.status === 'failed') {
      throw new Error(status.error || 'fashn.ai job failed');
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error('fashn.ai job timed out after 2 minutes');
}

// ── High-level helpers ─────────────────────────────────────────

/**
 * Virtual Try-On: coloca uma peça de roupa em uma foto de modelo
 */
export async function submitVirtualTryOn(input: FashnTryOnInput): Promise<string> {
  const job = await submitFashnJob({
    model_name: 'tryon-v1.6',
    inputs: {
      ...input,
      quality: input.quality || 'balanced',
      num_samples: 1,
    },
  });

  const result = await pollFashnJob(job.id);
  if (!result.output?.[0]) throw new Error('No output image returned');
  return result.output[0];
}

/**
 * Product to Model: transforma flat-lay em foto com modelo
 */
export async function submitProductToModel(
  productImageUrl: string,
  prompt?: string
): Promise<string> {
  const job = await submitFashnJob({
    model_name: 'product-to-model',
    inputs: {
      garment_image: productImageUrl,
      model_image: prompt || '',
    } as FashnTryOnInput,
  });

  const result = await pollFashnJob(job.id);
  if (!result.output?.[0]) throw new Error('No output image returned');
  return result.output[0];
}

/**
 * Background Remove: remove o fundo da imagem do produto
 */
export async function submitBackgroundRemove(imageUrl: string): Promise<string> {
  const job = await submitFashnJob({
    model_name: 'background-remove',
    inputs: { garment_image: imageUrl, model_image: '' } as FashnTryOnInput,
  });

  const result = await pollFashnJob(job.id);
  if (!result.output?.[0]) throw new Error('No output image returned');
  return result.output[0];
}

// ── Helpers de imagem ──────────────────────────────────────────

/**
 * Converte File para base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result); // Inclui prefixo data:image/...;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Valida se o arquivo é uma imagem suportada
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Formato não suportado. Use JPG, PNG ou WebP.' };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Imagem muito grande. Máximo 10MB.' };
  }

  return { valid: true };
}
