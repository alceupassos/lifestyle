// ─────────────────────────────────────────────────────────────
// LIFE STYLE — API Route: GET /api/tryon/status?id=xxx
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { getFashnJobStatus } from '@/lib/fashn';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const status = await getFashnJobStatus(id);
    return NextResponse.json(status);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
