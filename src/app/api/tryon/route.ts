// ─────────────────────────────────────────────────────────────
// LIFE STYLE — API Route: POST /api/tryon
// Submete job para fashn.ai (server-side, protege API key)
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { submitFashnJob } from '@/lib/fashn';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modelImage, garmentImage } = body;

    if (!modelImage || !garmentImage) {
      return NextResponse.json(
        { error: 'modelImage e garmentImage são obrigatórios' },
        { status: 400 }
      );
    }

    if (!process.env.FASHN_API_KEY) {
      return NextResponse.json(
        { error: 'FASHN_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const job = await submitFashnJob({
      model_name: 'tryon-v1.6',
      inputs: {
        model_image: modelImage,
        garment_image: garmentImage,
        category: 'auto',
        num_samples: 1,
      },
    });

    return NextResponse.json({ predictionId: job.id, status: job.status });
  } catch (error) {
    console.error('[/api/tryon] Error:', error);
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
