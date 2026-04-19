// ─────────────────────────────────────────────────────────────
// LIFE STYLE — API Routes: /api/shopify/cart
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import {
  createCart,
  addToCart,
  updateCartLine,
  removeCartLine,
  getCart,
} from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get('cartId');

  if (!cartId) {
    return NextResponse.json({ error: 'cartId é obrigatório' }, { status: 400 });
  }

  try {
    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, cartId, variantId, lineId, quantity } = body;

    let cart;

    switch (action) {
      case 'create':
        cart = await createCart(variantId, quantity || 1);
        break;
      case 'add':
        cart = await addToCart(cartId, variantId, quantity || 1);
        break;
      case 'update':
        cart = await updateCartLine(cartId, lineId, quantity);
        break;
      case 'remove':
        cart = await removeCartLine(cartId, lineId);
        break;
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
