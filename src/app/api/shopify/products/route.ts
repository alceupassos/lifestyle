import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/shopify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const first = parseInt(searchParams.get('first') ?? '50', 10);
  const sortBy = (searchParams.get('sortBy') ?? 'RELEVANCE') as
    | 'RELEVANCE'
    | 'PRICE_ASC'
    | 'PRICE_DESC'
    | 'CREATED_AT_DESC'
    | 'BEST_SELLING';

  try {
    const products = await getProducts({ first, sortBy });
    return NextResponse.json({ products });
  } catch (err) {
    console.error('[API /shopify/products]', err);
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}
